#!/bin/bash
# Apply velocity limit patch to upstream Autoware common planning config.
#
# Sets planning max_vel to 2.78 m/s (10.0 km/h) for the E-Trike platform.
#
# Usage:
#   ./patches/apply_planning_velocity_limit_patch.sh [COMMON_PARAM_PATH]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="${SCRIPT_DIR}/apply_planning_velocity_limit_patch.py"

python3 "$PYTHON_SCRIPT" "$@"
