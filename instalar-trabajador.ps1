# Script de Instalación Automática - TRABAJADOR DEFINITIVO
# IMPORTANTE: Si se cierra rápido, abre PowerShell como Administrador y arrastra este archivo adentro.

$ErrorActionPreference = "Continue"

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   PREPARANDO EL TRABAJADOR DEFINITIVO" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Función para instalar con aviso visual claro
function Install-Tool {
    param([string]$name, [string]$id)
    Write-Host "[...] Buscando $name..." -ForegroundColor Gray
    $check = Get-Command $name -ErrorAction SilentlyContinue
    if (!$check) {
        Write-Host "[!] Instalando $name (Esto puede tardar unos minutos)..." -ForegroundColor Yellow
        winget install -e --id $id --silent --accept-package-agreements --accept-source-agreements
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] $name instalado correctamente." -ForegroundColor Green
        } else {
            Write-Host "[X] Error al instalar $name. Intenta instalarlo manualmente." -ForegroundColor Red
        }
    } else {
        Write-Host "[OK] $name ya está presente en el sistema." -ForegroundColor Green
    }
}

# 1. Herramientas base
Install-Tool "git" "Git.Git"
Install-Tool "node" "OpenJS.NodeJS.LTS"
Install-Tool "dotnet" "Microsoft.DotNet.SDK.9"
Install-Tool "gh" "GitHub.cli"

# 2. Gemini CLI
Write-Host "[...] Instalando Gemini CLI globalmente..." -ForegroundColor Cyan
npm install -g @google/gemini-cli
Write-Host "[OK] Gemini CLI configurado." -ForegroundColor Green

# 3. Estructura de carpetas
Write-Host "[...] Verificando carpetas de trabajo..." -ForegroundColor Cyan
$folders = @("conductor", "programacion")
foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "    -> Carpeta '$folder' creada." -ForegroundColor Gray
    }
}

Write-Host "`n==============================================" -ForegroundColor Green
Write-Host "   INSTALACIÃ“N COMPLETADA CON Ã‰XITO" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host "PASOS FINALES:"
Write-Host "1. CIERRA esta ventana."
Write-Host "2. Abre una NUEVA terminal de PowerShell."
Write-Host "3. Escribe 'gemini login' para empezar."
Write-Host ""
Read-Host "Presiona ENTER para salir de este instalador..."
