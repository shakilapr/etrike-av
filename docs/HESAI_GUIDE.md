# Hesai XT32M2X LiDAR — Complete Integration Guide

**Date:** 2026-08-18
**Sensor:** Hesai XT32M2X (32-channel mechanical lidar)
**Driver:** Nebula (`sensor_model: PandarXT32M` — maps to the `PacketXT32M2X` decoder)
**Target Platform:** Jetson Orin + Docker (`universe-cuda-humble`)

> **Note:** The XT32M2X contains **no IMU**. It measures only distance,
> azimuth, and reflectivity; the GNSS/PTP interfaces are for time
> synchronization only. An IMU (e.g., Tamagawa AU7684) is a separate sensor
> and is planned as future work (see Section 6).

---

## 0. Prerequisites (first time only)

Before any of the sections below, the following must already be in place on the Jetson:

1. **Apply the Nebula firetime patch** so the driver loads the device-specific
   firing times. Without it, the decoder uses a hard-coded
   formula that differs from the device CSV by ~5.6 µs mean (details in
   `docs/LIDAR_SETUP.md`, Section 9):
   ```bash
   ./scripts/apply_nebula_firetime_patch.sh
   ```
2. **Build the custom packages** (inside the container):
   ```bash
   ./docker/shell.sh
   # Inside the container:
   source /opt/autoware/setup.bash
   cd /workspace/autoware
   colcon build --symlink-install --packages-select \
     etrike_common_launch etrike_sensor_kit_launch etrike_sensor_kit_description \
     nebula_hesai_common nebula_hesai_decoders nebula_hesai
   ```
3. **Allow the sensor's management ports** on the Jetson firewall (per the
   XT32M2X user manual): TCP `9347` (PTC, used by Nebula with
   `setup_sensor:=true`), TCP/HTTP `80` (web control), and UDP `319`/`320`
   (PTP 1588v2). UDP `2368` (point cloud) and UDP `10110` (GNSS time sync)
   are also received by the host. **Note:** the stock L4T image on this
   Jetson runs no active firewall (`ufw` is not installed), so this step is
   a no-op today — the ports only need opening if you enable one.
4. **Install `tcpdump` on the host** (`sudo apt install tcpdump`) — the UDP
   stream check in `lidar_bringup.sh --check-only` depends on it. (The
   container image ships neither `ping` nor `tcpdump`, which is why the
   network checks run on the host in Section 1.2.)

---

## 1. Initial Connection and Visualization (Quick Start)

To first connect the sensor and retrieve a raw point cloud, you must SSH into the Jetson, navigate to the project workspace, configure the network, and run the bring-up script. 

### 1.1 Network Setup
1. Connect the LiDAR to the Jetson Orin via Ethernet.
2. Open your terminal and SSH into the Jetson, then navigate to the workspace:
   ```bash
   ssh med1@172.16.25.56
   cd ~/av_project
   ```
3. Configure the Jetson's network interface to communicate with the sensor
   (sensor default IP is `192.168.1.201`). The wired port on this Jetson is
   **`eno1`** (verify with `ip -br link` — `wlP1p1s0` is WiFi; the sensor must
   be on a wired port):
   ```bash
   sudo ./scripts/setup_lidar_network.sh eno1 192.168.1.10 192.168.1.201
   ```

### 1.2 Bring-up Pipeline
The automated bring-up script verifies UDP packets on port `2368` and
launches the full sensing stack (Nebula driver + preprocessing). It runs in
two places — network checks on the host, the ROS stack in the container:

1. **Network checks (host):**
   ```bash
   ./scripts/lidar_bringup.sh --check-only
   ```
2. **Sensing stack (container):** the repo root is mounted at
   `/workspace/av_project` inside the container (`docker/shell.sh` mounts
   it):
   ```bash
   ./docker/shell.sh
   # Inside the container:
   cd /workspace/av_project
   ./scripts/lidar_bringup.sh
   ```
