# Plan de Mejora de Trabajador: Integración de Conductor y Stitch

## Objetivo
Actualizar la "Constitución del Trabajador Definitivo" para incorporar el uso obligatorio del Modo de Planificación (Conductor) en proyectos complejos y el uso de herramientas de diseño visual (Stitch) para la creación de interfaces.

## Cambios Propuestos en la Política Global (`PROJECT_POLICY.md`)

1.  **Nuevo Protocolo: Modo de Planificación Obligatorio (Conductor)**
    *   **Regla:** Para cualquier encargo que implique la creación de un nuevo proyecto, una refactorización masiva o una funcionalidad compleja de múltiples archivos, el agente DEBE entrar en "Plan Mode" de forma autónoma.
    *   **Acción:** Antes de modificar el código fuente, el agente creará un documento de arquitectura en la carpeta `conductor/` detallando los pasos, la estructura de la base de datos y los componentes clave.
    *   **Beneficio:** Evita errores de diseño temprano, ahorra miles de tokens y asegura que el usuario apruebe la dirección técnica antes del desarrollo.

2.  **Nuevo Protocolo: Sincronización de Diseño (Stitch)**
    *   **Regla:** Al desarrollar componentes de interfaz de usuario (UI) o pantallas completas, el agente DEBE priorizar el uso de las herramientas de integración de Stitch (ej. `mcp_stitch_list_projects`, `mcp_stitch_get_screen`) para alinear el código con los sistemas de diseño existentes del usuario.
    *   **Acción:** Si el usuario solicita replicar una pantalla o seguir un diseño específico, el agente buscará primero en los proyectos de Stitch disponibles antes de improvisar el diseño con Tailwind/CSS.
    *   **Beneficio:** Interfaces consistentes con la marca del usuario, código más limpio y menos iteraciones de diseño visual.

## Pasos de Implementación

1.  Actualizar el archivo maestro `C:\Users\Genaro Aurelio\PROJECT_POLICY.md` para incluir estos dos nuevos protocolos bajo la sección de "Metodología de Trabajo Avanzada".
2.  Registrar una nueva memoria en el sistema confirmando que el agente ahora opera con capacidades de planificación arquitectónica y diseño visual integrado.

## Verificación
Una vez implementado, el agente podrá ser evaluado pidiendo un proyecto complejo; la respuesta inmediata deberá ser la creación de un plan en lugar de código directo.