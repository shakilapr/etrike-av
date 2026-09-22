# Autoware Universe — Architecture & Real-Vehicle Integration Reference

> Scope: `autoware/src/universe/autoware_universe` plus the tightly-coupled core
> packages (`core/autoware_core`, `core/autoware_msgs`), the vendor packages in
> `universe/external` (incl. `sensor_component/external/nebula`), and the
> launch/orchestration in `launcher/autoware_launch`.
>
> Written from the actual source where possible. Topics are given by their
> **canonical** names. Where this workspace differs from stock Autoware, a
> **Workspace note** is given. Release/version/issue facts come from the 2026
> research provided for this document and should be confirmed against the current
> release page before use.
>
> **Companion:** setup/installation/real-vehicle/troubleshooting material is also
> collected (copied, not moved) in `autoware-universe-setup.md`, which includes a
> `Car to Tricycle (Trike) Conversion` section.

---

## 1. What Autoware Universe Is

Autoware is a full **Level-4 autonomous-driving stack** on ROS 2. "Universe" is
the application/algorithm layer: concrete localizers, detectors, planners,
controllers. Message definitions, the core engines, and launch orchestration live
in sibling repos but form one pipeline.

The mental model is **sense → localize → perceive → plan → control → actuate**,
wrapped by a **system/health layer** that is **fail-closed** (any fault produces a
stop, never a silent pass-through).

### 1.1 Repository layout

| Directory under `autoware_universe/` | Role |
|---|---|
| `sensing` | Pointcloud/IMU/radar preprocessing (raw drivers launched elsewhere) |
| `localization` | Pose estimation, quality monitoring, multi-estimator arbitration |
| `perception` | Detection, fusion, tracking, prediction, occupancy grid, traffic lights |
| `map` | Map TF helpers only — **no map creation/mapping** (see §9) |
| `planning` | Mission/route, behavior, scenario selection, motion planning, validation |
| `control` | Trajectory follower, controllers, command gate, safety monitors |
| `vehicle` | Command converters / bridge to the real vehicle |
| `system` | MRM, monitors, diagnostic graph, operation mode |
| `common` | Shared libs, component-interface utilities, message adapters |
| `evaluator` | Online/offline metric evaluation vs references |
| `simulator` | CARLA bridge, dummy publishers, fault injection |
| `visualization` | RViz2 panels/plugins |
| `examples`, `docs` | Support |

Sibling repos / directories referenced throughout:

| Repo / dir | Provides |
|---|---|
| `core/autoware_core` | NDT scan matcher, EKF localizer, GNSS poser, behavior/motion velocity planners, component-interface specs |
| `core/autoware_msgs` | All `autoware_*_msgs` and `tier4_*_msgs` definitions |
| `launcher/autoware_launch` | `autoware.launch.xml`, map loading, sensor kits, vehicle launches, component containers |
| `sensor_component` | `ros2_socketcan`, `transport_drivers`, `external/nebula` (LiDAR/radar drivers) |
| `tools` | Map utilities (`tools/map`), `bag2lanelet`, evaluation tools |
| `universe/external` | Vendored dependencies (Eagleye, muSSP, RTKLIB bridge, glog, …) |

### 1.2 The ecosystem: Core / Universe / Index

Autoware is evolving from one large Universe monorepo toward a three-layer model:

| Layer | Nature | Stability | Engineering bar |
|---|---|---|---|
| **Core** | Minimal required framework: localization engines, velocity planners, component-interface specs | Most stable | Rigorous: high code coverage, extensive PR review, strict guidelines; supports basic lane driving + obstacle detection |
| **Universe** | The large application/algorithm package set: ML perception, heuristic behavior planning, control for diverse ODDs | Stable releases, fast-moving `main` | Broader review; validated on Robo-Taxi (dense urban), cargo delivery, Autonomous Valet Parking (AVP), Robo-Bus |
| **Index** | Federated, independently versioned community packages, selected by `aw-index-cli` | Newest | Community-governed; currently ROS 2 Jazzy-oriented |

Practical consequence: a real vehicle should pin **Core + Universe + Launch +
model artifacts** together; additional Index packages are added only after the base
vehicle is stable.

### 1.3 Scope, Capabilities & Limitations (What Autoware Is Not)

**Autoware is an open engineering platform, not a turnkey product.** It does not
"type an address and go." Even with a perfect perception stack, it can only drive
inside a **pre-built HD map** over a configured **ODD** (operational design domain).
This is the single most important thing to understand before deploying it.

#### "Can I give a goal like in Google Maps and it drives there?"

**No.** Google Maps and Autoware solve different problems:

| | Google Maps / navigation app | Autoware Universe |
|---|---|---|
| World model | Road graph + crowdsourced GPS | **HD map**: PCD pointcloud + **Lanelet2** vector map (lane-level) |
| Goal input | Free-text address (geocoded) | A **pose on the HD map** via AD API / RViz (`set_lanelet_route`), reachable through the lanelet graph |
| Positioning | Consumer GPS (meters) | NDT scan matching + EKF (**cm-level**, map-anchored) |
| Traffic rules | Displayed, driver obeys | **Encoded** in the lanelet map (stop lines, lights, topology) |
| Offline/internet | Needs map data/service | Needs a **preloaded HD map**; no online geocoding |
| Coverage | Nearly everywhere | **Only the mapped ODD** |

If the goal is **not on the lanelet network** (or the map is missing/wrong), mission
planning cannot produce a route and — because the stack is **fail-closed** — the
vehicle will not move.

#### Prerequisites before the car can move to a goal (perception alone is not enough)

| # | Required | Without it |
|---|---|---|
| 1 | HD **pointcloud map** (PCD) | NDT has nothing to match → localization fails |
| 2 | **Lanelet2 vector map** with continuous centerlines + topology | No route, no reference path |
| 3 | Correct **map projection/origin** (`map_projector_info.yaml`) | Map misaligns; GNSS↔map wrong |
| 4 | **Calibrated sensors + TF** | Object pose/controls wrong |
| 5 | **Localization initialized** (NDT converged) | No ego pose |
| 6 | A **route** through the lanelet graph to the goal | Mission planning fails |
| 7 | Working **vehicle interface** + engaged | No actuation / rejected |
| 8 | **Fail-closed gate** satisfied (heartbeats, freshness) | Safe stop |

#### What perception completeness does and does not solve

Complete perception (detection, tracking, prediction, occupancy, traffic lights)
means the vehicle can see the world. It does **not** provide the **map**, the
**route**, the **calibrated geometry**, the **localization**, the **planning
semantics**, or the **actuation**. Autoware can only plan **where the lanelet map
says driving is allowed**; perception then informs how to behave on that map. A
brand-new road with no HD map is out of scope, no matter how good the detector is.

#### Capability envelope (what it does well, within a mapped ODD)

- Lane-level driving, intersections, traffic lights, stop lines, crosswalks.
- Lane changes, static/dynamic obstacle avoidance, follow/cruise, stop.
- Parking / Autonomous Valet Parking via freespace planning.
- Optional vision/landmark localization; sensor fusion (LiDAR/camera/radar).

#### Hard limitations (by design or current state)

| Limitation | Consequence |
|---|---|
| **No built-in mapping/SLAM** | You must create PCD + Lanelet2 with external tools |
| **Mapped-ODD only** | Cannot drive unmapped roads or "anywhere on Earth" |
| **No address geocoding / online navigation** | Goal is a map pose, not a text address |
| **Perception ≠ autonomy** | Needs map + localization + route + calibration + vehicle interface |
| **Planar (2D) kinematic model** | No rollover/lean modelling (matters for tall/narrow vehicles) |
| **Ackermann assumption** | Bikes/tricycles/differential-drive need extra work (§27) |
| **Weather/light/sensor ODD** | Degraded sensing degrades the whole stack |
| **Not pre-certified** | ISO 26262 / SOTIF is the integrator's responsibility |
| **Fail-closed** | Any missing map/pose/route/heartbeat → stop, not "continue" |

> **Bottom line:** Autoware can drive autonomously **if all perception is complete
> *and* an accurate HD map of that exact area exists *and* a route to the goal
> exists in the lanelet graph *and* localization, calibration, vehicle interface
> and safety gates are all healthy.** It will not drive to an arbitrary Google-Maps
> destination on unmapped roads.

---

## 2. Mental Model vs Nav2 (and "normal" ROS 2)

| Dimension | Nav2 (typical) | Autoware Universe |
|---|---|---|
| Vehicle model | Differential drive (can turn in place) | **Ackermann / bicycle** (steers a tire, cannot yaw in place) |
| Actuation command | `geometry_msgs/Twist` (`cmd_vel`: `linear.x` + `angular.z`) | `autoware_control_msgs/Control` = `Lateral`(steering_tire_angle+rate) + `Longitudinal`(velocity+accel+jerk) |
| Steering feedback | none (open loop) | `autoware_vehicle_msgs/SteeringReport` (actual tire angle) |
| Map | Optional costmap | **Mandatory HD map**: PCD pointcloud (localization) + Lanelet2 vector (planning) |
| Map creation | SLAM Toolbox / AMCL inside stack | **No built-in mapping/SLAM** — PCD made externally, Lanelet2 authored in external editors (§9) |
| Localization | `robot_localization` EKF on wheel/IMU, **no map** | **LiDAR NDT scan match vs PCD map** + EKF fusion + GNSS seeding + vision/landmark; **not AMCL** |
| Goal input | 2D pose goal | Lanelet route + checkpoints; scenario-driven (lane driving / parking) |
| Trajectory | None (controller follows a goal) | Dense `Trajectory` with per-point velocity/accel/curvature/wheel angles |
| Command sources | Single (`cmd_vel`) | **Multi-source** (auto / external / emergency) with fail-closed gate |
| Safety posture | Best-effort, may time out | **Fail-closed**: lost heartbeat/command → emergency stop |
| Deployment | Processes / lifecycle | **Composable nodes in component containers** (+ lifecycle for drivers) |

**Why not `Twist`?** A car needs a steering angle in radians and a drive/brake
force, not a yaw rate. `Twist.angular.z` is ambiguous and unrealizable for an
Ackermann vehicle. Autoware defines `Control`/`Lateral`/`Longitudinal`/
`SteeringReport` so the gateway can clamp steering rate/angle, accel and jerk —
fields `Twist` has no notion of.

### 2.1 Modular stack vs closed-source / end-to-end stacks

Autoware is a **hardware-agnostic, strictly modular** pipeline
(perception → localization → planning → control) communicating over DDS. This has
explicit trade-offs:

| Dimension | Autoware Universe (modular, open) | Vertically integrated / end-to-end (closed) |
|---|---|---|
| Integration | Hardware-agnostic; abstraction layers add minor overhead; extensive manual tuning per vehicle | Software coupled to proprietary sensors/silicon; extreme optimization and deterministic HIL redundancy |
| Debuggability | Each module's decision is traceable and independently testable | Implicit scene understanding; limited interpretability |
| Failure mode | **Compounding errors across module boundaries** — a small bounding-box fluctuation can trigger a large trajectory deviation | Often smoother in edge cases; less predictable safety guarantees |
| Safety case | Built per vehicle; running on general Linux makes ISO 26262 harder than a specialized RTOS | May ship substantial safety evidence for a fixed configuration |
| Flexibility | Algorithms/sensors replaceable; complete data path owned by integrator | Narrower validated BOM; less freedom |

Named contrasts: NVIDIA states **DriveOS 6.0 is ISO 26262 ASIL-D conformant** and
describes ASIL-D-oriented DRIVE/Thor hardware with ISO/SAE 21434 cybersecurity;
**Apex.AI** commercializes deterministic, safety-qualified middleware (not a
perception/planning stack); **Mobileye** ships integrated EyeQ-based products
rather than user-modifiable ROS nodes. The takeaway:

> **Autoware's limitation is not a lack of algorithms — it is the amount of
> vehicle-specific systems engineering, qualification, lifecycle management and
> safety evidence the adopter must supply.** Its advantage is that almost every
> layer can be inspected, replaced and validated.

The modular design is what makes the pipeline inspectable — and also why
**governing the interfaces between modules is the integrator's core job**.

---

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

## 6. Coordinate Frames & TF Tree

Frame names from config (`ndt_scan_matcher.param.yaml`, `ekf_localizer.param.yaml`,
sensor-kit calibration).

| Frame | Meaning | Set by |
|---|---|---|
| `map` | Fixed world/reference frame (localization output frame) | map / NDT param `map_frame: "map"` |
| `base_link` | Vehicle body reference | URDF; EKF emits `map→base_link` |
| `ndt_base_link` | NDT alignment reference (intermediate) | `ndt_scan_matcher` emits `map→ndt_base_link` |
| `sensor_kit_base_link` | Sensor-kit mounting reference | URDF static (calibrated) |
| `velodyne_top_base_link`, `velodyne_left_base_link`, `velodyne_right_base_link` | LiDAR frames | URDF static |
| `gnss_link` | GNSS antenna frame | URDF static |
| `tamagawa/imu_link` | IMU frame | URDF static |
| `camera0/camera_link … camera4/camera_link`, `.../optical` | Camera frames | URDF static |

TF tree (as actually broadcast):

| Parent → Child | Published by | Notes |
|---|---|---|
| `map → base_link` | `autoware_ekf_localizer` | `Odometry.frame_id="map"`, `child_frame_id="base_link"` |
| `map → ndt_base_link` | `autoware_ndt_scan_matcher` | NDT `publish_tf()` |
| `base_link → sensor_kit_base_link → sensor frames` | URDF / robot_state_publisher | Static calibrated extrinsics |
| (GNSS transform) | `autoware_gnss_poser` | Broadcasts configured parent/child |

Important corrections:

- **There is no `map → odom` transform** here. Localization output is expressed
  directly in the **`map` frame**; the EKF broadcasts `map→base_link`.
- `odom`/`odom_base` appear only as topic/variable names, not TF frames.
- Sensor extrinsics come from the vehicle/sensor URDF, not from localization.

**Definition of `base_link`:** the exact projection of the **center of the rear
axle onto the ground**. Every sensor (roof LiDAR, bumper radar, GNSS antenna) must
be extrinsically calibrated relative to this frame so that, e.g., a LiDAR detecting
an obstacle 5 m away is correctly mapped relative to the physical front bumper.

**Do not hide a sensor mounting error by adjusting the map or localization
parameters. Fix the transform.**

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

## 10. Roads, Paths & Route Drawing

### 10.1 Lanelet2 data model (how roads are represented)

A Lanelet2 vector map is an `.osm` XML file. Roads are **not** a single line the
car follows — they are a graph of drivable areas:

| Element | Meaning |
|---|---|
| **Linestring** | A polyline road boundary / lane divider (shared between lanelets) |
| **Lanelet** | Drivable area bounded by a **left** and a **right** linestring; attributes (`type`, `location`, `one_way`, speed limit, subtype) |
| **Regulatory element** | Rules attached to lanelets (traffic light, speed limit, right-of-way, …) |
| **Polygon** | Marked area (crosswalk, stop line, parking spot, …) |
| **Point** | Vertex of linestrings/polygons |

Lanelets connect into a directed graph; intersections are lanelet groups.
Traffic-light and landmark positions are also encoded here (they drive perception
traffic-light ROI and landmark localizers).

### 10.2 Centerline → the path the car follows

A lanelet need not store a centerline; `lanelet2_map_loader` generates it:

| Mode | Behavior |
|---|---|
| `overwriteLaneletsCenterline` (default) | Compute each lanelet's centerline from left/right boundaries |
| `overwriteLaneletsCenterlineWithWaypoints` (`use_waypoints=true`) | Use authored **waypoints** (allows curved/offset centerlines) |

The behavior path planner samples this centerline into `PathWithLaneId` points, so
the path is **derived**, not drawn per run.

**Centerline integrity is critical.** Planning depends on continuous, unbroken
lane centerlines. Missing or misaligned centerlines mean no reference path can be
generated and the system fails immediately — this is a map QA issue, not a planner
bug.

### 10.3 How roads are authored / validated

| Method | Description |
|---|---|
| **Vector Map Builder** (GUI) | Point-and-click lanelets/linestrings/regulatory elements over a pointcloud background (recommended) |
| **JOSM + Lanelet2 plugin** | Direct `.osm` editing with validation |
| **`tools/bag2lanelet`** | Auto-generate lanelets from a recorded manual drive, then refine in Vector Map Builder |
| **`autoware_lanelet2_map_validator`** | Validate Autoware's Lanelet requirements before use |

Editing is done **outside** Autoware (no in-stack map editor here).

**Advanced maneuvers need explicit semantic tags.** A legal autonomous lane change
requires the adjacent lanelet boundaries to be tagged with the correct line type
(**dashed vs solid**) and the metadata needed to permit a lateral crossover.
Without those tags the lane-change module will not authorize the maneuver.

### 10.4 How a route/path is drawn at runtime

| Step | What happens |
|---|---|
| 1. Select start/goal | RViz via AD API (`tier4_adapi_rviz_plugin`), or `set_lanelet_route`/`set_waypoint_route` services |
| 2. Mission planning | `autoware_mission_planner_universe` searches the lanelet graph → `LaneletRoute` |
| 3. Behavior path | `autoware_behavior_path_planner` converts route lanelets to centerline points (`PathWithLaneId`); scene modules modify it |
| 4. Velocity + validation | Velocity planners add a speed profile → `Trajectory`; validator gates it |
| 5. Visualization | `autoware_lanelet2_map_visualizer` + RViz show lanes, route, path, planning factors |

At runtime the operator picks **where to go**; Autoware resolves **which lanes**
and **what geometry**. Roads are drawn once, offline, in the vector map.

### 10.5 Reading map-alignment symptoms

Overlay the Lanelet2 model on the PCD and diagnose offsets by their character:

| Symptom | Likely cause |
|---|---|
| Consistent lateral offset across the whole map | Origin/projection error |
| Rotating/diverging offset | Yaw / georeferencing problem |
| Local offset on one segment | Editing error or local SLAM deformation |
| Lanes look connected but routes fail | Inconsistent lanelet graph topology/attributes |

**Geometrically touching lanes are not necessarily a valid connected route.**
Validate graph connectivity, not just visual overlap.

---

## 11. Localization — and Its Limitations

Engines live in **`core/autoware_core/localization`**; augmenting/monitoring nodes
in `universe/autoware_universe/localization`.

### 11.1 Core engines

| Node | Algorithm | Inputs | Outputs |
|---|---|---|---|
| `autoware_ndt_scan_matcher` | **NDT** scan matching (`ndt_omp`, OpenMP). Initial guess from EKF; refines x/y/yaw (z/roll/pitch via map) | `ekf_pose_with_covariance` ← `…/biased_pose_with_covariance`; `points_raw` ← `…/util/downsample/pointcloud`; optional GNSS regularization ← `/sensing/gnss/pose_with_covariance`. Service `ndt_align_srv` | `/localization/pose_estimator/pose(_with_covariance)`; `map→ndt_base_link` TF |
| `autoware_ekf_localizer` | **EKF**, 2-DoF (x,y,yaw) + pose/twist. Time-delay compensation, yaw-bias estimation, Mahalanobis gating, pitch→z | pose (NDT), twist ← `…/twist_with_covariance`, `initialpose` | `/localization/kinematic_state` (`Odometry`), `…/pose_with_covariance`, `biased_pose_with_covariance` (→ NDT), `map→base_link` TF, `/diagnostics` |
| `autoware_gnss_poser` | NavSatFix + INS orientation → base_link pose in map frame | `MapProjectorInfo`, `~/input/fix`, `~/input/autoware_orientation` | `/sensing/gnss/pose_with_covariance` |

