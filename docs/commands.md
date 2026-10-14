# E-Trike AV Operational Command Reference

This document provides the standard execution order for operating the E-Trike Autonomous Vehicle software stack, along with a complete component breakdown of what each command opens and manages.

---

## ⚠️ Critical Safety Rule: Mutual Exclusion

> [!WARNING]
> **Remote Cockpit and Autoware Universe must NEVER run concurrently.**
>
> - **Topic Collision**: Both systems publish to `/control/command/control_cmd`. Autoware's `vehicle_cmd_gate` continuously publishes 0 m/s stop commands (30 Hz), while Remote Cockpit publishes manual steering and drive commands (25 Hz).
> - **Actuator Thrashing**: If both run together, [`autoware_vehicle_bridge`](../autoware/src/our_packages/autoware_vehicle_bridge/src/vehicle_bridge_node.cpp) receives conflicting commands at 55 Hz, oscillating CAN frames `0x300` (drive speed), `0x301` (brake), and `0x303` (steer) between 0 and commanded speed, causing violent actuator judder.
> - **Safe Transition Rule**: Always run `close_everything` before switching between Autonomous and Remote modes.

---

## 🚀 Execution Workflows (In Order)

### Workflow A: Autonomous Driving & Simulation Testing

| Step | Action | Command (Linux / Jetson) | Command (Windows via SSH) |
|---|---|---|---|
| **1** | Open Autoware Universe Stack | `bash scripts/open-etrike.sh --bench` | `ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --bench"` |
| *(opt)* | Open Hybrid Stack (with LiDAR + Camera) | `bash scripts/open-etrike.sh --hybrid-bench` | `ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --hybrid-bench"` |
| **2** | Open CAN Watcher Matrix | `bash scripts/open_can_watch.sh` | `pwsh scripts/run_can_watcher.ps1` |
| **3** | Close Everything Cleanly | `bash scripts/close_everything.sh` | `pwsh scripts/close_everything.ps1` |

---

### Workflow B: Standalone Remote Cockpit Manual Teleoperation

| Step | Action | Command (Linux / Jetson) | Command (Windows via SSH) |
|---|---|---|---|
| **1** | Open Remote Cockpit | `bash scripts/open_remote_control.sh` | `pwsh scripts/open_remote_control.ps1` |
| **2** | Open AV 3D Cockpit Dashboard | `bash scripts/open_av_dashboard.sh` | `pwsh scripts/run_av_dashboard.ps1` |
| *(opt)* | Open CAN Watcher Matrix | `bash scripts/open_can_watch.sh` | `pwsh scripts/run_can_watcher.ps1` |
| **3** | Close Everything Cleanly | `bash scripts/close_everything.sh` | `pwsh scripts/close_everything.ps1` |

---

## 🔍 Detailed Breakdown: What Each Script Opens

### 1. `bash scripts/open-etrike.sh --bench`
Starts the complete Autoware Universe planning simulator with hardware CAN actuation.

* **Docker Container**:
  - Ensures container `autoware_test` is active with NVIDIA GPU runtime, X11 socket access, host networking, and CycloneDDS.
* **Hardware Interface**:
  - Initializes USB-CAN adapter on **`can2`** (or `canable0`) at **500 kbps**.
* **GUI Displays (Jetson Physical Monitor)**:
  - **RViz2**: Displays Lanelet2 vector road map, 3D Bajaj RE exterior vehicle mesh, static TF tree, and Autoware State Panel (for setting 2D Pose / Goal and clicking Engage).
  - **AV Dashboard (Chromium App Window)**: Opens maximized browser window at `http://localhost:8080` showing the 3D digital twin HUD.
* **ROS 2 Core & Autonomy Nodes (Inside Container)**:
  - `planning_simulator.launch.xml` (`simple_planning_simulator`)
  - `vehicle_cmd_gate` (arbitrates `/control/command/control_cmd`)
  - `behavior_path_planner` & `motion_velocity_smoother`
  - `robot_state_publisher` (URDF tree: `base_link`, sensors, wheels)
* **Vehicle Bridge Node**:
  - `autoware_vehicle_bridge`: Listens to simulated trajectory commands and forwards them onto CAN:
    - `0x300` (`HOST_DRIVE_CMD`): Wheel speed & drive gear
    - `0x303` (`HOST_STEER_CMD`): Steering angle
    - `0x301` (`HOST_BRAKE_REQ`): Brake pressure
* **Web Services**:
  - FastAPI / Uvicorn server listening on port **`8080`**.
* **Safety Isolation**:
  - Automatically kills any stale `remote_control_node` to prevent dual-publisher conflicts.

---

### 2. `bash scripts/open-etrike.sh --hybrid-bench`
Starts everything in `--bench` plus live sensor pipelines and real-time 3D perception.

