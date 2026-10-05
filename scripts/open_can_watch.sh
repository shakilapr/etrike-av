#!/usr/bin/env bash
# ==============================================================================
# Open CAN Watch on the Jetson Physical Monitor (Convenience Wrapper)
# ==============================================================================
# Usage:
#   bash scripts/open_can_watch.sh [can_interface] [port]
# Defaults:
#   can_interface: can2
#   port: 8000
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$SCRIPT_DIR/open_can_watcher_display.sh" "$@"
