-- Añadir campos académicos al perfil del profesor
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS materia TEXT,
ADD COLUMN IF NOT EXISTS grado TEXT,
ADD COLUMN IF NOT EXISTS grupo TEXT,
ADD COLUMN IF NOT EXISTS salon TEXT;
