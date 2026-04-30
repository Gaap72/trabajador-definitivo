# Plan de Implementación: Sistema de Calificaciones y Asistencia

## 1. Background & Motivación
El objetivo es construir una plataforma web donde un profesor pueda gestionar las calificaciones de tres bloques (cuatrimestre) y la asistencia diaria de sus alumnos. Los estudiantes deben poder consultar su propio progreso de forma remota y transparente. Todo el sistema estará unificado bajo cuentas de GitHub para garantizar la identidad.

## 2. Scope & Impacto
*   **Roles:** Dos identidades diferenciadas (Profesor y Alumno).
*   **Autenticación:** Inicio de sesión exclusivo mediante GitHub OAuth.
*   **Gestión de Calificaciones:** Registro de notas para tres bloques.
*   **Sistema de Asistencia:** Un calendario interactivo donde el profesor registra faltas o asistencias.
*   **Regla de Negocio Crítica:** Si un alumno alcanza o supera las **12 faltas**, su estado pasará automáticamente a reprobatorio, sin importar sus calificaciones académicas.
*   **Interfaz de Alumno:** Vista de solo lectura (Dashboard personal).

## 3. Solución Propuesta (Next.js + Supabase)
Utilizaremos Next.js (App Router) para el frontend y Supabase como backend (Base de Datos PostgreSQL y Autenticación).

### Esquema de Base de Datos Principal:
1.  `profiles`: `id` (auth.users), `github_username`, `role` (TEACHER | STUDENT), `full_name`.
2.  `grades`: `id`, `student_id` (fk profiles), `block_1`, `block_2`, `block_3`, `is_failed_by_absences` (boolean).
3.  `attendance`: `id`, `student_id` (fk profiles), `date` (date), `status` (PRESENT | ABSENT).

### Flujo de Asignación de Roles:
1.  El usuario inicia sesión con GitHub por primera vez.
2.  Se le redirige a una pantalla de configuración inicial.
3.  Se le ofrece introducir un "Código de Profesor" secreto.
4.  Si el código es correcto, su rol en `profiles` se establece como `TEACHER`. De lo contrario, se establece como `STUDENT`.

### Funcionalidad de Profesor (TEACHER):
*   Panel principal con la lista de alumnos.
*   Módulo de calificaciones para actualizar las notas de los tres bloques.
*   Módulo de calendario donde selecciona una fecha y marca la asistencia general de todos los alumnos o individual.
*   Alerta visual en alumnos que llegan a 12 faltas.

### Funcionalidad de Alumno (STUDENT):
*   Panel personal donde solo puede ver su propia fila de calificaciones.
*   Calendario personal mostrando los días que faltó.
*   Mensaje de "Reprobado por inasistencias" si el contador llega a 12.

## 4. Alternativas Consideradas
*   **Backend Clásico (React + Node + SQL):** Descartado por requerir un servidor adicional, lo que complica el despliegue rápido.
*   **Asignación Manual de Rol:** Descartado a favor de un sistema de "Código de Registro" que ofrece mayor flexibilidad en la creación de múltiples cuentas de profesores si fuera necesario.

## 5. Plan de Implementación por Fases

*   **Fase 1: Configuración del Proyecto.**
    *   Inicializar aplicación Next.js en la carpeta `calificaciones`.
    *   Instalar dependencias (`@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, TailwindCSS).
    *   Configurar variables de entorno y conexión inicial a Supabase.
*   **Fase 2: Base de Datos y Seguridad (Supabase).**
    *   Crear tablas (`profiles`, `grades`, `attendance`).
    *   Configurar Row Level Security (RLS) para que los alumnos solo puedan leer sus propios datos, y el profesor tenga acceso total.
    *   Configurar GitHub OAuth Provider en el panel de Supabase.
*   **Fase 3: Autenticación y Onboarding.**
    *   Crear páginas de Login y de verificación de Código de Registro.
    *   Implementar middleware de Next.js para proteger rutas según el rol del usuario.
*   **Fase 4: Panel del Profesor.**
    *   Desarrollar tabla interactiva de calificaciones.
    *   Desarrollar componente de calendario (selector de fecha) para pasar lista.
    *   Lógica para calcular totales y determinar estado reprobatorio (>= 12 faltas).
*   **Fase 5: Panel del Alumno.**
    *   Crear la vista de solo lectura del estado académico y de asistencia.
*   **Fase 6: Refinamiento Visual.**
    *   Aplicar estilos modernos, estados de carga y feedback visual.

## 6. Verificación
*   Test manual de inicio de sesión con una cuenta de prueba de GitHub como Alumno.
*   Test manual de inicio de sesión con código secreto como Profesor.
*   El Profesor asigna 12 faltas a un alumno; verificar que el estado del alumno cambie a reprobado.
*   El Alumno intenta acceder a una URL de edición del profesor; verificar que sea bloqueado (Middleware/RLS).

## 7. Migración & Rollback
Dado que es un proyecto nuevo, no requiere migración de datos previos. Cualquier fallo en la configuración de la base de datos se revertirá borrando el proyecto de Supabase y recreando las tablas mediante un script SQL que se incluirá en el repositorio.