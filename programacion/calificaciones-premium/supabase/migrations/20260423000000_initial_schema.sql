-- 1. Crear tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  github_username TEXT UNIQUE,
  full_name TEXT,
  role TEXT CHECK (role IN ('TEACHER', 'STUDENT')) DEFAULT 'STUDENT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Crear tabla de calificaciones
CREATE TABLE grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  block_1 FLOAT DEFAULT 0,
  block_2 FLOAT DEFAULT 0,
  block_3 FLOAT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Crear tabla de asistencia
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('PRESENT', 'ABSENT')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(student_id, date)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Perfiles visibles para todos los autenticados" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para calificaciones
CREATE POLICY "Alumnos pueden ver sus propias notas" ON grades
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Profesores pueden ver todas las notas" ON grades
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'TEACHER')
  );

CREATE POLICY "Profesores pueden insertar/actualizar notas" ON grades
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'TEACHER')
  );

-- Políticas para asistencia
CREATE POLICY "Alumnos pueden ver su propia asistencia" ON attendance
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Profesores pueden ver toda la asistencia" ON attendance
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'TEACHER')
  );

CREATE POLICY "Profesores pueden gestionar asistencia" ON attendance
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'TEACHER')
  );

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, github_username, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.grades (student_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
