# Disaster Recovery — Rebuild from GitHub Only

This guide recovers the **entire E-Trike autonomous driving stack** from
nothing but the `etrike-av` GitHub repository. No Syncthing, no backup
drives, no developer laptops required.

## What you need on the machine

| Requirement | Why |
|-------------|-----|
| Ubuntu 22.04 (x86_64 or aarch64) | ROS 2 Humble / Autoware base |
| NVIDIA GPU + drivers | CUDA perception / simulation |
| Docker + NVIDIA Container Runtime | Autoware container |
| Git | clone the repo |
| `vcstool` (`pip install vcstool`) | imports upstream Autoware repos |
| ~50 GB free disk | Autoware source + build + Docker image |
| Internet access | GitHub, Docker Hub, vcstool imports |

Install vcstool if missing:

```bash
pip install vcstool
```

## Step-by-step recovery

### 1. Clone the repository

```bash
git clone https://github.com/shakilapr/etrike-av.git ~/av_project
cd ~/av_project
```

This gives you **everything tracked in Git**:

```
~/av_project/
├── autoware/src/our_packages/     ← all 8 E-Trike packages (tracked)
├── repositories/autoware.repos    ← pinned upstream manifest (tracked)
├── scripts/                       ← build, patch, bootstrap scripts (tracked)
├── docker/                        ← container scripts (tracked)
├── docs/                          ← all documentation (tracked)
├── UPSTREAM_MODIFICATIONS.md      ← patch registry (tracked)
└── .github/workflows/ci.yml      ← CI pipeline (tracked)
```

But `autoware/src/` (the upstream Autoware source) is **git-ignored** —
it's not in the repo. That's intentional: it's rebuilt from manifests.

### 2. Bootstrap the upstream workspace

```bash
./scripts/bootstrap_workspace.sh
```

This single command:

1. **Imports upstream Autoware** from `repositories/autoware.repos` into
   `autoware/src/` — pinned to exact commit SHAs (Nebula v1.1.0, Autoware
   Universe at a specific tag, etc.)
2. **Verifies** all expected upstream components exist
3. **Applies E-Trike patches** (Nebula XT32M2X firetime correction)
4. **Verifies** all patches applied correctly

After this step, `autoware/src/` contains:
- Upstream Autoware (from GitHub, pinned versions)
- `our_packages/` (from your clone, already present)
- Patched Nebula (firetime applied)

### 3. Pull the Docker image

```bash
docker pull ghcr.io/autowarefoundation/autoware:universe-cuda-humble
```

This provides ROS 2 Humble, CUDA, and pre-built Autoware at `/opt/autoware/`.

### 4. Build

```bash
./docker/build.sh
```

Builds only our 8 E-Trike packages + 3 patched Nebula packages inside the
container. Does NOT rebuild all of Autoware (~15 min on a fast machine).

### 5. Test

```bash
./run_tests.sh
```

Runs pytest + linters for all 8 E-Trike packages.

### 6. Restore external data (manual)

The following are **NOT in Git** (too large or environment-specific) and
must be restored from backup or re-generated:

| Item | Location | How to restore |
|------|----------|----------------|
| HD map (pointcloud + lanelet2) | `~/autoware_map/` | Copy from backup or re-download |
| AWSIM simulator data | `simulator/AWSIM/` | Clone from AWSIM repo |
| ML model weights | `data/` | Download from model registry |
| Syncthing config | `~/.config/syncthing/` | Reconfigure if needed |
| Vehicle CAN config | `/etc/etrike/` or vehicle/ | Copy from backup |

### 7. Verify the build works

```bash
# Enter the container
./docker/shell.sh

# Inside container:
source /opt/autoware/setup.bash
source install/setup.bash

# Check our packages are found
ros2 pkg list | grep etrike

# Launch planning simulator with E-Trike model
ros2 launch autoware_launch planning_simulator.launch.xml \
  map_path:=/autoware_map/sample-map-planning \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit
```

If RViz opens and shows the tuktuk model, recovery is complete.

## What gets restored automatically vs manually

| Component | Restored by | Requires |
|-----------|-------------|----------|
| E-Trike packages (8) | `git clone` | Nothing |
| Upstream Autoware source | `bootstrap_workspace.sh` | Internet |
| Nebula firetime patch | `bootstrap_workspace.sh` | Internet |
| Docker environment | `docker pull` | Internet |
| Built packages | `docker/build.sh` | Docker image |
| Tests | `run_tests.sh` | Built packages |
| HD map | **Manual** | Backup or download |
| Vehicle configs | **Manual** | Backup |
| Sensor calibration | **Manual** | Backup |

## Architecture: why this works

The repo follows a three-layer model:

```
┌──────────────────────────────────────────────┐
│ 3. PRODUCT / VEHICLE CODE                    │
│    our_packages/ — fully tracked in Git      │
├──────────────────────────────────────────────┤
│ 2. CONTROLLED UPSTREAM DELTAS                │
│    patches/ + scripts/apply_patches.sh       │
│    Every change explicit and version-pinned  │
├──────────────────────────────────────────────┤
│ 1. UPSTREAM PLATFORM                         │
│    autoware.repos → vcs import               │
│    Re-created from manifests, not committed  │
└──────────────────────────────────────────────┘
```

The Git repo is the **recipe**, not the kitchen. It stores the instructions
to reconstruct everything, not the reconstructed output.

## Recovery time estimate

| Step | Time (fast internet) |
|------|---------------------|
| git clone | ~1 min |
| bootstrap (vcs import + patches) | ~5 min |
| docker pull | ~5 min |
| build | ~15 min |
| tests | ~2 min |
| **Total (without external data)** | **~30 min** |

## If something goes wrong

### `vcs import` fails
- Check internet connectivity to GitHub
- Verify `repositories/autoware.repos` is valid YAML: `python3 -c "import yaml; yaml.safe_load(open('repositories/autoware.repos'))"`

### Nebula patch fails
- The script now has assertions — if a marker isn't found, upstream Nebula
  changed. Check `UPSTREAM_MODIFICATIONS.md` for the expected Nebula version.
- Verify: `grep 'version:' repositories/autoware.repos | grep nebula`

### Build fails
- Ensure Docker image is the correct one: `docker images | grep autoware`
- Try clean build: `docker run ... colcon build --cmake-clean-cache --packages-up-to ...`

### Tests fail
- Check `colcon test-result --verbose` for details
- Most failures are missing config files — check `etrike_sensor_kit_launch/config/`

## Related documentation

- `UPSTREAM_MODIFICATIONS.md` — what patches exist and why
- `docs/HOW_BUILD_WORKS.md` — how the overlay build works
- `docs/ETRIKE_AV_GIT_WORKFLOW.md` — daily Git workflow
- `docs/JETSON_QUICK_REF.md` — Jetson-specific commands
