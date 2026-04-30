import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { alumnoId: string } }
) {
  const supabase = await createClient()
  const { alumnoId } = params

  try {
    // Consultar las calificaciones del alumno
    const { data, error } = await supabase
      .from('grades')
      .select('block_1, block_2, block_3')
      .eq('student_id', alumnoId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    // Valores por defecto si no hay registro
    const g = data || { block_1: null, block_2: null, block_3: null }
    
    // Cálculo de promedio (solo de bloques con nota)
    const scores = [g.block_1, g.block_2, g.block_3].filter(v => v !== null && v !== undefined)
    const average = scores.length > 0 
      ? (scores.reduce((a, b) => Number(a) + Number(b), 0) / 3).toFixed(1)
      : "0.0"

    return NextResponse.json({
      success: true,
      data: {
        block_1: g.block_1,
        block_2: g.block_2,
        block_3: g.block_3,
        average: average
      }
    })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
