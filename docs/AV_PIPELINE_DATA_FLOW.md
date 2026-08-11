# AV Pipeline: Data Flow Between Stages (Full Message Reference + Examples)

This document describes what data (topics / messages / data) flows between each
stage of the autonomous vehicle pipeline:

```
Sensors → Sensing → Localization + Perception → Planning → Control → Vehicle Interface → Vehicle
```

All Autoware message definitions below are taken verbatim from this repo
(`autoware/src/core/autoware_msgs/...`). Standard ROS 2 message types
(`std_msgs`, `geometry_msgs`, `sensor_msgs`, `nav_msgs`, `tf2_msgs`,
`unique_identifier_msgs`, `geographic_msgs`) are also reproduced in full in the
reference section at the bottom.

For every message, a **Example (published instance)** block shows what an actual
message looks like on the bus (JSON/YAML-like, `time` shown as `sec.nanosec`).

---

## 1. Sensors → Sensing (raw hardware readings)

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/sensing/camera/front/image_raw` | `sensor_msgs/msg/Image` | Raw camera frames |
| `/sensing/camera/front/compressed` | `sensor_msgs/msg/CompressedImage` | JPEG-compressed frames |
| `/sensing/lidar/top/pointcloud_raw` | `sensor_msgs/msg/PointCloud2` | Raw LiDAR sweeps |
| `/sensing/imu/imu_data` | `sensor_msgs/msg/Imu` | Angular vel + linear accel + orientation |
| `/sensing/gnss/fix` | `sensor_msgs/msg/NavSatFix` | Lat / lon / alt |
| `/sensing/gnss/fix_velocity` | `geometry_msgs/msg/TwistWithCovarianceStamped` | GNSS velocity |
| `/sensing/radar/front/radar_objs` | `autoware_sensing_msgs/msg/RadarObjects` | Radar objects |
| `/sensing/radar/front/radar_info` | `autoware_sensing_msgs/msg/RadarInfo` | Radar metadata |
| `/sensing/ultrasonic/rear` | `sensor_msgs/msg/Range` | Proximity distance |

### `sensor_msgs/msg/Image`
```
std_msgs/Header header
uint32 height
uint32 width
string encoding
uint8 is_bigendian
uint32 step
uint8[] data
```
Example (published instance):
```yaml
header: { stamp: { sec: 1710000123, nanosec: 450000000 }, frame_id: "camera_front" }
height: 1080
width: 1920
encoding: "bgr8"
is_bigendian: 0
step: 5760                # width * 3
data: [255, 128, 0, 16, 240, 32, ... ]   # 1080*1920*3 = 6220800 bytes
```

### `sensor_msgs/msg/CompressedImage`
```
std_msgs/Header header
string format
uint8[] data
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 450000000 }, frame_id: "camera_front" }
format: "jpeg"
data: [255, 216, 255, 224, 0, 16, ... ]   # JPEG byte stream
```

### `sensor_msgs/msg/PointCloud2`
```
std_msgs/Header header
uint32 height
uint32 width
sensor_msgs/PointField[] fields
bool is_bigendian
uint32 point_step
uint32 row_step
uint8[] data
bool is_dense
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 460000000 }, frame_id: "lidar_top" }
height: 1
width: 115000            # number of points
fields:
  - { name: "x", offset: 0,  datatype: 7, count: 1 }   # FLOAT32
  - { name: "y", offset: 4,  datatype: 7, count: 1 }
  - { name: "z", offset: 8,  datatype: 7, count: 1 }
  - { name: "intensity", offset: 12, datatype: 7, count: 1 }
  - { name: "ring", offset: 16, datatype: 4, count: 1 }  # UINT16
