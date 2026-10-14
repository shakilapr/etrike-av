# ==============================================================================
# open_remote_control.ps1
# ==============================================================================
# PowerShell wrapper to launch the E-Trike Remote Cockpit GUI on the Jetson over SSH.
#
# Usage:
#   pwsh scripts/open_remote_control.ps1                     # Default (can2, sim_mode:=true)
#   pwsh scripts/open_remote_control.ps1 -CanInterface can2 -SimMode true
#   pwsh scripts/open_remote_control.ps1 -TargetHost user@ip
# ==============================================================================

param (
    [string]$CanInterface = "can2",
    [string]$SimMode = "true",
    [string]$TargetHost = "med1@172.16.25.67"
)

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " Launching E-Trike Remote Cockpit on Jetson ($TargetHost)" -ForegroundColor Cyan
Write-Host " CAN Interface: $CanInterface | Sim Mode: $SimMode" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$remoteCmd = "bash ~/av_project/scripts/open_remote_control.sh $CanInterface $SimMode"

try {
    ssh -t $TargetHost $remoteCmd
} catch {
    Write-Warning "SSH execution encountered an error: $_"
}

Write-Host "`n[DONE] Remote Cockpit launch command dispatched." -ForegroundColor Green
