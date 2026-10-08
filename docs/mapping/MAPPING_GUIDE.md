# E-Trike LiDAR-Only Offline Mapping & Autoware Universe Integration Guide

This document outlines the end-to-end workflow for generating high-definition 3D point cloud maps (`pointcloud_map.pcd`) for the **Bajaj RE Autonomous Vehicle** using the **Hesai XT32M2X LiDAR** without an IMU, and deploying them for localization in **Autoware Universe**.

---

## 1. System Architecture & Autoware Compatibility

```
  Live Vehicle Mapping Recording                 Offline SLAM Processing                        Autoware Universe Runtime
 ┌───────────────────────────────┐              ┌─────────────────────────────┐               ┌───────────────────────────┐
 │ Hesai XT32M2X (192.168.1.201) │              │    Recorded ROS 2 Bag       │               │ Live XT32M2X (lidar_link) │
 └──────────────┬────────────────┘              └──────────────┬──────────────┘               └─────────────┬─────────────┘
                │ UDP :2368                                    │ Replay (--clock, 0.5x)                     │
                ▼                                              ▼                                            ▼
 ┌───────────────────────────────┐              ┌─────────────────────────────┐               ┌───────────────────────────┐
 │ Nebula Driver (PandarXT32M)   │              │ lidarslam_ros2 (NDT/GICP)   │               │ Autoware Preprocessor     │
 │ pointcloud_raw_ex (lidar_link)│              │ robot_frame_id: "base_link" │               │ CropBox Filter (no self)  │
 └──────────────┬────────────────┘              └──────────────┬──────────────┘               └─────────────┬─────────────┘
                │                                              │                                            │
                ▼                                              ▼                                            ▼
 ┌───────────────────────────────┐              ┌─────────────────────────────┐               ┌───────────────────────────┐
 │ Autoware Preprocessor         │              │ map.pcd -> pointcloud_map   │               │ pointcloud_before_sync    │
 │ pointcloud_before_sync        │              │ projector_type: Local       │               └─────────────┬─────────────┘
 └──────────────┬────────────────┘              └──────────────┬──────────────┘                             │
                │                                              │                                            │
                ▼                                              └──────────────────────┐                     │
 ┌───────────────────────────────┐                                                    ▼                     ▼
 │ ROS 2 Bag Recording           │                                     ┌──────────────────────────────────────────┐
 │ (/sensing/lidar/top/..., /tf) │                                     │ ndt_scan_matcher (tier4_localization)    │
 └───────────────────────────────┘                                     │ 1:1 scan-to-map pose alignment           │
                                                                       └──────────────────────────────────────────┘
```

### Why this pipeline guarantees Autoware Universe compatibility:
1. **Identical Reference Frame (`base_link`):** The mapper is configured with `robot_frame_id: "base_link"`. Maps are generated at vehicle chassis/ground level ($Z = 0$), matching Autoware's TF expectations.
2. **CropBox Filtered Input (`pointcloud_before_sync`):** Self-reflections from the Bajaj RE's roof and cabin are removed during both mapping and live driving, preventing registration errors in NDT scan matching.
3. **Format & Metadata:** Outputs a standard binary PCL file with local coordinates (`projector_type: Local`), loaded natively by Autoware's `pointcloud_map_loader`.

---

## 2. Hardware Notice: IMU-less Driving Protocol

> [!WARNING]
> **Missing Hardware IMU:**
> The E-Trike currently uses an IMU stub. Without high-frequency angular velocity feedback, scan deskewing during sharp turns is limited.
> 
> **To prevent map twisting and distortion during mapping:**
> - Keep vehicle speed under **$10\text{ km/h}$** (walking pace).
> - Steer smoothly and avoid abrupt turns or hard braking.
> - Drive a closed loop (revisiting the starting position by 10–20 meters) so the pose-graph backend can close the loop and eliminate drift.

---

## 3. Step-by-Step Implementation

### Step 1: Compile the SLAM Packages (Inside Docker)
All required mapping packages (`ndt_omp`, `lidarslam_ros2`) are pre-integrated in `autoware/src/our_packages/mapping/`.

1. Enter the Docker container on the Jetson:
   ```bash
   cd ~/av_project
   ./docker/shell.sh
   ```
2. Install system dependencies and build the mapping packages:
   ```bash
   # Inside container
   sudo apt update && sudo apt install -y ros-humble-gtsam ros-humble-libg2o libsuitesparse-dev ros-humble-pcl-ros pcl-tools

   source /opt/autoware/setup.bash
   cd /workspace/autoware

   colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release \
     --packages-select ndt_omp_ros2 lidarslam_msgs scanmatcher graph_based_slam lidarslam etrike_common_launch etrike_sensor_kit_launch

   source install/setup.bash
   ```
