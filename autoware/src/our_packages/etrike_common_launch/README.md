# etrike_common_launch

Shared launch infrastructure for the **Hesai XT32M2X** 3D LiDAR via **Nebula** (`nebula_hesai`), plus the Autoware pointcloud preprocessing pipeline (crop-box, distortion correction, ring outlier filter) composed into a single container.

## Packages / files
| File | Role |
|---|---|
| `launch/hesai_XT32M2X.launch.xml` | XML wrapper → passes args to `nebula_node_container.launch.py` |
| `launch/nebula_node_container.launch.py` | Composable container: Nebula driver + 4 preprocessor components |
| `launch/etrike_mapping.launch.xml` | Mapping-stack bring-up (separate concern) |
| `config/xt32m2x/*.param.yaml` | Distortion corrector + ring outlier filter params |
| `config/lidar/PandarXT32M.csv` | Angle-correction CSV (device) |
| `config/lidar/XT32M2X_Firetime.csv` | Per-channel firetime CSV (E-Trike patch, see `patches/`) |

## Logic (nebula_node_container.launch.py)

```
sensor_model = "PandarXT32M"  → make="Hesai", ext=".csv"
calibration_file:
    if calibration_file_path arg given → use it
    else → nebula_hesai_decoders/calibration/PandarXT32M.csv

container (ComposableNodeContainer):
  ├─ HesaiRosWrapper (nebula_hesai)
  │     remap velodyne_points → pointcloud_raw_ex
  │     params: sensor_ip, host_ip, data_port, gnss_port, return_mode,
  │             min/max_range, frame_id, rotation_speed, ptp_*, firetime_file_path
  ├─ CropBoxFilterComponent "crop_box_filter_self"
  │     input=pointcloud_raw_ex → output=self_cropped/pointcloud_ex
  │     crop = vehicle body envelope (from vehicle_info.param.yaml)
  ├─ CropBoxFilterComponent "crop_box_filter_mirror"
  │     input=self_cropped/pointcloud_ex → output=mirror_cropped/pointcloud_ex
  │     crop = mirror envelope (from vehicle_mirror_param_file)
  ├─ DistortionCorrectorComponent "distortion_corrector_node"
  │     ~/input/twist      ← /sensing/vehicle_velocity_converter/twist_with_covariance
  │     ~/input/imu        ← /sensing/imu/imu_data
  │     ~/input/pointcloud ← mirror_cropped/pointcloud_ex
  │     ~/output/pointcloud→ rectified/pointcloud_ex
  └─ RingOutlierFilterComponent "ring_outlier_filter"
        input=rectified/pointcloud_ex → output=pointcloud_before_sync
        output_frame = frame_id (if output_as_sensor_frame) else keep input

use_intra_process = true  → zero-copy between components
```

## Topics (effective after launch)
| Topic | Type | Produced by | Purpose |
|---|---|---|---|
| `pointcloud_raw_ex` | `sensor_msgs/PointCloud2` | HesaiRosWrapper | Raw lidar (remapped from `aw_points_ex`) |
| `self_cropped/pointcloud_ex` | `PointCloud2` | CropBox self | Vehicle body removed |
| `mirror_cropped/pointcloud_ex` | `PointCloud2` | CropBox mirror | Mirrors removed |
| `rectified/pointcloud_ex` | `PointCloud2` | DistortionCorrector | Motion-corrected |
| `pointcloud_before_sync` | `PointCloud2` | RingOutlierFilter | Final preprocessed cloud |
| `/sensing/imu/imu_data` | `sensor_msgs/Imu` | (external IMU) | Distortion input |
| `/sensing/vehicle_velocity_converter/twist_with_covariance` | `geometry_msgs/TwistWithCovarianceStamped` | velocity_converter | Distortion input |

## Key args (hesai_XT32M2X.launch.xml → nebula)
| Arg | Default | Meaning |
|---|---|---|
| `sensor_ip` | `192.168.1.201` | LiDAR IP |
| `host_ip` | `192.168.1.10` | Jetson IP |
| `data_port` | `2368` | LiDAR data UDP |
| `gnss_port` | `10110` | LiDAR GNSS UDP |
| `return_mode` | `LastStrongest` | Pulse return handling |
| `max_range` / `min_range` | `300.0` / `0.3` | m |
| `rotation_speed` | `600` | RPM |
| `calibration_file_path` | `""` | override auto-resolve |
| `firetime_file_path` | `""` | per-channel firetime CSV |
| `ptp_*` | `1588v2/0/UDP/TSN/100` | PTP sync config |
| `use_intra_process` | `true` | intra-process comms |
| `use_multithread` | `false` | MT container |

## Notes
- Derived from Tier IV `nebula_node_container.launch.py`; adds `calibration_file_path` override and firetime/PTP args.
- Vehicle envelope for crop-box is read from `etrike_vehicle_description/config/vehicle_info.param.yaml` when launched standalone.
- Mirror envelope from `vehicle_mirror_param_file` arg (injected by `sensing.launch.xml`).
