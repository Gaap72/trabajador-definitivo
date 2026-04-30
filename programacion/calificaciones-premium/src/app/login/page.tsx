'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GraduationCap, Loader2, ShieldCheck, Users, Beaker } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function checkActiveSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/onboarding')
      }
    }
    checkActiveSession()
  }, [])

  const handleGitHubLogin = async () => {
    setLoading(true)
    setError('')
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      },
    })

    if (error) {
      setError('Error al conectar con GitHub: ' + error.message)
      setLoading(false)
    }
  }

  // FUNCIÓN PARA CREAR Y ENTRAR COMO ESTUDIANTE DE PRUEBA
  const handleTestStudentLogin = async () => {
    setLoading(true)
    // 1. Login anónimo para tener una sesión
    const { data, error } = await supabase.auth.signInAnonymously()
    
    if (!error && data.user) {
      // 2. Forzar perfil de estudiante para este usuario anónimo
      await supabase.from('profiles').upsert({
        id: data.user.id,
        github_username: 'estudiante_demo_' + Math.floor(Math.random() * 1000),
        full_name: 'ESTUDIANTE DE PRUEBA (MODO DEMO)',
        role: 'STUDENT'
      })
      
      // 3. Crear fila de notas
      await supabase.from('grades').upsert({ student_id: data.user.id })

      router.push('/student')
    } else {
      setError('Error al crear cuenta de prueba')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 border border-zinc-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-950 border border-cyan-900/50 rounded-none shadow-[0_0_20px_rgba(6,182,212,0.2)] p-10 border border-cyan-900/30 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-950 rounded-none opacity-50 blur-3xl"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex p-5 bg-cyan-500 text-black rounded-none shadow-[0_0_10px_rgba(6,182,212,0.1)] shadow-[0_0_15px_rgba(6,182,212,0.3)] mb-6 border-4 border-white">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-cyan-50 tracking-[0.2em]er mb-2">EDU-PRO</h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">Gestión Universitaria</p>
        </div>

        <div className="space-y-4 relative z-10">
          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-black border border-cyan-900 text-white py-6 rounded-none font-black text-lg hover:bg-black transition-all active:scale-[0.97] shadow-[0_0_20px_rgba(6,182,212,0.2)] shadow-slate-200 disabled:opacity-50 group"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            )}
            {loading ? 'CONECTANDO...' : 'ENTRAR CON GITHUB'}
          </button>

          <button
            onClick={handleTestStudentLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-cyan-950 text-cyan-400 py-4 rounded-none font-bold text-sm hover:bg-cyan-900 transition-all active:scale-[0.98] border border-cyan-900"
          >
            <Beaker className="h-5 w-5" />
            ENTRAR COMO ESTUDIANTE DE PRUEBA
          </button>

          <div className="flex flex-col gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-none border border-cyan-900/30">
            <div className="flex items-center gap-3">
               <ShieldCheck className="h-5 w-5 text-cyan-400" />
               <p className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Seguridad Académica</p>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
              Sistema protegido. Se requiere cuenta de GitHub para registros oficiales. El modo prueba es solo para demostración.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-4 rounded-none text-center font-bold text-xs bg-red-50 text-red-600 border border-red-100 animate-bounce uppercase">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