**No GTSAM / factor-graph backend exists** — fusion is EKF. The **NDT↔EKF loop**
closes: EKF `biased_pose` seeds NDT; NDT pose updates the EKF.

**How NDT works (and why initialization matters).** Unlike ICP, NDT voxelizes the
pointcloud map and, for each cell, computes the **mean and covariance** of the
points to build a continuous **Probability Density Function (PDF)**. A live LiDAR
scan is scored against this PDF, and the algorithm seeks the rigid transform
maximizing alignment. The score is optimized with **Newton's method**, iteratively
updating the pose from the gradient and Hessian until convergence
(`trans_epsilon`, `max_iterations`, `resolution`). Because NDT is a local
optimizer, it needs a good initial guess — this is why the system uses a dedicated
`autoware_pose_initializer` node, which ingests GNSS coordinates or a manual 2-D
pose estimate and uses a **Monte Carlo / Tree-Structured Parzen Estimator (TPE)**
search to lock onto the global map (the `ndt_align_srv` path, `particles_num`).
In feature-sparse or repetitive environments the NDT gradient flattens and the
pose can slide or freeze; the **GNSS regularization term** adds a penalty for
deviating from the GNSS base pose to stabilize the longitudinal direction. After
initialization, the **EKF fuses high-latency NDT pose updates with high-frequency
IMU/wheel data**, so if NDT fails (occlusion, degeneracy) the EKF dead-reckons
until matching resumes. The **pose estimator arbiter** continuously monitors
estimator health and can switch or degrade pose sources.

**AMCL is not the normal Autoware road-vehicle localizer.** Standard operation is
map-pointcloud NDT + the vehicle localization fusion pipeline. An AMCL-based
low-speed indoor platform can be adapted to publish the required map-relative
pose/odometry interfaces, but that is an integration fork, not a stock launch flag.

### 11.2 Augmentation & monitoring (Universe)

| Package | Role |
|---|---|
| `yabloc/*` | Vision + Lanelet2 particle-filter localization; **no PCD map required** |
| `autoware_ar_tag_based_localizer` | Camera ArUco landmarks; <15 km/h confined areas |
| `autoware_lidar_marker_localizer` | Reflector-board landmarks by intensity pattern |
| `autoware_landmark_manager` | Loads landmark polygons from Lanelet2 |
| `autoware_localization_error_monitor` | Confidence-ellipse diagnostics |
| `autoware_pose_instability_detector` | Dead-reckoning vs EKF consistency check |
| `autoware_pose_covariance_modifier` | GNSS+NDT blend (disabled by default) |
| `autoware_pose_estimator_arbiter` | Suspend/resume NDT/YabLoc/Eagleye/AR-tag |
| `autoware_pose2twist`, `autoware_geo_pose_projector` | Pose→twist; geo-pose→map pose |

### 11.3 GNSS vs NDT philosophy

Treat GNSS initially as an **independent reference**, not an immediate override of
NDT. Default operation relies principally on NDT as the pose source; high-accuracy
GNSS can help where NDT has weak observability (straight roads, bridges), but
incorrect GNSS near buildings/tunnels/multipath can pull localization wrong.
Regularization is **disabled by default**.

**Official tuning example:** the localization tuning tutorial uses **NDT as the
pose source and gyro odometry (`autoware_gyro_odometer`) as the twist source**.
Its central trade-off: larger point-cloud search areas and denser points give NDT
more structure but cost CPU. The tutorial example expands the localization crop
from a default **±60 m toward ±150 m** in difficult (wooded/cliff) environments
and notes a **3.0 m voxel** setting in its preprocessing example — these are
tutorial-specific values, not universal optima.

NDT tuning order (change one, measure accuracy **and** latency):

| Knob | Effect | Risk |
|---|---|---|
| Point-cloud crop distance ↑ | More environmental structure | More CPU/memory |
| Voxel size ↓ | Denser registration input | More compute |
| NDT map `resolution` ↓ | Finer local structure | More compute/noise sensitivity |
| Iteration limit ↑ | More chance to converge | More latency |
| Initial-pose uncertainty envelope | Wider initialization | Wrong local solution |
| Convergence/score threshold stricter | Reject bad registration | More dropouts |
| Regularization / GNSS assistance | Helps low-structure areas | Biases toward bad GNSS if covariance wrong |

Take exact parameter names from the `ndt_scan_matcher` schema/YAML in the **pinned
workspace** — Universe parameters evolve and old Autoware.AI tutorial names may not
apply.

### 11.4 Acceptance metrics

| Metric | Why it matters |
|---|---|
| Horizontal position RMSE / p95 / max | Overall map-relative accuracy |
| Yaw RMSE / p95 | Small yaw errors create large lateral errors ahead |
| NDT convergence/rejection rate | Detects marginal map geometry |
| NDT execution time p50/p95/p99 | Real-time budget (documented pathological runs exist) |
| Innovation/residual distributions | Detects bad covariance or bias |
| GNSS disagreement | Independent health signal |
| Time to initialize / relocalize after perturbation | Operational robustness |
| Localization dropouts per km | Real-world reliability |
| Error classified by environment | Tunnel/highway/urban-canyon failure discovery |

Compare against a better reference (survey or post-processed GNSS/INS). **A mean
RMSE alone is insufficient — rare localization jumps are more dangerous than a
small constant bias.** Benchmark NDT on the actual ECU with the real map and point
density.

### 11.5 Key parameters

| Scope | Parameter | Value / note |
|---|---|---|
| NDT | `resolution` | `2.0` (voxel size) |
| NDT | `step_size` / `trans_epsilon` / `max_iterations` / `num_threads` | `0.1` / `0.01` / `30` / `4` |
| NDT | `required_distance` / `timeout_sec` | `10.0` m / `1.0` s |
| NDT | `initial_to_result_distance_tolerance_m` | `3.0` m |
| NDT | `critical_upper_bound_exe_time_ms` | `100.0` ms |
| NDT | `skipping_publish_num` | `5` consecutive rejects |
| NDT | score threshold | NVTL `2.3` (or transform-probability `3.0`) |
| NDT | `covariance_estimation_type` | `FIXED` (default; empirical) |
| NDT | dynamic map `update_distance` / `map_radius` / `lidar_radius` | `20.0` / `150.0` / `100.0` m |
| NDT init | `particles_num` | `200` (Monte-Carlo align) |
| EKF | process noise | `proc_stddev_vx_c: 10.0`, `proc_stddev_wz_c: 5.0`, `proc_stddev_yaw_c: 0.005`; `enable_yaw_bias_estimation: true` |
| EKF | measurement tuning | `pose_measure_uncertainty_time: 0.01`, `pose_smoothing_steps: 5`, `twist_smoothing_steps: 2` |
| EKF | gating | `pose_gate_dist: 49.5`, `twist_gate_dist: 46.1` (chi-square, sig. 10⁻¹⁰) |
| EKF | diagnostics | `warn_ellipse_size: 1.2`, `error_ellipse_size: 1.5` (+ lateral `0.25`/`0.3`) |

### 11.6 Limitations

| Area | Limitation |
|---|---|
| NDT — degeneracy | Featureless environments (bridges/highways/tunnels) → longitudinal drift; regularization is **disabled by default** |
| NDT — map | Requires accurate, feature-rich PCD; empty/broken regions fail (`is_set_map_points`) |
| NDT — init | Needs a good initial pose; jumps > `3.0 m` rejected; MC align for re-init |
| NDT — gating | Rejects on low score, oscillation > 10, exe time > 100 ms, or ≥5 consecutive rejects |
| NDT — regularization | GNSS base can pull to a **wrong** solution in tunnels/indoors/high-rise; only longitudinal corrected |
| NDT — covariance | Default fixed empirical matrix; real-time estimation optional & heavy |
| NDT — dynamic map | Sensitive to PCD split tile size |
| EKF — yaw bias | Single state invalid if multiple estimators each have their own bias |
| EKF — gating | Poor input covariance → uncertain gating |
| EKF — model | 3-DoF only; z derived from pitch (approximate on slopes) |
| EKF — sync | Delay compensation depends on correct timestamps |
| YabLoc | Cannot run concurrently with NDT; no roll/pitch; single camera; fails with sparse markings |
| General | GNSS dependence for init/regularization → degrades in urban canyons |
| General | NDT↔EKF coupling: bad EKF guess → NDT local minimum; NDT rejects can starve EKF |

### 11.7 vs `robot_localization`

`robot_localization` fuses generic wheel+IMU odometry with a simple filter and
**no map**. Autoware is a **map-anchored, multi-modal, fail-closed AV
localization** centered on **LiDAR NDT + EKF**, with GNSS seeding, vision/landmark
alternatives, dynamic map streaming, and layered health monitoring.

---

## 12. Perception

Source: `autoware_universe/perception/` (50 packages). Nodes expose relative
`~/input/*` / `~/output/*`, remapped to `/perception/...`.

### 12.1 Pipeline

| Stage | Packages | In → Out |
|---|---|---|
| LiDAR 3D detection | `lidar_centerpoint`, `lidar_transfusion`, `lidar_frnet`, `lidar_apollo_instance_segmentation`, `lidar_ptv3`, `bevfusion` | `PointCloud2` → `DetectedObjects` / `DetectedObjectsWithFeature` |
| Geometric clustering | `euclidean_cluster`, `ground_segmentation`, `shape_estimation` | `PointCloud2` → `DetectedObjectsWithFeature` |
| Camera 2D detection | `tensorrt_yolox`, `tensorrt_bevdet`, `tensorrt_bevformer`, `camera_streampetr`, `bytetrack` | `Image` → `DetectedObjectsWithFeature` (ROIs) |
| Camera-LiDAR fusion | `image_projection_based_fusion` (5 modes) | 3D msg + ROIs + camera_info → `DetectedObjects` |
| Radar | `radar_object_tracker`, `radar_tracks_msgs_converter`, `radar_fusion_to_detected_object` | radar → `DetectedObjects` (Doppler-injected) |
| Merging/validation | `object_merger`, `simple_object_merger`, `tracking_object_merger`, `detected_object_validation`, `object_sorter`, `feature_remover` | merge/filter |
| Tracking | `multi_object_tracker` | up to 12× `DetectedObjects` + `Odometry` → `TrackedObjects` |
| Prediction | `map_based_prediction`, `simpl_prediction`, `predicted_path_postprocessor` | `TrackedObjects` + map + signals → `PredictedObjects` |
| Occupancy grid | `probabilistic_occupancy_grid_map`, `occupancy_grid_map_outlier_filter` | `PointCloud2` → `nav_msgs/OccupancyGrid` |
| Traffic lights | `traffic_light_map_based_detector` → `classifier`/`fine_detector` → `multi_camera_fusion` → `arbiter` → `selector` | `Image` + map + route → `TrafficLightGroupArray` |

### 12.2 Key I/O

| Package | In | Out |
|---|---|---|
| `autoware_lidar_centerpoint` | `~/input/pointcloud` (`PointCloud2`) | `DetectedObjects` |
| `autoware_euclidean_cluster` | `~/input/pointcloud` | `DetectedObjectsWithFeature` |
| `autoware_shape_estimation` | `DetectedObjectsWithFeature` | `DetectedObjectsWithFeature` |
| `autoware_tensorrt_yolox` | `Image` | `DetectedObjectsWithFeature` (ROIs) |
| `autoware_image_projection_based_fusion` | 3D msg + `rois{0..8}` + `camera_info{0..8}` + `concatenation_info` | `DetectedObjects` |
| `autoware_radar_fusion_to_detected_object` | `~/input/objects` + `~/input/radars` | `DetectedObjects` |
| `autoware_multi_object_tracker` | `~/input/detection01..12/objects` + `~/input/odometry` | `TrackedObjects` |
| `autoware_map_based_prediction` | `~/input/objects` + `/vector_map` + `~/traffic_signals` | `PredictedObjects` |
| `autoware_probabilistic_occupancy_grid_map` | obstacle + raw pointcloud | `nav_msgs/OccupancyGrid` |
| `autoware_traffic_light_arbiter` | map + perception + external/V2X signals | `~/pub/traffic_signals` |

### 12.3 Fusion logic

| Fusion | Mechanism |
|---|---|
| Camera-LiDAR | 5 modes: `roi_cluster_fusion`, `roi_detected_object_fusion`, `pointpainting_fusion`, `roi_pointcloud_fusion`, `segmentation_pointcloud_fusion`. Sync via per-camera `rois_timestamp_offsets`; `naive` or `advanced` (`ConcatenatedPointCloudInfo`) matching |
| Radar | ApproximateTime sync; match by 2D bbox overlap + yaw diff; fuse Doppler into `twist` |
| Tracking | Per-class EKF + **muSSP** min-cost-flow data association (see §17); per-channel trust flags |
| Traffic-light arbitration | Confidence/priority merge of perception vs external/V2X |

### 12.4 Message types

| Message (`autoware_perception_msgs`) | Meaning |
|---|---|
| `DetectedObjects` / `DetectedObject` | 3D detections (pose, shape, class, kinematics, confidence) |
| `TrackedObjects` / `TrackedObject` | Tracked objects with stable IDs |
| `PredictedObjects` / `PredictedObject` / `PredictedPath` | Future trajectories + probabilities |
| `TrafficLightGroupArray` / `TrafficSignal` | Traffic-light states |
| `tier4_perception_msgs/DetectedObjectsWithFeature` | Clusters/ROIs + pointcloud feature |
| `tier4_perception_msgs/TrafficLightRoiArray` | Traffic-light ROIs |

### 12.5 CenterPoint detail (`autoware_lidar_centerpoint`)

Pipeline: `PointCloud2` → voxel/pillar preprocessing → **PointPillars-based
CenterPoint** network → **TensorRT** → `DetectedObjects`. The package publishes
processing-time diagnostics and consumes a model bundle:

```text
pts_voxel_encoder.onnx
pts_backbone_neck_head.onnx
ml_package.param.yaml
detection_class_remapper.param.yaml
```

TensorRT engines are built **locally** on first launch (or with
`build_only:=true`). Model variants in this workspace:
`centerpoint`, `centerpoint_tiny`, `centerpoint_short_range` (plus sigma bundles).
**Pre-build the engine before a vehicle test** so a model-build problem does not
surface while the full stack starts:

```bash
ros2 launch autoware_lidar_centerpoint lidar_centerpoint.launch.xml \
  model_path:="$HOME/autoware_data/ml_models/lidar_centerpoint/base" \
  build_only:=true
```

Model-bundle layouts change across releases (e.g. v4.0 → v4.1); a runtime now
**rejects mismatched older bundle metadata**. `existence_probability` is the
network's classification confidence, **not** a calibrated statistical
probability. Tune range, voxel size, class confidence, NMS and model variant —
but do not blindly widen the ROI (sparse distant returns add lots of input for
little information).

### 12.6 Multi-object tracker detail

`autoware_multi_object_tracker` performs gated detection-to-track association
(BEV area, Mahalanobis distance, max-distance) solved as min-cost/max-flow via
**muSSP** (source dir `mu_successive_shortest_path`), then class-specific EKF
tracking. It has separate motion/shape models for **pedestrians, bicycles,
passenger cars, large/multiple vehicles, static and unknown** objects, with
overlapping models where class transitions would destabilize tracks. Tune the
**association gates** (too tight → fragmented tracks; too loose → ID switches),
confirmation/deletion timing, process noise and detector channels.

### 12.7 Prediction troubleshooting order

```
bad prediction
  ├─ bad detection?
  ├─ bad tracking velocity/ID?
  ├─ wrong Lanelet topology?
  └─ only then prediction parameters
```

Prediction tuning concepts: prediction horizon, sampling interval, allowed lane
candidates, lateral/yaw matching tolerances, alternative-path probabilities, and
pedestrian/crosswalk treatment.

> **Every perception input — its duty and how it affects the output — is detailed
> in the §29 code review. What can and cannot be detected (people, vehicles, lane
> lines, traffic lights, potholes, bumps, overtaking, driver drowsiness, …) is in
> §31.**

---

## 13. Planning

Source: `autoware_universe/planning/` (26 dirs) + velocity planners in
`core/autoware_core/planning`. **There is no single `planning_component` package**;
it is a **pipeline of specialized planners**.

### 13.1 Pipeline

| Stage | Node | In | Out |
|---|---|---|---|
| Mission/route | `autoware_mission_planner_universe` | `vector_map`, `modified_goal`, `odometry`, operation mode | `/planning/mission_planning/route` (`LaneletRoute`), state |
| Scenario switch | `autoware_scenario_selector` | lane-driving + parking trajectories, map, route, odom | `Scenario` + selected `Trajectory` |
| Behavior path | `autoware_behavior_path_planner` (LaneDriving only) | route, map, `PredictedObjects`, occupancy, traffic signals, odom | `PathWithLaneId` |
| Behavior velocity | `behavior_velocity_planner` (core) | `PathWithLaneId`, map, objects | `Path` (traffic-rule velocity) |
| Motion velocity | `motion_velocity_planner` (core) | `Trajectory`, objects, pointcloud, occupancy | `Trajectory` (obstacle velocity profile) |
| Validation | `autoware_planning_validator` | `Trajectory`, kinematics, map, signals | validated `Trajectory` → Control |
| Generative (alt) | `diffusion_planner` → `trajectory_concatenator` → `trajectory_selector` → `trajectory_ranker` → `trajectory_adapter` | candidates | alternate `Trajectory` |

The **scenario selector is a mux, not a planner**: it picks LaneDriving
(behavior + velocity planners) or Parking (`autoware_freespace_planner`).

> **Historical vs current planner names.** Older Autoware documentation and blog
> posts reference `obstacle_avoidance_planner`, `obstacle_cruise_planner`,
> `obstacle_stop_planner` and `motion_velocity_smoother`. In this codebase those
> standalone packages are **not present**; their roles are now covered by
> `motion_velocity_planner` + `behavior_velocity_planner` (plus
> `autoware_path_optimizer` / `autoware_path_smoother`). Treat old planner names
> as legacy when reading third-party guides.

### 13.2 Algorithm placement (avoiding conceptual mistakes)

| Algorithm/concept | Where it fits | Main lane planner? | Tuning concern |
|---|---|---:|---|
| Lanelet routing graph | Mission-level route over semantic lanes | Yes | Map connectivity, route cost/constraints |
| Dijkstra-like graph search | Implementation behind graph routing; not a user-facing selector | No | Graph/map correctness |
| A*/Hybrid-A* search | Free-space/parking search workflows | No | Grid resolution, footprint, bounds |
| Lattice/sampling | Maneuver candidate generation (lane change/behavior) | No | Sampling ranges, collision constraints |
| Constant-jerk lateral shift | Behavior path modification | Yes (in modules) | Lateral jerk/accel limits |
| Rule-based scene modules | Normal behavior planning | **Yes** | Module enablement, safety distances |
| Diffusion Planner | Learned/generative alternative (v5 assets in 1.9) | Optional | Model version, inference performance, validation |
| MPC | **Trajectory tracking/control**, not route planning | Control layer | Vehicle model, delays, QP weights |
| Pure Pursuit | Alternative lateral follower | Control layer | Lookahead behavior |
| Longitudinal FF/PID | Speed/acceleration tracking | Control layer | Actuator delay, gains, slope/brake |

**Common error:** trying to "tune MPC to avoid an obstacle." MPC is downstream —
by the time it receives a `Trajectory`, planning has already decided where to go.

