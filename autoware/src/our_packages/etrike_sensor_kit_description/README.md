# etrike_sensor_kit_description

URDF **sensor frames** and calibration for the E-Trike sensor kit. Defines the TF tree for all mounted sensors relative to `base_link`.

## Files
| File | Role |
|---|---|
| `urdf/sensors.xacro` | Top-level: loads `sensors_calibration.yaml`, includes all sensor macros |
| `urdf/sensor_kit.xacro` | `sensor_kit_base_link` frame (Autoware expectation) |
| `urdf/kinect_v2.xacro` | *(from etrike_kinect2)* Kinect front/rear link + optical frames |
| `config/sensors_calibration.yaml` | Extrinsic poses (x/y/z/roll/pitch/yaw) per sensor |

## Logic (sensors.xacro)

```
load_yaml(sensors_calibration.yaml) → calibration
  include sensor_kit.xacro          → sensor_kit_base_link (child of base_link)
  include $(etrike_kinect2)/urdf/kinect_v2.xacro
  kinect_v2_macro name=kinect_front parent=base_link
        x/y/z/roll/pitch/yaw, from calibration['base_link']['kinect_front']
  kinect_v2_macro name=kinect_rear  parent=base_link
        x/y/z/roll/pitch/yaw, from calibration['base_link']['kinect_rear']
```

## TF tree produced
```
base_link
├── sensor_kit_base_link
├── kinect_front_link
│   ├── kinect_front_rgb_optical_frame
│   ├── kinect_front_depth_optical_frame
│   └── kinect_front_ir_optical_frame
└── kinect_rear_link
    ├── kinect_rear_rgb_optical_frame
    ├── kinect_rear_depth_optical_frame
    └── kinect_rear_ir_optical_frame
```
(lidar_link is defined in `etrike_vehicle_description/urdf/vehicle.xacro`, not here.)

## calibration (sensors_calibration.yaml)
| Key | x | y | z | roll | pitch | yaw |
|---|---|---|---|---|---|---|
| `sensor_kit_base_link` | 0 | 0 | 0 | 0 | 0 | 0 |
| `kinect_front` | 1.2 | 0 | 1.0 | 0 | 0 | 0 |
| `kinect_rear` | -0.8 | 0 | 1.0 | 0 | 0 | π |

> Poses are **placeholders** — calibrate after physical mounting. The LiDAR `lidar_link` origin is set in `etrike_vehicle_description` (roof, +1.7464 m).

## Topics
This package defines **frames only** — no ROS topics published. The frames are consumed by:
- `robot_state_publisher` (provides the static TF)
- `etrike_kinect2` (publishes images with `frame_id = kinect_*_optical_frame`)
- Autoware perception (expects `base_link` → sensor frames)
