# E-Trike Live LiDAR Mapping Procedure

Step-by-step operating checklist for collecting physical LiDAR data on the **Bajaj RE Autonomous Vehicle** using the **Hesai XT32M2X** and generating a 3D point cloud map via **`lidarslam_ros2`** with real-time RViz visualization.

---

## Motion Rules (Critical)

| Phase | Vehicle / LiDAR State | Reason |
| :--- | :--- | :--- |
| **Phase 1: Preview** | **STATIONARY** | Confirm sensor stream, link status, and alignment. |
| **Phase 2: Recording Start** | **STATIONARY (Pause 5s)** | Captures static origin ground truth and TF tree. |
| **Phase 3: Driving** | **MOVE SLOWLY (< 10 km/h)** | Smooth, gentle turns; avoid jerks or hard braking. |
| **Phase 3: Driving End** | **STATIONARY (Pause 5s)** | Overlaps loop closure frames at the origin. |
| **Phase 4: Offline SLAM** | **Vehicle Parked / Off** | Data processed from recorded ROS 2 bag. |

---

## Phase 1: Live Preview (Vehicle is STATIONARY)

> [!IMPORTANT]
> **DO NOT MOVE THE VEHICLE OR LIDAR YET.** Keep the vehicle parked still at your starting point.

### Step 1: Open 3D LiDAR Visualizer
In your terminal, launch the standalone preview on the vehicle display:
```bash
ssh med1@172.16.25.67
cd ~/av_project
DISPLAY=:1 ./scripts/lidar_standalone.sh
```
* **Expected Result:** RViz2 opens on display `:1`. You will see the live 360° point cloud in 3D representing your current surroundings. Keep this terminal running.

---

## Phase 2: Start Recording (Vehicle is STATIONARY)

> [!IMPORTANT]
> **STILL DO NOT MOVE YET.** Start recording first so the bag logs a stationary baseline of your start position.

### Step 2: Start ROS 2 Bag Recording
Open a **second terminal**:
```bash
ssh med1@172.16.25.67
cd ~/av_project
./docker/shell.sh
```
Inside the container, run:
```bash
mkdir -p /workspace/data/bags
ros2 bag record -o /workspace/data/bags/etrike_loop_01 \
  /sensing/lidar/top/pointcloud_raw_ex \
  /sensing/lidar/top/pointcloud_before_sync \
  /tf \
  /tf_static
```
* The terminal will output `[INFO] Subscribed to topic...`.
* **Wait 5 seconds** while the vehicle is completely parked to capture static origin transforms.

---

## Phase 3: Drive the Mapping Loop (NOW MOVE THE VEHICLE)

> [!IMPORTANT]
> **👉 NOW MOVE THE VEHICLE / LIDAR!**

### Step 3: Drive the Loop
1. **Speed:** Drive very slowly: **under 10 km/h** (walking pace).
2. **Steering:** Turn the handlebars gently and gradually. Do not snap the steering or brake abruptly (prevents non-deskewed rotational shearing without an IMU).
3. **Trajectory:** Drive a **closed loop** (around a building, block, or yard) returning to the exact spot where you started.
4. **Finish:** Once parked at the starting spot, **wait 5 seconds completely still**. This ensures the pose-graph backend has clean overlapping frames for loop closure.

### Step 4: Stop Recording
In **Terminal 2**, press:
```bash
Ctrl + C
```
* The recorded bag is saved at `/workspace/data/bags/etrike_loop_01`.
* In **Terminal 1**, you can now also close the live preview with `Ctrl + C`.

---

## Phase 4: Run Offline SLAM & Watch the Map Build Live

Process the recorded bag through `lidarslam_ros2` and watch the 3D map construct itself in real time on `DISPLAY=:1`.

### Step 5: Launch the SLAM Mapper
In **Terminal 1**:
```bash
ssh med1@172.16.25.67
cd ~/av_project
./docker/shell.sh

# Inside Docker
source /opt/autoware/setup.bash
source /workspace/autoware/install/setup.bash

export DISPLAY=:1
ros2 launch etrike_common_launch etrike_mapping.launch.xml \
  input_cloud:=/sensing/lidar/top/pointcloud_before_sync \
  save_dir:=/workspace/data
```
* RViz2 will open on display `:1` with the mapping configuration loaded.

### Step 6: Replay the Recorded Drive
In **Terminal 2**:
```bash
ssh med1@172.16.25.67
cd ~/av_project
./docker/shell.sh

# Inside Docker
ros2 bag play /workspace/data/bags/etrike_loop_01 \
  --clock \
  --rate 0.5
```
* **Watch your screen (`DISPLAY=:1`):** As the bag plays back at half speed, the green vehicle trajectory path (`/path`) will extend and the dense colorful 3D point cloud map (`/map`) will accumulate scan by scan.

---

## Phase 5: Save & Export the 3D Map

### Step 7: Trigger Map Export
When Terminal 2 finishes replaying the bag:
In a terminal inside Docker, run:
```bash
ros2 service call /map_save std_srvs/srv/Empty "{}"
```
* Stop the mapper in Terminal 1 with `Ctrl + C`.
* Output files generated in `~/av_project/data/`:
  * `map.pcd` — 3D point cloud map.
  * `pose_graph.g2o` — optimized trajectory and graph constraints.

### Step 8: View the Final Static Map
Inspect the map geometry:
```bash
DISPLAY=:1 pcl_viewer ~/av_project/data/map.pcd
```
* Confirm vertical structures (walls, poles) are crisp and the loop beginning/end merged cleanly without double walls.

---

## Phase 6: Load Map in Autoware Universe

### Step 9: Package for Autoware
```bash
mkdir -p /autoware_map/bajaj_track
cp ~/av_project/data/map.pcd /autoware_map/bajaj_track/pointcloud_map.pcd
echo "projector_type: Local" > /autoware_map/bajaj_track/map_projector_info.yaml
```

### Step 10: Run Autoware with the New Map
```bash
DISPLAY=:1 ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/bajaj_track \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=false
```
1. Replay the bag in a separate terminal:
   ```bash
   ros2 bag play /workspace/data/bags/etrike_loop_01 --clock
   ```
2. Click **"2D Pose Estimate"** in RViz2 and drag on the map at the approximate vehicle start pose.
3. Live LiDAR points will snap into `pointcloud_map.pcd`, locking the vehicle's position.
