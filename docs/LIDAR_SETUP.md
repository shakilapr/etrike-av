# Hesai XT32M2X LiDAR — Autoware Integration Setup

**Date:** 2026-08-17  
**Sensor:** Hesai XT32M2X (32-channel mechanical lidar)  
**Driver:** Nebula (`sensor_model: PandarXT32M`, which maps to the `PacketXT32M2X` decoder)  
**Target platform:** Jetson Orin + Docker (`universe-cuda-humble`)

---

## 1. Architecture

```
                     GNSS / INS
                         │
                    UTC / PPS
                         │
                         ▼
                PTP Grandmaster
                         │
                   IEEE 1588v2
                         │
                  Ethernet Switch
                  ┌──────┴──────┐
                  │             │
                  ▼             ▼
              XT32M2X      Jetson Orin
              PTP Slave    PTP Slave
                  │
            UDP :2368
                  │
                  ▼
            ┌──────────┐
            │  Nebula  │   (CPU, no CUDA needed)
            └────┬─────┘
                 │
      sensor_msgs/PointCloud2
      (frame_id: lidar_link)
                 │
                 ▼
       Autoware pointcloud
       preprocessing pipeline
                 │
          ┌──────┴──────┐
          ▼             ▼
     Localization    Perception
```

**Key design decisions:**

