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
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 border border-zinc-800">
      <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-900 border border-zinc-800 flex items-center justify-center p-4 relative">
      <button 
        onClick={handleLogout}
        className="absolute top-8 right-8 flex items-center gap-2 text-zinc-500 hover:text-red-500 font-bold transition-all"
      >
        <LogOut className="h-5 w-5" /> SALIR
      </button>

      <div className="max-w-2xl w-full bg-zinc-950 border border-cyan-900/50 rounded-none shadow-[0_0_20px_rgba(6,182,212,0.2)] p-10 border border-cyan-900/30">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-cyan-50 tracking-[0.2em] mb-3">CONFIGURA TU CUENTA</h1>
          <p className="text-zinc-400 font-medium">Selecciona tu identidad para continuar en el sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Opción Alumno */}
          <button
            onClick={() => setRole('STUDENT')}
            className={`p-8 rounded-none border-4 transition-all text-left group ${
              role === 'STUDENT' ? 'border-rose-600 bg-cyan-950/50' : 'border-slate-50 hover:border-cyan-900/50'
            }`}
          >
            <div className="bg-zinc-950 border border-cyan-900/50 p-4 rounded-none shadow-none mb-6 inline-block">
              <User className={`h-8 w-8 ${role === 'STUDENT' ? 'text-cyan-400' : 'text-zinc-500'}`} />
            </div>
            <h3 className="text-2xl font-black text-cyan-50 mb-2">Soy Alumno</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
              Podrás consultar tus calificaciones de cada bloque y tu registro de asistencia.
            </p>
          </button>

          {/* Opción Profesor */}
          <button
            onClick={() => setRole('TEACHER')}
            className={`p-8 rounded-none border-4 transition-all text-left group ${
              role === 'TEACHER' ? 'border-rose-600 bg-cyan-950/50' : 'border-slate-50 hover:border-cyan-900/50'
            }`}
          >
            <div className="bg-zinc-950 border border-cyan-900/50 p-4 rounded-none shadow-none mb-6 inline-block">
              <ShieldCheck className={`h-8 w-8 ${role === 'TEACHER' ? 'text-cyan-400' : 'text-zinc-500'}`} />
            </div>
            <h3 className="text-2xl font-black text-cyan-50 mb-2">Soy Profesor</h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed">
              Podrás registrar calificaciones, pasar asistencia y gestionar a tus estudiantes.
            </p>
          </button>
        </div>

        {role === 'TEACHER' && (
          <div className="mt-10 p-8 bg-zinc-900 border border-zinc-800 rounded-none animate-in fade-in slide-in-from-top-4 duration-500">
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-3 px-1">Código de Autorización</label>
            <input
              type="password"
              placeholder="Introduce el código secreto..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-4 rounded-none border-2 border-cyan-900/50 focus:border-cyan-400 outline-none font-bold text-zinc-300 transition-colors"
            />
          </div>
        )}

        {error && <p className="mt-6 text-center text-red-500 font-bold bg-red-50 py-3 rounded-none">{error}</p>}

        {role && (
          <button
            onClick={() => handleComplete(role)}
            disabled={saving}
            className="w-full mt-10 bg-cyan-500 text-black text-white py-5 rounded-none font-black text-lg hover:bg-cyan-600 text-black transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <GraduationCap className="h-6 w-6" />}
            CONFIRMAR IDENTIDAD
          </button>
        )}
      </div>
    </div>
  )
}
