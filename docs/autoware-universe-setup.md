# Autoware Universe - Setup & Real-Vehicle Integration Guide

> **Companion to `autoware-universe-architecture.md`.** This file collects the
> installation, configuration, calibration, vehicle-interface, deployment, safety
> and troubleshooting material ("setup stuff"). It is a **copy** of the setup
> sections from the architecture reference; the architecture document keeps its
> own copy. Section numbers are kept identical to the architecture reference so
> cross-references stay valid.
>
> The architecture reference remains the authority for *how the pipeline works*.

## Contents

| § | Topic |
|---|---|
| 3 | Ecosystem, Releases & Reproducible Bring-up |
| 4 | Setup & Operating Modes (Simulation vs Real Vehicle) |
| 5 | Vehicle & Sensor Model Configuration |
| 7 | Sensor Integration (LiDAR, Camera, IMU, GNSS, Wheel) |
| 8 | Sensor Calibration |
| 9 | Mapping, Map Loading & Lanelet2 |
| 15 | Vehicle / ECU - Actuation & Drive-by-Wire Integration |
| 20 | Deployment: Network, DDS, Time Sync & Real-Time |
| 21 | Safety, Security & Validation |
| 22 | Failure-Mode, Debug & Known Failure Patterns |
| 26 | Appendix - Deliverables, Command Reference & Sources |
| 27 | Car to Tricycle (Trike) Conversion |

## 3. Ecosystem, Releases & Reproducible Bring-up

### 3.1 Why release pinning is an engineering constraint

Autoware is a **meta-repository** that pins many component repos. Release research
(2026) found that the most common catastrophic integration failure is **mixing
incompatible versions**: stable launch files combined with `main`-branch model
artifacts whose directory layout had changed, producing a launch-time crash. The
open 1.10 work listed many commits accumulated beyond pinned releases
(`autoware_universe`, `autoware_launch`, `autoware_core`).

**Rule: freeze one internally consistent set of release tag + manifest + model
artifacts + configuration. Do not mix release tags, `main`, Docker images and
current artifacts.**

| Item | State (as of the referenced Sep 2026 research) | Practical consequence |
|---|---|---|
| Top-level stable release | **1.9.0** (Jul 16, 2026) | Pin `1.9.0` for reproducible vehicle integration instead of `main` |
| Previous release | **1.8.0** (May 4, 2026) | Fallback baseline if a vendor package has not caught up |
| Cadence | Semantic versioning, ~monthly; **subrepositories release before the aggregate** | Version every integration asset (source, models, config) |
| ROS transition | Jazzy Docker beta Feb 2026 → full Jazzy Apr 2026 → Humble soft-freeze Jan 2027 → Jazzy-only May 2027; Jazzy supported to May 2029 | New deployments should normally target **Jazzy** |
| Architecture | "Architecture 2.0" roadmap; new trajectory/planning infrastructure alongside the modular stack | Treat newer planner architecture as evolving; do not assume one frozen layout |
| ML artifacts | CenterPoint bundle **v4.1** (Aug 2026); Diffusion Planner artifacts in recent releases | Model files must be version-pinned with source |

Always confirm the current tag on the release page before building.

### 3.2 Supported environments

| Environment | Status | Recommendation |
|---|---|---|
| Ubuntu 24.04 + ROS 2 Jazzy | Full Jazzy support since Apr 2026; 1.9.0 compatible | **Recommended baseline for new deployments** unless a sensor SDK / vehicle interface forces Humble |
| Ubuntu 22.04 + ROS 2 Humble | Still documented and supported by 1.9.0; on the retirement path (soft-freeze Jan 2027) | Transitional option only |
| Docker (Humble/Jazzy, CUDA + non-CUDA, amd64/arm64) | Official prebuilt-binary path | Best for reproducibility; harden privileges before road use |
| Native APT/Debian full stack | **Not** presented as the official all-in-one route | Do not assume `apt install autoware`; verify any package repo you use |
| `main` / nightly | Development state; interface/artifact/package migrations | CI/test vehicle only |
| Source build | Primary development/custom-integration path | Use for vehicle/sensor work |

### 3.3 Reference source build (official flow, simplified)

The official procedure uses the **Ansible** environment (not older
`setup-dev-env.sh`), imports repositories with `vcs`, resolves with `rosdep`, and
builds with `colcon`. `vcs` does **not** remove packages that moved, so stale
`src/` entries must be cleaned deliberately.

```bash
# 1. Clone the meta-repo and freeze a stable release BEFORE importing deps.
git clone https://github.com/autowarefoundation/autoware.git
cd autoware
git checkout <STABLE_RELEASE_TAG>          # e.g. the current stable tag

# 2. Provision the dev/runtime environment (Ansible).
bash ansible/scripts/install-ansible.sh
source ~/.bashrc
ansible-galaxy collection install -f -r ansible-galaxy-requirements.yaml
ansible-playbook autoware.dev_env.install_dev_env
#   add --skip-tags nvidia on machines that must not touch a vendor NVIDIA stack

# 3. Import component repositories EXACTLY as pinned by this release.
mkdir -p src
vcs import src < repositories/autoware.repos

# 4. Resolve dependencies.
source /opt/ros/$ROS_DISTRO/setup.bash
rosdep update
rosdep install -y --from-paths src --ignore-src --rosdistro "$ROS_DISTRO"

# 5. Build release binaries.
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
source install/setup.bash
```

Recovery after a structural update (only after saving your own packages):

```bash
rm -rf src/*
vcs import src < repositories/autoware.repos
rosdep install -y --from-paths src --ignore-src --rosdistro "$ROS_DISTRO"
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
```

Dependency reproducibility: recent releases add a `version_lock` Ansible role and
baked runtime dependencies. Prefer reproducing the whole environment over
upgrading individual `colcon-*` Python packages on a vehicle computer.

> **Build-flag warning:** compiling without an optimized type (`Release` or
> `RelWithDebInfo`) makes the whole system — especially point-cloud
> preprocessing — substantially slower. If the workspace is unexpectedly slow,
> delete `build/ install/ log/` and rebuild with `-DCMAKE_BUILD_TYPE=Release`.

### 3.4 Docker (development)

Use the **release-matched** Autoware Docker image rather than an old blog
invocation. During bring-up `--privileged`/host networking is convenient for
hardware access, but it is **not** a road-deployment security architecture —
grant only the capabilities actually required once characterized.

Images are published on GHCR, multi-arch (`amd64`/`arm64`), with CUDA and non-CUDA
variants and stable version suffixes:

```text
ghcr.io/autowarefoundation/autoware:universe-jazzy
ghcr.io/autowarefoundation/autoware:universe-cuda-jazzy
ghcr.io/autowarefoundation/autoware:universe-cuda-jazzy-1.9.0   # pin a release
#     replace `jazzy` with `humble` where appropriate
```

```bash
docker pull ghcr.io/autowarefoundation/autoware:universe-cuda-jazzy-1.9.0

xhost +local:docker
docker run --rm -it --network host --ipc host --gpus all \
  -e DISPLAY="$DISPLAY" -v /tmp/.X11-unix:/tmp/.X11-unix:rw \
  -v "$HOME/autoware_data:/autoware_data" \
  -v /data/autoware/maps:/maps:ro -v /data/autoware/config:/vehicle_config:ro \
  ghcr.io/autowarefoundation/autoware:universe-cuda-jazzy-1.9.0
source /opt/autoware/setup.bash
```

CUDA containers require the NVIDIA Container Toolkit and a compatible driver. A
real-vehicle container must explicitly expose the CAN devices/network namespace,
Ethernet interfaces, serial devices, camera devices and persistent configuration.
For production, **pin by immutable release tag (not `latest`), capture the image
digest, and version-control launch/config packages separately**.

> **This project's concrete Docker overlay, image build and code-update workflow
> are documented in §28** (`docker/Dockerfile.kinect`, `make_image.sh`,
> `build.sh`, `shell.sh`, `run.sh`).

### 3.5 Hardware baseline (guidance, not a guarantee)

Compute demand scales with the perception stack. LSA reference guidance gives a
floor and a recommended class:

| Class | CPU | RAM | GPU |
|---|---|---|---|
| Minimum vehicle-oriented | 8-core x86-64/ARM64 | 32 GB | NVIDIA CUDA-capable |
| Recommended | 16+ cores | 64 GB | RTX 3080 / AGX Orin-class or better |

Also recommended: SSD storage, gigabit-or-better sensor networking and a
**real-time kernel** for production.

Autoware does not define one universal minimum, because sensor count, model,
point-cloud density and map size change the load. Its **reference-hardware
catalogue** lists known in-vehicle computers, e.g. Intel Core Ultra systems with
optional RTX A2000/A4500/5000 Ada GPUs and up to 96 GB RAM; Jetson AGX Orin
32/64 GB; and x86 systems with RTX 4000 SFF Ada or dual RTX 5000. Several expose
**CAN-FD, multi-gigabit Ethernet and GMSL** interfaces. A practical (not official)
multi-sensor starting point: modern 8–16 core CPU, 32 GB RAM (64 GB is much more
comfortable for building + RViz + rosbag replay + several DNNs), NVMe, multi-gig
Ethernet, hardware CAN/CAN-FD and an NVIDIA GPU sized for the chosen DNNs.

**NVIDIA embedded:** Jetson/Thor bring-up is less forgiving than x86 because the
JetPack kernel, CUDA, TensorRT, cuDNN and Autoware dependencies must all agree.
Pin and validate the entire embedded stack as one unit.

### 3.6 Middleware and true zero-copy (Agnocast)

**The DDS bottleneck.** Nodes communicate via ROS 2 DDS (e.g. Eclipse CycloneDDS,
eProsima FastDDS). High-resolution multi-LiDAR pointclouds and uncompressed camera
feeds traversing the standard DDS stack undergo serialization/deserialization,
consuming CPU cycles and adding latency to the sensor→decision path. True
zero-copy shared-memory communication is required for production.

**Why generic zero-copy is hard.** IceOryx and similar solutions only support
message types with **statically allocated sizes**; Autoware relies heavily on
**dynamically sized** messages (vectors for pointclouds, variable object lists).

**Agnocast** is the zero-copy framework built to handle dynamically sized messages.
It has three parts:

| Component | Role |
|---|---|
| Client library | Autoware-facing API |
| Heap runtime hook | Intercepts allocations via `LD_PRELOAD` |
| Custom kernel module | Shared-memory transport |

By intercepting allocations at the heap level, Agnocast writes sensor data directly
into shared memory and passes a pointer to subscribers, bypassing ROS 2
serialization. Reported benchmarks show roughly **2.5–2.9× lower end-to-end
latency at p99.9** versus optimized polling-based shared memory, moving pointcloud
transmission from the millisecond range toward the microsecond range and reducing
CPU starvation.

The `autoware::agnocast_wrapper::Node` wrapper lets a node run as ordinary
`rclcpp` or switch to Agnocast. Treat it as an optimization to enable **after**
ordinary ROS/DDS flow is known-good, and validate version-specifically (its issue
queue is active).

---

## 4. Setup & Operating Modes (Simulation vs Real Vehicle)

Autoware ships several **entry-point launches**. What "opening Autoware" does
depends entirely on which one you run — the common default experience is one of
the **simulations**, not the real vehicle.

### 4.1 Launch entry points

| Launch file (`autoware_launch/launch/`) | Purpose | Sensor data from | Vehicle actuation | `use_sim_time` | `system_run_mode` |
|---|---|---|---|---|---|
| `autoware.launch.xml` | **Base bring-up** (used by all others); entry point for a **real vehicle** | Real drivers (`launch_sensing_driver=true`) | Real vehicle interface | `false` | `online` |
| `planning_simulator.launch.xml` | **Planning simulation** — dummy perception + dummy vehicle | `dummy_perception_publisher` | `simple_planning_simulator` | `false` (or true w/ scenario sim) | `planning_simulation` |
| `logging_simulator.launch.xml` | **Replay a rosbag** of real runs; no sensor drivers | Rosbag | none | `true` | `logging_simulation` |
| `e2e_simulator.launch.xml` | **End-to-end simulation** with AWSIM or CARLA (`simulator_type`) | AWSIM / CARLA | simulator | `true` | — |

