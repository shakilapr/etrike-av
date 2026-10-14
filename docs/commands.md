# E-Trike AV Operational Command Reference

> [!WARNING]
> **MUTUAL EXCLUSION SAFETY RULE:**
> Remote Cockpit and Autoware Universe must **NEVER** run together. Both publish directly to `/control/command/control_cmd` and actuate the vehicle CAN bus (`0x300`, `0x301`, `0x303`). Running both simultaneously causes violent actuator jitter at 55 Hz. Always run `close_everything.sh` before switching modes.

---

# 1. REMOTE CONTROL COCKPIT (MANUAL TELEOPERATION)

### Version 1A: Standalone Bench Remote Cockpit (Default)
Opens the manual teleoperation GUI and connects to the bench actuators (`sim_mode:=true`).

**Linux (Jetson Host):**
```bash
bash scripts/open_remote_control.sh
```

**Windows (PowerShell via SSH):**
```powershell
pwsh scripts/open_remote_control.ps1
```

#### What this opens:
* **Docker Container**: Verifies/starts `autoware_test` with X11 authority.
* **CAN Hardware Interface**: Initializes `can2` at 500 kbps bitrate.
* **GUI Window (Jetson Monitor)**: Qt Remote Cockpit window (`remote_control_gui`) with steering angle gauge, speed slider, PRND gear buttons, turn indicators, and E-Stop button.
* **ROS 2 Manual Control Node**: `remote_control_node` publishing speed and steering commands to `/control/command/control_cmd` at 25 Hz.
* **Vehicle Bridge Node**: `autoware_vehicle_bridge` in `sim_mode:=true` translating commands to CAN frames `0x300`, `0x301`, `0x303`.
* **Safety Isolation**: Terminates active Autoware autonomy nodes (`planning_simulator`, `vehicle_cmd_gate`, `autoware.launch`, `trajectory_follower`) to prevent topic collision.

---

### Version 1B: Live Vehicle Remote Cockpit (Closed-Loop Mode)
For operating on the actual physical vehicle with closed-loop safety heartbeats (`sim_mode:=false`).

**Linux (Jetson Host):**
```bash
bash scripts/open_remote_control.sh can2 false
```

**Windows (PowerShell via SSH):**
```powershell
pwsh scripts/open_remote_control.ps1 -SimMode false
```

#### What this opens:
* Opens everything in Version 1A, but configures `autoware_vehicle_bridge` with `sim_mode:=false`, validating physical BMS/Inverter heartbeats and live steering feedback.

---

### Version 1C: Direct GUI Launch Attached to Existing Bridge
Launches only the Qt Cockpit GUI without touching an already running `vehicle_bridge_node`.

**Linux (Jetson Host):**
```bash
docker exec -it autoware_test bash -c "source /workspace/autoware/install/setup.bash && ros2 launch etrike_remote_control remote_control.launch.py"
```

#### What this opens:
* Opens only the `remote_control_gui` and `remote_control_node`, attaching to the active bridge.

---

### Version 1D: Close Remote Cockpit Only
Stops only the remote control GUI and vehicle bridge without affecting other background tasks.

**Linux (Jetson Host):**
```bash
bash scripts/close_remote_control.sh
```

#### What this closes:
* Terminates `remote_control_gui`, `remote_control_node`, and `autoware_vehicle_bridge`.

---

# 2. AUTOWARE UNIVERSE (AUTONOMOUS DRIVING & SIMULATION)

### Version 2A: Bench Simulation Stack (`--bench`)
Runs the planning simulator + RViz + CAN bridge in simulation mode (`sim_mode:=true`) for bench actuator testing.

**Linux (Jetson Host):**
```bash
bash scripts/open-etrike.sh --bench
```

**Windows (PowerShell via SSH):**
```powershell
ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --bench"
```

#### What this opens:
* **Docker Container**: Ensures `autoware_test` is active with GPU acceleration and CycloneDDS.
* **CAN Hardware Interface**: Initializes `can2` at 500 kbps bitrate.
* **Displays & GUI Windows (Jetson Monitor)**:
  * **RViz2**: Visualizes Lanelet2 map, 3D Bajaj RE exterior mesh, and Autoware State Panel.
  * **AV Dashboard**: Opens maximized Chromium window at `http://localhost:8080`.
