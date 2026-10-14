# Quick Command Reference

> **Important**: Never run Remote Cockpit and Autoware Universe together. They fight for control of the vehicle. Always run `close_everything` first when switching.

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
