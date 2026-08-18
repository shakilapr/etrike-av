#!/bin/bash
# Build E-Trike packages + patched upstream dependencies inside the container.
#
# Uses the official Autoware image as the base layer; our workspace builds on
# top and shadows any packages we've modified.
#
# Build order:
#   1. Patched Nebula packages (--packages-select, no transitive deps)
#   2. Our E-Trike packages (--packages-select, deps from Docker image)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTOWARE_DIR="${SCRIPT_DIR}/../autoware"

if [ ! -d "$AUTOWARE_DIR/src/our_packages" ]; then
    echo "ERROR: autoware workspace not found at $AUTOWARE_DIR"
    exit 1
fi

echo "Building E-Trike packages from: $AUTOWARE_DIR"

docker run -it --rm \
  --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -v "$AUTOWARE_DIR":/workspace/autoware \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  /bin/bash -c "
    source /opt/autoware/setup.bash && \
    cd /workspace/autoware && \
    echo '--- Step 1: Rebuilding patched Nebula packages ---' && \
    colcon build --symlink-install \
      --cmake-args -DCMAKE_BUILD_TYPE=Release \
      --packages-select \
        nebula_hesai_common \
        nebula_hesai_decoders \
        nebula_hesai \
      2>&1 && \
    echo '--- Step 2: Building E-Trike packages ---' && \
    colcon build --symlink-install \
      --cmake-args -DCMAKE_BUILD_TYPE=Release \
      --packages-select \
        autoware_vehicle_bridge \
        etrike_protocol \
        etrike_vehicle_description \
        etrike_vehicle_launch \
        etrike_sensor_kit_description \
        etrike_sensor_kit_launch \
        etrike_common_launch \
        etrike_stability_guard \
      2>&1
  "
