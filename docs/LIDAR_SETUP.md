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
sudo ip addr add 192.168.1.10/24 dev eth0
```

Verify the sensor is reachable:
```bash
ping 192.168.1.201
```

Verify UDP packets are arriving:
```bash
sudo tcpdump -i eth0 udp port 2368 -c 10
```

---

## 5. Calibration files

Two device-specific files ship with the sensor (in `docs/XT32M/`):

| File | Purpose | Deployed to |
|------|---------|-------------|
| `XT32M2X_Angle_Correction_File-1.csv` | Per-channel elevation + azimuth offsets | `etrike_common_launch/config/lidar/PandarXT32M.csv` |
| `XT32M2X_Firetime_Correction_File.csv.csv` | Per-channel firing times | **Not yet integrated** (Phase 3 — see below) |

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
  vehicle_model:=sample_vehicle \
  sensor_model:=etrike_sensor_kit
```

Or simply use the updated `docker/run.sh` which now defaults to `sensor_model:=etrike_sensor_kit`.

> **Note:** `planning_simulator.launch.xml` sets `launch_sensing:=false`, so the Nebula driver is not started. This command only validates that the URDF assembles and the sensor-kit packages are discoverable.

### 7.2 Real sensor (bench / vehicle)

```bash
ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/your-map \
  vehicle_model:=sample_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=true
```

Verify the point cloud in RViz:
- Topic: `/sensing/lidar/top/pointcloud_raw_ex` → ... → `/sensing/lidar/top/pointcloud_before_sync`
- Fixed frame: `base_link`
- The cloud should appear in the `lidar_link` frame at the roof position.

---

## 8. PTP time synchronization (Phase 3)

For production, deploy a PTP grandmaster driven by GNSS/INS:

1. **Grandmaster:** GNSS receiver → PTP GM (e.g., an IEEE 1588v2-capable switch or dedicated card).
2. **XT32M2X:** Nebula configures it as a PTP slave via `setup_sensor: true` (`ptp_profile: 1588v2`, `ptp_domain: 0`, `ptp_transport_type: UDP`).
3. **Jetson:** Run `ptp4l` on the lidar-facing NIC and `chrony` to steer the system clock:
   ```bash
   sudo ptp4l -i eth0 -m -S
   sudo chronyd -f /etc/chrony/chrony.conf
   ```

Without PTP, Nebula falls back to the sensor's internal clock. This is fine for bench bring-up but will cause timestamp drift during moving-vehicle localization.

---

## 9. Tests

Each package has pytest tests runnable via `colcon test`:

| Package | Test file | Tests |
|---------|-----------|-------|
| `etrike_common_launch` | `test/test_calibration_and_configs.py` | 5 — CSV channel count, elevation range, azimuth range, YAML loads |
| `etrike_sensor_kit_launch` | `test/test_launch_xml.py` | 6 — XML structure, include wiring, namespace, frame_id |
| `etrike_sensor_kit_description` | `test/test_description.py` | 5 — xacro XML, no lidar_link re-parenting, calibration YAML schema |

Run all E-Trike sensor tests:
```bash
colcon test --packages-select \
  etrike_common_launch \
  etrike_sensor_kit_launch \
  etrike_sensor_kit_description
colcon test-result --verbose
```

**Verified on Jetson Orin (2026-08-17):** All 16 pytest tests pass (0 errors, 0 failures). All linters pass (copyright, lint_cmake, xmllint). URDF xacro assembles correctly with both `sample_vehicle` and `etrike_vehicle` models. TF tree confirmed: `base_footprint → base_link → lidar_link` + `base_link → sensor_kit_base_link`. Planning simulator runs successfully with `vehicle_model:=etrike_vehicle sensor_model:=etrike_sensor_kit`.

---

## 10. Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 0 | Done | Workspace prep — vendored Nebula verified, device CSV deployed |
| 1 | Done | Create `etrike_sensor_kit_launch` (3 packages), wire `docker/run.sh`, build + test on Jetson, verify planning_simulator |
| 2 | Pending | Bench bring-up with real XT32M2X — connect sensor, verify UDP :2368, confirm `/sensing/lidar/top/pointcloud_raw_ex` in RViz |
| 3 | Pending | Firetime-CSV decoder patch, PTP grandmaster, IMU driver, real `autoware.launch.xml` |