is_bigendian: false
point_step: 20           # 5 fields * 4 bytes
row_step: 2300000        # width * point_step
data: [ ... ]            # 115000 * 20 = 2300000 bytes
is_dense: false
```

### `sensor_msgs/msg/Imu`
```
std_msgs/Header header
geometry_msgs/Quaternion orientation
float64[9] orientation_covariance
geometry_msgs/Vector3 angular_velocity
float64[9] angular_velocity_covariance
geometry_msgs/Vector3 linear_acceleration
float64[9] linear_acceleration_covariance
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 465000000 }, frame_id: "imu_link" }
orientation: { x: 0.0, y: 0.0, z: 0.002, w: 0.99999 }   # mostly level
orientation_covariance: [-1,-1,-1, -1,-1,-1, -1,-1,-1]  # unknown
angular_velocity: { x: 0.01, y: -0.02, z: 0.15 }         # ~yaw rate 0.15 rad/s
angular_velocity_covariance: [1e-4,0,0, 0,1e-4,0, 0,0,1e-4]
linear_acceleration: { x: 0.05, y: -0.03, z: 9.81 }     # gravity on Z
linear_acceleration_covariance: [1e-3,0,0, 0,1e-3,0, 0,0,1e-3]
```

### `sensor_msgs/msg/NavSatFix`
```
std_msgs/Header header
sensor_msgs/NavSatStatus status
float64 latitude
float64 longitude
float64 altitude
float64[9] position_covariance
uint8 position_covariance_type
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 470000000 }, frame_id: "gnss_link" }
status: { status: 1, service: 1 }     # STATUS_FIX, SERVICE_GPS
latitude: 43.7712
longitude: 11.2583
altitude: 52.4
position_covariance: [0.04,0,0, 0,0.04,0, 0,0,0.09]   # ~std 0.2m horiz, 0.3m vert
position_covariance_type: 2                            # DIAGONAL_KNOWN
```

### `geometry_msgs/msg/TwistWithCovarianceStamped`
```
std_msgs/Header header
geometry_msgs/TwistWithCovariance twist
```
Example (GNSS velocity):
```yaml
header: { stamp: { sec: 1710000123, nanosec: 470000000 }, frame_id: "gnss_link" }
twist:
  twist: { linear: { x: 8.3, y: 0.1, z: 0.0 }, angular: { x: 0, y: 0, z: 0.12 } }
  covariance: [0.01,0,0,0,0,0, 0,0.01,0,0,0,0, 0,0,0.04,0,0,0,
               0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0]
```

### `autoware_sensing_msgs/msg/RadarObjects`
```
std_msgs/Header header
autoware_sensing_msgs/RadarObject[] objects
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 480000000 }, frame_id: "radar_front" }
objects:
  - object_id: 12
    age: 35
    measurement_status: 1            # MEASURED
    movement_status: 1               # DYNAMIC
    position: { x: 25.4, y: -1.2, z: 0.5 }
    velocity: { x: 6.1, y: 0.0, z: 0.0 }
    acceleration: { x: -0.2, y: 0, z: 0 }
    size: { x: 4.5, y: 2.0, z: 1.6 }
    position_covariance: [0.1,0,0,0,0.1,0]
    velocity_covariance: [0.04,0,0,0,0.04,0]
    acceleration_covariance: [-1,-1,-1,-1,-1,-1]
    size_covariance: [-1,-1,-1,-1,-1,-1]
    orientation: 0.0
    orientation_std: -1.0
    orientation_rate: 0.0
    orientation_rate_std: -1.0
    existence_probability: 0.95
    classifications: [ { class_id: 1, probability: 0.8 } ]
```

### `autoware_sensing_msgs/msg/RadarInfo`
```
std_msgs/Header header
autoware_sensing_msgs/RadarFieldInfo[] object_fields_info
autoware_sensing_msgs/RadarFieldInfo[] detection_fields_info
uint32[] available_classes
bool absolute_dynamics
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 480000000 }, frame_id: "radar_front" }
object_fields_info: [ { name: "velocity", type: 7, valid_range: [-40,40] } ]
detection_fields_info: [ { name: "amplitude", type: 7, valid_range: [0,255] } ]
available_classes: [1, 2, 6, 7]      # car, truck, bicycle, pedestrian
absolute_dynamics: true
```

### `autoware_sensing_msgs/msg/RadarClassification`  (nested in `RadarObject.classifications`)
```
uint8 UNKNOWN=0
uint8 CAR=1
uint8 TRUCK=2
uint8 BUS=3
uint8 TRAILER=4
uint8 MOTORCYCLE=5
uint8 BICYCLE=6
uint8 PEDESTRIAN=7
uint8 ANIMAL=8
uint8 HAZARD=9
uint8 OVER_DRIVABLE=10
uint8 UNDER_DRIVABLE=11

uint8 label
float32 probability    # 0.0 to 1.0
```

### `autoware_sensing_msgs/msg/RadarFieldInfo`  (nested in `RadarInfo.object_fields_info` / `detection_fields_info`)
```
std_msgs/String field_name
bool min_value_available
bool max_value_available
bool resolution_available
float32 min_value
float32 max_value
float32 resolution
```

### `autoware_sensing_msgs/msg/SourcePointCloudInfo`  (nested in `ConcatenatedPointCloudInfo`)
```
uint8 STATUS_OK=0
uint8 STATUS_TIMEOUT=1
uint8 STATUS_INVALID=2

std_msgs/Header header
string topic
uint8 status
uint32 idx_begin
uint32 length
```

### `autoware_sensing_msgs/msg/ConcatenatedPointCloudInfo`  (metadata for `/sensing/lidar/concatenated/pointcloud`)
```
uint8 STRATEGY_NAIVE=0
uint8 STRATEGY_ADVANCED=1