* **Visualization (Jetson):** RViz2 opens automatically as part of the launch,
  but the default `autoware.rviz` config is a **top-down (TopDownOrtho) 2D view
  and does NOT include the lidar's own point cloud topics**. To actually see
  the XT32M2X cloud, use the dedicated 3D config that ships with our sensor
  kit, or add the display manually (full guide in Section 5):

  ```bash
  # Option A — dedicated 3D config (preferred):
  ./docker/shell.sh
  # Inside the container:
  ros2 launch autoware_launch autoware.launch.xml \
    map_path:=/autoware_map/your-map \
    vehicle_model:=etrike_vehicle \
    sensor_model:=etrike_sensor_kit \
    launch_sensing_driver:=true \
    rviz_config:=$(ros2 pkg prefix etrike_common_launch)/share/etrike_common_launch/rviz/etrike.rviz
  # Or, when using the bring-up script:
  ./scripts/lidar_bringup.sh --rviz3d
  ```
  `etrike.rviz` (in `etrike_common_launch/rviz/`) defaults to a
  ThirdPersonFollower 3D view with `PointCloud2` displays for
  `/sensing/lidar/top/pointcloud_raw_ex` and `pointcloud_before_sync`.

  ```text
  # Option B — manual setup in the stock RViz:
  1. Panels → Add → By topic → /sensing/lidar/top/pointcloud_before_sync (PointCloud2)
  2. Set Global Options → Fixed Frame to base_link
  3. Switch the view: View panel → Current View → ThirdPersonFollower (or Orbit)
  ```

  The cloud itself is published in the **`lidar_link`** sensor frame
  (`output_as_sensor_frame:=true` in our container launch); TF
  `lidar_link` ↔ `base_link` exists once the stack is up.
* **Visualization (Windows):** Alternatively, connect the LiDAR directly to a
  Windows PC and use the official **PandarView2** software for quick bench
  testing (manual is in `docs/XT32M/PandarView2_User_Manual_PV2-en-250810.pdf`).

> **Note:** `setup_sensor:=true` (default) makes Nebula configure the sensor
> over PTC (TCP 9347). Verify the sensor streams with:
> `tcpdump -i eno1 udp port 2368 -c 10`.

---

## 2. Environment Mapping

Mapping requires recording the point cloud and feeding it into a SLAM/mapping
pipeline while driving the vehicle.

### 2.1 Start the Sensor and Time Sync
Before recording, activate time synchronization so timestamps don't drift
during movement. The XT32M2X supports **two clock sources** (manual §4.2.3):

* **GNSS** — PPS + NMEA (GPRMC/GPGGA) connected **into the lidar's GNSS
  port** (RS232). The lidar locks its clock to the PPS edge and forwards the
  NMEA data to the host on UDP `10110` (our `gnss_port` setting).
* **PTP (IEEE 1588v2)** — over Ethernet. When PTP is tracking/locked, the
  full second comes from PTP and the **PPS signal is not required**.

To use PTP, a **PTP grandmaster must exist on the network** (e.g., a
GNSS/INS-driven switch or card). The script below only **slaves the Jetson**
to that grandmaster — it does not create one:

```bash
sudo ./scripts/setup_ptp.sh eno1
```

The LiDAR's own PTP role is configured by Nebula when `setup_sensor:=true`
(`ptp_profile:=1588v2`, `ptp_domain:=0`, `ptp_transport_type:=UDP`).

### 2.2 Launch the LiDAR driver
Ensure you are inside the Docker container before launching:
```bash
./docker/shell.sh
# Inside the container:
ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/your-map \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=true
```

### 2.3 Record the Data
While driving the vehicle, record the sensor topics to a ROS bag (from inside the container):
```bash
./docker/shell.sh
# Inside the container:
ros2 bag record \
  /sensing/lidar/top/pointcloud_raw_ex \
  /sensing/lidar/top/pointcloud_before_sync \
  /tf /tf_static \
  /diagnostics
```
* Prefer the **raw** cloud (`pointcloud_raw_ex`) for offline re-processing;
  `pointcloud_before_sync` is the distortion-corrected output and is what
  localization consumes live.
* `/sensing/imu/imu_data` is currently a **stub** (no IMU hardware yet — the
  XT32M2X has no IMU built in) — recording it produces nothing. Add it to the
  bag only after a real IMU is integrated (see Section 6).
* GNSS time-sync packets arrive on UDP `10110` (our `gnss_port` setting) if
  you later feed a GNSS receiver through the sensor's GNSS port.

### 2.4 Process the Map
Process the resulting bag using a mapping algorithm (e.g., NDT Mapping or
LIO-SAM). The integration code sets the `lidar_link` frame at the roof's
optical center (`z=1.7464` = 1.700 m roof + 0.0464 m optical offset, per
`etrike_vehicle_description/urdf/vehicle.xacro`), so the map aligns with the
vehicle footprint.

---

## 3. Simulation Autonomous Driving

In simulation, the real Nebula driver is disabled (`planning_simulator`
sets `launch_sensing:=false`), but the custom sensor kit configuration is
still utilized to validate the pipeline and geometry.

Launch the planning simulator natively on the Jetson:
```bash
./docker/run.sh
```