### 13.3 Message flow and key fields

| Message | Key fields |
|---|---|
| `autoware_planning_msgs/LaneletRoute` | start/goal pose, `LaneletSegment[]`, `uuid` |
| `autoware_internal_planning_msgs/PathWithLaneId` | `PathPointWithLaneId[]` (pose + `lane_ids`), left/right bounds |
| `autoware_planning_msgs/Path` | `PathPoint[]`, bounds |
| `autoware_planning_msgs/Trajectory` | `header` + `TrajectoryPoint[]` |
| `TrajectoryPoint` | `time_from_start`, `pose`, `longitudinal_velocity_mps`, `lateral_velocity_mps`, `acceleration_mps2`, `heading_rate_rps`, `front/rear_wheel_angle_rad` |
| `autoware_internal_planning_msgs/Scenario` | `current_scenario`, `activating_scenarios[]` (`LaneDriving`/`Parking`) |

The behavior planner emits **geometry only** (`PathWithLaneId`); the velocity
planners attach the profile to form the `Trajectory` Control consumes.

### 13.4 Behavior path planner modules

| Module | Purpose |
|---|---|
| Lane Following | Reference path from lanelet centerline |
| Static/Dynamic Obstacle Avoidance | Path around objects to avoid |
| Avoidance By Lane Change | Lane change to avoid |
| Lane Change / External Lane Change | Collision-checked lane change |
| Goal Planner | Stop at goal in shoulder lane (uses occupancy grid) |
| Start Planner | Merge from shoulder into road |
| Side Shift | Lateral shift from external `LateralOffset` |
| Bidirectional Traffic | Oncoming-traffic handling |
| Sampling Planner | Sampling-based alternative |

Planner Manager merges modules into one `PathWithLaneId`; lateral shifts use a
constant-jerk `ShiftLine`; safety = min braking-distance polygon overlap.
Known limitation: Goal Planner cannot run with other modules; custom modules
require editing core code.

**Module coordination & Request-To-Cooperate (RTC).** The current mechanism is the
**Planner Manager** (`planner_manager.cpp`), which decides which scene modules
activate and in what order, and merges their outputs. Behavior-tree-based manager
designs have been proposed/discussed in the ecosystem, but this codebase uses the
Planner Manager. Modules needing human/remote oversight use
`autoware_rtc_interface`, which publishes a cooperate status (safe/unsafe, current
state, start/finish distance, stamp) and receives **activate/deactivate** commands
from a local safety driver or teleoperation operator; the vehicle holds until the
maneuver is approved.

**Freespace / parking planning.** Parking and tight maneuvering use
`autoware_freespace_planner` over `autoware_freespace_planning_algorithms`, which
implements **Hybrid A\*** (Ackermann-aware, multi-point turns) and **RRT\*
(informed RRT\*)** with a custom costmap. Rough quality/speed ordering:
`A*` → `informed RRT*` → `RRT`.

### 13.5 Behavior velocity modules

Plugin-based traffic-rule constraints inserted on the path: blind spots,
crosswalks, intersections, stop lines, traffic lights, run-out hazards, speed
bumps, no-stopping/no-drivable areas, occlusion spots, roundabouts, etc.

### 13.6 Scenario selection logic

| Transition | Condition |
|---|---|
| → LaneDriving | Ego and goal both in lane |
| → Parking | Ego in parking lot and goal not in lane |
| Parking → LaneDriving | `is_parking_completed` and ego back in lane |
| Hysteresis | `lane_stopping_timeout_s`, `empty_parking_trajectory_timeout_s` |
| Message gating | Selected trajectory only forwarded if age ≤ `th_max_message_delay_sec` (1.0 s) |

### 13.7 Layer responsibility (avoid cross-layer tuning)

A lane-change module does **not** decide whether to run a red light; the
intersection/traffic-light **behavior-velocity** module does. The mission planner
does **not** react to a slow vehicle; the **motion-velocity** module does. When a
route has an intersection and a slower vehicle ahead:

```text
Lanelet route
  → Behavior Path     : "remain in lane, or lane-change/avoid?"   (geometry)
  → Behavior Velocity : "traffic light / stop line / crosswalk?"  (semantics)
  → Motion Velocity   : "cruise / slow / stop for actual obstacle"(dynamics)
  → Trajectory opt/gen: smoothness + feasibility + limits
  → Validator         : reject implausible/unsafe trajectory
  → Control           : track the final trajectory
```

Troubleshooting therefore requires identifying **which layer modified the path**.

### 13.8 Modules, presets and cost functions

Planning modules are enabled/disabled through launch presets: the top-level launch
exposes a planning preset and `config/planning/preset/default_preset.yaml` (and
`config/control/preset/default_preset.yaml`); arguments such as
`launch_avoidance_module` feed the module `*.enable_module` params.

There is **no single universal "global planner cost function"**:

- **Behavior modules** are logic/constraint driven (legal/semantic conditions gate
  stops, yields, lane changes, avoidance).
- **Geometric optimizers** typically balance reference tracking, smoothness,
  curvature, obstacle cost and drivable-area cost:
  `J = w_ref J_ref + w_smooth J_smooth + w_curv J_curv + w_obs J_obs + w_bound J_drivable`,
  subject to vehicle geometry/feasibility.
- **Velocity smoothing** treats jerk/acceleration limits as central and is often
  solved as an **Operator-Splitting QP (OSQP)**.
- **Sampling-based planners** generate/rank multiple candidate trajectories.

Exact objectives/weights are per-package and per-release.

### 13.9 Planning parameters to tune first

| Parameter family | Symptom when wrong | Objective |
|---|---|---|
| Vehicle dimensions/wheelbase | Boundary collisions, impossible curvature | Correct geometry first |
| Max lateral/longitudinal accel | Aggressive or overly conservative maneuvers | Match vehicle capability + comfort |
| Jerk limits | Abrupt accel/braking | Smooth, actuator-achievable profiles |
| Lane-change preparation/duration | Late or overly long lane changes | Match speed/ODD |
| Static-obstacle margins | Scraping or excessive detours | Include localization/perception error |
| Dynamic-object time gaps | Tailgating or needless braking | Match ODD safety target |
| Stop-line margin | Stops too early/late | Include front overhang + localization |
| Crosswalk/intersection thresholds | False stopping / unsafe entry | Scenario tests |
| Planner horizon | Myopic path or excess compute | Enough for braking/maneuvering |
| Curvature/smoothing weight | Wavy or corner-cutting path | Trackable, road-contained geometry |
| Velocity limits | Controller saturation | Stay inside validated envelope |

Tune these only after map, localization and vehicle dimensions are trustworthy;
otherwise a "planning parameter" hides an upstream calibration error.

### 13.10 Diffusion Planner

`autoware_diffusion_planner` is a learned (diffusion-based) trajectory generator
using **ONNX Runtime** (build flag `AUTOWARE_DIFFUSION_PLANNER_USE_ONNXRUNTIME`).
It considers static/dynamic obstacles, vehicle kinematics, user constraints,
Lanelet2 context, traffic signals and speed limits, and runs as a ROS 2 component.
Select it in the planning simulator:

```bash
ros2 launch autoware_launch planning_simulator.launch.xml \
  map_path:=/path/to/map vehicle_model:=sample_vehicle \
  sensor_model:=sample_sensor_kit planning_setting:=diffusion_planner
```

It swaps the trajectory generator and related validation/diagnostic connections.
Its presence does **not** mean Autoware 1.9 is end-to-end neural — it is one
trajectory-generation choice alongside the rule-based modular stack.

---

## 14. Control — How Controlling Really Works

Source: `autoware_universe/control/` (21 packages).

### 14.1 Architecture

| Layer | Node | In | Out |
|---|---|---|---|
| Trajectory follower | `autoware_trajectory_follower_node` (`"controller"`) | `Trajectory`, `Odometry`, `SteeringReport`, `AccelWithCovarianceStamped`, operation mode | `autoware_control_msgs/Control` on `~/output/control_cmd` |
| Command gate | `autoware_vehicle_cmd_gate` (or `control_command_gate`) | auto/external/emergency `Control`, steering, MRM state | `/control/command/control_cmd` (+ gear/turn/hazard) |
| Vehicle | vehicle interface (converter + CAN, or custom bridge) | `/control/command/*` | CAN, `/vehicle/status/*` |

### 14.2 Main controller I/O

| Direction | Topic | Type |
|---|---|---|
| in | `~/input/reference_trajectory` | `autoware_planning_msgs/Trajectory` |
| in | `~/input/current_odometry` | `nav_msgs/Odometry` |
| in | `~/input/current_steering` | `autoware_vehicle_msgs/SteeringReport` |
| in | `~/input/current_accel` | `geometry_msgs/AccelWithCovarianceStamped` |
| in | `~/input/current_operation_mode` | `autoware_adapi_v1_msgs/OperationModeState` |
| in | `~/input/steering_offset_update` | `Float32Stamped` |
| out | `~/output/control_cmd` | `autoware_control_msgs/Control` |

### 14.3 Trajectory → actuation (decoupled)

| Axis | Controller | Logic | Output fields |
|---|---|---|---|
| Lateral (steering) | `autoware_mpc_lateral_controller` **or** `autoware_pure_pursuit` | MPC: linear MPC, bicycle model (1st-order steering delay default), OSQP/QP; minimizes lateral + heading error + steering + jerk; Butterworth filter; freeze when stopped. Pure Pursuit: geometric | `steering_tire_angle`, `steering_tire_rotation_rate` |
| Longitudinal (speed) | `autoware_pid_longitudinal_controller` | Feed-forward (trajectory accel + slope) + PID; ~0.17 s actuator-delay compensation; smooth-stop; brake-keep; states DRIVE/STOPPING/STOPPED/EMERGENCY (emergency `accel=-5.0`, `jerk=-3.0`) | `velocity`, `acceleration`, `jerk` |

Controllers **cross-sync**: longitudinal holds the stop until steering converges
(`enable_keep_stopped_until_steer_convergence`); lateral holds steering when
stopped. The merged `Control` publishes only if both outputs are fresh
(`isTimeOut()`); a stalled trajectory stream > `cyclic_message_timeout_thr_sec`
(default `0.9`) raises a diagnostic.

> **Vehicles that cannot reach the expected steering, and bike/tricycle
> kinematics, are covered in the dedicated code review in §27.**
>
> **A complete inventory of every controller/algorithm in the stack, and where to
> swap one for a research replacement, is in §28.**

### 14.4 Control tuning sequence

| Stage | Measure first | Tune |
|---|---|---|
| Geometry | Wheelbase, steering limit | Vehicle model |
| Steering static | Steering request → tire angle | VGR/map |
| Steering dynamics | Delay, rate, time constant | MPC steering-delay model |
| Longitudinal static | Drive/brake request → accel by speed | Feed-forward maps |
| Longitudinal dynamics | Propulsion/brake delay | Delay compensation |
| Low-speed tracking | Lateral and heading error | MPC/Pure Pursuit |
| Velocity tracking | Speed/accel error | Longitudinal gains |
| Stops | Stopping distance/overshoot | Smooth-stop/brake-keep |
| Higher curvature | Tracking and steering saturation | MPC weights/rates |
| Combined maneuvers | Lateral-longitudinal interaction | Final limits |

**Do not begin by changing MPC weights. First make the physical model truthful.**

Test plan: straight (2→5 m/s→stop), large-radius circle (2 m/s), sine/offset lane,
90° corner with increasing speed, stop-line at several speeds, reverse/parking only
after forward is stable. Log: lateral/heading/velocity error, stop position error,
steering command vs feedback delay, steering saturation %, accel/decel, jerk,
trajectory age, controller execution time.

**Enduring integration question:** can your DBW steering actuator turn the wheels
while **velocity is zero**? Autoware's stop/steering-convergence logic depends on
this; mismatches cause "vehicle won't start" or deadlock-like states.

### 14.5 `Control` message

| Message | Fields |
|---|---|
| `autoware_control_msgs/Control` | `stamp`, `control_time`, `Lateral lateral`, `Longitudinal longitudinal` |
| `Lateral` | `steering_tire_angle` [rad, +left/−right], `steering_tire_rotation_rate`, `is_defined_steering_tire_rotation_rate` |
| `Longitudinal` | `velocity`, `acceleration`, `jerk`, `is_defined_acceleration`, `is_defined_jerk` |
| `autoware_vehicle_msgs/SteeringReport` | `stamp`, `steering_tire_angle` (+left/−right) |

### 14.6 Command gate & fail-closed safety

`vehicle_cmd_gate` selects one of three sources by `GateMode` + emergency state —
`auto` (trajectory follower), `external` (remote), `emergency` (MRM) — then applies
a final limit filter.

| Safety mechanism | Trigger | Action |
|---|---|---|
| System emergency heartbeat | `/system/fail_safe/mrm_state` timeout | Hard emergency stop |
| External emergency heartbeat | `/external/selected/heartbeat` timeout | Emergency stop (clear via service only) |
| MRM state | `MrmState::EMERGENCY_STOP` | Force emergency command |
| Engage gating | Not engaged | Force stop (`stop_hold_acceleration_`) |
| Moderate stop / ADAPI pause | Requested | Force velocity 0 / stop |
| Command limit filter | Always | Clamp steering rate/angle, accel, jerk, speed |

Key `vehicle_cmd_gate` parameters (grounded in `config/vehicle_cmd_gate.param.yaml`):

| Parameter | Meaning (example value) |
|---|---|
| `use_emergency_handling` | Enable emergency handling |
| `system_emergency_heartbeat_timeout` | System heartbeat timeout before stop (`0.5` s) |
| `external_emergency_stop_heartbeat_timeout` | External heartbeat timeout |
| `stop_hold_acceleration` | Accel held when stopping (`-1.5`) |
| `emergency_acceleration` | Decel used for MRM emergency stop (`-2.4`) |
| `moderate_stop_service_acceleration` | Moderate-stop accel (`-1.5`) |
| `stop_check_duration` | Stop-state confirmation time (`1.0` s) |
| `vel_lim` | Max absolute speed during autonomy |
| `lon_acc_lim_for_lon_vel` / `lon_jerk_lim_for_lon_acc` | Longitudinal accel/jerk limit tables |
| `lat_acc_lim_for_steer_cmd` / `lat_jerk_lim_for_steer_cmd` | Lateral accel/jerk limits on steering command |
| `lat_jerk_lim_for_steer_rate` | Steering-rate jerk limit |

`control_command_gate` (newer) subscribes multiple named sources (`stop`, `main`,
`local`, `remote`, `emergency_stop`), applies a nominal filter, and falls back to a
built-in `stop` on source timeout.

Dedicated monitors: `autoware_autonomous_emergency_braking`, `collision_detector`,
`obstacle_collision_checker`, `spheric_collision_detector`,
`lane_departure_checker`, `predicted_path_checker`, `control_validator`,
`operation_mode_transition_manager`, `shift_decider`, `joy_controller`.

**Philosophy: fail-closed** — on any lost heartbeat/command/unsafe condition the
gate emits a stop, never a stale pass-through. **The ROS command gate must not be
the sole safety authority** (see §15, §21).

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

## 16. System (Orchestration, Health, MRM)

Source: `autoware_universe/system/` (21 packages); launched under `/system`.

| Group | Packages | Role |
|---|---|---|
| MRM | `autoware_mrm_handler`, `mrm_comfortable_stop_operator`, `mrm_emergency_stop_operator` (+ universe wrappers) | On failure, drive a minimal-risk maneuver |
| Command mode | `autoware_command_mode_decider`, `autoware_command_mode_switcher` (+ plugins/types) | Decide/activate command mode vs MRM (active only when `use_control_command_gate=true`) |
| Monitors | `system_monitor`, `component_monitor`, `component_state_monitor`, `topic_state_monitor`, `pipeline_latency_monitor`, `processing_time_checker`, `duplicated_node_checker`, `bluetooth_monitor`, `velodyne_monitor`, `hazard_status_converter` | Resource/liveness/latency/stale-topic health |
| API/diag | `default_adapi_helpers`, `default_adapi_universe`, `diagnostic_graph_aggregator`, `diagnostic_graph_utils`, `dummy_diag_publisher`, `dummy_infrastructure`, `topic_relay_controller` | Diagnostics aggregation, AD API |

| Node | In | Out |
|---|---|---|
| `mrm_handler` | `/localization/kinematic_state`, operation-mode availability, `/vehicle/status/control_mode`, `/system/mrm/*/status`, `/api/operation_mode/state` | `/system/emergency/{gear,turn,hazard}`, `/system/fail_safe/mrm_state`; calls `/system/mrm/*/operate` |
| `topic_state_monitor` | any topic | `/diagnostics` |
| `pipeline_latency_monitor` | per-step `Float64Stamped` latencies | `~/output/total_latency_ms`, `/diagnostics` (ERROR > threshold) |
| `diagnostic_graph_aggregator` | `/diagnostics` | `/diagnostics_graph/status` → drives **modes** (e.g. `/autoware/modes/autonomous`) |

| MRM behavior | Meaning |
|---|---|
| Comfortable stop | Gradual deceleration to a safe stop |
| Emergency stop | Maximum secure stop |
| Pull over | (where configured) |

**State representation:** the legacy `autoware_state` topic is **not present** (no
`autoware_state_monitor`); state is expressed via operation-mode topics/services
and the diagnostic-graph "modes".

**Define failure-specific MRMs.** Recent research flags an open issue where an
emergency-stop path freezes the lateral steering request while decelerating, which
can cause lane departure on a curve. A real vehicle team should define distinct
responses for "planner failed," "controller failed," "compute failed," and
"vehicle-interface failed," rather than one generic emergency stop.

---

## 17. `external/` Vendor Packages

Source: `autoware/src/universe/external/`.

| Package | Vendors / wraps | Role in Autoware |
|---|---|---|
| `eagleye` | MapIV Eagleye | GNSS + IMU localization using GNSS Doppler; alternative localizer (`eagleye_rt/core/msgs/util`) |
| `rtklib_ros_bridge` | RTKLIB (MapIV fork) | RTK GNSS lat/lon, altitude, ECEF, velocity, GPS time (`rtklib_bridge`, `rtklib_msgs`) |
| `llh_converter` | Geoid EGM2008/GSIGEO2011 | lat/lon/height + ellipsoid ↔ orthometric; meridian convergence (GNSS) |
| `muSSP` | MU-SSP (min-cost flow) | Exact MCF data association for MOT; used by `multi_object_tracker` |
| `pointcloud_to_laserscan` | ROS `pointcloud_to_laserscan` | 3D `PointCloud2` → 2D `LaserScan` |
| `managed_transform_buffer` | TF buffer wrapper | Singleton TF buffer/listener; better perf with many listeners/containers |
| `cuda_blackboard` | REP-2007/REP-2009 | GPU zero-copy data sharing for CUDA perception |
| `bevdet_vendor` | BEVDet TensorRT | Vendored BEVDet inference (camera BEV 3D detection) |
| `negotiated` | REP-2009 | Negotiated publishers/subscriptions (type & metadata preferences) |
| `morai_msgs` | MORAI simulator | Messages for the MORAI simulator |
| `glog` | Google glog | Vendored logging library |
| `tier4_autoware_msgs` | Tier IV legacy | Legacy `tier4_*_msgs` metapackage + `tier4_auto_msgs_converter` |

Grouping:

