#!/usr/bin/env pwsh
<#
.SYNOPSIS
    E-Trike AV Repository Sync Audit
    Compares every local component against its online GitHub source and reports drift.

.DESCRIPTION
    Checks:
    1. Main repo (etrike-av) — local vs origin/main
    2. our_packages/ — uncommitted or untracked changes
    3. Nebula patch files — local vs upstream v1.1.0 + patch script
    4. Untracked scripts — files that should be committed
    5. Subtree sync — our_packages vs etrike repo
    6. Junk files — Syncthing conflicts, __pycache__, etc.

.PARAMETER Fix
    If specified, generates a fix script instead of just reporting.

.PARAMETER ShowDiffs
    Show full diffs instead of summaries.
#>
param(
    [switch]$Fix,
    [switch]$ShowDiffs
)

$ErrorActionPreference = "Continue"
$root = "e:\work\av_project"
Set-Location $root

# --- Helpers ---
function Write-Section($title) {
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
}

function Write-Ok($msg) { Write-Host "  [OK]      $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  [WARN]    $msg" -ForegroundColor Yellow }
function Write-Err($msg) { Write-Host "  [ISSUE]   $msg" -ForegroundColor Red }
function Write-Info($msg) { Write-Host "  [INFO]    $msg" -ForegroundColor Gray }
function Write-FixCmd($msg) { Write-Host "  [FIX]     $msg" -ForegroundColor Magenta }

$fixCommands = @()
$issues = 0
$warnings = 0

# ============================================================
# 1. MAIN REPO: local vs origin/main
# ============================================================
Write-Section "1. Main Repo (etrike-av) — Local vs GitHub"

git fetch origin --quiet 2>$null

$localHead = (git rev-parse HEAD 2>&1).Trim()
$remoteHead = (git rev-parse origin/main 2>&1).Trim()

if ($localHead -eq $remoteHead) {
    Write-Ok "Local HEAD matches origin/main ($($localHead.Substring(0,7)))"
} else {
    $ahead = (git rev-list origin/main..HEAD --count 2>&1).Trim()
    $behind = (git rev-list HEAD..origin/main --count 2>&1).Trim()

    if ([int]$ahead -gt 0) {
        $warnings++
        Write-Warn "Local is $ahead commit(s) AHEAD of origin/main — needs push"
        git log origin/main..HEAD --oneline 2>&1 | ForEach-Object { Write-Info "  $_" }
        Write-FixCmd "git push origin main"
        $fixCommands += "git push origin main"
    }
    if ([int]$behind -gt 0) {
        $issues++
        Write-Err "Local is $behind commit(s) BEHIND origin/main — needs pull"
        Write-FixCmd "git pull origin main"
        $fixCommands += "git pull origin main"
    }
}

# Check for uncommitted tracked file changes
$trackedDiff = git diff --name-only 2>&1
if ([string]::IsNullOrWhiteSpace($trackedDiff)) {
    Write-Ok "No uncommitted changes to tracked files"
} else {
    $issues++
    Write-Err "Modified tracked files not yet committed:"
    ($trackedDiff -split "`n") | Where-Object { $_ } | ForEach-Object {
        Write-Info "  $_"
    }
    Write-FixCmd 'git add <files> && git commit -m "type(scope): description"'
}

# Check for staged but uncommitted
$stagedDiff = git diff --cached --name-only 2>&1
if (-not [string]::IsNullOrWhiteSpace($stagedDiff)) {
    $warnings++
    Write-Warn "Staged changes not yet committed:"
    ($stagedDiff -split "`n") | Where-Object { $_ } | ForEach-Object { Write-Info "  $_" }
    Write-FixCmd 'git commit -m "type(scope): description"'
}

# ============================================================
# 2. OUR_PACKAGES: uncommitted / untracked
# ============================================================
Write-Section "2. our_packages/ — Uncommitted Changes"

