# E-Trike Mapping — Complete Guide

End-to-end offline point-cloud mapping for the E-Trike using the two packages
under `our_packages/mapping/`:

| Package | Role |
|---|---|
| `ndt_omp` | Fast OpenMP-accelerated NDT scan matching (used as a frontend / localization) |
| `lidarslam_ros2` | Full SLAM suite: `scanmatcher` (frontend) + `graph_based_slam` (backend, loop closure + pose-graph optimization) |

The recommended path is **`lidarslam_ros2`** (it produces an Autoware-compatible
`.pcd` map with loop closure). `ndt_omp` is available for lightweight odometry /
localization when you do not need a full graph.

> [!WARNING]
> **Missing hardware IMU.** The E-Trike currently uses an IMU stub. Without a
> real IMU, mapping relies on LiDAR odometry + vehicle kinematics only. Expect
> drift or distortion on sharp turns. Install a physical IMU (e.g. Tamagawa)
> for production-grade maps. See `etrike_stability_guard` notes for context.

---

## 1. Architecture

```
                ROS bag (recorded) OR live LiDAR
                              │
                              ▼
        /sensing/lidar/top/pointcloud_before_sync   (PointCloud2)
                              │
                              ▼
        ┌─────────────────────────────────────────────┐
        │  scanmatcher (frontend)                       │
        │   NDT / FastGICP / SmallGICP scan matching    │
        │   → per-scan pose estimate                    │
        └─────────────────────────────────────────────┘
                              │  pose + keyframe clouds
                              ▼
        ┌─────────────────────────────────────────────┐
        │  graph_based_slam (backend)                   │
        │   loop closure + g2o pose-graph optimization  │
        │   → globally consistent trajectory            │
        └─────────────────────────────────────────────┘
                              │
                              ▼
                  map.pcd  +  pose_graph.g2o   →  save_dir
```

Key frames:
- `map` (global) → `odom` → `base_link` → `lidar_link` (or `velodyne` in legacy launches)

---

## 2. Record Data (on-vehicle)

You need a bag of the **preprocessed** LiDAR cloud plus TF.

```bash
# Terminal 1 — live preview (optional)
./docker/shell.sh
./scripts/lidar_standalone.sh        # or: ros2 launch etrike_lidar_viewer lidar_view.launch.py

# Terminal 2 — record
./docker/shell.sh
ros2 bag record \
  /sensing/lidar/top/pointcloud_before_sync \
  /tf \
  /tf_static
```

Drive **smooth loops** with good overlap. Stop with `Ctrl+C`.

> Use `pointcloud_before_sync` (post crop/distortion/ring-filter), not the raw
> cloud — it already matches what the mapper expects.

---

## 3. Build the Map (offline)

### 3.1 Compile

```bash
./docker/shell.sh
# inside container:
sudo apt update && sudo apt install -y libgtsam-dev ros-humble-pcl-ros
cd /workspace/autoware
colcon build --symlink-install --packages-select ndt_omp scanmatcher graph_based_slam lidarslam etrike_common_launch
source install/setup.bash
```

### 3.2 Run mapper + play bag

**Terminal 1 (mapper):**
```bash
ros2 launch etrike_common_launch etrike_mapping.launch.xml \
  save_dir:=/workspace/data
```
This wraps `lidarslam/launch/lidarslam.launch.py` with E-Trike defaults:
- `input_cloud=/sensing/lidar/top/pointcloud_before_sync`
- `use_sim_time=true`
- `robot_frame_id=base_link`
- `publish_static_tf=false` (TF comes from the bag)
- `use_rviz=true`

**Terminal 2 (play):**
```bash
ros2 bag play <bag_folder> --clock
```
`--clock` is mandatory — the mapper reads `/clock` from the bag.

When playback ends, `Ctrl+C` the mapper. It optimizes the graph and writes:
- `map.pcd`
- `pose_graph.g2o`

to `save_dir` (default `/workspace/data`).

---

## 4. Topics

### `lidarslam.launch.py` (scanmatcher + graph_based_slam)

**Subscribed**
| Topic | Type | From | Purpose |
|---|---|---|---|
| `/input_cloud` (remap `input_cloud`) | `sensor_msgs/PointCloud2` | bag / driver | LiDAR cloud |
| `/imu` (remap `imu_topic`) | `sensor_msgs/Imu` | bag | IMU (unused unless `use_imu`) |
| `/gnss/fix` (if `use_gnss`) | `sensor_msgs/NavSatFix` | bag | GNSS loop anchor |
| `/tf`, `/tf_static` | `tf2_msgs` | bag | sensor→base transforms |

**Published**
| Topic | Type | Purpose |
|---|---|---|
| `/odom` | `nav_msgs/Odometry` | Scanmatcher odometry |
| `/pose` | `geometry_msgs/PoseStamped` | Current robot pose (map frame) |
| `/map` | `sensor_msgs/PointCloud2` | Incremental map (every `map_publish_period` s) |
| `/submap` | `sensor_msgs/PointCloud2` | Recent submap |
| `/tf` | `tf2_msgs/TFMessage` | `map`→`odom`→`base_link` |

