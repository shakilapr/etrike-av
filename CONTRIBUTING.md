# Contributing

## Project layout

- **Config repo** (`etrike-av`): docker, vehicle params, docs, manifests
- **Source repos**: 33 Autoware repos under `autoware/src/`, pulled via `vcs import`
- **Our packages**: separate repos under `src/our_packages/`

## Setup

```bash
git clone https://github.com/shakilapr/etrike-av.git
cd autoware
vcs import src < ../repositories/our_autoware.repos
./docker/build.sh
```

## Making changes

### Config changes (this repo)

```bash
git add <specific-files>
git commit -m "Describe the change"
git push
```

Do NOT use `git add -A` or `git add .` — the `.gitignore` protects you but explicit adds are safer.

### Source code changes

Navigate into the specific package repo under `autoware/src/`, commit and push there. Each source repo has its own Git history.

### Commit messages

Format: `<type>: <description>`

| Prefix | When |
|--------|------|
| `feat:` | New feature or capability |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `config:` | Vehicle params, launch files, calibration |
| `docker:` | Docker scripts or image changes |
| `sync:` | Syncthing or .stignore changes |
| `chore:` | Repo maintenance, .gitignore, deps |
| `test:` | Tests or test infrastructure |

Examples:
```
feat: add etrike steering controller
config: tune PID gains for 1.25m wheelbase
docker: mount vehicle/ into container
docs: add recovery steps to workflow doc
chore: bump autoware_universe to 0.53.0
```

## Before committing

- `git diff --cached` to review
- No generated files (`build/`, `install/`, `log/`)
- No binary data (`data/bags/`, `data/models/`)
- No credentials or secrets

## Branches

- `main` — stable, deployable
- Feature branches off `main`, merge via PR
