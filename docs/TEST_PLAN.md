# E-Trike Test Plan

**Date:** 2026-08-17  
**Target:** Jetson Orin (`med1@172.16.25.56`)

---

## Test Results Summary

| Category | Status | Notes |
|----------|--------|-------|
| Build | ✅ PASS | All packages compile on Jetson (Humble) |
| Unit Tests | ✅ PASS | motion_conversion tests pass |
| Lifecycle | ✅ PASS | Node activates correctly |
| CAN Output | ✅ PASS | 0x300, 0x303, 0x7FC frames verified |
| Safety Gate | ✅ PASS | Blocks when feedback missing |
| Engage | ✅ PASS | Engage/disengage works |
| Autoware Integration | ✅ PASS | 106 nodes start with etrike_vehicle |
| Emergency Stop | ⚠️ HIL | Needs real hardware verification |
| Heartbeat Timeout | ⚠️ HIL | Needs real RT/SYS verification |

---

## 1. Prerequisites

### 1.1 SSH Access

```bash
ssh med1@172.16.25.56
# Password: med1
```

### 1.2 Environment Setup

```bash
cd ~/av_project
./docker/shell.sh

# Inside container:
source /opt/autoware/setup.bash
cd /workspace/autoware
```

---

## 2. Build Tests

### 2.1 Build All Custom Packages

```bash
colcon build --symlink-install --packages-select \
  etrike_protocol \
  autoware_vehicle_bridge \
  etrike_vehicle_description \
  etrike_vehicle_launch \
  etrike_common_launch
```

**Expected:** All packages build without errors. ✅ Verified

### 2.2 Build Verification

```bash
source install/setup.bash
ros2 pkg list | grep etrike
ros2 pkg list | grep autoware_vehicle_bridge
```

**Expected:**
- `autoware_vehicle_bridge`
- `etrike_protocol`
- `etrike_vehicle_description`
- `etrike_vehicle_launch`

---

## 3. Unit Tests

### 3.1 Motion Conversion Test

```bash
colcon test --packages-select autoware_vehicle_bridge
colcon test-result --verbose
```

**Expected:** `test_motion_conversion` passes all assertions.

### 3.2 Manual Test Execution

```bash
./build/autoware_vehicle_bridge/test_motion_conversion
```

**Expected:** Exit code 0 (all asserts pass).

---

## 4. Integration Tests

### 4.1 Node Startup Test

```bash
# Terminal 1: Launch node
ros2 run autoware_vehicle_bridge vehicle_bridge_node --ros-args \
  -p can_interface:=vcan0
```

**Expected:** Node starts, logs "CAN RX thread started", enters lifecycle.

### 4.2 Lifecycle Test

```bash
# Terminal 2: Check lifecycle
ros2 lifecycle get /vehicle_bridge
```

**Expected:** `unconfigured` → `inactive` → `active` (via launch file auto-transitions).

### 4.3 Parameter Loading Test

```bash
ros2 param get /vehicle_bridge wheel_base
ros2 param get /vehicle_bridge max_steering_angle
ros2 param get /vehicle_bridge rt_heartbeat_timeout_ms
```

**Expected:** Returns configured values from `etrike.param.yaml`.

---

## 5. CAN Interface Tests

### 5.1 Virtual CAN Setup (No Hardware)

```bash
# Load vcan module
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan
sudo ip link set up vcan0
```

### 5.2 CAN Frame Injection Test

```bash
# Install can-utils
sudo apt-get install -y can-utils

# Inject RT heartbeat (0x7FD)
cansend vcan0 7FD#01.00

# Inject SYS safety status (0x011)
cansend vcan0 011#00.01.00

# Inject RT motion report (0x121)
cansend vcan0 121#00.00.00.00.00.00.00.00
```

### 5.3 Monitor CAN Output