### `mapping_car.launch.py` (legacy scanmatcher-only)
| Topic | Type | Purpose |
|---|---|---|
| sub `/points_raw` | `PointCloud2` | input |
| pub `/odom`, `/pose`, `/map` | as above | output |

> The E-Trike pipeline uses `etrike_mapping.launch.xml` → `lidarslam.launch.py`,
> not `mapping_car.launch.py` (which hard-codes a `velodyne` frame at 1.2/0/2.0).

---

## 5. Parameters

Main file: `lidarslam/param/lidarslam.yaml` (loaded by `main_param_dir`).

### scan_matcher
| Param | Default | Meaning |
|---|---|---|
| `registration_method` | `NDT` | NDT / GICP / SmallGICP |
| `ndt_resolution` | `2.0` | NDT voxel (m) |
| `vg_size_for_input` | `0.5` | input downsample (m) |
| `vg_size_for_map` | `0.1` | map voxel (m) |
| `scan_min_range` / `scan_max_range` | `1.0` / `200.0` | crop (m) |
| `trans_for_mapupdate` | `1.5` | min travel before keyframe (m) |
| `map_publish_period` | `15.0` | map pub period (s) |
| `num_targeted_cloud` | `20` | keyframes for matching |
| `set_initial_pose` | `true` | use `initial_pose_*` |
| `use_imu` / `use_odom` | `false` / `false` | E-Trike: both off (no IMU yet) |

### graph_based_slam
| Param | Default | Meaning |
|---|---|---|
| `ndt_resolution` | `1.0` | backend NDT (m) |
| `threshold_loop_closure_score` | `0.7` | accept loop if score ≥ |
| `distance_loop_closure` | `100.0` | min travel before loop search (m) |
| `range_of_searching_loop_closure` | `20.0` | search radius (m) |
| `loop_search_query_stride` | `1` | every query eligible |
| `loop_max_translation_delta` | `0.5` | reject large jumps (m) |
| `loop_max_rotation_delta_deg` | `2.0` | reject large turns |
| `loop_min_overlap_ratio` | `0.76` | min overlap to accept |
| `use_gnss` | `false` | GNSS anchoring (off on E-Trike) |
| `use_planar_map_filter` | `true` | thin planar surfaces on export |
| `map_leaf_size` | `0.1` | exported map density (m) |

Preset variants live in `lidarslam/param/presets/` (e.g. `tunnel_*`,
`corridor_fog_radar`, `degeneracy_off`). For the E-Trike open-outdoor case, the
default `lidarslam.yaml` (IMU/odom/GNSS off) is the right starting point.

---

## 6. Use the Map in Autoware

1. Copy `map.pcd` → `~/autoware_map/<my-map>/pointcloud_map.pcd`
   (Autoware requires the exact name `pointcloud_map.pcd`).
2. Launch the stack:
   ```bash
   ros2 launch autoware_launch autoware.launch.xml \
     map_path:=/autoware_map/<my-map> \
     vehicle_model:=etrike_vehicle \
     sensor_model:=etrike_sensor_kit \
     launch_sensing_driver:=true
   ```
3. In RViz2: **2D Pose Estimate** → click the E-Trike's location/orientation on
   the map → NDT localizer snaps the live scan into the map.

---

## 7. Preview / QA

- **View `.pcd`:** `pcl_viewer map.pcd` (install `pcl-tools` on host).
- **Map quality gate** (from `lidarslam_ros2` CI):
  `bash scripts/run_map_quality_check.sh` — checks MME / planar thickness /
  coverage and N-run byte-determinism.
- **Determinism:** `run_offline_determinism_check.sh` (backend),
  `run_frontend_determinism_check.sh` (scanmatcher).

---

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| Mapper hangs at start | `use_sim_time=true` + bag played with `--clock` |
| Map drifts on turns | No IMU — install hardware IMU; avoid sharp turns while recording |
| `/input_cloud` no data | Wrong topic — set `input_cloud:=/sensing/lidar/top/pointcloud_before_sync` |
| TF missing | Bag must contain `/tf` + `/tf_static`; do NOT also `publish_static_tf` |
| `map.pcd` empty | Bag too short / no motion; check `trans_for_mapupdate` |
| Build fails (gtsam) | `sudo apt install libgtsam-dev` before `colcon build` |

---

## 9. File Map

```
mapping/
├── ndt_omp/                     # OpenMP NDT odometry / localization
└── lidarslam_ros2/
    ├── lidarslam/               # integration package
    │   ├── launch/lidarslam.launch.py     # main SLAM launch
    │   ├── param/lidarslam.yaml          # E-Trike-default params
    │   └── param/presets/                # scenario presets
    ├── scanmatcher/             # frontend (NDT/GICP)
    │   └── launch/mapping_car.launch.py  # legacy single-node
    ├── graph_based_slam/        # backend (loop closure + g2o)
    ├── lidarslam_msgs/          # MapArray / SubMap messages
    └── Thirdparty/              # rko_lio, ndt_omp_ros2 submodules

# E-Trike entry point (outside mapping/, in etrike_common_launch):
etrike_common_launch/launch/etrike_mapping.launch.xml
```