So: **opening the default tutorial opens the full simulation.** Real driving runs
`autoware.launch.xml` (or a wrapper) with real sensors and the vehicle interface.

### 4.2 Simulation vs real vehicle

| Aspect | Simulation | Real vehicle |
|---|---|---|
| Time source | `/clock` (`use_sim_time=true`) | system clock (`use_sim_time=false`) |
| `is_simulation` | `true` | `false` |
| `system_run_mode` | `planning_simulation` / `logging_simulation` | `online` |
| Sensor data | dummy / AWSIM / CARLA / bag | Nebula (LiDAR), camera, GNSS, IMU, wheel speed |
| `launch_sensing_driver` | `false` | `true` |
| Vehicle actuation | dummy vehicle / simulator | real vehicle interface (CAN/serial) |
| `launch_vehicle_interface` | `false` | `true` |
| Map | same HD map | same HD map |

### 4.3 Key launch arguments (`autoware.launch.xml`)

| Argument | Default | Meaning |
|---|---|---|
| `map_path` | *(required)* | Directory with `lanelet2_map.osm`, `pointcloud_map.pcd`, `map_projector_info.yaml`, metadata |
| `vehicle_model` | `sample_vehicle` | Resolves `<vehicle_model>_description` + `<vehicle_model>_launch` |
| `sensor_model` | `sample_sensor_kit` | Resolves `<sensor_model>_description` + `<sensor_model>_launch` |
| `data_path` | `~/autoware_data/ml_models` | ML model artifacts (TensorRT engines, etc.) |
| `use_sim_time` | `false` | Use `/clock` instead of system time |
| `is_simulation` | `false` | Changes behavior (diagnostics/timeout handling, etc.) |
| `system_run_mode` | `online` | `online` / `planning_simulation` / `logging_simulation` |
| `launch_sensing_driver` | `true` | Start real sensor drivers |
| `launch_vehicle_interface` | `true` | Start the real vehicle interface |
| `perception_mode` | `lidar` | `camera_lidar_radar_fusion`, `camera_lidar_fusion`, `lidar_radar_fusion`, `lidar`, `radar` |
| `lanelet2_map_file` / `pointcloud_map_file` | `lanelet2_map.osm` / `pointcloud_map.pcd` | File names inside `map_path` |
| `launch_vehicle/system/map/sensing/localization/perception/planning/control/api` | `true` | Selectively enable subsystems |
| `launch_dummy_diag_publisher` | `false` | Publish fake diagnostics (sims) |
| `rviz` | `true` | Launch RViz |

### 4.4 Checklist: switch from simulation to a real vehicle

| # | Step | Details |
|---|---|---|
| 1 | Freeze the **software baseline** | One release tag + manifest + model artifacts + config (§3) |
| 2 | Provide an **HD map** | PCD + Lanelet2 `.osm` + `map_projector_info.yaml`; set `map_path` (§9) |
| 3 | Provide **ML models** | TensorRT engines/artifacts under `data_path`, matching the release layout |
| 4 | Create the **vehicle package** | `<vehicle_model>_description` + `<vehicle_model>_launch` (§5) |
| 5 | Create the **sensor kit** | `<sensor_model>_description` + `<sensor_model>_launch` (§5, §7) |
| 6 | Implement the **vehicle interface** | `/control/command/*` → CAN; `/vehicle/status/*` back; watchdogs (§15) |
| 7 | Enable real sensing | `launch_sensing_driver=true`; configure each driver |
| 8 | Flip global flags | `use_sim_time=false`, `is_simulation=false`, `system_run_mode=online` |
| 9 | **Calibrate** | Sensor extrinsics/intrinsics, IMU, GNSS/INS orientation (§8) |
| 10 | Pick perception | `perception_mode` matching the sensor set |

---

## 5. Vehicle & Sensor Model Configuration

Autoware never hardcodes a vehicle or sensor set. `vehicle_model` and
`sensor_model` resolve to four packages; replace the **sample** packages entirely —
do not just rename `sample_vehicle`.

### 5.1 Package tree (reference structure)

```text
src/
└── my_platform/
    ├── my_vehicle_description/
    │   ├── config/vehicle_info.param.yaml
    │   ├── mesh/my_vehicle.dae
    │   └── urdf/
    ├── my_vehicle_launch/
    │   ├── config/raw_vehicle_cmd_converter/
    │   ├── config/controller/
    │   ├── config/vehicle_interface/
    │   └── launch/vehicle_interface.launch.xml
    ├── my_sensor_kit_description/
    │   ├── config/sensor_kit_calibration.yaml
    │   ├── config/sensors_calibration.yaml
    │   └── urdf/
    └── my_sensor_kit_launch/
        ├── config/
        └── launch/
            ├── sensing.launch.xml
            ├── lidar.launch.xml
            ├── camera.launch.xml
            ├── imu.launch.xml
            └── gnss.launch.xml
```

Copy the *model structure from your frozen `autoware_launch` tag*, not a random
historical `sample_sensor_kit` repo (older kits have been archived/moved).

### 5.2 Vehicle dimensions (`vehicle_info.param.yaml`)

Every value is **vehicle-specific and must be measured**. A mistake produces
software that looks healthy while generating physically wrong trajectories.

```yaml
/**:
  ros__parameters:
    wheel_radius: <MEASURED>        # dead reckoning
    wheel_width:  <MEASURED>
    wheel_base:   <MEASURED>        # front↔rear wheel centers
    wheel_tread:  <MEASURED>        # left↔right wheel centers
    front_overhang: <MEASURED>
    rear_overhang:  <MEASURED>
    left_overhang:  <MEASURED>
    right_overhang: <MEASURED>
    vehicle_height: <MEASURED>
    max_steer_angle: <MEASURED_RAD>
```

Impact of each parameter (inaccurate values cause phantom collisions, planning
failures and mechanical instability):

| Parameter | Technical description | System impact |
|---|---|---|
| `wheel_base` | Longitudinal distance between front and rear axles | Fundamental to Ackermann kinematics; sets minimum turning radius and the rear-axle pivot |
| `wheel_radius` | Physical tire radius | Dead-reckoning odometry and the vehicle interface convert wheel-encoder pulses to velocity |
| `front_overhang` | Front-axle center to front bumper | Leading collision edge; underestimation yields delayed braking and collisions |
| `rear_overhang` | Rear-axle center to rear bumper | Trailing collision edge; critical for reversing, parking, tight intersections |
| `wheel_tread` | Lateral distance between wheel centerlines | Lateral stability and base width of the drivable-area footprint |
| `max_steer_angle` | Physically reachable tire angle | Steering saturation, turning radius; must not exceed mechanical limit |

### 5.3 Wrapper launch, partial build

```xml
<launch>
  <arg name="map_path"/>
  <arg name="vehicle_model" default="my_vehicle"/>
  <arg name="sensor_model" default="my_sensor_kit"/>
  <include file="$(find-pkg-share autoware_launch)/launch/autoware.launch.xml">
    <arg name="map_path" value="$(var map_path)"/>
    <arg name="vehicle_model" value="$(var vehicle_model)"/>
    <arg name="sensor_model" value="$(var sensor_model)"/>
  </include>
</launch>
```

```bash
ros2 launch my_vehicle_launch vehicle_autoware.launch.xml \
  map_path:=/maps/test_track vehicle_model:=my_vehicle sensor_model:=my_sensor_kit

# Build only your integration packages + deps first (fast iteration).
colcon build --symlink-install --packages-up-to \
  my_vehicle_description my_vehicle_launch \
  my_sensor_kit_description my_sensor_kit_launch \
  --cmake-args -DCMAKE_BUILD_TYPE=Release
```

---

## 7. Sensor Integration (LiDAR, Camera, IMU, GNSS, Wheel)

### 7.1 Sensor-kit abstraction

| Package pattern | Example | Contains |
|---|---|---|
| `<vehicle_model>_description` | `sample_vehicle_description` | `urdf/vehicle.xacro`, `config/vehicle_info.param.yaml`, `config/mirror.param.yaml`, `config/simulator_model.param.yaml` |
| `<vehicle_model>_launch` | `sample_vehicle_launch` | `launch/vehicle_interface.launch.xml` |
| `<sensor_model>_description` | `sample_sensor_kit_description` | Sensor URDF/xacro, `config/sensor_kit_calibration.yaml`, `config/sensors_calibration.yaml`, `config/imu_corrector.param.yaml` |
| `<sensor_model>_launch` | `sample_sensor_kit_launch` | `launch/sensing.launch.xml` → `lidar/camera/imu/gnss.launch.xml`, `pointcloud_preprocessor.launch.py` |

`tier4_sensing_launch/sensing.launch.xml` calls the sensor-kit
`sensing.launch.xml` and passes `launch_driver`.

### 7.2 Per-sensor drivers and data flow

| Sensor | Driver package(s) | Raw message | Processing | Canonical topic(s) |
|---|---|---|---|---|
| **LiDAR** | **Nebula** (`nebula_core`, `nebula_velodyne`, `nebula_hesai`, `nebula_robosense`, `nebula_continental`) — composable | `sensor_msgs/PointCloud2` (`pointcloud_raw_ex`) | Cropbox (self + mirror) → distortion corrector → ring-outlier → concatenate/time-sync | `/sensing/lidar/<site>/pointcloud_raw_ex` → `…/pointcloud_before_sync` → `/sensing/lidar/concatenated/pointcloud` |
| **Camera** | Vendor-specific (`usb_cam`, GMSL, `v4l2_camera`, Ethernet); sample kit only relays | `sensor_msgs/Image` / `CompressedImage` + `CameraInfo` | `autoware_image_transport_decompressor` | `/sensing/camera/<cam>/image_raw[/compressed]`, `/image_rect_color`, `/camera_info` |
| **IMU** | Vendor driver | `sensor_msgs/Imu` (`imu_raw`) | `autoware_imu_corrector`, `gyro_bias_estimator` | `/sensing/imu/imu_data` |
| **GNSS** | `ublox_gps` / `septentrio_gnss_driver` | `sensor_msgs/NavSatFix` + INS orientation | `autoware_gnss_poser` (projects to map) | `/sensing/gnss/pose`, `/sensing/gnss/pose_with_covariance` |
| **Wheel speed** | vehicle interface / CAN | `autoware_vehicle_msgs/VelocityReport` | `autoware_vehicle_velocity_converter` | `/sensing/vehicle_velocity_converter/twist_with_covariance` |
| **Radar** | Radar vendor driver | vendor msgs | `autoware_radar_scan_to_pointcloud2`, `autoware_radar_objects_adapter`, filters | radar detection topics |

**Nebula** is the recommended unified sensor driver (ROS 2 Humble/Jazzy). It
supports per-vendor builds (`colcon build --packages-up-to nebula_hesai`) so you
do not compile every backend onto an embedded ECU, and has Agnocast zero-copy
paths for some Hesai configurations. Use the exact supported model or own the
driver integration.

### 7.3 LiDAR preprocessing chain (inside `pointcloud_container`)

| Stage | Node/plugin | In → Out |
|---|---|---|
| 1. Self crop | `crop_box_filter_self` (negative) | `pointcloud_raw_ex` → `self_cropped/pointcloud_ex` |
| 2. Mirror crop | `crop_box_filter_mirror` | `self_cropped/pointcloud_ex` → `mirror_cropped/pointcloud_ex` |
| 3. Distortion correction | `distortion_corrector_node` | `mirror_cropped/pointcloud_ex` + velocity twist + IMU → `rectified/pointcloud_ex` |
| 4. Ring outlier | `ring_outlier_filter` | `rectified/pointcloud_ex` → `pointcloud_before_sync` |
| 5. Concatenate + time sync | `concatenate_and_time_sync` | all `/sensing/lidar/<site>/pointcloud_before_sync` → `/sensing/lidar/concatenated/pointcloud` (+ `pointcloud_info`), output frame `base_link` |
| optional | `downsample_filter`, `passthrough_filter`, `vector_map_filter`, `pointcloud_accumulator`, `pointcloud_densifier` | selected by `perception_mode`/config |

