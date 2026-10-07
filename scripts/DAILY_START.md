# Daily Quick Start Guide

Here is your simple everyday checklist to get up and running on the AV Project.

> **[Troubleshooting] How to find the correct IP if it changes:**
> If you suspect the IP of the Linux machine has changed, run `ip -4 a` (or `hostname -I`) on it. 
> - **DO NOT USE** `172.17.x.x` (This is an internal Docker IP and cannot be reached from Windows).
> - **DO NOT USE** `127.0.x.x` (This is the local loopback address).
> - **DO USE** `172.16.x.x` (This is the real local network IP you need for SSH and Syncthing).

---

## ⚡ Daily Command Quick Reference (Bench Simulator & Dashboards)

| Action | Terminal Command (Run on Jetson host) |
|---|---|
| **1. Open Autoware Universe** | `bash ~/av_project/autoware/scripts/loading/load_pipeline.sh --bench` |
| **2a. Open CAN Watch** | `bash ~/av_project/scripts/open_can_watch.sh` *(or `open_can_watcher_display.sh can2`)* |
| **2b. Open AV Dashboard** | `bash ~/av_project/scripts/open_av_dashboard.sh` *(or `open_av_dashboard_display.sh can2`)* |
| **3. Close All** | `bash ~/av_project/autoware/scripts/loading/load_pipeline.sh --stop` |

- **Open Autoware Universe:** Starts the container, brings up the `can2` interface (CANalyst-II), launches Autoware planning simulator + RViz on the Jetson monitor, and starts `autoware_vehicle_bridge` in sim mode so commanded steering angles and velocities transmit directly to the CAN bus.
- **Open CAN Watch:** Opens the real-time CAN bus bit matrix and telemetry analyzer on the Jetson monitor (`DISPLAY=:1`) and at `http://172.16.25.67:8000`.
- **Open AV Dashboard:** Opens the 3D vehicle & AV cockpit telemetry dashboard on the Jetson monitor (`DISPLAY=:1`) and at `http://172.16.25.67:8080`.
- **Close All:** Gracefully stops the simulator, RViz, vehicle bridge, CAN Watcher, AV Dashboard, and shuts down the CAN interface.

> [!NOTE]
> **Current Integration Stage: Bench Actuation (Step-by-Step Integration)**
> Currently, the setup operates in **Stage 1 (Hardware Actuation Mode)**:
> - The planning simulator (`simple_planning_simulator`) generates simulated vehicle kinematics in RViz.
> - `autoware_vehicle_bridge` forwards those simulated commands directly onto the CAN bus:
>   - `0x300` (`HOST_DRIVE_CMD`): wheel speed & drive gear
>   - `0x303` (`HOST_STEER_CMD`): steering angle
>   - `0x301` (`HOST_BRAKE_REQ`): deceleration brake pressure
> - This actuates the physical vehicle wheels, steering, and brakes to follow the simulation.
> - In this mode, bridge feedback publishing on `/vehicle/status/*` is suppressed to prevent dual-publisher collisions (avoiding gear/speed flicker), and park brake hold is unlatched when motion begins. Full closed-loop sensor & odometry feedback will be integrated in the next stage.

---