```bash
# Monitor all CAN traffic
candump vcan0

# Filter for specific IDs
candump vcan0,7FC:7FF    # Host heartbeat
candump vcan0,300:303    # Host commands
```

---

## 6. RT Compatibility Tests

### 6.1 RT Heartbeat Liveness

**Setup:** Inject RT heartbeat at 1Hz.

```bash
# Inject RT heartbeat every 1s
while true; do cansend vcan0 7FD#01.00; sleep 1; done
```

**Verify:**
```bash
ros2 topic echo /diagnostics
```

**Expected:** "RT Heartbeat" status = OK.

### 6.2 RT Heartbeat Timeout

**Setup:** Stop injecting RT heartbeat.

**Verify:** After 1500ms:
```bash
ros2 topic echo /diagnostics
```

**Expected:** "RT Heartbeat" = WARN "missing, frozen, or timeout".

### 6.3 RT State Report

**Setup:** Inject RT state report (0x210).

```bash
# Mode=AUTO, safety_state=0
cansend vcan0 210#01.00.00.00.00.00
```

**Verify:**
```bash
ros2 topic echo /vehicle/status/control_mode
```

**Expected:** `mode = 1` (AUTONOMOUS).

### 6.4 RT Motion Report

**Setup:** Inject RT motion report (0x121).

```bash
# speed=1000mm/s, yaw=0, gear=DRIVE
cansend vcan0 121#E8.03.00.00.01.00.00.00
```

**Verify:**
```bash
ros2 topic echo /vehicle/status/velocity_status
```

**Expected:** `longitudinal_velocity ≈ 1.0`.

---

## 7. SYS Compatibility Tests

### 7.1 SYS Safety Status

**Setup:** Inject SYS safety status (0x011) with ESTOP clear.

```bash
# estop_active=0, heartbeat_ok=1
cansend vcan0 011#00.01.00
```

**Verify:**
```bash
ros2 topic echo /diagnostics
```

**Expected:** "SYS ESTOP" = OK "clear", "SYS Heartbeat" = OK "alive".

### 7.2 SYS ESTOP Active

**Setup:** Inject SYS safety status with ESTOP active.

```bash
# estop_active=1, heartbeat_ok=1
cansend vcan0 011#01.01.00
```

**Verify:** Bridge stops sending drive commands.

### 7.3 SYS Status Timeout

**Setup:** Stop injecting SYS safety status.

**Verify:** After 500ms:
```bash
ros2 topic echo /diagnostics
```

**Expected:** "SYS status" = WARN "missing or timeout".

### 7.4 SYS Diagnostics Report

**Setup:** Inject SYS diagnostic report (0x600).

```bash
cansend vcan0 600#00.00.00.00.00.00.00.00
```

**Verify:** Diagnostic values published.

---

## 8. Safety Gate Tests

### 8.1 Full Gate Ready

**Setup:** Inject all required feedback:
1. RT heartbeat (0x7FD)
2. SYS safety status (0x011) with estop=0, heartbeat_ok=1
3. RT state report (0x210) with mode=AUTO
4. RT motion report (0x121)

**Verify:** Bridge accepts control commands.

### 8.2 Gate Blocked - Missing RT Heartbeat

**Setup:** Stop RT heartbeat injection.

**Verify:** Bridge sends neutral drive, invalid steering.

### 8.3 Gate Blocked - SYS ESTOP

**Setup:** Inject SYS with estop_active=1.

**Verify:** Bridge stops accepting commands.

### 8.4 Gate Blocked - Not Engaged

**Setup:** Don't publish engage message.

**Verify:** Bridge sends neutral drive.

### 8.5 Gate Blocked - Command Timeout

**Setup:** Stop publishing control commands.

**Verify:** After 500ms, bridge sends neutral drive.

---

## 9. Vehicle Interface Launch Test

### 9.1 Full Launch

```bash
ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml \
  can_interface:=vcan0
```

**Expected:** Bridge node starts, auto-configures, auto-activates.

