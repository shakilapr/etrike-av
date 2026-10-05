#!/usr/bin/env bash
# Run AV Dashboard on host or Jetson
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

INTERFACE="${1:-can2}"
PORT="${2:-8080}"
HOST="0.0.0.0"

echo "======================================================================"
echo " Starting AV Dashboard on $INTERFACE (Port $PORT)"
echo " URL: http://localhost:$PORT"
echo "======================================================================"

# Check CAN interface
if ip link show "$INTERFACE" >/dev/null 2>&1; then
    echo "CAN interface '$INTERFACE' is present."
else
    echo "CAN interface '$INTERFACE' not found. Will start in simulation mode if unavailable."
fi

# Source ROS 2 and Autoware environments if present
for setup_file in \
    /opt/ros/humble/setup.bash \
    /opt/ros/galactic/setup.bash \
    /opt/ros/foxy/setup.bash \
    /opt/autoware/setup.bash \
    "$WORKSPACE_ROOT/autoware/install/setup.bash" \
    /workspace/autoware/install/setup.bash \
    "$HOME/autoware/install/setup.bash"; do
    if [ -f "$setup_file" ]; then
        echo "Sourcing $setup_file..."
        # set +e to avoid premature exit if a setup script has harmless warnings
        set +e
        source "$setup_file" 2>/dev/null || true
        set -e
    fi
done

export PYTHONPATH="$WORKSPACE_ROOT:$PYTHONPATH"

# Run Python server
exec python3 -m tools.av_dashboard.backend.server \
    --interface "$INTERFACE" \
    --host "$HOST" \
    --port "$PORT"
