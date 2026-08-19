# Git strategy

## The problem

33 repos in `src/`. We'll modify maybe 3–5. Forking all 33 is unnecessary overhead.

## The approach

One manifest file (`repositories/our_autoware.repos`) tracks everything:

```yaml
repositories:
  # Untouched — pinned upstream
  core/autoware_msgs:
    type: git
    url: https://github.com/autowarefoundation/autoware_msgs.git
    version: 1.13.0

  # Modified — our fork, our branch
  universe/autoware_universe:
    type: git
    url: https://github.com/our-org/autoware_universe.git
    version: research-control

  # Our package — our repo
  our_packages/our_controller:
    type: git
    url: https://github.com/our-org/our_controller.git
    version: main
```

## When we modify a repo

### One-time setup

```bash
# Fork the repo on GitHub (browser)
# Then clone our fork, add upstream
cd ~/av_project/autoware/src/universe/autoware_universe
git remote set-url origin git@github.com:our-org/autoware_universe.git
git remote add upstream https://github.com/autowarefoundation/autoware_universe.git

# Branch from the pinned tag
git checkout -b research-control
```

### Daily work

```bash
git add .
git commit -m "Custom vehicle model"
git push origin research-control
```

### Sync with upstream

```bash
git fetch upstream
git merge upstream/main    # or rebase
```

## When a repo stays untouched

Do nothing. No fork. No remotes. Just a pinned version in the manifest. When Autoware releases, bump the version:

```diff
-    version: 1.13.0
+    version: 1.14.0
```

## Reproduce anywhere

```bash
cd ~/av_project/autoware
vcs import src < ../repositories/our_autoware.repos
```

## Summary

| Type | Count | Forked? | Has upstream remote? |
|------|-------|---------|---------------------|
| Untouched upstream | ~28 | No | No |
| Modified upstream | 2–5 | Yes | Yes |
| Our packages | 2–5 | N/A (our repo) | No |

## Auditing Repositories

Because we use cs import and Syncthing (which strips .git directories on Windows), it can be difficult to verify if any of the 29 upstream repositories have been accidentally modified. 

To solve this, use the audit script:
`ash
pwsh -File scripts/audit_repo_sync.ps1
`

This script uses the GitHub API to perform a purely local validation of the file states against the expected upstream state, without needing full clones or local .git directories for the upstream repos. See [AUDIT_STRATEGY.md](AUDIT_STRATEGY.md) for more details.