Nebula selects a per-model decoder/calibration file
(`nebula_velodyne_decoders/calibration/VLS128.yaml`, `…/VLP16.yaml`,
`nebula_hesai_decoders/…/Pandar.csv`), so adding a sensor is a config + driver
change, not code.

### 7.4 Repos that provide the sensor layer

| Repo / package | Provides |
|---|---|
| `sensor_component/external/nebula` | LiDAR/radar drivers (Velodyne, Hesai, RoboSense, Continental) |
| `sensor_component/ros2_socketcan` | SocketCAN driver (vehicle/CAN actuation; CAN FD history) |
| `sensor_component/transport_drivers` | `udp_driver`, `serial_driver` base transport |
| `launcher/autoware_launch/sensor_kit/*` | Reference kits (`sample`, `single_lidar`, `awsim`, `awsim_labs`, `carla`) |
| `universe/autoware_universe/sensing/*` | Pointcloud/IMU/radar preprocessing |
| `universe/external/eagleye`, `rtklib_ros_bridge`, `llh_converter` | GNSS/INS alternatives, geodetic conversion |

**Workspace note:** this workspace runs only a **Hesai XT32M2X** driver; the
**IMU is a placeholder relay** and there is **no active GNSS or camera driver**.
Stock Autoware's reference kit is Velodyne VLS128/VLP16 + ublox GNSS + Tamagawa IMU.

### 7.5 Initial ROS sanity checks

```bash
ros2 topic hz /points_raw
ros2 topic hz /sensing/imu/imu_data
ros2 topic hz /sensing/gnss/fix
ros2 topic echo /vehicle/status/velocity_status
ros2 topic echo /vehicle/status/steering_status
ros2 topic echo /vehicle/status/gear_status
ros2 topic echo /vehicle/status/control_mode
ros2 topic hz /localization/kinematic_state
ros2 topic hz /planning/scenario_planning/trajectory
ros2 topic echo /control/command/control_cmd
```

Names vary with the pinned launch tree/remappings; `ros2 topic list -t` and the
launch files in **your release tag** are authoritative.

### 7.6 Fusion happens at several levels (not one EKF)

| Level | Example |
|---|---|
| Ego-state | IMU/gyro odometry, GNSS/INS, LiDAR-map localization |
| Raw/feature | Multi-LiDAR concatenation, point-cloud preprocessing |
| Detection | LiDAR, radar, camera-LiDAR detection streams |
| Tracking | Multi-source detections associated into persistent tracks |
| Prediction | Track state + Lanelet/map context |
| Planning | Predicted objects combined with map + ego state |

Troubleshooting rule: **find the first stage at which data becomes wrong** instead
of tuning downstream fusion to compensate for a broken timestamp or extrinsic.

### 7.7 IMU and GNSS verification

IMU — check units are **m/s²** and **rad/s**, axes follow the ROS convention,
`frame_id` matches the calibrated IMU frame, stationary gyro bias is stable,
pitch/roll agree with gravity, and timestamps do not jump.

GNSS — a valid latitude/longitude is **not** proof of navigation-grade quality.
Monitor fix type, covariance, satellite count, **RTK fixed/float** state, heading
source, antenna lever arm, GNSS-to-IMU extrinsic and timestamp integrity. INS-class
receivers may output IMU at hundreds of Hz while GNSS fixes arrive at ~10–20 Hz.

---

## 8. Sensor Calibration

Calibration is part of the **vehicle design**, not a final tuning step. TIER IV
**CalibrationTools** (Humble/Jazzy) provides intrinsic/extrinsic tooling and a
calibration-manager that handles project-specific TF structures (including the
common `sensor_kit_base_link` between `base_link` and sensors). It is imported
alongside Autoware via its `.repos` file, then `rosdep` + `colcon`.

### 8.1 Recommended TF hierarchy

```text
map
└── base_link                       dynamic localization result
    └── sensor_kit_base_link        calibrated rigid transform
        ├── lidar_front / left / right
        ├── imu_link
        ├── gnss_link
        ├── camera_front_link
        │   └── camera_front_optical_link
        └── radar_front
```

### 8.2 Calibration order

| Calibration | Establishes | Validation |
|---|---|---|
| Camera intrinsic | Focal length, principal point, distortion | Reprojection residual |
| Sensor-kit → vehicle | Position/orientation of the rack | CAD/manual survey + independent measurement |
| LiDAR → sensor kit | Pointcloud geometry in common frame | Static structural overlap |
| Camera → LiDAR | Image/point correspondence | Edge/reprojection inspection |
| IMU orientation | Axis convention, mounting attitude | Stationary gravity + controlled rotation |
| GNSS antenna lever arm | Antenna relative to `base_link` | Survey/CAD + driven consistency |
| Multi-LiDAR | Relative extrinsics | Overlap residuals |
| Radar | Frame and target alignment | Known targets / range-bearing |
| Time offsets | Sensor timestamps vs common clock | Moving-object / ego-motion alignment |

**Camera calibration has two independent parts:** **intrinsic** (camera matrix
`K = [[fx,0,cx],[0,fy,cy],[0,0,1]]` plus the lens distortion model) and
**extrinsic** (`^base T_camera`, or the equivalent sensor-kit transform). A
visually plausible but several-degree yaw error is enough to corrupt camera-LiDAR
association at distance, so always project known LiDAR structures into the image
to validate.

**Maps and extrinsics are physical facts:** entering centimetres as metres, degrees
where radians are expected, or flipping a sign because a vendor uses a different
axis convention is a common cause of "looks fine, drives wrong."

---

## 9. Mapping, Map Loading & Lanelet2

### 9.1 Autoware Universe has no mapping feature

There is **no SLAM/mapping pipeline in Autoware Universe** and no map-creation
launch in `autoware_launch`. Autoware only **loads and consumes** maps. Two map
formats are mandatory:

| Map | Format | Used for | Consumer |
|---|---|---|---|
| **Pointcloud map** | `.pcd` | LiDAR scan matching (NDT) | localization |
| **Vector map** | Lanelet2 `.osm` | Routing, behavior, traffic rules, objects | planning, perception |

### 9.2 How each map is created

| Map | How | Tooling |
|---|---|---|
| Pointcloud (PCD) | **External offline SLAM / survey**: drive the ODD recording raw LiDAR + GNSS/IMU, then run a LiDAR-SLAM pipeline. Documented choices include **LIO-SAM**, **FAST-LIO**, **FAST-LIO-LC**, **FAST_LIO_SLAM**, **FD-SLAM**, **hdl_graph_slam**, **IA_LIO_SAM**, **LeGO-LOAM**-derived and **Scan-Context** variants, plus commercial MMS/vendor mappers → `.pcd` | then post-process with `tools/map` |
| Vector (Lanelet2) | Drawn in an editor | **Vector Map Builder** (GUI, recommended), **JOSM + Lanelet2 plugin**, or `tools/bag2lanelet` to bootstrap from a driven trajectory |

Raw pointclouds are too dense to load directly; **downsample with a voxel-grid
filter to roughly 0.1–0.2 m** spacing (current Autoware guidance; some setups use
0.2–0.5 m). This preserves the persistent 3D structure (facades, poles) that NDT
needs while fitting vehicle memory. Over-aggressive downsampling starves
localization; too fine a map exhausts memory. When a single PCD approaches roughly
**2 GB**, switch to divided/dynamic map loading.

`tools/bag2lanelet`: `bag2lanelet.py <bag> <out> -l <lane_width> -m <MGRS_grid>`
generates lanelets from recorded `/tf`; `bag2trajectory.py` exports a `.csv` for
Vector Map Builder. Output lanes are jagged (MGRS→lat/lon accuracy); importing/
exporting through Vector Map Builder refines them.

### 9.3 Reference map-creation workflow

**Collect raw data** (rawest practical representation + decoded clouds + IMU +
GNSS/INS + TF + velocity):

```bash
ros2 bag record /points_raw /sensing/imu/imu_data /sensing/gnss/fix \
  /tf /tf_static /vehicle/status/velocity_status
```

Drive loops, revisit features from multiple directions, keep GNSS where possible,
and include stationary periods. Preprocess (timestamp correction, range cleanup,
deskew) before SLAM; avoid aggressive downsampling until the required localization
map resolution is known. **Generate the PCD with an external SLAM/mapping
pipeline**, then **georeference once, consistently**.

```yaml
# map_projector_info.yaml
projector_type: LocalCartesianUTM   # use types supported by your pinned release
vertical_datum: WGS84
map_origin:
  latitude:  <SURVEYED_LAT>
  longitude: <SURVEYED_LON>
  altitude:  <SURVEYED_ALT>
```

Do not tune the origin until two separately created maps "look aligned" — PCD,
Lanelet2 geometry and the GNSS converter must share the exact definition
(mismatched origin is a documented cause of non-overlapping maps).

**Draw the semantic road map** (see §10). **TIER IV Vector Map Builder is the
recommended editor** and imports the PCD directly. `bag2lanelet` can bootstrap a
**simple single-lane** map from a driven trajectory but is explicitly limited;
raw JOSM requires substantial Autoware-specific modification and is not the
recommended workflow. Build the road graph in this order:

1. Draw left and right lane boundaries along the PCD.
2. Set lane width and geometry.
3. Connect consecutive lanelets.
4. Create split/merge/intersection topology.
5. Assign direction and speed limit.
6. Add stop lines.
7. Add traffic-light regulatory elements.
8. Add crosswalks, walkways, detection areas, speed bumps as needed.
9. Validate lane connectivity.
10. Test in the planning simulator.

Then export `lanelet2_map.osm`, **validate**, and load+plan in the frozen Autoware
build. A map directory normally contains `pointcloud_map.pcd` + `lanelet2_map.osm`
(adjust launch filenames if different).

Use **`autoware_lanelet2_map_validator`** (TIER IV) to check Autoware's Lanelet
requirements. Map rendering success in an editor is **not** sufficient: validate
and load-test the map in the pinned Autoware build (documented cases show maps
that looked correct in the editor but failed triangulation or produced a blank
RViz while sample maps worked).

Projection-zone boundaries are a real edge case: a map spanning MGRS zones can
look reasonable in an editor but become distorted when loaded. Perform
projection-aware map QA before vehicle testing.

**Loop closure.** Solve it **inside the mapping process**, not by manually
repairing a warped PCD. Prefer SLAM with scan-context/graph-SLAM/loop-closure
support. A loop closure can be wrong as well as absent — validate that building
corners overlap, poles stay single (not doubled), road planes are not vertically
layered, the start/end trajectory agrees, and GNSS/INS residuals remain reasonable.
For multi-LiDAR, retain **both raw individual clouds and the concatenated product**
during early calibration, because a fused cloud can hide which sensor is misaligned.

**Map alignment / georeferencing.**

1. Calibrate GNSS/INS→LiDAR.
2. Obtain a good (RTK or post-processed) GNSS/INS trajectory.
3. Run SLAM independently.
4. Compute rigid alignment between reliable SLAM and GNSS trajectory sections.
5. Inspect residuals over the whole route (not just the start).
6. Establish the map MGRS/local origin.
7. Use the **exact same coordinate reference** when creating Lanelet2.

**PCD preprocessing order:** remove corrupted sections → remove dynamic artifacts →
statistical/radius outlier removal (e.g. Statistical Outlier Removal, CloudCompare)
→ verify ground/building geometry → downsample → save PCD → **test NDT against it**.
Do not over-downsample purely for FPS.

### 9.4 `tools/map` utilities

| Package | Purpose |
|---|---|
| `autoware_pointcloud_divider` | Split a large PCD into grid tiles + generate metadata |
| `autoware_pointcloud_merger` | Merge multiple PCDs (optional downsample) |
| `autoware_pointcloud_projection_converter` | Convert PCD between projections (MGRS ↔ Transverse Mercator) |
| `autoware_pointcloud_saver_rviz_plugin` | Extract/save a live region as `.pcd` (prototype) |
| `autoware_tp_manager` | Collect/compare NDT transform probabilities to detect **map decay** |
| `autoware_lanelet2_map_utils` | Preprocess the Lanelet2 map |

