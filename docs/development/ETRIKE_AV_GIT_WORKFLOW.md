# etrike-av Git workflow

## Repository

```
https://github.com/shakilapr/etrike-av.git
```

Local: Linux `~/av_project`, synced to Windows `E:\work\av_project` via Syncthing.

## What's tracked vs not

### Tracked (this repo)

```
.stignore
.gitignore
RUN_SYNC.md
SYNCTHING_WINDOWS_SETUP.md
autoware/autoware.repos
docker/build.sh
docker/run.sh
docker/shell.sh
docs/*.md
repositories/autoware.repos
repositories/simulator.repos
repositories/tools.repos
repositories/our_autoware.repos
shared.md
vehicle/calibration/
vehicle/description/
vehicle/launch/
vehicle/parameters/
```

### NOT tracked (`.gitignore`)

```
/autoware/src/*          ← 33 repos, each has its own Git
!/autoware/src/our_packages/  ← E-Trike packages (tracked via git subtree)
/autoware/build/         ← colcon output
/autoware/install/       ← colcon output
/autoware/log/           ← colcon output
/simulator/AWSIM/        ← 1.7GB Unity project (separate backup)
/data/                   ← maps, bags, models (separate backup)
```

## How the 33 source repos are managed

They are NOT in this repo. They are pulled via `vcs import` from `repositories/our_autoware.repos`:

- **Untouched official repos (~28):** pinned upstream version in manifest. No fork.
- **Modified official repos (2–5):** our fork on GitHub, `etrike-dev` branch. `upstream` remote tracks autowarefoundation.
- **Our custom packages (2–5):** our own repos on GitHub.

See `docs/development/GIT_STRATEGY.md` for details.

## E-Trike vehicle packages (git subtree)

The four E-Trike packages live in the **etrike** repo (`https://github.com/shakilapr/etrike`)
and are synced into this repo via **git subtree** under `autoware/src/our_packages/`:

| Package | Source in etrike repo | Purpose |
|---|---|---|
| `autoware_vehicle_bridge` | `jetson/src/autoware_vehicle_bridge/` | Bridge node (Autoware ↔ CAN) |
| `etrike_protocol` | `protocol/` | Generated CAN protocol headers |
| `etrike_vehicle_launch` | `jetson/src/etrike_vehicle_launch/` | Launch wrapper |
| `etrike_vehicle_description` | `jetson/src/etrike_vehicle_description/` | Vehicle model + params |

### Pulling updates from etrike

When the etrike repo is updated (e.g. protocol changes):

```bash
cd ~/av_project

# First time only: add the etrike remote
git remote add etrike https://github.com/shakilapr/etrike.git

# Pull updates
git fetch etrike
git subtree pull --prefix=autoware/src/our_packages etrike/main -m "sync: pull updates from etrike"
```

This merges only the `our_packages/` subtree. The full commit history from etrike is preserved.

### Pushing changes back to etrike

If you edit the packages in av_project and want to push back:

```bash
cd ~/av_project
git subtree push --prefix=autoware/src/our_packages etrike main
```

### On a fresh clone

The etrike remote is local config (not in git). After cloning av_project:

```bash
git remote add etrike https://github.com/shakilapr/etrike.git
```

## Daily workflow

### On Linux (where code runs)

```bash
cd ~/av_project

# Edit code
vim autoware/src/our_packages/etrike_controller/src/...

# Build only what changed
docker/build.sh
# or inside container:
colcon build --symlink-install --packages-select etrike_controller

# Test
docker/run.sh
```

### Commit and push

```bash
# Config changes (docker, vehicle, docs, manifests)
cd ~/av_project
git status
git add <files>
git commit -m "Update vehicle parameters"
git push

# E-Trike package changes (synced via subtree)
cd ~/av_project
git add autoware/src/our_packages/
git commit -m "Update bridge code"
git push

# To also push changes back to etrike repo:
git subtree push --prefix=autoware/src/our_packages etrike main
```

Syncthing mirrors everything to `E:\work\av_project` on Windows — including uncommitted changes.

