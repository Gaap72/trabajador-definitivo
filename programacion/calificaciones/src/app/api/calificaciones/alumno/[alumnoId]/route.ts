import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ alumnoId: string }> }
) {
  try {
    // 1. En Next.js 15+, los params DEBEN ser esperados (await)
    const { alumnoId } = await params;
    const supabase = await createClient()

    if (!alumnoId || alumnoId === 'undefined') {
      return NextResponse.json({ success: false, error: "ID de alumno inválido" }, { status: 400 })
    }

    // 2. Consulta optimizada a la tabla de calificaciones
    const { data, error } = await supabase
      .from('grades')
      .select('block_1, block_2, block_3')
      .eq('student_id', alumnoId)
      .maybeSingle() // Usamos maybeSingle para evitar errores si no existe la fila

    if (error) {
      console.error(`[SERVER_DB_ERROR] ${error.message}`);
      throw error;
    }

    // 3. Preparación de datos (Cero discrepancia)
    const grades = data || { block_1: null, block_2: null, block_3: null };
    const b1 = grades.block_1;
    const b2 = grades.block_2;
    const b3 = grades.block_3;

    // Cálculo del promedio en servidor
    const validScores = [b1, b2, b3].filter(v => v !== null).map(Number);
    const average = validScores.length > 0 
      ? (validScores.reduce((a, b) => a + b, 0) / 3).toFixed(1)
      : "0.0";

    return NextResponse.json({
      success: true,
      data: {
        block_1: b1,
        block_2: b2,
        block_3: b3,
        average: average
      }
    })

  } catch (error: any) {
    console.error("[CRITICAL_API_ERROR]", error.message);
    return NextResponse.json({ 
      success: false, 
      error: "Error interno en el servidor de calificaciones" 
    }, { status: 500 })
  }
}
