# E-Trike Run Guide

Launch the E-Trike planning simulator with RViz on the Jetson.

## Start

```bash
# On the Jetson (via SSH or directly)
bash ~/av_project/scripts/kill_all.sh

DISPLAY=:1 xhost +local:docker

docker run -d --name autoware_test \
  --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -e DISPLAY=:1 \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/av_project/autoware:/workspace/autoware \
  -v ~/autoware_map:/autoware_map \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  bash -c 'while true; do sleep 1000; done'

docker exec -d autoware_test bash -c \
  'export DISPLAY=:1; \
   source /opt/autoware/setup.bash; \
   source /workspace/autoware/install/setup.bash; \
   ros2 launch autoware_launch planning_simulator.launch.xml \
     map_path:=/autoware_map/sample-map-planning \
     vehicle_model:=etrike_vehicle \
     sensor_model:=etrike_sensor_kit \
     rviz:=true'
```

## Drive

1. In RViz: **2D Pose Estimate** → set initial position on the map
2. In RViz: **2D Goal Pose** → set destination
3. In RViz: **AutowareStatePanel** → click **Engage**
4. Vehicle drives to goal

## Stop

```bash
bash ~/av_project/scripts/kill_all.sh
```

## What it does

- Pulls Autoware docker image with ROS 2 Humble + CUDA
- Builds 8 E-Trike packages + 3 patched Nebula packages
- Launches planning simulator (no real CAN, safe)
- Shows tuktuk model in RViz with E-Trike geometry
- Localization, planning, control all run in simulation
- Stability guard monitors lateral acceleration (emergency disabled by default)

## Parameters passed

| Param | Value | Source |
|-------|-------|--------|
| `wheel_base` | 2.0 m | `vehicle_info.param.yaml` |
| `max_steer_angle` | 0.747 rad | `vehicle_info.param.yaml` |
| `wheel_tread` | 1.15 m | `vehicle_info.param.yaml` |
| `overall_length` | 2.635 m | `vehicle_info.param.yaml` |
| `overall_width` | 1.300 m | `vehicle_info.param.yaml` |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| RViz white vehicle | Restart (kill + relaunch) |
| Map not visible | Check `~/autoware_map/sample-map-planning/` exists |
| "topic not received" errors | Normal before engage — set goal + engage |
| Global status error | Kill all, restart (duplicate nodes from multiple launches) |
| Container won't start | `docker rm -f autoware_test` first |
