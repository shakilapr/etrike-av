# Autoware Source Setup

**Date:** 2026-08-10
**Server:** `med1@172.16.25.56`

---

## How the source was downloaded

### Step 1 — Install vcstool

```bash
pip3 install vcstool
# vcstool-0.3.0 installed
```

`vcs` is the CLI provided by `python3-vcstool`. It reads `.repos` YAML manifests and
clones/pins all the listed Git repositories.

### Step 2 — Get the official `.repos` manifest

The Autoware Foundation maintains a meta-repository at:

```
https://github.com/autowarefoundation/autoware
```

This repo does NOT contain the actual Autoware source. It contains:

| Path                              | Purpose                                    |
| --------------------------------- | ------------------------------------------ |
| `repositories/autoware.repos`     | Stable pinned versions of all components   |
| `repositories/autoware-nightly.repos` | Nightly/unstable branches              |
| `repositories/simulator.repos`    | Simulator packages (AWSIM, etc.)           |
| `repositories/tools.repos`        | Developer tools                            |
| `repositories/extra-packages.repos` | Optional hardware drivers               |
| `ansible/`                        | Setup/dev-environment automation           |
| `docker/`                         | Dockerfiles for various configurations     |

```bash
cd /tmp
git clone --depth 1 https://github.com/autowarefoundation/autoware.git
cp /tmp/autoware/repositories/autoware.repos ~/av_project/repositories/
cp /tmp/autoware/repositories/simulator.repos ~/av_project/repositories/
cp /tmp/autoware/repositories/tools.repos ~/av_project/repositories/
```

### Step 3 — Import all repositories into the workspace

The `.repos` file maps each component to a subdirectory under `src/`:

```yaml
# Example entries from autoware.repos
repositories:
  core/autoware_msgs:
    type: git
    url: https://github.com/autowarefoundation/autoware_msgs.git
    version: 1.13.0
  universe/autoware_universe:
    type: git
    url: https://github.com/autowarefoundation/autoware_universe.git
    version: 1.9.0
  ...
```

Run the import from the workspace root:

```bash
cd ~/av_project/autoware
vcs import src < ../repositories/autoware.repos
```

This clones 30+ repositories with pinned versions into `src/`.

### Resulting directory structure

```
~/av_project/autoware/src/
├── core/              ← autoware_msgs, autoware_core, autoware_utils, agnocast, ...
├── universe/          ← planning, control, perception, localization, system, ...
├── launcher/          ← autoware_launch, launch configs
├── sensor_component/  ← sensor drivers
└── our_packages/      ← OUR custom packages (created earlier)
```

### Step 4 — Save our own manifest

Later we'll create `~/av_project/repositories/our_autoware.repos` that mixes:

- Official repos pinned to known-good versions
- Our forks where we've modified internals
- Our own packages from our repos

```bash
# When ready:
vcs import src < ~/av_project/repositories/our_autoware.repos
```

---

## Final state (after import completed)

| Directory              | Size   |
| ---------------------- | ------ |
| `src/core/`            | ~282M  |
| `src/universe/`        | ~599M  |
| `src/launcher/`        | ~46M   |
| `src/sensor_component/` | ~126M |
| `src/our_packages/`    | 4K (empty skeleton) |
| **Total**              | **1.3G** |
| Repos cloned           | 30+    |

---

## Adapting `run_demo.sh` for our custom codebase

### Current script (`/home/med1/run_demo.sh`)

```bash
#!/bin/bash
xhost +local:docker

docker run -it --rm \
  --privileged \
  --runtime=nvidia \
  --gpus all \
  --net=host \
  --ipc=host \
  -e DISPLAY=$DISPLAY \
  -e WAYLAND_DISPLAY=$WAYLAND_DISPLAY \
  -e XDG_RUNTIME_DIR=/tmp \
  -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/tmp/$WAYLAND_DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/autoware_map:/autoware_map \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  ros2 launch autoware_launch planning_simulator.launch.xml \
    map_path:=/autoware_map/sample-map-planning \
    vehicle_model:=etrike_vehicle \
    sensor_model:=sample_sensor_kit
```

**What this does:**
- Pulls the official `ghcr.io/autowarefoundation/autoware:universe-cuda-humble` image
- That image has Autoware **already built inside it** at `/autoware`
- Mounts only the map data
- Runs `ros2 launch` using the baked-in Autoware

### What we need instead

We want to use the Docker image as a **toolchain only** (ROS 2, CUDA, compilers, dependencies)
and overlay OUR workspace on top.

