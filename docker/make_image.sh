#!/bin/bash
# Build the E-Trike Kinect build image (Autoware base + libfreenect2).
#
# Tags the image as etrike-kinect-build:latest so build.sh / shell.sh can use
# it instead of the bare Autoware image. Run on the Jetson after a fresh clone
# or when the Autoware base tag changes.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_NAME="${IMAGE_NAME:-etrike-kinect-build:latest}"

echo "Building $IMAGE_NAME from $(basename "${SCRIPT_DIR}")/Dockerfile.kinect ..."
docker build \
    -f "${SCRIPT_DIR}/Dockerfile.kinect" \
    -t "$IMAGE_NAME" \
    "${SCRIPT_DIR}/.."

echo "Done. Use:"
echo "  IMAGE=$IMAGE_NAME ./docker/build.sh"
echo "  IMAGE=$IMAGE_NAME ./docker/shell.sh"
