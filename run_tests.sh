#!/bin/bash
# Run the E-Trike lidar package tests inside the Autoware container.
#
# Unlike ./docker/shell.sh (interactive), this is a one-shot command:
#   ./run_tests.sh
#
# It maps the container user to the host user (-u $(id -u):$(id -g)) so that
# test artifacts under /workspace/autoware/build|log are owned by you, not by
# the container's default user ('aw'). This avoids permission conflicts when
# rebuilding/retesting afterwards.
#
# Covers: etrike_common_launch, etrike_sensor_kit_launch,
# etrike_sensor_kit_description (pytest + linters).

docker run --rm -u $(id -u):$(id -g) \
  -v ~/av_project/autoware:/workspace/autoware \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  /bin/bash -c "source /opt/autoware/setup.bash && cd /workspace/autoware && colcon test --packages-select etrike_common_launch etrike_sensor_kit_launch etrike_sensor_kit_description && colcon test-result --verbose"