### 9.5 Map directory layout and PCD division rules

```text
autoware_map/
├── lanelet2_map.osm
├── pointcloud_map.pcd                 # OR a pointcloud_map/ tile directory
├── pointcloud_map_metadata.yaml       # required for multiple PCDs
└── map_projector_info.yaml
```

| Rule | Requirement |
|---|---|
| Orientation | Divided by straight lines parallel to **x and y** axes |
| Tile size | Equal per axis; about **20 m × 20 m** (too-large tiles break dynamic loading) |
| Overlap | Tiles must **not** overlap |
| Metadata | `pointcloud_map_metadata.yaml` with `x_resolution`, `y_resolution`, grid coords |
| Projection | All tiles consistent with `map_projector_info.yaml` |

### 9.6 Map loading, projection & visualization

| Node / package | Role | I/O |
|---|---|---|
| `pointcloud_map_loader` | Loads raw/downsampled PCD; serves partial/differential/selected maps | out `/map/pointcloud_map`, metadata; srv `get_partial/differential/selected_pcd_map` |
| `lanelet2_map_loader` | Loads/merges `.osm`, projects via `MapProjectorInfo` | in `~/input/map_projector_info`; out `~/output/lanelet2_map` |
| `autoware_map_projection_loader` | Publishes local↔geodetic projection (MGRS/Local) | out `/map/map_projector_info` |
| `autoware_map_tf_generator` (Universe) | Broadcasts a `viewer` frame to `/tf_static` for RViz only | in map topics |
| `autoware_lanelet2_map_visualizer` | `LaneletMapBin` → `MarkerArray` | in `~/input/lanelet2_map` |
| `autoware_map_height_fitter` | Fits a point to the PCD ground | uses map loader services |

| Topic | Type | Consumers |
|---|---|---|
| `/map/pointcloud_map` | `sensor_msgs/PointCloud2` | localization (NDT/EKF) |
| `/map/vector_map` | `autoware_map_msgs/LaneletMapBin` | planning, perception, `vector_map_filter` |
| `/map/map_projector_info` | `autoware_map_msgs/MapProjectorInfo` | `gnss_poser`, `autoware_geo_pose_projector` |

**Workspace note:** `autoware_universe/map/` contains only
`autoware_map_tf_generator`; the real loaders live in `core/autoware_core/map`
and are launched by `tier4_map_launch`.

---

## 15. Vehicle / ECU — Actuation & Drive-by-Wire Integration

Source: `autoware_universe/vehicle/` + the vehicle interface package
(`<vehicle_model>_launch/vehicle_interface.launch.xml`).

### 15.1 Packages

| Package / Node | Role |
|---|---|
| `autoware_external_cmd_converter` | External `ControlCommand` + shift + heartbeat → `Control` |
| `autoware_raw_vehicle_cmd_converter` | `Control` + `SteeringReport` + `Odometry` → `ActuationCommandStamped` (accel/brake/steer maps + VGR) |
| `autoware_accel_brake_map_calibrator`, `autoware_steer_offset_estimator` | Calibration helpers |
| `<vehicle_model>_launch` (`vehicle_interface.launch.xml`) | Reference vehicle interface (often empty for the sample; real vehicles wire CAN/serial here) |
| custom bridge (e.g. `autoware_vehicle_bridge`) | Common pattern: conversion + CAN I/O in one lifecycle node |

Real DBW interfaces take several forms: an official kit bridge (e.g.
`pacmod_interface` for PACMod DBW), a vendor CAN driver plus a translation node,
or a fully custom bridge. The bridge is a **bidirectional translator**: it converts
generalized Autoware targets (tire angle/rate, velocity, acceleration) into the
vendor's raw units (torque, voltage, pedal position) as CAN frames, and reads back
wheel speeds, actual steering angle, gear and turn-signal state to close the loop.

Two integration models exist:

| Model | Autoware output | Use when | Vehicle-side work |
|---|---|---|---|
| **Higher-level ("Type A")** | Target steering angle + target velocity/acceleration | DBW ECU already closes steering and longitudinal loops | Translate setpoints, status, enable/disable, watchdog |
| **Actuation ("Type B")** | Gas/brake/steering actuation | Gateway exposes actuator-oriented commands | Build calibrated accel/brake/steer maps; use `raw_vehicle_cmd_converter` |

**Units are part of the contract:** Autoware expects SI (velocity in m/s), so an
ECU reporting km/h must be converted before publishing (a km/h→m/s mismatch
produces a factor-3.6 error).

### 15.2 Reference chain and CAN

`/control/command/control_cmd` → `raw_vehicle_cmd_converter` → vehicle-specific CAN
driver (`ros2_socketcan`) → ECUs; feedback returns on `/vehicle/status/*`.

```bash
# Classical CAN host setup (VALUES ARE VEHICLE-SPECIFIC).
sudo ip link set can0 down
sudo ip link set can0 type can bitrate 500000      # match your ECU spec
sudo ip link set can0 up
ip -details link show can0
candump can0
```

For CAN FD, arbitration/data bitrates and FD mode must match the bus exactly.

### 15.3 I/O

| Direction | Topic | Type |
|---|---|---|
| in | `/control/command/control_cmd` | `autoware_control_msgs/Control` |
| in | `/control/command/gear_cmd` | `autoware_vehicle_msgs/GearCommand` |
| in | `/control/command/turn_indicators_cmd`, `/control/command/hazard_lights_cmd` | `autoware_vehicle_msgs/*` |
| in | `~/input/engage` | `autoware_vehicle_msgs/Engage` |
| in | `/control/command/emergency_cmd` | `tier4_vehicle_msgs/VehicleEmergencyStamped` |
| in | `/control/current_gate_mode` | `tier4_control_msgs/GateMode` |
| in | `/control/control_mode_request` (srv) | `ControlModeCommand` |
| out (Type B) | `/control/command/actuation_cmd` | `autoware_vehicle_msgs/ActuationCommandStamped` |
| out | `/vehicle/status/velocity_status` | `autoware_vehicle_msgs/VelocityReport` |
| out | `/vehicle/status/steering_status` | `autoware_vehicle_msgs/SteeringReport` |
| out | `/vehicle/status/gear_status` | `autoware_vehicle_msgs/GearReport` |
| out | `/vehicle/status/control_mode` | `autoware_vehicle_msgs/ControlModeReport` |
| out | turn/hazard status, diagnostics | — |

### 15.4 `raw_vehicle_cmd_converter` (grounded parameters)

| Parameter | Meaning |
|---|---|
| `csv_path_accel_map` / `csv_path_brake_map` / `csv_path_steer_map` | Vehicle-specific lookup tables (accel/brake vs velocity, steering) |
| `convert_accel_cmd` / `convert_brake_cmd` / `convert_steer_cmd` | Enable each conversion |
| `use_steer_ff` / `use_steer_fb` | Steering feed-forward / feedback |
| `max_throttle` / `max_brake` / `max_steer` / `min_steer` | Actuation limits |
| `steer_pid` (`kp`, `ki`, `kd`, limits) | Steering feedback PID |
| `convert_steer_cmd_method` | `"vgr"` or `"steer_map"` |
| `vgr_coef_a` / `vgr_coef_b` / `vgr_coef_c` | Variable gear ratio coefficients (**vehicle-specific; sample values are not transferable**) |
| `convert_actuation_to_steering_status` | Derive steering status from actuation |

**Units and conventions must be written down and tested at every boundary.** A
documented failure mode is confusing **tire angle** with a **normalized steering
actuator command**: acceptable at small angles, broken at high curvature.

### 15.5 Safety state machine (bridge-owned)

```text
MANUAL
  ↓ operator requests autonomy
WAIT_DBW_CONFIRM
  ↓ ECU reports autonomous control enabled
ARMED_STOPPED
  ↓ Autoware healthy + localization OK + route valid + engage
AUTONOMOUS
  ↓ any watchdog/fault/driver override
SAFE_STOP / MANUAL
```

A production bridge must reject/stop on: stale commands; NaN/out-of-range values;
lost ECU heartbeat; lost Autoware heartbeat; conflicting gear/speed state; loss of
DBW enable; driver override; emergency-stop state. **An independent DBW/vehicle
watchdog must be able to inhibit propulsion and preserve a safe braking strategy
even if the autonomy computer hangs.**

**Control authority / operation mode.** Autoware distinguishes **direct control**
from **Autoware control**. `autoware_adapi_v1_msgs/OperationModeState` defines
`STOP=1`, `AUTONOMOUS=2`, `LOCAL=3`, `REMOTE=4`, with flags
`is_autoware_control_enabled`, `is_in_transition`, and per-mode availability.
A hardware-controlled vehicle may **reject** a software mode switch.
`is_in_transition` can remain true while safety cannot be guaranteed (e.g. an
unsafe transition), and **the operator initiating the change remains responsible
during that transition**.

Autoware provides a fail-safe API around **Request to Intervene (RTI)** and
**Minimal Risk Maneuver (MRM)**; MRM behavior states include operation/success/
failure, and behaviors include emergency stop, comfortable stop and pull-over.
A real program should additionally require **independent** protections:
hardware E-stop, low-level ECU watchdog, hard driver-override, brake/steering
bounds below software, independent CAN freshness + response monitoring, power
control returning to manual, and a safety operator during commissioning.

**Workspace note:** this workspace uses a custom `autoware_vehicle_bridge`
(E-Trike) that subscribes `/control/command/control_cmd` and encodes CAN at 100 Hz,
bypassing the two reference converters.

---

## 20. Deployment: Network, DDS, Time Sync & Real-Time

### 20.1 Network partitioning

Do not put every device on one unmanaged broadcast domain.

```text
Sensor Ethernet (LiDAR, cameras, radar) → sensor NIC / VLAN → Autonomy ECU
Autonomy DDS network  → secondary compute/GPU, logging/monitoring PC
Vehicle-control network → CAN gateway / DBW ECU
Maintenance network → SSH / updates / diagnostics
```

Reference designs span gigabit through dual-10-GbE. Multi-PC DDS needs dedicated
NICs (CycloneDDS interface selection), larger Linux receive buffers, and host time
sync.

### 20.2 DDS

```xml
<CycloneDDS>
  <Domain>
    <General>
      <Interfaces>
        <NetworkInterface name="autoware0" priority="default" multicast="default"/>
      </Interfaces>
    </General>
  </Domain>
</CycloneDDS>
```

```bash
export CYCLONEDDS_URI=file:///etc/autoware/cyclonedds.xml
```

Verify the active middleware and config — Autoware's supported configuration
expects **`rmw_cyclonedds_cpp`**:

```bash
echo "$RMW_IMPLEMENTATION"          # expect rmw_cyclonedds_cpp
echo "$CYCLONEDDS_URI"
cat "${CYCLONEDDS_URI#file://}"
```

Validate multicast, MTU, receive-buffer sizing and packet loss **under full
pointcloud load**, not just with `demo_nodes_cpp talker`. A non-multicast-capable
interface produces `selected interface "... " is not multicast-capable: disabling
multicast`; incorrect DDS config causes lagging images/pointclouds, flickering
RViz data and collapsing publication rates when subscribers are added.

> **Jazzy participant-index limit:** `Failed to find a free participant index for
> domain 0` / `rmw_create_node: failed to create domain` is addressed by setting
> CycloneDDS `<Discovery><ParticipantIndex>none</ParticipantIndex></Discovery>`.

### 20.3 Time synchronization

```text
GNSS disciplined clock → PTP (hardware IEEE-1588) → LiDAR / camera trigger
                       → autonomy ECU
chrony/NTP → host synchronization
```