| Category | Packages |
|---|---|
| GNSS/INS positioning | `eagleye`, `rtklib_ros_bridge`, `llh_converter` |
| Perception / tracking | `bevdet_vendor`, `cuda_blackboard`, `muSSP`, `pointcloud_to_laserscan` |
| Simulation | `morai_msgs`, `negotiated` |
| Infrastructure | `glog`, `managed_transform_buffer`, `cuda_blackboard` |
| Message definitions | `tier4_autoware_msgs` |

Several have no top-level `package.xml` — they are repositories/metapackages.

---

## 18. Evaluator / Simulator / Visualization

### 18.1 Evaluator (`autoware_universe/evaluator/`)

Pattern: live topic + reference/ground-truth → error metrics → `~/metrics`
(`MetricArray`/`DiagnosticArray`) / `/diagnostics`; often JSON at shutdown.

| Package | Measures | Reference |
|---|---|---|
| `autoware_localization_evaluator` | Lateral / absolute position error | `~/input/localization/ref` (`PoseWithCovarianceStamped` GT) |
| `autoware_planning_evaluator` | Trajectory shape/deviation/stability, obstacle safety (TTC/PET/DRAC), planning factors, blinker/steering counts | `~/input/reference_trajectory` |
| `autoware_control_evaluator` | Lateral/yaw/velocity deviation, lane-center deviation, goal deviation, steering/accel/jerk, closest-object | planned trajectory + route goal |
| `autoware_perception_online_evaluator` | Predicted-path deviation (ADE), yaw/lateral deviation, object counts (no annotations) | object's own past trajectory |
| `autoware_kinematic_evaluator` | Ego velocity min/max/mean | none (ego only) |
| `autoware_scenario_simulator_v2_adapter` | Metrics + `/diagnostics` → `UserDefinedValue` for scenario_simulator_v2 | n/a |
| `autoware_evaluation_adapter` | Legacy external eval interfaces (**deprecated**) | n/a |

### 18.2 Simulator (`autoware_universe/simulator/`)

| Package | Role |
|---|---|
| `autoware_carla_interface` | ROS 2 ↔ CARLA bridge (used by `e2e_simulator.launch.xml` with `simulator_type=carla`) |
| `autoware_dummy_traffic_light_publisher` | Generate/relay dummy traffic signals (`standalone`/`empty`/`fixed`) |
| `autoware_fault_injection` | Convert simulated faults (PSim) into `/diagnostics` |
| `autoware_vehicle_door_simulator` | Simulate vehicle device ops (doors) for testing |
| `tier4_dummy_object_rviz_plugin` | RViz tool to spawn dummy cars/peds/obstacles |

> AWSIM publishes Autoware messages directly (no bridge); CARLA needs
> `autoware_carla_interface`.

### 18.3 Visualization (`autoware_universe/visualization/`)

All are RViz2 panels/tools.

| Plugin | Visualizes / does |
|---|---|
| `tier4_control_mode_rviz_plugin` | Control mode panel, from `/vehicle/status/control_mode` |
| `tier4_perception_rviz_plugin` | `DetectedObjectsWithFeature` |
| `tier4_planning_factor_rviz_plugin` | STOP/SLOW_DOWN walls from `PlanningFactorArray` |
| `tier4_traffic_light_rviz_plugin` | Publishes dummy traffic signals |
| `autoware_traffic_light_rviz_plugin` | Traffic-light recognition vs Lanelet map |
| `tier4_vehicle_rviz_plugin` | Speed, turn signal, steering, acceleration meters |
| `tier4_state_rviz_plugin` | Autoware state + engage controls |
| `tier4_adapi_rviz_plugin` | AD API route/waypoint setting (RoutePanel) |
| `tier4_camera_view_rviz_plugin` | Third-person / bird-eye camera views |
| `tier4_datetime_rviz_plugin` | ROS time vs wall time |
| `tier4_manual_lane_change_rviz_plugin` | Left/Auto/Right lane-change buttons (`SetPreferredLane`) |
| `autoware_bag_time_manager_rviz_plugin` | Bag clock pause/resume/rate control |

---

## 19. Launch, Lifecycle & QoS

### 19.1 Bring-up

`autoware.launch.xml` composes the stack from `components/*.launch.xml` (map,
sensing, localization, perception, planning, control, vehicle, system); the four
entry-point launches wrap it (§4).

### 19.2 Component containers (composable nodes)

Most nodes run as **composable nodes inside named component containers**
(`pointcloud_container`, `nebula_node_container`, `velodyne_node_container`,
`traffic_light_node_container`). Containers select `component_container` or
`component_container_mt`. Nodes register via `rclcpp_components_register_node`
(wrapped by `autoware_agnocast_wrapper_register_node`).

| Aspect | Fact |
|---|---|
| Composition | Heavy use of `ComposableNodeContainer` |
| Registration | `rclcpp_components_register_node` / `autoware_agnocast_wrapper_register_node` |
| Zero-copy | **agnocast** shared-memory transport via `LD_PRELOAD` (gated by `use_agnocast`) |
| Intra-process caveat | Disabled where **TRANSIENT_LOCAL** is required (e.g. vector-map filter) |

### 19.3 Lifecycle nodes

| Scope | Lifecycle? |
|---|---|
| Core algorithmic nodes (NDT, EKF, planners, controllers, detectors) | **No** — plain `rclcpp::Node` components |
| Sensor/transport drivers (`ros2_socketcan`, `udp_driver`, `serial_driver`) | **Yes** |
| Custom vehicle bridges / teleop | **Yes** |
| Simulator (`openscenario_interpreter`) | **Yes** |

### 19.4 QoS profiles

QoS from per-message specs (`autoware_component_interface_specs`) via `get_qos()`.

| Topic family | Reliability | Durability | Why |
|---|---|---|---|
| `/system/operation_mode/state` | RELIABLE | **TRANSIENT_LOCAL** | Late joiners must know current mode |
| `/planning/route`, `/planning/route_state` | RELIABLE | **TRANSIENT_LOCAL** | Late joiners must receive current route |
| `/map/map_projector_info`, `/map/point_cloud_map`, `/map/vector_map` | RELIABLE | **TRANSIENT_LOCAL** | Static reference data for late joiners |
| `/localization/initialization_state` | RELIABLE | **TRANSIENT_LOCAL** | Init state for late joiners |
| `/control/command/control_cmd` | RELIABLE | **VOLATILE** | Only latest command; never replay stale |
| `/planning/trajectory`, gear/steering, perception outputs | RELIABLE | **VOLATILE** | High-rate; freshness over replay |
| `/localization/kinematic_state`, `/localization/acceleration` | RELIABLE | **VOLATILE** | High-rate |
| Raw pointclouds/images | **BEST_EFFORT** (`SensorDataQoS`) | VOLATILE | Freshness beats reliability |

> The **low-level control command is RELIABLE + VOLATILE**, not TRANSIENT_LOCAL.
> TRANSIENT_LOCAL is for *state/map/route*.

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

## 23. Canonical Topic Cheat-Sheet

### Sensing / Map

| Topic | Type | Producer → Consumer |
|---|---|---|
| `/sensing/lidar/<site>/pointcloud_raw_ex` | `PointCloud2` | Nebula driver → preprocessor |
| `/sensing/lidar/concatenated/pointcloud` | `PointCloud2` | preprocessor → localization, perception |
| `/sensing/imu/imu_data` | `sensor_msgs/Imu` | imu_corrector → localization, distortion corrector |
| `/sensing/camera/<cam>/image_rect_color` | `sensor_msgs/Image` | camera → perception / YabLoc |
| `/sensing/vehicle_velocity_converter/twist_with_covariance` | `TwistWithCovarianceStamped` | velocity converter → distortion corrector |
| `/map/pointcloud_map` | `PointCloud2` | map loader → localization (NDT) |
| `/map/vector_map` | `LaneletMapBin` | map loader → planning, perception |
| `/map/map_projector_info` | `MapProjectorInfo` | map loader → gnss_poser, geo_pose_projector |

### Localization

| Topic | Type | Producer → Consumer |
|---|---|---|
| `/sensing/gnss/pose_with_covariance` | `PoseWithCovarianceStamped` | gnss_poser → NDT regularization |
| `/localization/pose_estimator/pose_with_covariance` | `PoseWithCovarianceStamped` | NDT → EKF |
| `/localization/pose_twist_fusion_filter/biased_pose_with_covariance` | `PoseWithCovarianceStamped` | EKF → NDT (initial guess) |
| `/localization/kinematic_state` | `nav_msgs/Odometry` | EKF → planning, control, tracker, system |
| `/localization/pose`, `/localization/twist` | `PoseStamped` / `Twist` | localization → consumers |

### Perception

| Topic | Type | Producer → Consumer |
|---|---|---|
| `/perception/object_recognition/detection/objects` | `DetectedObjects` | detectors/fusion → merger/tracker |
| `/perception/object_recognition/tracking/objects` | `TrackedObjects` | tracker → prediction |
| `/perception/object_recognition/prediction/objects` | `PredictedObjects` | prediction → planning |
| `/perception/occupancy_grid_map/occupancy_grid_map` | `nav_msgs/OccupancyGrid` | OGM → costmap/planning |
| `/perception/traffic_light_recognition/traffic_signals` | `TrafficLightGroupArray` | TL fusion/arbiter → planning, prediction |

### Planning / Control / Vehicle / System

| Topic | Type | Producer → Consumer |
|---|---|---|
| `/planning/mission_planning/route` | `LaneletRoute` | mission_planner → scenario_selector, behavior |
| `/planning/scenario_planning/trajectory` | `autoware_planning_msgs/Trajectory` | planning_validator → control |
| `/control/trajectory_follower/control_cmd` | `autoware_control_msgs/Control` | controller → vehicle_cmd_gate |
| `/control/command/control_cmd` | `autoware_control_msgs/Control` | gate → vehicle interface |
| `/vehicle/status/steering_status` | `SteeringReport` | vehicle → control (feedback) |
| `/vehicle/status/velocity_status` | `VelocityReport` | vehicle → sensing (velocity converter) |
| `/vehicle/status/control_mode` | `ControlModeReport` | vehicle → system/MRM |
| `/system/fail_safe/mrm_state` | `MrmState` | mrm_handler → vehicle_cmd_gate |
| `/diagnostics_graph/status` | diagnostic graph | aggregator → modes / AD API |
| `/api/operation_mode/state` | `OperationModeState` | operation mode → whole stack |

---

## 24. Summary — From Simulation to the Real Vehicle

The single biggest difference between simulation and real-vehicle deployment is
**not the planner**. It is the engineering around it: deterministic sensor
timestamps; calibrated sensor-to-vehicle transforms; a physically correct vehicle
model; trustworthy steering/velocity/gear feedback; a DBW bridge with watchdogs
and independently testable limits; correct maps; command-latency characterization;
and a safety architecture that prevents a bad ROS command from becoming
uncontrolled physical motion.

The full loop:

1. **Localize** in the HD map (NDT scan match vs PCD, fused by EKF with
   GNSS/IMU/twist), output `Odometry` + pose + steering feedback.
2. **Perceive** dynamic objects (Detected→Tracked→Predicted) + occupancy + traffic
   lights, anchored to the map.
3. **Plan** a Lanelet route, a behavior `PathWithLaneId`, and a velocity-profiled
   `Trajectory`; validate it.
4. **Control** tracks the `Trajectory` (lateral MPC/Pure Pursuit + longitudinal
   PID/jerk-limited), cross-syncing them, and emits `Control`.
5. **Gate** the `Control` (auto/external/emergency), clamp limits, **fail-closed**.
6. **Actuate** via the vehicle interface → CAN → wheels/steer/brake; status loops back.
7. **System** watches latency, liveness, diagnostics and triggers MRM on fault.

Defining characteristics vs a normal ROS 2 stack: **Ackermann `Control` messages
instead of `Twist`**, a **mandatory HD map** (PCD + Lanelet2) that must be created
with **external mapping tools** (Universe has no mapping feature), **LiDAR NDT +
EKF localization (not AMCL)**, a **dense planned `Trajectory`**, and an **end-to-end
fail-closed safety/MRM architecture**.

**Recommended migration strategy:** freeze one known-good release; build a narrow
vehicle-specific hardware abstraction; put independent safety enforcement beneath
ROS; automate map and calibration validation; maintain a replayable bag/HIL
regression suite; and promote updates only when they pass the same acceptance tests
as the previous vehicle release. Bring up the vehicle on the **rule-based** stack
first; treat Diffusion Planner, Agnocast and Index packages as second-stage
optimizations.

---

## 25. Primary Sources

| Priority | Source | Link |
|---|---|---|
| Highest | Autoware top-level repository | https://github.com/autowarefoundation/autoware |
| Highest | Autoware releases | https://github.com/autowarefoundation/autoware/releases |
| Highest | Autoware Universe source | https://github.com/autowarefoundation/autoware_universe |
| Highest | Autoware official documentation | https://autowarefoundation.github.io/ |
| Highest | Source installation instructions | https://github.com/autowarefoundation/autoware-documentation/blob/main/docs/installation/autoware/source-installation.md |
| High | Vehicle Interface design | https://autowarefoundation.github.io/autoware-documentation/latest/design/autoware-architecture/vehicle/ |
| High | Nebula sensor drivers | https://github.com/tier4/nebula |
| High | TIER IV CalibrationTools | https://github.com/tier4/CalibrationTools |
| High | ROS 2 SocketCAN | https://github.com/autowarefoundation/ros2_socketcan |
| High | Raw Vehicle Command Converter | https://autowarefoundation.github.io/autoware_universe/main/vehicle/autoware_raw_vehicle_cmd_converter/ |
| High | Control Command Gate | https://autowarefoundation.github.io/autoware_universe/main/control/autoware_control_command_gate/ |
| High | MPC Lateral Controller | https://autowarefoundation.github.io/autoware_universe/main/control/autoware_mpc_lateral_controller/ |
| High | Behavior Path Planner | https://autowarefoundation.github.io/autoware_universe/main/planning/behavior_path_planner/autoware_behavior_path_planner/ |
| High | Lanelet2 map validator | https://github.com/tier4/autoware_lanelet2_map_validator |
| High | Autoware Index architecture issue | https://github.com/autowarefoundation/autoware/issues/7090 |
| Community | Autoware Foundation Discussions | https://github.com/orgs/autowarefoundation/discussions |
| Community | ROS Discourse Autoware | https://discourse.ros.org/c/autoware/46 |

Algorithmic background: Biber & Straßer, "The Normal Distributions Transform: A
New Approach to Laser Scan Matching" (IROS 2003), and Kato et al. on Autoware's
software architecture. **Current GitHub source, release pins, issues and PRs
remain the implementation authority**, since interfaces/package boundaries change
faster than publications.

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

## 27. Steering Limits & Non-Car Kinematics — Code Review

This section answers a common real-vehicle failure: **what happens when the
vehicle cannot achieve the steering angle Autoware expects, and what to change.**
It also covers bikes, tricycles and other non-car platforms. All claims cite the
actual code.

### 27.1 The steering contract: `max_steer_angle`

Autoware treats `max_steer_angle` as the maximum achievable **road-wheel (tire)
angle in radians** — *not* the steering-wheel range.

| Fact | Code |
|---|---|
| Loaded from params | `autoware_vehicle_info_utils/src/vehicle_info_utils.cpp:44` (`MAX_STEER_ANGLE`) |
| Stored on `VehicleInfo` | `vehicle_info.hpp:41` (`max_steer_angle_rad`) |
| Near-zero guard | `vehicle_info.cpp:102-107` clamps `≈0` to `1e-6` rad |
| Max curvature | `vehicle_info.cpp:164-168` → `1/(wheel_base / tan(max_steer_angle))` |
| Steer ↔ curvature | `vehicle_info.cpp:170-184` (`tan(δ)/L`), `:186` (`atan(curvature·L)`) |
| Min turning radius | `autoware_vehicle_info_utils/scripts/min_turning_radius_calculator.py` → `rear = L/tan(δ)`, `front = L/sin(δ)` |

**Never leave `max_steer_angle` at ~0.** The guard clamps it to `1e-6` rad, which
makes `calcMaxCurvature()` effectively zero — the planner then believes the
vehicle *cannot turn at all*, producing unusable paths.

### 27.2 The steering data path (code review)

| Layer | File:line | Behaviour |
|---|---|---|
| Vehicle info | `vehicle_info_utils.cpp:44`, `vehicle_info.hpp:41` | Source of `max_steer_angle_rad` |
| MPC lateral controller | `mpc_lateral_controller.cpp:75-78` (`m_steer_lim = max_steer_angle_rad`), `:103,182` (`KinematicsBicycleModel(wheelbase, steer_lim, steer_tau)`), `:63` (`vehicle_model_steer_tau`) | Bounds steering in the optimizer/model |
| MPC convergence | `mpc_lateral_controller.cpp:322-323` (`is_steer_converged = is_mpc_solved && isMpcConverged() && isSteerConverged(cmd)`), `:348-361` (`\|cmd.steer − actual.steer\| < converged_steer_rad`), `:446-447` (`keep_steer_control_until_converged`) | **Compares commanded vs actual tire angle** |
| Pure Pursuit | `autoware_pure_pursuit_lateral_controller.cpp:72` (`param_.max_steering_angle = max_steer_angle_rad`), `:406` (`std::clamp`) | Hard clamp of steering |
| Longitudinal dry-steer hold | `pid_longitudinal_controller.cpp:61-62`, `:747-766` | Holds the vehicle **stopped** until `is_steer_converged` |
| Cross-sync | `controller_node.cpp:266-268`, `sync_data.hpp` (`LateralSyncData::is_steer_converged`), `longitudinal_controller_base.cpp:19-25` | Lateral result fed to longitudinal controller |
| Steering offset | `autoware_steer_offset_estimator` (`wz = (v/L)·(steer + offset)`), applied via `controller_node.cpp:108-112` | Corrects steady steering bias |
| Command-gate filter | `control_command_filter.cpp:131-151` (`steer_lim = atan(lat_acc_lim·L/v²)`), `:236-275` (`max_steer_rate_from_jerk = lat_jerk·L/v²`, clamps rate **and** delta) | Speed-dependent steering/accel/rate bounds |
| Command-gate params | `vehicle_cmd_gate.param.yaml`: `lat_acc_lim_for_steer_cmd`, `lat_jerk_lim_for_steer_cmd`, `lat_jerk_lim_for_steer_rate` | Tunable limits |
| Type-B converter | `autoware_raw_vehicle_cmd_converter/config/raw_vehicle_cmd_converter.param.yaml`: `max_steer`/`min_steer`, `convert_steer_cmd_method: "vgr"`, `vgr_coef_*`, `steer_pid` | Maps tire angle → actuator |
| Validator | `autoware_control_validator/src/control_validator.cpp:102-124`, `:575`; `lateral_jerk: 10.0` | Flags excessive steering rate / lateral jerk |
| Bridge (E-Trike) | `autoware_vehicle_bridge/include/autoware_vehicle_bridge/motion_conversion.hpp:34-37` (clamp + **sign inversion**), `:46-54` (yaw ±3000 mrad/s), `:61-65` (feedback); `src/vehicle_bridge_node.cpp:114,133-135` (throws if `max_steering_angle <= 0`) | Final clamp at the ECU boundary |
| Planner use | `autoware_boundary_departure_checker` (steering footprints), `autoware_freespace_planning_algorithms` (`collision_vehicle_shape_.max_steering`) | Affects path feasibility/search resolution |
| Simulator | `simulator_model.param.yaml`: `steer_lim`, `steer_rate_lim`, `steer_time_constant`, `steer_time_delay`, `steer_dead_band` | Must mirror the real actuator |

