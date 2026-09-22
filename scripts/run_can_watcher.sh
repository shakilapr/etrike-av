#!/usr/bin/env bash
# Run CAN Watcher on the host computer
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

INTERFACE="${1:-can2}"
PORT="${2:-8000}"
HOST="0.0.0.0"

echo "======================================================================"
echo " Starting CANByte Watcher on $INTERFACE (Port $PORT)"
echo " URL: http://localhost:$PORT"
echo "======================================================================"

# Ensure CAN interface is UP if running with sudo permissions
if ip link show "$INTERFACE" >/dev/null 2>&1; then
    echo "CAN interface '$INTERFACE' is present."
else
    echo "CAN interface '$INTERFACE' not found. Will start in simulation mode if unavailable."
fi

export PYTHONPATH="$WORKSPACE_ROOT:$PYTHONPATH"

# Run Python server
exec python3 -m tools.can_watcher.backend.server \
    --interface "$INTERFACE" \
    --host "$HOST" \
    --port "$PORT"

