#!/usr/bin/env pwsh
<#
.SYNOPSIS
    E-Trike AV Repository Sync Audit (Full)
    Compares ALL local source repos against their pinned upstream versions via GitHub API.

.DESCRIPTION
    For each repo in repositories/autoware.repos:
    1. Fetches the file tree from GitHub at the pinned version (tag/SHA)
    2. Computes git blob SHAs for local files
    3. Reports any files that differ from upstream (modified, added, deleted)

    Also checks: main repo sync, our_packages, untracked scripts, junk files.

.PARAMETER RepoFilter
    Only check repos matching this pattern (e.g. "nebula" or "autoware_core")

.PARAMETER ShowFiles
    Show per-file details for modified repos (default: summary only)

.PARAMETER Fix
    List fix commands at the end

.PARAMETER SkipUpstream
    Skip the upstream repo checks (faster, only checks local git state)
#>
param(
    [string]$RepoFilter = "",
    [switch]$ShowFiles,
    [switch]$Fix,
    [switch]$SkipUpstream
)

$ErrorActionPreference = "Continue"
$root = "e:\work\av_project"
Set-Location $root

# --- Helpers ---
function Write-Section($title) {
    Write-Host ""
    Write-Host ("=" * 70) -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor Cyan
}
function Write-Ok($msg) { Write-Host "  [OK]      $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  [WARN]    $msg" -ForegroundColor Yellow }
function Write-Err($msg) { Write-Host "  [ISSUE]   $msg" -ForegroundColor Red }
function Write-Info($msg) { Write-Host "  [INFO]    $msg" -ForegroundColor Gray }
function Write-FixCmd($msg) { Write-Host "  [FIX]     $msg" -ForegroundColor Magenta }

function Get-GitBlobSha($filePath) {
    # Compute the git blob SHA1 for a file (same as git hash-object)
    try {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        # Normalize CRLF -> LF for consistent hashing (git does this for text files)
        $text = [System.Text.Encoding]::UTF8.GetString($bytes) -replace "`r`n", "`n"
        $contentBytes = [System.Text.Encoding]::UTF8.GetBytes($text)
        $header = "blob $($contentBytes.Length)`0"
        $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
        $fullBytes = $headerBytes + $contentBytes
        $sha1 = [System.Security.Cryptography.SHA1]::Create()
        $hash = $sha1.ComputeHash($fullBytes)
        return ($hash | ForEach-Object { $_.ToString("x2") }) -join ""
    } catch {
        return $null
    }
}

# Known repos with expected patches (won't flag as issues)
$expectedPatches = @{
    "sensor_component/external/nebula" = @(
        "src/nebula_hesai/nebula_hesai_common/include/nebula_hesai_common/hesai_common.hpp",
        "src/nebula_hesai/nebula_hesai_decoders/include/nebula_hesai_decoders/decoders/hesai_sensor.hpp",
        "src/nebula_hesai/nebula_hesai_decoders/include/nebula_hesai_decoders/decoders/pandar_xt32m.hpp",
        "src/nebula_hesai/nebula_hesai_decoders/include/nebula_hesai_decoders/decoders/hesai_decoder.hpp",
        "src/nebula_hesai/nebula_hesai/src/hesai_ros_wrapper.cpp"
    )
}

$issues = 0
$warnings = 0
$fixCommands = @()

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
        Write-Warn "Local is $ahead commit(s) AHEAD — needs push"
        git log origin/main..HEAD --oneline 2>&1 | ForEach-Object { Write-Info "  $_" }
        Write-FixCmd "git push origin main"
        $fixCommands += "git push origin main"
    }
    if ([int]$behind -gt 0) {
        $issues++
        Write-Err "Local is $behind commit(s) BEHIND — needs pull"
        Write-FixCmd "git pull origin main"
        $fixCommands += "git pull origin main"
    }
}

$trackedDiff = git diff --name-only 2>&1
if ($trackedDiff) {
    $trackedDiff = ($trackedDiff | Out-String).Trim()
    if ($trackedDiff) {
        $issues++
        Write-Err "Uncommitted changes to tracked files:"
        ($trackedDiff -split "`n") | Where-Object { $_ } | ForEach-Object { Write-Info "  $_" }
    }
}

# ============================================================
# 2. OUR_PACKAGES
# ============================================================
Write-Section "2. our_packages/ — Local Changes"

$ourDiff = git diff --name-only -- autoware/src/our_packages/ 2>&1
if ($ourDiff) {
    $ourDiff = ($ourDiff | Out-String).Trim()
}
if (-not $ourDiff) {
    Write-Ok "All tracked files match HEAD"
} else {
    $issues++
    Write-Err "Modified files:"
    ($ourDiff -split "`n") | Where-Object { $_ } | ForEach-Object { Write-Info "  $_" }
}