Default convergence/limit parameters (stock):

| Param | Default | File |
|---|---|---|
| `converged_steer_rad` | `0.1` | `.../lateral/mpc.param.yaml:74` (also `pure_pursuit.param.yaml`) |
| `keep_steer_control_until_converged` | `true` | `.../lateral/mpc.param.yaml:75` |
| `vehicle_model_steer_tau` | `0.27` s | `.../lateral/mpc.param.yaml:61` |
| `enable_keep_stopped_until_steer_convergence` | `true` | `autoware_pid_longitudinal_controller.param.yaml` |
| `lateral_jerk` (validator) | `10.0` m/s³ | `control_validator.param.yaml` |

### 27.3 What happens if the vehicle can't achieve the expected steering

| Failure | Mechanism (code) | Symptom |
|---|---|---|
| **Limit configured higher than physically achievable** | `isSteerConverged` compares `cmd` vs actual with `converged_steer_rad` (`mpc_lateral_controller.cpp:357-359`); actual can never match | `is_steer_converged` stays false → `keep_steer_control_until_converged` holds steering, and PID holds the vehicle stopped → **vehicle stalls / won't start** |
| **Steering actuator too slow** | Command gate allows rate up to `lat_jerk·L/v²` (`control_command_filter.cpp:236-275`), faster than the actuator | Growing lateral error, oscillation; `control_validator` flags high lateral jerk |
| **Cannot steer at standstill** | PID dry-steer hold (`pid_longitudinal_controller.cpp:747-766`) requires convergence before moving | Deadlock-like state: vehicle stays stopped because steering never converges without motion |
| **Steering offset/bias not corrected** | `isSteerConverged` uses measured steering, which includes bias | Never reports converged, or veers consistently |
| **`wheel_base`/`max_steer_angle` wrong** | Both MPC model and the command-gate formulas scale with `L` (`control_command_filter.cpp:140,252`) | Wrong curvature, wrong min turning radius, infeasible paths |
| **Limit configured lower than achievable** | Planners use `calcMaxCurvature()` | Wide, under-utilized turns; cannot follow tight map lanes |
| **Sign error** | Bridge must invert Universe-left+ to ECU sign | Steering drives the wrong way |
| **Zero/absurd `max_steer_angle`** | `vehicle_info.cpp:102-107` clamps to `1e-6` | Planner believes the vehicle cannot turn |

### 27.4 What to change (config first, code last)

| # | Change | Where |
|---|---|---|
| 1 | Measure the **actual tire-angle range** and set `max_steer_angle` to it | `<vehicle>_description/config/vehicle_info.param.yaml` |
| 2 | Verify `wheel_base` (front↔rear axle center) | same file |
| 3 | If standstill steering is impossible, disable the dry-steer hold | PID `enable_keep_stopped_until_steer_convergence: false` |
| 4 | If convergence is slow/noisy, raise `converged_steer_rad`, and/or set `keep_steer_control_until_converged: false` | `.../lateral/mpc.param.yaml` |
| 5 | Match the model steering time constant to the measured actuator | `vehicle_model_steer_tau` |
| 6 | Tighten speed-dependent steering bounds | command gate `lat_acc_lim_for_steer_cmd`, `lat_jerk_lim_for_steer_cmd`, `lat_jerk_lim_for_steer_rate`, `steer_rate_lim_for_steer_cmd` |
| 7 | Correct steady steering bias | enable/tune `autoware_steer_offset_estimator` (`steer_offset.param.yaml`) |
| 8 | For a nonlinear actuator, use the Type-B path | `raw_vehicle_cmd_converter`: `convert_steer_cmd: true`, `convert_steer_cmd_method: "vgr"`/`"steer_map"`, `vgr_coef_*` / `steer_map.csv`, `steer_pid` |
| 9 | Make the bridge clamp **equal** to `max_steer_angle` and implement sign/units | `autoware_vehicle_bridge` (`max_steering_angle`, `motion_conversion.hpp`) |
| 10 | Mirror the limit in sim and URDF | `simulator_model.param.yaml` `steer_lim`/`steer_rate_lim`; Xacro revolute joint limit |
| 11 | Ensure map lane widths fit the resulting **minimum turning radius** | Lanelet2 map (§10) |
| 12 | Only if necessary, lower the clamp further in the bridge — never bypass the controllers | bridge code |

> Principle: Autoware's default assumption is a car whose actuator can reach
> `max_steer_angle`. A limited-steering platform should be handled by **telling the
> stack the truth** (correct `max_steer_angle`, `wheel_base`, rate limits, offset)
> and by **relaxing the convergence gate** — not by hacking the controllers.

### 27.5 Non-car kinematics: bike, tricycle, others

| Platform | Does the bicycle model fit? | Key issue | Strategy |
|---|---|---|---|
| **Car (Ackermann, 4-wheel)** | Approximates two front wheels | Well supported | Set measured geometry; default |
| **Tricycle / "tric"** | **Exact** — single steered wheel | Roll/tip-over not modeled (Autoware is planar); standstill steering; narrow track | Bicycle model + rollover monitor (§27.6) + speed/lat-acc limits |
| **Bicycle (2-wheeler)** | Steering geometry fits, but **balance/lean is not modeled** | Low-speed instability; steering–lean coupling; needs active balance | Out of scope for stock Autoware; requires an external balance controller and a custom vehicle model |
| **Differential drive / skid-steer** | **Invalid** (can yaw in place; no wheel angle) | `Control` semantics (tire angle) don't map | Requires custom controller + interface, not a config change |

For a **bicycle or tricycle**, the most important architectural limits are:
`max_steer_angle` is a **tire** angle, `wheel_base` is measured **axle-to-axle**,
and any rollover/lean behaviour must be added externally because Autoware does not
model it.

### 27.6 Worked example — E-Trike (limited steering, low speed)

| Item | Value | Source |
|---|---|---|
| `max_steer_angle` | `0.747` rad (~42.8°) | `our_packages/etrike_vehicle_description/config/vehicle_info.param.yaml` |
| `wheel_base` | `2.000` m | same |
| `wheel_tread` (rear track) | `1.150` m | same |
| Bridge clamp | `max_steering_angle: 0.747`, `max_speed_forward: 3.0`, `max_speed_reverse: 0.5` | `autoware_vehicle_bridge/config/etrike.param.yaml` |
| Sign/unit conversion | left+ → right+, 0.1° wire, yaw clamp ±3000 mrad/s | `motion_conversion.hpp:34-54` |
| Min turning radius | rear ≈ **2.16 m**, front ≈ **2.94 m** | `wheel_base/tan δ`, `wheel_base/sin δ` |
| Sim model | `IDEAL_STEER_VEL`, `steer_lim: 0.747`, `steer_rate_lim: 1.5` | `etrike_vehicle_description/config/simulator_model.param.yaml` |
| Rollover guard | threshold `g·(track/2)/cog_height·margin`; monitor-only by default | `etrike_stability_guard/README.md` |

For a trike, the rollover threshold
`a_y = v²·tan(δ)/L` vs `g·(track_width/2)/cog_height·safety_margin`
is the practical limit on **speed × steering**, independent of Autoware's
planner — which is why the platform needs the external monitor.

### 27.7 Diagnosis checklist (steering)

| Check | How |
|---|---|
| Commanded vs actual tire angle | `ros2 topic echo /control/command/control_cmd` vs `/vehicle/status/steering_status` |
| Convergence state | Watch the `steer_converged` marker published by `controller_node.cpp:301-304` |
| Lateral jerk / rate | `control_validator` `/diagnostics` (`lateral_jerk: 10.0` threshold) |
| Limits consistent | Compare `max_steer_angle` (vehicle_info) == URDF joint limit == bridge `max_steering_angle` == sim `steer_lim` |
| Wheelbase correct | Recompute min turning radius and test against map lanes |
| Steering offset | Confirm `autoware_steer_offset_estimator` publishes `/control/trajectory_follower/steering_offset_update` |
| Vehicle won't start | Check PID dry-steer hold (`enable_keep_stopped_until_steer_convergence`) and MPC `keep_steer_control_until_converged` |
| Sign/units at boundary | Positive Autoware steering must turn road wheels left (bridge conversion) |

---

## 28. Controller & Algorithm Inventory — Types, Roles & Replacement Points

A complete map of the **algorithms, controllers, estimators and logics** in the
stack, what each is for, and **where to plug in a replacement** for research. Every
layer is separable; the extension mechanism differs per layer (pluginlib vs
hardcoded enum vs launch swap) and is called out.

### 28.1 Localization algorithms

| Algorithm / type | Package | Role |
|---|---|---|
| **NDT scan matching** (PDF + Newton) | `autoware_ndt_scan_matcher` (core) | LiDAR-to-map pose |
| **Extended Kalman Filter** (2-DoF motion model) | `autoware_ekf_localizer` (core) | Pose/twist fusion, yaw-bias, gating |
| **GNSS/INS projection** | `autoware_gnss_poser` (core) | Global pose / seed / regularization |
| **Particle filter** (vision + Lanelet2) | `yabloc_particle_filter` | Vision localization without PCD |
| **Monte-Carlo / TPE init** | `autoware_pose_initializer` (core) | Global initial pose search |
| **Landmark matching** (ArUco / reflector) | `autoware_ar_tag_based_localizer`, `autoware_lidar_marker_localizer` | Landmark-based pose |
| **GNSS/IMU Doppler** | `universe/external/eagleye` | Alternative localizer |
| **Gyro + wheel odometry** | `autoware_gyro_odometer` (core) | Twist source |
| **Rule-based arbiter** | `autoware_pose_estimator_arbiter` | Select/enable estimators |
| **Covariance modifier** | `autoware_pose_covariance_modifier` | GNSS+NDT blend |
| **Stop filter / pose2twist / twist2accel** | `autoware_stop_filter`, `autoware_pose2twist`, `autoware_twist2accel` | Output conditioning |

### 28.2 Perception algorithms

| Algorithm / type | Package | Role |
|---|---|---|
| LiDAR DNN detection (PointPillars→CenterPoint, TensorRT) | `autoware_lidar_centerpoint` | 3D objects |
| Other LiDAR detectors | `lidar_transfusion`, `lidar_frnet`, `lidar_ptv3`, `lidar_apollo_instance_segmentation`, `bevfusion` | Alternative detectors |
| Geometric clustering / shape | `euclidean_cluster`, `shape_estimation`, `ground_segmentation` | Non-DNN objects |
| Camera detectors | `tensorrt_yolox`, `tensorrt_bevdet`, `tensorrt_bevformer`, `camera_streampetr`, `bytetrack` | 2D/ROI/tracking |
| Camera-LiDAR fusion (5 modes) | `autoware_image_projection_based_fusion` | ROI/pointpainting fusion |
| Radar | `radar_object_tracker`, `radar_fusion_to_detected_object` | Doppler velocity |
| **Multi-object tracking: EKF + muSSP min-cost flow** | `autoware_multi_object_tracker` | Persistent IDs |
| Prediction (map/lanelet) | `autoware_map_based_prediction` | Future trajectories |
| Prediction (DNN) | `autoware_simpl_prediction` | Learned prediction |
| **Occupancy: binary Bayes filter** | `autoware_probabilistic_occupancy_grid_map` (updater) | Free-space grid |
| Traffic light (map ROI → CNN/HSV → fusion → arbiter) | `traffic_light_*` | Signal state |

### 28.3 Map & road-model algorithms

| Algorithm / type | Package | Role |
|---|---|---|
| Lanelet2 loader/projection | `autoware_map_loader`, `autoware_map_projection_loader` | PCD + vector map |
| **Centerline generation** | `lanelet2_map_loader` (`overwriteLaneletsCenterline`/waypoints) | Path geometry |
| Route handler graph | `autoware_route_handler` (core) | Lane connectivity queries |

### 28.4 Mission / path-finding algorithms

| Algorithm / type | Package | Role |
|---|---|---|
| **Lanelet graph route search** (pluginlib; graph traversal via `route_handler`) | `autoware_mission_planner_universe` (`lanelet2_plugins/default_planner.cpp`) | `LaneletRoute` |
| Centerline path generation | `autoware_path_generator` (core) | Simple alternative to behavior path |
| **Hybrid A\*** (kinematic bicycle, collision-checked) | `autoware_freespace_planning_algorithms/astar_search.hpp` | Parking / tight maneuvering |
| **RRT\*** (incl. informed RRT\*) | `autoware_freespace_planning_algorithms/rrtstar.hpp` | Sampling-based freespace |
| Reeds–Shepp curves | `autoware_freespace_planning_algorithms/reeds_shepp.hpp` | Path primitives |
| Kinematic bicycle model | `autoware_freespace_planning_algorithms/kinematic_bicycle_model.hpp` | Feasibility |

### 28.5 Behavior planning (Behavior Path Planner)

Scene modules, each a package with `manager` + `scene` integrated into the
**Planner Manager** (`planner_manager.cpp`) — not pluginlib:

| Module | Role |
|---|---|
| Lane following | Default centerline path |
| Static obstacle avoidance | Avoid stopped objects |
| Dynamic obstacle avoidance | Moving-object avoidance |
| Avoidance by lane change | Lane change to avoid |
| Lane change / external request lane change | Collision-checked lane change |
| Goal planner / start planner | Shoulder stop / merge |
| Side shift | External `LateralOffset` shift |
| Bidirectional traffic | Oncoming traffic |
| Direction change | Newer direction-change maneuvers |
| Sampling planner (Bézier sampler) | Sampling-based path |

### 28.6 Velocity / motion planning

| Algorithm / type | Package | Role |
|---|---|---|
| **Behavior velocity modules** (pluginlib; `PluginInterface`, `plugins.xml`) | `behavior_velocity_planner/*` | Traffic rules |
| — blind spot, crosswalk, detection area, intersection, no drivable lane, no stopping area, occlusion spot, roundabout, speed bump, traffic light, virtual traffic light, walkway | each `autoware_behavior_velocity_*_module` | Stop/slow constraints |
| **Motion velocity modules** (pluginlib; `plugins.xml`) | `motion_velocity_planner/*` | Dynamic constraints |
| — obstacle cruise (**optimization-based** or **PID-based**) | `autoware_motion_velocity_obstacle_cruise_module` (`optimization_based_planner.hpp`, `pid_based_planner.hpp`, `cruise_planner_interface.hpp`) | ACC following |
| — obstacle slow down / dynamic obstacle stop / run out / road user stop | `motion_velocity_*` | Slow/stop |
| — out of lane / boundary departure prevention | `motion_velocity_*` | Drivable-area safety |
| **Jerk/accel-limited velocity profile (OSQP)** | `autoware_velocity_smoother` (core) | Comfortable speed |

### 28.7 Trajectory generation, optimization & selection

| Algorithm / type | Package | Role |
|---|---|---|
| Kinematically-feasible path optimizer | `autoware_path_optimizer` | Path geometry, drivable area |
| Elastic-band path smoothing | `autoware_path_smoother` | Smoothing |
| **Generative planner** (learned, ONNX) | `autoware_diffusion_planner` | Candidate trajectories |
| Sampling planner | `sampling_based_planner` | Bézier candidates |
| **Trajectory optimizer plugins** (pluginlib) | `autoware_trajectory_optimizer` | EB smoother, Akima spline, QP smoother, MPT, temporal-MPT, kinematic-feasibility enforcer, extender, point fixer, velocity optimizer |
| **Trajectory validator plugins** (pluginlib; safety/traffic filters, shadow mode) | `autoware_trajectory_validator` | Feasibility verdicts |
| **Trajectory ranker metrics** (plugins) | `autoware_trajectory_ranker` | distance, lateral accel/deviation, longitudinal jerk, steering consistency, TTC |
| Concatenate / select / adapt | `autoware_trajectory_concatenator`, `..._selector`, `..._adapter` | Merge+pick best |
| **Trajectory modifier plugins** (pluginlib) | `autoware_trajectory_modifier` | obstacle stop, stop-point fixer, velocity modifier |
| Final planning gate | `autoware_planning_validator` | Publish / last-valid / soft-stop |

### 28.8 Control algorithms

| Axis | Algorithm / type | Package | Notes |
|---|---|---|---|
| Lateral | **Linear MPC** (bicycle model, QP/OSQP) | `autoware_mpc_lateral_controller` | Models: `kinematics`, `kinematics_no_delay`, `dynamics` (`createVehicleModel`, `vehicle_model_type`) |
| Lateral | **Pure Pursuit** (geometric) | `autoware_pure_pursuit` | Hard-clamped steering |
| Lateral | **Smart MPC** (MPC + learned model) | `autoware_smart_mpc_trajectory_follower` | Learned enhancement of MPC |
| Longitudinal | **PID + feed-forward** (slope, delay comp) | `autoware_pid_longitudinal_controller` | DRIVE/STOPPING/STOPPED/EMERGENCY |
| Both | Base interfaces | `autoware_trajectory_follower_base` (`LateralControllerBase`, `LongitudinalControllerBase`) | Cross-sync |
| Correction | **Steering offset estimation** | `autoware_steer_offset_estimator` | `wz = (v/L)(steer+offset)` |
| Gate | Command filter (lat acc/jerk/steer-rate) | `autoware_control_command_gate`, `autoware_vehicle_cmd_gate` | Safety clamps |
| Mode | Operation-mode transition, shift, external select, joystick | `autoware_operation_mode_transition_manager`, `autoware_shift_decider`, `autoware_external_cmd_selector`, `autoware_joy_controller` | State/authority |

> **Controller selection is a hardcoded enum + `switch`**, not pluginlib:
> `controller_node.hpp:126-132` (`LateralControllerMode`, `LongitudinalControllerMode`)
> and `controller_node.cpp:69-95`. Adding a new lateral/longitudinal controller is a
> **code change** (implement the base, add enum, add switch case, build).

### 28.9 Safety, stability & validation algorithms

| Algorithm / type | Package | Role |
|---|---|---|
| **Autonomous Emergency Braking** (RSS-like) | `autoware_autonomous_emergency_braking` | Collision avoidance |
| Collision detectors (polygon/sphere/obstacle) | `autoware_collision_detector`, `autoware_spheric_collision_detector`, `autoware_obstacle_collision_checker` | Collision checks |
| Lane-departure check (steering footprints) | `autoware_lane_departure_checker` | Boundary |
| Predicted-path check | `autoware_predicted_path_checker` | Future collision |
| Control validator (lateral jerk/acc/distance) | `autoware_control_validator` | Command sanity |
| Surround obstacle check | `autoware_surround_obstacle_checker` | Near-field |
| **Rollover/tip-over monitor** (geometric `a_y` threshold) | `etrike_stability_guard` (workspace) | Tricycle stability |
| MRM handler + operators | `autoware_mrm_handler`, `mrm_*_stop_operator` | Minimal-risk maneuver |

### 28.10 Simulation models

`vehicle_model_type` (`simulator_model.param.yaml`): `IDEAL_STEER_VEL`,
`IDEAL_STEER_ACC`, `IDEAL_STEER_ACC_GEARED`, `DELAY_STEER_VEL`, `DELAY_STEER_ACC`,
`DELAY_STEER_ACC_GEARED`, `DELAY_STEER_ACC_GEARED_WO_FALL_GUARD`,
`DELAY_STEER_MAP_ACC_GEARED` (accel map), `LEARNED_STEER_VEL`.

### 28.11 Where to add or replace an algorithm (extension points)