Use hardware **PTP** where sensors/NICs support it (multi-LiDAR and camera/LiDAR
fusion); chrony/NTP for hosts. Do not judge sync by `date`; inspect ROS message
timestamps and plot **sensor timestamp − host receipt**, LiDAR−IMU, LiDAR−camera
exposure, and CAN−autonomy clock over a whole drive. Constant offset may be
calibratable; **variable offset/jitter is far more destructive**.

Time bugs propagate into control: wrong/duetached clock semantics have produced
downstream trajectory-follower effects.

### 20.4 Boot / launch sequence (diagnostic ordering)

```text
OS/GPU/vehicle safety controller
  → configure CAN + Ethernet
  → start PTP/chrony and verify lock
  → start vehicle bridge in DISARMED state
  → start sensors; verify rates + timestamps
  → load PCD + Lanelet map
  → start localization; verify stable pose and TF
  → start perception; verify objects
  → start planning; set route
  → verify controller + command gate
  → operator checks diagnostics
  → DBW autonomy request → Autoware engage
```

The monolithic upstream launch is usable operationally, but this ordering is
valuable for debugging.

### 20.5 Real-time performance

Autoware should behave as a **real-time system** when integrated into a service;
measure callback execution rather than guessing. End-to-end latency is the sum of
the stages:

```text
T_end_to_end = T_sensor + T_driver + T_preprocess + T_perception/localization
             + T_planning + T_control + T_ECU
```

**A node running at 10 Hz is not necessarily "100 ms latency"** — callbacks can
queue, timestamps can be old, and data can arrive burstily. OS scheduling, memory
allocation, CPU-frequency fluctuation and thread/core interference all affect
timing; for rigorous Linux/Intel measurement, control CPU frequency and isolate
cores. Use `ros2 topic hz/bw`, per-package processing-time/debug topics, and
`nvidia-smi`/`top`/`htop`. Keep substantial steady-state CPU/GPU margin.

Resource dashboard:

| Area | Metrics |
|---|---|
| CPU | per-core utilization, run-queue, thermal throttling |
| GPU | utilization, memory, inference latency, temperature |
| RAM | resident memory, swap, allocator pressure |
| DDS | received/dropped samples, discovery state |
| Network | packets/sec, bandwidth, drops, errors |
| LiDAR | packets/scans lost, scan rate |
| Localization | NDT execution time, rejected solutions |
| Perception | detector/fusion/tracker latency |
| Planning / Control | cycle time, trajectory/command age |
| CAN | error counters, bus state, frame freshness |
| System | p50/p95/p99 end-to-end latency |

Keep substantial steady-state CPU/GPU margin; embedded platforms can thermally
throttle even when a cold-bench test passes.

---

## 21. Safety, Security & Validation

### 21.1 Safety boundaries

Do not equate "Autoware has an emergency-stop node" with a safety case. The
command gate provides timeout detection and a built-in stop, and system MRM drives
a minimal-risk maneuver, but Autoware's **generic vehicle-interface spec
deliberately does not define the response accuracy or speed of a particular DBW
implementation**. Keep independent enforcement beneath ROS.

**Upstream open-source availability is not evidence of ISO 26262 / ISO 21448
(SOTIF) or regulatory compliance for your vehicle; certification applies to a
defined vehicle item, architecture, configuration, ODD, process, hazards and
mitigations.**

### 21.2 Security boundaries

| Boundary | Protection |
|---|---|
| Vehicle CAN | Gateway allow-list, expected IDs/rates, ECU authentication where available |
| ROS autonomy DDS | Dedicated network/VLAN, host firewall, DDS/SROS2 policies |
| Maintenance | Separate authenticated interface; no exposed ROS discovery |
| Software supply chain | Frozen manifests/images, signatures/hashes, controlled updates |

A host able to publish `/control/command/control_cmd` should **not** automatically
have unrestricted raw-powertrain-CAN access; keep the vehicle bridge/gateway as an
enforcement boundary.

### 21.3 Validation matrix

| Test family | Example tests | Metrics |
|---|---|---|
| Sensor | unplug/replug, packet loss, blocked LiDAR | rate, detection latency, diagnostic response |
| Clock | introduce offset/jitter | localization/fusion degradation, fault detection |
| Localization | GNSS dropout, weak-feature road, wrong initial pose | pose error, recovery time |
| Perception | stationary/dynamic objects, partial occlusion | recall, false positives, tracking stability |
| Map | wrong lane relation, missing stop line | validator result, planning behavior |
| Planner | lane change, blocked lane, unreachable parking goal | safe path, state recovery |
| Controller | curvature, stops, slopes | lateral/velocity error, jerk |
| CAN | dropped frames, stale feedback, bus-off | safe transition latency |
| DBW | driver brake/steer override | disengagement behavior |
| Compute | kill planner/localizer/interface | command timeout and MRM |
| Network | unplug DDS link | stale-data detection |
| Emergency | E-stop on straight **and curve** | stop distance **and lateral excursion** |
| Thermal | long high-load run | no throttling-induced deadline failures |

### 21.4 Validation ladder

Autoware exposes planning simulation, rosbag replay, AWSIM, scenario simulator and
Driving Log Replayer. A rigorous progression:

| Stage | What to prove | Actuation |
|---|---|---|
| Unit/package tests | Algorithms + interface codecs | None |
| Rosbag replay | Sensors/perception/localization on real data | None |
| Planning simulator | Map + planner logic | Simulated |
| AWSIM / digital twin | Closed-loop sensing→planning→control | Simulated |
| Scenario simulator | Repeatable edge cases / regressions | Simulated |
| ECU bench | CAN encoding, watchdog, modes | ECU bench only |
| Hardware-in-the-loop | End-to-end timing + DBW state machine | HIL |
| Stationary vehicle | Status, steering enable, handoff | Wheels secured |
| Low-speed proving ground | Actual vehicle dynamics | Strictly limited |
| Expanded track ODD | Full perception/planning | Controlled |
| Road testing | Regulatory safety case | Only after preceding gates |

**Substitute sources one boundary at a time:** (1) simulated dynamics + recorded
real sensor bag; (2) full stack on the vehicle with live sensors, **actuation
disabled**; (3) live ECU reports with command TX suppressed; (4) enable command TX
on an ECU bench/HIL; (5) low-speed physical actuation. Replacing simulator, map,
sensors, compute and ECU simultaneously creates an un-debuggable system.

### 21.5 Staged deployment

```text
Freeze release + manifests + models
  → bench-test ECU/CAN (wheels disabled / dyno / stands)
  → calibrate sensors + vehicle
  → record and replay real sensor bags
  → create + validate PCD/Lanelet map
  → validate localization on recorded runs
  → planning simulator with the real map
  → AWSIM / scenario simulator
  → hardware-in-the-loop DBW
  → closed track: manual + monitor
  → closed track: 2–5 km/h autonomy
  → fault injection / MRM / E-stop
  → expand speed + ODD gradually
```

**Recommended first real-vehicle milestone is not autonomous motion.** It is a
**complete, synchronized, non-actuating** run:

```text
all sensors publish + all TF calibrated + CAN status decoded
+ PCD/Lanelet map aligns + NDT stays localized
+ perception publishes stable tracks + planning generates a valid trajectory
+ control commands are logged + vehicle-interface TX remains disabled
```

Only once that run is repeatable should the ECU command path be enabled on a
bench/HIL system.

For first motion: cap to a few km/h on a closed course, retain a trained safety
driver, and keep a hardwired independent emergency stop. Increase speed only after
repeated successful runs and fault injection. **Free-space/parking and reverse
maneuvers get their own regression suite** (unreachable-goal and nearby-object edge
cases are documented).

---

## 22. Failure-Mode, Debug & Known Failure Patterns

| Symptom | Likely subsystem | What to check |
|---|---|---|
| No pointcloud at all | Sensing / drivers | `launch_sensing_driver=true`? Nebula node up? `sensor_ip`/`host_ip`/`data_port`? `pointcloud_raw_ex` present? |
| Camera images missing | Camera driver | Is a driver actually launched (sample kit only relays)? Namespace + `camera_info`? decompressor running? |
| Localization drifts/jumps (bridge/tunnel) | NDT/EKF | GNSS regularization? Map coverage? NDT score/NVTL, `transform_probability`, `skipping_publish_num`; EKF gates |
| Localization never initializes | `pose_initializer` / NDT | Init service called? `/localization/initialization_state`; MC `ndt_align_srv`; GNSS quality |
| Pose jumps on slopes / z error | EKF 3-DoF | Pitch→z correction; slope vs model |
| Map not loading / projection error | Map layer | `map_path`? `map_projector_info.yaml`? PCD tiles axis-aligned ~20 m + metadata? valid `.osm`? |
| Map looks right in editor, blank/failed in Autoware | Map layer | Run lanelet validator; load+plan in the **frozen** build; check projection zones |
| YabLoc stop publishing | YabLoc | Cannot run with NDT; markings in Lanelet2? GNSS fallback |
| Objects flicker | Tracking gate | per-channel trust flags, association (`bev`/`polar`), `detection_by_tracker` |
| Traffic light never resolved | Traffic-light pipeline | map + route fed to detector; occlusion predictor; arbiter; classifier ROIs |
| Planning produces no path | `behavior_path_planner` | `/diagnostics`, `cyclic_timeout` (0.9 s); scenario == LaneDriving? route/map present? |
| Planner silent after first mission | Behavior path planner | Run many clear/set-route cycles **without restart** (documented regression pattern) |
| Trajectory jumps / rejected | `planning_validator` | `validation_status`; `default_handling_type` |
| No control command / won't move | follower / gate | Both outputs fresh? `timeout_thr_sec_`; `isTimeOut()`; trajectory age; **engaged**? zero-speed steering? |
| Steering oscillates / never converges | MPC/PID | Steer-convergence sync; MPC delay; `steering_offset_update`; `SteeringReport` freshness; pose yaw noise |
| Wrong steering at large angle | Vehicle interface | **tire angle vs actuator command** units/signs; VGR; saturation |
| Vehicle stops unexpectedly | `vehicle_cmd_gate` / MRM | `/system/fail_safe/mrm_state`; heartbeats; engage; limit filter |
| E-stop causes lane departure on curve | MRM design | Define failure-specific MRMs; test emergency stop on curvature |
| Whole system degrades | System layer | `/diagnostics_graph/status`, `/autoware/modes/*`; latency/topic monitors; operation-mode |
| High end-to-end latency | Monitoring | per-stage `pipeline_latency_ms`; `processing_time_checker`; container threads; NDT runtime; CUDA architecture/JIT |
| Vehicle spawns at an impossible elevation / map won't render | Map loading | Using a single monolithic PCD while **dynamic/partial loading is still enabled**: set `enable_partial_load: false` (map loader) and `use_dynamic_map_loading: false` (NDT). Otherwise `map_height_fitter` queries a non-existent spatial index and returns an empty cloud |
| Engage shows AUTO but vehicle never moves | Vehicle interface | Message-type migration: older bridges subscribed to deprecated `autoware_auto_control_msgs` and silently ignore modern `autoware_control_msgs`. Echo both `/control/command/control_cmd` and the interface topic (e.g. `/pacmod/steering_cmd`). Also check DBW rejection due to safety-driver steering torque / brake-pedal input |
| Phantom braking or terrifyingly late AEB | `autonomous_emergency_braking` | Prediction horizons too short for low-speed urban scenes. Grounded params: `mpc_prediction_time_horizon` (e.g. `4.5` s), `imu_prediction_time_horizon` (e.g. `1.5` s), `expand_width`, `previous_obstacle_keep_time` |
| Pose slides/freezes in featureless areas; sensitive to spoofed returns | NDT / EKF | Flat NDT gradient (tunnels, open lots, identical barriers); adversarial pointclouds can induce large lateral error. Increase IMU/wheel-odometry trust in the EKF when NDT covariance spikes; consider GNSS regularization |
| Tuning a local `*.param.yaml` appears ignored | Launch system | **Parameter scope bleeding**: a higher-level launch argument overrides package-level files. Centralize all vehicle/environment parameters at the top-level (fork `autoware_launch`); treat package YAML as fallback defaults |
| Builds fine but is extremely slow (esp. point clouds) | Build flags | Workspace compiled without optimization. Delete `build/install/log` and rebuild with `-DCMAKE_BUILD_TYPE=Release` or `RelWithDebInfo` |
| RViz data lags/flickers; rates collapse with subscribers | DDS/network | Check `RMW_IMPLEMENTATION` (expect `rmw_cyclonedds_cpp`), `CYCLONEDDS_URI`, multicast, bandwidth |
| `Failed to find a free participant index for domain 0` (Jazzy) | CycloneDDS | Set `<Discovery><ParticipantIndex>none</ParticipantIndex></Discovery>` |
| CenterPoint aborts after model update / long first launch | Model bundle / TensorRT | Runtime rejects older (e.g. v4.0) bundle metadata; match bundle to runtime. First launch builds the engine — pre-run with `build_only:=true` |
| Large map causes excessive memory/start time | Map loading | Downsample and use divided/dynamic loading (~2 GB practical threshold) |
| Vehicle speed/status 3.6× too fast/slow | Vehicle interface | km/h vs m/s conversion error — convert to m/s before publishing |
| Software cannot enter Autoware control | Operation mode / DBW | Vehicle may allow only hardware switching; inspect `is_in_transition` and availability flags |

