# ============================================================
# INSTALADOR BLINDADO - TRABAJADOR DEFINITIVO
# ============================================================

# 1. PEDIR PERMISOS DE ADMINISTRADOR AUTOMÃTICAMENTE
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Solicitando permisos de Administrador..." -ForegroundColor Yellow
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# 2. CONFIGURAR PERMISOS DE EJECUCIÃ“N
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

Clear-Host
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   ENTORNO PROFESIONAL: TRABAJADOR DEFINITIVO" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Este script configurarÃ¡ todo por ti." -ForegroundColor Gray

# FunciÃ³n para preguntar antes de instalar
function Confirm-Install {
    param([string]$name, [string]$id)
    
    $check = Get-Command $name -ErrorAction SilentlyContinue
    if ($check) {
        Write-Host "[OK] $name ya estÃ¡ instalado." -ForegroundColor Green
        return
    }

    $title = "Instalar $name"
    $message = "Â¿Deseas instalar $name ahora?"
    $options = [System.Management.Automation.Host.ChoiceDescription[]] @(
        New-Object System.Management.Automation.Host.ChoiceDescription "&SÃ­", "Instala la herramienta."
        New-Object System.Management.Automation.Host.ChoiceDescription "&No", "Salta este paso."
    )
    
    $result = $host.ui.PromptForChoice($title, $message, $options, 0)
    
    if ($result -eq 0) {
        Write-Host "[!] Instalando $name... No cierres la ventana." -ForegroundColor Yellow
        winget install -e --id $id --silent --accept-package-agreements --accept-source-agreements
        Write-Host "[OK] Proceso de $name finalizado." -ForegroundColor Green
    } else {
        Write-Host "[-] Se saltÃ³ la instalaciÃ³n de $name." -ForegroundColor Gray
    }
}

# --- EJECUCIÃ“N DE PASOS ---

Confirm-Install "git" "Git.Git"
Confirm-Install "node" "OpenJS.NodeJS.LTS"
Confirm-Install "dotnet" "Microsoft.DotNet.SDK.9"
Confirm-Install "gh" "GitHub.cli"

Write-Host "`n[...] Configurando Gemini CLI globalmente..." -ForegroundColor Cyan
npm install -g @google/gemini-cli

Write-Host "`n[...] Creando carpetas de trabajo..." -ForegroundColor Cyan
$folders = @("conductor", "programacion")
foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "    -> Carpeta '$folder' lista." -ForegroundColor Gray
    }
}

Write-Host "`n==============================================" -ForegroundColor Green
Write-Host "   TODO PREPARADO CORRECTAMENTE" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host "Para que los cambios surtan efecto, abre una NUEVA ventana de PowerShell."
Write-Host ""
Read-Host "Presiona ENTER para finalizar..."