### 9.2 Topic Verification

```bash
ros2 topic list | grep vehicle
```

**Expected:**
- `/vehicle/status/velocity_status`
- `/vehicle/status/steering_status`
- `/vehicle/status/gear_status`
- `/vehicle/status/control_mode`
- `/vehicle/status/turn_indicators_status`
- `/vehicle/status/hazard_lights_status`
- `/diagnostics`

---

## 10. URDF Tests

### 10.1 URDF Validation

```bash
ros2 launch etrike_vehicle_description view_urdf.launch.py
```

**Expected:** RViz opens with E-Trike model visible.

### 10.2 Joint State Publisher

```bash
ros2 run joint_state_publisher_gui joint_state_publisher_gui \
  --ros-args -p source_list:=['joint_states']
```

**Expected:** Sliders control steering and wheel rotation.

---

## 11. Hardware-Specific Tests

### 11.1 Real CAN Interface

```bash
# Check CAN interface exists
ip link show can0

# Bring up CAN interface
sudo ip link set up can0 type can bitrate 500000
```

### 11.2 Hardware-in-the-Loop

**Setup:** Connect to real RT/SYS controllers.

**Verify:**
1. RT heartbeat received
2. SYS safety status received
3. Control commands sent and acknowledged
4. Feedback loops closed

---

## 12. Automated Test Script

Create `scripts/run_tests.sh`:

```bash
#!/bin/bash
set -e

echo "=== E-Trike Test Suite ==="

# Build
echo "[1/8] Building packages..."
colcon build --symlink-install --packages-select \
  etrike_protocol autoware_vehicle_bridge \
  etrike_vehicle_description etrike_vehicle_launch

# Source
source install/setup.bash

# Unit tests
echo "[2/8] Running unit tests..."
colcon test --packages-select autoware_vehicle_bridge
colcon test-result --verbose

# Virtual CAN setup
echo "[3/8] Setting up virtual CAN..."
sudo modprobe vcan
sudo ip link add dev vcan0 type vcan 2>/dev/null || true
sudo ip link set up vcan0

# Launch node
echo "[4/8] Launching vehicle bridge..."
ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml \
  can_interface:=vcan0 &
BRIDGE_PID=$!
sleep 3

# Check node is running
echo "[5/8] Checking node status..."
ros2 node list | grep vehicle_bridge

# Inject feedback
echo "[6/8] Injecting CAN feedback..."
cansend vcan0 7FD#01.00 &
cansend vcan0 011#00.01.00 &
cansend vcan0 210#01.00.00.00.00.00 &
cansend vcan0 121#E8.03.00.00.01.00.00.00 &
sleep 2

# Check diagnostics
echo "[7/8] Checking diagnostics..."
ros2 topic echo /diagnostics --once

# Cleanup
echo "[8/8] Cleaning up..."
kill $BRIDGE_PID 2>/dev/null || true
wait $BRIDGE_PID 2>/dev/null || true

echo "=== Tests Complete ==="
```

---

## 13. Test Matrix Summary

| Test Category | Tests | Priority |
|---------------|-------|----------|
| Build | 2 | Critical |
| Unit | 1 | Critical |
| Integration | 3 | High |
| RT Compatibility | 4 | High |
| SYS Compatibility | 4 | High |
| Safety Gate | 5 | Critical |
| Launch | 2 | High |
| URDF | 2 | Medium |
| Hardware | 2 | Low |

**Total:** 25 tests

---

## 14. Known Issues

| Issue | Impact | Workaround |
|-------|--------|------------|
| vcan0 not persistent | Lost after reboot | Add to `/etc/modules-load.d/` |
| SYS heartbeat not monitored | Safety gap | Add HeartbeatMonitor for 0x7FE |
| No automated HIL tests | Manual verification | Use vcan for CI, real CAN for HIL |

---

*Generated for E-Trike AV Project v0.1.0*