3. Confirm nodes are discoverable:
   ```bash
   ros2 pkg list | grep -E 'lidarslam|scanmatcher|graph_based_slam'
   ```

---

### Step 2: Verify LiDAR Health & Static TF
Before driving, ensure the sensor stream and mounting transform are active.

1. **Check sensor UDP stream (on Jetson host):**
   ```bash
   ./scripts/lidar_bringup.sh --check-only
   ```
2. **Verify mounting transform (inside container):**
   ```bash
   ros2 run tf2_ros tf2_echo base_link lidar_link
   ```
   *Expected translation:* $X = 0.575$, $Y = 0.000$, $Z = 1.7464\text{ m}$.

---

### Step 3: Record Live Mapping Data on the Vehicle

1. **Terminal 1 (Visual Preview):**
   Launch the standalone viewer to monitor live LiDAR returns without running the full localization stack:
   ```bash
   cd ~/av_project
   ./scripts/lidar_standalone.sh
   ```
2. **Terminal 2 (Record Bag):**
   ```bash
   cd ~/av_project
   ./docker/shell.sh

   # Inside container
   mkdir -p /workspace/data/bags
   ros2 bag record -o /workspace/data/bags/etrike_loop_01 \
     /sensing/lidar/top/pointcloud_raw_ex \
     /sensing/lidar/top/pointcloud_before_sync \
     /tf \
     /tf_static
   ```
3. Drive the loop smoothly, return to the start point, wait 5 seconds, and press `Ctrl+C` in Terminal 2.

---

### Step 4: Run Offline SLAM & Export Map

1. **Terminal 1 (Launch Mapper):**
   ```bash
   cd ~/av_project
   ./docker/shell.sh
   source /workspace/autoware/install/setup.bash

   ros2 launch etrike_common_launch etrike_mapping.launch.xml \
     input_cloud:=/sensing/lidar/top/pointcloud_before_sync \
     save_dir:=/workspace/data
   ```
   *Note:* RViz2 opens displaying `/map` and vehicle `/path`.
2. **Terminal 2 (Replay Bag at Half Speed):**
   ```bash
   cd ~/av_project
   ./docker/shell.sh

   ros2 bag play /workspace/data/bags/etrike_loop_01 \
     --clock \
     --rate 0.5
   ```
   *Playing back at `0.5` speed gives the Jetson CPU sufficient headroom for real-time NDT scan matching.*
3. **Save Map:**
   When the bag finishes playing and loop closure occurs, trigger the map export service:
   ```bash
   ros2 service call /map_save std_srvs/srv/Empty "{}"
   ```
   Then press `Ctrl+C` in Terminal 1. The resulting `map.pcd` and `pose_graph.g2o` are written to `~/av_project/data/`.

---

### Step 5: Map Inspection & Post-Processing

1. **Inspect geometry for quality:**
   ```bash
   pcl_viewer ~/av_project/data/map.pcd
   # Or view on Windows in CloudCompare
   ```
   - [ ] Verify vertical structures (walls, poles) are crisp without double-imaging.
   - [ ] Verify the loop start and end points align cleanly.
2. **Downsample (Optional):**
   If the map file is large (>200 MB), downsample to a $0.1\text{--}0.2\text{ m}$ voxel grid using CloudCompare or PCL tools to optimize memory usage during Autoware localization.

---

### Step 6: Deploy into Autoware Universe

1. **Set up map directory:**
   ```bash
   mkdir -p /autoware_map/bajaj_track
   cp ~/av_project/data/map.pcd /autoware_map/bajaj_track/pointcloud_map.pcd
   ```
2. **Create local coordinate projector configuration:**
   Create `/autoware_map/bajaj_track/map_projector_info.yaml`:
   ```yaml
   projector_type: Local
   ```
3. **Validate in Autoware Universe:**
   ```bash
   cd ~/av_project
   ./docker/shell.sh

   ros2 launch autoware_launch autoware.launch.xml \
     map_path:=/autoware_map/bajaj_track \
     vehicle_model:=etrike_vehicle \
     sensor_model:=etrike_sensor_kit \
     launch_sensing_driver:=true
   ```
4. **Initialize Pose in RViz2:**
   - Click the **"2D Pose Estimate"** tool in RViz2.
   - Click and drag on the map at the approximate location and orientation of the E-Trike.
   - Confirm that the live LiDAR scan snaps into alignment with `pointcloud_map.pcd` and the NDT score locks.
