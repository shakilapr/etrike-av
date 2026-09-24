#!/usr/bin/env bash
# ==============================================================================
# CANalyst-II USB-to-CAN Management Script (NVIDIA Jetson / Autoware Universe)
# ==============================================================================
# Usage:
#   ./scripts/setup_canalyst.sh up          [interface] [bitrate]  # Bring UP CANalyst bridge
#   ./scripts/setup_canalyst.sh down        [interface]            # Stop bridge & down iface
#   ./scripts/setup_canalyst.sh status                             # Check status & link
#   ./scripts/setup_canalyst.sh dump        [interface]            # Run live candump middleman
#   ./scripts/setup_canalyst.sh install-udev                       # Install persistent udev rules
#   ./scripts/setup_canalyst.sh install-service                    # Install systemd auto-start service
#   ./scripts/setup_canalyst.sh test-loopback [interface]          # Test send/receive frame
# ==============================================================================

set -eo pipefail

ACTION="${1:-status}"
IFACE="${2:-can2}"
BITRATE="${3:-500000}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# CANalyst-II USB Vendor / Product IDs (Microchip / Chuangxin / Waveshare USB-CAN-B)
CANALYST_VID="04d8"
CANALYST_PID="0053"

detect_usb_device() {
    echo "── Checking USB enumeration ──"
    if lsusb | grep -qiE "04d8:0053|canalyst|chuangxin|microchip"; then
        echo "  [OK] CANalyst-II adapter detected on USB bus (04d8:0053)."
        return 0
    elif lsusb | grep -qiE "1d50:606f|candlelight|gs_usb"; then
        echo "  [OK] CAN device running candlelight / gs_usb firmware detected."
        return 0
    else
        echo "  [WARN] CANalyst-II USB device not detected via lsusb."
        echo "  Please verify the USB cable is connected to the Jetson."
        return 1
    fi
}

install_udev_rule() {
    echo "── Installing persistent udev rule for CANalyst-II ──"
    cat << 'EOF' | sudo tee /etc/udev/rules.d/99-canalystii.rules > /dev/null
# CANalyst-II / Chuangxin USB-CAN Adapter
SUBSYSTEM=="usb", ATTRS{idVendor}=="04d8", ATTRS{idProduct}=="0053", MODE="0666", GROUP="dialout"
SUBSYSTEM=="usb", ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="606f", MODE="0666", GROUP="dialout"
EOF
    sudo udevadm control --reload-rules
    sudo udevadm trigger
    echo "  [OK] udev rules installed and reloaded."
}

case "$ACTION" in
    up)
        echo "========================================"
        echo " Bringing UP CANalyst-II Bridge ($IFACE)"
        echo "========================================"
        detect_usb_device || true

        # Ensure vcan module is available
        sudo modprobe vcan 2>/dev/null || true
        sudo modprobe can_raw 2>/dev/null || true

        # If native hardware interface (e.g. gs_usb) exists with this name, configure it
        if [ -d "/sys/class/net/$IFACE/device" ]; then
            echo "Configuring existing hardware SocketCAN interface $IFACE..."
            sudo ip link set "$IFACE" down 2>/dev/null || true
            sudo ip link set "$IFACE" type can bitrate "$BITRATE" 2>/dev/null || true
            sudo ip link set "$IFACE" up
            echo "  [OK] Hardware interface $IFACE is UP @ $BITRATE bps."
            exit 0
        fi

        # Otherwise, ensure vcan interface exists
        if ! ip link show "$IFACE" >/dev/null 2>&1; then
            echo "Creating virtual interface '$IFACE'..."
            sudo ip link add dev "$IFACE" type vcan
        fi
        sudo ip link set up "$IFACE"

        # Check if python bridge is already running
        if pgrep -f "canalyst_socketcan_daemon.py.*$IFACE" >/dev/null; then
            echo "  [INFO] Bridge daemon is already running for $IFACE."
        else
            echo "Starting canalyst_socketcan_daemon.py in background..."
            nohup python3 "$SCRIPT_DIR/canalyst_socketcan_daemon.py" \
                --channel 0 \
                --interface "$IFACE" \
                --bitrate "$BITRATE" \
                > "/tmp/canalyst_${IFACE}.log" 2>&1 &
            sleep 1
            if pgrep -f "canalyst_socketcan_daemon.py.*$IFACE" >/dev/null; then
                echo "  [OK] Bridge daemon started (PID $(pgrep -f "canalyst_socketcan_daemon.py.*$IFACE"))."
                echo "  Logs: /tmp/canalyst_${IFACE}.log"
            else
                echo "  [WARN] Bridge daemon exited immediately. Check /tmp/canalyst_${IFACE}.log"
            fi
        fi
        ;;

    down)
        echo "========================================"
        echo " Stopping CANalyst-II Bridge ($IFACE)"
        echo "========================================"
        pkill -f "canalyst_socketcan_daemon.py.*$IFACE" 2>/dev/null || true
        if ip link show "$IFACE" >/dev/null 2>&1; then
            sudo ip link set down "$IFACE" 2>/dev/null || true
            echo "  [OK] Interface $IFACE brought DOWN."
        fi
        echo "  [OK] Stopped."
        ;;

    status)
        echo "========================================"
        echo " CANalyst-II & SocketCAN Status"
        echo "========================================"
        detect_usb_device || true
        echo ""
        echo "── SocketCAN Interfaces ──"
        ip -details link show type can 2>/dev/null || true
        ip -details link show type vcan 2>/dev/null || true
        echo ""
        echo "── Bridge Daemon Status ──"
        if pgrep -f "canalyst_socketcan_daemon.py" >/dev/null; then
            echo "  [RUNNING] Bridge daemon active (PID $(pgrep -f "canalyst_socketcan_daemon.py"))."
        else
            echo "  [STOPPED] Bridge daemon is not running."
        fi
        ;;

    dump)
        echo "========================================"
        echo " Starting Live CAN Middleman Sniffer on $IFACE"
        echo "========================================"
        if ! command -v candump >/dev/null; then
            echo "Error: can-utils not found. Install with: sudo apt install can-utils"
            exit 1
        fi
        echo "Press Ctrl+C to stop..."
        candump -tz -c "$IFACE"
        ;;

    install-udev)
        install_udev_rule
        ;;

    install-service)
        echo "── Installing systemd system service for CANalyst-II ──"
        cat << EOF | sudo tee /etc/systemd/system/canalyst-bridge@.service > /dev/null
[Unit]
Description=CANalyst-II to SocketCAN Bridge (%I)
After=network.target

[Service]
Type=simple
User=med1
ExecStart=/usr/bin/python3 $WORKSPACE_ROOT/scripts/canalyst_socketcan_daemon.py --interface %I --bitrate 500000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
        sudo systemctl daemon-reload
        echo "  [OK] Service installed. Enable with: sudo systemctl enable --now canalyst-bridge@$IFACE"
        ;;

    test-loopback)
        echo "========================================"
        echo " Testing Frame Injection on $IFACE"
        echo "========================================"
        if ! ip link show "$IFACE" | grep -q "UP"; then
            echo "Error: $IFACE is not UP. Run '$0 up $IFACE' first."
            exit 1
        fi
        echo "Sending Autoware test heartbeat (0x7FC)..."
        cansend "$IFACE" "7FC#0102030405060708"
        echo "  [OK] Frame sent to $IFACE."
        ;;

    *)
        echo "Usage: $0 {up|down|status|dump|install-udev|install-service|test-loopback} [interface] [bitrate]"
        exit 1
        ;;
esac
