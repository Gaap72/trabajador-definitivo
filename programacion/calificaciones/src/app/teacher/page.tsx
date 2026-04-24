'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  Users, Calendar, Save, LogOut, Search, 
  AlertCircle, CheckCircle2, XCircle, 
  TrendingUp, Award, Clock, Settings,
  FileSpreadsheet, ClipboardCheck, LayoutDashboard, Loader2, 
  CloudSync, ChevronLeft, ChevronRight, Shield, DatabaseZap
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Student {
  id: string;
  github_username: string;
  full_name: string;
  grade_id?: string; // ID de la fila en la tabla grades
  grades: {
    block_1: number;
    block_2: number;
    block_3: number;
  };
  absences_count: number;
}

export default function TeacherPage() {
  const [activeTab, setActiveTab] = useState<'grades' | 'attendance'>('grades')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  // Gestión de Calificaciones (Boletas)
  const [pendingGrades, setPendingGrades] = useState<Record<string, any>>({})
  const [isSyncing, setIsSyncing] = useState(false)

  // Gestión de Asistencia
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'PRESENT' | 'ABSENT'>>({})
  const [changedAttendance, setChangedAttendance] = useState<Set<string>>(new Set())
  
  // Justificación
  const [justifyModal, setJustifyModal] = useState<{sid: string, name: string} | null>(null)
  const [dateToJustify, setDateToJustify] = useState('')

  const supabase = createClient()
  const router = useRouter()
  
  // 1. CARGA INSTANTÁNEA (HIDRATACIÓN LOCAL AL INICIO)
  useEffect(() => {
    // Leemos inmediatamente del disco local para que el profesor vea sus datos SIN ESPERAR
    const localData = localStorage.getItem('edupro_full_students_cache')
    const localPending = localStorage.getItem('edupro_grades_backup')
    
    if (localData) {
      setStudents(JSON.parse(localData))
      setLoading(false) // Quitamos el cargando de inmediato
    }

    if (localPending) {
      setPendingGrades(JSON.parse(localPending))
    }

    // Luego disparamos la conexión con la nube para actualizar
    fetchData()
  }, [])

  // 2. PERSISTENCIA LOCAL (CADA CAMBIO SE ESCRIBE EN DISCO DE INMEDIATO)
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('edupro_full_students_cache', JSON.stringify(students))
    }
  }, [students])

  useEffect(() => {
    if (Object.keys(pendingGrades).length > 0) {
      localStorage.setItem('edupro_grades_backup', JSON.stringify(pendingGrades))
      
      // Intentar sincronizar con la nube silenciosamente cada 5 segundos
      const timer = setTimeout(() => {
        syncGradesWithCloud()
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      localStorage.removeItem('edupro_grades_backup')
    }
  }, [pendingGrades])

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendanceByDate()
    }
  }, [selectedDate, activeTab])

  async function fetchData() {
    // 1. CARGA DE EMERGENCIA: Leemos el cache local primero
    const localCacheRaw = localStorage.getItem('edupro_full_students_cache')
    const localCache = localCacheRaw ? JSON.parse(localCacheRaw) : []
    if (localCache.length > 0 && students.length === 0) {
      setStudents(localCache)
      setLoading(false)
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profiles } = await supabase
        .from('profiles')
        .select(`
          id, github_username, full_name,
          grades (id, block_1, block_2, block_3, updated_at)
        `)
        .eq('role', 'STUDENT')

      const { data: attendance } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('status', 'ABSENT')

      // FUSIONAR NUBE CON LOCAL: Reglas de Protección
      const backupRaw = localStorage.getItem('edupro_grades_backup')
      const backup = backupRaw ? JSON.parse(backupRaw) : {}

      const formatted = (profiles || []).map(p => {
        const absences = (attendance || []).filter(a => a.student_id === p.id).length
        const g = p.grades?.[0] || { block_1: 0, block_2: 0, block_3: 0, updated_at: '1970-01-01' }
        const localStudent = localCache.find((ls: any) => ls.id === p.id)
        
        // REGLA DE PROTECCIÓN: 
        // Si la nube dice 0 pero localmente tenemos un valor mayor a 0 que es más nuevo, IGNORAMOS la nube.
        const dbTime = new Date(g.updated_at).getTime()
        const localTime = localStudent?.last_sync_time || 0
        const isLocalNewer = localTime > dbTime

        return {
          id: p.id,
          github_username: p.github_username,
          full_name: p.full_name || 'Sin Nombre',
          grade_id: g.id,
          grades: {
            block_1: backup[p.id]?.block_1 !== undefined ? Number(backup[p.id].block_1) : (isLocalNewer ? localStudent.grades.block_1 : Number(g.block_1)),
            block_2: backup[p.id]?.block_2 !== undefined ? Number(backup[p.id].block_2) : (isLocalNewer ? localStudent.grades.block_2 : Number(g.block_2)),
            block_3: backup[p.id]?.block_3 !== undefined ? Number(backup[p.id].block_3) : (isLocalNewer ? localStudent.grades.block_3 : Number(g.block_3)),
          },
          absences_count: absences,
          last_sync_time: isLocalNewer ? localTime : dbTime
        }
      })

      setStudents(formatted)
      localStorage.setItem('edupro_full_students_cache', JSON.stringify(formatted))
    } catch (err) {
      console.error("Error en fetchData:", err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchAttendanceByDate() {
    const { data } = await supabase
      .from('attendance')
      .select('student_id, status')
      .eq('date', selectedDate)
    
    const map: Record<string, 'PRESENT' | 'ABSENT'> = {}
    data?.forEach(record => {
      map[record.student_id] = record.status as 'PRESENT' | 'ABSENT'
    })
    setAttendanceMap(map)
    setChangedAttendance(new Set())
  }

  // CAMBIO INSTANTÁNEO: Se guarda en el programa al momento
  const handleGradeInput = (sid: string, block: string, val: string) => {
    let num = val === '' ? 0 : parseFloat(val)
    if (isNaN(num)) num = 0
    if (num < 0) num = 0
    if (num > 10) num = 10
    
    // 1. Actualizar visualmente y en disco local de inmediato
    setStudents(prev => prev.map(s => {
      if (s.id === sid) {
        return { ...s, grades: { ...s.grades, [block]: num }, last_sync_time: Date.now() }
      }
      return s
    }))

    // 2. Marcar como pendiente para la nube en segundo plano
    setPendingGrades(prev => ({
      ...prev,
      [sid]: { ...(prev[sid] || {}), [block]: num }
    }))
  }

  const toggleAttendance = async (sid: string) => {
    const currentStatus = attendanceMap[sid] || 'PRESENT'
    const newStatus = currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    
    // Actualización visual inmediata
    setAttendanceMap(prev => ({ ...prev, [sid]: newStatus }))
    
    // GUARDADO INMEDIATO (Requerimiento del usuario)
    setIsSyncing(true)
    try {
      if (newStatus === 'ABSENT') {
        await supabase.from('attendance').upsert({ 
          student_id: sid, 
          date: selectedDate, 
          status: 'ABSENT' 
        }, { onConflict: 'student_id,date' })
      } else {
        await supabase.from('attendance')
          .delete()
          .eq('student_id', sid)
          .eq('date', selectedDate)
      }
      await fetchData() // Refrescar contador de faltas
    } catch (err) {
      console.error("Error en auto-guardado de asistencia:", err)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleJustifyAbsence = async () => {
    if (!justifyModal || !dateToJustify) return
    
    setIsSyncing(true)
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('student_id', justifyModal.sid)
        .eq('date', dateToJustify)
      
      if (error) throw error
      
      alert(`✅ Falta del día ${dateToJustify} justificada para ${justifyModal.name}`)
      setJustifyModal(null)
      setDateToJustify('')
      await fetchData()
    } catch (err) {
      alert('❌ Error: La fecha no coincide con una falta registrada o hay problemas de conexión.')
    } finally {
      setIsSyncing(false)
    }
  }

  // SISTEMA DE GUARDADO DEFINITIVO (Blindaje Total)
  const syncGradesWithCloud = async () => {
    if (isSyncing || Object.keys(pendingGrades).length === 0) return
    setIsSyncing(true)

    const gradesSnapshot = { ...pendingGrades }

    try {
      // Guardamos la boleta completa para anclaje total
      const dataToSave = students.map(s => {
        const changes = gradesSnapshot[s.id] || {}
        return {
          student_id: s.id,
          block_1: changes.block_1 !== undefined ? Number(changes.block_1) : Number(s.grades.block_1),
          block_2: changes.block_2 !== undefined ? Number(changes.block_2) : Number(s.grades.block_2),
          block_3: changes.block_3 !== undefined ? Number(changes.block_3) : Number(s.grades.block_3),
          updated_at: new Date().toISOString()
        }
      })

      const { error } = await supabase.from('grades').upsert(dataToSave, { onConflict: 'student_id' })
      if (error) throw error

      // ANCLAJE LOCAL INMEDIATO
      localStorage.setItem('edupro_full_students_cache', JSON.stringify(students))

      // Limpiar pendientes
      setPendingGrades(prev => {
        const next = { ...prev }
        Object.keys(gradesSnapshot).forEach(sid => delete next[sid])
        return next
      })

      console.log("✅ Sincronización completa.")
    } catch (err) {
      console.warn("⚠️ Falló sincronización, datos protegidos localmente.")
    } finally {
      setIsSyncing(false)
    }
  }

  const syncAttendanceWithCloud = async () => {
    setIsSyncing(true)
    try {
      const sidList = Array.from(changedAttendance)
      const absents = sidList
        .filter(sid => attendanceMap[sid] === 'ABSENT')
        .map(sid => ({ student_id: sid, date: selectedDate, status: 'ABSENT' }))
      
      const presents = sidList
        .filter(sid => attendanceMap[sid] === 'PRESENT')

      if (absents.length > 0) await supabase.from('attendance').upsert(absents, { onConflict: 'student_id,date' })
      if (presents.length > 0) await supabase.from('attendance').delete().eq('date', selectedDate).in('student_id', presents)

      await fetchData()
      setChangedAttendance(new Set())
      alert(`✅ Asistencia del ${selectedDate} guardada exitosamente.`)
    } catch (err) {
      alert('❌ Error al guardar asistencia.')
    } finally {
      setIsSyncing(false)
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const days = []
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i))
    return days
  }

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) || 
    s.github_username.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
      <div className="h-20 w-20 border-8 border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="font-black text-slate-900 uppercase tracking-[0.4em] text-sm">Sincronizando EduPro...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl">
        <div className="p-10 border-b border-slate-800">
           <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-500 p-2.5 rounded-2xl shadow-lg">
                <DatabaseZap className="text-white h-7 w-7" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">EDU-PRO</span>
           </div>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Servidor Nube Conectado</p>
        </div>

        <nav className="flex-1 p-6 space-y-4">
          <button onClick={() => setActiveTab('grades')} className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] font-black transition-all ${activeTab === 'grades' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:bg-slate-800'}`}>
            <FileSpreadsheet className="h-5 w-5" /> BOLETAS
          </button>
          <button onClick={() => setActiveTab('attendance')} className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] font-black transition-all ${activeTab === 'attendance' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:bg-slate-800'}`}>
            <ClipboardCheck className="h-5 w-5" /> ASISTENCIA
          </button>
        </nav>

        <div className="p-8 border-t border-slate-800 space-y-2">
           <Link href="/settings" className="flex items-center gap-4 px-6 py-3 text-slate-400 font-bold hover:text-indigo-400">
              <Settings className="h-5 w-5" /> Ajustes
           </Link>
           <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="flex items-center gap-4 px-6 py-3 text-red-500/70 font-bold w-full text-left">
              <LogOut className="h-5 w-5" /> Salir
           </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen pb-40">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 h-28">
          <div className="max-w-7xl mx-auto px-12 h-full flex items-center justify-between">
            <div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
                 {activeTab === 'grades' ? 'Edición de Boletas' : 'Registro de Asistencia'}
               </h2>
            </div>
            <div className="relative">
               <Search className="absolute left-5 top-4 h-5 w-5 text-slate-300" />
               <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-50 border-2 border-transparent focus:border-indigo-600 rounded-[1.2rem] py-4 pl-14 pr-8 font-black text-slate-700 w-80 outline-none transition-all" />
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-12 py-12">
          {activeTab === 'attendance' && (
            <section className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm mb-12">
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Calendario Oficial</h3>
                  <div className="flex items-center gap-4 bg-slate-900 p-2.5 rounded-2xl">
                     <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-3 text-white"><ChevronLeft className="h-4 w-4" /></button>
                     <span className="font-black text-white uppercase text-xs w-48 text-center">{currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</span>
                     <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-3 text-white"><ChevronRight className="h-4 w-4" /></button>
                  </div>
               </div>
               <div className="grid grid-cols-7 gap-4">
                  {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(d => <div key={d} className="text-center text-[10px] font-black text-slate-300 py-2">{d}</div>)}
                  {getDaysInMonth().map((date, i) => {
                    if (!date) return <div key={i}></div>
                    const dateStr = date.toISOString().split('T')[0]
                    const isSelected = selectedDate === dateStr
                    return (
                      <button key={i} onClick={() => setSelectedDate(dateStr)} className={`aspect-square rounded-2xl border-4 transition-all flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-100 text-white shadow-xl scale-105' : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'}`}>
                         <span className="text-xl font-black">{date.getDate()}</span>
                      </button>
                    )
                  })}
               </div>
            </section>
          )}

          <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-xl overflow-hidden relative">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-12">Estudiante</th>
                  {activeTab === 'grades' ? (
                    <><th className="p-12 text-center">B1</th><th className="p-12 text-center">B2</th><th className="p-12 text-center">B3</th><th className="p-12 text-center bg-indigo-50 text-indigo-600">PROM</th></>
                  ) : (
                    <><th className="p-12 text-center">Asistencia {selectedDate}</th><th className="p-12 text-center">Total Faltas</th></>
                  )}
                  <th className="p-12 text-center">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((s) => {
                  const cB1 = pendingGrades[s.id]?.block_1 ?? s.grades.block_1
                  const cB2 = pendingGrades[s.id]?.block_2 ?? s.grades.block_2
                  const cB3 = pendingGrades[s.id]?.block_3 ?? s.grades.block_3
                  const avg = ((cB1 + cB2 + cB3) / 3).toFixed(1)
                  const isFailing = s.absences_count >= 12

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/30">
                      <td className="p-12">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center font-black text-white text-2xl shadow-xl">{s.full_name.charAt(0)}</div>
                          <div>
                             <p className="font-black text-slate-900 text-xl uppercase tracking-tighter">{s.full_name}</p>
                             <p className="text-xs font-bold text-slate-400">@{s.github_username}</p>
                          </div>
                        </div>
                      </td>

                      {activeTab === 'grades' ? (
                        <>
                          <td className="p-12 text-center"><input type="number" value={cB1} onChange={(e) => handleGradeInput(s.id, 'block_1', e.target.value)} className={`w-24 bg-slate-50 border-4 rounded-2xl p-5 text-center font-black text-2xl outline-none ${pendingGrades[s.id]?.block_1 !== undefined ? 'border-orange-500 bg-orange-50' : 'border-transparent focus:border-indigo-600'}`} /></td>
                          <td className="p-12 text-center"><input type="number" value={cB2} onChange={(e) => handleGradeInput(s.id, 'block_2', e.target.value)} className={`w-24 bg-slate-50 border-4 rounded-2xl p-5 text-center font-black text-2xl outline-none ${pendingGrades[s.id]?.block_2 !== undefined ? 'border-orange-500 bg-orange-50' : 'border-transparent focus:border-indigo-600'}`} /></td>
                          <td className="p-12 text-center"><input type="number" value={cB3} onChange={(e) => handleGradeInput(s.id, 'block_3', e.target.value)} className={`w-24 bg-slate-50 border-4 rounded-2xl p-5 text-center font-black text-2xl outline-none ${pendingGrades[s.id]?.block_3 !== undefined ? 'border-orange-500 bg-orange-50' : 'border-transparent focus:border-indigo-600'}`} /></td>
                          <td className="p-12 text-center bg-indigo-50 font-black text-4xl text-indigo-600 tracking-tighter">{avg}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-12 text-center">
                             <div className="flex flex-col items-center gap-2">
                               <button onClick={() => toggleAttendance(s.id)} className={`w-full px-6 py-4 rounded-2xl font-black uppercase text-[10px] transition-all ${attendanceMap[s.id] === 'ABSENT' ? 'bg-red-600 text-white shadow-xl' : 'bg-slate-100 text-slate-400 hover:text-indigo-600'}`}>
                                 {attendanceMap[s.id] === 'ABSENT' ? 'Falta Hoy' : 'Asistencia'}
                               </button>
                               <button 
                                 onClick={() => setJustifyModal({sid: s.id, name: s.full_name})} 
                                 className="text-[9px] font-black text-indigo-500 hover:underline uppercase tracking-tighter"
                               >
                                 Justificar Falta
                               </button>
                             </div>
                          </td>
                          <td className="p-12 text-center font-black text-2xl text-slate-300">{s.absences_count} / 12</td>
                        </>
                      )}

                      <td className="p-12 text-center">
                         <div className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] border-2 flex items-center justify-center gap-3 ${isFailing ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                            {isFailing ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            {isFailing ? 'Reprobado' : 'Regular'}
                         </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* BOTÓN DE SINCRONIZACIÓN MAESTRA (REDiseñado) */}
            {(Object.keys(pendingGrades).length > 0 || (activeTab === 'attendance' && changedAttendance.size > 0)) && (
              <div className="fixed bottom-12 right-12 flex items-center gap-6 bg-slate-900 p-5 pl-12 rounded-[3rem] shadow-2xl border border-slate-700 z-50 animate-in slide-in-from-right-40 duration-700">
                 <div className="text-left">
                    <p className="text-white font-black uppercase text-sm tracking-[0.2em] mb-1">Cambios en Boletas</p>
                    <p className="text-slate-500 text-[10px] font-bold">Confirma para sincronizar con la nube</p>
                 </div>
                 <button 
                   onClick={activeTab === 'grades' ? syncGradesWithCloud : syncAttendanceWithCloud} 
                   disabled={isSyncing} 
                   className="bg-indigo-600 text-white px-16 py-7 rounded-[2.5rem] font-black text-xl hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 shadow-2xl flex items-center gap-4"
                 >
                   {isSyncing ? <Loader2 className="h-7 w-7 animate-spin" /> : <Save className="h-7 w-7" />}
                   {isSyncing ? 'CONECTANDO...' : 'GUARDAR AHORA'}
                 </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL DE JUSTIFICACIÓN */}
      {justifyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <div className="bg-white max-w-lg w-full rounded-[3rem] shadow-2xl p-12 border border-slate-100 animate-in zoom-in-95 duration-300">
              <div className="text-center mb-8">
                 <div className="inline-flex p-4 bg-indigo-50 rounded-2xl mb-4 text-indigo-600">
                    <Shield className="h-8 w-8" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Justificar Falta</h3>
                 <p className="text-slate-400 font-bold text-sm mt-2">Alumno: {justifyModal.name}</p>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Fecha de la Falta</label>
                    <input 
                      type="date" 
                      value={dateToJustify}
                      onChange={(e) => setDateToJustify(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-black text-slate-700 focus:border-indigo-600 outline-none transition-all"
                    />
                 </div>

                 <div className="flex gap-4">
                    <button 
                      onClick={() => setJustifyModal(null)}
                      className="flex-1 bg-slate-100 text-slate-400 py-5 rounded-2xl font-black uppercase text-xs hover:bg-slate-200 transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleJustifyAbsence}
                      disabled={!dateToJustify || isSyncing}
                      className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                    >
                      {isSyncing ? 'Procesando...' : 'Confirmar'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
