#!/usr/bin/env bash
# ==============================================================================
# Open AV Dashboard on the Jetson Physical Monitor (Convenience Wrapper)
# ==============================================================================
# Usage:
#   bash scripts/open_av_dashboard.sh [can_interface] [port]
# Defaults:
#   can_interface: can2
#   port: 8080
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$SCRIPT_DIR/open_av_dashboard_display.sh" "$@"
