function New-Checkpoint {
    param([string]$Message = "Auto-save antes de nueva instruccion")
    if (git status --porcelain) {
        git add .
        git commit -m "AUTO: $Message" --allow-empty
        # Guardamos el hash para reversiones rapidas
        git rev-parse HEAD | Out-File .last_checkpoint -Encoding utf8
    }
}
function Undo-LastChange {
    if (Test-Path .last_checkpoint) {
        $hash = Get-Content .last_checkpoint
        git reset --hard $hash
        Write-Host "â†©ï¸  ReversiÃ³n completada al punto anterior: $hash" -ForegroundColor Yellow
    } else {
        git reset --hard HEAD~1
        Write-Host "â†©ï¸  ReversiÃ³n simple completada." -ForegroundColor Yellow
    }
}