- **Nebula over Hesai's own ROS driver.** Nebula is TIER IV's recommended sensor driver for Autoware; its `PointCloud2` fields and per-point timestamps are developed against Autoware's expectations. The vendored Nebula in `autoware/src/sensor_component/external/nebula` already defines `PacketXT32M2X` and routes `sensor_model: PandarXT32M` to it — no new decoder is needed.
- **CPU-only lidar processing.** Nebula has no CUDA dependency. The Jetson GPU stays free for perception/localization. (This supersedes earlier discussion about enabling CUDA for the Hesai driver — that applies to Hesai's own SDK, not Nebula.)
- **PTP at the network layer.** Nebula's `setup_sensor: true` configures the sensor-side PTP profile/domain/transport, but the clock itself comes from a PTP grandmaster on the vehicle network. Run `ptp4l`/`chrony` on the Jetson as a PTP slave.

---

## 2. Packages created

All three live under `autoware/src/our_packages/`:

| Package | Role |
|---------|------|
| `etrike_common_launch` | Nebula container launch (with calibration-override arg), Hesai XT32M2X driver launch, preprocessor configs, device-specific angle calibration CSV |
| `etrike_sensor_kit_launch` | `sensing.launch.xml` entry point + `lidar.launch.xml` (namespace `lidar/top`) |
| `etrike_sensor_kit_description` | URDF `sensor_kit.xacro` + `sensors.xacro` + calibration yamls |

Autoware's `tier4_sensing_launch` resolves `$(find-pkg-share $(var sensor_model)_launch)/launch/sensing.launch.xml`, so `sensor_model:=etrike_sensor_kit` automatically discovers our kit.

Autoware's `tier4_vehicle_launch` resolves `$(find-pkg-share $(var sensor_model)_description)/urdf/sensors.xacro` and `.../config` for the robot_state_publisher.

---

## 3. Frame and TF

The `lidar_link` frame is already defined in `etrike_vehicle_description/urdf/vehicle.xacro:187` at the roof optical center:

```
base_link → lidar_joint (fixed) → lidar_link
  origin: x=0.575  y=0.0  z=1.700+0.0464=1.7464
```

The Nebula driver publishes `PointCloud2` with `frame_id: lidar_link`. The sensor kit description creates `sensor_kit_base_link` (identity to `base_link`) but deliberately does **not** re-parent `lidar_link` — it is already in the TF tree via `vehicle.xacro`.

---

## 4. Network configuration

| Parameter | Value | Notes |
|-----------|-------|-------|
| `sensor_ip` | `192.168.1.201` | XT32M2X default |
| `host_ip` | `192.168.1.10` | Jetson Orin |
| `data_port` | `2368` | Hesai standard point-cloud UDP port |
| `gnss_port` | `10110` | GNSS/PTP sync port |

On the Jetson, set a static IP on the lidar-facing interface:
```bash
sudo ip addr add 192.168.1.10/24 dev eno1
```

Verify the sensor is reachable:
```bash
ping 192.168.1.201
```

Verify UDP packets are arriving:
```bash
sudo tcpdump -i eno1 udp port 2368 -c 10
```

---

## 5. Calibration files

Two device-specific files ship with the sensor (in `docs/XT32M/`):

| File | Purpose | Deployed to |
|------|---------|-------------|
| `XT32M2X_Angle_Correction_File-1.csv` | Per-channel elevation + azimuth offsets | `etrike_common_launch/config/lidar/PandarXT32M.csv` |
| `XT32M2X_Firetime_Correction_File.csv.csv` | Per-channel firing times | Integrated via `firetime_file_path` → `etrike_common_launch/config/lidar/XT32M2X_Firetime.csv` |

The angle calibration is loaded by Nebula via the `calibration_file_path` launch arg (defaults to our package's copy). To fall back to the generic vendored calibration, pass `calibration_file_path:=` (empty string).

**Known limitation:** Nebula's `PandarXT32M` decoder uses a hard-coded firing-time formula (`368 + 2888 * channel_id` ns) instead of loading the device's firetime CSV. The device CSV differs by ~5.6 µs mean. This is acceptable for stationary/low-speed validation but must be patched before high-speed localization. See Phase 3 in the plan.

---

## 6. Building

On the Jetson, inside the Docker container:

```bash
# Enter the container
~/av_project/docker/shell.sh

# Build only the new E-Trike sensor packages + vendored Nebula
cd /workspace/autoware
colcon build --symlink-install \
  --packages-select \
    etrike_common_launch \
    etrike_sensor_kit_launch \
    etrike_sensor_kit_description \
    nebula nebula_hesai nebula_hesai_decoders nebula_hesai_common nebula_hesai_hw_interfaces

source install/setup.bash
```

---

## 7. Running

### 7.1 Planning simulator (no sensor, validates URDF + launch loading)

```bash
ros2 launch autoware_launch planning_simulator.launch.xml \
  map_path:=/autoware_map/sample-map-planning \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit
```

Or simply use the updated `docker/run.sh` which now defaults to `vehicle_model:=etrike_vehicle sensor_model:=etrike_sensor_kit`.

> **Note:** `planning_simulator.launch.xml` sets `launch_sensing:=false`, so the Nebula driver is not started. This command only validates that the URDF assembles and the sensor-kit packages are discoverable.

### 7.2 Real sensor (bench / vehicle)

```bash
ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/your-map \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=true
```

Or use the automated bring-up script:
```bash
./scripts/lidar_bringup.sh          # full bring-up
./scripts/lidar_bringup.sh --rviz3d # full bring-up with the 3D lidar RViz config
./scripts/lidar_bringup.sh --check-only  # network/UDP check only
./scripts/lidar_bringup.sh --no-driver   # pipeline without sensor
```

Verify the point cloud in RViz (**the stock view is top-down and does not show
the lidar cloud** — use `etrike.rviz` for a 3D view, see below):
- Topic: `/sensing/lidar/top/pointcloud_raw_ex` → ... → `/sensing/lidar/top/pointcloud_before_sync`
- Fixed frame: `base_link`
- The cloud should appear in the `lidar_link` frame at the roof position.

The default `autoware.rviz` used by `autoware.launch.xml` is a 2D top-down
(`TopDownOrtho`) view and has no display for the lidar's own clouds. Use the
dedicated 3D config shipped in `etrike_common_launch/rviz/etrike.rviz`, which
defaults to ThirdPersonFollower and pre-adds the `pointcloud_raw_ex` +
`pointcloud_before_sync` displays (full guide: `docs/HESAI_GUIDE.md` Section 5):
```bash
ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/your-map \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=true \
  rviz_config:=$(ros2 pkg prefix etrike_common_launch)/share/etrike_common_launch/rviz/etrike.rviz
```
To add it manually instead: Panels → Add → By topic →
`/sensing/lidar/top/pointcloud_before_sync` (PointCloud2), set the fixed frame
to `base_link`, and switch the current view to ThirdPersonFollower/Orbit.

### 7.3 Network setup

Before connecting the sensor, configure the Jetson's Ethernet interface:
```bash
sudo ./scripts/setup_lidar_network.sh [INTERFACE] [HOST_IP] [SENSOR_IP]
# Defaults: eno1, 192.168.1.10, 192.168.1.201
```

---

## 8. PTP time synchronization

For production, deploy a PTP grandmaster driven by GNSS/INS:

1. **Grandmaster:** GNSS receiver → PTP GM (e.g., an IEEE 1588v2-capable switch or dedicated card).
2. **XT32M2X:** Nebula configures it as a PTP slave via `setup_sensor: true` (`ptp_profile: 1588v2`, `ptp_domain: 0`, `ptp_transport_type: UDP`).
3. **Jetson:** Run the PTP setup script:
   ```bash
   sudo ./scripts/setup_ptp.sh eno1
   ```
   This installs `config/ptp4l.conf` and `config/chrony.conf`, starts `ptp4l` (PTP slave) + `phc2sys` (HW clock sync) + `chrony` (system clock management).

Without PTP, Nebula falls back to the sensor's internal clock. This is fine for bench bring-up but will cause timestamp drift during moving-vehicle localization.

---

## 9. Firetime CSV support (Phase 3 — done)

Nebula's `PandarXT32M` decoder originally used a hard-coded firing-time formula (`368 + 2888 * channel_id` ns). The device's actual firing times (from `XT32M2X_Firetime_Correction_File.csv.csv`) differ by ~5.6 µs mean, causing per-point timestamp errors that affect distortion correction and localization.

**Solution:** A patch to vendored Nebula adds per-channel firetime CSV loading:
- `HesaiFiretimeConfiguration` struct loads `Channel, fire time(us)` CSV files
- `PandarXT32M::set_firetime_configuration()` stores per-channel offsets
- `HesaiDecoder` constructor loads the CSV if `firetime_path` is set
- `hesai_ros_wrapper.cpp` declares the `firetime_file_path` ROS parameter

**Applying the patch:** Since vendored Nebula is gitignored, use the idempotent apply script:
```bash
./patches/apply_nebula_firetime_patch.sh
colcon build --symlink-install --packages-select nebula_hesai_common nebula_hesai_decoders nebula_hesai
```

The launch files automatically pass `firetime_file_path` to the Nebula node, defaulting to `etrike_common_launch/config/lidar/XT32M2X_Firetime.csv`.

---

## 10. Tests

Each package has pytest tests runnable via `colcon test`:

| Package | Test file | Tests |
|---------|-----------|-------|
| `etrike_common_launch` | `test/test_calibration_and_configs.py` | 9 — angle CSV (channels, elevation, azimuth), firetime CSV (channels, values, formula diff), YAML loads, etrike.rviz validation |
| `etrike_sensor_kit_launch` | `test/test_launch_xml.py` | 7 — XML structure, include wiring (lidar, IMU, velocity), namespace, frame_id |
| `etrike_sensor_kit_description` | `test/test_description.py` | 5 — xacro XML, no lidar_link re-parenting, calibration YAML schema |

Run all E-Trike sensor tests (on the Jetson):
```bash
# One-shot in Docker as your user (no ownership conflicts):
./run_tests.sh

# Or interactively inside the container:
./docker/shell.sh
# Inside the container:
source /opt/autoware/setup.bash
cd /workspace/autoware
colcon test --packages-select \
  etrike_common_launch \
  etrike_sensor_kit_launch \
  etrike_sensor_kit_description
colcon test-result --verbose
```

**Verified on Jetson Orin (2026-08-17):** All 21 pytest tests pass (0 errors, 0 failures). All linters pass. Nebula compiles with firetime patch (3 packages). URDF xacro assembles correctly. TF tree confirmed: `base_footprint → base_link → lidar_link` + `base_link → sensor_kit_base_link`. Planning simulator runs successfully with `vehicle_model:=etrike_vehicle sensor_model:=etrike_sensor_kit`.

---

## 11. Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 0 | Done | Workspace prep — vendored Nebula verified, device CSV deployed |
| 1 | Done | Create `etrike_sensor_kit_launch` (3 packages), wire `docker/run.sh`, build + test on Jetson, verify planning_simulator |
| 2 | Ready | Bench bring-up with real XT32M2X — scripts ready (`lidar_bringup.sh`, `setup_lidar_network.sh`), just connect sensor |
| 3 | Partial | Firetime-CSV patch done, PTP config done, IMU stub done. Remaining: PTP grandmaster hardware, real IMU driver, full `autoware.launch.xml` testing |

> **IMU note:** The Hesai XT32M2X contains **no IMU** (it measures only
> distance, azimuth, and reflectivity). The IMU is a separate sensor that
> must be sourced and integrated — the current `imu.launch.xml` is only a
> placeholder stub for future work.
