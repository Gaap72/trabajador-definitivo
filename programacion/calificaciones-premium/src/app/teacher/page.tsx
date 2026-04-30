'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  GraduationCap, Calendar, LogOut, Save, Search, 
  AlertCircle, CheckCircle2, XCircle, 
  TrendingUp, Award, Clock, Settings,
  FileSpreadsheet, ClipboardCheck, LayoutDashboard, Loader2, 
  CloudSync, ChevronLeft, ChevronRight, Shield, DatabaseZap,
  Activity, Monitor, Zap, Terminal, Database, Server
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Student {
  id: string;
  github_username: string;
  full_name: string;
  grade_id?: string;
  grades: {
    block_1: number;
    block_2: number;
    block_3: number;
    director_grade: number;
  };
  absences_count: number;
  last_sync_time?: number;
}

const PROFESSOR_CODE = 'PROFESOR2026';

const toLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TeacherPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authCode, setAuthCode] = useState('')
  const [activeTab, setActiveTab] = useState<'grades' | 'attendance'>('grades')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  
  const [pendingGrades, setPendingGrades] = useState<Record<string, any>>({})
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedDate, setSelectedDate] = useState(toLocalDateString(new Date()))
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'PRESENT' | 'ABSENT'>>({})
  const [markedDays, setMarkedDays] = useState<Set<string>>(new Set())
  
  const [justifyModal, setJustifyModal] = useState<{sid: string, name: string} | null>(null)
  const [dateToJustify, setDateToJustify] = useState('')

  const supabase = createClient()
  const router = useRouter()

  const handleVerifyIdentity = () => {
    if (authCode === PROFESSOR_CODE) setIsAuthorized(true)
    else alert("❌ ACCESS_DENIED: INVALID_IDENTITY_CODE")
  }
  
  useEffect(() => {
    const localData = localStorage.getItem('edupro_full_students_cache')
    const localPending = localStorage.getItem('edupro_grades_backup')
    if (localData) { setStudents(JSON.parse(localData)); setLoading(false); }
    if (localPending) setPendingGrades(JSON.parse(localPending))
    fetchData()
  }, [])

  useEffect(() => {
    if (students.length > 0) localStorage.setItem('edupro_full_students_cache', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    if (Object.keys(pendingGrades).length > 0) {
      localStorage.setItem('edupro_grades_backup', JSON.stringify(pendingGrades))
      const timer = setTimeout(() => syncGradesWithCloud(), 5000)
      return () => clearTimeout(timer)
    } else localStorage.removeItem('edupro_grades_backup')
  }, [pendingGrades])

  useEffect(() => {
    if (activeTab === 'attendance') { fetchAttendanceByDate(); fetchMarkedDays(); }
  }, [selectedDate, currentMonth, activeTab])

  async function fetchMarkedDays() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    const { data } = await supabase.from('attendance').select('date').gte('date', startDate).lte('date', endDate)
    const days = new Set<string>();
    data?.forEach(r => days.add(r.date));
    setMarkedDays(days);
  }

  async function fetchData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data: profiles } = await supabase.from('profiles').select('id, github_username, full_name, grades (id, block_1, block_2, block_3, updated_at)').eq('role', 'STUDENT')
      const { data: dGrades } = await supabase.from('grades').select('student_id, director_grade')
      const { data: attendance } = await supabase.from('attendance').select('student_id, status').eq('status', 'ABSENT')
      const backup = JSON.parse(localStorage.getItem('edupro_grades_backup') || '{}')

      const formatted = (profiles || []).map(p => {
        const absences = (attendance || []).filter(a => a.student_id === p.id).length
        const g = p.grades?.[0] || { block_1: 0, block_2: 0, block_3: 0, updated_at: '1970-01-01' }
        const dg = dGrades?.find(x => x.student_id === p.id)?.director_grade || 0
        return {
          id: p.id,
          github_username: p.github_username,
          full_name: p.full_name || 'ANON_SUBJECT',
          grades: {
            block_1: backup[p.id]?.block_1 !== undefined ? Number(backup[p.id].block_1) : Number(g.block_1),
            block_2: backup[p.id]?.block_2 !== undefined ? Number(backup[p.id].block_2) : Number(g.block_2),
            block_3: backup[p.id]?.block_3 !== undefined ? Number(backup[p.id].block_3) : Number(g.block_3),
            director_grade: Number(dg),
          },
          absences_count: absences
        }
      })
      setStudents(formatted);
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  async function fetchAttendanceByDate() {
    const { data } = await supabase.from('attendance').select('student_id, status').eq('date', selectedDate)
    const map: Record<string, 'PRESENT' | 'ABSENT'> = {}
    data?.forEach(record => { map[record.student_id] = record.status as 'PRESENT' | 'ABSENT' })
    setAttendanceMap(map)
  }

  const handleGradeInput = (sid: string, block: string, val: string) => {
    let num = val === '' ? 0 : parseFloat(val)
    if (isNaN(num)) num = 0; if (num < 0) num = 0; if (num > 10) num = 10
    setStudents(prev => prev.map(s => s.id === sid ? { ...s, grades: { ...s.grades, [block]: num } } : s))
    setPendingGrades(prev => ({ ...prev, [sid]: { ...(prev[sid] || {}), [block]: num } }))
  }

  const toggleAttendance = async (sid: string) => {
    const newStatus = (attendanceMap[sid] || 'PRESENT') === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    setAttendanceMap(prev => ({ ...prev, [sid]: newStatus }))
    setIsSyncing(true)
    try {
      if (newStatus === 'ABSENT') await supabase.from('attendance').upsert({ student_id: sid, date: selectedDate, status: 'ABSENT' }, { onConflict: 'student_id,date' })
      else await supabase.from('attendance').delete().eq('student_id', sid).eq('date', selectedDate)
      await fetchData()
    } finally { setIsSyncing(false) }
  }

  const handleJustifyAbsence = async () => {
    setIsSyncing(true)
    try {
      await supabase.from('attendance').delete().eq('student_id', justifyModal!.sid).eq('date', dateToJustify)
      setJustifyModal(null); await fetchData()
    } finally { setIsSyncing(false) }
  }

  const syncGradesWithCloud = async () => {
    if (isSyncing || Object.keys(pendingGrades).length === 0) return
    setIsSyncing(true)
    try {
      const dataFull = students.map(s => ({
        student_id: s.id,
        block_1: Number(s.grades.block_1),
        block_2: Number(s.grades.block_2),
        block_3: Number(s.grades.block_3),
        updated_at: new Date().toISOString()
      }))
      await supabase.from('grades').upsert(dataFull, { onConflict: 'student_id' })
      setPendingGrades({}); alert("✅ UPLINK_SUCCESSFUL: DATA_SYNCED")
    } finally { setIsSyncing(false) }
  }

  const handleLogout = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('profiles').update({ role: 'STUDENT' }).eq('id', user.id)
    await supabase.auth.signOut(); router.push('/login')
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear(), month = currentMonth.getMonth()
    const days = [], firstDay = new Date(year, month, 1).getDay(), totalDays = new Date(year, month + 1, 0).getDate()
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i))
    return days
  }

  const filteredStudents = students.filter(s => s.full_name.toLowerCase().includes(search.toLowerCase()))

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono crt-effect">
        <div className="max-w-md w-full bg-zinc-950 border-4 border-cyan-900 p-12 text-center neon-border">
           <Terminal className="h-16 w-16 text-cyan-500 mx-auto mb-8 animate-pulse" />
           <h1 className="text-2xl font-black text-white mb-4 tracking-[0.3em]">SECURE_UPLINK</h1>
           <p className="text-zinc-500 text-[10px] mb-10 tracking-widest">REQUIRES MASTER_KEY TO INITIALIZE DATA_STREAM</p>
           <input type="password" value={authCode} onChange={(e) => setAuthCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVerifyIdentity()} placeholder="ENTER_CODE" className="w-full bg-black border border-cyan-900 py-6 text-center text-2xl text-cyan-400 focus:outline-none focus:border-cyan-400 mb-6 tracking-[0.5em]" />
           <button onClick={handleVerifyIdentity} className="w-full bg-cyan-500 text-black py-5 font-black hover:bg-cyan-400 transition-all">DECRYPT_ACCESS</button>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center crt-effect">
      <Loader2 className="h-16 w-16 text-cyan-500 animate-spin mb-4" />
      <p className="text-[10px] text-cyan-500 tracking-[0.5em]">BUFFERING_RECORDS...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-mono uppercase tracking-widest grid-bg crt-effect">
      {/* COMMAND CENTER HEADER */}
      <header className="border-b border-cyan-900/50 bg-black/90 sticky top-0 z-50">
        <div className="max-w-full px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="bg-cyan-500 text-black p-2 neon-border"><Server className="h-6 w-6" /></div>
            <h2 className="text-xl font-black text-white tracking-[0.4em]">COMMAND_CENTER_V4</h2>
          </div>
          
          <nav className="flex items-center gap-2">
            <button onClick={() => setActiveTab('grades')} className={`px-8 py-3 border ${activeTab === 'grades' ? 'bg-cyan-500 text-black border-cyan-500' : 'border-zinc-800 text-zinc-500 hover:border-cyan-900'}`}>GRADES</button>
            <button onClick={() => setActiveTab('attendance')} className={`px-8 py-3 border ${activeTab === 'attendance' ? 'bg-cyan-500 text-black border-cyan-500' : 'border-zinc-800 text-zinc-500 hover:border-cyan-900'}`}>ATTENDANCE</button>
            <div className="w-[1px] h-10 bg-zinc-800 mx-4"></div>
            <Link href="/settings" className="p-3 text-zinc-500 hover:text-cyan-400"><Settings className="h-5 w-5" /></Link>
            <button onClick={handleLogout} className="p-3 text-zinc-500 hover:text-red-500"><LogOut className="h-5 w-5" /></button>
          </nav>
        </div>
      </header>

      <main className="p-10 max-w-full mx-auto">
        {/* HUD TOOLS */}
        <div className="flex justify-between items-center mb-10 bg-zinc-950/50 p-6 border border-zinc-900">
          <div className="relative w-96">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-600" />
            <input type="text" placeholder="FILTER_BY_SUBJECT_NAME..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-black border border-zinc-800 py-3 pl-12 text-[10px] focus:border-cyan-500 outline-none" />
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-[10px] text-zinc-600">LIVE_NODE_RECORDS: {filteredStudents.length}</p>
            {Object.keys(pendingGrades).length > 0 && (
              <button onClick={syncGradesWithCloud} className="bg-red-600 text-white px-8 py-3 text-[10px] font-black animate-pulse hover:bg-red-500 transition-all flex items-center gap-3">
                <DatabaseZap className="h-4 w-4" /> UPLINK_PENDING_CHANGES
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((s) => {
            const avg = ((s.grades.block_1 + s.grades.block_2 + s.grades.block_3) / 3).toFixed(1)
            const isFailing = s.absences_count >= 12 || Number(avg) < 7
            
            return (
              <div key={s.id} className={`bg-zinc-950 border p-6 transition-all group ${isFailing ? 'border-red-900/50 hover:border-red-500' : 'border-zinc-900 hover:border-cyan-500'}`}>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-900">
                  <div className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center font-black text-cyan-500">{s.full_name.charAt(0)}</div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-white truncate">{s.full_name}</p>
                    <p className="text-[8px] text-zinc-600 truncate">ID_{s.github_username}</p>
                  </div>
                </div>

                {activeTab === 'grades' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {['block_1', 'block_2', 'block_3'].map((b, i) => (
                        <div key={b}>
                          <p className="text-[7px] text-zinc-600 mb-1">PHASE_0{i+1}</p>
                          <input type="number" value={s.grades[b as keyof typeof s.grades]} onChange={(e) => handleGradeInput(s.id, b, e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-center text-xs font-black focus:border-cyan-500 outline-none" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                      <p className="text-[8px] text-zinc-600 tracking-tighter">AGGREGATE_RESULT</p>
                      <p className={`text-2xl font-black ${Number(avg) >= 7 ? 'text-cyan-400' : 'text-red-500'} neon-text`}>{avg}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button onClick={() => toggleAttendance(s.id)} className={`w-full py-4 text-[10px] font-black border transition-all ${attendanceMap[s.id] === 'ABSENT' ? 'bg-red-900 border-red-500 text-white animate-pulse' : 'bg-black border-zinc-800 text-zinc-600 hover:border-cyan-900'}`}>
                      {attendanceMap[s.id] === 'ABSENT' ? 'NODE_ABSENT' : 'MARK_ABSENCE'}
                    </button>
                    <div className="flex justify-between items-center text-[8px] text-zinc-600">
                      <span>TOTAL_VIOLATIONS</span>
                      <span className="text-white font-black">{s.absences_count} / 12</span>
                    </div>
                  </div>
                )}
                
                <div className={`mt-4 py-1 text-center text-[8px] font-black ${isFailing ? 'bg-red-950 text-red-500' : 'bg-cyan-950 text-cyan-500'}`}>
                  STATUS: {isFailing ? 'COMPROMISED' : 'STABLE_NODE'}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {activeTab === 'attendance' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black border border-cyan-900 p-6 neon-border flex items-center gap-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="text-cyan-500"><ChevronLeft /></button>
            <span className="text-[10px] w-40 text-center">{currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="text-cyan-500"><ChevronRight /></button>
          </div>
          <div className="h-10 w-[1px] bg-zinc-800"></div>
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((date, i) => {
              if (!date) return <div key={i} className="w-6 h-6"></div>
              const dStr = date.toISOString().split('T')[0]
              const isSelected = selectedDate === dStr
              const hasData = markedDays.has(dStr)
              return (
                <button key={i} onClick={() => setSelectedDate(dStr)} className={`w-6 h-6 text-[8px] border ${isSelected ? 'bg-cyan-500 text-black border-cyan-500' : hasData ? 'border-cyan-900 text-cyan-700' : 'border-zinc-900 text-zinc-700'}`}>{date.getDate()}</button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
