# E-Trike AV Operational Command Reference

> [!WARNING]
> **MUTUAL EXCLUSION SAFETY RULE:**
> Remote Cockpit and Autoware Universe must **NEVER** run together. Both publish directly to `/control/command/control_cmd` and actuate the CAN bus (`0x300`, `0x301`, `0x303`). Running both simultaneously causes violent actuator jitter at 55 Hz. Always run `close_everything.sh` before switching modes.

---

# WORKFLOW 1: Autoware Universe (Autonomous Simulation & Bench Testing)

### Step 1: Open Autoware Universe Bench Stack

**On Jetson Linux Host:**
```bash
bash scripts/open-etrike.sh --bench
```

**From Windows PowerShell (via SSH):**
```powershell
ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --bench"
```

#### What this opens:
* **Docker Container**:
  * `autoware_test` with NVIDIA GPU runtime, X11 socket forwarding, host networking, and CycloneDDS.
* **CAN Hardware Interface**:
  * Initializes USB-CAN adapter on `can2` (or `canable0`) at 500 kbps bitrate.
* **Displays & GUI Windows (Jetson Monitor)**:
  * **RViz2**: Displays Lanelet2 vector road map, 3D Bajaj RE vehicle mesh, TF frames, and Autoware State Panel (for initial 2D Pose, 2D Goal, and Engage buttons).
  * **AV Dashboard**: Opens maximized Chromium app window at `http://localhost:8080`.
* **ROS 2 Autonomy Nodes (Inside Container)**:
  * `planning_simulator.launch.xml` (`simple_planning_simulator`)
  * `vehicle_cmd_gate` (arbitrates vehicle trajectory and emergency stop)
  * `behavior_path_planner` & `motion_velocity_smoother`
  * `robot_state_publisher` (URDF model: `base_link`, sensors, wheels)
* **Vehicle Bridge Node**:
  * `autoware_vehicle_bridge` in `sim_mode:=true`: Translates virtual commands into CAN frames:
    * `0x300` (`HOST_DRIVE_CMD`): wheel speed & PRND gear
    * `0x303` (`HOST_STEER_CMD`): steering angle
    * `0x301` (`HOST_BRAKE_REQ`): brake pressure
* **Web Services**:
  * Python FastAPI / Uvicorn server on port `8080`.
* **Safety Isolation**:
  * Automatically stops any leftover `remote_control_node` to prevent topic collision.

---

### Step 1b (Alternative): Open Hybrid Bench Stack (With Physical LiDAR & Camera)

**On Jetson Linux Host:**
```bash
bash scripts/open-etrike.sh --hybrid-bench
```

**From Windows PowerShell (via SSH):**
```powershell
ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --hybrid-bench"
```

#### What this opens in addition to Step 1:
* **LiDAR Ethernet Network**:
  * Probes and configures `eno1` (192.168.1.10) for LiDAR hardware communication.
* **Physical Sensor Drivers**:
  * **Hesai XT32M2X LiDAR driver**: Publishes 360° point cloud on `/sensing/lidar/top/pointcloud_raw_ex`.
  * **Kinect v2 Camera driver**: Claims USB `045e:02d8` and publishes RGB-D depth and color streams.
* **Real-Time 3D Perception**:
  * `bench_perception_node.py`: Runs spatial hashing clustering + HOG pedestrian detector, publishing detected 3D bounding boxes to `/perception/object_recognition/detection/objects`.

---

### Step 2 (Optional): Open CAN Watcher Bit Matrix

**On Jetson Linux Host:**
```bash
bash scripts/open_can_watch.sh
```

**From Windows PowerShell (Local Dev Server):**
```powershell
pwsh scripts/run_can_watcher.ps1
```

#### What this opens:
* **Web Services**:
  * FastAPI CAN Watcher server listening on port `8000`.
* **Displays & GUI Windows (Jetson Monitor)**:
  * Chromium application window opening `http://localhost:8000`.
