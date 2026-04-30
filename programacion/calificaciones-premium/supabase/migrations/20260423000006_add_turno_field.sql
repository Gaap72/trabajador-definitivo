-- Añadir campo turno al perfil
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS turno TEXT;