std_msgs/Header header
bool concatenation_success
uint8 matching_strategy
uint8[] matching_strategy_config
autoware_sensing_msgs/SourcePointCloudInfo[] source_info
```

### `sensor_msgs/msg/Range`
```
std_msgs/Header header
uint8 radiation_type        # 0 ULTRASOUND / 1 INFRARED
float32 field_of_view
float32 min_range
float32 max_range
float32 range
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 490000000 }, frame_id: "ultrasonic_rear" }
radiation_type: 0            # ULTRASOUND
field_of_view: 0.52
min_range: 0.15
max_range: 2.5
range: 0.83
```

---

## 2. Sensing → Localization + Perception (calibrated, synced, filtered)

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/sensing/camera/front/image_rect` | `sensor_msgs/msg/Image` | Rectified images |
| `/sensing/lidar/concatenated/pointcloud` | `sensor_msgs/msg/PointCloud2` | Deskewed, filtered cloud |
| `/sensing/imu/concat` | `sensor_msgs/msg/Imu` | Time-synced IMU |
| `/tf` | `tf2_msgs/msg/TFMessage` | Sensor extrinsic calibration |

### `tf2_msgs/msg/TFMessage`
```
geometry_msgs/TransformStamped[] transforms
```
Example (sensor → base_link static transform + map → base_link dynamic):
```yaml
transforms:
  - header: { stamp: { sec: 1710000123, nanosec: 460000000 }, frame_id: "base_link" }
    child_frame_id: "lidar_top"
    transform:
      translation: { x: 1.5, y: 0.0, z: 2.0 }
      rotation: { x: 0.0, y: 0.0, z: 0.0, w: 1.0 }
  - header: { stamp: { sec: 1710000123, nanosec: 460000000 }, frame_id: "map" }
    child_frame_id: "base_link"
    transform:
      translation: { x: 12345.6, y: 234.1, z: 0.0 }
      rotation: { x: 0.0, y: 0.0, z: 0.05, w: 0.9988 }
```
(See `geometry_msgs/TransformStamped`, `Transform`, `Vector3`, `Quaternion` in
reference section.)

---

## 3a. Localization → Planning (ego state)

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/localization/kinematic_state` | `nav_msgs/msg/Odometry` | Ego pose + twist |
| `/localization/pose` | `geometry_msgs/msg/PoseWithCovarianceStamped` | Filtered pose |
| `/tf` | `tf2_msgs/msg/TFMessage` | map → base_link |
| `/localization/gnss_pose` | `geometry_msgs/msg/PoseStamped` | Raw GNSS pose |

### `nav_msgs/msg/Odometry`
```
std_msgs/Header header
string child_frame_id
geometry_msgs/PoseWithCovariance pose
geometry_msgs/TwistWithCovariance twist
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 500000000 }, frame_id: "map" }
child_frame_id: "base_link"
pose:
  pose: { position: { x: 12345.6, y: 234.1, z: 0.0 },
          orientation: { x: 0, y: 0, z: 0.05, w: 0.9988 } }
  covariance: [0.01,0,0,0,0,0, 0,0.01,0,0,0,0, 0,0,0.02,0,0,0,
               0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0.005]
twist:
  twist: { linear: { x: 8.3, y: 0.0, z: 0.0 }, angular: { x: 0, y: 0, z: 0.12 } }
  covariance: [0.04,0,0,0,0,0, 0,0.04,0,0,0,0, 0,0,0.04,0,0,0,
               0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0.001]
```

### `geometry_msgs/msg/PoseWithCovarianceStamped`
```
std_msgs/Header header
geometry_msgs/PoseWithCovariance pose
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 500000000 }, frame_id: "map" }
pose:
  pose: { position: { x: 12345.6, y: 234.1, z: 0.0 },
          orientation: { x: 0, y: 0, z: 0.05, w: 0.9988 } }
  covariance: [0.01,0,0,0,0,0, 0,0.01,0,0,0,0, 0,0,0.02,0,0,0,
               0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0.005]
```

### `geometry_msgs/msg/PoseStamped`
```
std_msgs/Header header
geometry_msgs/Pose pose
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 470000000 }, frame_id: "map" }
pose: { position: { x: 12345.4, y: 234.0, z: 0.0 },
        orientation: { x: 0, y: 0, z: 0.05, w: 0.9988 } }
```

---

## 3b. Perception → Planning (environment understanding)

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/perception/object_recognition/objects` | `autoware_perception_msgs/msg/TrackedObjects` | Tracked objects |
| `/perception/object_recognition/objects_predicted` | `autoware_perception_msgs/msg/PredictedObjects` | Future trajectories |
| `/perception/traffic_light_recognition/traffic_signals` | `autoware_perception_msgs/msg/TrafficLightGroupArray` | Signal states |
| `/perception/occupancy_grid_map` | `nav_msgs/msg/OccupancyGrid` | Costmap / freespace |
| `/map/vector_map` | `autoware_map_msgs/msg/LaneletMapBin` | HD map |
| `/map/map_projector_info` | `autoware_map_msgs/msg/MapProjectorInfo` | Projection metadata |

