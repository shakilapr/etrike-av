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
    [switch]$RestartContainer,
    [switch]$StopContainer,
    [switch]$RmContainer,
    [switch]$KeepContainer,
    [switch]$ResetCan,
    [switch]$LocalOnly,
    [string]$TargetHost = "med1@172.16.25.67"
)

$flag = ""
if ($RestartContainer) {
    $flag += " --restart-container"
}
if ($StopContainer) {
    $flag += " --stop-container"
} elseif ($RmContainer) {
    $flag += " --rm-container"
} elseif ($KeepContainer) {
    $flag += " --keep-container"
}
if ($ResetCan) {
    $flag += " --reset-can"
}

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " Closing Everything (Local Windows & Jetson Stack)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Clean local Windows processes on development / dashboard ports
Write-Host "--> Checking local Windows listeners (ports 8080, 8000, 5173)..." -ForegroundColor Yellow
$ports = @(8080, 8000, 5173)
foreach ($p in $ports) {
    try {
        $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
        if ($conns) {
            $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($procId in $pids) {
                if ($procId -gt 0) {
                    Write-Host "  Stopping local process (PID $procId) listening on port $p..." -ForegroundColor Yellow
                    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                }
            }
        }
    } catch {
        # ignore port query errors
    }
}

# 2. Remote Jetson Shutdown (if not -LocalOnly)
if (-not $LocalOnly) {
    Write-Host "--> Triggering remote shutdown on Jetson ($TargetHost)..." -ForegroundColor Cyan
    $remoteCmd = "bash ~/av_project/scripts/close_everything.sh $flag"
    try {
        ssh -t $TargetHost $remoteCmd
    } catch {
        Write-Warning "SSH execution encountered an error: $_"
    }
} else {
    Write-Host "--> Skipped remote Jetson shutdown (-LocalOnly specified)." -ForegroundColor Gray
}

Write-Host "`n[DONE] Shutdown sequence completed." -ForegroundColor Green
