#!/bin/bash
# ==============================================================================
# CANable Pro USB-to-CAN Management Script (E-Trike AV Test Stage)
# ==============================================================================
# Usage:
#   ./scripts/setup_canable.sh up          [interface] [bitrate]  # Bring UP CANable
#   ./scripts/setup_canable.sh down        [interface]            # Bring DOWN CANable
#   ./scripts/setup_canable.sh status                             # Check status & link
#   ./scripts/setup_canable.sh dump        [interface]            # Run candump sniffer
#   ./scripts/setup_canable.sh install-udev                       # Install persistent naming rule (serial-keyed -> canable0)
#   ./scripts/setup_canable.sh install-sudo                       # Install passwordless sudo for med1 (ip/can tools)
# ==============================================================================

set -eo pipefail

ACTION="${1:-status}"
IFACE="${2:-canable0}"
BITRATE="${3:-500000}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# CANable USB IDs (OpenMoko / Candlelight / Geschwister Schneider / Makerbase)
# 1d50:606f = Geschwister Schneider USB / Candlelight firmware
# 16c0:05dc = SLCAN USB-CDC
CANABLE_VENDOR_ID="1d50"
CANABLE_PRODUCT_ID="606f"

detect_usb_device() {
    echo "── Checking USB enumeration ──"
    if lsusb | grep -qiE "1d50:606f|candlelight|canable|gs_usb"; then
        echo "  [OK] CANable Pro (candlelight / gs_usb) detected on USB bus."
        return 0
    elif lsusb | grep -qiE "16c0:05dc|cdc-acm|slcan"; then
        echo "  [OK] CANable device (slcan CDC) detected on USB bus."
        return 0
    else
        echo "  [WARN] CANable USB device not detected via lsusb."
        echo "  Please check USB cable connection."
        return 1
    fi
}