### `autoware_perception_msgs/msg/TrackedObjects`
```
std_msgs/Header header
autoware_perception_msgs/TrackedObject[] objects
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 510000000 }, frame_id: "map" }
objects:
  - object_id: { uuid: [12,34,56,78, 0,0,0,0, 0,0,0,0, 0,0,0,1] }
    existence_probability: 0.98
    classification: [ { label: 1, probability: 0.95 } ]     # CAR
    kinematics:
      pose_with_covariance:
        pose: { position: { x: 12360.2, y: 233.0, z: 0.8 },
                orientation: { x: 0, y: 0, z: 0.01, w: 0.99995 } }
        covariance: [0.04,0,0,0,0,0, 0,0.04,0,0,0,0, 0,0,0.01,0,0,0,
                     0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0.002]
      twist_with_covariance:
        twist: { linear: { x: 7.9, y: 0.0, z: 0.0 }, angular: { x: 0, y: 0, z: 0.0 } }
        covariance: [0.1,0,0,0,0,0, 0,0.1,0,0,0,0, 0,0,0.1,0,0,0,
                     0,0,0,0,0,0, 0,0,0,0,0,0, 0,0,0,0,0,0.01]
      acceleration_with_covariance:
        accel: { linear: { x: 0.0, y: 0, z: 0 }, angular: { x: 0, y: 0, z: 0 } }
        covariance: [36x -1.0]
      orientation_availability: 2            # AVAILABLE
      is_stationary: false
    shape:
      type: 0                                # BOUNDING_BOX
      footprint: { points: [] }
      dimensions: { x: 4.6, y: 2.0, z: 1.5 }
```
*(Array `objects` can contain many such entries; shown is one car ahead.)*

### `autoware_perception_msgs/msg/PredictedObjects`
```
std_msgs/Header header
autoware_perception_msgs/PredictedObject[] objects
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 510000000 }, frame_id: "map" }
objects:
  - object_id: { uuid: [12,34,56,78, 0,0,0,0, 0,0,0,0, 0,0,0,1] }
    existence_probability: 0.98
    classification: [ { label: 1, probability: 0.95 } ]
    kinematics:
      initial_pose_with_covariance:
        pose: { position: { x: 12360.2, y: 233.0, z: 0.8 },
                orientation: { x: 0, y: 0, z: 0.01, w: 0.99995 } }
        covariance: [36x 0.0]
      initial_twist_with_covariance:
        twist: { linear: { x: 7.9, y: 0, z: 0 }, angular: { x: 0, y: 0, z: 0 } }
        covariance: [36x 0.0]
      initial_acceleration_with_covariance:
        accel: { linear: { x: 0, y: 0, z: 0 }, angular: { x: 0, y: 0, z: 0 } }
        covariance: [36x 0.0]
      predicted_paths:
        - path: [ { position: { x: 12360.2, y: 233.0, z: 0.8 }, orientation: {x:0,y:0,z:0.01,w:0.99995} },
                  { position: { x: 12368.1, y: 233.0, z: 0.8 }, orientation: {x:0,y:0,z:0.01,w:0.99995} },
                  { position: { x: 12376.0, y: 233.1, z: 0.8 }, orientation: {x:0,y:0,z:0.01,w:0.99995} } ]
          time_step: { sec: 0, nanosec: 500000000 }   # 0.5 s
          confidence: 0.85
    shape:
      type: 0
      footprint: { points: [] }
      dimensions: { x: 4.6, y: 2.0, z: 1.5 }
```

### `autoware_perception_msgs/msg/DetectedObjects` (pre-tracking)
```
std_msgs/Header header
autoware_perception_msgs/DetectedObject[] objects
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 505000000 }, frame_id: "map" }
objects:
  - existence_probability: 0.9
    classification: [ { label: 7, probability: 0.88 } ]   # PEDESTRIAN
    kinematics:
      pose_with_covariance:
        pose: { position: { x: 12350.0, y: 238.4, z: 0.9 }, orientation: { x:0,y:0,z:0,w:1 } }
        covariance: [36x 0.0]
      has_position_covariance: true
      orientation_availability: 1            # SIGN_UNKNOWN
      twist_with_covariance:
        twist: { linear: { x: 0.0, y: 1.1, z: 0 }, angular: { x:0,y:0,z:0 } }
        covariance: [36x 0.0]
      has_twist: true
      has_twist_covariance: false
    shape:
      type: 0
      footprint: { points: [] }
      dimensions: { x: 0.6, y: 0.6, z: 1.8 }
```

### `autoware_perception_msgs/msg/TrafficLightGroupArray`
```
builtin_interfaces/Time stamp
autoware_perception_msgs/TrafficLightGroup[] traffic_light_groups
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 515000000 }
traffic_light_groups:
  - traffic_light_group_id: 521
    elements:
      - color: 1            # RED
        shape: 1            # CIRCLE
        status: 2           # SOLID_ON
        confidence: 0.97
      - color: 3            # GREEN
        shape: 1            # CIRCLE
        status: 1           # SOLID_OFF
        confidence: 0.95
    predictions: []
```

