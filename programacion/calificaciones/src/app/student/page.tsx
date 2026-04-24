'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  GraduationCap, Calendar, LogOut, 
  AlertCircle, CheckCircle2, XCircle,
  TrendingUp, Award, Clock, FileText, Settings,
  User, DoorOpen, HeartHandshake, Users, Shield, Loader2
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
      // 1. OBTENCIÓN Y VALIDACIÓN ESTRICTA DEL ID (Requisito fundamental)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user || !user.id) {
        console.error("[ID_CRITICAL] No se pudo obtener un ID de usuario válido:", authError);
        setErrorMessage("Usuario no identificado. Por favor, inicia sesión de nuevo.");
        setStatus('error');
        return;
      }

      // Imprimir el UUID real para verificación en consola
      console.log(`[VALIDACIÓN] AlumnoID verificado (UUID): ${user.id}`);

      // VALIDACIÓN PREVIA: Evitar enviar 'undefined' o 'null' como string al backend
      if (user.id === 'undefined' || user.id === 'null') {
        console.error("[BLOQUEO] Se detectó un ID inválido ('undefined'). Cancelando petición.");
        setErrorMessage("Error de identificación interna.");
        setStatus('error');
        return;
      }

      // 2. Cargar Perfil Base
      const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('full_name, github_username, materia, grado, grupo, salon, tutor, attendance (date, status)')
        .eq('id', user.id)
        .single()

      if (pError) {
        console.error("[DB_ERROR] Error al consultar perfil:", pError.message);
        throw new Error("No se pudo conectar con tu perfil académico");
      }

      // 3. LLAMADA SEGURA A LA API (Solo con ID validado)
      const host = window.location.origin;
      console.log(`[API_CALL] Enviando UUID validado a: ${host}/api/calificaciones/alumno/${user.id}`);
      
      const res = await fetch(`${host}/api/calificaciones/alumno/${user.id}`, { cache: 'no-store' })
      
      // Verificar si la respuesta es válida antes de procesar
      if (!res.ok) {
        const errorText = await res.text();
        console.error("[BACKEND_FAIL] El servidor rechazó la petición:", errorText);
        throw new Error("El servidor de calificaciones no respondió correctamente");
      }

      const apiResult = await res.json()
      console.log("[API_RESPONSE] Datos recibidos:", apiResult);

      const grades = apiResult.success ? apiResult.data : { block_1: null, block_2: null, block_3: null, average: "0.0" }

      // 4. Mapear Asistencia y Actualizar Interfaz
      const attMap: Record<string, 'PRESENT' | 'ABSENT'> = {}
      profile.attendance?.forEach((a: any) => {
        attMap[a.date] = a.status
      })

      setData({
        ...profile,
        full_name: profile.full_name || 'Sin Nombre',
        grades: grades,
        attendance: attMap
      })
      
      setStatus('success')
      console.log("[SUCCESS] Sincronización completa para:", profile.full_name);

    } catch (err: any) {
      console.error("[FLOW_FATAL] Error en el flujo de datos:", err.message)
      setErrorMessage(err.message || "Error al cargar los datos del estudiante.")
      setStatus('error')
    }
  }

  const renderGradeBox = (label: string, value: number | null) => {
    const isPending = value === null || value === undefined;
    const numValue = Number(value);
    const isAprobado = numValue >= 7;

    return (
      <div className={`relative overflow-hidden bg-white p-8 rounded-[2.5rem] text-center border-4 transition-all shadow-sm ${
        isPending ? 'border-slate-100 bg-slate-50/30' : isAprobado ? 'border-green-500 bg-green-50/30' : 'border-red-500 bg-red-50/30'
      }`}>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${
          isPending ? 'text-slate-400' : isAprobado ? 'text-green-600' : 'text-red-600'
        }`}>{label}</p>
        
        <p className={`text-6xl font-black ${isPending ? 'text-slate-200' : 'text-slate-900'}`}>
          {isPending ? '-' : numValue.toFixed(1)}
        </p>

        <div className={`mt-4 inline-block px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
          isPending ? 'bg-slate-100 text-slate-400' : isAprobado ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {isPending ? 'Sin calificar' : isAprobado ? 'APROBADO' : 'REPROBADO'}
        </div>
      </div>
    )
  }

  // Pantalla de Carga Blindada
  if (status === 'loading') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-6">
      <div className="relative">
        <div className="h-24 w-24 border-8 border-indigo-100 rounded-full"></div>
        <div className="h-24 w-24 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="text-center">
        <p className="font-black text-slate-900 uppercase tracking-[0.4em] text-sm animate-pulse">Sincronizando portal</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">EduPro v2.0 • Cargando Calificaciones</p>
      </div>
    </div>
  )

  // Layout Base (Incluso si hay error parcial)
  if (!data && status !== 'error') return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
               <GraduationCap className="text-white h-6 w-6" />
             </div>
             <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Portal Estudiantil</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-12">
        {status === 'error' ? (
          <div className="bg-red-50 border-2 border-red-100 p-12 rounded-[3rem] text-center space-y-6">
            <div className="bg-red-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-red-100">
              <AlertCircle className="text-white h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-red-900 uppercase tracking-tighter">{errorMessage}</h2>
            <button onClick={fetchCompleteData} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-red-700 transition-all">REINTENTAR CARGA</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* COLUMNA IZQUIERDA */}
            <div className="lg:col-span-1 space-y-8">
              <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
                 <div className="h-32 w-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white mx-auto mb-6 shadow-2xl shadow-indigo-100 border-4 border-white">
                   {data?.full_name.charAt(0).toUpperCase()}
                 </div>
                 <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">{data?.full_name}</h1>
                 <p className="text-slate-400 font-bold mb-8">@{data?.github_username}</p>
                 
                 <div className="space-y-4 text-left">
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                       <DoorOpen className="h-5 w-5 text-indigo-400" />
                       <div><p className="text-[10px] font-black text-slate-400 uppercase leading-none">Salón</p><p className="font-bold text-slate-700">{data?.salon || 'No asignado'}</p></div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                       <Users className="h-5 w-5 text-indigo-400" />
                       <div><p className="text-[10px] font-black text-slate-400 uppercase leading-none">Grado/Grupo</p><p className="font-bold text-slate-700">{data?.grado} {data?.grupo}</p></div>
                    </div>
                 </div>
              </section>

              <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="bg-indigo-600 p-3 rounded-2xl"><Clock className="h-6 w-6 text-white" /></div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-70">Asistencia</p>
                 </div>
                 <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-6xl font-black">{Object.values(data?.attendance || {}).filter(s => s === 'ABSENT').length}</span>
                    <span className="text-xl font-bold opacity-40">/ 12 Faltas</span>
                 </div>
              </section>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="lg:col-span-2 space-y-10">
               <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-12">
                     <div className="flex items-center gap-4">
                        <div className="bg-green-50 p-3 rounded-2xl"><Award className="text-green-600 h-6 w-6" /></div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Estatus Académico</h3>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Promedio Final</p>
                        <p className={`text-5xl font-black tracking-tighter ${Number(data?.grades.average) >= 7 ? 'text-indigo-600' : 'text-red-500'}`}>
                          {data?.grades.average}
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {renderGradeBox('Bloque 1', data?.grades.block_1 ?? null)}
                     {renderGradeBox('Bloque 2', data?.grades.block_2 ?? null)}
                     {renderGradeBox('Bloque 3', data?.grades.block_3 ?? null)}
                  </div>
               </section>

               <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-10">
                     <div className="flex items-center gap-4">
                        <div className="bg-indigo-50 p-3 rounded-2xl"><Calendar className="text-indigo-600 h-6 w-6" /></div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase">Calendario</h3>
                     </div>
                  </div>
                  <div className="grid grid-cols-7 gap-4">
                     {['D','L','M','M','J','V','S'].map((d, i) => <div key={i} className="text-center text-[10px] font-black text-slate-300 uppercase py-2">{d}</div>)}
                     {Array.from({ length: 30 }).map((_, i) => (
                       <div key={i} className="aspect-square flex items-center justify-center rounded-2xl bg-slate-50 text-xs font-black text-slate-300 opacity-40">{i+1}</div>
                     ))}
                  </div>
               </section>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