| You want to replace… | Mechanism | Effort |
|---|---|---|
| Lateral controller (e.g. classical MPC → NMPC/neural) | Implement `LateralControllerBase`; extend `LateralControllerMode` enum + switch in `controller_node.cpp` | **Code** |
| Longitudinal controller | Implement `LongitudinalControllerBase`; extend enum + switch | **Code** |
| MPC vehicle model | Implement `VehicleModelInterface`; add a `vehicle_model_type` branch (`mpc_lateral_controller.cpp:174-205`) | **Code** |
| Behavior path module | New package + `manager`/`scene`; wire into `planner_manager.cpp` | **Code** |
| Behavior velocity module | New pluginlib package (`PluginInterface`, `plugins.xml`), copy `autoware_behavior_velocity_template_module` | **Plugin** |
| Motion velocity module | New pluginlib package (`plugins.xml`) | **Plugin** |
| Trajectory optimizer step | New pluginlib against `trajectory_optimizer_plugin_base.hpp` | **Plugin** |
| Trajectory validator filter | New pluginlib `is_feasible()` filter | **Plugin** |
| Trajectory ranker metric | New metric plugin under `src/metrics/` | **Plugin** |
| Trajectory modifier | New pluginlib modifier | **Plugin** |
| Trajectory generator (rule → learned) | Emit `CandidateTrajectories`; feed concatenator/selector/ranker | **Plugin/node** |
| Freespace search | Implement `AbstractAlgorithm` (`astar_search`, `rrtstar`, `reeds_shepp` as references) | **Code** |
| Localization estimator | New node publishing a pose + arbiter rule/launch | **Node/config** |
| Perception detector / predictor / occupancy updater | Swap launch + model/config or add a node | **Config/node** |
| Simulator dynamics | Set `vehicle_model_type` (incl. learned) | **Config** |

### 28.12 Research directions: classical → modern

The architecture is deliberately swappable, so modern methods can replace
classical ones without changing the rest of the stack:

| Classical | Modern replacement | Where it plugs in |
|---|---|---|
| Linear MPC lateral | **Nonlinear MPC**, learned-dynamics MPC, or `autoware_smart_mpc_trajectory_follower` (already present) | `LateralControllerBase` |
| Pure Pursuit | Neural lateral controller / RL policy | `LateralControllerBase` |
| PID longitudinal | Learned longitudinal policy / NMPC speed tracking | `LongitudinalControllerBase` |
| Rule-based trajectory generation | **Diffusion Planner** (present), transformer/IL generators, MPC-as-generator | `CandidateTrajectories` → selector/ranker |
| Elastic-band / QP smoothing | Learned trajectory refinement | `trajectory_optimizer` plugin |
| Map-based prediction | Learned multimodal prediction (SIMPL or new) | prediction node swap |
| Geometric clustering | Learned detection (CenterPoint/TransFusion/BEV) | detector swap |
| Hand-tuned metrics | Learned ranking / value functions | `trajectory_ranker` metric plugin |
| Kinematic simulator | `LEARNED_STEER_VEL` / `DELAY_STEER_MAP_ACC_GEARED` | `vehicle_model_type` |

**Constraints for any replacement** (do not remove these): the **command gate**
(`vehicle_cmd_gate`/`control_command_gate`) and its limits; the **planning/trajectory
validators**; the **fail-closed** MRM path; and — for narrow vehicles — the
**stability monitor**. A learned controller must still emit `autoware_control_msgs/Control`
(Ackermann tire angle + acceleration/jerk) and expose `is_steer_converged` sync data.

### 28.13 How to choose (quick guide)

| Need | First choice | Alternatives |
|---|---|---|
| Path tracking (lateral) | MPC | Pure Pursuit (cheap), Smart MPC |
| Speed tracking (longitudinal) | PID + FF | custom `LongitudinalControllerBase` |
| Route over lanes | `mission_planner_universe` | `path_generator` |
| Parking / tight space | Hybrid A\* freespace | RRT\* |
| Gen. trajectory | rule-based pipeline | Diffusion Planner |
| Prediction | map-based | SIMPL |
| Ego pose | NDT + EKF | YabLoc, GNSS/INS, landmarks |
| Tip-over prevention | external stability monitor | speed/lat-acc limits |

---

## 29. Perception — Input Duties & Effects (Code Review)

**What perception is.** Perception is not one node; it is a graph of detectors,
fusers, a tracker, a predictor, occupancy and traffic-light stages. Its behaviour
is determined by **which inputs are present, correct, and synchronized**. This
section documents the **duty of every perception input and how each one affects
the output**, grounded in the consuming code. (Architecture overview: §12.)

### 29.1 Input duty & effect matrix

| Input | Type / QoS | Consumed by | Duty | If missing / degraded |
|---|---|---|---|---|
| **LiDAR pointcloud** | `PointCloud2`, `SensorDataQoS` | `lidar_centerpoint`, `lidar_transfusion`, `euclidean_cluster`, `ground_segmentation`, `bevfusion`, occupancy grid | Primary 3D detection + free space | No cloud → **no 3D objects, no occupancy**; sparse → missed detections; wrong frame → mislocated objects |
| **Camera image** | `Image` / `CompressedImage` | `tensorrt_yolox`, `bevdet`, `bevformer`, `streampetr`, `bytetrack`, traffic-light classifier | 2D classes, traffic lights, fusion input | No image → camera detections + traffic lights unavailable; fusion falls back to LiDAR-only |
| **CameraInfo** | `CameraInfo`, `SensorDataQoS` | `image_projection_based_fusion`, `traffic_light_map_based_detector` | Intrinsics for projection | Missing/wrong → objects projected to wrong pixels → bad classification/labels |
| **Radar** | `DetectedObjects`/radar tracks | `radar_fusion_to_detected_object`, `radar_object_tracker` | **Doppler velocity**, longer range | No radar → velocity only from tracking; weaker cut-in detection |
| **HD map (Lanelet2)** | `LaneletMapBin`, `transient_local` | `map_based_prediction`, `detected_object_validation`, traffic-light detector | Lane association, prediction, filtering, TL ROIs | No map → prediction falls back to unknown-class path generator; lanelet/position validation disabled; TL detection fails |
| **Ego odometry / TF** | `nav_msgs/Odometry` (`QoS{10}`) | `multi_object_tracker`, occupancy grid | Ego-motion compensation, world transform | Missing → `"No odometry information available"`; tracks drift while moving; occupancy misaligned |
| **Wheel encoders / vehicle velocity** | `autoware_vehicle_msgs/VelocityReport` | `autoware_vehicle_velocity_converter` → distortion corrector; tracker (via odometry) | Motion compensation / LiDAR deskew + ego speed | Wrong/missing → **skewed (distorted) pointclouds** and drifting tracks while moving |
| **Traffic signals** | `TrafficLightGroupArray` | `map_based_prediction` (VRU predictor) | Signal-aware crosswalk/VRU prediction | Missing → VRU/crosswalk prediction ignores signals |
| **Detection channels (×12)** | `DetectedObjects`, `QoS{1}` | `multi_object_tracker` (`input/detection01..12/objects`) | Multi-source fusion + tracking | A missing channel reduces detections but tracking continues; per-channel trust flags matter |
| **2D ROIs + timing** | `DetectedObjectsWithFeature`, `ConcatenatedPointCloudInfo` | `image_projection_based_fusion` (`input/rois{i}`, `input/camera_info{i}`, `input/concatenation_info`) | Camera-LiDAR association | Missing `concatenation_info` → falls back to `naive` matching; no ROIs → no fusion |
| **Route** | `LaneletRoute`, `transient_local` | `traffic_light_map_based_detector` (`~/input/route`) | Select traffic lights **on the route** | No route → no traffic-light ROIs → no signals |
| **Elevation / pointcloud map** | `PointCloud2`, durable | `elevation_map_loader`, ground segmentation, `compare_map_segmentation` | Ground removal / static-map filtering | Missing → worse ground/obstacle separation |

### 29.2 LiDAR — the primary 3D input

- **Duty:** feed 3D detection, clustering/ground segmentation and the occupancy
  grid. Consumed as `~/input/pointcloud` by the DNN detectors
  (`autoware_lidar_centerpoint/src/node.cpp:168-171`, via `CudaBlackboard` for
  zero-copy) and geometric nodes (`autoware_euclidean_cluster/src/euclidean_cluster_node.cpp:35`,
  ground segmentation `~/input/pointcloud`).
- **Effect:** it sets the *detection field of view, range and density*. Missing or
  mis-timestamped clouds mean no objects and no occupancy — and localization (NDT)
  also degrades, so errors compound. Preprocessing (crop, deskew, concatenate) must
  run first, so a bad extrinsic here poisons perception **and** localization.

### 29.3 Camera — classes, traffic lights and fusion

- **Duty:** 2D object classes, traffic-light state, and the 2D half of
  camera-LiDAR fusion.
- **CameraInfo is a separate, mandatory input:** projection in
  `image_projection_based_fusion` (`fusion_node.cpp:85-88`) and traffic-light ROI
  in `traffic_light_map_based_detector` (`traffic_light_map_based_detector_node.cpp:67-69`)
  are meaningless without intrinsics.
- **Effect:** a wrong `camera_info` or extrinsic mis-projects LiDAR objects into
  the image, causing wrong `roi_detected_object_fusion` labels while everything
  still "looks" alive.

### 29.4 Radar — velocity and redundancy

- **Duty:** inject **Doppler velocity** and provide range in poor-visibility
  conditions. `radar_fusion_to_detected_object` time-synchronizes `~/input/objects`
  with `~/input/radars` (`src/node.cpp:92-96`).
- **Effect:** radar improves velocity estimates and cut-in detection; without it,
  velocity is inferred by the tracker, which is slower/noisier.

### 29.5 HD map (Lanelet2) — semantic context

- **Duty:** provide lane geometry and rules to prediction and filtering.
  `map_based_prediction` subscribes `~/input/objects` and `/vector_map`
  (`LaneletMapBin`, `transient_local`) (`map_based_prediction_node.cpp:190-197`).
- **Effect:** the map drives lane association for cars and crosswalk handling for
  VRUs; with no map the node falls back to its **unknown-class path generator**
  (`:129`). Lanelet/position validation
  (`detected_object_validation`: `detected_object_lanelet_filter.cpp`,
  `position_filter.cpp`) also becomes ineffective.

### 29.6 Ego odometry / TF — the hidden mandatory input

- **Duty:** transform detections into the world frame and compensate **ego
  motion** between scans. `multi_object_tracker` subscribes `~/input/odometry`
  (`multi_object_tracker_node.cpp:281-285`); the core queries TF at the tracker
  time (`multi_object_tracker_core.cpp:155`) and warns when unavailable (`:164`).
- **Effect:** a missing/late odometry or wrong TF makes association use a stale
  ego pose → **track drift/ID switches while moving**, even though detections are
  correct. Occupancy grid also needs TF `map→base_link`
  (`pointcloud_based_occupancy_grid_map_node.cpp:259-264`).

### 29.7 Wheel encoders / vehicle velocity — motion compensation

- **Duty:** provide **longitudinal speed** and, fused with the IMU, the **twist**
  used to motion-compensate the LiDAR scan. The chain is:
  wheel encoders → `/vehicle/status/velocity_status`
  (`autoware_vehicle_msgs/VelocityReport`) → `autoware_vehicle_velocity_converter`
  (`vehicle_velocity_converter_node.cpp:26-32`) →
  `/sensing/vehicle_velocity_converter/twist_with_covariance`;
  `autoware_gyro_odometer` fuses that twist with the gyro
  (`gyro_odometer_core.cpp:40-45`).
- **Where it reaches perception:**
  1. **Pointcloud deskew** — `distortion_corrector` consumes `~/input/twist` +
     `~/input/imu` (`distortion_corrector_node.cpp:66-71`) to undistort each
     sweep; the corrected cloud is what detectors, clustering and occupancy use.
  2. **Tracking ego-motion** — `multi_object_tracker` uses
     `ego_source: tf|odometry` (`multi_object_tracker_node.param.yaml:11-12`) and
     `~/input/odometry` (`MultiObjectTracker.node.yaml:43-44`); the odometry source
     ultimately fuses wheel encoders.
- **Effect:** if the wheel-speed scaling is wrong (e.g. wrong `wheel_radius`), the
  scan is under/over-deskewed and the tracker's ego-motion is wrong, causing
  **object smearing and track drift while every topic still looks healthy**.
- **Why it is easy to miss:** encoders are not a perception *topic* — they enter
  perception indirectly through the twist used for undistortion and through the
  odometry the tracker consumes. A correct detector cannot recover a wrongly
  deskewed cloud.

### 29.8 Traffic signals — VRU/crosswalk prediction

- **Duty:** tell the VRU predictor whether a crosswalk is currently safe.
  `map_based_prediction` holds a traffic-signal subscriber (`callbacks.hpp:77`)
  feeding the VRU predictor's traffic-signal module (`predictor_vru.hpp:50-65`).
- **Effect:** without signals, crosswalk-user prediction ignores red/green state.

### 29.9 Multi-source detection channels — robustness by fusion

- **Duty:** combine heterogeneous detectors (CenterPoint, camera-LiDAR fusion,
  radar, detection-by-tracker, irregular) into persistent tracks. The tracker opens
  up to **12** `input/detectionNN/objects` subscriptions (`multi_object_tracker_node.cpp:73-80,261-274`)
  with per-channel configuration and trust.
- **Effect:** a single dead detector degrades recall but does not stop tracking;
  the **per-channel trust** and association gates decide how much each source
  influences the fused track.

### 29.10 Camera-LiDAR fusion timing — `ConcatenatedPointCloudInfo`

- **Duty:** align the LiDAR shutter with per-camera exposure. The fusion node uses
  `rois_timestamp_offsets` and, when available, `input/concatenation_info`
  (`fusion_node.cpp:52-88`).
- **Effect:** with it, `advanced` matching compensates sensor timing; without it,
  the node falls back to `naive` fixed-threshold matching, which is more sensitive
  to jitter.

### 29.11 Route — traffic-light selection

- **Duty:** restrict traffic-light detection to lights relevant to the current
  path. `traffic_light_map_based_detector` subscribes `~/input/route`
  (`LaneletRoute`, `transient_local`) plus map and camera info
  (`traffic_light_map_based_detector_node.cpp:64-72`).
- **Effect:** no route → no ROIs → no traffic-light state, regardless of camera
  quality.

### 29.12 Failure propagation (why "complete perception" needs all inputs)

| Broken input | Direct effect | Downstream effect |
|---|---|---|
| LiDAR cloud | no 3D objects / occupancy | localization also degrades → planning/control |
| CameraInfo / extrinsic | bad projection | wrong class fusion, no TLs |
| Odometry / TF | stale ego pose | track drift, ID switches, occupancy offset |
| Wheel encoders / vehicle velocity | no/incorrect twist | skewed pointclouds, wrong ego motion → smeared/drifting objects |
| HD map | no lane association | degraded prediction, disabled map validation |
| Route | no TL ROIs | no signals → behavior-velocity may not stop |
| Radar | no Doppler | slower/noisier velocity |
| Concatenation info | naive matching | mis-fused camera-LiDAR boxes |

> **Design rule:** each perception input is either a **producer of evidence**
> (LiDAR/camera/radar), a **context provider** (map/route/signals), or a
> **state reference** (odometry/TF). Removing any one degrades a *different* part
> of the pipeline - and because the whole stack is fail-closed, a missing mandatory
> input eventually stops the vehicle rather than driving blind.

---

## 30. Project Overlay, Tooling & Extensions (this workspace)

Sections §1–§29 describe stock Autoware Universe (with workspace notes). This
section inventories the **project-specific layer** layered on top: the E-Trike
`our_packages` overlay, a teleop extension, system-design tooling, developer
tools, pinned upstream patches, and the supporting project docs.

### 30.1 `autoware/src/our_packages` — the E-Trike overlay

| Package | Role |
|---|---|
| `autoware_vehicle_bridge` | Production lifecycle bridge: `Control`/gear/light → CAN, feedback → `/vehicle/status/*`, **fail-closed** gate (see §15) |
| `direct_bridge` | **Standalone bench/commissioning bridge** driving the MTR motor, SES steering and SEB brake **directly** on the low CAN bus (bypasses RT/SYS). Bench-only: no heartbeat/engage gating |
| `etrike_protocol` | Generated, zero-dependency **CAN codec** (message IDs/bit layout/DLC) from YAML contracts |
| `etrike_vehicle_description` | Bajaj RE trike URDF + `vehicle_info` (`base_footprint` at rear axle, single front steering ±0.747 rad) |
| `etrike_vehicle_launch` | Vehicle interface launch |
| `etrike_sensor_kit_description` | Sensor URDF + calibration |
| `etrike_sensor_kit_launch` | Sensing orchestration: LiDAR, IMU (stub), velocity converter, optional dual Kinect |
| `etrike_common_launch` | Hesai XT32M2X **Nebula** driver + pointcloud preprocessor container; per-device CSVs |
| `etrike_lidar_viewer` | Standalone LiDAR + RViz bring-up (no full stack) |
| `etrike_stability_guard` | **Rollover/tip-over monitor** for the trike (planar stack has no rollover model) |
| `etrike_kinect2`, `kinect2_ros2_test` | Kinect v2 (libfreenect2) driver + tests |
| `mapping/` | `lidarslam_ros2` (LiDAR SLAM) + `ndt_omp` (NDT library used by NDT scan matcher) |

### 30.2 Two vehicle bridges: production vs bench

| | `autoware_vehicle_bridge` (production) | `direct_bridge` (bench) |
|---|---|---|
| Path | Jetson → RT/SYS ECUs (high bus) | Direct to MTR/SES/SEB (low bus) |
| Gating | Engage + auto-confirm + heartbeats + estop, all fail-closed | Minimal; no gating |
| Watchdogs | RT/SYS heartbeat + feedback freshness | None |
| Purpose | Autonomy | ECU bring-up / commissioning on bench or `vcan` |
| Use in autonomy | **Yes** | **No** (bench only) |

### 30.3 `extensions/autoware_teleop` — remote operation

Standalone, hardware-agnostic teleoperation: **msgs** (`Intent`), an `rclcpp`
**lifecycle** node (single control authority), a FastAPI **web bridge**, and a
React UI. Two integration paths: **direct vehicle interface**
(`/control/command/*` + `/vehicle/status/*`) and the canonical gate-enforced
**ADAPI external-command** path (`/external/selected/*` + operation-mode
services). See `docs/autoware_teleop/teleop-architecture.md`.

### 30.4 `core/autoware_system_designer` — architecture-as-config

Defines the system with YAML entities (**Node**, **Module**, **ParameterSet**,
**Deployment**) and **generates** correct-by-construction ROS 2 launch files,
diagrams and parameter templates — a higher-level abstraction over hand-written
launch XML.

### 30.5 Developer & calibration tools (`tools/`)

| Tool | Role |
|---|---|
| `tools/vehicle/calibration_adapter` | Relays vehicle-specific calibration topics to `Float32Stamped` |
| `tools/vehicle/time_delay_estimator` | Estimates accel/brake/steer **time delays** from command→response logs |
| `tools/vehicle/parameter_estimator` | Estimates steer offset, wheelbase, gear ratio |
| `tools/vehicle/pitch_checker` | Pitch/ground validation |
| `tools/vehicle/learning_based_vehicle_calibration` | Learned calibration |
| `tools/control/vehicle_cmd_analyzer` | Plots velocity/accel/jerk/lateral-accel (PlotJuggler) |
| `tools/control/control_debug_tools` | Consistency checks for control |
| `tools/driving_environment_analyzer` | ODD analysis from rosbags |
| `tools/control_data_collecting_tool` | Data collection |
| `tools/map/*` | PCD divide/merge/projection, lanelet utils (§9) |
| `tools/bag2lanelet` | Lanelet from driving bag (§9) |
| `tools/autoware_dependency_checker`, `tools/evaluation` | Dependency checks, evaluation |

