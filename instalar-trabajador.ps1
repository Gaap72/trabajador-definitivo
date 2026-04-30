# Script de Instalación Automática para el Trabajador Definitivo
# Ejecuta este script como administrador para mejores resultados

Write-Host "--- Iniciando Preparación del Entorno ---" -ForegroundColor Cyan

# 1. Verificar e Instalar herramientas base usando Winget (estándar en Windows)
function Install-IfNeeded {
    param([string]$name, [string]$id)
    if (!(Get-Command $name -ErrorAction SilentlyContinue)) {
        Write-Host "Instalando $name..." -ForegroundColor Yellow
        winget install -e --id $id --silent --accept-package-agreements --accept-source-agreements
    } else {
        Write-Host "âœ… $name ya está instalado." -ForegroundColor Green
    }
}

Write-Host "Instalando dependencias de software..." -ForegroundColor Cyan
Install-IfNeeded "git" "Git.Git"
Install-IfNeeded "node" "OpenJS.NodeJS.LTS"
Install-IfNeeded "dotnet" "Microsoft.DotNet.SDK.9"
Install-IfNeeded "gh" "GitHub.cli"

# 2. Instalar Gemini CLI globalmente
Write-Host "Instalando Gemini CLI..." -ForegroundColor Cyan
npm install -g @google/gemini-cli

# 3. Preparar estructura de carpetas si no existen
Write-Host "Verificando estructura de carpetas..." -ForegroundColor Cyan
$folders = @("conductor", "programacion")
foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "Carpetilla '$folder' creada." -ForegroundColor Gray
    }
}

Write-Host "`n--- TODO LISTO ---" -ForegroundColor Green
Write-Host "1. Reinicia la terminal (o la PC)."
Write-Host "2. Escribe 'gemini login' para entrar."
Write-Host "3. ¡Ya puedes seguir con el trabajador definitivo!"
