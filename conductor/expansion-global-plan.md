# Plan de Expansión Global: Sincronización Multi-Dispositivo

## Objetivo
Permitir que el ecosistema del "Trabajador Definitivo" (herramientas universales, comandos personalizados, políticas y memorias de IA) pueda ser instalado, utilizado y sincronizado en cualquier otro ordenador externo.

## Estrategia de Implementación (Cloud Workspace)

Para lograr la portabilidad sin depender de configuraciones manuales complejas, utilizaremos **GitHub** como nuestro servidor en la nube centralizado para las herramientas, aprovechando que GitHub CLI (`gh`) ya está instalado en el sistema.

### 1. Repositorio Central de Configuración (`gemini-workspace-config`)
Se creará un repositorio privado en GitHub destinado exclusivamente a almacenar "el cerebro" y las herramientas del trabajador:
- Los scripts universales (`checkpoint.ps1`, `cleanup-workspace.ps1`, `db-automation.ps1`).
- La constitución del trabajador (`PROJECT_POLICY.md`).
- El script de instalación (`install.ps1`).

### 2. Script de Instalación Universal (`install.ps1`)
Se desarrollará un script de un solo clic que, al ejecutarse en un ordenador nuevo, realizará lo siguiente:
- Descargará las herramientas desde GitHub.
- Creará la carpeta global `.gemini/bin` en el nuevo dispositivo.
- Configurará automáticamente el `$PROFILE` de PowerShell en el nuevo equipo con todas las funciones (`save`, `sudo`, `te-invoco`, `cleanup`).

### 3. Comando de Sincronización Automática (`sync-workspace`)
Se añadirá un nuevo comando universal al `$PROFILE` actual llamado `sync-workspace`.
- **Función:** Al ejecutarlo, guardará cualquier cambio que hayas hecho a tus herramientas o políticas locales y lo subirá a GitHub.
- **Beneficio:** Si mejoras tu trabajador en tu PC principal, al hacer `sync-workspace` y luego ejecutarlo en tu laptop o trabajo, ambos dispositivos tendrán las mismas habilidades actualizadas.

## Pasos para la Ejecución
1.  Inicializar una carpeta local como repositorio de configuración.
2.  Copiar todos los scripts actuales (`.gemini/bin` y `PROJECT_POLICY.md`) a esta carpeta.
3.  Escribir el `install.ps1`.
4.  Subir el repositorio a GitHub de forma privada usando `gh repo create`.
5.  Actualizar el `$PROFILE` local con el nuevo comando `sync-workspace`.

## Verificación
Una vez terminado, el usuario tendrá un repositorio privado en su GitHub y un comando simple (`sync-workspace`) para mantener todos sus ordenadores conectados a la misma inteligencia artificial.