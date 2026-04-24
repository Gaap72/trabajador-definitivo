-- Agregar columna para la calificación del director
ALTER TABLE grades ADD COLUMN IF NOT EXISTS director_grade FLOAT DEFAULT 0;
