# Patching Guide

This directory contains patch scripts used to modify upstream Autoware repositories that we vendor into our workspace via `vcs import`.

## Why Patch Scripts?

According to our [Coding Guide](../docs/development/CODING_GUIDE.md), we **never edit files under `autoware/src/` directly** (except inside `our_packages/`). 

Instead of maintaining dozens of forks for minor changes, we use automated patch scripts that are applied during the workspace bootstrap process.

## How to Write a Patch Script

1. **Be Idempotent:** Your script must check if the patch is already applied before running. Do not rely on git state, as the repository might be in a detached HEAD state. Use `grep` to check for markers.
2. **Be Robust:** Do not use line numbers. Use `sed` or `python` to find specific code blocks and replace them.
3. **Verify at the End:** Your script must contain a verification block at the end that asserts the presence of your changes. If the upstream repository changes and your markers are no longer found, the script should fail loudly so developers know the patch needs updating.
4. **Document Upstream Modifications:** Any patch script added here must also be documented in the root `UPSTREAM_MODIFICATIONS.md` file, explaining *why* the patch is necessary and *when* it can be removed.

## Adding a New Patch

When you create a new patch script:
1. Place it in this directory (e.g., `patches/apply_my_custom_patch.sh`).
2. Make it executable (`chmod +x`).
3. Add a call to it in `scripts/bootstrap_workspace.sh` in the "Applying E-Trike patches" section.

## Verifying Patches

Use the repository audit script to ensure that no hand-edits have drifted beyond what your patch script produces:

```bash
pwsh -File scripts/audit_repo_sync.ps1
```
