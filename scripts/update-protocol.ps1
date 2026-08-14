# Update etrike_protocol from the etrike repo
#
# This script fetches the YAML contract files from
# https://github.com/shakilapr/etrike and generates the C++ headers.
#
# The YAML contracts are the source of truth. The generated C++ header
# is derived from them by protocol/tools/protocol.py.
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

Write-Host "Fetching protocol contracts from etrike repo ($Branch)..." -ForegroundColor Cyan

# Create temp directory
$TMPDIR = New-Item -ItemType Directory -Path ([System.IO.Path]::GetTempPath() + [System.IO.Path]::GetRandomFileName())
try {
    # Clone only the protocol directory
    git clone --depth 1 --branch $Branch --filter=blob:none --sparse $ETRIKE_REPO "$TMPDIR\etrike"
    Set-Location "$TMPDIR\etrike"
    git sparse-checkout set protocol/contracts protocol/tools protocol/vectors protocol/core protocol/codecs/python

    # Get the commit hash
    $COMMIT_HASH = (git rev-parse --short HEAD)

    # Generate C++ header from YAML contracts
    Write-Host "Generating C++ header from YAML contracts..." -ForegroundColor Cyan
    Set-Location "$TMPDIR\etrike\protocol"
    python -m tools.protocol generate

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Generation failed. Check YAML contracts for errors." -ForegroundColor Red
        exit 1
    }

    # Copy generated C++ header
    Write-Host "Updating generated C++ header..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path "$PROTO_DIR\generated\cpp" -Force | Out-Null
    Copy-Item "$TMPDIR\etrike\protocol\generated\cpp\etrike_protocol.hpp" "$PROTO_DIR\generated\cpp\etrike_protocol.hpp" -Force

    # Update vectors (for golden-vector tests)
    if (Test-Path "$TMPDIR\etrike\protocol\vectors") {
        Write-Host "Updating vectors..." -ForegroundColor Cyan
        Remove-Item -Recurse -Force "$PROTO_DIR\vectors" -ErrorAction SilentlyContinue
        Copy-Item -Recurse "$TMPDIR\etrike\protocol\vectors" "$PROTO_DIR\vectors"
    }

    Write-Host ""
    Write-Host "Updated etrike_protocol from etrike@$COMMIT_HASH" -ForegroundColor Green
    Write-Host ""
    Write-Host "Source: protocol/contracts/*.yaml (YAML is the source of truth)"
    Write-Host "Output: generated/cpp/etrike_protocol.hpp"
    Write-Host ""
    Write-Host "Commit this change:" -ForegroundColor Yellow
    Write-Host "  git add autoware/src/our_packages/etrike_protocol/"
    Write-Host "  git commit -m `"sync(etrike_protocol): regenerate from etrike@$COMMIT_HASH`""
} finally {
    Set-Location $PROJECT_ROOT
    Remove-Item -Recurse -Force $TMPDIR -ErrorAction SilentlyContinue
}
