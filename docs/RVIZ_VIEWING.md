# RViz2 Viewing Guide — E-Trike Lidar & Simulation

**Last updated:** 2026-08-18

## 1. The Problem

The stock RViz config used by Autoware (`autoware.rviz`, shipped with
`autoware_launch`) has two limitations that confuse first-time users:

1. **It is a top-down 2D view** — `Current View: TopDownOrtho`. It is
   optimized for mission planning (map, routes, path) and shows the E-Trike
   model as a flat footprint, not in 3D.
2. **It has no display for the lidar's own point clouds** — the only
   `PointCloud2` displays are `/map/pointcloud_map`,
   `/sensing/lidar/concatenated/pointcloud`, and perception clouds. The
   raw Nebula output (`/sensing/lidar/top/pointcloud_raw_ex`) and the
   preprocessed cloud (`/sensing/lidar/top/pointcloud_before_sync`) are
   **not shown**.

So "open RViz and look at the point cloud" does not work out of the box.

## 2. The Solution

A dedicated 3D config ships with the sensor kit:

```
etrike_common_launch/rviz/etrike.rviz
```

It provides:

| Feature | Value |
|---------|-------|
| Default view | `ThirdPersonFollower` (3D, follows `base_link`) |
| Fixed frame | `base_link` |
| Lidar displays (pre-loaded) | `/sensing/lidar/top/pointcloud_raw_ex` (size 2 px) and `/sensing/lidar/top/pointcloud_before_sync` (size 3 px), AxisColor |
| Vehicle model | `RobotModel` (`/robot_description`) |
| Extra | Grid, TF, optional `/map/pointcloud_map` (disabled), 2D Pose Estimate + 2D Goal Pose tools |
| Second saved view | `TopDownOrtho` (switch back for map work) |

## 3. How to Use It

### 3.1 Real sensor (bench / vehicle) — 3D lidar cloud

```bash
# Via the bring-up script (recommended):
./scripts/lidar_bringup.sh --rviz3d

# Or explicitly with the full stack:
ros2 launch autoware_launch autoware.launch.xml \
  map_path:=/autoware_map/your-map \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  launch_sensing_driver:=true \
  rviz_config:=$(ros2 pkg prefix etrike_common_launch)/share/etrike_common_launch/rviz/etrike.rviz
```

When the sensor is streaming you will see:

- The E-Trike model (blue body, wheels, roof-mounted lidar cylinder)
- The raw cloud at `/sensing/lidar/top/pointcloud_raw_ex` (sensor frame `lidar_link`)
- The preprocessed cloud at `/sensing/lidar/top/pointcloud_before_sync`
  (`output_as_sensor_frame:=true` in our container launch, so the cloud's own
  frame is `lidar_link`; TF `lidar_link` ↔ `base_link` exists once the stack
  is up)

### 3.2 Simulation (planning simulator) — 3D model view

The simulator disables the real driver (`launch_sensing:=false`), so **no
point cloud exists in simulation** (perception is dummy). To inspect the
E-Trike model / lidar geometry in 3D:

```bash
ros2 launch autoware_launch planning_simulator.launch.xml \
  map_path:=/autoware_map/sample-map-planning \
  vehicle_model:=etrike_vehicle \
  sensor_model:=etrike_sensor_kit \
  rviz_config:=$(ros2 pkg prefix etrike_common_launch)/share/etrike_common_launch/rviz/etrike.rviz
```

The lidar cloud displays stay **empty** in simulation — they populate only
when the physical XT32M2X is connected and streaming. (The default
`./docker/run.sh` keeps the stock top-down view, which is correct for
planning work.)

### 3.3 Manual setup in the stock RViz (no custom config)

If you must use `autoware.rviz` as-is:

1. **Panels → Add → By topic** → `/sensing/lidar/top/pointcloud_before_sync`
   (PointCloud2)
2. Set **Global Options → Fixed Frame** to `base_link`
3. Switch the view: **Views panel → Current View → ThirdPersonFollower**
   (or Orbit)

## 4. Verification

The config is covered by the package tests:
`etrike_common_launch/test/test_calibration_and_configs.py`
(`test_etrike_rviz_config_exists_and_is_valid`) — validates that the file
exists, fixed frame is `base_link`, both lidar topics are present, and the
default view is not top-down.

Run it with:
```bash
python -m pytest autoware/src/our_packages/etrike_common_launch/test/test_calibration_and_configs.py
# or inside the container:
colcon test --packages-select etrike_common_launch
colcon test-result --verbose
```

---

*Keep this file updated as the project evolves.*
