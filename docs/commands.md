# Quick Command Reference

> **Universal Path Shortcut**: On both **`med1` (`172.16.25.67`)** and **`med2` (`172.16.25.81`)**, `/av_project` is symlinked to the project root. You can run all commands using `bash /av_project/scripts/...` from any directory!
>
> **Important**: Never run Remote Cockpit and Autoware Universe together. They fight for control of the vehicle. Always run `close_everything` first when switching.
>
> **Two Independent Systems on Bench**:
> 1. **Simulation System**: Controls virtual map driving and bench wheel/steering movement.
> 2. **Physical Sensors (LiDAR + Camera)**: Run independently to display live room telemetry on the Dashboard only. They do not interfere with driving or localization. See [Bench Sensor Isolation Architecture](reference/BENCH_SENSOR_SIMULATION_ISOLATION.md).

---

## 1. Remote Control Cockpit

### Standard (Bench Testing)
```bash
bash /av_project/scripts/open_remote_control.sh
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/open_remote_control.sh"`
* *SSH (med1):* `ssh med1 "bash /av_project/scripts/open_remote_control.sh"`
* *Windows PowerShell:* `pwsh scripts/open_remote_control.ps1 -TargetHost med2@172.16.25.81`
* **Opens**: Steering/throttle control window on monitor, CAN connection to wheels/steering.

### Real Vehicle (Live Testing)
```bash
bash /av_project/scripts/open_remote_control.sh can2 false
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/open_remote_control.sh can2 false"`
* *Windows PowerShell:* `pwsh scripts/open_remote_control.ps1 -TargetHost med2@172.16.25.81 -SimMode false`
* **Opens**: Same screen, but with safety checks enabled for the real vehicle.

### Stop Remote Control Only
```bash
bash /av_project/scripts/close_remote_control.sh
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/close_remote_control.sh"`
* *SSH (med1):* `ssh med1 "bash /av_project/scripts/close_remote_control.sh"`
* **Closes**: Closes the remote control screen and steering controls.

---

## 2. Autoware Universe (Self-Driving)

### Standard Simulator (Bench Testing)
```bash
bash /av_project/scripts/open-etrike.sh --bench
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/open-etrike.sh --bench"`
* *SSH (med1):* `ssh med1 "bash /av_project/scripts/open-etrike.sh --bench"`
* **Opens**: RViz 3D map window, 3D Cockpit screen, vehicle planning, and connects to bench motor/steering.

### With Real Sensors (LiDAR + Camera)
```bash
bash /av_project/scripts/open-etrike.sh --hybrid-bench
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/open-etrike.sh --hybrid-bench"`
* *SSH (med1):* `ssh med1 "bash /av_project/scripts/open-etrike.sh --hybrid-bench"`
* **Opens**: Same as above, plus real LiDAR laser scanner, Kinect camera, and live pedestrian detection.

### On Real Vehicle (Road Testing)
```bash
bash /av_project/scripts/open-etrike.sh --live
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/open-etrike.sh --live"`
* *SSH (med1):* `ssh med1 "bash /av_project/scripts/open-etrike.sh --live"`
* **Opens**: Full self-driving mode on the actual vehicle with real sensors and GPS localization.

### Simulator Only (No Vehicle Connection)
```bash
bash /av_project/scripts/open-etrike.sh --universe
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/open-etrike.sh --universe"`
* *SSH (med1):* `ssh med1 "bash /av_project/scripts/open-etrike.sh --universe"`
* **Opens**: RViz map simulation only. Hardware remains off.

### Engage Autonomous Motion (Start / Resume Driving)
```bash
bash /av_project/scripts/engage_autoware.sh
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/engage_autoware.sh"`
* *SSH (med1):* `ssh med1 "bash /av_project/scripts/engage_autoware.sh"`
* **Action**: Transitions Autoware to AUTONOMOUS mode, clears safety interlocks, and engages the vehicle command gate to start driving along the planned route.
* **Stop / Disengage**: `bash /av_project/scripts/engage_autoware.sh --disengage`
* **Status Check**: `bash /av_project/scripts/engage_autoware.sh --status`

---

## 3. The Dashboard

