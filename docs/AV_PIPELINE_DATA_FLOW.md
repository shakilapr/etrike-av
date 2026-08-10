# AV Pipeline: Data Flow Between Stages

This document describes what data (topics / messages / data) flows between each
stage of the autonomous vehicle pipeline:

```
Sensors → Sensing → Localization + Perception → Planning → Control → Vehicle Interface → Vehicle
```

Message structures follow the Autoware / ROS 2 conventions used in this project.

---

## 1. Sensors → Sensing (raw hardware readings)

Raw, uncalibrated, unsynchronized sensor output straight from drivers.

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/sensing/camera/*/image_raw` | `sensor_msgs/msg/Image` | Raw camera frames (bayer/mono) |
| `/sensing/camera/*/compressed` | `sensor_msgs/msg/CompressedImage` | JPEG-compressed frames |
| `/sensing/lidar/*/pointcloud` | `sensor_msgs/msg/PointCloud2` | Raw LiDAR sweeps (motion-distorted) |
| `/sensing/imu` | `sensor_msgs/msg/Imu` | Angular velocity + linear acceleration + orientation |
| `/sensing/gnss/fix` | `sensor_msgs/msg/NavSatFix` | Latitude / longitude / altitude |
| `/sensing/gnss/fix_velocity` | `geometry_msgs/msg/TwistWithCovarianceStamped` | GNSS-derived velocity |
| `/sensing/wheel_encoder` | `autoware_vehicle_msgs/msg/WheelSpeed` | Per-wheel ticks / speed |
| `/sensing/radar/*/radar_scan` | `radar_msgs/msg/RadarScan` | Radar targets (range, speed, angle) |
| `/sensing/ultrasonic/*` | `sensor_msgs/msg/Range` | Proximity distance |

`Imu.msg`
```
std_msgs/Header header
geometry_msgs/Quaternion orientation
float64[9] orientation_covariance
geometry_msgs/Vector3 angular_velocity
float64[9] angular_velocity_covariance
geometry_msgs/Vector3 linear_acceleration
float64[9] linear_acceleration_covariance
```

`NavSatFix.msg`
```
std_msgs/Header header
sensor_msgs/NavSatStatus status
float64 latitude
float64 longitude
float64 altitude
float64[9] position_covariance
```

---

## 2. Sensing → Localization + Perception (calibrated, synced, filtered)

Sensing performs driver-level preprocessing: calibration, time
synchronization, distortion correction, filtering. Output is clean,
sensor-fused-ready data.

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/sensing/camera/*/image_rect` | `sensor_msgs/msg/Image` | Rectified (undistorted) images |
| `/sensing/lidar/*/pointcloud_raw` | `sensor_msgs/msg/PointCloud2` | Deskewed, filtered, calibrated point cloud |
| `/sensing/imu/concat` | `sensor_msgs/msg/Imu` | Time-synced concatenated IMU |
| `/tf` | `tf2_msgs/msg/TFMessage` | Sensor extrinsic calibration (sensor→base_link) |
| `/sensing/synchronized/*` | `autoware_sensing_msgs/msg/SynchronizedData` | Time-aligned sensor bundle |

`SynchronizedData.msg`
```
builtin_interfaces/Time stamp
sensor_msgs/Image[] images
sensor_msgs/PointCloud2[] pointclouds
sensor_msgs/Imu[] imus
```

---

## 3a. Localization → Planning (ego state)

Estimates where the vehicle is and how it is moving in the map frame.

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/localization/kinematic_state` | `nav_msgs/msg/Odometry` | Ego pose + twist (velocity, yaw rate) |
| `/localization/pose` | `geometry_msgs/msg/PoseWithCovarianceStamped` | Filtered pose with covariance |
| `/tf` | `tf2_msgs/msg/TFMessage` | map → base_link transform |
| `/localization/gnss_pose` | `geometry_msgs/msg/PoseStamped` | Raw GNSS pose (debug / init) |

`Odometry.msg`
```
std_msgs/Header header
string child_frame_id
geometry_msgs/PoseWithCovariance pose
geometry_msgs/TwistWithCovariance twist
```

---

## 3b. Perception → Planning (environment understanding)

Detects, tracks, and predicts the dynamic and static environment.

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/perception/object_recognition/objects` | `autoware_perception_msgs/msg/DetectedObjects` | Tracked objects: box, class, velocity |
| `/perception/object_recognition/objects_predicted` | `autoware_perception_msgs/msg/PredictedObjects` | Future trajectories of dynamic objects |
| `/perception/traffic_light_recognition/traffic_signals` | `autoware_perception_msgs/msg/TrafficLightGroupArray` | Signal state per junction |
| `/perception/occupancy_grid_map` | `nav_msgs/msg/OccupancyGrid` | Costmap / freespace |
| `/map/lanelet2_map` | `autoware_map_msgs/msg/LaneletMapBin` | HD map (lanes, rules, signals) |
| `/map/vector_map` | `autoware_map_msgs/msg/MapBin` | Routing graph |

`DetectedObject.msg`
```
geometry_msgs/PoseWithCovariance pose
Shape shape                 # bounding box / polygon
ObjectClassification[] classification
TwistWithCovariance velocity
int32 semantic_id
```

`PredictedObject.msg`
```
PredictedObjectKinematics kinematics
PredictedPath[] predicted_paths   # each path = stamped poses
ObjectClassification[] classification
```

---

## 4. Planning → Control (desired motion)

Produces the trajectory the vehicle should follow, derived from route,
ego state, predicted objects, and traffic rules.

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/planning/trajectory` | `autoware_planning_msgs/msg/Trajectory` | Time/pose/velocity/accel profile |
| `/planning/path` | `autoware_planning_msgs/msg/Path` | Geometric path (no velocity) |
| `/planning/mission_planning/route` | `autoware_planning_msgs/msg/LaneletRoute` | Goal route |
| `/control/turn_indicators_cmd` | `autoware_vehicle_msgs/msg/TurnIndicatorsCommand` | Left / right / none |
| `/control/hazard_lights_cmd` | `autoware_vehicle_msgs/msg/HazardLightsCommand` | Hazard on/off |

`Trajectory.msg`
```
std_msgs/Header header
TrajectoryPoint[] points
```

`TrajectoryPoint.msg`
```
geometry_msgs/Pose pose
float32 longitudinal_velocity_mps
float32 lateral_velocity_mps
float32 acceleration_mps2
float32 heading_rate_rps
float32 front_wheel_angle_rad
float32 rear_wheel_angle_rad
builtin_interfaces/Duration time_from_start
```

---

## 5. Control → Vehicle Interface (actuation command)

Converts the trajectory into a low-level vehicle command.

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/control/command/control_cmd` | `autoware_control_msgs/msg/Control` | Steering + accel/brake + velocity |
| `/control/command/vehicle_cmd` | `autoware_vehicle_msgs/msg/VehicleCommand` | Ackermann command + indicators |
| `/control/command/gear_cmd` | `autoware_vehicle_msgs/msg/GearCommand` | Drive / reverse / park |

`Control.msg`
```
float32 steering_angle
float32 steering_angle_velocity
float32 acceleration
float32 velocity
float32 jerk
builtin_interfaces/Duration duration
```

`VehicleCommand.msg`
```
Control control
TurnIndicatorsCommand turn_indicators
HazardLightsCommand hazard_lights
GearCommand gear
```

---

## 6. Vehicle Interface → Vehicle (drive-by-wire)

Translates high-level commands into actuator signals on the vehicle bus.

| Direction | Topic | Msg Type | Contents |
|-----------|-------|----------|----------|
| VI → Vehicle | CAN / CAN-FD frames | (vendor proprietary) | Steering torque/angle, throttle %, brake pressure, gear shift, indicator relays |
| VI → Control | `/vehicle/status/control_mode` | `autoware_vehicle_msgs/msg/ControlModeReport` | Autonomous / manual |
| VI → Localization | `/vehicle/odometry` | `nav_msgs/msg/Odometry` | Wheel-odom ego state |
| Vehicle → VI | CAN feedback | (vendor proprietary) | Actual speed, steering angle, gear, faults |

`ControlModeReport.msg`
```
builtin_interfaces/Time stamp
uint8 mode   # 0 = MANUAL, 1 = AUTONOMOUS
bool emergency
```

`VehicleStatus.msg` (published by VI for the rest of the stack)
```
builtin_interfaces/Time stamp
float32 speed
float32 steering_angle
uint8 gear
float32 battery_level
ControlModeReport control_mode
```

---

## Feedback loops (closed control chain)

```
Vehicle → VI → /vehicle/odometry → Localization → Planning
VI → /vehicle/status/control_mode → Control (sanity / fallback)
Localization → map→base_link → Planning (ego pose re-entry)
```

The odometry and vehicle status feed back into Localization and Control so the
system can dead-reckon and verify that commanded actuation matches actual motion.