**Known integration failure patterns (from upstream reports):**

| Stage | Pattern | Lesson |
|---|---|---|
| Release install | Stable launch + `main` model-artifact layout mismatch | Pin source, launch, image and artifacts as one unit |
| Repo update | `vcs` cannot remove moved packages; duplicate package names stop colcon | Clean/re-import after structural upgrades |
| CUDA build | Wrong GPU architecture compiled / runtime JIT | Check actual arch and binary compatibility |
| Jetson | JetPack/kernel/CUDA/TensorRT mismatches | Freeze the whole embedded stack |
| Map origin | PCD and vector map non-overlap from wrong origin | PCD, Lanelet and GNSS origin must be identical |
| Projection | Cross-MGRS negative coordinates distort | Projection-aware map QA |
| Localization | Pathological multi-second NDT | Benchmark p95/p99 with the real map |
| Planning | Multi-mission state regression | Test repeated mission lifecycle |
| Steering | Tire-angle vs actuator-command confusion | Define units/signs/ratios/saturation at the ROS/CAN boundary |
| Zero-speed steering | Stop/convergence vs actuator capability | Verify DBW can steer at standstill and configure accordingly |
| Clock | Wrong/detached clock semantics affect control | Timestamps are part of the control architecture |

**Sensor symptoms:**

| Symptom | First checks |
|---|---|
| No LiDAR topic | IP/subnet, UDP port, firewall, driver process, sensor model |
| LiDAR visible but rotated/offset | `frame_id`, TF extrinsic, axis convention |
| Double walls/poles in concatenated cloud | Multi-LiDAR extrinsic or timestamp/scan-phase mismatch |
| Camera detector intermittent | Image frequency, exposure, timestamp, GPU latency |
| Camera-LiDAR boxes misaligned | Camera intrinsics, camera-LiDAR extrinsic, synchronization |
| IMU yaw drifts while stationary | Gyro-bias correction/calibration |
| GNSS position good, heading wrong | Orientation source, antenna baseline/lever arm, frame convention |
| Localization periodically jumps | Time sync, wrong extrinsic, insufficient NDT geometry, dynamic points in PCD |
| RViz unstable but sensor counters fine | DDS/network, not the physical sensor |

**CAN/ECU symptoms:**

| Failure | Likely source | Corrective action |
|---|---|---|
| `can0` down / no frames | Interface, bitrate, wiring | Check `ip -details link`, bus, specified bitrate |
| Frames received but signal nonsense | Wrong DBC / byte order / scaling | Compare raw payload with ECU ICD |
| Commands accepted only briefly | Missing alive counter/CRC/watchdog | Implement exact OEM command protocol |
| Steering sign reversed | Coordinate convention mismatch | Fix at interface; verify on bench |
| DBW refuses enable | Missing brake/gear/ignition prerequisite | Implement enable state machine |
| Longitudinal oscillation | Bad actuator map / gains / latency | Characterize command→accel before retuning |
| Commands sent but steering doesn't follow | ECU authority / steering controller not enabled | Check control mode + command ACK/status |
| Unexpected disengage | Watchdog timeout, stale command, override | Correlate CAN + ROS timestamps |

Critical practice: log **both raw CAN and ROS command/status against a common
timestamp**. Before assuming a failure is local, check **official docs → GitHub
issues → Foundation Discussions** (filtered by your exact release/ROS distro).

---

## 26. Appendix — Deliverables, Command Reference & Sources

### 26.1 End-to-end deliverables

| Phase | Required deliverable | Acceptance criterion |
|---|---|---|
| Software baseline | Release manifest | Autoware release, ROS distro, Ubuntu, compiler, CUDA/TensorRT pinned |
| Build | Reproducible workspace/container | Clean build succeeds twice on a fresh environment |
| Vehicle geometry | Vehicle model package | Wheelbase, dimensions, reference points physically verified |
| ECU ICD | Signal-mapping document | Every command/report has ID, units, scale, rate, CRC/counter, timeout |
| CAN bench | Raw CAN capture | All status frames decoded correctly before command TX |
| Vehicle interface | ROS↔ECU gateway | Commands/status round-trip correctly |
| Safety | Handoff/fault matrix | Manual override, watchdog, E-stop, MRM demonstrated |
| Sensor driver | Driver/launch per sensor | Correct rate, frame, acquisition timestamp |
| Intrinsics | Camera calibration | Reprojection quality acceptable |
| Extrinsics | Sensor TF calibration | LiDAR structures / camera projection physically aligned |
| Synchronization | Clock architecture | No material inter-sensor drift over test duration |
| Mapping bag | Raw calibrated dataset | Complete LiDAR/IMU/GNSS/TF recording |
| Point-cloud map | `pointcloud_map.pcd` | Clean, loop-consistent, appropriately downsampled |
| Vector map | `lanelet2_map.osm` | Route connectivity/regulatory elements pass simulator |
| Localization | Tuned config | Repeatable init, bounded error and latency |
| Perception | Model/config manifest | Known model versions and thresholds |
| Planning | Scenario matrix | Lane change, intersection, crosswalk, obstacle cases pass |
| Compute | Timing report | Worst-case callbacks/end-to-end latencies in budget |
| Simulation | Regression suite | Planning/AWSIM/scenario reproducible |
| HIL | ECU fault tests | Communications/authority failures enter defined safe state |
| Track validation | Closed-course report | Vehicle stays within safety envelope across test ODD |
| Deployment | Immutable release bundle | Source/image digest + configs + models + maps archived |

### 26.2 Command reference (integration)

```bash
# --- Build (source) ---
git clone https://github.com/autowarefoundation/autoware.git && cd autoware
git checkout <STABLE_TAG>
bash ansible/scripts/install-ansible.sh && source ~/.bashrc
ansible-galaxy collection install -f -r ansible-galaxy-requirements.yaml
ansible-playbook autoware.dev_env.install_dev_env           # --skip-tags nvidia if needed
mkdir -p src && vcs import src < repositories/autoware.repos
source /opt/ros/$ROS_DISTRO/setup.bash && rosdep update
rosdep install -y --from-paths src --ignore-src --rosdistro "$ROS_DISTRO"
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
source install/setup.bash

# --- Verify ROS ---
ros2 doctor --report && ros2 node list && ros2 topic list
ros2 pkg list | grep autoware

# --- Inspect sensors / TF ---
ros2 topic hz /points_raw ; ros2 topic bw /points_raw
ros2 topic echo --once /sensing/imu/imu_data
ros2 topic echo --once /sensing/gnss/fix
ros2 run tf2_tools view_frames
ros2 run tf2_ros tf2_echo base_link lidar_front

# --- DDS ---
echo "$RMW_IMPLEMENTATION" ; echo "$CYCLONEDDS_URI" ; cat "${CYCLONEDDS_URI#file://}"

# --- CAN / CAN-FD (bitrates are OEM-specific) ---
sudo ip link set can0 down
sudo ip link set can0 type can bitrate <OEM_BITRATE>
sudo ip link set can0 up
ip -details -statistics link show can0
candump -tz can0
# CAN-FD: add  dbitrate <OEM_DATA_BITRATE> fd on

# --- Pre-build TensorRT engine ---
ros2 launch autoware_lidar_centerpoint lidar_centerpoint.launch.xml \
  model_path:="$HOME/autoware_data/ml_models/lidar_centerpoint/base" build_only:=true

# --- Planning simulation (+ learned planner) ---
ros2 launch autoware_launch planning_simulator.launch.xml \
  map_path:=/path/to/map vehicle_model:=sample_vehicle sensor_model:=sample_sensor_kit
ros2 launch autoware_launch planning_simulator.launch.xml \
  map_path:=/path/to/map vehicle_model:=sample_vehicle \
  sensor_model:=sample_sensor_kit planning_setting:=diffusion_planner
```

### 26.3 Additional primary sources

| Resource | Link |
|---|---|
| Current Autoware documentation | https://docs.autoware.org/main/ |
| Installation navigation (Docker/source) | https://docs.autoware.org/main/installation/ |
| Vehicle & sensor model tutorial | https://docs.autoware.org/main/tutorials/integrating-autoware/creating-vehicle-and-sensor-model/ |
| Mapping tutorials | https://docs.autoware.org/main/tutorials/integrating-autoware/creating-maps/ |
| `autoware_lidar_centerpoint` | https://github.com/autowarefoundation/autoware_universe/tree/main/perception/autoware_lidar_centerpoint |
| `autoware_multi_object_tracker` | https://github.com/autowarefoundation/autoware_universe/tree/main/perception/autoware_multi_object_tracker |
| Universe planning tree | https://github.com/autowarefoundation/autoware_universe/tree/main/planning |
| Diffusion Planner | https://github.com/autowarefoundation/autoware_universe/tree/main/planning/autoware_diffusion_planner |
| Linux SocketCAN documentation | https://docs.kernel.org/networking/can.html |
| Jazzy/CycloneDDS participant-limit issue | https://github.com/autowarefoundation/autoware/issues/6759 |

---

## 27. Car to Tricycle (Trike) Conversion

Autoware's reference vehicle model is a **4-wheel Ackermann car**. A **trike**
("tric") — a three-wheeler with a **single steered front wheel and two rear
wheels** (e.g. the Bajaj RE "E-Trike" in this workspace) — needs geometric,
sign/unit, actuation and *stability* changes. The good news: Autoware's planar
**kinematic bicycle model is actually more exact for a single-front-wheel trike
than for an Ackermann car**, because there is no inner/outer front-wheel angle to
approximate.

### 27.1 What changes vs a 4-wheel car

| Aspect | 4-wheel car | Trike ("tric") | Consequence |
|---|---|---|---|
| Steering | Two front wheels (Ackermann) | **One** front wheel | No inner/outer steering to model; bicycle model applies directly |
| Rear | Two wheels (often differential) | Two rear wheels | `wheel_base` still = front axle ↔ rear-axle center |
| Kinematics | Bicycle/Ackermann | Bicycle (still valid) | `yaw = v·tan(δ)/L` remains correct |
| Roll stability | Wider track | Narrow rear track, tall body | **Tip-over risk Autoware does not model** (see §27.3) |
| Steering actuator | Typical rack/EPS | Front-wheel actuator with its own limits | Different rate limits and standstill behaviour |
| Bus | Assorted OEM DBCs | Often a custom CAN protocol | Dedicated codec (e.g. `etrike_protocol`) |

### 27.2 E-Trike ground truth (from code)

`our_packages/etrike_vehicle_description/config/vehicle_info.param.yaml`:

| Param | Value |
|---|---|
| `wheel_base` | `2.000` m |
| `wheel_tread` (rear track) | `1.150` m |
| `wheel_radius` | `0.203` m |
| `wheel_width` | `0.102` m |
| `max_steer_angle` | `0.747` rad |
| `front_overhang` / `rear_overhang` | `0.203` / `0.432` m |
| `left_overhang` / `right_overhang` | `0.075` / `0.075` m |
| `overall_length` / `overall_width` | `2.635` / `1.300` m |
| `vehicle_height` | `1.700` m |
| `ground_clearance` | `0.170` m |