### 3D Cockpit Display (On Monitor)
```bash
bash /av_project/scripts/open_av_dashboard.sh
```
* **Opens**: Fullscreen 3D vehicle speedometer and dashboard on the monitor.

### 3D Cockpit (In Browser Only)
```bash
bash /av_project/scripts/run_av_dashboard.sh can2 8080
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/run_av_dashboard.sh can2 8080"`
* *Windows PowerShell:* `pwsh scripts/run_av_dashboard.ps1`
* **Opens**: Web server. Open `http://172.16.25.81:8080` (or `http://172.16.25.67:8080`) in your browser.

### CAN Bus Monitor Display (On Monitor)
```bash
bash /av_project/scripts/open_can_watch.sh
```
* **Opens**: Live CAN signal data and message rate screen on the monitor.

### CAN Bus Monitor (In Browser Only)
```bash
bash /av_project/scripts/run_can_watcher.sh can2 8000
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/run_can_watcher.sh can2 8000"`
* *Windows PowerShell:* `pwsh scripts/run_can_watcher.ps1`
* **Opens**: Web server. Open `http://172.16.25.81:8000` (or `http://172.16.25.67:8000`) in your browser.

---

## 4. Dashboard + Universe

### Self-Driving + 3D Cockpit (Standard)
```bash
bash /av_project/scripts/open-etrike.sh --bench
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/open-etrike.sh --bench"`
* *SSH (med1):* `ssh med1 "bash /av_project/scripts/open-etrike.sh --bench"`
* **Opens**: Opens both RViz map and 3D Cockpit together in one command.

### Self-Driving + 3D Cockpit + Real Sensors
```bash
bash /av_project/scripts/open-etrike.sh --hybrid-bench
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/open-etrike.sh --hybrid-bench"`
* *SSH (med1):* `ssh med1 "bash /av_project/scripts/open-etrike.sh --hybrid-bench"`
* **Opens**: Opens RViz, 3D Cockpit, LiDAR scanner, and Camera together.

### Self-Driving + Both Dashboards (3D Cockpit + CAN Monitor)
```bash
bash /av_project/scripts/open-etrike.sh --bench
bash /av_project/scripts/open_can_watch.sh
```
* **Opens**: Opens RViz, 3D Cockpit, and the CAN data screen side-by-side.

---

## 5. Close All

### Standard Stop (Recommended)
```bash
bash /av_project/scripts/close_everything.sh
```
* *SSH (med2):* `ssh med2 "bash /av_project/scripts/close_everything.sh"`
* *SSH (med1):* `ssh med1 "bash /av_project/scripts/close_everything.sh"`
* *Windows PowerShell:* `pwsh scripts/close_everything.ps1`
* *Shortcut:* `bash /av_project/scripts/close-etrike.sh`
* **Closes**: Closes all screens, stops all programs, shuts off vehicle communication, and cleans up memory.

### Stop and Power Off Container
```bash
bash /av_project/scripts/close_everything.sh --stop-container
```
* *Windows PowerShell:* `pwsh scripts/close_everything.ps1 -StopContainer`
* **Closes**: Closes all programs and turns off the Docker container.

### Complete Reset (Deletes Container)
```bash
bash /av_project/scripts/close_everything.sh --rm-container
```
* *Windows PowerShell:* `pwsh scripts/close_everything.ps1 -RmContainer`
* **Closes**: Force-closes everything and completely deletes the container instance.

---

## 6. Troubleshooting: "Remote Can't Send Commands" & Node/Topic Conflicts

### Why Commands Get Dropped or Ignored
If the Remote Cockpit GUI is running but wheel steering and throttle do not respond, check the following:

#### 1. Dual Publisher Conflict on `/control/command/control_cmd`
* **Cause**: Autoware Universe (`planning_simulator`, `vehicle_cmd_gate`, `trajectory_follower`) and `etrike_remote_control_gui` cannot run together because both publish to `/control/command/control_cmd`.
* **Guard**: Launch scripts now include strict pre-flight guards that prevent accidental simultaneous execution.
* **Fix**: Always close the active stack cleanly before launching the other:
  ```bash
  bash scripts/close_everything.sh
  ```
  Then launch your target stack:
  - For Remote Control: `bash scripts/open_remote_control.sh can2 true`
  - For Autoware Universe: `bash scripts/open-etrike.sh --bench`

