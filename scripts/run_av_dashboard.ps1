<#
.SYNOPSIS
    Launches AV Dashboard on Windows and opens the browser.
.PARAMETER Interface
    CAN interface name (default: can2).
.PARAMETER Port
    HTTP port (default: 8080).
.PARAMETER Sim
    Force simulation mode.
#>
param (
    [string]$Interface = "can2",
    [int]$Port = 8080,
    [switch]$Sim = $false
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$WorkspaceRoot = Split-Path -Parent $ScriptDir
$env:PYTHONPATH = "$WorkspaceRoot;$env:PYTHONPATH"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " Starting AV Dashboard on port $Port" -ForegroundColor Cyan
Write-Host " URL: http://localhost:$Port" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan

$serverArgs = @("--interface", $Interface, "--port", $Port)
if ($Sim) { $serverArgs += "--sim" }

# Auto-open browser after 2 seconds
Start-Job -ScriptBlock {
    param($p)
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:$p"
} -ArgumentList $Port | Out-Null

$pythonExe = if (Test-Path "E:\miniconda\python.exe") { "E:\miniconda\python.exe" } else { "python" }
& $pythonExe -m tools.av_dashboard.backend.server @serverArgs