### `autoware_perception_msgs/msg/TrafficSignalArray` (legacy)
```
builtin_interfaces/Time stamp
autoware_perception_msgs/TrafficSignal[] signals
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 515000000 }
signals:
  - traffic_signal_id: 521
    elements:
      - color: 1            # RED
        shape: 1            # CIRCLE
        status: 2           # SOLID_ON
        confidence: 0.97
```

### `nav_msgs/msg/OccupancyGrid`
```
std_msgs/Header header
nav_msgs/MapMetaData info
int8[] data
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 520000000 }, frame_id: "map" }
info:
  map_load_time: { sec: 1710000000, nanosec: 0 }
  resolution: 0.5
  width: 200
  height: 200
  origin: { position: { x: 12200.0, y: 100.0, z: 0.0 }, orientation: { x:0,y:0,z:0,w:1 } }
data: [0, 0, 0, 50, 100, 100, ... ]   # 200*200 = 40000 cells; 0 free, 100 occupied, -1 unknown
```

### `autoware_map_msgs/msg/LaneletMapBin`
```
std_msgs/Header header
string version_map_format
string version_map
string name_map
uint8[] data
```
Example:
```yaml
header: { stamp: { sec: 1710000000, nanosec: 0 }, frame_id: "map" }
version_map_format: "1.1.1"
version_map: "1.0.0"
name_map: "etrike_campus"
data: [137, 76, 90, 109, 112, ... ]   # binary lanelet2 .osm protobuf blob
```

### `autoware_map_msgs/msg/MapProjectorInfo`
```
string projector_type
string vertical_datum
string mgrs_grid
geographic_msgs/GeoPoint map_origin
float32 scale_factor
```
Example:
```yaml
projector_type: "LocalCartesianUTM"
vertical_datum: "WGS84"
mgrs_grid: ""
map_origin: { latitude: 43.7712, longitude: 11.2583, altitude: 0.0 }
scale_factor: 0.9996
```

---

## 4. Planning → Control (desired motion)

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/planning/trajectory` | `autoware_planning_msgs/msg/Trajectory` | Time/pose/velocity profile |
| `/planning/path` | `autoware_planning_msgs/msg/Path` | Geometric path + bounds |
| `/planning/mission_planning/route` | `autoware_planning_msgs/msg/LaneletRoute` | Goal route |
| `/planning/route_state` | `autoware_planning_msgs/msg/RouteState` | Route status |
| `/control/turn_indicators_cmd` | `autoware_vehicle_msgs/msg/TurnIndicatorsCommand` | Turn signals |
| `/control/hazard_lights_cmd` | `autoware_vehicle_msgs/msg/HazardLightsCommand` | Hazard lights |

### `autoware_planning_msgs/msg/Trajectory`
```
std_msgs/Header header
autoware_planning_msgs/TrajectoryPoint[] points
```
Example (3 of ~50 points):
```yaml
header: { stamp: { sec: 1710000123, nanosec: 530000000 }, frame_id: "map" }
points:
  - time_from_start: { sec: 0, nanosec: 0 }
    pose: { position: { x: 12345.6, y: 234.1, z: 0.0 }, orientation: { x:0,y:0,z:0.05,w:0.9988 } }
    longitudinal_velocity_mps: 8.3
    lateral_velocity_mps: 0.0
    acceleration_mps2: 0.0
    heading_rate_rps: 0.12
    front_wheel_angle_rad: 0.024
    rear_wheel_angle_rad: 0.0
  - time_from_start: { sec: 0, nanosec: 100000000 }   # +0.1 s
    pose: { position: { x: 12346.4, y: 234.1, z: 0.0 }, orientation: { x:0,y:0,z:0.05,w:0.9988 } }
    longitudinal_velocity_mps: 8.3
    lateral_velocity_mps: 0.0
    acceleration_mps2: 0.0
    heading_rate_rps: 0.12
    front_wheel_angle_rad: 0.024
    rear_wheel_angle_rad: 0.0
  - time_from_start: { sec: 0, nanosec: 200000000 }
    pose: { position: { x: 12347.2, y: 234.2, z: 0.0 }, orientation: { x:0,y:0,z:0.051,w:0.9987 } }
    longitudinal_velocity_mps: 8.25
    lateral_velocity_mps: 0.0
    acceleration_mps2: -0.5
    heading_rate_rps: 0.10
    front_wheel_angle_rad: 0.020
    rear_wheel_angle_rad: 0.0