detect_canable_serial() {
    # Find the USB device serial for the gs_usb CANable adapter.
    # Used by install-udev to make the interface name stable per device.
    for usbdev in /sys/bus/usb/devices/*/; do
        if [ "$(cat "$usbdev/idVendor" 2>/dev/null)" = "$CANABLE_VENDOR_ID" ] &&
           [ "$(cat "$usbdev/idProduct" 2>/dev/null)" = "$CANABLE_PRODUCT_ID" ]; then
            cat "$usbdev/serial" 2>/dev/null
            return 0
        fi
    done
    return 1
}

find_socketcan_iface() {
    # If the target interface exists directly, return it
    if ip link show "$IFACE" &>/dev/null; then
        echo "$IFACE"
        return 0
    fi

    # Search for available gs_usb / can network interfaces (including the
    # fixed-name canable0 set by install-udev)
    for dev in $(ls /sys/class/net/ 2>/dev/null | grep -E '^can[0-9]+|^canable[0-9]+|^slcan[0-9]+'); do
        # Check if backed by USB
        if readlink -f "/sys/class/net/$dev/device" | grep -q "usb"; then
            echo "$dev"
            return 0
        fi
    done

    # Fallback to can1 or can0 if only one CAN device exists
    if ip link show can1 &>/dev/null; then
        echo "can1"
        return 0
    elif ip link show can0 &>/dev/null; then
        echo "can0"
        return 0
    fi

    return 1
}

case "$ACTION" in
    up)
        echo "========================================"
        echo " Bringing UP CANable Pro"
        echo "========================================"
        detect_usb_device || true

        # Ensure gs_usb kernel module is loaded
        if ! lsmod | grep -q "gs_usb"; then
            echo "Loading gs_usb kernel module..."
            sudo modprobe gs_usb 2>/dev/null || sudo modprobe can_raw 2>/dev/null || true
        fi

        TARGET_IFACE=$(find_socketcan_iface || echo "$IFACE")
        echo "Target CAN interface: $TARGET_IFACE (Bitrate: $BITRATE bps)"

        if ! ip link show "$TARGET_IFACE" &>/dev/null; then
            echo "  [ERROR] Interface $TARGET_IFACE not found in kernel netdev list."
            echo "  Check 'dmesg | tail -n 20' or run: ./scripts/setup_canable.sh install-udev"
            exit 1
        fi

        echo "Configuring $TARGET_IFACE bitrate to $BITRATE..."
        sudo ip link set "$TARGET_IFACE" down 2>/dev/null || true
        sudo ip link set "$TARGET_IFACE" type can bitrate "$BITRATE"
        sudo ip link set "$TARGET_IFACE" up

        echo "  [SUCCESS] $TARGET_IFACE is now UP and configured at $BITRATE bps."
        echo ""
        echo "To test with Autoware Vehicle Bridge:"
        echo "  ros2 launch autoware_vehicle_bridge vehicle_bridge.launch.py can_interface:=$TARGET_IFACE"
        echo ""
        echo "To test with Direct Bridge:"
        echo "  ros2 launch direct_bridge direct_bridge.launch.py can_interface:=$TARGET_IFACE"
        ;;

    down)
        echo "========================================"
        echo " Bringing DOWN CANable Pro"
        echo "========================================"
        TARGET_IFACE=$(find_socketcan_iface || echo "$IFACE")
        if ip link show "$TARGET_IFACE" &>/dev/null; then
            sudo ip link set "$TARGET_IFACE" down
            echo "  [SUCCESS] $TARGET_IFACE is now DOWN (OFF)."
        else
            echo "  Interface $TARGET_IFACE is not active or already down."
        fi
        ;;

    status)
        echo "========================================"
        echo " CANable Pro & SocketCAN Status"
        echo "========================================"
        detect_usb_device || true
        echo ""
        echo "── SocketCAN Interfaces ──"
        ip -details link show type can 2>/dev/null || ip link show | grep -E "can[0-9]|slcan[0-9]|canable[0-9]" || echo "  No CAN interfaces found."
        echo ""
        ;;

    dump)
        TARGET_IFACE=$(find_socketcan_iface || echo "$IFACE")
        echo "Starting candump on $TARGET_IFACE (Press Ctrl+C to stop)..."
        candump -tz "$TARGET_IFACE"
        ;;

    install-udev)
        echo "========================================"
        echo " Installing Udev Rule for CANable Pro"
        echo "========================================"
        UDEV_FILE="/etc/udev/rules.d/99-canable.rules"
        echo "Writing persistent rule to $UDEV_FILE..."
        
        # Rule: Assign CandleLight gs_usb device to fixed name 'canable0'.
        # Keyed on the device serial (in addition to vendor/product) so the
        # name survives re-plug / port changes and is unique per device.
        CANABLE_SERIAL="$(detect_canable_serial)"
        if [ -n "$CANABLE_SERIAL" ]; then
            echo "  Device serial: $CANABLE_SERIAL"
            SERIAL_MATCH=", ATTRS{serial}==\"$CANABLE_SERIAL\""
        else
            echo "  [WARN] Device serial not detected; keying on vendor/product only."
            SERIAL_MATCH=""
        fi

        sudo bash -c "cat << EOF > $UDEV_FILE
# CANable Pro / Candlelight USB-to-CAN persistent naming
SUBSYSTEM==\"net\", ACTION==\"add\", ATTRS{idVendor}==\"$CANABLE_VENDOR_ID\", ATTRS{idProduct}==\"$CANABLE_PRODUCT_ID\"$SERIAL_MATCH, NAME=\"canable0\"
EOF"

        echo "Reloading udev rules..."
        sudo udevadm control --reload-rules
        sudo udevadm trigger
        echo "  [SUCCESS] Installed! Re-plug CANable USB device to get interface name 'canable0'."
        ;;

    install-sudo)
        echo "========================================"
        echo " Installing Passwordless Sudo for CANable"
        echo "========================================"
        echo "Adding NOPASSWD rules for $USER (ip link, modprobe, udevadm, slcand)..."
        sudo bash -c "echo '$USER ALL=(root) NOPASSWD: /sbin/ip, /usr/sbin/modprobe, /usr/sbin/udevadm, /usr/bin/slcand' > /etc/sudoers.d/canable"
        sudo chmod 440 /etc/sudoers.d/canable
        sudo visudo -c -f /etc/sudoers.d/canable || { echo "  [ERROR] sudoers file invalid; removing."; sudo rm -f /etc/sudoers.d/canable; exit 1; }
        echo "  [SUCCESS] Passwordless sudo installed for $USER. Test with: sudo -n ip link show canable0"
        ;;

    *)
        echo "Usage: $0 {up|down|status|dump|install-udev} [interface] [bitrate]"
        exit 1
        ;;
esac
