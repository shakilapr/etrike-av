# ==============================================================================
# close_everything.ps1
# ==============================================================================
# PowerShell wrapper to trigger full system shutdown on the Jetson over SSH.
#
# Usage:
#   pwsh scripts/close_everything.ps1                   # Clean shutdown + restart container clean
#   pwsh scripts/close_everything.ps1 -StopContainer   # Clean shutdown + stop Docker container
#   pwsh scripts/close_everything.ps1 -RmContainer     # Clean shutdown + remove Docker container
# ==============================================================================

param (
    [switch]$StopContainer,
    [switch]$RmContainer,
    [switch]$KeepContainer,
    [string]$TargetHost = "med1@172.16.25.67"
)

$flag = ""
if ($StopContainer) {
    $flag = "--stop-container"
} elseif ($RmContainer) {
    $flag = "--rm-container"
} elseif ($KeepContainer) {
    $flag = "--keep-container"
}

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " Closing Everything on Jetson ($TargetHost)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$remoteCmd = "bash ~/av_project/scripts/close_everything.sh $flag"

try {
    ssh -t $TargetHost $remoteCmd
} catch {
    Write-Warning "SSH execution encountered an error: $_"
}

Write-Host "`n[DONE] Shutdown command completed." -ForegroundColor Green
