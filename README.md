# etrike-av v0.1.0

Autonomous driving research platform for an electric trike (etrike), built on [Autoware](https://github.com/autowarefoundation/autoware).

## Project structure

```
~/av_project/
├── autoware/src/          ← 33 Autoware repos + our custom packages
├── vehicle/               ← etrike configs (params, URDF, launch)
├── docker/                ← build/run/shell scripts
├── simulator/AWSIM/       ← vehicle physics simulation
├── data/                  ← maps, bags, models
├── repositories/          ← .repos manifests
└── docs/                  ← project documentation
```

## Quick start

```bash
# Enter the container
./docker/shell.sh

# Build only our packages
source /opt/autoware/setup.bash
colcon build --symlink-install --packages-select etrike_controller

# Launch
source install/setup.bash
ros2 launch ...
```

## How it works

The Docker image provides ROS 2, CUDA, and all Autoware pre-built at `/opt/autoware/`. We build only our custom packages (and any official packages we modify). Our workspace overlays on top — our packages shadow the pre-built ones. No full rebuild. No Docker rebuild.

See `docs/HOW_BUILD_WORKS.md` for details.

## Recovery (fresh clone)

```bash
git clone https://github.com/shakilapr/etrike-av.git ~/av_project
cd ~/av_project
./scripts/bootstrap_workspace.sh   # imports upstream Autoware + applies patches
./docker/build.sh                  # builds our packages + patched upstream
./run_tests.sh                     # runs all E-Trike tests
```

`bootstrap_workspace.sh` does:
1. `vcs import autoware/src < repositories/autoware.repos` (fetches pinned upstream)
2. Verifies expected upstream revisions
3. Applies E-Trike patches (Nebula firetime, etc.)
4. Verifies all patches applied

See `docs/HOW_BUILD_WORKS.md` for details and `UPSTREAM_MODIFICATIONS.md` for
the list of patches applied to upstream Autoware.

## Documentation

| File | Topic |
|------|-------|
| `docs/SETUP.md` | Original project design |
| `docs/SETUP_COMPLETE.md` | Master reference |
| `docs/HOW_BUILD_WORKS.md` | Overlay/build explanation |
| `docs/GIT_STRATEGY.md` | Multi-repo Git strategy |
| `docs/GITHUB_SETUP.md` | GitHub org setup |
| `docs/SYNCTHING_SETUP.md` | Linux-Windows sync |
| `docs/ETRIKE_AV_GIT_WORKFLOW.md` | Daily Git workflow + FAQ |
| `docs/RECOVERY.md` | Disaster recovery from GitHub only |
| `UPSTREAM_MODIFICATIONS.md` | Upstream patches registry |