Body (`urdf/vehicle.xacro`): `base_footprint` (ground projection of the **rear
axle**) → `base_link` → two rear wheel links (continuous), `front_steering_link`
(revolute **±0.747 rad**) → `front_wheel_link`, and a roof `lidar_link`
(xyz `0.575, 0.0, 1.7464`). Frame convention **+X forward, +Y left, +Z up**.

`our_packages/autoware_vehicle_bridge/config/etrike.param.yaml`:

| Param | Value | Meaning |
|---|---|---|
| `wheel_base` | `2.0` m | yaw conversion |
| `max_steering_angle` | `0.747` rad | steering clamp |
| `max_speed_forward` | `3.0` m/s | forward clamp |
| `max_speed_reverse` | `0.5` m/s | reverse clamp |
| `max_deceleration` | `5.0` m/s² | brake scaling |
| `low_speed_threshold` | `0.05` m/s | no yaw below this |

`our_packages/etrike_stability_guard/README.md` (rollover monitor):

| Param | Value | Meaning |
|---|---|---|
| `track_width` | `1.15` m | rear track |
| `cog_height` | `0.8` m | center-of-gravity height |
| `safety_margin` | `0.6` | fraction of theoretical tip threshold |
| `warn_ratio` / `error_ratio` | `0.7` / `0.9` | hysteresis bands |
| `enable_emergency` | `False` | **monitor-only by default** |

### 27.3 Issues (why a car config fails on a trike)

| Issue | Why it bites | Mitigation |
|---|---|---|
| **Roll/tip-over** | Autoware is a **planar (2D) stack with no rollover model**; a tall, narrow trike can tip in a hard turn before any path/obstacle check reacts | Run `etrike_stability_guard`; enforce conservative lateral-accel limits in the command gate; raise `safety_margin` |
| **Steering sign** | Universe uses **left-positive**; E-Trike wire/RT uses **right-positive** | Negate in the bridge (`to_trike_steering_rad = -clamp(...)`) |
| **Steering units** | Wire protocol is **0.1°**; controllers emit **radians** | Convert (`to_trike_steering_0_1deg`, `universe_steering_rad`) |
| **Wrong wheelbase** | `yaw = v·tan(δ)/L`; L drives curvature and min turning radius | Set `wheel_base` from the trike's measured front↔rear axle distance |
| **Ackermann assumptions** | Any module modelling two steered wheels or a dual-track footprint | Prefer the bicycle model; verify footprint/`wheel_tread` |
| **Standstill steering** | A loaded front actuator may not steer at v=0; Autoware's stop/steer-convergence logic assumes it can | Verify DBW can steer at standstill; tune `enable_keep_stopped_until_steer_convergence` |
| **Speed envelope** | Trike top speed / reverse are low and asymmetric | Clamp to `max_speed_forward`/`max_speed_reverse` |
| **Footprint** | Single front wheel + narrow rear track changes swept path | Use measured dimensions; validate boundary-departure checker |
| **Vibration / IMU** | Single front wheel transmits more vibration | Check IMU noise/bias; tune EKF trust |
| **Custom CAN** | No OEM DBC; proprietary frame semantics | Use the generated codec (`etrike_protocol`), evolve it as the single source of truth |

### 27.4 Strategies

| Strategy | Detail |
|---|---|
| **Keep the bicycle model** | It is valid (and exact for one steered wheel). Only replace geometry values. |
| **Provide a trike vehicle_description** | Own `vehicle_info.param.yaml` + `vehicle.xacro`; never rename `sample_vehicle`. |
| **Do sign/unit conversion in the bridge** | Keep controllers in Autoware conventions; translate at the ECU boundary. |
| **Clamp steering at every layer** | Controllers, command gate and bridge each bound steering (§27.5). |
| **Add an explicit rollover guard** | Autoware lacks rollover modelling; monitor `a_y` vs the geometric tip threshold. |
| **Start monitor-only, then enable ESTOP** | Tune `track_width`/`cog_height`/`safety_margin` on the real vehicle before `enable_emergency:=true`. |
| **Prefer speed limiting over hard cuts** | A future/optional command-limiter that scales velocity is smoother than an ESTOP. |
| **Conservative command-gate limits** | Tight `lat_acc_lim_for_steer_cmd`, `lat_jerk_lim_for_steer_rate` and `vel_lim`. |
| **Validate min turning radius** | Compute from `wheel_base` and `max_steer_angle` before choosing map lane widths. |

### 27.5 Steering limit — checked with code

Steering is bounded at **several independent layers**, all ultimately fed by
`max_steer_angle`:

1. **Vehicle geometry** — `vehicle_info.param.yaml` sets `max_steer_angle`
   (E-Trike `0.747` rad; sample car `0.70` rad).
2. **Vehicle-info utility** — `autoware_vehicle_info_utils` loads
   `max_steer_angle_rad` and derives the minimum turning radius
   (`scripts/min_turning_radius_calculator.py`):

   ```text
   rear_radius  = wheel_base / tan(max_steer_angle)
   front_radius = wheel_base / sin(max_steer_angle)
   # E-Trike (L=2.0 m, δ=0.747 rad): rear ≈ 2.16 m, front ≈ 2.94 m
   ```

3. **Lateral controllers** read it:
   - MPC: `m_mpc->m_steer_lim = vehicle_info.max_steer_angle_rad;` (feeds the
     bicycle-model steer limit).
   - Pure Pursuit: `param_.max_steering_angle = vehicle_info.max_steer_angle_rad;`
     then clamps with `std::min(std::max(tmp_steering, -max), max)`.
4. **Command gate** — lateral limits (`lat_acc_lim_for_steer_cmd`,
   `lat_jerk_lim_for_steer_rate`) constrain how fast steering may change.
5. **`raw_vehicle_cmd_converter`** (Type-B path) — `max_steer`/`min_steer` and
   the variable-gear-ratio (`convert_steer_cmd_method: "vgr"`) mapping.
6. **Vehicle bridge** (E-Trike) — `max_steering_angle` param (`0.747`);
   `to_trike_steering_rad` clamps **and negates**; `to_trike_steering_0_1deg`
   converts to the wire unit; `legacy_yaw_mrad_s` clamps yaw to
   **±3000 mrad/s**; the node **throws** if `max_steering_angle <= 0`.

```cpp
// our_packages/autoware_vehicle_bridge/include/autoware_vehicle_bridge/motion_conversion.hpp
inline double to_trike_steering_rad(double universe_angle_rad, double max_angle_rad)
{ return -std::clamp(universe_angle_rad, -max_angle_rad, max_angle_rad); }   // left+ -> right+

inline int32_t legacy_yaw_mrad_s(double universe_angle_rad, double speed_mps,
    double wheel_base, double max_angle_rad, double low_speed_threshold)
{
  if (std::abs(speed_mps) < low_speed_threshold) { return 0; }
  const double trike_angle = to_trike_steering_rad(universe_angle_rad, max_angle_rad);
  const double yaw = speed_mps * std::tan(trike_angle) / wheel_base;
  return std::clamp(static_cast<int32_t>(std::lround(yaw * 1000.0)), -3000, 3000);
}
```

### 27.6 Sign-convention map

| Quantity | Autoware convention | E-Trike convention | Conversion in code |
|---|---|---|---|
| Steering angle | left positive (rad) | right positive | `to_trike = -clamp(universe)` |
| Steering wire | rad | 0.1° (`int16`) | `-angle_rad × 1800/π` |
| Yaw / heading rate | left positive | right positive (mrad/s) | `universe_heading_rate = -y/1000` |
| Steering feedback | left positive (rad) | 0.1° right positive | `universe_steering_rad = -d × π/1800` |

### 27.7 Conversion checklist

| # | Step | Evidence it is correct |
|---|---|---|
| 1 | Measure trike `wheel_base`, rear `wheel_tread`, `vehicle_height`, overhangs | Matches `etrike_vehicle_description/config/vehicle_info.param.yaml` |
| 2 | Set `max_steer_angle` to the **mechanical** front-wheel limit | Steering commanded to limit without binding |
| 3 | Update URDF frames (`base_footprint` at rear axle, single front steering link) | `ros2 run tf2_tools view_frames` shows a correct tree |
| 4 | Clamp steering in controllers, gate and bridge | No command exceeds `max_steer_angle` at any layer |
| 5 | Implement sign/unit conversion in the bridge | Positive Autoware steering turns the wheels left |
| 6 | Compute min turning radius | Map lane geometry is achievable |
| 7 | Add and tune the rollover monitor | `etrike_stability_guard` diagnostics show a sane `a_y` band |
| 8 | Clamp speed (`max_speed_forward`/`reverse`) and lateral accel/jerk | No actuator saturation; no tip warning on the test route |
| 9 | Verify standstill steering | Vehicle can start from stop where Autoware expects steering convergence |
| 10 | Test the fail-closed path | Lost feedback/heartbeat/emergency → safe motion (zero speed, invalid steering) |

> Reference implementations in this workspace: `our_packages/autoware_vehicle_bridge`
> (sign/unit/clamp + fail-closed gate), `our_packages/etrike_stability_guard`
> (rollover monitor), `our_packages/etrike_protocol` (generated CAN codec), and
> `our_packages/etrike_vehicle_description` (URDF + geometry).

---

## 28. Docker Images & Updating Code

### 28.1 The layered model

The Docker setup is an **overlay** model: a stock Autoware image provides the
baked base, and our host workspace is bind-mounted and built **on top**.

```text
etrike-kinect-build:latest                 (docker/Dockerfile.kinect)
  └─ ghcr.io/autowarefoundation/autoware:universe-cuda-humble   (baked base)
       - ROS 2 Humble + CUDA 12.8 + Autoware baked at /opt/autoware
       - source via  /opt/autoware/setup.bash
  └─ ADD libfreenect2 (/usr) + Kinect v2 udev rules

host  ~/av_project/autoware   --bind-->   /workspace/autoware   (our built overlay)
      ~/autoware_map          --bind-->   /autoware_map
      ~/av_project/{vehicle,data} --bind--> /workspace/{vehicle,data}
```

**At runtime the stack is composed by sourcing in order:**

```bash
source /opt/autoware/setup.bash              # baked base (all upstream packages)
source /workspace/autoware/install/setup.bash # our overlay SHADOWS the base
```

Any package we build in `/workspace/autoware` **overrides** the baked copy — that
is how patched upstream (Nebula) and our `our_packages` take effect without
rebuilding the base image.

### 28.2 What lives in the image vs what is mounted

| Path (container) | Source | Contents |
|---|---|---|
| `/opt/autoware` | image | Baked upstream Autoware (read-only base) |
| `/workspace/autoware` | host `~/av_project/autoware` (bind) | Our `src/`, `build/`, `install/`, `log/` |
| `/autoware_map` | host `~/autoware_map` (bind) | PCD + Lanelet2 maps |
| `/workspace/vehicle`, `/workspace/data` | host (bind) | Vehicle config, data |
| `/workspace/av_project` | host (bind, shell only) | Whole project |

### 28.3 The scripts (`docker/`)

| Script | Purpose |
|---|---|
| `docker/make_image.sh` | Build `etrike-kinect-build:latest` from `Dockerfile.kinect` (base + libfreenect2). Run when the base tag or system deps change |
| `docker/build.sh` | Compile **our** packages inside the container (`colcon build --packages-select …`) |
| `docker/shell.sh` | Interactive shell with all bind mounts + GPU + display |
| `docker/run.sh` | Launch Autoware with the overlay (planning simulator by default) |
| `run_tests.sh` | Tests (defaults to the project image) |

All honor the `IMAGE` env var and default to `etrike-kinect-build:latest`.

### 28.4 How updated code gets in and compiled

**The update loop:**

