#!/usr/bin/env bash
set -e

source /opt/ros/humble/setup.bash
source /opt/autoware/setup.bash 2>/dev/null || true
source /workspace/autoware/install/setup.bash 2>/dev/null || true
export PYTHONPATH="/workspace/av_project:$PYTHONPATH"

python3 /workspace/av_project/scripts/test_bench_lifecycle.py
