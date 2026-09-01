# CANable Pro USB-to-CAN Integration Guide

This guide explains how to connect, configure, turn on/off, and use the **CANable Pro** USB-to-CAN adapter for bench and hardware-in-the-loop (HIL) testing in the E-Trike Autonomous Vehicle project.

---

## 1. Why Existing TX/RX Codes Do Not Change

Our vehicle bridges ([`autoware_vehicle_bridge`](file:///e:/work/av_project/autoware/src/our_packages/autoware_vehicle_bridge) and [`direct_bridge`](file:///e:/work/av_project/autoware/src/our_packages/direct_bridge)) communicate with the vehicle via the standard **Linux SocketCAN** kernel layer (`socket(PF_CAN, SOCK_RAW, CAN_RAW)`).

```
   ┌────────────────────────────────────────────────────────┐
   │             Autoware ROS 2 Control Stack               │
   └───────────────────────────┬────────────────────────────┘
                               │ ROS 2 topics
   ┌───────────────────────────▼────────────────────────────┐
   │    Vehicle Bridge Node (Lifecycle Fail-Closed)        │
   │    (autoware_vehicle_bridge or direct_bridge)          │
   └───────────────────────────┬────────────────────────────┘
                               │ SocketCAN API (send / recv)
 ══════════════════════════════╪══════════════════════════════ Linux Kernel
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   ┌─────────────────┐                   ┌─────────────────┐
   │  MTTCAN can0    │                   │ CANable Pro     │
   │  (Onboard Jetson│                   │ (gs_usb netdev) │
   │   for vehicle)  │                   │ (for USB bench) │
   └─────────────────┘                   └─────────────────┘
```

Because SocketCAN abstracts the physical hardware:
- **Zero changes** to message encoding (`CanEncoder`) or decoding (`CanDecoder`).
- **All TX & RX frames** (`0x300`, `0x301`, `0x303`, `0x7FC`, `0x204`, `0x169`, `0x7B9`, `0x110`, `0x121`, `0x210`, `0x310`, `0x120`, `0x206`, `0x201`, `0x721`, etc.) work identically.
- Switching between vehicle onboard CAN (`can0`), virtual CAN (`vcan0`/`vcan1`), and CANable Pro (`canable0`) is done purely via the `can_interface` launch parameter.

---

## 2. Firmware Recommendation: CandleLight (gs_usb)

CANable Pro supports two firmware modes:
1. **`candlelight` (Recommended)**:
   - Registers as a native `gs_usb` network device in Linux (`canX` or `canable0`).
   - Hardware timestamping, zero user-space serial overhead, high throughput at 500 kbit/s.
   - Works immediately with SocketCAN and `can-utils` (`candump`, `cansend`).
2. **`slcan`**:
   - Registers as a USB CDC ACM serial port (`/dev/ttyACM0`).
   - Requires `slcand` daemon to bridge to SocketCAN.

> **Recommendation**: Flash or ensure your CANable Pro is using **candlelight** firmware (default on modern CANable Pro / Makerbase CANable).

---

## 3. Fixed Interface Naming (Udev Rule)

To prevent the CANable Pro from competing for names like `can0` or `can1` when plugged into the Jetson/PC, assign it a fixed interface name (`canable0`):

Run the automated installer:
```bash
./scripts/setup_canable.sh install-udev
```

Or manually create `/etc/udev/rules.d/99-canable.rules`:
```udev
SUBSYSTEM=="net", ACTION=="add", ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="606f", NAME="canable0"
```
Reload udev rules:
```bash
sudo udevadm control --reload-rules && sudo udevadm trigger
```

---

## 4. Turning CANable ON and OFF

### Option A: Using the Helper Script

**Turn ON (500 kbps):**
```bash
./scripts/setup_canable.sh up
```

**Turn OFF:**
```bash
./scripts/setup_canable.sh down
```

**Check Status & Link:**
```bash
./scripts/setup_canable.sh status
```

---

### Option B: Manual Linux Commands

**Turn ON:**
```bash
sudo ip link set canable0 type can bitrate 500000
sudo ip link set canable0 up
```

**Turn OFF:**
```bash
sudo ip link set canable0 down
```

---

## 5. Running Nodes with CANable Pro in Testing Stage

### 1. Autoware Vehicle Bridge (Production High-Bus Bridge)
```bash
ros2 launch autoware_vehicle_bridge vehicle_bridge.launch.py can_interface:=canable0
```

### 2. Full Vehicle Interface Launch
```bash
ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml can_interface:=canable0
```

### 3. Direct Low-Bus Actuator Bridge (Bench Testing)
```bash
ros2 launch direct_bridge direct_bridge.launch.py can_interface:=canable0
```

### 4. Bench Automated Verification Script
```bash
python3 autoware/src/our_packages/direct_bridge/scripts/run_bench.py --interface canable0
```

---

## 6. Sniffing & Debugging Traffic

To monitor raw CAN traffic passing through CANable Pro:
```bash
# View all traffic with timestamps
candump -tz canable0

# Filter for Host control commands (0x300, 0x301, 0x302, 0x303) & Heartbeat (0x7FC)
candump -tz canable0,300:303,7FC:7FC

# Filter for direct actuator frames (0x204 MTR, 0x169 SES, 0x7B9 SEB, 0x110 SYS)
candump -tz canable0,204:7FF,169:7FF,7B9:7FF,110:7FF
```