```text
edit on host (Windows) ──Syncthing──▶ Linux ~/av_project/autoware
        │                                      │ (bind-mounted into the container)
        ▼                                      ▼
   ./docker/build.sh   ── colcon build inside container ──▶ install/
        │
        ▼
   ./docker/run.sh  (or shell.sh)  ── sources baked + overlay ──▶ ROS 2 runs our code
```

1. **Edit** source on the host. Because `/workspace/autoware` is a bind mount, the
   container sees changes immediately — no copy step.
2. **Compile** with `docker/build.sh`, which runs (inside the container):

   ```bash
   source /opt/autoware/setup.bash
   cd /workspace/autoware
   # Step 1: patched upstream (Nebula)
   colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release \
     --packages-select nebula_hesai_common nebula_hesai_decoders nebula_hesai
   # Step 2: our packages
   colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release \
     --packages-select autoware_vehicle_bridge etrike_protocol \
       etrike_vehicle_description etrike_vehicle_launch \
       etrike_sensor_kit_description etrike_sensor_kit_launch \
       etrike_common_launch etrike_stability_guard etrike_kinect2
   ```

   `--packages-select` builds only those packages; their **dependencies come from
   the baked image**, which is why the base must contain the upstream packages.
3. **Run** via `run.sh`/`shell.sh`, which source `/opt/autoware/setup.bash` then
   `/workspace/autoware/install/setup.bash`.

**Fast iteration** (one package, no script):

```bash
IMAGE=etrike-kinect-build:latest ./docker/shell.sh
# inside:
source /opt/autoware/setup.bash && cd /workspace/autoware
colcon build --symlink-install --packages-select <your_package> \
  --cmake-args -DCMAKE_BUILD_TYPE=Release
```

> `--symlink-install` means **Python, launch files and YAML edits take effect
> without a rebuild**; **C++ requires a `colcon build`**.

### 28.5 Rebuild the image vs rebuild the workspace

| Changed | Action |
|---|---|
| C++/Python/launch/params in `our_packages` or patched upstream | `./docker/build.sh` (workspace only) |
| Autoware base tag (`ARG AUTOWARE_BASE`) | `./docker/make_image.sh`, then `build.sh` |
| System deps (e.g. libfreenect2, apt packages in `Dockerfile.kinect`) | `./docker/make_image.sh`, then `build.sh` |
| CUDA / NVIDIA driver / JetPack | Rebuild image on the target machine |

> **Never** edit `/opt/autoware` inside a running container expecting it to
> persist — `run.sh`/`shell.sh` use `--rm`, so container-local changes are lost.
> Put changes in the bind-mounted workspace and rebuild.

### 28.6 Base image pinning

`Dockerfile.kinect` starts with `ARG AUTOWARE_BASE=ghcr.io/...:universe-cuda-humble`.
Pin an immutable tag (or digest) matching your workspace for reproducibility, and
rebuild the project image whenever the base changes. The current base is **Humble +
CUDA**; a Jazzy base can be substituted per the roadmap when drivers allow.

### 28.7 Device, GPU and display access

`run.sh`/`shell.sh` already forward the essentials for development:

```text
--privileged --runtime=nvidia --gpus all --net=host --ipc=host
-e DISPLAY / WAYLAND_DISPLAY, -v /tmp/.X11-unix:/tmp/.X11-unix:ro
-v ~/autoware_map:/autoware_map
```

For a **real vehicle**, also expose the CAN device, sensor Ethernet interfaces,
serial devices and cameras (e.g. `--device=/dev/can0`, host network for the
sensor NICs, USB passthrough for Kinect). `--privileged` + host networking is a
bring-up convenience, not a production security boundary (see §21).

### 28.8 Common pitfalls

| Pitfall | Symptom | Fix |
|---|---|---|
| Overlay sourced in wrong order | Baked packages used instead of yours | Source `/opt/autoware/setup.bash` **then** `/workspace/autoware/install/setup.bash` |
| Editing `/opt/autoware` | Changes vanish after `--rm` | Edit the bind-mounted workspace; rebuild |
| No `-DCMAKE_BUILD_TYPE=Release` | Everything (esp. point clouds) is slow | Rebuild with Release/RelWithDebInfo |
| Forgot a dependency in `--packages-select` | "package not found" | Its deps must be in the baked image or also selected |
| Build artifacts not on host | `build/install` missing in git | Expected — `.stignore` excludes them; build on the Linux side |
| Kinect not detected | no device nodes | Pass USB through; udev rules matter on the host/Jetson only |

### 28.9 Quick command reference

```bash
cd ~/av_project

# One-time (or after base/deps change): build the project image
./docker/make_image.sh

# Compile our code changes
IMAGE=etrike-kinect-build:latest ./docker/build.sh

# Interactive dev shell
IMAGE=etrike-kinect-build:latest ./docker/shell.sh

# Run Autoware (planning simulator overlay)
./docker/run.sh

# Tests
./run_tests.sh
```

---

## 29. Project Workflow, Hardware Bring-up, Ops & Testing

This section covers the **project-specific** workflow layered on top of the stock
Autoware setup in §3–§28 (companion architecture inventory: §30).

### 29.1 Source sync (Windows ↔ Linux)

`~/av_project` (Linux/Jetson) is mirrored to `E:\work\av_project` (Windows) via
**Syncthing**. `.stignore` excludes build outputs (`build/`, `install/`, `log/`),
bags, caches and Git metadata, so **build artifacts are not synced** — build on the
Linux side. `RUN_SYNC.md` documents the round-trip test.

```powershell
# Windows -> Linux
Set-Content -LiteralPath "E:\work\av_project\sync-test.txt" -Value "windows sync test"
ssh med1@<jetson-ip> "cat ~/av_project/sync-test.txt"
```

### 29.2 Repo bootstrap, patches & drift audit

Upstream Autoware is imported from **pinned** manifests and patched locally.

| Item | Purpose |
|---|---|
| `repositories/autoware.repos` | Pinned upstream revisions (e.g. `agnocast 2.3.5`, `autoware_msgs 1.13.0`, `autoware_adapi_msgs 1.9.2`, `autoware_internal_msgs 1.15.0`) |
| `repositories/{our_autoware,simulator,tools}.repos` | Additional pinned sources |
| `scripts/bootstrap_workspace.sh` | Fresh-clone recovery: `vcs import` → verify revisions → apply patches → verify |
| `patches/` | Local deviations applied by bootstrap (see `UPSTREAM_MODIFICATIONS.md`) |
| `UPSTREAM_MODIFICATIONS.md` | Every deviation, reason, owner, removal condition |
| `scripts/audit_repo_sync.ps1` | Compares ALL local repos against pinned upstream (GitHub API) and reports diffs; also checks `our_packages` and junk files |

> Example patch: Nebula Hesai **XT32M2X firetime** support — replaces the
> hard-coded `368 + 2888·channel_id` formula with per-device CSV firing times
> (fixes ~5.6 µs mean timestamp error affecting distortion correction and
> localization).

### 29.3 CAN bring-up (CANable Pro / SocketCAN)

The E-Trike has **two isolated 500 kbit/s buses**: **high** (Jetson Orin + RT via
MCP2515) and **low** (RT, SYS, MTR, SES/EPS-C, SEB). For bench work a **CANable
Pro** USB-CAN adapter is used.

```bash
./scripts/setup_canable.sh up                 # bring up canable0 @ 500k
./scripts/setup_canable.sh status             # link/state check
./scripts/setup_canable.sh dump               # candump sniffer
./scripts/setup_canable.sh install-udev       # persistent canable0 name
./scripts/setup_canable.sh install-sudo       # passwordless ip/can tools
```

See `docs/hardware/CANABLE_PRO_SETUP.md`, `docs/hardware/CAN_SETTINGS.md`,
`docs/hardware/CAN_WIRING.md`, and `docs/operations/CAN_OPERATIONS.md`.

### 29.4 Sensor network & time synchronization

```bash
sudo ./scripts/setup_lidar_network.sh [if] [host_ip] [sensor_ip]
# defaults: eno1, 192.168.1.10 (Jetson), 192.168.1.201 (XT32M2X), UDP 2368

sudo ./scripts/setup_ptp.sh [if]
# ptp4l (PTP slave) + phc2sys (hardware-clock sync) + chrony
```

Set the sensor NIC, host `192.168.1.10`, sensor `192.168.1.201`, data port `2368`
and PTP port `10110` to match the device.

### 29.5 Jetson platform

| Item | Value (from `docs/setup/SOFTWARE.md`) |
|---|---|
| OS | Ubuntu 22.04.5 LTS (aarch64) |
| Kernel | `5.15.185-tegra` |
| NVIDIA BSP / L4T | R36.5.0 |
| JetPack | 6.2.3 |
| Driver | 540.5.0 |
| Container runtime | Docker Engine + `nvidia` runtime |
| Base image | `ghcr.io/autowarefoundation/autoware:universe-cuda-humble` |

SSH: `ssh med1@<jetson-ip>` (IP can change — verify first). On-monitor RViz uses
`DISPLAY=:1`. See `docs/hardware/JETSON_SSH.md`, `JETSON_QUICK_REF.md`.

### 29.6 Running the stack

- **Consolidated run guide:** `docs/operations/ETRIKE_RUN.md` — starts the
  container, Autoware Universe planning simulator, CANable and the vehicle bridge
  in **sim mode**.
- **One-command loader:** `bash autoware/scripts/loading/load_pipeline.sh`
  (`--universe` / `--canable` / `--bridge` / `--stop` for subsets).
- Sim mode passes the simulator's commands onto CAN while **ignoring hardware
  feedback/engage/estop** — bench/test only, never production (§28.7, §15).

### 29.7 Recovery from GitHub only

`docs/operations/RECOVERY.md` rebuilds the entire stack from the repo alone.
Prerequisites: Ubuntu 22.04, NVIDIA GPU + drivers, Docker + NVIDIA Container
Runtime, Git, `vcstool`, ~50 GB disk, internet.

### 29.8 Monitoring

`docs/operations/AUTOWARE_UNIVERSE_MONITOR.md` documents launching the planning
simulation with RViz on the Jetson's physical display; system/topic health is via
the standard diagnostics (§16) and `scripts/check_*`/`kill_*` helpers.

### 29.9 Testing

| Asset | Purpose |
|---|---|
| `docs/testing/PRE_VEHICLE_TESTS.md` | Must-pass checklist: software/hardware ESTOP + rate limiting + recovery, heartbeat monitoring, … |
| `docs/testing/TEST_PLAN.md` | Overall test plan |
| `scripts/pre_vehicle_tests.py` | Automated pre-vehicle checks |
| `run_tests.sh` | Test runner (Docker image) |
| `scripts/debug_*.py`, `check_topics.py` | Debug/verification helpers |

### 29.10 Sensors (project)

- **Hesai XT32M2X** (`docs/sensors/HESAI_GUIDE.md`): 32-channel mechanical LiDAR;
  driver `nebula_hesai` (`sensor_model: PandarXT32M`); **no IMU** (GNSS/PTP for
  time only); uses the firetime-CSV patch; angle/firetime correction CSVs live in
  `docs/sensors/XT32M/` and `etrike_common_launch/config`.
- **Kinect v2** (`docs/sensors/kinect2/*`): dual front/rear via
  `etrike_kinect2` (libfreenect2); bandwidth/depth reports.
- **IMU is a stub** — mapping relies on LiDAR odometry + kinematics
  (`docs/mapping/MAPPING_GUIDE.md` warns of drift without a real IMU).

### 29.11 Teleoperation

`extensions/autoware_teleop` (see architecture §30.3): RCLCPP lifecycle node +
FastAPI WebSocket bridge + React UI. Two paths — **direct** `/control/command/*`
+ `/vehicle/status/*`, or **ADAPI external-command** `/external/selected/*` +
operation-mode services. Config `autoware_teleop/config/teleop.yaml`.

### 29.12 Full message reference

`docs/reference/AV_PIPELINE_DATA_FLOW.md` reproduces **every message** across the
pipeline (sensors → sensing → localization/perception → planning → control →
vehicle) with example published instances — a useful companion to §23.