* **Diagnostics**:
  * Live bit-matrix inspector, frame rates (Hz), error counters, and packet byte decoders for CAN IDs `0x121`, `0x122`, `0x300`, `0x301`, `0x302`, `0x303`, `0x310`, `0x400`, `0x401`, `0x500`.

---

### Step 3: Close Everything Cleanly

**On Jetson Linux Host:**
```bash
bash scripts/close_everything.sh
```

**From Windows PowerShell (via SSH):**
```powershell
pwsh scripts/close_everything.ps1
```

#### What this closes:
* **Autoware & ROS 2 Nodes**: Terminates `planning_simulator`, `autoware.launch`, `rviz2`, `component_container`, `robot_state_publisher`, and stops `ros2 daemon`.
* **Remote Cockpit**: Terminates `remote_control_gui`, `remote_control_node`, and `bench_remote_control`.
* **Vehicle Bridge**: Terminates `vehicle_bridge_node`.
* **Perception & Sensors**: Stops Hesai LiDAR driver, Kinect v2 driver, static TF publishers, and `bench_perception_node`.
* **Web Servers & Windows**: Terminates ports `8080` and `8000` servers, closes Chromium app windows, and closes Electron.
* **CAN Bus Adapters**: Stops `canalyst_socketcan_daemon.py`, terminates `slcand`, and sets `can2`/`canable0` DOWN.
* **Container**: Gracefully restarts `autoware_test` to flush `/dev/shm` and zombie processes, leaving the system 100% clean and idle.

---

# WORKFLOW 2: Standalone Remote Cockpit (Manual Teleoperation)

### Step 1: Open Remote Cockpit

**On Jetson Linux Host:**
```bash
bash scripts/open_remote_control.sh
```

**From Windows PowerShell (via SSH):**
```powershell
pwsh scripts/open_remote_control.ps1
```

#### What this opens:
* **Docker Container**:
  * Ensures `autoware_test` is running with X11 authority (`/tmp/.docker.xauth`).
* **CAN Hardware Interface**:
  * Initializes `can2` at 500 kbps bitrate.
* **Displays & GUI Windows (Jetson Monitor)**:
  * **Qt Remote Cockpit GUI**: Opens operator control window (`remote_control_gui`) with steering angle gauge, speed slider, PRND gear buttons, turn indicators, and E-Stop button.
  * *(Preserves existing RViz2 window if already open for map viewing).*
* **ROS 2 Manual Control Node**:
  * `remote_control_node`: Publishes manual speed, steering, and gear commands to `/control/command/control_cmd` at 25 Hz.
* **Vehicle Bridge Node**:
  * `autoware_vehicle_bridge`: Translates cockpit commands directly into CAN frames `0x300`, `0x301`, `0x303`.
* **Safety Isolation**:
  * Immediately terminates active Autoware autonomy nodes (`planning_simulator`, `vehicle_cmd_gate`, `autoware.launch`, `trajectory_follower`) so they never fight the manual cockpit.

---

### Step 2 (Optional): Open AV 3D Cockpit Dashboard

**On Jetson Linux Host:**
```bash
bash scripts/open_av_dashboard.sh
```

**From Windows PowerShell (Local Dev Server):**
```powershell
pwsh scripts/run_av_dashboard.ps1
```

#### What this opens:
* **Web Services**:
  * FastAPI AV Dashboard server listening on port `8080`.
* **Displays & GUI Windows (Jetson Monitor)**:
  * Chromium application window opening `http://localhost:8080`.
* **Diagnostics**:
  * Interactive Three.js 3D vehicle model, speedometer/tachometer HUD, ISO 2575 telltales, diagnostic DTC matrix, and perception object visualizer.

---

### Step 3: Close Everything Cleanly

**On Jetson Linux Host:**
```bash
bash scripts/close_everything.sh
```

**From Windows PowerShell (via SSH):**
```powershell
pwsh scripts/close_everything.ps1
```

#### What this closes:
* Cleanly shuts down the Remote Cockpit GUI, `vehicle_bridge`, web servers, display windows, and drops the CAN interface.