$untracked = git ls-files --others --exclude-standard -- autoware/src/our_packages/ 2>&1 |
    Where-Object { $_ -and $_ -notmatch "__pycache__" }
if ($untracked) {
    $warnings++
    Write-Warn "Untracked files:"
    ($untracked -split "`n") | Where-Object { $_ } | ForEach-Object { Write-Info "  $_" }
}

# ============================================================
# 3. ALL UPSTREAM REPOS — via GitHub API
# ============================================================
if (-not $SkipUpstream) {
    Write-Section "3. Upstream Source Repos — File-Level Comparison"

    # Parse autoware.repos
    $reposFile = "$root\repositories\autoware.repos"
    $reposContent = Get-Content $reposFile -Raw

    # Extract entries: path, url, version
    $entries = @()
    $lines = $reposContent -split "`n"
    $currentPath = $null
    $currentUrl = $null
    $currentVersion = $null

    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i].TrimEnd()
        if ($line -match '^\s{2}(\S+):\s*$') {
            # Save previous entry
            if ($currentPath -and $currentUrl -and $currentVersion) {
                $entries += @{ Path = $currentPath; Url = $currentUrl; Version = $currentVersion }
            }
            $currentPath = $matches[1]
            $currentUrl = $null
            $currentVersion = $null
        }
        elseif ($line -match '^\s+url:\s*(.+)$') {
            $currentUrl = $matches[1].Trim()
        }
        elseif ($line -match '^\s+version:\s*(.+)$') {
            $currentVersion = $matches[1].Trim()
        }
    }
    # Don't forget last entry
    if ($currentPath -and $currentUrl -and $currentVersion) {
        $entries += @{ Path = $currentPath; Url = $currentUrl; Version = $currentVersion }
    }

    Write-Info "Found $($entries.Count) repos in autoware.repos"
    Write-Host ""

    $repoStats = @{ clean = 0; modified = 0; missing = 0; error = 0; patched = 0 }

    foreach ($entry in $entries) {
        $repoPath = $entry.Path
        $repoUrl = $entry.Url
        $version = $entry.Version

        # Apply filter
        if ($RepoFilter -and $repoPath -notmatch $RepoFilter) { continue }

        $localDir = "$root\autoware\src\$repoPath"
        $repoName = ($repoPath -split "/")[-1]
        $shortPath = $repoPath

        # Extract GitHub owner/repo from URL
        if ($repoUrl -match "github\.com[/:]([^/]+)/([^/.]+)") {
            $owner = $matches[1]
            $repo = $matches[2]
        } else {
            Write-Warn "$shortPath — can't parse GitHub URL: $repoUrl"
            $repoStats.error++
            continue
        }

        if (-not (Test-Path $localDir)) {
            Write-Err "$shortPath — DIRECTORY MISSING"
            $repoStats.missing++
            $issues++
            continue
        }

        # Fetch file tree from GitHub API
        try {
            $apiUrl = "https://api.github.com/repos/$owner/$repo/git/trees/$version`?recursive=1"
            $tree = Invoke-RestMethod -Uri $apiUrl -Headers @{
                "Accept" = "application/vnd.github+json"
                "User-Agent" = "etrike-audit"
            } -TimeoutSec 15

            if (-not $tree.tree) {
                Write-Warn "$shortPath — API returned no tree (version '$version' may not exist)"
                $repoStats.error++
                continue
            }
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            if ($statusCode -eq 403) {
                Write-Warn "$shortPath — GitHub API rate limit hit. Wait or use -SkipUpstream"
                $repoStats.error++
                break  # Stop checking — rate limited
            }
            Write-Warn "$shortPath — API error: $($_.Exception.Message)"
            $repoStats.error++
            continue
        }

        # Get code files from the tree (skip non-code files for speed)
        $codeExtensions = @(".cpp", ".hpp", ".h", ".c", ".py", ".xml", ".yaml", ".yml",
                           ".launch", ".msg", ".srv", ".action", ".cmake", ".xacro")
        $upstreamFiles = $tree.tree | Where-Object {
            $_.type -eq "blob" -and
            ($codeExtensions | Where-Object { $_.path -like "*$_" })
        }

        # Check for expected patches
        $expectedPatchFiles = $expectedPatches[$repoPath]
        $modifiedFiles = @()
        $missingFiles = @()
        $checkedCount = 0

        foreach ($uf in $upstreamFiles) {
            $localFilePath = Join-Path $localDir $uf.path
            if (-not (Test-Path $localFilePath)) {
                # File exists upstream but not locally — could be normal (Syncthing excludes)
                continue
            }

            $checkedCount++
            $localSha = Get-GitBlobSha $localFilePath
            if ($localSha -and $localSha -ne $uf.sha) {
                $isExpected = $expectedPatchFiles -and ($expectedPatchFiles -contains $uf.path)
                $modifiedFiles += @{
                    Path = $uf.path
                    Expected = $isExpected
                    UpstreamSha = $uf.sha.Substring(0, 7)
                    LocalSha = $localSha.Substring(0, 7)
                }
            }
        }

        # Report
        $expectedMods = ($modifiedFiles | Where-Object { $_.Expected }).Count
        $unexpectedMods = ($modifiedFiles | Where-Object { -not $_.Expected }).Count

        if ($unexpectedMods -eq 0 -and $expectedMods -eq 0) {
            Write-Ok "$shortPath ($version) — $checkedCount files checked, all match"
            $repoStats.clean++
        }
        elseif ($unexpectedMods -eq 0 -and $expectedMods -gt 0) {
            Write-Ok "$shortPath ($version) — $expectedMods expected patch(es), 0 unexpected"
            if ($ShowFiles) {
                foreach ($mf in ($modifiedFiles | Where-Object { $_.Expected })) {
                    Write-Info "    [PATCHED] $($mf.Path)"
                }
            }
            $repoStats.patched++
        }
        else {
            $warnings++
            Write-Warn "$shortPath ($version) — $unexpectedMods UNEXPECTED modification(s)"
            $repoStats.modified++
            foreach ($mf in ($modifiedFiles | Where-Object { -not $_.Expected })) {
                Write-Info "    [MODIFIED] $($mf.Path)  (upstream=$($mf.UpstreamSha) local=$($mf.LocalSha))"
            }
            if ($expectedMods -gt 0) {
                Write-Info "    ($expectedMods expected patch file(s) also present)"
            }
            Write-FixCmd "Investigate: create a patch script or revert to upstream for $shortPath"
        }
    }

    Write-Host ""
    Write-Info "Repo summary: $($repoStats.clean) clean, $($repoStats.patched) patched (expected), $($repoStats.modified) unexpectedly modified, $($repoStats.missing) missing, $($repoStats.error) errors"
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
    foreach ($s in $scriptList) { Write-Info "  $s" }
}

