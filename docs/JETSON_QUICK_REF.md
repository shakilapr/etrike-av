# Jetson Quick Reference

**Host:** `med1@172.16.25.56`  
**Password:** `med1`

---

## Quick Commands

### SSH Connect
```bash
ssh med1@172.16.25.56
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
  etrike_vehicle_launch
```

### Run Tests
```bash
colcon test --packages-select autoware_vehicle_bridge
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
| `~/av_project/autoware/src/our_packages/etrike_vehicle_description/` | URDF and meshes |
| `~/av_project/autoware/src/our_packages/etrike_vehicle_launch/` | Launch files |
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
