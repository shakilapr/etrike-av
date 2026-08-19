# etrike_lidar_viewer

Standalone **LiDAR point-cloud viewer** for the Hesai XT32M2X. Launches only the Nebula driver + RViz2 — independent of the full Autoware stack — for quick hardware bring-up and debugging.

## Logic (lidar_view.launch.py)

```
lidar_view.launch.py
  ├─ Node: nebula_hesai/hesai_ros_wrapper_node
  │     namespace = sensing/lidar/top
  │     remap aw_points_ex → pointcloud_raw_ex
  │     params: sensor_model=PandarXT32M, sensor_ip=192.168.1.201,
  │             frame_id=lidar_link, calibration=PandarXT32M.csv,
  │             firetime_file_path=XT32M2X_Firetime.csv, udp_only=true
  │
  ├─ Node: tf2_ros/static_transform_publisher
  │     base_link → lidar_link @ (0,0,1.7464)   # fixes "Fixed Frame missing"
  │
  └─ Node: rviz2 -d lidar_only.rviz
        shows /sensing/lidar/top/pointcloud_raw_ex in lidar_link
```

## Topics
| Topic | Type | Produced by | Purpose |
|---|---|---|---|
| `/sensing/lidar/top/pointcloud_raw_ex` | `PointCloud2` | HesaiRosWrapper | Raw lidar cloud |
| `lidar_link` TF | `tf2_msgs/TFMessage` | static_transform_publisher | Frame for RViz fixed frame |

## Usage
```bash
# inside Autoware container, on Jetson with LiDAR connected:
ros2 launch etrike_lidar_viewer lidar_view.launch.py
```

## Notes
- `udp_only=true` + `host_ip=0.0.0.0` for direct UDP capture (no PTP needed for viewing).
- No preprocessing (crop/distortion) — raw cloud only.
- Uses the E-Trike firetime CSV from `etrike_common_launch/config/lidar/`.
