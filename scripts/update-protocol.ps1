# Update etrike_protocol from the etrike repo
#
# This script fetches the latest generated protocol files from
# https://github.com/shakilapr/etrike and updates the local copy.
#
# Usage:
#   scripts\update-protocol.ps1          # fetches latest from main branch
#   scripts\update-protocol.ps1 <branch> # fetches from specific branch

param(
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

$ETRIKE_REPO = "https://github.com/shakilapr/etrike.git"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PROJECT_ROOT = Split-Path -Parent $SCRIPT_DIR
$PROTO_DIR = "$PROJECT_ROOT\autoware\src\our_packages\etrike_protocol"

Write-Host "Fetching protocol files from etrike repo ($Branch)..." -ForegroundColor Cyan

# Create temp directory
$TMPDIR = New-Item -ItemType Directory -Path ([System.IO.Path]::GetTempPath() + [System.IO.Path]::GetRandomFileName())
try {
    # Clone only the protocol directory
    git clone --depth 1 --branch $Branch --filter=blob:none --sparse $ETRIKE_REPO "$TMPDIR\etrike"
    Set-Location "$TMPDIR\etrike"
    git sparse-checkout set protocol/generated

    # Copy generated files
    Write-Host "Updating generated files..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force "$PROTO_DIR\generated" -ErrorAction SilentlyContinue
    Copy-Item -Recurse "$TMPDIR\etrike\protocol\generated" "$PROTO_DIR\generated"

    # Remove non-ROS files from generated
    Remove-Item -Recurse -Force "$PROTO_DIR\generated\python" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "$PROTO_DIR\generated\typescript" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "$PROTO_DIR\generated\csv" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "$PROTO_DIR\generated\dbc" -ErrorAction SilentlyContinue
    Remove-Item -Force "$PROTO_DIR\generated\__init__.py" -ErrorAction SilentlyContinue
    Remove-Item -Force "$PROTO_DIR\generated\capabilities.json" -ErrorAction SilentlyContinue
    Remove-Item -Force "$PROTO_DIR\generated\contract-schema.json" -ErrorAction SilentlyContinue
    Remove-Item -Force "$PROTO_DIR\generated\discovery.json" -ErrorAction SilentlyContinue
    Remove-Item -Force "$PROTO_DIR\generated\errors.json" -ErrorAction SilentlyContinue

    # Also update vectors if they exist (for golden-vector tests)
    if (Test-Path "$TMPDIR\etrike\protocol\vectors") {
        Write-Host "Updating vectors..." -ForegroundColor Cyan
        Remove-Item -Recurse -Force "$PROTO_DIR\vectors" -ErrorAction SilentlyContinue
        Copy-Item -Recurse "$TMPDIR\etrike\protocol\vectors" "$PROTO_DIR\vectors"
    }

    # Get the commit hash for the update note
    $COMMIT_HASH = (git rev-parse --short HEAD)
    Write-Host ""
    Write-Host "Updated etrike_protocol from etrike@$COMMIT_HASH" -ForegroundColor Green
    Write-Host ""
    Write-Host "Files updated:"
    Write-Host "  generated/cpp/etrike_protocol.hpp"
    Write-Host "  vectors/"
    Write-Host ""
    Write-Host "Commit this change:" -ForegroundColor Yellow
    Write-Host "  git add autoware/src/our_packages/etrike_protocol/"
    Write-Host "  git commit -m `"sync(etrike_protocol): update from etrike@$COMMIT_HASH`""
} finally {
    Set-Location $PROJECT_ROOT
    Remove-Item -Recurse -Force $TMPDIR -ErrorAction SilentlyContinue
}
