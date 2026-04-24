-- Reparación de políticas de seguridad para el Profesor
DROP POLICY IF EXISTS "Profesores pueden gestionar notas" ON grades;
CREATE POLICY "Profesores pueden gestionar notas" ON grades
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'TEACHER'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'TEACHER'));

DROP POLICY IF EXISTS "Profesores pueden gestionar asistencia" ON attendance;
CREATE POLICY "Profesores pueden gestionar asistencia" ON attendance
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'TEACHER'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'TEACHER'));

-- Asegurar que todos los alumnos tengan una fila en grades
INSERT INTO grades (student_id)
SELECT id FROM profiles 
WHERE role = 'STUDENT'
ON CONFLICT (student_id) DO NOTHING;