$ourPkgDiff = git diff --name-only -- autoware/src/our_packages/ 2>&1
if ([string]::IsNullOrWhiteSpace($ourPkgDiff)) {
    Write-Ok "All tracked files in our_packages/ match HEAD"
} else {
    $issues++
    Write-Err "Modified files in our_packages/:"
    ($ourPkgDiff -split "`n") | Where-Object { $_ } | ForEach-Object {
        Write-Info "  $_"
        if ($ShowDiffs) {
            git diff -- $_ 2>&1 | Select-Object -First 30 | ForEach-Object { Write-Info "    $_" }
        }
    }
    Write-FixCmd 'git add autoware/src/our_packages/ && git commit -m "feat(our_packages): <description>"'
    $fixCommands += 'git add autoware/src/our_packages/ && git commit -m "update our_packages"'
}

# Untracked files (excluding nested git repos and __pycache__)
$untracked = git ls-files --others --exclude-standard -- autoware/src/our_packages/ 2>&1 |
    Where-Object { $_ -and $_ -notmatch "__pycache__" }
if ([string]::IsNullOrWhiteSpace(($untracked -join ""))) {
    Write-Ok "No untracked files in our_packages/"
} else {
    $warnings++
    Write-Warn "Untracked files in our_packages/ (should they be committed?):"
    ($untracked -split "`n") | Where-Object { $_ } | ForEach-Object {
        Write-Info "  $_"
    }
    Write-FixCmd 'git add <file> && git commit -m "feat(package): add <file>"'
}

# ============================================================
# 3. NEBULA PATCH VERIFICATION — local vs upstream + patch
# ============================================================
Write-Section "3. Nebula Patch — Local vs Upstream v1.1.0"

$nebulaSrc = "$root\autoware\src\sensor_component\external\nebula\src"
$tempDir = "$env:TEMP\nebula_audit_$([guid]::NewGuid().ToString('N').Substring(0,8))"

