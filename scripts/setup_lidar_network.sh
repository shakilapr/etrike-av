#!/bin/bash
# Configure the Jetson Orin's Ethernet interface for the Hesai XT32M2X.
#
# The XT32M2X defaults to:
#   IP: 192.168.1.201
#   Port: 2368 (UDP point cloud data)
#   Port: 10110 (GNSS/PTP)
#
# The Jetson must be on the same subnet:
#   IP: 192.168.1.10
#
# Usage:
#   sudo ./scripts/setup_lidar_network.sh [INTERFACE] [HOST_IP] [SENSOR_IP]
#   Defaults: INTERFACE=eno1, HOST_IP=192.168.1.10, SENSOR_IP=192.168.1.201

set -euo pipefail

IFACE="${1:-eno1}"
HOST_IP="${2:-192.168.1.10}"
SENSOR_IP="${3:-192.168.1.201}"
SUBNET="24"

echo "=== LiDAR Network Setup ==="
echo "Interface: $IFACE"
echo "Host IP:   $HOST_IP/$SUBNET"
echo "Sensor IP: $SENSOR_IP"
echo ""

if [ ! -e "/sys/class/net/$IFACE" ]; then
    echo "ERROR: Interface $IFACE does not exist"
    echo "Available interfaces:"
    ip link show | grep -oP '^\d+: \K[^:@]+'
    exit 1
fi

# Set the IP address
echo "[1/3] Configuring $IFACE with $HOST_IP/$SUBNET..."
sudo ip addr add "$HOST_IP/$SUBNET" dev "$IFACE" 2>/dev/null || {
    echo "  IP already assigned or conflict. Checking..."
    CURRENT=$(ip -4 addr show "$IFACE" | grep -oP 'inet \K[\d.]+')
    if [ "$CURRENT" = "$HOST_IP" ]; then
        echo "  $IFACE already has $HOST_IP — OK"
    else
        echo "  WARNING: $IFACE has $CURRENT, expected $HOST_IP"
        echo "  Run: sudo ip addr del $CURRENT/$SUBNET dev $IFACE"
        echo "  Then re-run this script."
        exit 1
    fi
}
sudo ip link set "$IFACE" up
echo "  Interface $IFACE is up."

# Verify connectivity
echo "[2/3] Pinging sensor at $SENSOR_IP..."
if ping -c 3 -W 2 "$SENSOR_IP" &>/dev/null; then
    echo "  Ping OK — sensor is reachable."
else
    echo "  WARNING: Sensor at $SENSOR_IP is not responding."
    echo "  Check:"
    echo "    - Sensor power and Ethernet cable"
    echo "    - Sensor IP configuration (may differ from default)"
    echo "    - Firewall rules"
fi

# Check for UDP traffic on port 2368
echo "[3/3] Checking for UDP traffic on port 2368..."
echo "  (Run for 5 seconds — press Ctrl+C to skip)"
timeout 5 tcpdump -i "$IFACE" udp port 2368 -c 5 2>/dev/null && {
    echo "  UDP packets detected on port 2368 — sensor is streaming."
} || {
    echo "  No UDP packets detected within 5 seconds."
    echo "  The sensor may not be spinning or may be in a different return mode."
}

echo ""
echo "=== Network setup complete ==="
echo ""
echo "To make the IP persistent across reboots, add to /etc/netplan/01-lidar.yaml:"
echo "  network:"
echo "    ethernets:"
echo "      $IFACE:"
echo "        addresses: [$HOST_IP/$SUBNET]"
echo ""
