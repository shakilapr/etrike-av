<#
.SYNOPSIS
    Launches CAN Watcher on Windows and optionally opens the browser.
.PARAMETER Interface
    CAN interface name (default: can2).
.PARAMETER Port
    HTTP port (default: 8080).
.PARAMETER Sim
    Force simulation mode.
#>
param (
    [string]$Interface = "can2",
    [int]$Port = 8000,
    [switch]$Sim = $false,
    [switch]$Desktop = $false
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$WorkspaceRoot = Split-Path -Parent $ScriptDir
$env:PYTHONPATH = "$WorkspaceRoot;$env:PYTHONPATH"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " Starting CANByte Watcher on port $Port" -ForegroundColor Cyan
Write-Host " URL: http://localhost:$Port" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan

$simArg = if ($Sim) { "--sim" } else { "" }

if ($Desktop) {
    # Launch Electron desktop window
    Write-Host " Launching Electron desktop window..." -ForegroundColor Cyan
    $electronPkg = Join-Path $WorkspaceRoot "tools\can_watcher\electron"
    Start-Process npx -ArgumentList "electron", $electronPkg
} else {
    # Auto-open browser after 1.5 seconds
    Start-Job -ScriptBlock {
        param($p)
        Start-Sleep -Seconds 2
        Start-Process "http://localhost:$p"
    } -ArgumentList $Port | Out-Null
}

python -m tools.can_watcher.backend.server --interface $Interface --port $Port $simArg

