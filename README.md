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

## Recovery

```bash
git clone https://github.com/shakilapr/etrike-av.git ~/av_project
cd ~/av_project/autoware
vcs import src < ../repositories/our_autoware.repos
# restore data/ and simulator/AWSIM/ from backup
./docker/build.sh
```

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
