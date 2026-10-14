#!/usr/bin/env bash
set -e

source /opt/ros/humble/setup.bash
source /opt/autoware/setup.bash 2>/dev/null || true
source /workspace/autoware/install/setup.bash 2>/dev/null || true
export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
export PYTHONPATH="/workspace/av_project:$PYTHONPATH"

exec python3 /workspace/autoware/src/our_packages/etrike_common_launch/scripts/bench_perception_node.py \
    --ros-args \
    -p output_objects_topic:=/bench_perception/objects \
    -p publish_rate_hz:=10.0 \
    -p sensor_timeout_sec:=1.2 \
    -p voxel_grid_size_m:=0.28 \
    -p enable_hog_person_detector:=true
