# SETUP_COMPLETE.md — AV Project Master Documentation

**The definitive reference for everything done in the AV project setup so far.**
Companion documents: [`SETUP.md`](SETUP.md) (original design), [`AUTOWARE_SOURCE_SETUP.md`](AUTOWARE_SOURCE_SETUP.md) (source pull + docker workflow), [`SYNCTHING_SETUP.md`](SYNCTHING_SETUP.md) (Syncthing install & config).

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Server & Platform](#2-server--platform)
3. [Directory Structure](#3-directory-structure)
4. [Docker Image](#4-docker-image)
5. [How the Source Was Pulled](#5-how-the-source-was-pulled)
6. [How Vehicle Configs Were Created](#6-how-vehicle-configs-were-created)
7. [First Build](#7-first-build)
8. [Docker Workflow (3 Scripts)](#8-docker-workflow-3-scripts)
9. [The Overlay Mechanism](#9-the-overlay-mechanism)
10. [Syncthing Setup](#10-syncthing-setup)
11. [Key Commands](#11-key-commands)
12. [What's Still Pending](#12-whats-still-pending)

---

## 1. Project Overview

Full-source Autoware development workspace for autonomous vehicle research on an
ARM64 Jetson-class server.

**Key principle:** Docker provides the toolchain only (Ubuntu, ROS 2, CUDA,
compilers, dependencies). The entire Autoware source lives on the Linux host,
is bind-mounted into the container, and only the packages we modify are built
with `colcon`. **The Docker image is never modified and never rebuilt** for
code changes.

The official `ghcr.io/autowarefoundation/autoware:universe-cuda-humble` image
already contains Autoware pre-built as apt packages at `/opt/autoware/`. Our
workspace overlays on top of that base layer, so any package we build shadows
the pre-built version.

---

## 2. Server & Platform

| Item              | Value                          |
| ----------------- | ------------------------------ |
| Server            | `med1@172.16.25.56`            |
| Architecture      | ARM64 (Jetson / Tegra)         |
| OS                | Linux 5.15.185-tegra           |
| ROS 2 distro      | humble (via Docker image)      |
| Container runtime | Docker with NVIDIA container toolkit |

Access from Windows:

```powershell
ssh med1@172.16.25.56
cd ~/av_project
```

---

## 3. Directory Structure

```
~/av_project/
├── autoware/                    ← ROS 2 colcon workspace
│   ├── src/
│   │   ├── core/                ← official Autoware (282M, 30+ repos)
│   │   ├── universe/            ← official Autoware (599M)
│   │   ├── launcher/            ← launch configs (46M)
│   │   ├── sensor_component/    ← sensor drivers (126M)
│   │   ├── simulator/           ← scenario_simulator_v2
│   │   ├── tools/               ← autoware_tools
│   │   └── our_packages/        ← empty skeleton for our custom packages
│   ├── build/                   ← colcon build output (excluded from sync)
│   ├── install/                 ← colcon install output (excluded from sync)
│   └── log/                     ← build logs (excluded from sync)
├── vehicle/
│   ├── parameters/              ← vehicle_info.param.yaml, mirror.param.yaml, simulator_model.param.yaml
│   ├── launch/                  ← vehicle_interface.launch.xml
│   ├── calibration/             ← empty, pending
│   └── description/             ← vehicle.xacro + mesh/
├── simulator/
│   └── AWSIM/                   ← AWSIM-Labs v1.6.1 (cloning in progress, 451M so far)
├── data/
│   ├── maps/                    ← symlink to ~/autoware_map/sample-map-planning
│   ├── bags/                    ← empty
│   └── models/                  ← empty
├── repositories/
│   ├── autoware.repos           ← official pinned manifest
│   ├── simulator.repos          ← scenario_simulator v22.0.0
│   └── tools.repos              ← autoware_tools v0.7.0
├── docker/
│   ├── build.sh                 ← runs colcon build
│   ├── run.sh                   ← launches with overlay
│   └── shell.sh                 ← interactive shell
├── docs/
│   ├── SETUP.md                     ← original project design doc
│   ├── SYNCTHING_SETUP.md           ← Syncthing install & config
│   ├── AUTOWARE_SOURCE_SETUP.md     ← how source was pulled + docker workflow
│   ├── HOW_BUILD_WORKS.md           ← overlay/build explanation
│   └── SETUP_COMPLETE.md            ← THIS FILE (master documentation)
├── .stignore                    ← Syncthing exclusions
└── shared.md                    ← (user's file)
```

---

## 4. Docker Image

| Item          | Value                                                  |
| ------------- | ------------------------------------------------------ |
| Image         | `ghcr.io/autowarefoundation/autoware:universe-cuda-humble` |
| Size          | 17.8 GB                                                |
| Role          | Toolchain only — never modified, never rebuilt         |
| Base layer    | Autoware **pre-installed** at `/opt/autoware/` via apt debs (NOT at `/autoware/install/`) |
| Our workspace | `/workspace/autoware` (bind-mounted from `~/av_project/autoware`) |

Key facts:

- The image has 300+ pre-built Autoware packages as apt deb packages.
- `source /opt/autoware/setup.bash` makes the base layer available.
- Our workspace builds on top and **shadows** any package we rebuild.
- The old workflow (`/home/med1/run_demo.sh`) used the image's baked-in Autoware
  directly; our workflow instead uses the image as a base and overlays our source.

Mounts used in all scripts:

| Host path                 | Container path      |
| ------------------------- | ------------------- |
| `~/av_project/autoware`   | `/workspace/autoware` |
| `~/av_project/vehicle`    | `/workspace/vehicle`  |
| `~/av_project/data`       | `/workspace/data`     |
| `~/autoware_map`          | `/autoware_map`       |

Container flags used everywhere: `--privileged`, `--runtime=nvidia`, `--gpus all`,
`--net=host`, `--ipc=host`, plus X11/Wayland display passthrough.

---

## 5. How the Source Was Pulled

Total: **1.9 GB source** across 7 directories in `src/`.

### Step 1 — Install vcstool

```bash
pip3 install vcstool
# vcstool-0.3.0 installed  →  the `vcs` CLI
```

### Step 2 — Get the official `.repos` manifests

The Autoware Foundation meta-repo (`autowarefoundation/autoware`) contains the
manifests, not the source itself:

```bash
cd /tmp
git clone --depth 1 https://github.com/autowarefoundation/autoware.git
cp /tmp/autoware/repositories/autoware.repos ~/av_project/repositories/
cp /tmp/autoware/repositories/simulator.repos ~/av_project/repositories/
cp /tmp/autoware/repositories/tools.repos ~/av_project/repositories/
```

### Step 3 — Import all repositories into the workspace

```bash
cd ~/av_project/autoware
vcs import src < ../repositories/autoware.repos
vcs import src < ../repositories/simulator.repos
vcs import src < ../repositories/tools.repos
```

`vcs import` reads the YAML manifests and clones every listed repo pinned to its
declared version. Result:

| Directory              | Size  | Contents                                   |
| ---------------------- | ----- | ------------------------------------------ |
| `src/core/`            | ~282M | autoware_msgs, autoware_core, autoware_utils, agnocast, ... |
| `src/universe/`        | ~599M | planning, control, perception, localization, system, ... |
| `src/launcher/`        | ~46M  | autoware_launch, launch configs            |
| `src/sensor_component/`| ~126M | sensor drivers                             |
| `src/simulator/`       | —     | scenario_simulator_v2 (v22.0.0)            |
| `src/tools/`           | —     | autoware_tools (v0.7.0)                    |
| `src/our_packages/`    | 4K    | empty skeleton for our custom packages     |
| **Total**              | **1.9G** | 30+ repos cloned                        |

### Step 4 — Save our own manifest (planned)

Later we'll write `repositories/our_autoware.repos` that mixes:
- Official repos pinned to known-good versions
- Our forks where we've modified internals
- Our own packages

Reproduce the workspace on a new machine:

```bash
mkdir -p ~/av_project/autoware/src
cd ~/av_project/autoware
vcs import src < ../repositories/our_autoware.repos
```

---

## 6. How Vehicle Configs Were Created

The vehicle configuration files were **copied from the `sample_vehicle_description`
package** inside the launcher source (`src/launcher/`) and placed in the
`vehicle/` directory on the host (NOT inside the workspace — vehicle config is
not code).

| File                                                              | Destination                    |
| ----------------------------------------------------------------- | ------------------------------ |
| `vehicle_info.param.yaml`                                          | `vehicle/parameters/`          |
| `simulator_model.param.yaml`                                       | `vehicle/parameters/`          |
| `mirror.param.yaml`                                                | `vehicle/parameters/`          |
| `vehicle.xacro` + mesh files                                       | `vehicle/description/`         |
| `vehicle_interface.launch.xml`                                     | `vehicle/launch/`              |

Current contents:

```
vehicle/parameters/
├── vehicle_info.param.yaml
├── simulator_model.param.yaml
└── mirror.param.yaml

vehicle/launch/
└── vehicle_interface.launch.xml

vehicle/description/
├── vehicle.xacro
└── mesh/
```

`vehicle/calibration/` exists but is still empty — calibration is pending.

Autoware nodes read these via the ROS 2 parameter mechanism, so tuning vehicle
dimensions and limits requires **no C++ changes**.

---

## 7. First Build

Status at the time of writing: **running** (in progress).

### How it runs

```bash
# docker run with bind mount of the workspace
docker run -it --rm \
  --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -v ~/av_project/autoware:/workspace/autoware \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  /bin/bash -c "
    source /opt/autoware/setup.bash && \
    cd /workspace/autoware && \
    colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
  "
```

Sequence inside the container:

1. `source /opt/autoware/setup.bash` — makes the base layer (300+ pre-built apt packages) visible
2. `colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release` — full workspace build
3. Output goes to `build/`, `install/`, `log/` — all three are **excluded from Syncthing sync**

### Why `--symlink-install`

Enables fast edit-test cycles: source files stay in `src/`, and `install/`
contains symlinks into the source tree, so edits take effect without rebuilding.

---

## 8. Docker Workflow (3 Scripts)

All scripts live in `~/av_project/docker/` and are executable on the host.

### `docker/build.sh` — Full workspace build

Runs the complete colcon build inside the container (sources base layer first).

```bash
./docker/build.sh
```

### `docker/shell.sh` — Interactive shell

Drops you into an interactive bash shell with GPU, display, and all mounts.
Use this for incremental builds, editing, and testing.

```bash
./docker/shell.sh
# inside the container:
source /opt/autoware/setup.bash
cd /workspace/autoware
```

### `docker/run.sh` — Launch Autoware

Sources base layer + our overlay, then launches the planning simulator
with the sample vehicle/sensor kit.

```bash
./docker/run.sh
```

Equivalent to:

```bash
xhost +local:docker
docker run ... (same mounts) ... /bin/bash -c "
  source /opt/autoware/setup.bash && \
  source /workspace/autoware/install/setup.bash && \
  exec \"\$@\"
" -- ros2 launch autoware_launch planning_simulator.launch.xml \
    map_path:=/autoware_map/sample-map-planning \
    vehicle_model:=sample_vehicle \
    sensor_model:=sample_sensor_kit
```

| Script            | Purpose                                          |
| ----------------- | ------------------------------------------------ |
| `docker/build.sh` | Full workspace build inside the container        |
| `docker/shell.sh` | Interactive shell (GPU, display, all mounts)     |
| `docker/run.sh`   | Launch Autoware with our workspace overlay       |

---

## 9. The Overlay Mechanism

This is the core architecture. The official image pre-installs Autoware at
`/opt/autoware/` as apt debs (the **base layer**). Our workspace is built and
**overlaid** on top of it:

```bash
source /opt/autoware/setup.bash                    # base layer (300+ pre-built packages from apt)
source /workspace/autoware/install/setup.bash      # overlay (our packages + modified packages)
```

```
                ┌─────────────────────────────────┐
                │  ghcr.io/autoware:universe-cuda │
                │                                  │
                │  /opt/autoware/setup.bash        │  ← baked-in Autoware (base)
                │         +                        │
                │  /workspace/autoware/install/    │  ← our overlay (takes priority)
                │    setup.bash                    │
                │         =                        │
                │  merged workspace                │
                └─────────────────────────────────┘
```

**Order matters:** the last-sourced workspace wins for any package present in
both. Any package we build in our workspace **shadows** the pre-built apt version.

| Package                          | Resolves from                    |
| -------------------------------- | -------------------------------- |
| `autoware_planning` (untouched)  | baked-in `/opt/autoware`         |
| `our_controller` (our package)   | our `/workspace/autoware/install` |
| `autoware_mpc_lateral_controller` (we modified it) | our `/workspace/autoware/install` (shadows baked-in) |

This is why we never need to rebuild the 17.8 GB Docker image: package
resolution at runtime decides whether the pre-built or our version is used.

---

## 10. Syncthing Setup

Syncthing syncs the project between the Linux server and a Windows machine.

### Installation (already done)

```bash
sudo mkdir -p /etc/apt/keyrings
sudo curl -L -o /etc/apt/keyrings/syncthing-archive-keyring.gpg \
  https://syncthing.net/release-key.gpg

echo "deb [signed-by=/etc/apt/keyrings/syncthing-archive-keyring.gpg] https://apt.syncthing.net/ syncthing stable-v2" | \
  sudo tee /etc/apt/sources.list.d/syncthing.list

sudo apt update
sudo apt install -y syncthing
syncthing --version
# syncthing v2.1.3 "Hafnium Hornet" (go1.26.5 linux-arm64)
```

### Systemd service (already done)

```bash
sudo systemctl enable --now syncthing@med1.service
systemctl status syncthing@med1.service
# Expected: Active: active (running)
```

The `syncthing@med1.service` user service keeps Syncthing running even when
`med1` is not logged in — recommended for a development server.

### Web GUI via SSH tunnel (never expose port 8384 directly)

```bash
ssh -N -L 8384:localhost:8384 med1@172.16.25.56
# then open http://localhost:8384 in a browser
```

### `.stignore` exclusions

Created at `~/av_project/.stignore`:

```
/autoware/build
/autoware/install
/autoware/log

/data/bags

**/.git
**/__pycache__
**/.cache

/simulator/AWSIM/Library
/simulator/AWSIM/Temp
/simulator/AWSIM/obj
/simulator/AWSIM/Logs
/simulator/AWSIM/UserSettings
```

Why:

| Pattern                         | Reason                                                       |
| ------------------------------- | ------------------------------------------------------------ |
| `/autoware/build`               | colcon build output — Linux-only, large, regenerated on demand |
| `/autoware/install`             | colcon install output — Linux-only, contains symlinks        |
| `/autoware/log`                 | colcon build logs — not needed on Windows                    |
| `/data/bags`                    | ROS bag recordings — can be hundreds of GB                   |
| `**/.git`                       | Git database stays Linux-side; source files still sync       |
| `**/__pycache__`                | Python bytecode — regenerated automatically                  |
| `**/.cache`                     | Build tool caches                                            |
| `/simulator/AWSIM/{Library,Temp,obj,Logs,UserSettings}` | Unity generated caches/artifacts, per-machine settings |

Notes:

- `.stignore` itself is **not synchronized** by Syncthing (by design).
- Patterns are relative to the shared folder root (`~/av_project`).
- Changes take effect immediately; no restart needed.

**What Windows receives:** source files only (`.cpp .hpp .py .yaml .xml`,
`CMakeLists.txt`, `package.xml`, `Dockerfile`, Unity `Assets/`, `ProjectSettings/`).
No `.git/` directories, no build artifacts.

---

## 11. Key Commands

### Full build (from host)

```bash
cd ~/av_project
./docker/build.sh
```

### Incremental build (inside `docker/shell.sh`)

```bash
source /opt/autoware/setup.bash
cd /workspace/autoware
colcon build --symlink-install --packages-select our_controller
```

### Interface / message changes — rebuild dependents too

```bash
colcon build --symlink-install --packages-above our_msgs
```

### Interactive development shell

```bash
cd ~/av_project
./docker/shell.sh
```

### Launch the planning simulator

```bash
cd ~/av_project
./docker/run.sh
```

### Source & test manually

```bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
ros2 launch autoware_launch planning_simulator.launch.xml \
  map_path:=/autoware_map/sample-map-planning \
  vehicle_model:=sample_vehicle \
  sensor_model:=sample_sensor_kit
```

### Build command cheat sheet

| Changed what                   | Build command                     |
| ------------------------------ | --------------------------------- |
| Implementation only (`.cpp`)   | `--packages-select <pkg>`         |
| Interface / headers / messages | `--packages-above <pkg>`          |
| Everything (first time / big rebase) | `colcon build --symlink-install` (no filter) |

### Syncthing

```bash
systemctl status syncthing@med1.service   # check service
ssh -N -L 8384:localhost:8384 med1@172.16.25.56   # tunnel to web GUI
```

---

## 12. What's Still Pending

- [ ] **First build completion** — `colcon build` was still running at the time of writing
- [ ] **AWSIM-Labs clone completion** — `simulator/AWSIM/` (v1.6.1) was still cloning (451 MB downloaded so far)
- [ ] **Create our custom packages** under `src/our_packages/`
      (planned: `our_vehicle_interface`, `our_controller`, `our_msgs`, `our_bridge`)
- [ ] **Write `our_autoware.repos`** manifest mixing upstream + forks
- [ ] **Vehicle calibration** — `vehicle/calibration/` is empty
- [ ] **Custom controller implementation**
- [ ] Set up Git remotes (origin = our fork, upstream = Autoware Foundation)
- [ ] Syncthing device pairing & first sync from Windows (Part B)

---

*Last updated: 2026-08-10 — setup phase. See the companion docs for the detailed
history of each step.*
