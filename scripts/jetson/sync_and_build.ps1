<#
.SYNOPSIS
    Jetson Connectivity, Sync Verification, and Compilation Manager
.DESCRIPTION
    Automates ping testing, Syncthing verification, and colcon compilation on the Jetson Orin.
.PARAMETER Action
    Action to perform: Ping, CheckSync, Build, or All (default: All).
.PARAMETER Packages
    Optional list of packages to compile (only used with Build / All).
#>
param(
    [ValidateSet("Ping", "CheckSync", "Build", "All")]
    [string]$Action = "All",

    [string[]]$Packages = @()
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

switch ($Action) {
    "Ping" {
        python "$scriptDir\check_connection.py"
    }
    "CheckSync" {
        python "$scriptDir\check_sync.py"
    }
    "Build" {
        if ($Packages.Count -gt 0) {
            python "$scriptDir\compile_packages.py" --packages $Packages
        } else {
            python "$scriptDir\compile_packages.py"
        }
    }
    "All" {
        Write-Host "`n=== [1/3] Checking Connection ===" -ForegroundColor Cyan
        python "$scriptDir\check_connection.py"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ABORT] Connection check failed." -ForegroundColor Red
            exit $LASTEXITCODE
        }

        Write-Host "`n=== [2/3] Checking Sync State ===" -ForegroundColor Cyan
        python "$scriptDir\check_sync.py"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[ABORT] Sync audit failed." -ForegroundColor Red
            exit $LASTEXITCODE
        }

        Write-Host "`n=== [3/3] Compiling Packages ===" -ForegroundColor Cyan
        if ($Packages.Count -gt 0) {
            python "$scriptDir\compile_packages.py" --packages $Packages
        } else {
            python "$scriptDir\compile_packages.py"
        }
    }
}