```

### `autoware_planning_msgs/msg/Path`
```
std_msgs/Header header
autoware_planning_msgs/PathPoint[] points
geometry_msgs/Point[] left_bound
geometry_msgs/Point[] right_bound
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 525000000 }, frame_id: "map" }
points:
  - pose: { position: { x: 12345.6, y: 234.1, z: 0.0 }, orientation: { x:0,y:0,z:0.05,w:0.9988 } }
    longitudinal_velocity_mps: 8.3
    lateral_velocity_mps: 0.0
    heading_rate_rps: 0.12
    is_final: false
  - pose: { position: { x: 12346.4, y: 234.1, z: 0.0 }, orientation: { x:0,y:0,z:0.05,w:0.9988 } }
    longitudinal_velocity_mps: 8.3
    lateral_velocity_mps: 0.0
    heading_rate_rps: 0.12
    is_final: false
left_bound: [ { x: 12345.6, y: 235.6, z: 0.0 }, { x: 12346.4, y: 235.6, z: 0.0 } ]
right_bound: [ { x: 12345.6, y: 232.6, z: 0.0 }, { x: 12346.4, y: 232.6, z: 0.0 } ]
```

### `autoware_planning_msgs/msg/LaneletRoute`
```
std_msgs/Header header
geometry_msgs/Pose start_pose
geometry_msgs/Pose goal_pose
autoware_planning_msgs/LaneletSegment[] segments
unique_identifier_msgs/UUID uuid
bool allow_modification
```
Example:
```yaml
header: { stamp: { sec: 1710000000, nanosec: 0 }, frame_id: "map" }
start_pose: { position: { x: 12300.0, y: 200.0, z: 0.0 }, orientation: { x:0,y:0,z:0,w:1 } }
goal_pose:  { position: { x: 12400.0, y: 300.0, z: 0.0 }, orientation: { x:0,y:0,z:0.707,w:0.707 } }
segments:
  - preferred_primitive: { id: 101, primitive_type: "lane" }
    primitives: [ { id: 101, primitive_type: "lane" }, { id: 102, primitive_type: "lane" } ]
  - preferred_primitive: { id: 102, primitive_type: "lane" }
    primitives: [ { id: 102, primitive_type: "lane" } ]
uuid: { uuid: [9,9,9,9, 0,0,0,0, 0,0,0,0, 0,0,0,7] }
allow_modification: true
```

### `autoware_planning_msgs/msg/RouteState`
```
builtin_interfaces/Time stamp
uint8 state
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 0 }
state: 4            # SET
```

---

## 5. Control → Vehicle Interface (actuation command)

| Topic | Msg Type | Contents |
|-------|----------|----------|
| `/control/command/control_cmd` | `autoware_control_msgs/msg/Control` | Steering + accel/brake + velocity |
| `/control/command/control_horizon` | `autoware_control_msgs/msg/ControlHorizon` | Predicted control sequence |
| `/control/command/gear_cmd` | `autoware_vehicle_msgs/msg/GearCommand` | Gear |
| `/control/command/turn_indicators_cmd` | `autoware_vehicle_msgs/msg/TurnIndicatorsCommand` | Turn signals |
| `/control/command/hazard_lights_cmd` | `autoware_vehicle_msgs/msg/HazardLightsCommand` | Hazard |
| `/control/engage` | `autoware_vehicle_msgs/msg/Engage` | Engage autonomy |

### `autoware_control_msgs/msg/Control`
```
builtin_interfaces/Time stamp
builtin_interfaces/Time control_time
autoware_control_msgs/Lateral lateral
autoware_control_msgs/Longitudinal longitudinal
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 540000000 }
control_time: { sec: 1710000123, nanosec: 540000000 }
lateral:
  stamp: { sec: 1710000123, nanosec: 540000000 }
  control_time: { sec: 1710000123, nanosec: 540000000 }
  steering_tire_angle: 0.024          # ~1.4 deg left
  steering_tire_rotation_rate: 0.5
  is_defined_steering_tire_rotation_rate: true
longitudinal:
  stamp: { sec: 1710000123, nanosec: 540000000 }
  control_time: { sec: 1710000123, nanosec: 540000000 }
  velocity: 8.3
  acceleration: 0.0
  jerk: 0.0
  is_defined_acceleration: true
  is_defined_jerk: true
```

### `autoware_control_msgs/msg/ControlHorizon`
```
builtin_interfaces/Time stamp
builtin_interfaces/Time control_time
float32 time_step_ms
autoware_control_msgs/Control[] controls
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 540000000 }
control_time: { sec: 1710000123, nanosec: 540000000 }
time_step_ms: 100.0
controls:
  - { stamp: {...}, control_time: {...},
      lateral: { steering_tire_angle: 0.024, steering_tire_rotation_rate: 0.5, is_defined: true },
      longitudinal: { velocity: 8.3, acceleration: 0.0, jerk: 0.0, is_def_accel: true, is_def_jerk: true } }
  - { ... steering_tire_angle: 0.020, velocity: 8.25, acceleration: -0.5 ... }
  - { ... steering_tire_angle: 0.018, velocity: 8.1,  acceleration: -0.5 ... }