*(This shortcut launches `planning_simulator.launch.xml` with
`vehicle_model:=etrike_vehicle` and `sensor_model:=etrike_sensor_kit`,
loading the E-Trike vehicle model and the XT32M2X sensor geometry into RViz.)*

> **About the RViz view:** the simulator's default `autoware.rviz` (top-down
> view) is intentional — it is optimized for planning/mission planning in 2D
> (map, routes, path), and in the simulator there is **no real point cloud**
> (the driver is disabled; perception is dummy). To inspect the E-Trike model
> or the lidar geometry in 3D, pass the dedicated config:
> ```bash
> ros2 launch autoware_launch planning_simulator.launch.xml \
>   map_path:=/autoware_map/sample-map-planning \
>   vehicle_model:=etrike_vehicle \
>   sensor_model:=etrike_sensor_kit \
>   rviz_config:=$(ros2 pkg prefix etrike_common_launch)/share/etrike_common_launch/rviz/etrike.rviz
> ```
> (The lidar cloud displays will be empty in simulation — they light up only
> when the real sensor is streaming.)

> **Known limitation:** the planning simulator defaults to
> `localization_sim_mode:=api`, which requires setting the initial pose via
> the Autoware API — the RViz "2D Pose Estimate" tool (`/initialpose`) is
> ignored in that mode, so the vehicle may not move. Pass
> `localization_sim_mode:=pose_topic` to `planning_simulator.launch.xml`
> (or use the Autoware API) to enable RViz pose input.

---

## 4. Real-World Autonomous Driving

For real driving, timing and calibration are paramount to prevent point cloud
distortion, which can negatively impact localization.

### 4.1 Hardware Time Sync
The Jetson's internal clock is not accurate enough for a moving vehicle.
Slave the Jetson and LiDAR to your GNSS-driven PTP grandmaster:
```bash
sudo ./scripts/setup_ptp.sh eno1
```
Verify the sync before driving:
```bash
chronyc tracking          # host clock offset vs. PTP/NTP source
# or, for the ptp4l offset itself:
sudo pmc -u -b 0 'GET CURRENT_DATA_SET'
```
With software timestamping, expect offsets in the tens of microseconds;
sub-microsecond sync requires hardware timestamping (PTP-capable NIC/TSN switch).

### 4.2 Launch Autoware
Start the full stack with the real driver enabled. This routes the LiDAR data
through the Nebula driver and the point-cloud preprocessing pipeline
(cropbox → distortion corrector → ring outlier) into Autoware's localization
and perception modules. Remember to run this inside the container:
```bash
./docker/shell.sh
# Inside the container:
ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/your-map \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=true
```

---

## 5. RViz2 Viewing (Lidar Cloud & 3D Model)

### 5.1 The Problem

The stock RViz config used by Autoware (`autoware.rviz`, shipped with
`autoware_launch`) has two limitations that confuse first-time users:

1. **It is a top-down 2D view** — `Current View: TopDownOrtho`. It is
   optimized for mission planning (map, routes, path) and shows the E-Trike
   model as a flat footprint, not in 3D.
2. **It has no display for the lidar's own point clouds** — the only
   `PointCloud2` displays are `/map/pointcloud_map`,
   `/sensing/lidar/concatenated/pointcloud`, and perception clouds. The
   raw Nebula output (`/sensing/lidar/top/pointcloud_raw_ex`) and the
   preprocessed cloud (`/sensing/lidar/top/pointcloud_before_sync`) are
   **not shown**.

So "open RViz and look at the point cloud" does not work out of the box.

### 5.2 The Solution

A dedicated 3D config ships with the sensor kit:

```
etrike_common_launch/rviz/etrike.rviz
```

It provides:

| Feature | Value |
|---------|-------|
| Default view | `ThirdPersonFollower` (3D, follows `base_link`) |
| Fixed frame | `base_link` |
| Lidar displays (pre-loaded) | `/sensing/lidar/top/pointcloud_raw_ex` (size 2 px) and `/sensing/lidar/top/pointcloud_before_sync` (size 3 px), AxisColor |
| Vehicle model | `RobotModel` (`/robot_description`) |
| Extra | Grid, TF, optional `/map/pointcloud_map` (disabled), 2D Pose Estimate + 2D Goal Pose tools |
| Second saved view | `TopDownOrtho` (switch back for map work) |

### 5.3 How to Use It

#### 5.3.1 Real sensor (bench / vehicle) — 3D lidar cloud

