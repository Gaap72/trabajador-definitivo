-- Añadir campo tutor al perfil
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS tutor TEXT;