```

### `autoware_vehicle_msgs/msg/GearCommand`
```
builtin_interfaces/Time stamp
uint8 command
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 540000000 }
command: 2            # DRIVE
```

### `autoware_vehicle_msgs/msg/TurnIndicatorsCommand`
```
builtin_interfaces/Time stamp
uint8 command
```
Example (approaching a left turn):
```yaml
stamp: { sec: 1710000123, nanosec: 540000000 }
command: 2            # ENABLE_LEFT
```

### `autoware_vehicle_msgs/msg/HazardLightsCommand`
```
builtin_interfaces/Time stamp
uint8 command
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 540000000 }
command: 1            # DISABLE
```

### `autoware_vehicle_msgs/msg/Engage`
```
builtin_interfaces/Time stamp
bool engage
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 0 }
engage: true
```

---

## 6. Vehicle Interface → Vehicle (drive-by-wire)

| Direction | Topic | Msg Type | Contents |
|-----------|-------|----------|----------|
| Control → VI | `/vehicle/command/actuation_cmd` | `autoware_vehicle_msgs/msg/ActuationCommandStamped` | Final accel/brake/steer |
| VI → Vehicle | CAN / CAN-FD frames (raw) | **NOT DEFINED in this repo** — vendor/OEM-specific (see note below) | Actuator signals |
| VI → Control | `/vehicle/status/control_mode` | `autoware_vehicle_msgs/msg/ControlModeReport` | Autonomous / manual |
| VI → Control | `/vehicle/status/steering_status` | `autoware_vehicle_msgs/msg/SteeringReport` | Actual steering |
| VI → Localization | `/vehicle/status/velocity_status` | `autoware_vehicle_msgs/msg/VelocityReport` | Actual velocity |
| VI → Control | `/vehicle/status/gear_status` | `autoware_vehicle_msgs/msg/GearReport` | Actual gear |
| VI → Control | `/vehicle/status/turn_indicators_status` | `autoware_vehicle_msgs/msg/TurnIndicatorsReport` | Indicator state |
| VI → Control | `/vehicle/status/hazard_lights_status` | `autoware_vehicle_msgs/msg/HazardLightsReport` | Hazard state |
| Vehicle → VI | CAN feedback (raw) | **NOT DEFINED in this repo** — vendor/OEM-specific | Speed, steer, gear, faults |

> **Note — VI ↔ Vehicle (CAN) is not defined in this repository.**
> Autoware core only specifies the **ROS** interface at the VI boundary:
> - *in*: `Control` / `ActuationCommandStamped` (decoded from ROS by the `vehicle_interface` node)
> - *out*: `ControlModeReport`, `VelocityReport`, `SteeringReport`, `GearReport`, indicator reports
>
> The actual **wire format** (CAN IDs, signal scaling, byte layout, DBC) is
> vehicle/OEM-specific and lives in a separate vehicle-adapter package
> (e.g. an OEM `xxx_vehicle` package with a `.dbc` or hardcoded mapping)
> that is **not checked out here** — the top-level `vehicle/` directory is
> only empty `.gitkeep` placeholders, and no `.dbc` file exists in the repo.
>
> **CAN FD vs Classic CAN:** this is *not* decided by Autoware's message
> definitions; it is a property of the vehicle bus / transceiver configured
> in the vehicle launch. Autoware's `vehicle_interface` typically uses
> `socketcan` (`can_msgs/Frame`), and whether the frames are **CAN FD** or
> **classic CAN (CAN 2.0)** depends on the hardware and the DBC:
> - Reference/demo platforms commonly use **classic CAN @ 500 kbps** for
>   actuation (steering/ throttle/ brake/ gear/ indicators).
> - **CAN FD** is used only when the target OEM bus requires it (larger
>   payloads, e.g. high-rate state or advanced actuator frames).
>
> To make this repo self-contained, the DBC (or the CAN-ID ↔ signal mapping)
> and the `can_fd: true/false` setting must be added to `vehicle/` and
> documented here.

### `autoware_vehicle_msgs/msg/ActuationCommandStamped`
```
std_msgs/Header header
autoware_vehicle_msgs/ActuationCommand actuation_command
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 545000000 }, frame_id: "base_link" }
actuation_command:
  accel_cmd: 0.3        # throttle ~0.3
  brake_cmd: 0.0
  steer_cmd: 0.024      # normalized steer
