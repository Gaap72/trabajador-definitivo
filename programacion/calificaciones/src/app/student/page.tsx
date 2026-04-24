'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  GraduationCap, Calendar, LogOut, 
  AlertCircle, CheckCircle2, XCircle,
  TrendingUp, Award, Clock, FileText, Settings,
  User, DoorOpen, HeartHandshake, Users, Shield
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
  grades: {
    block_1: number;
    block_2: number;
    block_3: number;
  };
  attendance: Record<string, 'PRESENT' | 'ABSENT'>;
}

export default function StudentPage() {
  const [data, setData] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        full_name, github_username, materia, grado, grupo, salon, tutor,
        grades (block_1, block_2, block_3),
        attendance (date, status)
      `)
      .eq('id', user.id)
      .single()

    if (profile) {
      const attMap: Record<string, 'PRESENT' | 'ABSENT'> = {}
      profile.attendance?.forEach((a: any) => {
        attMap[a.date] = a.status
      })

      setData({
        ...profile,
        full_name: profile.full_name || 'Sin Nombre',
        grades: profile.grades?.[0] || { block_1: 0, block_2: 0, block_3: 0 },
        attendance: attMap
      })
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="h-16 w-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Cargando tu progreso...</p>
    </div>
  )
  if (!data) return null

  const absencesCount = Object.values(data.attendance).filter(s => s === 'ABSENT').length
  const average = ((data.grades.block_1 + data.grades.block_2 + data.grades.block_3) / 3).toFixed(1)

  // Generar días del calendario
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const date = new Date(year, month, 1)
    const days = []
    while (date.getMonth() === month) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
               <GraduationCap className="text-white h-6 w-6" />
             </div>
             <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Portal Estudiantil</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-[10px] font-black border border-green-100">
               <Shield className="h-3 w-3" /> GITHUB VERIFICADO
            </div>
            <Link href="/settings" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Settings className="h-6 w-6" />
            </Link>
            <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* COLUMNA IZQUIERDA: Ficha Técnica */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
               <div className="h-32 w-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white mx-auto mb-6 shadow-2xl shadow-indigo-100 border-4 border-white">
                 {data.full_name.charAt(0).toUpperCase()}
               </div>
               <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">{data.full_name}</h1>
               <p className="text-slate-400 font-bold mb-8">@{data.github_username}</p>
               
               <div className="space-y-4 text-left">
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                     <DoorOpen className="h-5 w-5 text-indigo-400" />
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Salón de Clases</p>
                        <p className="font-bold text-slate-700">{data.salon || 'No asignado'}</p>
                     </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                     <Users className="h-5 w-5 text-indigo-400" />
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Grado y Grupo</p>
                        <p className="font-bold text-slate-700">{data.grado} {data.grupo ? ` / ${data.grupo}` : '' || 'Pendiente'}</p>
                     </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                     <HeartHandshake className="h-5 w-5 text-indigo-400" />
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tutor Responsable</p>
                        <p className="font-bold text-slate-700">{data.tutor || 'Sin registrar'}</p>
                     </div>
                  </div>
               </div>
            </section>

            {/* Alerta de Faltas */}
            <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100">
               <div className="flex items-center gap-4 mb-6">
                  <div className="bg-indigo-600 p-3 rounded-2xl"><Clock className="h-6 w-6 text-white" /></div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-70">Resumen de Asistencia</p>
               </div>
               <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-6xl font-black">{absencesCount}</span>
                  <span className="text-xl font-bold opacity-40">/ 12 Faltas</span>
               </div>
               <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                  <div className={`h-full transition-all duration-1000 ${absencesCount >= 9 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min((absencesCount / 12) * 100, 100)}%` }} />
               </div>
               <p className="text-xs font-medium opacity-60 leading-relaxed">
                 {absencesCount >= 12 ? 'Haz excedido el límite de faltas permitido. Estatus: REPROBADO.' : 'Mantén tus asistencias bajo control para evitar la baja automática.'}
               </p>
            </section>
          </div>

          {/* COLUMNA DERECHA: Académico y Calendario */}
          <div className="lg:col-span-2 space-y-10">
             {/* Calificaciones */}
             <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-4">
                      <div className="bg-green-50 p-3 rounded-2xl"><Award className="text-green-600 h-6 w-6" /></div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Estatus Académico</h3>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Promedio Final</p>
                      <p className="text-4xl font-black text-indigo-600 tracking-tighter">{average}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-slate-50 p-8 rounded-[2rem] text-center border border-slate-100 group hover:bg-indigo-50 transition-colors">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-indigo-400">Bloque 1</p>
                      <p className="text-5xl font-black text-slate-800">{data.grades.block_1}</p>
                   </div>
                   <div className="bg-slate-50 p-8 rounded-[2rem] text-center border border-slate-100 group hover:bg-indigo-50 transition-colors">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-indigo-400">Bloque 2</p>
                      <p className="text-5xl font-black text-slate-800">{data.grades.block_2}</p>
                   </div>
                   <div className="bg-slate-50 p-8 rounded-[2rem] text-center border border-slate-100 group hover:bg-indigo-50 transition-colors">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-indigo-400">Bloque 3</p>
                      <p className="text-5xl font-black text-slate-800">{data.grades.block_3}</p>
                   </div>
                </div>
             </section>

             {/* Calendario de Asistencia */}
             <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 p-3 rounded-2xl"><Calendar className="text-indigo-600 h-6 w-6" /></div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Historial de Clases</h3>
                   </div>
                   <div className="flex gap-4 items-center">
                      <div className="flex items-center gap-2">
                         <div className="h-3 w-3 rounded-full bg-green-500"></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase">Asistió</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="h-3 w-3 rounded-full bg-red-500"></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase">Faltó</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-7 gap-4 mb-4">
                   {['D','L','M','M','J','V','S'].map((d, i) => (
                     <div key={i} className="text-center text-[10px] font-black text-slate-300 uppercase py-2">{d}</div>
                   ))}
                   {getDaysInMonth().map((date, i) => {
                     const dateStr = date.toISOString().split('T')[0]
                     const status = data.attendance[dateStr]
                     return (
                       <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all ${status === 'ABSENT' ? 'bg-red-50 border-red-100' : status === 'PRESENT' ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-transparent opacity-40'}`}>
                          <span className={`text-xs font-black ${status === 'ABSENT' ? 'text-red-600' : status === 'PRESENT' ? 'text-green-600' : 'text-slate-400'}`}>
                            {date.getDate()}
                          </span>
                          {status && (
                            <div className={`h-1.5 w-1.5 rounded-full mt-1 ${status === 'ABSENT' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                          )}
                       </div>
                     )
                   })}
                </div>
                <p className="text-center text-[10px] font-bold text-slate-300 mt-8 uppercase tracking-[0.2em]">
                   VISTA DE SOLO LECTURA • CONTROLADO POR MAESTRO TITULAR
                </p>
             </section>
          </div>
        </div>
      </main>
    </div>
  )
}
