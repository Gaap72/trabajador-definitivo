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
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 border border-zinc-800">
      <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center p-6 relative">
      {user && (
        <Link 
          href="/settings" 
          className="absolute top-8 right-8 bg-zinc-950 border border-cyan-900/50 p-4 rounded-none shadow-none border border-cyan-900/30 text-zinc-500 hover:text-cyan-400 transition-all flex items-center gap-2 font-bold"
        >
          <Settings className="h-5 w-5" />
          MI PERFIL
        </Link>
      )}

      <div className="max-w-3xl w-full text-center">
        <div className="inline-flex p-5 bg-cyan-500 text-black rounded-none shadow-[0_0_20px_rgba(6,182,212,0.2)] shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-10">
          <GraduationCap className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-cyan-50 tracking-[0.2em]er mb-8 leading-none">
          GESTIÓN ESCOLAR<br/>INTELIGENTE
        </h1>
        
        <p className="text-xl text-zinc-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
          La plataforma definitiva para que profesores y alumnos gestionen calificaciones y asistencia con total transparencia.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {user ? (
            <Link 
              href="/onboarding" 
              className="bg-cyan-500 text-black text-white px-10 py-5 rounded-none font-black text-lg hover:bg-cyan-600 text-black transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              IR A MI PANEL
              <ArrowRight className="h-6 w-6" />
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="bg-cyan-500 text-black text-white px-10 py-5 rounded-none font-black text-lg hover:bg-cyan-600 text-black transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              COMENZAR AHORA
              <ArrowRight className="h-6 w-6" />
            </Link>
          )}
          
          <div className="bg-zinc-950 border border-cyan-900/50 border-2 border-cyan-900/30 px-10 py-5 rounded-none font-black text-zinc-500 text-lg">
            SISTEMA 2026
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-950 border border-cyan-900/50 p-8 rounded-none border border-cyan-900/30 shadow-none">
            <h4 className="font-black text-cyan-50 mb-2 uppercase text-sm tracking-widest">Profesores</h4>
            <p className="text-zinc-500 text-xs font-bold">Control total de notas y asistencia diaria.</p>
          </div>
          <div className="bg-zinc-950 border border-cyan-900/50 p-8 rounded-none border border-cyan-900/30 shadow-none">
            <h4 className="font-black text-cyan-50 mb-2 uppercase text-sm tracking-widest">Alumnos</h4>
            <p className="text-zinc-500 text-xs font-bold">Consulta tu progreso en tiempo real.</p>
          </div>
          <div className="bg-zinc-950 border border-cyan-900/50 p-8 rounded-none border border-cyan-900/30 shadow-none">
            <h4 className="font-black text-cyan-50 mb-2 uppercase text-sm tracking-widest">Seguridad</h4>
            <p className="text-zinc-500 text-xs font-bold">Autenticación garantizada con GitHub.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
