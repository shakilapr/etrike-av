#!/bin/bash
# Configure PTP time synchronization on the Jetson Orin.
#
# This script sets up:
# 1. ptp4l  — PTP slave on the lidar-facing Ethernet interface
# 2. phc2sys — syncs the PTP hardware clock to the system clock
# 3. chrony  — system clock NTP/PTP management
#
# Prerequisites:
#   - linuxptp package (ptp4l, phc2sys)
#   - chrony package
#   - A PTP grandmaster on the vehicle network
#
# Usage:
#   sudo ./scripts/setup_ptp.sh [INTERFACE]
#   Default INTERFACE: eth0

set -euo pipefail

IFACE="${1:-eth0}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="${SCRIPT_DIR}/../config"

echo "=== PTP Setup for Jetson Orin ==="
echo "Interface: $IFACE"
echo ""

# Check prerequisites
for cmd in ptp4l phc2sys chronyc; do
    if ! command -v "$cmd" &>/dev/null; then
        echo "ERROR: $cmd not found. Install with: sudo apt install linuxptp chrony"
        exit 1
    fi
done

if [ ! -e "/sys/class/net/$IFACE" ]; then
    echo "ERROR: Interface $IFACE does not exist"
    exit 1
fi

# Check for PTP hardware clock support
PTP_DEVICE=""
for dev in /dev/ptp0 /dev/ptp1 /dev/ptp2; do
    if [ -e "$dev" ]; then
        PTP_DEVICE="$dev"
        break
    fi
done

if [ -n "$PTP_DEVICE" ]; then
    echo "Found PTP hardware clock: $PTP_DEVICE"
    TIMESTAMING="hardware"
else
    echo "WARNING: No PTP hardware clock found. Using software timestamping."
    TIMESTAMING="software"
fi

echo ""

# Install chrony config
echo "[1/4] Installing chrony configuration..."
sudo cp "$CONFIG_DIR/chrony.conf" /etc/chrony/chrony.conf
sudo systemctl restart chrony
echo "  chrony restarted."

# Install ptp4l config
echo "[2/4] Installing ptp4l configuration..."
sudo cp "$CONFIG_DIR/ptp4l.conf" /etc/ptp4l.conf
echo "  ptp4l config installed at /etc/ptp4l.conf"

# Start ptp4l
echo "[3/4] Starting ptp4l on $IFACE..."
sudo pkill ptp4l 2>/dev/null || true
if [ "$TIMESTAMING" = "hardware" ]; then
    sudo ptp4l -i "$IFACE" -f /etc/ptp4l.conf -m &
    echo "  ptp4l started with hardware timestamping"
    sleep 2
    echo "[4/4] Starting phc2sys to sync PTP clock -> system clock..."
    sudo pkill phc2sys 2>/dev/null || true
    sudo phc2sys -s "$PTP_DEVICE" -c CLOCK_REALTIME -m -O 0 &
    echo "  phc2sys started"
else
    sudo ptp4l -i "$IFACE" -f /etc/ptp4l.conf -m -S &
    echo "  ptp4l started with software timestamping"
fi

echo ""
echo "=== PTP setup complete ==="
echo ""
echo "Check PTP status:"
echo "  chronyc tracking"
echo "  chronyc sources"
echo ""
echo "Check ptp4l offset:"
echo "  journalctl -u ptp4l -f  (if run as a service)"
echo "  or check the ptp4l output above"
