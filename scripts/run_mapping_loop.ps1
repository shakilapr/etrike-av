# ==============================================================================
# run_mapping_loop.ps1
#
# Runs the automated mapping playback loop on the Jetson Orin via SSH.
# Replays the trimmed driving loop, holds the completed map on the Jetson monitor
# for 20s, then resets and repeats.
#
# Usage:
#   pwsh scripts/run_mapping_loop.ps1              # Run continuous 20s repeat loop
#   pwsh scripts/run_mapping_loop.ps1 -HoldTime 30 # Hold map for 30s before reset
#   pwsh scripts/run_mapping_loop.ps1 -Once        # Run single pass only
# ==============================================================================

param(
    [int]$HoldTime = 20,
    [switch]$Once
)

$targetHost = "med1@172.16.25.67"
$onceFlag = if ($Once) { "1" } else { "0" }

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting SLAM Mapping Loop on Jetson ($targetHost)" -ForegroundColor Cyan
Write-Host "  Hold Time: ${HoldTime}s | Mode: $(if ($Once) { 'Single Run' } else { 'Continuous Loop' })" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop the loop at any time." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$sshCmd = "docker exec -it -e HOLD_TIME=$HoldTime -e ONCE=$onceFlag autoware_test loop_mapping.sh"
ssh -t $targetHost $sshCmd
