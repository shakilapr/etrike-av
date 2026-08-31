# Jetson Quick Reference

**Host:** `med1@172.16.25.67`  
**Password:** `med1`

---

## Quick Commands

### SSH Connect
```bash
ssh med1@172.16.25.67
```

### Enter Docker Container
```bash
cd ~/av_project
./docker/shell.sh
```

### Build Custom Packages
```bash
source /opt/autoware/setup.bash
cd /workspace/autoware
colcon build --symlink-install --packages-select \
  etrike_protocol \
  autoware_vehicle_bridge \
  etrike_vehicle_description \
  etrike_vehicle_launch \
  etrike_common_launch \
  etrike_sensor_kit_launch \
  etrike_sensor_kit_description
```

### Run Tests
```bash
# Vehicle bridge
colcon test --packages-select autoware_vehicle_bridge

# E-Trike sensor kit (XT32M2X / Nebula)
colcon test --packages-select \
  etrike_common_launch \
  etrike_sensor_kit_launch \
  etrike_sensor_kit_description

colcon test-result --verbose
```

### Launch Vehicle Bridge
```bash
source install/setup.bash
ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml
```

### Check Diagnostics
```bash
ros2 topic echo /diagnostics
```

### Monitor CAN Bus
```bash
# Real hardware
candump can0

# Virtual CAN
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
candump vcan0
```

---

## Key Paths

| Path | Description |
|------|-------------|
| `~/av_project/autoware/src/our_packages/` | Custom packages |
| `~/av_project/autoware/src/our_packages/autoware_vehicle_bridge/` | Vehicle bridge node |
| `~/av_project/autoware/src/our_packages/etrike_protocol/` | CAN protocol headers |
| `~/av_project/autoware/src/our_packages/etrike_vehicle_description/` | URDF and meshes (includes lidar_link for XT32M2X) |
| `~/av_project/autoware/src/our_packages/etrike_vehicle_launch/` | Vehicle interface launch files |
| `~/av_project/autoware/src/our_packages/etrike_common_launch/` | Nebula Hesai XT32M2X driver launch + configs |
| `~/av_project/autoware/src/our_packages/etrike_sensor_kit_launch/` | Sensor-kit sensing launch entry point |
| `~/av_project/autoware/src/our_packages/etrike_sensor_kit_description/` | Sensor-kit URDF + extrinsic calibration |
| `~/av_project/docker/` | Docker scripts |
| `~/av_project/docs/` | Documentation |

---

## ROS 2 Topics

| Topic | Type | Description |
|-------|------|-------------|
| `/vehicle/status/velocity_status` | `VelocityReport` | Vehicle speed |
| `/vehicle/status/steering_status` | `SteeringReport` | Steering angle |
| `/vehicle/status/gear_status` | `GearReport` | Current gear |
| `/vehicle/status/control_mode` | `ControlModeReport` | AUTO/MANUAL |
| `/diagnostics` | `DiagnosticArray` | System health |

### LiDAR (Hesai XT32M2X via Nebula)

| Topic | Type | Description |
|-------|------|-------------|
| `/sensing/lidar/top/pointcloud_raw_ex` | `PointCloud2` | Raw point cloud from Nebula |
| `/sensing/lidar/top/self_cropped/pointcloud_ex` | `PointCloud2` | Self-cropped (vehicle body removed) |
| `/sensing/lidar/top/mirror_cropped/pointcloud_ex` | `PointCloud2` | Mirror-cropped |
| `/sensing/lidar/top/rectified/pointcloud_ex` | `PointCloud2` | Distortion-corrected |
| `/sensing/lidar/top/pointcloud_before_sync` | `PointCloud2` | Final preprocessed output to Autoware |

### Planning Simulator (with E-Trike vehicle + sensor kit)
```bash
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash
ros2 launch autoware_launch planning_simulator.launch.xml \
  map_path:=/autoware_map/sample-map-planning \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit
```

---

## CAN IDs Reference

| ID | Name | Direction |
|----|------|-----------|
| 0x011 | sys_safety_sts | SYS → Host |
| 0x110 | sys_mode_cmd | Host → SYS |
| 0x121 | rt_motion_rpt | RT → Host |
| 0x210 | rt_state_rpt | RT → Host |
| 0x300 | host_drive_cmd | Host → RT |
| 0x301 | host_brake_req | Host → RT |
| 0x303 | host_steer_cmd | Host → RT |
| 0x600 | sys_diag_rpt | SYS → Host |
| 0x7FD | rt_heartbeat | RT → Host |
| 0x7FE | sys_heartbeat | SYS → Host |
| 0x7FC | host_heartbeat | Host → RT/SYS |

---

*Keep this file updated as the project evolves.*
