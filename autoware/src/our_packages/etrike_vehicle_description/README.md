# etrike_vehicle_description

URDF **vehicle body** and kinematic parameters for the Bajaj RE three-wheeler (E-Trike). Defines `base_link`, wheels, steering, and the roof-mounted Hesai LiDAR link.

## Files
| File | Role |
|---|---|
| `urdf/vehicle.xacro` | Full vehicle: chassis, 3 wheels, front steering, `lidar_link` |
| `config/vehicle_info.param.yaml` | Vehicle dimensions (length/width/height/overhang/track) |
| `config/mirror.param.yaml` | Mirror crop envelope |
| `config/simulator_model.param.yaml` | Simulator model params |

## Logic (vehicle.xacro)
```
base_footprint (ground projection of rear axle)
  └─ base_link
       ├─ rear_left_wheel_link  (continuous joint, +Y track/2)
       ├─ rear_right_wheel_link (continuous joint, -Y track/2)
       ├─ front_steering_link   (revolute ±0.747 rad)
       │     └─ front_wheel_link (continuous)
       └─ lidar_link (fixed, roof +1.7464 m)
```

Frame convention: **+X forward, +Y left, +Z up**. `base_footprint` is at rear-axle ground point.

## Key dimensions (vehicle_info.param.yaml)
| Param | Value | Meaning |
|---|---|---|
| `wheel_base` | `2.000` | m |
| `wheel_tread` | `1.150` | rear track |
| `wheel_radius` | `0.203` | m |
| `front_overhang` | `0.203` | m |
| `rear_overhang` | `0.432` | m |
| `vehicle_height` | `1.700` | m |
| `left_overhang` / `right_overhang` | from width | m |

## LiDAR link
```
lidar_link: fixed joint from base_link
  xyz = (0.575, 0.0, 1.7464)   # 1.700 roof + 0.0464 optical offset
  Used by etrike_common_launch as frame_id="lidar_link"
```

## Topics
This package is **URDF/param only** — no ROS topics. Consumed by:
- `robot_state_publisher` → publishes `base_link` → wheel/lidar TF
- `etrike_common_launch` → reads `vehicle_info.param.yaml` for crop-box envelope
- Autoware vehicle interface → vehicle dimensions