* **Ethernet Network**:
  - Probes and configures `eno1` (192.168.1.10) for LiDAR connectivity.
* **Physical Sensor Drivers**:
  - **Hesai XT32M2X LiDAR driver**: Streams real 360° point clouds on `/sensing/lidar/top/pointcloud_raw_ex`.
  - **Kinect v2 Camera driver**: Claims USB `045e:02d8` and streams RGB-D depth and color images.
* **Perception Pipeline**:
  - `bench_perception_node.py`: Performs real-time spatial hashing clustering + HOG pedestrian detection, publishing 3D bounding boxes to `/perception/object_recognition/detection/objects`.

---

### 3. `bash scripts/open_remote_control.sh`
Standalone manual driving cockpit without running Autoware autonomy.

* **Docker Container**:
  - Ensures `autoware_test` is running with X11 authority (`/tmp/.docker.xauth`).
* **Hardware Interface**:
  - Initializes `can2` at 500 kbps.
* **GUI Displays (Jetson Physical Monitor)**:
  - **Qt Remote Cockpit GUI**: Opens the graphical operator window (`remote_control_gui`) with steering angle bar, speed slider, PRND gear selectors, indicators, and software E-Stop button.
  - *(Preserves existing RViz2 window if already open for map viewing).*
* **ROS 2 Nodes**:
  - `remote_control_node`: Publishes operator speed, steering, and gear commands directly to `/control/command/control_cmd` at 25 Hz.
  - `autoware_vehicle_bridge`: Translates operator commands directly into CAN frames `0x300`, `0x301`, `0x303`.
* **Safety Isolation**:
  - Immediately terminates active Autoware autonomy nodes (`planning_simulator`, `vehicle_cmd_gate`, `autoware.launch`, `trajectory_follower`) so they never fight the manual cockpit.

---

### 4. `bash scripts/open_can_watch.sh`
Bit-level engineering diagnostics for low-voltage CAN buses.

* **Web Services**:
  - Python / FastAPI CAN Watcher backend listening on port **`8000`**.
* **GUI Displays (Jetson Physical Monitor)**:
  - Chromium application window opening `http://localhost:8000`.
* **Telemetry Diagnostics**:
  - Real-time bit-matrix inspector, frame rate counter (Hz), error frame monitor, and byte decoders for all CAN frames on the bus (`0x121`, `0x122`, `0x300`, `0x301`, `0x302`, `0x303`, `0x310`, `0x400`, `0x401`, `0x500`).

---

### 5. `bash scripts/open_av_dashboard.sh`
Automotive-grade 3D digital twin HUD.

* **Web Services**:
  - Python / FastAPI AV Dashboard backend listening on port **`8080`**.
* **GUI Displays (Jetson Physical Monitor)**:
  - Chromium application window opening `http://localhost:8080`.
* **Telemetry Diagnostics**:
  - Interactive Three.js 3D vehicle digital twin, automotive speedometer/tachometer HUD, ISO 2575 telltales, diagnostic fault code (DTC) matrix, and ROS 2 perception object visualizer.

---

### 6. `bash scripts/close_everything.sh`
Master system teardown and state sanitization.

* **What it Closes / Shuts Down**:
  - **Autoware & ROS 2**: Kills `planning_simulator`, `autoware_launch`, `rviz2`, `component_container`, `robot_state_publisher`, and `ros2 daemon`.
  - **Remote Cockpit**: Kills `remote_control_gui`, `remote_control_node`, and `bench_remote_control`.
  - **Vehicle Bridge**: Stops `vehicle_bridge_node`.
  - **Perception & Sensors**: Stops Hesai LiDAR driver, Kinect v2 driver, and `bench_perception_node`.
  - **Web Servers & Displays**: Kills ports `8080` and `8000` backends, terminates Chromium app windows, and closes Electron instances.
  - **Hardware Adapters**: Stops `canalyst_socketcan_daemon.py`, terminates `slcand`, and brings down SocketCAN interfaces (`can2`, `canable0`).
  - **Container**: Gracefully restarts `autoware_test` to flush `/dev/shm`, lingering Unix sockets, and zombie processes, leaving the system 100% clean and ready for the next test.

---

## 🔄 Mode Switching Reference

```
[ Autoware Universe Running ]
           │
           ▼
bash scripts/close_everything.sh   <-- Flushes topics, CAN, and shared memory
           │
           ▼
bash scripts/open_remote_control.sh <-- Takes exclusive control of /control/command/control_cmd
           │
           ▼
[ Remote Cockpit Active ]
           │
           ▼
bash scripts/close_everything.sh   <-- Stops remote control and releases CAN
           │
           ▼
bash scripts/open-etrike.sh --bench <-- Takes exclusive control of /control/command/control_cmd
```