## 1. Check Windows Sync
Your Windows computer automatically syncs your files in the background. To check if it's working:
- Open your web browser and go to: [http://127.0.0.1:8384](http://127.0.0.1:8384)
- Look for the "Up to Date" status.

## 2. Check Linux Sync
The Linux computer also syncs automatically, but to view its status on your Windows screen, you need to connect to it securely.

1. Open **Windows PowerShell**.
2. Copy and paste this command, then press Enter:
   ```powershell
   ssh -N -L 8390:127.0.0.1:8384 med1@172.16.25.67
   ```
3. Type in the password. *(The window will just sit there without a prompt—this is normal. Just leave it open in the background).*
4. Open your web browser and go to: [http://127.0.0.1:8390](http://127.0.0.1:8390)
5. Look for the "Up to Date" status.

## 3. Write Code (On Windows)
You can write and edit your code normally on your Windows computer.
- Open the project folder (`E:\work\av_project`) in your code editor (like VS Code).
- Whenever you save a file, it will automatically and instantly copy over to the Linux computer.

## 4. Build Code (On Linux)
Instead of typing long docker commands, you can use the helpful shortcut scripts included in the project.

1. Open **Windows PowerShell**.
2. Log into the Linux computer:
   ```powershell
   ssh med1@172.16.25.67
   ```
3. Once logged in, go to the project folder:
   ```bash
   cd ~/av_project
   ```
4. Run the build script to compile your changes:
   ```bash
   ./docker/build.sh
   ```
   *(This automatically handles everything inside the Docker container.)*

### Build only the E-Trike custom packages (faster)
```bash
# Enter the container first
./docker/shell.sh

# Then inside the container:
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

## 5. Start the Simulator & RViz (On Linux)
Once your code is built, you can easily launch the Autoware planning simulator (which automatically opens RViz on the Jetson's physical display).

Still in the `~/av_project` folder on the Linux computer, run this shortcut command:
```bash
./docker/run.sh
```

This launches the **E-Trike planning simulator** with:
- `vehicle_model:=etrike_vehicle` (Bajaj RE three-wheeler geometry + Hesai XT32M2X lidar_link)
- `sensor_model:=etrike_sensor_kit` (Nebula Hesai driver + pointcloud preprocessing pipeline)
- RViz2 opens automatically on the Jetson's monitor (`DISPLAY=:1`)

### What you'll see in RViz2
- The E-Trike vehicle model (blue Bajaj body + wheels + roof-mounted lidar cylinder)
- TF frames: `base_footprint -> base_link -> lidar_link` + `sensor_kit_base_link`
- Map view with lanelet2 roads (the stock `autoware.rviz` is a **top-down 2D
  view**)
- Once you set an initial pose (2D Pose Estimate), you can plan routes and engage autonomous driving

> **3D view / point cloud:** to inspect the model in 3D (and later the live
> lidar cloud), add `rviz_config:=$(ros2 pkg prefix etrike_common_launch)/share/
> etrike_common_launch/rviz/etrike.rviz` to the launch args, or use
> `./scripts/lidar_bringup.sh --rviz3d`. `etrike.rviz` starts in
> ThirdPersonFollower view with the lidar `pointcloud_raw_ex` and
> `pointcloud_before_sync` displays pre-loaded. In the simulator there is no
> real point cloud (driver disabled); those displays populate only with the
> physical sensor. See `docs/sensors/HESAI_GUIDE.md` Section 5 for details.

### Run tests
```bash
# Inside the container
colcon test --packages-select \
  etrike_common_launch \
  etrike_sensor_kit_launch \
  etrike_sensor_kit_description
colcon test-result --verbose
```

### Need to run custom commands?
If you ever need an interactive shell inside the container (with GPU and display setup ready to go), use:
```bash
./docker/shell.sh
```

## 6. LiDAR Sensor Bring-Up (when hardware is connected)

### Network setup
```bash
sudo ./scripts/setup_lidar_network.sh
```
Configures the Jetson Ethernet interface (192.168.1.10/24) for the XT32M2X (192.168.1.201), pings the sensor, and checks for UDP traffic on port 2368.

### Bench bring-up
```bash
./scripts/lidar_bringup.sh
```
Automates the full bring-up: network check, UDP verification, launches the sensing pipeline, checks for point cloud topics, and verifies the TF tree. Use `--check-only` for just network/UDP, or `--no-driver` to test the preprocessor pipeline without the sensor.

### PTP time sync (production)
```bash
sudo ./scripts/setup_ptp.sh eno1
```
Sets up ptp4l (PTP slave) + phc2sys + chrony for IEEE 1588v2 time synchronization. Requires a PTP grandmaster on the vehicle network.

### Nebula firetime patch (first time only)
```bash
./patches/apply_nebula_firetime_patch.sh
colcon build --symlink-install --packages-select nebula_hesai_common nebula_hesai_decoders nebula_hesai
```
