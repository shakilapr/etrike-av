# Daily Quick Reference Guide

---

# SECTION 1: System & Network Setup

## 1.1 Check File Sync Status
**Windows Sync (Browser):**
`http://127.0.0.1:8384`

**Linux Sync (via Windows PowerShell SSH Tunnel):**
```powershell
ssh -N -L 8390:127.0.0.1:8384 med1@172.16.25.67
```
*(Leave window open, then open `http://127.0.0.1:8390` in your browser)*

## 1.2 Setup LiDAR Network (First Time / Reconnect)
*(Configures Jetson IP 192.168.1.10 for Hesai default IP 192.168.1.201 on interface eno1)*
```bash
cd ~/av_project
sudo ./scripts/setup_lidar_network.sh
```

## 1.3 Setup PTP Time Sync (Production Timing)
*(Requires an active IEEE 1588v2 PTP Grandmaster on the vehicle network)*
```bash
cd ~/av_project
sudo ./scripts/setup_ptp.sh eno1
```

---

# SECTION 2: Build & Container Management

## 2.1 Enter Interactive Container Shell
*(Drops into CUDA-enabled Docker container with GPU & X11 display environment ready)*
```bash
cd ~/av_project
./docker/shell.sh
```

## 2.2 Build Code (Full vs Custom)
**Full Workspace Build:**
```bash
cd ~/av_project
./docker/build.sh
```

**Custom E-Trike Packages Only (Faster Build):**
*(Compiles only custom E-Trike packages to save time during daily development)*
```bash
cd ~/av_project
./docker/shell.sh
# Inside the container:
source /opt/autoware/setup.bash
cd /workspace/autoware
colcon build --symlink-install --packages-select etrike_protocol autoware_vehicle_bridge etrike_vehicle_description etrike_vehicle_launch etrike_common_launch etrike_sensor_kit_launch etrike_sensor_kit_description etrike_lidar_viewer
```

## 2.3 Run Integration & Unit Tests
*(Standardized runner using host UID/GID to avoid Docker volume permission conflicts)*
```bash
cd ~/av_project
./run_tests.sh
```

---

# SECTION 3: LiDAR Standalone & Preview

## 3.1 Open Basic LiDAR Preview in RViz2
*(Bypasses full Autoware stack to quickly verify sensor scan and vehicle model)*
```bash
cd ~/av_project
./docker/shell.sh
./scripts/lidar_standalone.sh
```

---

# SECTION 4: Autoware System Execution

## 4.1 Open Autoware (Simulation Mode)
*(Launches planning simulator; real sensor driver is disabled and perception is dummy)*
```bash
cd ~/av_project
./docker/run.sh
```

## 4.2 Open Autoware with LiDAR Integrated (Real World)
*(Launches full sensing driver, distortion corrector, and localization pipeline)*
```bash
cd ~/av_project
./docker/shell.sh
ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/your-map-folder \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=true
```

```bash
# Script Alternative (Includes Network Checks, Diagnostics, and 3D View):
cd ~/av_project
MAP_PATH=/autoware_map/your-map-folder ./scripts/lidar_bringup.sh --rviz3d
```

## 4.3 Kill All Running Autoware and ROS Packages
*(Resets the system if ROS 2 nodes crash or port bindings hang)*
```bash
# Inside container (kills all ROS 2 nodes and RViz):
pkill -f ros2
pkill -f rviz2
pkill -f autoware

# Or from host to aggressively stop Docker container:
docker stop $(docker ps -q)
```

```bash
# Script Alternative (Run from host Jetson terminal):
cd ~/av_project
./scripts/kill_all.sh
```

---

# SECTION 5: Mapping & Map Management

## 5.1 Manual Mapping Mode (Record Sensor Data)
*(Drive slowly in loops without sharp turns to minimize point cloud distortion)*  
*Requires 2 terminals inside Docker container.*

**Terminal 1 (Preview Cloud):**
```bash
./scripts/lidar_standalone.sh
```

**Terminal 2 (Record ROS Bag):**
```bash
ros2 bag record /sensing/lidar/top/pointcloud_raw_ex /sensing/lidar/top/pointcloud_before_sync /tf /tf_static
```

## 5.2 Convert Recorded Bag into Pointcloud Map (.pcd)
*(Processes bag offline using lidarslam_ros2 NDT/GICP scan matching without IMU)*  
*Requires 2 terminals inside Docker container.*

**Terminal 1 (Run Mapper Node):**
```bash
ros2 launch etrike_common_launch etrike_mapping.launch.xml save_dir:=/workspace/data
```

**Terminal 2 (Playback Bag):**
```bash
ros2 bag play <path_to_your_recorded_bag_folder> --clock
```
*(Press `Ctrl+C` in Terminal 1 when playback finishes to save `map.pcd` to your data folder)*

## 5.3 Load Specific Maps into Autoware (Without Overwriting Old Maps)
*(The point cloud map inside map_path must be named pointcloud_map.pcd)*
- Create a dedicated folder for each map (e.g., `/autoware_map/campus_map`).
- Rename your generated `.pcd` file to `pointcloud_map.pcd` and place it inside.
- Set `map_path:=` argument to point to your target map folder:

```bash
cd ~/av_project
./docker/shell.sh
ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/campus_map \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=true
```

## 5.4 Add Roads and Vector Details (Lanelet2 Maps)
*(Generates the vector map required for Autoware planning and routing)*
- **Tool:** TIER IV Vector Map Builder (`https://tools.tier4.jp/vector_map_builder/`)
- **Steps:** 
  1. Upload generated `pointcloud_map.pcd` into browser.
  2. Draw lanes, stop lines, and traffic lights.
  3. Export as `lanelet2_map.osm`.
  4. Place `lanelet2_map.osm` into target map folder alongside `pointcloud_map.pcd`.
