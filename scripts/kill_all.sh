#!/bin/bash
# Kill all Autoware/ROS processes on the Jetson.
# Run from the host: bash scripts/kill_all.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/close_everything.sh" --rm-container "$@"