```

### `autoware_vehicle_msgs/msg/ActuationReport`
```
float64 accel_report
float64 brake_report
float64 steer_report
```
Example:
```yaml
accel_report: 0.28
brake_report: 0.0
steer_report: 0.022
```

### `autoware_vehicle_msgs/msg/ControlModeReport`
```
builtin_interfaces/Time stamp
uint8 mode
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 545000000 }
mode: 1            # AUTONOMOUS
```

### `autoware_vehicle_msgs/msg/SteeringReport`
```
builtin_interfaces/Time stamp
float32 steering_tire_angle
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 546000000 }
steering_tire_angle: 0.022
```

### `autoware_vehicle_msgs/msg/VelocityReport`
```
std_msgs/Header header
float32 longitudinal_velocity
float32 lateral_velocity
float32 heading_rate
```
Example:
```yaml
header: { stamp: { sec: 1710000123, nanosec: 546000000 }, frame_id: "base_link" }
longitudinal_velocity: 8.28
lateral_velocity: 0.0
heading_rate: 0.12
```

### `autoware_vehicle_msgs/msg/GearReport`
```
builtin_interfaces/Time stamp
uint8 report
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 546000000 }
report: 2            # DRIVE
```

### `autoware_vehicle_msgs/msg/TurnIndicatorsReport`
```
builtin_interfaces/Time stamp
uint8 report
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 546000000 }
report: 2            # ENABLE_LEFT
```

### `autoware_vehicle_msgs/msg/HazardLightsReport`
```
builtin_interfaces/Time stamp
uint8 report
```
Example:
```yaml
stamp: { sec: 1710000123, nanosec: 546000000 }
report: 1            # DISABLE
```

---

## Feedback loops (closed control chain)

```
Vehicle → VI → /vehicle/status/velocity_status (VelocityReport)
                → Localization (wheel-odometry ego state re-entry)
VI → /vehicle/status/control_mode (ControlModeReport) → Control (sanity / fallback)
Localization → map→base_link (TF) → Planning (ego pose re-entry)
```

The velocity/steering/gear reports feed back into Localization and Control so
the system can dead-reckon and verify that commanded actuation matches actual
motion.

---

# Standard ROS 2 Message Reference (nested types)

All nested standard types used above, in full.

### `std_msgs/msg/Header`
```
builtin_interfaces/Time stamp
string frame_id
# uint32 seq  (deprecated)
```

### `std_msgs/msg/String`
```
string data
```

### `builtin_interfaces/msg/Time`
```
int32 sec
uint32 nanosec
```

### `builtin_interfaces/msg/Duration`
```
int32 sec
uint32 nanosec
```

### `unique_identifier_msgs/msg/UUID`
```
uint8[16] uuid
```

### `geographic_msgs/msg/GeoPoint`
```
float64 latitude
float64 longitude
float64 altitude
```

### `geometry_msgs/msg/Point`
```
float64 x
float64 y
float64 z
```

### `geometry_msgs/msg/Point32`
```
float32 x
float32 y
float32 z
```

### `geometry_msgs/msg/Quaternion`
```
float64 x
float64 y
float64 z
float64 w
```

### `geometry_msgs/msg/Vector3`
```
float64 x
float64 y
float64 z
```

### `geometry_msgs/msg/Pose`
```
geometry_msgs/Point position
geometry_msgs/Quaternion orientation
```

### `geometry_msgs/msg/Twist`
```
geometry_msgs/Vector3 linear
geometry_msgs/Vector3 angular
```

### `geometry_msgs/msg/Accel`
```
geometry_msgs/Vector3 linear
geometry_msgs/Vector3 angular
```

### `geometry_msgs/msg/PoseWithCovariance`
```
geometry_msgs/Pose pose
float64[36] covariance
```

### `geometry_msgs/msg/TwistWithCovariance`
```
geometry_msgs/Twist twist
float64[36] covariance
```

### `geometry_msgs/msg/AccelWithCovariance`
```
geometry_msgs/Accel accel
float64[36] covariance
```

### `geometry_msgs/msg/Transform`
```
geometry_msgs/Vector3 translation
geometry_msgs/Quaternion rotation
```

### `geometry_msgs/msg/TransformStamped`
```
std_msgs/Header header
string child_frame_id
geometry_msgs/Transform transform
```

### `geometry_msgs/msg/Polygon`
```
geometry_msgs/Point32[] points
```

### `geometry_msgs/msg/TwistWithCovarianceStamped`
```
std_msgs/Header header
geometry_msgs/TwistWithCovariance twist
```

### `sensor_msgs/msg/PointField`
```
uint8 INT8=1
uint8 UINT8=2
uint8 INT16=3
uint8 UINT16=4
uint8 INT32=5
uint8 UINT32=6
uint8 FLOAT32=7
uint8 FLOAT64=8

string name
uint32 offset
uint8 datatype
uint32 count
```

### `sensor_msgs/msg/NavSatStatus`
```
uint16 STATUS_NO_FIX=0
uint16 STATUS_FIX=1
uint16 STATUS_SBAS_FIX=2
uint16 STATUS_GBAS_FIX=3
uint16 SERVICE_GPS=1
uint16 SERVICE_GLONASS=2
uint16 SERVICE_COMPASS=4
uint16 SERVICE_GALILEO=8

uint16 status
uint16 service
```

### `nav_msgs/msg/MapMetaData`
```
builtin_interfaces/Time map_load_time
float32 resolution
uint32 width
uint32 height
geometry_msgs/Pose origin
```