* **ROS 2 Autonomy Nodes**: `simple_planning_simulator`, `vehicle_cmd_gate`, `behavior_path_planner`, `motion_velocity_smoother`, and `robot_state_publisher`.
* **Vehicle Bridge Node**: `autoware_vehicle_bridge` (`sim_mode:=true`) actuating CAN `0x300`, `0x301`, `0x303`.
* **Web Services**: FastAPI backend on port `8080`.
* **Safety Isolation**: Terminates any active `remote_control_node`.

---

### Version 2B: Hybrid Bench Stack (`--hybrid-bench`)
Planning simulator + RViz + real Hesai LiDAR + real Kinect v2 Camera + real-time 3D Perception.

**Linux (Jetson Host):**
```bash
bash scripts/open-etrike.sh --hybrid-bench
```

**Windows (PowerShell via SSH):**
```powershell
ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --hybrid-bench"
```

#### What this opens in addition to Version 2A:
* **LiDAR Network**: Sets up `eno1` (192.168.1.10) for LiDAR hardware communication.
* **Sensor Drivers**:
  * Hesai XT32M2X driver streaming point clouds on `/sensing/lidar/top/pointcloud_raw_ex`.
  * Kinect v2 driver streaming depth and color camera images.
* **3D Perception Pipeline**: `bench_perception_node.py` publishing detected 3D bounding boxes to `/perception/object_recognition/detection/objects`.

---

### Version 2C: Full Live Vehicle Hardware Stack (`--live`)
Full autonomous driving pipeline on the real vehicle (LiDAR + Camera + CenterPoint + NDT + Closed-loop Bridge).

**Linux (Jetson Host):**
```bash
bash scripts/open-etrike.sh --live
```

**Windows (PowerShell via SSH):**
```powershell
ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --live"
```

#### What this opens:
* Full Autoware Universe (`autoware.launch.xml`) with live NDT localization, CenterPoint 3D obstacle detection, behavior path planning, MPC trajectory follower, and `autoware_vehicle_bridge` in production mode (`sim_mode:=false`).

---

### Version 2D: Software-Only Universe (`--universe`)
Simulator + RViz without initializing hardware CAN adapters.

**Linux (Jetson Host):**
```bash
bash scripts/open-etrike.sh --universe
```

**Windows (PowerShell via SSH):**
```powershell
ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --universe"
```

#### What this opens:
* Pure simulation in RViz2 without hardware communication.

---

# 3. THE DASHBOARD (TELEMETRY & BIT-LEVEL DIAGNOSTICS)

### Version 3A: AV 3D Cockpit Display on Jetson Monitor
Launches the 3D digital twin HUD in an application window on the physical monitor.

**Linux (Jetson Host):**
```bash
bash scripts/open_av_dashboard.sh
```

#### What this opens:
* **Web Services**: Python/FastAPI backend on port `8080`.
* **GUI Window**: Maximized Chromium application window opening `http://localhost:8080`.
* **Visuals**: Three.js 3D vehicle model, speedometer/tachometer HUD, ISO 2575 telltales, DTC fault matrix, and perception object visualizer.

---

### Version 3B: AV 3D Cockpit Headless / Server-Only
Runs the backend server without launching a local browser window (for remote viewing across network).

**Linux (Jetson Host):**
```bash
bash scripts/run_av_dashboard.sh can2 8080
```

**Windows Local:**
```powershell
pwsh scripts/run_av_dashboard.ps1
```

* Accessible in any web browser at: `http://172.16.25.67:8080` (or `http://localhost:8080`).

---

### Version 3C: CAN Watcher Display on Jetson Monitor
Launches the bit-level engineering CAN frame matrix in an application window on the monitor.

**Linux (Jetson Host):**
```bash
bash scripts/open_can_watch.sh
```

#### What this opens:
* **Web Services**: Python/FastAPI backend on port `8000`.
* **GUI Window**: Maximized Chromium application window opening `http://localhost:8000`.
* **Visuals**: Real-time bit matrix, frame frequencies (Hz), error frame counters, and byte decoders.

---

### Version 3D: CAN Watcher Headless / Server-Only
Runs the CAN Watcher backend server without opening a local browser window.

**Linux (Jetson Host):**
```bash
bash scripts/run_can_watcher.sh can2 8000
```

**Windows Local:**
```powershell
pwsh scripts/run_can_watcher.ps1
```

