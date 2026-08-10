#!/bin/bash
# Build our Autoware workspace inside the container.
# The official image's baked-in Autoware is sourced as the base layer;
# our workspace builds on top and shadows any packages we've modified.

docker run -it --rm \
  --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -v ~/av_project/autoware:/workspace/autoware \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  /bin/bash -c "
    source /opt/autoware/setup.bash && \
    cd /workspace/autoware && \
    colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
  "