The key mechanism is the ROS 2 **workspace overlay**: when we source our
`install/setup.bash` AFTER the image's baked-in setup, our packages shadow theirs.

```text
                ┌─────────────────────────────────┐
                │  ghcr.io/autoware:universe-cuda │
                │                                  │
                │  /opt/autoware/setup.bash    │  ← baked-in Autoware (base)
                │         +                        │
                │  our /workspace/install/setup.bash│  ← our overlay (takes priority)
                │         =                        │
                │  merged workspace                │
                └─────────────────────────────────┘
```

### Adapted script

Create `~/av_project/docker/run.sh`:

```bash
#!/bin/bash
xhost +local:docker

docker run -it --rm \
  --privileged \
  --runtime=nvidia \
  --gpus all \
  --net=host \
  --ipc=host \
  -e DISPLAY=$DISPLAY \
  -e WAYLAND_DISPLAY=$WAYLAND_DISPLAY \
  -e XDG_RUNTIME_DIR=/tmp \
  -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/tmp/$WAYLAND_DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/autoware_map:/autoware_map \
  -v ~/av_project/autoware:/workspace/autoware \
  -v ~/av_project/vehicle:/workspace/vehicle \
  -v ~/av_project/data:/workspace/data \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  /bin/bash -c "
    source /opt/autoware/setup.bash && \
    source /workspace/opt/autoware/setup.bash && \
    ros2 launch autoware_launch planning_simulator.launch.xml \
      map_path:=/autoware_map/sample-map-planning \
      vehicle_model:=etrike_vehicle \
      sensor_model:=sample_sensor_kit
  "
```

### But first — you need to build the workspace

Before the launch script works, you need to do an initial build ONCE
(and then incrementally after each change):

```bash
# Enter the container interactively
docker run -it --rm \
  --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -e DISPLAY=$DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/autoware_map:/autoware_map \
  -v ~/av_project/autoware:/workspace/autoware \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  /bin/bash

# Inside the container:
source /opt/autoware/setup.bash

cd /workspace/autoware

# First full build (this takes a while)
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release

# Source our overlay
source install/setup.bash

# Test
ros2 launch autoware_launch planning_simulator.launch.xml \
  map_path:=/autoware_map/sample-map-planning \
  vehicle_model:=etrike_vehicle \
  sensor_model:=sample_sensor_kit
```

### Daily workflow after initial build

```bash
# Edit code on the Linux host:
#   ~/av_project/autoware/src/our_packages/our_controller/src/...

# Enter container
docker run -it --rm ... same mounts ... /bin/bash

# Source
source /opt/autoware/setup.bash
cd /workspace/autoware

# Build ONLY what changed
colcon build --symlink-install --packages-select our_controller

# Source overlay
source install/setup.bash

# Test
ros2 launch ...
```

### Three scripts to create

| Script                    | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| `docker/build.sh`         | Full workspace build inside container        |
| `docker/run.sh`           | Launch with our workspace overlay            |
| `docker/shell.sh`         | Interactive shell into the container         |

### `docker/build.sh`

```bash
#!/bin/bash
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

### `docker/shell.sh`

```bash
#!/bin/bash
xhost +local:docker

docker run -it --rm \
  --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -e DISPLAY=$DISPLAY \
  -e WAYLAND_DISPLAY=$WAYLAND_DISPLAY \
  -e XDG_RUNTIME_DIR=/tmp \
  -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/tmp/$WAYLAND_DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/autoware_map:/autoware_map \
  -v ~/av_project/autoware:/workspace/autoware \
  -v ~/av_project/vehicle:/workspace/vehicle \
  -v ~/av_project/data:/workspace/data \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  /bin/bash
```

### How the overlay works

When you source both setup files, the order matters:

```bash
source /opt/autoware/setup.bash        # base layer (baked-in Autoware)
source /workspace/opt/autoware/setup.bash  # overlay (OUR workspace)
```

| Package                          | Resolves from               |
| -------------------------------- | --------------------------- |
| `autoware_planning` (untouched)  | baked-in `/opt/autoware` |
| `our_controller` (our package)   | our `/workspace/install`    |
| `autoware_mpc` (we modified it)  | our `/workspace/install` (shadows baked-in) |

ROS 2 workspace chaining handles this — the last-sourced workspace wins for any
package present in both.

### Docker image is STILL not rebuilt

We're using the SAME `ghcr.io/autowarefoundation/autoware:universe-cuda-humble`
image the entire time. We never modify it. Our workspace is just bind-mounted on top.
