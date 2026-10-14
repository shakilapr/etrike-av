#!/usr/bin/env bash
source /opt/ros/humble/setup.bash
source /workspace/autoware/install/setup.bash 2>/dev/null || true
export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
export PYTHONPATH="/workspace/av_project:/host_local/lib/python3.10/site-packages:/host_dist_packages:$PYTHONPATH"

pkill -f "tools.av_dashboard.backend.server" 2>/dev/null || true
sleep 1

exec python3 -m tools.av_dashboard.backend.server --interface "${1:-can2}" --host 0.0.0.0 --port "${2:-8080}"