if (-not (Test-Path "$nebulaSrc\nebula_hesai")) {
    Write-Warn "Nebula source not found (not yet bootstrapped?) — skipping"
} else {
    Write-Info "Cloning upstream tier4/nebula v1.1.0 for comparison..."
    $cloneOut = git clone --depth 1 --branch v1.1.0 --no-checkout "https://github.com/tier4/nebula.git" $tempDir 2>&1

    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Could not clone upstream nebula (network issue?) — skipping"
        Write-Info $cloneOut
    } else {
        Push-Location $tempDir
        git checkout HEAD -- `
            src/nebula_hesai/nebula_hesai_common/include/nebula_hesai_common/hesai_common.hpp `
            src/nebula_hesai/nebula_hesai_decoders/include/nebula_hesai_decoders/decoders/hesai_sensor.hpp `
            src/nebula_hesai/nebula_hesai_decoders/include/nebula_hesai_decoders/decoders/pandar_xt32m.hpp `
            src/nebula_hesai/nebula_hesai_decoders/include/nebula_hesai_decoders/decoders/hesai_decoder.hpp `
            src/nebula_hesai/nebula_hesai/src/hesai_ros_wrapper.cpp 2>&1 | Out-Null
        Pop-Location

        $patchedFiles = @(
            @{ Relative = "nebula_hesai\nebula_hesai_common\include\nebula_hesai_common\hesai_common.hpp";
               Marker = "HesaiFiretimeConfiguration"; Name = "hesai_common.hpp" },
            @{ Relative = "nebula_hesai\nebula_hesai_decoders\include\nebula_hesai_decoders\decoders\hesai_sensor.hpp";
               Marker = "set_firetime_configuration"; Name = "hesai_sensor.hpp" },
            @{ Relative = "nebula_hesai\nebula_hesai_decoders\include\nebula_hesai_decoders\decoders\pandar_xt32m.hpp";
               Marker = "firetime_offsets_ns_"; Name = "pandar_xt32m.hpp" },
            @{ Relative = "nebula_hesai\nebula_hesai_decoders\include\nebula_hesai_decoders\decoders\hesai_decoder.hpp";
               Marker = "firetime_path"; Name = "hesai_decoder.hpp" },
            @{ Relative = "nebula_hesai\nebula_hesai\src\hesai_ros_wrapper.cpp";
               Marker = "firetime_file_path"; Name = "hesai_ros_wrapper.cpp" }
        )

        foreach ($pf in $patchedFiles) {
            $upFile = "$tempDir\src\$($pf.Relative)"
            $localFile = "$nebulaSrc\$($pf.Relative)"

            if (-not (Test-Path $localFile)) {
                $issues++; Write-Err "$($pf.Name) — LOCAL FILE MISSING"; continue
            }
            if (-not (Test-Path $upFile)) {
                Write-Warn "$($pf.Name) — upstream file not found in clone"; continue
            }

            $content = Get-Content $localFile -Raw
            if ($content -notmatch [regex]::Escape($pf.Marker)) {
                $issues++
                Write-Err "$($pf.Name) — PATCH MARKER '$($pf.Marker)' NOT FOUND (patch not applied?)"
                Write-FixCmd "Run: ./scripts/apply_nebula_firetime_patch.sh"
                $fixCommands += "./scripts/apply_nebula_firetime_patch.sh"
                continue
            }

            $diffLines = (git diff --no-index "$upFile" "$localFile" 2>&1 |
                Where-Object { $_ -match "^[+-]" -and $_ -notmatch "^[+-]{3}" }).Count

            $expectedDiffs = @{
                "hesai_common.hpp" = 54; "hesai_sensor.hpp" = 9
                "pandar_xt32m.hpp" = 46; "hesai_decoder.hpp" = 19
                "hesai_ros_wrapper.cpp" = 2
            }

            $expected = $expectedDiffs[$pf.Name]
            if ($diffLines -le ($expected + 2) -and $diffLines -ge ($expected - 2)) {
                Write-Ok "$($pf.Name) — patched, ~$diffLines changed lines (expected ~$expected)"
            } else {
                $warnings++
                Write-Warn "$($pf.Name) — $diffLines changed lines vs expected ~$expected (possible hand-edits!)"
                if ($ShowDiffs) {
                    git diff --no-index "$upFile" "$localFile" 2>&1 | Select-Object -First 40 |
                        ForEach-Object { Write-Info "    $_" }
                }
                Write-FixCmd "Review: git diff --no-index <upstream> <local> for $($pf.Name)"
            }
        }

        Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# ============================================================
# 4. UNTRACKED SCRIPTS
# ============================================================
Write-Section "4. Untracked Scripts"

$untrackedScripts = git ls-files --others --exclude-standard -- "scripts/*.sh" "scripts/*.py" "autoware/*.sh" 2>&1
if ([string]::IsNullOrWhiteSpace($untrackedScripts)) {
    Write-Ok "All scripts are tracked"
} else {
    $warnings++
    $scriptList = ($untrackedScripts -split "`n") | Where-Object { $_ }
    Write-Warn "$($scriptList.Count) untracked script(s):"
    foreach ($s in $scriptList) {
        $loc = if ($s -match "^autoware/") { "(wrong location — move to scripts/)" } else { "" }
        Write-Info "  $s $loc"
    }
    Write-FixCmd 'Move autoware/*.sh to scripts/, then: git add scripts/*.sh && git commit'
}

# ============================================================
# 5. JUNK FILES
# ============================================================
Write-Section "5. Junk Files (Syncthing conflicts, backups)"

$junkPatterns = @("*.sync-conflict*", "*.orig", "*.bak")
$junkFiles = @()
foreach ($pattern in $junkPatterns) {
    $found = Get-ChildItem -Path $root -Recurse -Filter $pattern -File -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\(\.git|node_modules|build|install|log)\\" }
    $junkFiles += $found
}

if ($junkFiles.Count -eq 0) {
    Write-Ok "No junk files found"
} else {
    $warnings++
    Write-Warn "$($junkFiles.Count) junk file(s) found:"
    foreach ($jf in $junkFiles) {
        Write-Info "  $($jf.FullName)"
    }
    Write-FixCmd "Delete these files manually"
    foreach ($jf in $junkFiles) { $fixCommands += "Remove-Item '$($jf.FullName)'" }
}

