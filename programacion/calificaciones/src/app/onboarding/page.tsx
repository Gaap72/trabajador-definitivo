'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { User, ShieldCheck, GraduationCap, Loader2, LogOut } from 'lucide-react'

const PROFESSOR_CODE = 'PROFESOR2026' // Código secreto para ser profesor

export default function OnboardingPage() {
  const [role, setRole] = useState<'TEACHER' | 'STUDENT' | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      // Si ya es profesor, lo mandamos directo. Si es alumno, le damos la opción de elegir (por si quiere ser profesor)
      if (profile?.role === 'TEACHER') {
        router.push('/teacher')
      } else {
        setLoading(false)
      }
    }
    checkRole()
  }, [])

  const handleComplete = async (selectedRole: 'TEACHER' | 'STUDENT') => {
    if (selectedRole === 'TEACHER' && code !== PROFESSOR_CODE) {
      setError('Código de profesor incorrecto')
      return
    }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: selectedRole })
      .eq('id', user?.id)

    if (updateError) {
      setError('Error al guardar el perfil')
      setSaving(false)
    } else {
      router.push(selectedRole === 'TEACHER' ? '/teacher' : '/student')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      <button 
        onClick={handleLogout}
        className="absolute top-8 right-8 flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold transition-all"
      >
        <LogOut className="h-5 w-5" /> SALIR
      </button>

      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">CONFIGURA TU CUENTA</h1>
          <p className="text-slate-500 font-medium">Selecciona tu identidad para continuar en el sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Opción Alumno */}
          <button
            onClick={() => setRole('STUDENT')}
            className={`p-8 rounded-[2rem] border-4 transition-all text-left group ${
              role === 'STUDENT' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 hover:border-slate-200'
            }`}
          >
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 inline-block">
              <User className={`h-8 w-8 ${role === 'STUDENT' ? 'text-indigo-600' : 'text-slate-400'}`} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Soy Alumno</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Podrás consultar tus calificaciones de cada bloque y tu registro de asistencia.
            </p>
          </button>

          {/* Opción Profesor */}
          <button
            onClick={() => setRole('TEACHER')}
            className={`p-8 rounded-[2rem] border-4 transition-all text-left group ${
              role === 'TEACHER' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50 hover:border-slate-200'
            }`}
          >
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 inline-block">
              <ShieldCheck className={`h-8 w-8 ${role === 'TEACHER' ? 'text-indigo-600' : 'text-slate-400'}`} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Soy Profesor</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Podrás registrar calificaciones, pasar asistencia y gestionar a tus estudiantes.
            </p>
          </button>
        </div>

        {role === 'TEACHER' && (
          <div className="mt-10 p-8 bg-slate-50 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Código de Autorización</label>
            <input
              type="password"
              placeholder="Introduce el código secreto..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-colors"
            />
          </div>
        )}

        {error && <p className="mt-6 text-center text-red-500 font-bold bg-red-50 py-3 rounded-2xl">{error}</p>}

        {role && (
          <button
            onClick={() => handleComplete(role)}
            disabled={saving}
            className="w-full mt-10 bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <GraduationCap className="h-6 w-6" />}
            CONFIRMAR IDENTIDAD
          </button>
        )}
      </div>
    </div>
  )
}