### 30.6 Upstream patch mechanism

This project **pins upstream repos** (`repositories/*.repos`) and tracks every
deviation in `UPSTREAM_MODIFICATIONS.md`, applying them via `patches/` from
`scripts/bootstrap_workspace.sh`. Example: the Nebula Hesai **XT32M2X firetime
patch** replaces the hard-coded `368 + 2888·channel_id` with per-device CSV
firing times (fixes ~5.6 µs mean timestamp error → distortion correction,
localization). Patches are **removable when upstream absorbs the change**.

### 30.7 Repository & sync workflow

`~/av_project` (Linux) ↔ `E:\work\av_project` (Windows) via **Syncthing**
(`.stignore` excludes build outputs/bags/git). Upstream is reconstructed with
`vcs import` + `bootstrap_workspace.sh`; drift is checked with
`scripts/audit_repo_sync.ps1`. Full workflow in `autoware-universe-setup.md` §29.

### 30.8 Project reference docs

Beyond this document, the repo carries detailed project docs:
`docs/setup/*` (build/software), `docs/hardware/*` (CAN, Jetson),
`docs/operations/*` (run, CAN ops, recovery, monitor), `docs/sensors/*`
(Hesai XT32M2X, Kinect2), `docs/mapping/*`, `docs/testing/*` (pre-vehicle tests),
`docs/autoware_teleop/*`, and **`docs/reference/AV_PIPELINE_DATA_FLOW.md`**
(a full, per-topic message reference with example instances).

---

## 31. Detection Capabilities — What It Can and Cannot See

A practical question: *"How does it detect people, other vehicles, lane lines,
traffic lights, potholes, bumps, overtaking, a sleeping driver, and more?"* The
answer differs per item: some are **directly detected by sensors + ML**, some come
from the **HD map**, some are **composed behaviors**, and some are **not supported
at all**. This section states each honestly, with code references. **If Autoware
cannot do it directly, that is said explicitly.**

### 31.1 The detection vocabulary (`ObjectClassification.msg`)

Object detectors can output these labels
(`core/autoware_msgs/autoware_perception_msgs/msg/ObjectClassification.msg`):

`UNKNOWN(0)`, `CAR(1)`, `TRUCK(2)`, `BUS(3)`, `TRAILER(4)`, `MOTORCYCLE(5)`,
`BICYCLE(6)`, `PEDESTRIAN(7)`, `ANIMAL(8)`, `HAZARD(9)`, `OVER_DRIVABLE(10)`,
`UNDER_DRIVABLE(11)`.

> **Important:** a label existing in the message definition does **not** mean a
> detector reliably produces it. `ANIMAL`, `HAZARD`, `OVER_DRIVABLE` and
> `UNDER_DRIVABLE` are declared but have **no dedicated tracker/detector** in this
> stack — such objects are typically folded into `UNKNOWN`/polygon/static handling.

### 31.2 Capability matrix

| Thing | Directly detected? | How | Key code |
|---|---|---|---|
| **People (pedestrians in the road)** | **Yes** | LiDAR/camera detection → pedestrian tracker → prediction | `autoware_lidar_centerpoint`, `autoware_tensorrt_yolox`, `pedestrian_tracker`, `predictor_vru` |
| **Other vehicles** | **Yes** | Vehicle tracker (car/truck/bus/trailer) | `vehicle_tracker`, `multiple_vehicle_tracker` |
| **Cyclists / motorcycles** | **Yes** | Bicycle motion/shape model | `pedestrian_and_bicycle_tracker`, `bicycle_motion_model` |
| **Animals** | **Label only** | `ANIMAL` label declared; no dedicated tracker → usually `UNKNOWN`/polygon | `ObjectClassification.msg`, `polygon_tracker` |
| **Road lines / lane markings** | **No (not sensed for driving)** | Lane geometry & line type come from the **Lanelet2 map**; camera road markings are used **only for localization** (YabLoc), not lane keeping | Lanelet2 (`dashed/solid` attrs), `yabloc_*/ll2_decomposer` |
| **Traffic lights** | **Yes** | Map-ROI → classifier/fine detector → multi-camera fusion → arbiter | `traffic_light_map_based_detector`, `_classifier`, `_multi_camera_fusion`, `_arbiter` |
| **Potholes** | **No** | No pothole class, detector or geometry; a hole may show as an unknown/occupancy anomaly at best | — |
| **Speed bumps** | **Map-based only** | The module reacts to a **speed-bump regulatory element in the map**; it is *not* sensor-detected | `autoware_behavior_velocity_speed_bump_module` |
| **Overtaking** | **Composed, not one feature** | Lane change + (static/dynamic) obstacle avoidance + prediction + bidirectional-traffic handling | `autoware_behavior_path_lane_change_module`, `..._static_obstacle_avoidance_module`, `..._bidirectional_traffic_module` |
| **Driver / user sleeping** | **No** | No driver-monitoring (DMS) in Universe; requires an external DMS publishing driver state, which could then feed operation-mode/RTI | — |
| **Crosswalk users** | **Yes** | Crosswalk module reasons about pedestrians/bicycles + surrounding traffic | `autoware_behavior_velocity_crosswalk_module`, `autoware_crosswalk_traffic_light_estimator` |
| **Blind spot (sides during turns)** | **Yes** | Blind-spot module for bicycles/pedestrians on the left/right at junctions | `autoware_behavior_velocity_blind_spot_module` |
| **Run-out (emerging pedestrians)** | **Yes** | Run-out module | `autoware_behavior_velocity_run_out_module` |
| **Unknown obstacles / debris / cones** | **Yes as "unknown"** | Detectors + polygon/static trackers + occupancy grid | `polygon_tracker`, `static_tracker`, `autoware_probabilistic_occupancy_grid_map` |
| **Overhead / over-drivable objects** | **Effectively no** | Labels declared, not actively produced/handled | — |
| **Curbs / road boundaries** | **Map-based** | Lanelet boundaries + departure checks | `autoware_boundary_departure_checker`, `autoware_lane_departure_checker` |
| **Parking spots / valet** | **Map-based** | Parking-lot area in Lanelet2 → freespace planner | `autoware_freespace_planner` |
| **Emergency vehicles / hand signals / weather / road friction** | **No** | No detection/handling in this stack | — |

### 31.3 Directly detected (sensors + ML/geometry)

- **Pedestrians, vehicles, cyclists, unknown objects** are detected on the LiDAR
  pointcloud (`autoware_lidar_centerpoint` and other detectors) and/or camera
  (`autoware_tensorrt_yolox` etc.), fused (camera-LiDAR, radar), then tracked with
  class-specific models (`pedestrian_tracker`, `vehicle_tracker`,
  `pedestrian_and_bicycle_tracker`, `polygon_tracker`, `static_tracker`; motion
  models `cv`, `ctrv`, `bicycle`, `static`) and predicted (`predictor_vehicle`,
  `predictor_vru`).
- **Traffic lights** are found by projecting map traffic-light positions into the
  camera, classifying them, fusing across cameras, and arbitrating against
  external/V2X signals.
- **Free space and unclassified obstacles** come from the occupancy grid.

### 31.4 Map-provided (not perception)

Some "detections" are really **map data**, and the vehicle will only act on them
if the HD map contains them:

- **Lane geometry, lane line type (dashed/solid), speed limits, stop lines,
  crosswalks, junctions, and speed bumps** live in the **Lanelet2** vector map.
  Perception does **not** detect lane lines; the planner follows mapped
  centerlines and the lane-change module reads mapped line types.
- **Road boundaries/curbs** for departure checks are mapped lanelet bounds.
- If the map lacks an element (e.g. a speed bump or stop line), **the vehicle will
  not react to it** even if the sensor sees it.

### 31.5 Composed behaviors (no single "feature button")

- **Overtaking** = lane change + obstacle avoidance + prediction + oncoming-traffic
  handling. There is no "overtake" command; it emerges from behavior modules
  acting on the route and the tracked/predicted objects.
- **Stopping for pedestrians** = detection (pedestrian) + prediction (VRU) +
  behavior-velocity modules (crosswalk/blind-spot/run-out) + motion-velocity
  stop. Each layer contributes; no layer sees the whole intent.

### 31.6 Not supported (stated plainly)

- **Potholes** — no detection class, model or geometry.
- **Driver/user sleeping (DMS)** — not part of Autoware Universe; needs an
  external driver-monitoring system (and integration into operation-mode/RTI).
- **Animals, hazards, over/under-drivable objects** — labels exist but no
  dedicated detectors/trackers; treated as unknown at best.
- **Emergency vehicles, hand signals, weather/road-friction** — no handling.
- **Lane-line perception** — not used for driving; lane data is from the map.

### 31.7 Why "and more" is not automatic

Anything not in the label set, or not encoded in the map, is either:
1. detected as **`UNKNOWN`** and handled conservatively by polygon/static tracking
   and the occupancy grid (stop/avoid), or
2. **invisible** to the stack (e.g. potholes, a sleeping driver, an unmapped speed
   bump).

Adding a new "detection" therefore means one of: **(a)** a detector that emits a
known label, **(b)** a map element the planners already understand, or **(c)** a new
plugin/module (see §28.11 for extension points). There is no generic
"detect arbitrary thing" capability.

---

## 32. Scenario Handling — Supported, Partial, Not Supported

This section maps the broad autonomous-driving capability list to **what this
codebase actually implements**, with a clear verdict and the code that does it.
Verdicts: **Direct** (implemented), **Map-based** (relies on HD map data),
**Composed** (emerges from several modules), **Partial** (heuristic/limited), or
**Not supported** (state plainly). This is not an exhaustive recital — it focuses
on the cases a deployer asks about.

### 32.1 Perception and road understanding

| Capability | Verdict | How / code |
|---|---|---|
| Pedestrian / cyclist / motorcycle / vehicle detection | **Direct** | Detectors → class trackers (§12, §29, §31) |
| Pedestrian 3D localization (distance/position) | **Direct** | 3D boxes from `autoware_lidar_centerpoint`; camera-LiDAR fusion |
| Multi-object tracking + data association | **Direct** | `autoware_multi_object_tracker` (EKF + **muSSP**), class models |
| Pedestrian intention / crossing prediction | **Partial** | `predictor_vru` + traffic-signal module (`predictor_vru.hpp:50-65`) and crosswalk module; heuristic, not learned intent |
| Vehicle orientation / dimensions | **Partial** | Orientation & shape estimation; envelope from bounding boxes |
| Drivable-area segmentation | **Direct** | `autoware_lidar_frnet` (drivable area) + occupancy grid |
| Occlusion reasoning (hidden objects) | **Partial** | `autoware_behavior_velocity_occlusion_spot_module` (heuristic) |
| Lane-line / lane-marking detection | **Not supported** | Lane lines are **map-based** (Lanelet2); camera markings used only by YabLoc localization |
| Lane geometry / centerlines | **Map-based** | Lanelet2 centerlines (§10) |
| Road-edge / curb detection | **Map-based** | Lanelet boundaries; parked/shoulder logic from map |
| Crosswalk detection | **Map-based** | Crosswalk regulatory element + behavior-velocity module |
| Road-arrow detection | **Not supported** | No road-arrow module/class |
| Traffic-**sign** detection / interpretation | **Not supported** | No traffic-sign recognition (only traffic **lights**) |
| Traffic-light detection / state / association | **Direct** | `traffic_light_*` pipeline; association via map |
| Animal detection | **Not supported** | `ANIMAL` label declared; no detector/tracker (§31.1) |
| Road-debris / unknown obstacles | **Partial** | As `UNKNOWN` (polygon/static tracker) + occupancy grid |
| Pothole detection / severity | **Not supported** | No class, model or geometry |
| Speed-bump detection | **Map-based** | `autoware_behavior_velocity_speed_bump_module` on a map regulatory element |
| Road-surface anomaly / standing water / road friction | **Not supported** | No sensing or estimator |

### 32.2 Prediction

| Capability | Verdict | How / code |
|---|---|---|
| Vehicle trajectory prediction | **Direct** | `autoware_map_based_prediction` (`predictor_vehicle`) |
| Multimodal prediction (several hypotheses + probability) | **Direct** | Lane/lateral path candidates with probabilities |
| Cut-in / lane-change prediction | **Direct** | `lane_change_detection` in the vehicle predictor (`map_based_prediction_node.cpp`) |
| Pedestrian / cyclist trajectory prediction | **Direct** | `predictor_vru` (different model than vehicles) |
| Velocity estimation | **Direct** | Tracker + radar **Doppler** (`radar_fusion_to_detected_object`) |
| Acceleration estimation | **Partial** | Tracking EKF; not a dedicated accel predictor |
| Interaction-aware prediction (objects react to ego) | **Partial** | Signal/crosswalk awareness; not full game-theoretic interaction |

### 32.3 Localization and mapping

| Capability | Verdict | How / code |
|---|---|---|
| GNSS / RTK localization | **Direct (via driver)** | `autoware_gnss_poser`; RTK/NTRIP comes from the receiver/driver |
| IMU / wheel-odometry localization | **Direct** | `autoware_gyro_odometer`, EKF twist |
| Visual / LiDAR / radar odometry | **Partial** | LiDAR NDT is primary; YabLoc is vision; no radar odometry |
| Sensor-fusion localization | **Direct** | `autoware_ekf_localizer` (NDT + GNSS + IMU/wheel) |
| HD-map localization (NDT) | **Direct** | `autoware_ndt_scan_matcher` |
| Localization **uncertainty** to the planner | **Direct** | Covariance + `autoware_localization_error_monitor` |
| HD-map creation | **Not supported** | External tools only (§9) |
| Map freshness / online mapping | **Not supported** | Static preloaded map; no online update |
| Coordinate-frame management | **Direct** | TF tree + calibration (§6, §8) |

### 32.4 Planning and decision-making

| Capability | Verdict | How / code |
|---|---|---|
| Route planning / lane-level routing | **Direct** | `autoware_mission_planner_universe` over the lanelet graph |
| Lane keeping | **Direct** | `autoware_behavior_path_planner` (lane following) |
| Adaptive speed / vehicle following | **Direct** | `autoware_motion_velocity_obstacle_cruise_module`, `autoware_velocity_smoother` |
| Stop-line handling | **Map-based** | Stop-line regulatory element |
| Traffic-light decision (green→amber) | **Partial** | Traffic-light behavior module stops/yields; no explicit dilemma-zone optimizer |
| Right-of-way / intersection / unprotected turns | **Partial** | `autoware_behavior_velocity_intersection_module` (rule/heuristic) |
| Roundabout handling | **Direct** | `autoware_behavior_velocity_roundabout_module` |
| Merging | **Partial** | Lane-change/start-planner based; no negotiated merging |
| Lane-change planning (+ abort path) | **Direct** | `autoware_behavior_path_lane_change_module` (collision-checked, abort) |
| Overtaking | **Composed** | Lane change + static/dynamic avoidance + `bidirectional_traffic` + prediction |
| Oncoming-traffic prediction during overtaking | **Partial** | `bidirectional_traffic` + prediction; no hidden-behind-curve model |
| Obstacle avoidance (static/dynamic) | **Direct** | `..._static_obstacle_avoidance_module`, `..._dynamic_obstacle_avoidance_module` |
| Minimum-risk manoeuvre (MRM) | **Direct** | `autoware_mrm_handler` + stop operators (§16) |
| Deadlock resolution (stuck by over-caution) | **Not supported** | No explicit deadlock/resolution logic |
| Rule compliance vs "practical" driving | **Not supported** | No negotiation/practical-exception logic |

### 32.5 Control and vehicle

| Capability | Verdict | How / code |
|---|---|---|
| Longitudinal control | **Direct** | `autoware_pid_longitudinal_controller` (FF + PID, slope, delay comp) |
| Lateral control | **Direct** | MPC (`autoware_mpc_lateral_controller`) or `autoware_pure_pursuit` |
| Vehicle dynamics modelling | **Direct** | Bicycle kinematics/no-delay/dynamics in MPC |
| MPC | **Direct** | QP/OSQP linear MPC; Smart MPC available |
| Braking-distance / emergency braking | **Direct** | `autoware_autonomous_emergency_braking`, smooth-stop |
| Actuator delay / hysteresis | **Direct** | Delay compensation (PID ~0.17 s); `steer_time_constant` in sim |
| Passenger comfort (accel/jerk) | **Direct** | Command-gate jerk limits, velocity smoother |
| Vehicle-state estimation | **Direct** | EKF + gyro/wheel |
| Sensor calibration / time sync / degradation | **Direct (tools)** | CalibrationTools, PTP/chrony (§20), `autoware_calibration_status_classifier`, `autoware_image_diagnostics` |

### 32.6 What Autoware cannot do (consolidated)

These are **not implemented** in this stack — do not assume them:

| Missing capability | Note |
|---|---|
| **Traffic-sign detection / interpretation** | Only traffic **lights** are recognized; speed-limit/stop/yield signs are map data, not sensed |
| **Road-arrow detection** | None |
| **Pothole / road-surface / standing-water / friction estimation** | None; no dry/wet/snow adaptation |
| **Animal / emergency-vehicle / siren recognition** | Labels/terms exist at most; no handling |
| **Opening-door / parked-occupant prediction** | None |
| **Driver monitoring / drowsiness (DMS)** | Not in Universe; requires external system |
| **Online mapping / map-freshness validation** | Static preloaded HD map only |
| **Deadlock / negotiation / "practical driving" exceptions** | None |
| **Lane-line perception for driving** | Map-based only |
| **Full visibility-based speed limiting** | No dynamic visibility estimator |
| **Interaction-aware / game-theoretic prediction** | Only limited heuristic awareness |
| **Weather/night robustness guarantees** | No explicit weather or glare handling |
| **Certification / safety case** | Upstream is not a certified product (§21) |

> **Bottom line:** Autoware handles the *mapped, sensor-visible, rule-based* core
> of driving very well (people/vehicles/cyclists, traffic lights, lane keeping,
> following, lane changes, intersections, roundabouts, occlusion heuristics, MRM).
> It does **not** sense or reason about traffic signs, potholes, road conditions,
> animals, emergency vehicles, drowsy drivers, online map changes, or
> negotiation/deadlock scenarios — those must be added (detector/model/map/plugin)
> or handled by the integrator, and the ODD must exclude them until then.

---

## 33. Capability Coverage by Area (A–J) — Handling, Gaps & Limits

A systematic pass over the full autonomy-capability taxonomy (sensing →
road users → road geometry → traffic control → road surface → tracking/prediction
→ planning → difficult situations → weather/localization → driver/system/validation),
mapped to **what this codebase actually does**, its **gaps**, and **what it cannot
handle**. Verdicts: **Direct / Map / Partial / Composed / Not supported**. Detail
is in §31–§32; this is the master coverage table.

### A. Sensing and sensor engineering