Ensure you are inside the container (`./docker/shell.sh`) when running these:
```bash
# Via the bring-up script (recommended, inside the container):
cd /workspace/av_project
./scripts/lidar_bringup.sh --rviz3d

# Or explicitly with the full stack:
ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/your-map \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=true \
  rviz_config:=$(ros2 pkg prefix etrike_common_launch)/share/etrike_common_launch/rviz/etrike.rviz
```

When the sensor is streaming you will see:

- The E-Trike model (blue body, wheels, roof-mounted lidar cylinder)
- The raw cloud at `/sensing/lidar/top/pointcloud_raw_ex` (sensor frame `lidar_link`)
- The preprocessed cloud at `/sensing/lidar/top/pointcloud_before_sync`
  (`output_as_sensor_frame:=true` in our container launch, so the cloud's own
  frame is `lidar_link`; TF `lidar_link` ↔ `base_link` exists once the stack
  is up)

#### 5.3.2 Simulation (planning simulator) — 3D model view

The simulator disables the real driver (`launch_sensing:=false`), so **no
point cloud exists in simulation** (perception is dummy). To inspect the
E-Trike model / lidar geometry in 3D:

```bash
ros2 launch autoware_launch planning_simulator.launch.xml \
  map_path:=/autoware_map/sample-map-planning \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  rviz_config:=$(ros2 pkg prefix etrike_common_launch)/share/etrike_common_launch/rviz/etrike.rviz
```

The lidar cloud displays stay **empty** in simulation — they populate only
when the physical XT32M2X is connected and streaming. (The default
`./docker/run.sh` keeps the stock top-down view, which is correct for
planning work.)

#### 5.3.3 Manual setup in the stock RViz (no custom config)

If you must use `autoware.rviz` as-is:

1. **Panels → Add → By topic** → `/sensing/lidar/top/pointcloud_before_sync`
   (PointCloud2)
2. Set **Global Options → Fixed Frame** to `base_link`
3. Switch the view: **Views panel → Current View → ThirdPersonFollower**
   (or Orbit)

### 5.4 Verification

The config is covered by the package tests:
`etrike_common_launch/test/test_calibration_and_configs.py`
(`test_etrike_rviz_config_exists_and_is_valid`) — validates that the file
exists, fixed frame is `base_link`, both lidar topics are present, and the
default view is not top-down. See Section 6.1 for how to run the tests.

---

## 6. Further Testing Requirements (Phase 3)

To ensure real-world reliability, conduct the following validation tests on
the physical vehicle:

| Component | Status | Required Validation Test |
|-----------|--------|--------------------------|
| **Firetime Patch** | Critical | Confirm the decoder loaded the CSV at startup — the Nebula log must show `Loaded firetime configuration from .../XT32M2X_Firetime.csv (32 channels)`. If it shows a failure message, the patch/CSV path is wrong. (At e-trike speeds the ~5.6 µs error is too small to see as smearing; treat "curved poles" as a PTP/timestamp symptom instead.) |
| **PTP Clock Sync** | Pending HW | While running `ptp4l` and `chrony`, monitor `chronyc tracking` and `pmc` offsets. With software timestamping, keep the host↔grandmaster offset in the tens-of-µs range; check the LiDAR's PTP state (Free Run / Tracking / Locked / Frozen) in the sensor web control. The lidar timestamp vs. host clock should agree to the same order. |
| **IMU Integration**| Future work | **The XT32M2X does NOT contain an IMU** — it measures only distance, azimuth, and reflectivity (manual §1.5); its GNSS/PTP interfaces are for time synchronization only. An IMU must be sourced and installed as a separate sensor. Replace the IMU stub (`etrike_sensor_kit_launch/launch/imu.launch.xml`) with the real driver. The TIER IV reference unit (Tamagawa AU7684) publishes at 100 Hz; verify `/sensing/imu/imu_data` publishes at the IMU's rated rate and that the `imu_link` frame is wired via TF to `lidar_link` for accurate point-cloud de-skewing. |

### 6.1 Automated Integration Tests
Whenever you change the launch files or configurations, run the built-in unit
tests. They require the ROS 2 environment, so run them inside the container on
the Jetson:

```bash
# Option A — one-shot (recommended): runs in Docker as your user, so test
# artifacts stay yours (no root/aw ownership conflicts on rebuild):
./run_tests.sh

# Option B — interactive:
./docker/shell.sh

# Inside the container:
source /opt/autoware/setup.bash
cd /workspace/autoware
colcon test --packages-select etrike_common_launch etrike_sensor_kit_launch etrike_sensor_kit_description
colcon test-result --verbose
```

---

*Keep this file updated as the project evolves.*
