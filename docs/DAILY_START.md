# Daily Quick Start Guide

Here is your simple everyday checklist to get up and running on the AV Project.

## 1. Check Windows Sync
Your Windows computer automatically syncs your files in the background. To check if it's working:
- Open your web browser and go to: [http://127.0.0.1:8384](http://127.0.0.1:8384)
- Look for the "Up to Date" status.

## 2. Check Linux Sync
The Linux computer also syncs automatically, but to view its status on your Windows screen, you need to connect to it securely.

1. Open **Windows PowerShell**.
2. Copy and paste this command, then press Enter:
   ```powershell
   ssh -N -L 8390:127.0.0.1:8384 med1@172.16.25.56
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
   ssh med1@172.16.25.56
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
> physical sensor. See `docs/HESAI_GUIDE.md` Section 5 for details.

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
./scripts/apply_nebula_firetime_patch.sh
colcon build --symlink-install --packages-select nebula_hesai_common nebula_hesai_decoders nebula_hesai
```