| Item | Verdict | Handling / code | Gap |
|---|---|---|---|
| Camera perception | **Direct (modality)** | `tensorrt_yolox`, `tensorrt_bevdet/bevformer`, `camera_streampetr`, traffic-light classifier | No darkness/glare/rain/motion-blur guarantees |
| LiDAR perception | **Direct** | Nebula drivers, `lidar_centerpoint`, clustering, `ndt_omp` localization | Model/FOV dependent |
| Automotive radar | **Direct** | `radar_object_tracker`, `radar_fusion_to_detected_object` (Doppler) | Association/multipath are config-level; no radar odometry |
| **Ultrasonic / sonar** | **Not supported** | — | No driver or consumer anywhere |
| 360° field-of-view coverage | **Config-dependent** | Sensor-kit geometry (URDF) | No coverage-analysis tool; `visible_range` only for dummy perception |
| Sensor range vs stopping distance | **Partial** | `autoware_autonomous_emergency_braking` | No automated range-vs-speed ODD check |
| Sensor resolution (few pixels/points) | **Model-dependent** | Detector architecture | Small/distant/narrow objects are a known long-tail |
| Time synchronization | **Direct** | PTP/chrony (§20); per-sensor timestamps | Must be configured/validated |
| Extrinsic calibration | **Direct (tools)** | CalibrationTools (§8); TF tree | Drift is operational, not just install-time |
| Sensor health / contamination | **Partial** | `system_monitor`, `topic_state_monitor`, `component_state_monitor`, `velodyne_monitor`, `autoware_calibration_status_classifier`, `autoware_image_diagnostics` | No lens-cleaning/heater management; limited contamination detection |

### B. Detecting road users

| Item | Verdict | Handling | Gap |
|---|---|---|---|
| Pedestrian detection / position / motion | **Direct** | Detectors + fusion + `pedestrian_tracker`; 3D boxes | Distance/occlusion/night degrade |
| Pedestrian intention prediction | **Partial** | `predictor_vru` + signal/crosswalk logic | Not learned intent; no pose/head model |
| Children / vulnerable pedestrians | **Not distinguished** | Treated as generic pedestrians | No age/mobility class; no larger-margin logic |
| Cyclists | **Direct** | `pedestrian_and_bicycle_tracker`, blind-spot/crosswalk modules | Wobble/turn-intent weak |
| Motorcycles | **Direct (class)** | Vehicle/bicycle models | Lane-filtering not modeled |
| Passenger vehicles | **Direct** | `vehicle_tracker`, `multiple_vehicle_tracker` | — |
| Vehicle orientation / dimensions | **Partial** | Shape estimation; box envelope | Articulated/trailer swept path not modeled |
| Trucks / buses | **Direct (class)** | Vehicle tracker | Trailer articulation/blind zones not modeled |
| Animals | **Not supported** | `ANIMAL` label declared, no tracker | — |

### C. Road geometry and markings

| Item | Verdict | Handling | Gap |
|---|---|---|---|
| Lane-marking detection | **Not supported** | Lane data from **Lanelet2 map** | No painted-line perception for driving |
| Poor / missing lane markings | **Map-based** | Map topology + occupancy free space | Fails if map is wrong/absent |
| Road-edge detection | **Map-based** | Lanelet boundaries | No camera/LiDAR edge perception |
| Lane topology / width | **Map-based** | Lanelet graph + dimensions | Assumes map is correct |
| Curvature | **Map-based** | Trajectory/path curvature | — |
| Road slope / grade | **Partial** | PID `enable_slope_compensation` (pitch) | No full grade map; no banking |
| Road banking / camber | **Not supported** | — | — |
| Stop-line detection | **Map-based** | Stop-line regulatory element | Not sensed |
| Crosswalk detection + yielding | **Map-based + Direct** | Crosswalk regulatory element + `autoware_behavior_velocity_crosswalk_module` (pedestrian/bicycle trajectory reasoning) | — |

### D. Traffic control and infrastructure

| Item | Verdict | Handling | Gap |
|---|---|---|---|
| Traffic-light location | **Map-based** | Map ROI projected into camera (`traffic_light_map_based_detector`) | Needs map |
| Traffic-light state classification | **Direct** | `traffic_light_classifier`/`fine_detector`; `UNKNOWN` state exists | Low-light/occlusion degrade |
| Traffic-light occlusion | **Partial** | `autoware_traffic_light_occlusion_predictor`, multi-camera fusion | — |
| Traffic-light association (which lane) | **Map-based** | Route + map association | Map accuracy critical |
| V2X traffic-signal info | **Direct** | `tier4_v2x_msgs` + `autoware_traffic_light_arbiter` (perception + external merge) | Requires infrastructure |
| Traffic-**sign** detection / recognition / relevance | **Not supported** | — | No sign perception (only lights) |
| Temporary signs | **Not supported** | — | Dynamic signs cannot override the map |
| Road arrows / road text | **Not supported** | — | — |

### E. Potholes, bumps and road surface

| Item | Verdict | Handling | Gap |
|---|---|---|---|
| Pothole detection / depth / uncertainty | **Not supported** | — | No negative-obstacle perception |
| Speed-bump handling | **Map-based** | `autoware_behavior_velocity_speed_bump_module` on a map regulatory element (incl. height/slow speed) | Not sensed; unmapped bumps ignored |
| Bump geometry / ride severity | **Partial** | Map bump attributes | No measured shape/dynamics |
| Road roughness | **Not supported** | — | — |
| Puddles / standing water | **Not supported** | — | — |
| Road friction (dry/wet/ice/gravel) | **Not supported** | — | Planning assumes nominal friction |
| Debris | **Partial** | As `UNKNOWN` + occupancy | No class-specific handling |
| Open drains / drop-offs | **Not supported** | — | No negative-obstacle detection |

### F. Tracking and predicting road users

| Item | Verdict | Handling | Gap |
|---|---|---|---|
| Multi-object tracking / data association | **Direct** | `autoware_multi_object_tracker` (EKF + **muSSP** min-cost flow) | Crowded-scene ID switches under occlusion |
| Velocity / heading estimation | **Direct** | Tracker + radar Doppler | Uncertainty propagation limited |
| Acceleration estimation | **Partial** | Tracker state | No explicit accel-intent predictor |
| Multimodal trajectory prediction | **Direct** | `map_based_prediction` (multiple paths + probabilities) | — |
| Interaction-aware prediction | **Partial** | Signal/crosswalk awareness | Not game-theoretic; ego-coupling limited |
| Cut-in prediction | **Direct** | `lane_change_detection` in vehicle predictor | — |
| Vehicle emerging from occlusion | **Partial** | `occlusion_spot_module` + occupancy grid | Heuristic, not full unseen-agent reasoning |
| Parked-vehicle behavior | **Partial** | `static_tracker`, obstacle avoidance | No wheel/indicator/door/driver cues |

### G. Planning driving behavior

| Item | Verdict | Handling | Gap |
|---|---|---|---|
| Route planning / lane-level routing | **Direct** | `autoware_mission_planner_universe` | — |
| Lane following | **Direct** | `autoware_behavior_path_planner` | — |
| Following distance (time headway) | **Direct** | `autoware_motion_velocity_obstacle_cruise_module` (optimization/PID-based), velocity smoother | — |
| Stop decision | **Direct** | Behavior/motion velocity stop modules, smooth stop | — |
| Intersection handling | **Partial** | `autoware_behavior_velocity_intersection_module` (rule/heuristic) | No negotiation |
| Unprotected turns | **Partial** | Intersection module | Multi-stream reasoning weak |
| Merge behavior | **Partial** | Lane-change/start-planner | No explicit gap negotiation |
| Lane-change decision | **Direct** | `autoware_behavior_path_lane_change_module` (collision-checked against predictions) | — |
| Overtaking | **Composed** | Lane change + avoidance + `bidirectional_traffic` + prediction | No oncoming hidden-behind-curve model |
| Abort maneuver | **Direct** | Lane-change abort path | — |

### H. Other difficult traffic situations

| Item | Verdict | Handling | Gap |
|---|---|---|---|
| Blind spots | **Direct** | `autoware_behavior_velocity_blind_spot_module` | — |
| Emergency vehicles | **Not supported** | — | No siren/light recognition or yielding logic |
| Construction zones | **Partial** | `detection_area`, `no_stopping_area`, `no_drivable_lane`, `out_of_lane` | No cone/worker/temp-sign semantics |
| Cones / temporary barriers (as topology) | **Not supported** | Obstacles seen as unknown | No "line of cones = new boundary" |
| Police / worker hand gestures | **Not supported** | — | — |
| Unusual vehicles (tractor, tuk-tuk, cart) | **Partial** | `UNKNOWN`/polygon tracker | Not classified; behavior not modeled |
| Vehicle doors opening | **Not supported** | — | — |
| Reversing vehicles | **Partial** | Tracker velocity sign | No explicit reverse-light/handling logic |
| Wrong-way vehicles | **Not supported** | — | Map-direction assumption not overridden |
| Accident scenes | **Partial** | Rotated/static objects handled as obstacles | Long-tail; no scene understanding |

### I. Weather, visibility and localization

| Item | Verdict | Handling | Gap |
|---|---|---|---|
| Rain / fog / snow / spray | **Not supported** | — | No weather adaptation or ODD exit logic |
| Sun glare / shadows | **Not supported** | — | No HDR/glare handling |
| Night driving | **Not supported explicitly** | Same detectors | Night validation is integrator's job |
| GNSS localization | **Direct (limits)** | `autoware_gnss_poser`; degrades in canyons/tunnels | Multipath/jamming unhandled |
| RTK-GNSS | **Via driver** | Receiver/driver provides RTK; no NTRIP in-universe | Needs corrections/fallback |
| IMU | **Direct** | `autoware_gyro_odometer`; bias correction | Drift integrates |
| Wheel odometry | **Direct** | Wheel speed via vehicle interface | Slip/circumference errors |
| LiDAR-map localization (NDT) | **Direct** | `autoware_ndt_scan_matcher` | Degenerate in feature-less areas (§11.6) |
| Localization uncertainty | **Direct** | Covariance + `autoware_localization_error_monitor` | Planner use is indirect |

### J. Driver, system, vehicle and validation

| Item | Verdict | Handling | Gap |
|---|---|---|---|
| Driver presence / monitoring / sleeping / distraction | **Not supported** | — | No DMS in Universe; needs external system + integration |
| Takeover readiness (L2/L3) | **Not supported** | — | — |
| Operational Design Domain (ODD) | **Config** | Launch/config, `system_run_mode`, limits | Not formally enforced; no ODD taxonomy |
| Perception uncertainty / SOTIF | **Partial** | Diagnostics, error monitors, fail-closed gate | No SOTIF process or unknown-ODD detection |
| Functional safety / redundancy | **Partial** | Fail-closed command gate, MRM, watchdogs | Not ISO 26262; hardware redundancy is integrator-owned |
| Real-time computation | **Partial** | `pipeline_latency_monitor`, `processing_time_checker` | No worst-case/jitter guarantee |
| Scenario-based validation / long-tail | **Direct (tooling)** | `evaluator/*`, `scenario_simulator`, Driving Log Replayer | Coverage is your responsibility |
| Minimum-risk behavior | **Direct** | `autoware_mrm_handler` + stop operators (§16) | Strategy quality is config/integrator |
| System safety case | **Not supported** | — | Integrator must build it (ISO 21448/26262/3450x) |

### 33.1 The consolidated "cannot handle" list

Traffic signs; road arrows/text; potholes, roughness, puddles, friction,
drop-offs (**negative obstacles**); animals; emergency vehicles/sirens;
**ultrasonic** short-range sensing; construction semantics; cones-as-topology;
police/worker gestures; vehicle doors; wrong-way vehicles; weather/glare/night
adaptation; **driver monitoring/drowsiness/takeover**; online/updated mapping;
negotiation and deadlock resolution; formal ODD enforcement; SOTIF/ISO 26262
safety certification.

### 33.2 How to close a gap

Every missing item maps to one of the extension points in **§28.11**:

| Missing type | Add via |
|---|---|
| New sensed class (traffic sign, animal, pothole) | Detector emitting a known/new label + tracker model |
| New semantic element (sign, arrow, construction) | Lanelet2/map + behavior or velocity module |
| New behavior (negotiation, deadlock, emergency-vehicle yield) | Behavior-path or motion-velocity **plugin** |
| New localization/odometry (radar, visual) | New estimator node + arbiter/launch |
| New sensor (ultrasonic, DMS) | Driver + interface + a consumer node/module |
| Safety/ODD/SOTIF | Integrator process, monitors, and fail-closed gates — not a package |

> **Reality check:** Autoware provides a strong, inspectable **core** and the
> **hooks** to extend it. It is **not** a complete ODD-agnostic autonomy solution;
> the gaps above must be explicitly covered, mapped to the ODD, and validated
> before any road deployment.

---

## 34. Pipeline Walkthrough — Case-by-Case (Detection → Response)

The difference between a computer-vision demo and an AV system is the **full
chain**: `Detection → Classification → Localization → Tracking → Prediction →
Risk assessment → Response`. This section walks that chain for concrete cases and
**states exactly where Autoware implements each stage and where it breaks**,
grounded in code.

### 34.1 The generic chain mapped to Autoware

| Stage | What it means | Autoware nodes |
|---|---|---|
| **Detection** | Something is there | detectors: `autoware_lidar_centerpoint`, `autoware_tensorrt_yolox`, radar, `autoware_euclidean_cluster` |
| **Classification** | What it is (class + probability) | detector labels (`ObjectClassification.msg`) + `detection_class_remapper` |
| **Localization** | 3-D position/orientation | 3-D boxes from detector; camera-LiDAR/radar fusion (`autoware_image_projection_based_fusion`, `radar_fusion_to_detected_object`); TF |
| **Tracking** | Persistent identity over time | `autoware_multi_object_tracker` (EKF + **muSSP** data association) |
| **Prediction** | Future motion/intent | `autoware_map_based_prediction` (`predictor_vehicle`, `predictor_vru`) |
| **Risk assessment** | Collision likelihood / who yields | behavior-velocity modules (**TTC/TTV**), `autoware_autonomous_emergency_braking` (**RSS**), collision detectors |
| **Response** | Continue / slow / yield / stop / steer | behavior path + motion velocity + `Control` (MPC/PID) + command gate |

### 34.2 Case: pedestrian in the road

```text
Camera sees person
  → LiDAR/radar estimate 3-D position & motion
  → tracker maintains identity
  → model estimates walking direction/intention
  → planner computes path intersection
  → TTC/risk
  → continue / slow / yield / stop
```

| Stage | Autoware | Verdict |
|---|---|---|
| Detection | `tensorrt_yolox` (camera), `lidar_centerpoint` (LiDAR), radar | ✅ |
| Classification | `PEDESTRIAN` label + probability | ✅ |
| Localization | 3-D box, camera-LiDAR fusion, TF | ✅ |
| Tracking | `pedestrian_tracker` inside `multi_object_tracker` (EKF + muSSP) | ✅ |
| Prediction | `predictor_vru` — crosswalk-aware, signal-aware (`predictor_vru.hpp`) | ✅/partial (no pose/head-intent) |
| Path-intersection + **TTC/TTV** | `autoware_behavior_velocity_crosswalk_module` computes `time_to_collision` / `time_to_vehicle` at a `collision_point` and a `safety_factor` (`scene_crosswalk.cpp`, `occluded_crosswalk.cpp`); blind-spot/run-out modules add lateral/emerging cases | ✅ |
| Response | Behavior-velocity module inserts a stop/slow point → motion velocity → `Control` (stop/yield/creep) | ✅ |

**Chain complete** for detected, mapped-crosswalk pedestrians. It is weaker when the
pedestrian is occluded, at night, or crossing outside a mapped crosswalk (then the
response relies on generic obstacle/AEB logic rather than VRU intent).

### 34.3 Case: pothole

```text
Road anomaly detected → classify negative obstacle → position+width+depth
  → confidence → compare with wheel path/clearance → slow down / avoid
```

| Stage | Autoware | Verdict |
|---|---|---|
| Detection | No negative-obstacle detector. Ground segmentation (`scan_ground_filter`, `autoware_lidar_frnet`) separates ground/non-ground but does **not** flag a depression | ❌ |
| Classification | No "pothole" class | ❌ |
| Position / width / **depth** | No geometry of depressions | ❌ |
| Confidence | — | ❌ |
| Wheel-path / clearance decision | No | ❌ |
| Slow / avoid response | Only if the pothole happens to produce **returns** and is treated as an `UNKNOWN` obstacle; a pure depression returns **no points** → invisible | ❌ |

**The chain breaks at stage 1.** Autoware cannot detect potholes, estimate their
depth, or reason about straddling vs avoiding. This is a genuine
**negative-obstacle** gap (§31.6, §33E).

### 34.4 Case: overtaking

```text
Slower object detected → map says passing permitted → target lane + blind spot
  → rear/oncoming predicted → candidate trajectories → collision & feasibility
  → pass → verify clearance → return to lane
```

| Stage | Autoware | Verdict |
|---|---|---|
| Slower object detected | tracker + prediction identify the lead vehicle (`multi_object_tracker`, `predictor_vehicle`) | ✅ |
| Map says passing permitted | Lane-change legality from Lanelet2 line type (`dashed/solid`) in `autoware_behavior_path_lane_change_module` | ✅ |
| Target lane + blind spot | lane-change module + `autoware_behavior_velocity_blind_spot_module` | ✅ |
| Rear/oncoming prediction | `map_based_prediction` + `autoware_behavior_path_bidirectional_traffic_module` (`oncoming_car.cpp`, `give_way.cpp`) | ✅/partial (oncoming hidden behind curves/hills not modeled) |
| Candidate trajectories | Frenet/lane-change path generation (`path.cpp`, `calculation.cpp`) | ✅ |
| Collision + feasibility checks | `safety_check.hpp` `isSafe()` + collision-checked paths; `motion_velocity` for feasibility (`interface.cpp`) | ✅ |
| Pass → verify clearance → return | lane-change execution with **abort state** (`isAbortState`, `toAbortState`) | ✅ |
| Abort strategy | explicit Abort state and abort path approval | ✅ |

**Chain is composed, not a single feature**: overtaking = lane change + avoidance
+ prediction + oncoming handling. Autoware has the pieces and an abort path; the
weak spot is oncoming traffic that is currently **not visible** (curves, hills).

### 34.5 Where the chain breaks (summary)

| Case | First failing stage | Why |
|---|---|---|
| **Pothole** | Detection | No negative-obstacle sensing |
| **Traffic sign** | Detection/Classification | No sign perception |
| **Road arrow / text** | Detection | Not sensed |
| **Animal** | Classification | Label exists, no tracker |
| **Emergency vehicle** | Detection | No siren/light recognition |
| **Driver drowsiness** | (outside stack) | No DMS |
| **Wrong-way / reversing / door** | Prediction/Response | No dedicated model |
| **Rain/fog/glare** | Detection (degraded) | No weather adaptation |
| **Unmapped speed bump / stop line** | Risk/Response | Map-only (not sensed) |
| **Deadlock / negotiation** | Response | No resolution logic |

### 34.6 Demo vs system

The conceptual point: for **classes in the label set** and **elements in the HD
map**, Autoware implements the *entire* detection→response chain, including a real
**risk-assessment layer** (TTC/TTV in the crosswalk module, RSS-style distance in
AEB, collision detectors). That is what separates it from a detector demo.

The system boundary is the **label set + the map + the ODD**. Anything outside
those (potholes, signs, animals, weather, drowsiness, online map change,
negotiation) makes the chain **break** and must be added via the extension points
in §28.11 — or excluded from the ODD.
