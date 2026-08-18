# E-Trike Mapping Guide

This document outlines the end-to-end offline mapping workflow: recording sensor data, building a point cloud map (`.pcd`), previewing the result, and loading it back into Autoware.

> [!WARNING]
> **Missing Hardware IMU:** The E-Trike currently uses an IMU stub. Without a real hardware IMU, mapping algorithms rely purely on LiDAR odometry and vehicle kinematics, which can result in drift or distorted maps during sharp turns. Install the physical IMU (e.g., Tamagawa) for production-grade mapping.

---

## 1. Record the Data (Live on Vehicle)

To build a map, you must record a ROS 2 bag of the raw LiDAR data while driving the environment.

**Q: Can I see a preview of the cloud while recording?**
**Yes!** You can use the lightweight standalone script to preview the LiDAR without spinning up the heavy Autoware localization stack.

**Terminal 1 (Preview):**
Open a terminal on the Jetson, enter the Docker container, and start the viewer:
```bash
cd ~/av_project
./docker/shell.sh
./scripts/lidar_standalone.sh
```
*(This launches the driver and RViz2 so you can monitor the live cloud).*

**Terminal 2 (Record):**
Open a second terminal, enter the container, and start recording the essential mapping topics:
```bash
cd ~/av_project
./docker/shell.sh
ros2 bag record \
  /sensing/lidar/top/pointcloud_raw_ex \
  /sensing/lidar/top/pointcloud_before_sync \
  /tf \
  /tf_static
```
Drive the environment smoothly in loops to ensure good coverage. When finished, press `Ctrl+C` to stop recording. The bag will be saved as a directory in your current folder.

---

## 2. Build the Map (Offline)

Autoware Universe does not map live. You must process the bag offline to generate the map. Because mapping is computationally heavy, it is highly recommended to transfer the bag file to a powerful desktop PC rather than mapping on the Jetson.

The most common SLAM (Simultaneous Localization and Mapping) tools used with Autoware and Hesai LiDARs are:
1. **LIO-SAM / FAST-LIO2:** Excellent open-source algorithms for mechanical LiDARs.
2. **TIER IV's Mapping Tools:** `autoware_map_builder` / `ndt_mapping`.

**General Workflow:**
You will launch your chosen mapping node, then "play back" the recorded bag file into it. The mapping node will stitch the scans together and output a `.pcd` (Point Cloud Data) file.

*(Example conceptual workflow using a 3rd-party mapping tool)*:
```bash
# Launch the mapping software (requires installing the tool first)
ros2 launch my_mapping_tool mapper.launch.py

# In a separate terminal, play your bag file into the mapper
ros2 bag play my_recorded_bag_directory
```

---

## 3. Preview the Generated Map

Once the mapping tool finishes, it will produce a `.pcd` file. You should preview this map to ensure it is clean and not warped before using it in Autoware.

The easiest way to view a `.pcd` file natively in Ubuntu is using `pcl_viewer`:
```bash
# Install PCL tools on your host machine
sudo apt update && sudo apt install pcl-tools

# Open the map in the 3D viewer
pcl_viewer my_generated_map.pcd
```
*Use your mouse to rotate and inspect the map. Check corners and straightaways to ensure there is no "double vision" or drifting.*

---

## 4. Use the Map in Autoware

Once you are satisfied with the map, prepare it for Autoware:
1. Create a dedicated folder for your map (e.g., `~/autoware_map/my-new-map`).
2. Rename your generated `.pcd` file to **`pointcloud_map.pcd`** (Autoware looks for this exact filename by default).
3. Place the file inside your map folder.

**Launch Autoware with the Map:**
Enter your container and launch the full Autoware stack, pointing it to your new map folder:
```bash
cd ~/av_project
./docker/shell.sh
ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/my-new-map \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=true
```

**Final Steps in RViz2:**
1. RViz2 will open and load the static pre-recorded map (`pointcloud_map.pcd`).
2. You will see the live LiDAR scan overlaid on top of it.
3. Click the **"2D Pose Estimate"** tool at the top of RViz2.
4. Click on the map at the approximate location and orientation of the E-Trike.
5. Autoware's NDT Localizer will immediately snap the live scan perfectly into the map, locking your position!
