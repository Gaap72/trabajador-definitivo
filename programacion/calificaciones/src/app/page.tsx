'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { GraduationCap, Loader2, ArrowRight, Settings } from 'lucide-react'
import Link from 'next/link'

export default function RootPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      {user && (
        <Link 
          href="/settings" 
          className="absolute top-8 right-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all flex items-center gap-2 font-bold"
        >
          <Settings className="h-5 w-5" />
          MI PERFIL
        </Link>
      )}

      <div className="max-w-3xl w-full text-center">
        <div className="inline-flex p-5 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-100 mb-10">
          <GraduationCap className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-none">
          GESTIÓN ESCOLAR<br/>INTELIGENTE
        </h1>
        
        <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          La plataforma definitiva para que profesores y alumnos gestionen calificaciones y asistencia con total transparencia.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {user ? (
            <Link 
              href="/onboarding" 
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              IR A MI PANEL
              <ArrowRight className="h-6 w-6" />
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              COMENZAR AHORA
              <ArrowRight className="h-6 w-6" />
            </Link>
          )}
          
          <div className="bg-white border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-slate-400 text-lg">
            SISTEMA 2026
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 mb-2 uppercase text-sm tracking-widest">Profesores</h4>
            <p className="text-slate-400 text-xs font-bold">Control total de notas y asistencia diaria.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 mb-2 uppercase text-sm tracking-widest">Alumnos</h4>
            <p className="text-slate-400 text-xs font-bold">Consulta tu progreso en tiempo real.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 mb-2 uppercase text-sm tracking-widest">Seguridad</h4>
            <p className="text-slate-400 text-xs font-bold">Autenticación garantizada con GitHub.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
