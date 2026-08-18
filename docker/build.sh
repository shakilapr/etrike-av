#!/bin/bash
# Build E-Trike packages + patched upstream dependencies inside the container.
#
# Uses the official Autoware image as the base layer; our workspace builds on
# top and shadows any packages we've modified.
#
# Only builds what we own or patched — never the entire Autoware checkout.

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
    colcon build --symlink-install \
      --cmake-args -DCMAKE_BUILD_TYPE=Release \
      --packages-up-to \
        autoware_vehicle_bridge \
        etrike_protocol \
        etrike_vehicle_description \
        etrike_vehicle_launch \
        etrike_sensor_kit_description \
        etrike_sensor_kit_launch \
        etrike_common_launch \
        etrike_stability_guard \
        nebula_hesai \
        nebula_hesai_decoders \
        nebula_hesai_common \
      2>&1
  "
