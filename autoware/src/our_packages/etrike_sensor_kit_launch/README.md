# etrike_sensor_kit_launch

Top-level **sensing orchestration** for the E-Trike. Bundles LiDAR, IMU (stub), velocity converter, and (optionally) the dual Kinect v2 cameras into one launch under the `sensing` group.

## Logic (sensing.launch.xml)

```
sensing.launch.xml
  ├─ lidar.launch.xml
  │     push namespace "lidar" → "top"
  │     include etrike_common_launch/hesai_XT32M2X.launch.xml
  │        (max_range=300, sensor_frame=lidar_link, sensor_ip=192.168.1.201, ...)
  │
  ├─ imu.launch.xml        (STUB — relays /imu_raw → imu/imu_data; no real IMU yet)
  │
  ├─ autoware_vehicle_velocity_converter.launch.xml
  │     input  = /vehicle/status/velocity_status
  │     output = /sensing/vehicle_velocity_converter/twist_with_covariance
  │
  └─ etrike_kinect2/dual_kinect.launch.py   (if launch_kinect == true)
        front + rear Kinect v2 as separate processes
```

## Args
| Arg | Default | Meaning |
|---|---|---|
| `launch_driver` | `true` | launch sensor drivers |
| `vehicle_mirror_param_file` | (required) | mirror crop envelope YAML |
| `pointcloud_container_name` | `pointcloud_container` | Nebula container name |
| `vehicle_id` | `$VEHICLE_ID` | env |
| `launch_kinect` | `false` | enable dual Kinect v2 (needs libfreenect2) |

## Topics (aggregated)
| Topic | Type | Source |
|---|---|---|
| `/sensing/lidar/top/pointcloud_before_sync` | `PointCloud2` | Nebula + preprocessors |
| `/sensing/imu/imu_data` | `Imu` | IMU stub (relay) |
| `/sensing/vehicle_velocity_converter/twist_with_covariance` | `TwistWithCovarianceStamped` | velocity_converter |
| `/kinect/front/...`, `/kinect/rear/...` | `Image`/`CameraInfo` | etrike_kinect2 (if enabled) |

## Included packages
- `etrike_common_launch` — Hesai XT32M2X Nebula driver + crop/distort/ring filters
- `etrike_sensor_kit_launch/imu.launch.xml` — placeholder IMU relay
- `autoware_vehicle_velocity_converter` — velocity → twist for distortion correction
- `etrike_kinect2` — dual Kinect v2 (optional)
