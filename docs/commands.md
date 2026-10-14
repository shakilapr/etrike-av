# Quick Command Reference

> **Important**: Never run Remote Cockpit and Autoware Universe together. They fight for control of the vehicle. Always run `close_everything` first when switching.
>
> **Two Independent Systems on Bench**:
> 1. **Simulation System**: Controls virtual map driving and bench wheel/steering movement.
> 2. **Physical Sensors (LiDAR + Camera)**: Run independently to display live room telemetry on the Dashboard only. They do not interfere with driving or localization. See [Bench Sensor Isolation Architecture](reference/BENCH_SENSOR_SIMULATION_ISOLATION.md).

---

## 1. Remote Control Cockpit

### Standard (Bench Testing)
```bash
bash scripts/open_remote_control.sh
```
*Windows:* `pwsh scripts/open_remote_control.ps1`
* **Opens**: Steering/throttle control window on monitor, CAN connection to wheels/steering.

### Real Vehicle (Live Testing)
```bash
bash scripts/open_remote_control.sh can2 false
```
*Windows:* `pwsh scripts/open_remote_control.ps1 -SimMode false`
* **Opens**: Same screen, but with safety checks enabled for the real vehicle.

### Stop Remote Control Only
```bash
bash scripts/close_remote_control.sh
```
* **Closes**: Closes the remote control screen and steering controls.

---

## 2. Autoware Universe (Self-Driving)

### Standard Simulator (Bench Testing)
```bash
bash scripts/open-etrike.sh --bench
```
*Windows:* `ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --bench"`
* **Opens**: RViz 3D map window, 3D Cockpit screen, vehicle planning, and connects to bench motor/steering.

### With Real Sensors (LiDAR + Camera)
```bash
bash scripts/open-etrike.sh --hybrid-bench
```
*Windows:* `ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --hybrid-bench"`
* **Opens**: Same as above, plus real LiDAR laser scanner, Kinect camera, and live pedestrian detection.

### On Real Vehicle (Road Testing)
```bash
bash scripts/open-etrike.sh --live
```
*Windows:* `ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --live"`
* **Opens**: Full self-driving mode on the actual vehicle with real sensors and GPS localization.

### Simulator Only (No Vehicle Connection)
```bash
bash scripts/open-etrike.sh --universe
```
*Windows:* `ssh -t med1@172.16.25.67 "bash ~/av_project/scripts/open-etrike.sh --universe"`
* **Opens**: RViz map simulation only. Hardware remains off.

---

## 3. The Dashboard

### 3D Cockpit Display (On Monitor)
```bash
bash scripts/open_av_dashboard.sh
```
* **Opens**: Fullscreen 3D vehicle speedometer and dashboard on the monitor.

### 3D Cockpit (In Browser Only)
```bash
bash scripts/run_av_dashboard.sh can2 8080
```
*Windows:* `pwsh scripts/run_av_dashboard.ps1`
* **Opens**: Web server. Open `http://172.16.25.67:8080` in your web browser.

### CAN Bus Monitor Display (On Monitor)
```bash
bash scripts/open_can_watch.sh
```
* **Opens**: Live CAN signal data and message rate screen on the monitor.

### CAN Bus Monitor (In Browser Only)
```bash
bash scripts/run_can_watcher.sh can2 8000
```
*Windows:* `pwsh scripts/run_can_watcher.ps1`
* **Opens**: Web server. Open `http://172.16.25.67:8000` in your web browser.

---

## 4. Dashboard + Universe

### Self-Driving + 3D Cockpit (Standard)
```bash
bash scripts/open-etrike.sh --bench
```
* **Opens**: Opens both RViz map and 3D Cockpit together in one command.

### Self-Driving + 3D Cockpit + Real Sensors
```bash
bash scripts/open-etrike.sh --hybrid-bench
```
* **Opens**: Opens RViz, 3D Cockpit, LiDAR scanner, and Camera together.

### Self-Driving + Both Dashboards (3D Cockpit + CAN Monitor)
```bash
bash scripts/open-etrike.sh --bench
bash scripts/open_can_watch.sh
```
* **Opens**: Opens RViz, 3D Cockpit, and the CAN data screen side-by-side.

---

## 5. Close All

### Standard Stop (Recommended)
```bash
bash scripts/close_everything.sh
```
*Windows:* `pwsh scripts/close_everything.ps1`
*Shortcut:* `bash scripts/close-etrike.sh`
* **Closes**: Closes all screens, stops all programs, shuts off vehicle communication, and cleans up memory.

### Stop and Power Off Container
```bash
bash scripts/close_everything.sh --stop-container
```
*Windows:* `pwsh scripts/close_everything.ps1 -StopContainer`
* **Closes**: Closes all programs and turns off the Docker container.

### Complete Reset (Deletes Container)
```bash
bash scripts/close_everything.sh --rm-container
```
*Windows:* `pwsh scripts/close_everything.ps1 -RmContainer`
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