#### 2. Vehicle Bridge Gating (`sim_mode` Required for Bench)
* **Cause**: In `autoware_vehicle_bridge`, commands are **silently dropped** in `on_control()` unless `sim_mode:=true` or all real-vehicle hardware gates pass:
  * Hardware gates require live CAN heartbeats: `rt_heartbeat_` (<1500ms), `sys_status_` (<500ms), `motion_report_` (<100ms), and autonomous mode confirmation from the ECU.
* **Fix**: For bench/remote testing without real vehicle ECUs, always launch the bridge with `sim_mode:=true`:
  ```bash
  ros2 launch etrike_remote_control bench_remote_control.launch.py can_interface:=can2 sim_mode:=true
  ```

#### 3. Dual Bridge Conflict (`direct_bridge` vs `autoware_vehicle_bridge`)
* **Cause**: Both nodes subscribe to `/control/command/control_cmd` and bind to the CAN interface.
* **Fix**: Ensure only one bridge is running:
  ```bash
  docker exec autoware_test bash -c "pkill -9 -f 'direct_bridge' || true"
  ```

#### 4. Diagnosing Active Publishers & Conflicts
Run inside the `autoware_test` container or over SSH:
```bash
# Check who is publishing to control_cmd (should only be 1 publisher)
ros2 topic info /control/command/control_cmd -v

# List all active nodes
ros2 node list

# Check if vehicle_bridge is actively receiving control commands
ros2 topic hz /control/command/control_cmd
```

#### 5. Jetson SSH Connection Issues
* **Find Jetson IP**: If `172.16.25.67` or `172.16.25.56` times out or is refused, check the IP on the Jetson display:
  ```bash
  hostname -I
  ```
* **Verify SSH daemon & Docker container**:
  ```bash
  sudo systemctl status ssh
  docker ps
  ```

---

## 7. YOLO26x Perception & Live Camera Monitoring

### Start Live Perception + Kinect + Backend Server
```bash
bash scripts/start_live_bench_perception.sh 8080 can2
```
*Windows:* `ssh med1@172.16.25.67 "bash ~/av_project/scripts/start_live_bench_perception.sh 8080 can2"`
* **Opens**: Kinect v2 camera driver, YOLO26x FP16 (46.8 FPS) + RTMPose-s (17 COCO joints) perception node, and Dashboard backend on port 8080.

### Open Cockpit HUD + Dedicated Camera Stream on Jetson Monitor
```bash
bash scripts/open_cockpit_and_camera_monitor.sh 8080
```
*Windows:* `ssh med1@172.16.25.67 "bash ~/av_project/scripts/open_cockpit_and_camera_monitor.sh 8080"`
* **Opens**: Two synchronized Chromium windows on Jetson physical display (`DISPLAY=:1`):
  * **Window 1**: Full 3D Cockpit & Radar HUD (`http://localhost:8080`)
  * **Window 2**: Dedicated Full-Window Camera Stream with real-time annotations (`http://localhost:8080/camera`)

### Open Standalone YOLO26x Native Camera Window
```bash
bash /av_project/scripts/yolo-camera.sh
```
*Windows:* `ssh med1@172.16.25.67 "bash ~/av_project/scripts/yolo-camera.sh"`
* **Opens**: Direct hardware-accelerated X11 window on Jetson monitor (`DISPLAY=:1`) rendering Kinect v2 video with YOLO26x bounding boxes and RTMPose-s skeletons.
* **Exit**: Press `Q`, `ESC`, or click the window `[X]` button, or close terminal.

### Close Camera & Perception Only
```bash
bash /av_project/scripts/close_camera.sh
```
*Windows:* `ssh med1@172.16.25.67 "bash ~/av_project/scripts/close_camera.sh"`
* **Closes**: Instantly terminates camera viewer window (`yolo_cam_viewer`), Kinect v2 driver (`kinect2_node_exec`), YOLO perception nodes (`yolo_perception_node`), and releases the USB camera sensor.



