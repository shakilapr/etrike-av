#!/bin/bash
# Interactive shell into our Autoware development container.
# The container has ROS 2, CUDA, and all dependencies.
# Our source is at /workspace/autoware (bind-mounted from ~/av_project/autoware).

xhost +local:docker

# Image with libfreenect2 preinstalled (see docker/make_image.sh).
IMAGE="${IMAGE:-etrike-kinect-build:latest}"

docker run -it --rm \
  --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -e DISPLAY=$DISPLAY \
  -e WAYLAND_DISPLAY=$WAYLAND_DISPLAY \
  -e XDG_RUNTIME_DIR=/tmp \
  -v $XDG_RUNTIME_DIR/$WAYLAND_DISPLAY:/tmp/$WAYLAND_DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/autoware_map:/autoware_map \
  -v ~/av_project:/workspace/av_project \
  -v ~/av_project/autoware:/workspace/autoware \
  -v ~/av_project/vehicle:/workspace/vehicle \
  -v ~/av_project/data:/workspace/data \
  "$IMAGE" \
  /bin/bash
