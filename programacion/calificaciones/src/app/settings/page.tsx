'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { 
  Settings, User, ShieldCheck, LogOut, 
  ChevronLeft, Loader2, CheckCircle2, AlertCircle,
  BookOpen, GraduationCap, Users, DoorOpen, Save,
  ArrowRight, Shield, HeartHandshake
} from 'lucide-react'
import Link from 'next/link'

const PROFESSOR_CODE = 'PROFESOR2026'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showReturnBtn, setShowReturnBtn] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: '',
    materia: '',
    grado: '',
    grupo: '',
    salon: '',
    tutor: ''
  })
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    setProfile(data)
    if (data) {
      setFormData({
        full_name: data.full_name || '',
        materia: data.materia || '',
        grado: data.grado || '',
        grupo: data.grupo || '',
        salon: data.salon || '',
        tutor: data.tutor || ''
      })
    }
    setLoading(false)
  }

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', profile.id)

    if (error) {
      setMessage({ type: 'error', text: 'Error al guardar información' })
    } else {
      setMessage({ type: 'success', text: '¡Información actualizada!' })
      setShowReturnBtn(true)
      setTimeout(() => setMessage({ type: '', text: '' }), 4000)
    }
    setUpdating(false)
  }

  const handleUpdateRole = async () => {
    if (code !== PROFESSOR_CODE) {
      setMessage({ type: 'error', text: 'Código de profesor incorrecto' })
      return
    }
    setUpdating(true)
    const { error } = await supabase.from('profiles').update({ role: 'TEACHER' }).eq('id', profile.id)
    if (!error) router.push('/teacher')
    setUpdating(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin h-10 w-10 text-indigo-600" /></div>

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black transition-all">
            <ChevronLeft className="h-5 w-5" /> VOLVER
          </Link>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Ajustes de Perfil</h1>
          <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-[10px] font-black border border-green-100">
             <Shield className="h-3 w-3" /> GITHUB VERIFICADO
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <div className="space-y-10">
          
          <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex items-center gap-8 relative z-10">
              <div className="h-24 w-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-100">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                   {profile?.role === 'TEACHER' ? 'Maestro Titular' : 'Estudiante'}
                </span>
                <h2 className="text-3xl font-black text-slate-900">{profile?.full_name || 'Sin Nombre'}</h2>
                <p className="text-slate-400 font-bold text-lg">Sesión: {profile?.github_username}</p>
              </div>
            </div>
          </section>

          {/* FORMULARIO UNIFICADO (PROFESOR O ALUMNO) */}
          <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                   <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600"><User className="h-6 w-6" /></div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Información Personal</h3>
                </div>
                {showReturnBtn && (
                  <Link href={profile?.role === 'TEACHER' ? '/teacher' : '/student'} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-indigo-700 transition-all shadow-lg animate-bounce">
                     IR AL PANEL <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
             </div>

             <form onSubmit={handleSaveInfo} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                   <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Escribe tu nombre..." />
                </div>
                
                {profile?.role === 'TEACHER' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Materia Impartida</label>
                    <div className="relative">
                      <BookOpen className="absolute left-5 top-5 h-5 w-5 text-slate-300" />
                      <input type="text" value={formData.materia} onChange={(e) => setFormData({...formData, materia: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Materia..." />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grado</label>
                   <div className="relative">
                      <GraduationCap className="absolute left-5 top-5 h-5 w-5 text-slate-300" />
                      <input type="text" value={formData.grado} onChange={(e) => setFormData({...formData, grado: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Grado..." />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grupo</label>
                   <div className="relative">
                      <Users className="absolute left-5 top-5 h-5 w-5 text-slate-300" />
                      <input type="text" value={formData.grupo} onChange={(e) => setFormData({...formData, grupo: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Grupo..." />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Salón / Aula</label>
                   <div className="relative">
                      <DoorOpen className="absolute left-5 top-5 h-5 w-5 text-slate-300" />
                      <input type="text" value={formData.salon} onChange={(e) => setFormData({...formData, salon: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Salón..." />
                   </div>
                </div>

                {profile?.role === 'STUDENT' && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Padre de Familia o Tutor</label>
                    <div className="relative">
                       <HeartHandshake className="absolute left-5 top-5 h-5 w-5 text-slate-300" />
                       <input type="text" value={formData.tutor} onChange={(e) => setFormData({...formData, tutor: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nombre del tutor responsable..." />
                    </div>
                  </div>
                )}

                <div className="md:col-span-2 pt-6">
                  <button type="submit" disabled={updating} className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
                    {updating ? <Loader2 className="animate-spin h-6 w-6" /> : <Save className="h-6 w-6" />}
                    GUARDAR INFORMACIÓN
                  </button>
                </div>
             </form>
          </section>

          {profile?.role !== 'TEACHER' && (
            <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Ascender a Maestro</h3>
              <div className="flex gap-4">
                <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código secreto..." className="flex-1 bg-slate-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-orange-500" />
                <button onClick={handleUpdateRole} className="bg-orange-600 text-white px-8 rounded-2xl font-black">VERIFICAR</button>
              </div>
            </section>
          )}

          <button onClick={handleLogout} className="w-full bg-red-50 hover:bg-red-100 p-8 rounded-[2.5rem] flex items-center justify-between transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-3 rounded-2xl shadow-lg"><LogOut className="text-white h-5 w-5" /></div>
              <span className="font-black text-red-600 uppercase tracking-widest">Cerrar Sesión</span>
            </div>
            <ChevronLeft className="h-6 w-6 text-red-300 rotate-180" />
          </button>
        </div>
      </main>

      {message.text && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 p-5 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-sm z-[100] ${message.type === 'success' ? 'bg-indigo-600 text-white' : 'bg-red-600 text-white'}`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message.text.toUpperCase()}
        </div>
      )}
    </div>
  )
}
