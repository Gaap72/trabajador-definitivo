'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  GraduationCap, Calendar, LogOut, 
  AlertCircle, CheckCircle2, XCircle,
  TrendingUp, Award, Clock, FileText, Settings,
  User, DoorOpen, HeartHandshake, Users, Shield, Loader2,
  ChevronLeft, ChevronRight, Database, Zap, Activity, Monitor
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface StudentData {
  full_name: string;
  github_username: string;
  materia: string;
  grado: string;
  grupo: string;
  salon: string;
  tutor: string;
  turno: string;
  grades: {
    block_1: number | null;
    block_2: number | null;
    block_3: number | null;
    average: string;
  };
  attendance: Record<string, 'PRESENT' | 'ABSENT'>;
}

type FetchStatus = 'loading' | 'success' | 'error';

export default function StudentPage() {
  const [data, setData] = useState<StudentData | null>(null)
  const [status, setStatus] = useState<FetchStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchCompleteData()
  }, [])

  async function fetchCompleteData() {
    setStatus('loading')
    setErrorMessage('')
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        router.push('/login')
        return
      }

      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (pError) throw new Error("ACCESS_DENIED: PROFILE_NOT_FOUND")

      const { data: attendance } = await supabase
        .from('attendance')
        .select('date, status')
        .eq('student_id', user.id)

      let gradesData = { block_1: null, block_2: null, block_3: null, average: "0.0" }
      try {
        const res = await fetch(`/api/calificaciones/alumno/${user.id}`, { cache: 'no-store' })
        const json = await res.json()
        if (json.success) gradesData = json.data
      } catch (apiErr) {
        console.warn("API_OFFLINE: GRADES")
      }

      const attMap: Record<string, 'PRESENT' | 'ABSENT'> = {}
      attendance?.forEach((a: any) => {
        attMap[a.date] = a.status
      })

      setData({
        full_name: profile.full_name || 'ANONYMOUS_USER',
        github_username: profile.github_username || 'UNKNOWN',
        materia: profile.materia || 'UNASSIGNED',
        grado: profile.grado || '-',
        grupo: profile.grupo || '-',
        salon: profile.salon || '-',
        tutor: profile.tutor || 'NONE',
        turno: profile.turno || 'N/A',
        grades: gradesData,
        attendance: attMap
      })
      setStatus('success')

    } catch (err: any) {
      setErrorMessage(err.message || "SYSTEM_FAILURE: DATA_STREAM_INTERRUPTED")
      setStatus('error')
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const days = []
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const renderGradeBox = (label: string, value: number | null) => {
    const isPending = value === null || value === undefined;
    const numValue = Number(value);
    const isAprobado = numValue >= 7;

    return (
      <div className={`relative overflow-hidden bg-black border-2 transition-all p-6 rounded-none ${
        isPending ? 'border-zinc-800' : isAprobado ? 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-black text-zinc-500">{label}</p>
          {isAprobado && !isPending && <Zap className="h-3 w-3 text-cyan-500 animate-pulse" />}
        </div>
        <p className={`text-5xl font-black ${isPending ? 'text-zinc-800' : 'text-white neon-text'}`}>
          {isPending ? '--' : numValue.toFixed(1)}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-none ${isPending ? 'bg-zinc-800' : isAprobado ? 'bg-cyan-500' : 'bg-red-500'}`}></div>
          <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            {isPending ? 'AWAITING_DATA' : isAprobado ? 'STATUS_SECURE' : 'CRITICAL_FAILURE'}
          </p>
        </div>
      </div>
    )
  }

  if (status === 'loading') return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center crt-effect">
      <div className="h-1 w-64 bg-zinc-900 overflow-hidden mb-4">
        <div className="h-full bg-cyan-500 animate-[loading_2s_ease-in-out_infinite]"></div>
      </div>
      <p className="font-mono text-cyan-500 text-xs animate-pulse">INITIALIZING_CORE_SYSTEM...</p>
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )

  if (!data && status !== 'error') return null;

  const absences = Object.values(data?.attendance || {}).filter(s => s === 'ABSENT').length;

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono uppercase tracking-[0.15em] grid-bg crt-effect">
      {/* NEW SIDE HUD BAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 border-r border-cyan-900/50 bg-black flex flex-col items-center py-10 gap-10 z-50">
        <div className="bg-cyan-500 text-black p-3 neon-border">
          <Monitor className="h-6 w-6" />
        </div>
        <Link href="/settings" className="p-3 text-zinc-500 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-900/50">
          <Settings className="h-6 w-6" />
        </Link>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="mt-auto p-3 text-zinc-500 hover:text-red-500 transition-all">
          <LogOut className="h-6 w-6" />
        </button>
      </aside>

      {/* TOP DASHBOARD INFO */}
      <header className="ml-20 border-b border-cyan-900/50 bg-black/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex gap-10 items-center">
            <div>
              <p className="text-[9px] text-zinc-500 mb-1">OPERATOR_IDENT</p>
              <h2 className="text-sm font-black text-cyan-50">{data?.full_name}</h2>
            </div>
            <div className="h-10 w-[1px] bg-cyan-900/30"></div>
            <div>
              <p className="text-[9px] text-zinc-500 mb-1">NETWORK_ADDR</p>
              <h2 className="text-sm font-black text-zinc-400">@{data?.github_username}</h2>
            </div>
            <div className="h-10 w-[1px] bg-cyan-900/30 hidden md:block"></div>
            <div className="hidden md:block">
              <p className="text-[9px] text-zinc-500 mb-1">DEPT_SECTOR</p>
              <h2 className="text-sm font-black text-zinc-400">{data?.grado}{data?.grupo} // {data?.turno}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-cyan-950 px-4 py-2 border border-cyan-900 text-[10px] font-black text-cyan-400 animate-pulse">
              SYSTEM_ONLINE
            </div>
          </div>
        </div>
      </header>

      <main className="ml-20 p-10 max-w-7xl mx-auto">
        {status === 'error' ? (
          <div className="border-2 border-red-900 bg-red-950/20 p-20 text-center">
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6 animate-bounce" />
            <h2 className="text-2xl font-black text-red-500 mb-4">{errorMessage}</h2>
            <button onClick={fetchCompleteData} className="border border-red-500 text-red-500 px-10 py-4 hover:bg-red-500 hover:text-black transition-all">REBOOT_SYSTEM</button>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-10">
            
            {/* LEFT DIAGNOSTICS */}
            <div className="col-span-12 lg:col-span-4 space-y-10">
              <section className="bg-black border border-cyan-900 p-8 neon-border">
                <div className="flex items-center gap-4 mb-8">
                  <Activity className="h-5 w-5 text-cyan-500" />
                  <h3 className="text-xs font-black text-cyan-50">BIOMETRIC_DATA</h3>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-zinc-950 border border-zinc-900">
                    <p className="text-[8px] text-zinc-500 mb-2">TARGET_SUBJECT</p>
                    <p className="text-xs font-black text-cyan-300">{data?.materia}</p>
                  </div>
                  <div className="p-4 bg-zinc-950 border border-zinc-900">
                    <p className="text-[8px] text-zinc-500 mb-2">PRIMARY_SUPERVISOR</p>
                    <p className="text-xs font-black text-zinc-300">{data?.tutor}</p>
                  </div>
                  <div className="p-4 bg-zinc-950 border border-zinc-900">
                    <p className="text-[8px] text-zinc-500 mb-2">LOCATION_COORD</p>
                    <p className="text-xs font-black text-zinc-300">ROOM_{data?.salon}</p>
                  </div>
                </div>
              </section>

              <section className="bg-black border border-red-900/50 p-8">
                <div className="flex items-center gap-4 mb-8">
                  <Zap className="h-5 w-5 text-red-500" />
                  <h3 className="text-xs font-black text-red-500 text-shadow-[0_0_5px_red]">ATTENDANCE_BREACH</h3>
                </div>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-7xl font-black text-white neon-text">{absences}</span>
                  <span className="text-sm text-zinc-600">/ 12_LIMIT</span>
                </div>
                <div className="h-2 bg-zinc-900">
                  <div className={`h-full transition-all duration-1000 ${absences >= 9 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}`} style={{ width: `${(absences/12)*100}%` }}></div>
                </div>
              </section>
            </div>

            {/* MAIN DATA STREAM */}
            <div className="col-span-12 lg:col-span-8 space-y-10">
              <section className="bg-black border border-cyan-900 p-10 relative">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-4">
                    <Database className="h-6 w-6 text-cyan-500" />
                    <h3 className="text-xl font-black text-white">MISSION_PROGRESS</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-zinc-500 mb-1">AGGREGATE_VAL</p>
                    <p className={`text-6xl font-black ${Number(data?.grades.average) >= 7 ? 'text-cyan-400' : 'text-red-500'} neon-text`}>
                      {data?.grades.average}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {renderGradeBox('PHASE_01', data?.grades.block_1 ?? null)}
                  {renderGradeBox('PHASE_02', data?.grades.block_2 ?? null)}
                  {renderGradeBox('PHASE_03', data?.grades.block_3 ?? null)}
                </div>
              </section>

              <section className="bg-black border border-zinc-800 p-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-6 w-6 text-zinc-500" />
                    <h3 className="text-xs font-black text-zinc-500">TEMPORAL_LOG</h3>
                  </div>
                  <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-900 p-2">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 text-zinc-500 hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
                    <span className="text-[10px] text-zinc-400 w-32 text-center">{currentMonth.toLocaleString('en-US', { month: 'short', year: 'numeric' })}</span>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 text-zinc-500 hover:text-white"><ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="text-center text-[9px] text-zinc-700 py-2">{d}</div>)}
                  {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => <div key={i}></div>)}
                  {getDaysInMonth().map((date, i) => {
                    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                    const status = data?.attendance[dateStr]
                    const isToday = new Date().toISOString().split('T')[0] === dateStr
                    return (
                      <div key={i} className={`aspect-square flex items-center justify-center text-[10px] border ${status === 'ABSENT' ? 'border-red-900 bg-red-950/20 text-red-500 shadow-[inset_0_0_5px_rgba(239,68,68,0.2)]' : isToday ? 'border-cyan-500 bg-cyan-950/10 text-cyan-400' : 'border-zinc-900 text-zinc-700'}`}>
                        {date.getDate()}
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

          </div>
        )}
      </main>
      
      <footer className="ml-20 p-10 border-t border-zinc-900 text-center">
        <p className="text-[8px] text-zinc-800 tracking-[0.5em]">ENCRYPTED_SESSION // SECURE_ACCESS_NODE_04</p>
      </footer>
    </div>
  )
}