## Before committing

- Review `git status` and `git diff --cached`.
- Do NOT commit `autoware/build/`, `autoware/install/`, `autoware/log/`.
- Do NOT commit `data/bags/` or AWSIM Unity generated folders.
- Keep credentials and secrets out.
- Run `git add <file>` explicitly — avoid `git add -A` or `git add .` in the config repo.

## Recovery from scratch

```bash
git clone https://github.com/shakilapr/etrike-av.git ~/av_project
cd ~/av_project

# Add etrike remote for subtree syncing
git remote add etrike https://github.com/shakilapr/etrike.git

# Pull upstream Autoware packages
cd autoware
vcs import src < ../repositories/autoware.repos

# E-Trike packages are already in autoware/src/our_packages/ (in git)
# No vcs import needed for them

# Restore data/ and simulator/AWSIM/ from backup
# Run docker/build.sh
```

## Checking state

```bash
git status --short --branch
git log --oneline --decorate -5
git remote -v
```

## FAQ

### Why don't we need to compile all 500+ packages?

The Docker image has all Autoware pre-built at `/opt/autoware/`. Source it first, then source our workspace on top. Only packages we build shadow the pre-built ones. See `docs/setup/HOW_BUILD_WORKS.md`.

### Why are some folders empty?

`data/bags/`, `data/models/`, `vehicle/calibration/` are placeholders — populated as the project progresses. The source repos (1.9GB, 33 repos) are under `autoware/src/` but excluded from this Git repo via `.gitignore`.

### Aren't there supposed to be hundreds of repos?

33, not hundreds. `autoware_universe` is a monorepo containing most of Autoware's 300+ ROS packages in a single Git repo.

### Should we save the whole av_project folder to GitHub?

No. This config repo tracks ~20 small text files. The 33 source repos are pulled via `vcs import` from `our_autoware.repos`. Recovery: clone config → `vcs import` → restore data from backup → build.

### Do we need to update `.gitignore` when we modify a new repo?

No. The `.gitignore` blocks entire directories (`/autoware/src/universe/`). Whether the repos inside are untouched, forked, or modified doesn't matter — the outer config repo never touches them.

### What about the mesh and 3D model files?

`lexus.dae` (15MB) and `lexus.jpg` were copies from Autoware's `sample_vehicle_description`. We deleted them — they're already versioned upstream. We'll write our own etrike URDF and model files when needed.

### Why is `.stignore` tracked but Syncthing says it's not synced?

`.stignore` is tracked by Git for recovery purposes. Syncthing doesn't sync the file itself, but Git will recreate it on a fresh clone.

### Can we recover everything if the Linux disk dies?

Yes. Clone this config repo → `vcs import src < repositories/our_autoware.repos` → restore `data/` and `simulator/AWSIM/` from backup → `docker/build.sh`. Everything rebuildable is rebuilt. Everything versioned is pulled from GitHub.

### Why not rebuild the Docker image?

The official `ghcr.io/autowarefoundation/autoware:universe-cuda-humble` image provides ROS 2, CUDA, compilers, and all Autoware dependencies pre-installed. We only rebuild it if we add a new system dependency. Code changes never require a Docker rebuild.

### What's the difference between vehicle/ and src/our_packages/?

`vehicle/` = config files (YAML params, launch files, URDF model). No compiled code. `src/our_packages/` = ROS packages with C++/Python source that get compiled by colcon.

### What about AWSIM?

It's a Unity project for vehicle physics simulation. Lives separately at `simulator/AWSIM/`. Not compiled by colcon. Not in the Autoware source tree. Gitignored from the config repo — back it up separately or re-clone from `github.com/autowarefoundation/AWSIM-Labs`.

### When Autoware releases a new version?

```bash
# 1. Bump pinned versions in our_autoware.repos
# 2. For our forks: git fetch upstream && git merge upstream/main
# 3. vcs import src < repositories/our_autoware.repos  # if new repos added
# 4. colcon build --symlink-install --packages-above <changed-package>
```

### Git identity not set?

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```

Required before the first commit.
