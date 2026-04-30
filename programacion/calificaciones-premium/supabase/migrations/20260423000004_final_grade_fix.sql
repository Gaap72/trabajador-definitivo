-- REPARACIÓN DEFINITIVA DE PERMISOS Y ESTRUCTURA DE BOLETAS
-- 1. Eliminar cualquier restricción vieja que bloquee al maestro
DROP POLICY IF EXISTS "Profesores pueden gestionar notas" ON grades;
DROP POLICY IF EXISTS "Profesores pueden insertar/actualizar notas" ON grades;

-- 2. Crear política de ACCESO TOTAL para el rol TEACHER
CREATE POLICY "MAESTRO_ADMIN_POLICY" ON grades
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'TEACHER')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'TEACHER')
  );

-- 3. Asegurar integridad: Crear boletas vacías para todos los estudiantes actuales
INSERT INTO grades (student_id, block_1, block_2, block_3)
SELECT id, 0, 0, 0 FROM profiles 
WHERE role = 'STUDENT'
ON CONFLICT (student_id) DO NOTHING;
