#!/bin/bash
# Launch Autoware with our custom workspace overlay.
# Sources the baked-in Autoware first, then overlays our built workspace.
# Any packages we've built in ~/av_project/autoware shadow the baked-in versions.

xhost +local:docker

docker run -it --rm \
  --privileged \
  --runtime=nvidia \
  --gpus all \
  --net=host \
  --ipc=host \
  -e DISPLAY=$DISPLAY \
  -e WAYLAND_DISPLAY=$WAYLAND_DISPLAY \
  -e XDG_RUNTIME_DIR=/tmp \
  -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/tmp/$WAYLAND_DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/autoware_map:/autoware_map \
  -v ~/av_project/autoware:/workspace/autoware \
  -v ~/av_project/vehicle:/workspace/vehicle \
  -v ~/av_project/data:/workspace/data \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  /bin/bash -c "
    source /opt/autoware/setup.bash && \
    source /workspace/autoware/install/setup.bash && \
    exec \"\$@\"
  " -- ros2 launch autoware_launch planning_simulator.launch.xml \
    map_path:=/autoware_map/sample-map-planning \
    vehicle_model:=sample_vehicle \
    sensor_model:=etrike_sensor_kit
