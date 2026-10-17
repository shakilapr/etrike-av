# ==============================================================================
# record_and_fetch_sensors.ps1
# ==============================================================================
# Triggers on-demand raw LiDAR (Hesai XT32M2X) + Camera (Kinect v2) 30s recording
# on the Jetson Orin (med1) over SSH, and automatically transfers the resulting
# compressed MCAP rosbag to your local Windows workspace for experiments.
#
# Usage:
#   pwsh scripts/record_and_fetch_sensors.ps1                   # Default: 30s recording & auto-fetch
#   pwsh scripts/record_and_fetch_sensors.ps1 -Duration 15     # 15s recording
#   pwsh scripts/record_and_fetch_sensors.ps1 -WithPerception  # Also record perception debug objects/image
#   pwsh scripts/record_and_fetch_sensors.ps1 -NoFetch         # Record on med1 only, don't download
# ==============================================================================

param (
    [int]$Duration = 30,
    [string]$TargetHost = "",
    [string]$DestinationDir = "e:\work\av_project\data\recordings",
    [switch]$WithPerception,
    [switch]$NoFetch
)

$ErrorActionPreference = "Stop"

# Auto-detect target host if not explicitly specified
if (-not $TargetHost) {
    $candidateHosts = @("med1@10.226.206.145", "med1@172.16.25.67")
    foreach ($cand in $candidateHosts) {
        $testSsh = ssh -o ConnectTimeout=2 -o BatchMode=yes $cand "echo OK" 2>&1
        if ($LASTEXITCODE -eq 0) {
            $TargetHost = $cand
            break
        }
    }
    if (-not $TargetHost) {
        $TargetHost = "med1@10.226.206.145" # fallback
    }
}

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " On-Demand Raw Sensor Capture & Sync (${Duration}s)" -ForegroundColor Cyan
Write-Host " Target Host:  $TargetHost" -ForegroundColor Cyan
Write-Host " Duration:     $Duration seconds" -ForegroundColor Cyan
Write-Host " Local Dest:   $DestinationDir" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

# 1. Ensure local destination directory exists
if (-not (Test-Path $DestinationDir)) {
    New-Item -ItemType Directory -Force -Path $DestinationDir | Out-Null
}

# 2. Check remote host connectivity
Write-Host "--> Checking SSH connection to $TargetHost..." -ForegroundColor Yellow
$testSsh = ssh -o ConnectTimeout=5 -o BatchMode=yes $TargetHost "echo OK" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Cannot connect to $TargetHost via passwordless SSH."
    Write-Warning "Ensure the Jetson is powered on, connected to network, and your SSH key is authorized."
    Write-Warning "Details: $testSsh"
    exit 1
}
Write-Host "  [OK] Connection established to $TargetHost." -ForegroundColor Green

# 3. Construct remote recording command
$remoteArgs = "-d $Duration"
if ($WithPerception) {
    $remoteArgs += " --with-perception"
}
$remoteCmd = "bash ~/av_project/scripts/record_raw_sensors.sh $remoteArgs"

Write-Host "`n--> Triggering remote sensor recording on $TargetHost..." -ForegroundColor Cyan
Write-Host "    Executing: $remoteCmd" -ForegroundColor Gray
Write-Host "    (Please wait approximately $Duration seconds for capture to complete)`n" -ForegroundColor Yellow

$remoteOutput = ssh -t $TargetHost $remoteCmd 2>&1
$remoteOutput | ForEach-Object { Write-Host $_ }

# 4. Parse recording path from output
$remoteBagPath = ""
$bagName = ""
foreach ($line in $remoteOutput) {
    if ($line -match "RECORDING_PATH=(.+)") {
        $remoteBagPath = $Matches[1].Trim()
    }
    if ($line -match "RECORDING_NAME=(.+)") {
        $bagName = $Matches[1].Trim()
    }
}

if (-not $remoteBagPath) {
    Write-Warning "Could not automatically determine remote bag path from output."
    Write-Warning "Check if the remote script completed successfully."
    exit 1
}

Write-Host "`n======================================================================" -ForegroundColor Green
Write-Host " Remote capture complete!" -ForegroundColor Green
Write-Host " Remote Bag Path: $remoteBagPath" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green

# 5. Fetch recording to Windows host via SCP
if (-not $NoFetch) {
    Write-Host "`n--> Transferring recording to Windows host ($DestinationDir)..." -ForegroundColor Cyan
    $scpSrc = "${TargetHost}:${remoteBagPath}"
    
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    scp -r $scpSrc "$DestinationDir\"
    $stopwatch.Stop()

    if ($LASTEXITCODE -eq 0) {
        $localBagPath = Join-Path $DestinationDir $bagName
        $fileSize = (Get-ChildItem -Path $localBagPath -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        $fileSizeFormatted = "{0:N2} MB" -f $fileSize

        Write-Host "`n======================================================================" -ForegroundColor Green
        Write-Host " [SUCCESS] Dataset successfully transferred to Windows!" -ForegroundColor Green
        Write-Host " Local Path:   $localBagPath" -ForegroundColor Green
        Write-Host " Total Size:   $fileSizeFormatted" -ForegroundColor Green
        Write-Host " Transfer:     $([math]::Round($stopwatch.Elapsed.TotalSeconds, 1)) seconds" -ForegroundColor Green
        Write-Host "======================================================================" -ForegroundColor Green
        Write-Host " You can now load the MCAP file for offline experiments using:" -ForegroundColor Gray
        Write-Host "   python -c `"import mcap; print('MCAP ready!')`"" -ForegroundColor Gray
    } else {
        Write-Warning "SCP transfer encountered an error. Exit code: $LASTEXITCODE"
    }
} else {
    Write-Host "--> [-NoFetch] skipped file download. File is stored on med1 at $remoteBagPath." -ForegroundColor Yellow
}
