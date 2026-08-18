#!/bin/bash
# Run E-Trike package tests inside the Autoware container.
#
# Unlike ./docker/shell.sh (interactive), this is a one-shot command:
#   ./run_tests.sh
#
# It maps the container user to the host user (-u $(id -u):$(id -g)) so that
# test artifacts under /workspace/autoware/build|log are owned by you, not by
# the container's default user ('aw'). This avoids permission conflicts when
# rebuilding/retesting afterwards.
#
# Covers all eight E-Trike packages (pytest + linters).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTOWARE_DIR="${SCRIPT_DIR}/autoware"

if [ ! -d "$AUTOWARE_DIR/src/our_packages" ]; then
    echo "ERROR: autoware workspace not found at $AUTOWARE_DIR"
    exit 1
fi

echo "Running tests from: $AUTOWARE_DIR"

docker run --rm -u "$(id -u):$(id -g)" \
  -v "$AUTOWARE_DIR":/workspace/autoware \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  /bin/bash -c "
    source /opt/autoware/setup.bash && \
    cd /workspace/autoware && \
    colcon test --packages-select \
        autoware_vehicle_bridge \
        etrike_protocol \
        etrike_vehicle_description \
        etrike_vehicle_launch \
        etrike_sensor_kit_description \
        etrike_sensor_kit_launch \
        etrike_common_launch \
        etrike_stability_guard && \
    colcon test-result --verbose
  "