# ============================================================
# 5. JUNK FILES
# ============================================================
Write-Section "5. Junk Files"

$junkFiles = @()
foreach ($pattern in @("*.sync-conflict*", "*.orig", "*.bak")) {
    $found = Get-ChildItem -Path $root -Recurse -Filter $pattern -File -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch "\\(\.git|node_modules|build|install|log)\\" }
    $junkFiles += $found
}

if ($junkFiles.Count -eq 0) {
    Write-Ok "No junk files found"
} else {
    $warnings++
    Write-Warn "$($junkFiles.Count) junk file(s):"
    foreach ($jf in $junkFiles) { Write-Info "  $($jf.FullName)" }
}

# ============================================================
# 6. NESTED GIT REPOS
# ============================================================
Write-Section "6. Nested Git Repos"

$nestedRepos = Get-ChildItem -Path "$root\autoware\src\our_packages" -Recurse -Directory -Filter ".git" -ErrorAction SilentlyContinue
if ($nestedRepos.Count -eq 0) {
    Write-Info "No nested git repos found in our_packages/"
} else {
    foreach ($gitDir in $nestedRepos) {
        $repoDir = $gitDir.Parent.FullName
        $repoName = $gitDir.Parent.Name
        Push-Location $repoDir
        $status = git status --porcelain 2>&1
        $modCount = if ($status) { ($status -split "`n" | Where-Object { $_ }).Count } else { 0 }
        if ($modCount -eq 0) { Write-Ok "$repoName — clean" }
        else { $warnings++; Write-Warn "$repoName — $modCount uncommitted change(s)" }
        Pop-Location
    }
}

# ============================================================
# SUMMARY
# ============================================================
Write-Section "SUMMARY"

$total = $issues + $warnings
if ($total -eq 0) {
    Write-Host "  Everything is in sync!" -ForegroundColor Green
} else {
    $color = if ($issues -gt 0) { "Red" } else { "Yellow" }
    Write-Host "  Found $issues issue(s) and $warnings warning(s)" -ForegroundColor $color
}

if ($Fix -and $fixCommands.Count -gt 0) {
    Write-Host ""
    Write-Section "FIX COMMANDS"
    foreach ($cmd in $fixCommands) { Write-Host "  $cmd" -ForegroundColor Magenta }
}

Write-Host ""
