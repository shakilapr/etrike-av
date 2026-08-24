# Repository Audit Strategy

Because our environment relies on `vcs import` to manage 29 upstream repositories, keeping track of drift and modifications across these repositories can be complex. Furthermore, because of Syncthing's behavior of stripping `.git` directories during cross-platform syncs, we cannot always rely on standard git commands locally across all sub-repositories.

To solve this, we use a centralized audit script: `scripts/audit_repo_sync.ps1`.

## How it Works

The audit script uses the **GitHub API** to perform a purely local validation of the file states against the expected upstream state, without needing full clones or local `.git` directories for the upstream repos.

1. **Main Repo Sync:** It checks the local `etrike-av` repository against `origin/main` to see if there are unpushed commits or uncommitted changes.
2. **`our_packages` Sync:** It checks the `our_packages/` subtree for uncommitted modifications or untracked files.
3. **Upstream Repositories Sync:** 
   - It reads `repositories/autoware.repos` to find the exact pinned version (SHA or tag) for every upstream repository.
   - For each repository, it queries the GitHub API (`https://api.github.com/repos/<owner>/<repo>/git/trees/<version>?recursive=1`) to get the expected git blob SHA1 hash for every file at that specific version.
   - It computes the local git blob SHA1 of every file in the corresponding local directory.
   - It highlights any files that have drifted (modified locally without a patch script).
   - It elegantly handles expected patches (e.g., the Nebula firetime patch) by checking against a known whitelist, allowing expected patches to exist while flagging manual edits.
4. **Untracked Scripts & Junk Files:** It finds debugging scripts that should be committed and flags temporary files (like `.sync-conflict` artifacts) for deletion.

## Running the Audit

```powershell
# Basic check (Summary of issues)
pwsh -File scripts/audit_repo_sync.ps1

# Detailed check (Shows the exact files that are modified)
pwsh -File scripts/audit_repo_sync.ps1 -ShowFiles

# Generate Fix Commands
pwsh -File scripts/audit_repo_sync.ps1 -Fix
```

## Remediation

If the audit script finds unexpected modifications in an upstream repository:
- **Do not commit directly to `autoware/src/`**.
- Instead, create a patch script in the `patches/` directory (see [Patching Guide](../patches/README.md)).
- Document the modification in `UPSTREAM_MODIFICATIONS.md`.
- Run the audit script again to verify the expected patch logic.