# ============================================================
# 6. NESTED GIT REPOS
# ============================================================
Write-Section "6. Nested Git Repos (mapping/)"

$nestedRepos = Get-ChildItem -Path "$root\autoware\src\our_packages" -Recurse -Directory -Filter ".git" -ErrorAction SilentlyContinue
if ($nestedRepos.Count -eq 0) {
    Write-Info "No nested git repos found"
} else {
    foreach ($gitDir in $nestedRepos) {
        $repoDir = $gitDir.Parent.FullName
        $repoName = $gitDir.Parent.Name
        Write-Info "Checking: $repoName"

        Push-Location $repoDir
        $status = git status --porcelain 2>&1
        if ([string]::IsNullOrWhiteSpace($status)) {
            Write-Ok "$repoName — clean"
        } else {
            $modCount = ($status -split "`n" | Where-Object { $_ }).Count
            $warnings++
            Write-Warn "$repoName — $modCount uncommitted change(s)"
        }

        $remotes = git remote -v 2>&1
        if ($remotes -match "origin") {
            git fetch origin --quiet 2>$null
            $localH = (git rev-parse HEAD 2>&1).Trim()
            $branch = (git branch --show-current 2>&1).Trim()
            $remoteH = (git rev-parse "origin/$branch" 2>&1).Trim()
            if ($localH -eq $remoteH) {
                Write-Ok "$repoName — synced with origin/$branch"
            } else {
                $a = (git rev-list "origin/$branch..HEAD" --count 2>&1).Trim()
                $b = (git rev-list "HEAD..origin/$branch" --count 2>&1).Trim()
                if ([int]$a -gt 0) { $warnings++; Write-Warn "$repoName — $a ahead (needs push)" }
                if ([int]$b -gt 0) { $warnings++; Write-Warn "$repoName — $b behind (needs pull)" }
            }
        } else {
            Write-Info "$repoName — no remote configured"
        }
        Pop-Location
    }
}

# ============================================================
# 7. AUTOWARE.REPOS PRESENCE CHECK
# ============================================================
Write-Section "7. Autoware Source Repos — Presence Check"

$reposFile = "$root\repositories\autoware.repos"
if (Test-Path $reposFile) {
    $reposContent = Get-Content $reposFile -Raw
    $repoPaths = [regex]::Matches($reposContent, '^\s{2}(\S+):\s*$', 'Multiline') |
        ForEach-Object { $_.Groups[1].Value }

    $missing = @()
    $present = 0
    foreach ($rp in $repoPaths) {
        $localPath = "$root\autoware\src\$rp"
        if (Test-Path $localPath) { $present++ } else { $missing += $rp }
    }

    Write-Ok "$present/$($repoPaths.Count) repos present locally"
    if ($missing.Count -gt 0) {
        $issues++
        Write-Err "$($missing.Count) repo(s) MISSING:"
        foreach ($m in $missing) { Write-Info "  autoware/src/$m" }
        Write-FixCmd "./scripts/bootstrap_workspace.sh"
    }
} else {
    Write-Warn "autoware.repos not found"
}

# ============================================================
# SUMMARY
# ============================================================
Write-Section "SUMMARY"

$total = $issues + $warnings
if ($total -eq 0) {
    Write-Host "  Everything is in sync! No issues found." -ForegroundColor Green
} else {
    $color = if ($issues -gt 0) { "Red" } else { "Yellow" }
    Write-Host "  Found $issues issue(s) and $warnings warning(s)" -ForegroundColor $color
}

if ($Fix -and $fixCommands.Count -gt 0) {
    Write-Section "GENERATED FIX COMMANDS"
    foreach ($cmd in $fixCommands) {
        Write-Host "  $cmd" -ForegroundColor Magenta
    }
}

Write-Host ""