* Accessible in any web browser at: `http://172.16.25.67:8000` (or `http://localhost:8000`).

---

# 4. THE DASHBOARD + UNIVERSE (COMBINED LAUNCHES)

### Version 4A: Hybrid Universe + 3D Cockpit on Monitor (Standard Bench)
Opens the full hybrid simulator + sensors + 3D Cockpit on the display in a single command.

**Linux (Jetson Host):**
```bash
bash scripts/open-etrike.sh --hybrid-bench
```

**Windows (PowerShell via SSH):**
```powershell
ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --hybrid-bench"
```

#### What this opens:
* RViz2 window with Lanelet2 map and planning path.
* Hesai LiDAR point clouds & Kinect v2 depth images.
* Real-time 3D perception bounding boxes.
* AV Dashboard Chromium app window at `http://localhost:8080`.
* Hardware CAN bus `can2` actuating wheels, steering, and brakes.

---

### Version 4B: Pure Bench Universe + 3D Cockpit on Monitor
Opens simulated Autoware kinematics + 3D Cockpit on the display.

**Linux (Jetson Host):**
```bash
bash scripts/open-etrike.sh --bench
```

**Windows (PowerShell via SSH):**
```powershell
ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --bench"
```

#### What this opens:
* RViz2 window + AV Dashboard Chromium window + CAN bridge in simulation mode.

---

### Version 4C: Universe + BOTH Dashboards (3D Cockpit on 8080 & CAN Watcher on 8000)
For complete engineering testing with full 3D perception and bit-level CAN diagnostics simultaneously.

**Linux (Jetson Host) - Run in two steps:**
```bash
# Step 1: Launch Universe + 3D Cockpit
bash scripts/open-etrike.sh --bench

# Step 2: Open CAN Watcher Matrix
bash scripts/open_can_watch.sh
```

#### What this opens:
* RViz2 window for Autoware planning.
* Chromium window at `http://localhost:8080` (AV Dashboard 3D HUD).
* Chromium window at `http://localhost:8000` (CAN Watcher Bit Matrix).
* Active CAN bus `can2` carrying all vehicle telemetry.

---

# 5. CLOSE ALL (SYSTEM TEARDOWN VERSIONS)

### Version 5A: Clean Teardown (Default - Restarts Container Clean)
Recommended daily stop command. Terminates all processes, drops CAN, and flushes `/dev/shm` while leaving container ready for instant next start.

**Linux (Jetson Host):**
```bash
bash scripts/close_everything.sh
```
*(Or convenience shortcut: `bash scripts/close-etrike.sh`)*

**Windows (PowerShell via SSH):**
```powershell
pwsh scripts/close_everything.ps1
```

#### What this closes:
* **Autoware & ROS 2**: `planning_simulator`, `autoware.launch`, `rviz2`, `component_container`, `robot_state_publisher`, and `ros2 daemon`.
* **Remote Cockpit**: `remote_control_gui`, `remote_control_node`, and `bench_remote_control`.
* **Vehicle Bridge**: `vehicle_bridge_node`.
* **Perception & Sensors**: Hesai driver, Kinect driver, and `bench_perception_node`.
* **Web & GUI**: Ports `8080` and `8000` servers, Chromium app windows, and Electron.
* **CAN Hardware**: `canalyst_socketcan_daemon.py`, `slcand`, and brings down `can2`/`canable0`.
* **Container**: Cleanly restarts `autoware_test` to flush memory.

---

### Version 5B: Teardown + Stop Docker Container
Stops all services and powers down the Docker container (`docker stop`).

**Linux (Jetson Host):**
```bash
bash scripts/close_everything.sh --stop-container
```

**Windows (PowerShell via SSH):**
```powershell
pwsh scripts/close_everything.ps1 -StopContainer
```

#### What this closes:
* Closes all stack processes, drops CAN, and stops `autoware_test`.

---

### Version 5C: Total Wipeout + Remove Docker Container
Forcefully terminates all services and completely deletes the container instance (`docker rm -f`).

**Linux (Jetson Host):**
```bash
bash scripts/close_everything.sh --rm-container
```
*(Or legacy shortcut: `bash scripts/kill_all.sh`)*

**Windows (PowerShell via SSH):**
```powershell
pwsh scripts/close_everything.ps1 -RmContainer
```

#### What this closes:
* Closes all stack processes, drops CAN, and forcefully deletes `autoware_test`.
