# CANable Pro USB-to-CAN Setup & Operation Guide

This document is the **single** reference for installing, configuring, and using
the **CANable Pro** USB-to-CAN adapter on the E-Trike Jetson Orin (`172.16.25.67`)
for bench / hardware-in-the-loop (HIL) testing.

> This guide supersedes the older `CANABLE_SETUP.md` (see “Document history”).

---

## 1. Overview & Interface Mapping

On the E-Trike Jetson Orin, CAN interfaces are mapped as follows:

| Interface | Hardware / Source | Purpose / Environment |
|---|---|---|
| **`can0`** | Onboard MTTCAN Controller 0 | Vehicle High-Bus (Production Jetson ↔ RT/SYS) |
| **`can1`** | Onboard MTTCAN Controller 1 | Vehicle Low-Bus (Direct Jetson ↔ Actuators) |
| **`canable0`** | **CANable Pro USB Adapter** (`1d50:606f`) | **Bench / HIL Testing & Sniffing** (fixed name via udev) |
| **`vcan0`** | Virtual CAN Kernel Module | Offline Simulation / Software-in-the-Loop |

> Before the udev rule is installed, the CANable Pro appears as a dynamically
> assigned name (`can2`, `can3`, …). After `install-udev` + re-plug it is always
> **`canable0`**.

---

## 2. Why the Existing TX/RX Code Does Not Change

The vehicle bridges
([`autoware_vehicle_bridge`](../../autoware/src/our_packages/autoware_vehicle_bridge)
and [`direct_bridge`](../../autoware/src/our_packages/direct_bridge)) talk to the
bus via the standard **Linux SocketCAN** kernel layer
(`socket(PF_CAN, SOCK_RAW, CAN_RAW)`).

```
   ┌────────────────────────────────────────────────────────┐
   │             Autoware ROS 2 Control Stack               │
   └───────────────────────────┬────────────────────────────┘
                               │ ROS 2 topics
   ┌───────────────────────────▼────────────────────────────┐
   │   Vehicle Bridge Node (Lifecycle Fail-Closed)          │
   │   (autoware_vehicle_bridge or direct_bridge)           │
   └───────────────────────────┬────────────────────────────┘
                               │ SocketCAN API (send / recv)
 ══════════════════════════════╪══════════════════════════════ Linux Kernel
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   ┌─────────────────┐                   ┌─────────────────┐
   │  mttcan can0/1  │                   │ CANable canable0│
   │ (onboard Jetson)│                   │ (gs_usb USB)    │
   └─────────────────┘                   └─────────────────┘
```

Because SocketCAN abstracts the physical hardware:

- **Zero changes** to message encoding (`CanEncoder`) or decoding (`CanDecoder`).
- All TX & RX frames (`0x300`, `0x301`, `0x303`, `0x7FC`, `0x204`, `0x169`,
  `0x7B9`, `0x110`, `0x121`, `0x210`, `0x310`, `0x120`, `0x206`, `0x201`,
  `0x721`, …) work identically.
- Switching between onboard CAN (`can0`/`can1`), virtual CAN (`vcan0`), and the
  CANable Pro (`canable0`) is done purely via the `can_interface` launch argument.

---

## 3. Prerequisites (done once on the Jetson)

1. **gs_usb kernel driver**
   - The native Linux SocketCAN `gs_usb` driver is compiled against the JetPack
     kernel headers (`5.15.199-tegra`) and installed to
     `/lib/modules/5.15.199-tegra/kernel/drivers/net/can/usb/gs_usb.ko`.
   - The device registers automatically as a SocketCAN netdev when plugged in.
2. **can-utils** (host): `candump`, `cansend`, `slcand` — already installed.
3. **Passwordless sudo** for the current user (so ON/OFF works non-interactively):

```bash
./scripts/setup_canable.sh install-sudo
```

---

## 4. Install the Fixed Interface Name (udev)

Give the device a **stable, port-independent** name so "plug-and-run" always uses
`canable0`. The rule is keyed on the device **serial** (plus vendor/product):

```bash
./scripts/setup_canable.sh install-udev
```

This writes `/etc/udev/rules.d/99-canable.rules`:

```udev
SUBSYSTEM=="net", ACTION=="add", ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="606f", ATTRS{serial}=="<device-serial>", NAME="canable0"
```

Then **unplug and re-plug** the USB device (or `sudo udevadm trigger`). Verify:

```bash
ip link show canable0
```

> If two CANable devices are ever used, keying on serial keeps each one unique.

---

## 5. Quick Control (ON / OFF)

Run these on the Jetson (passwordless sudo is installed):

### Turn CANable ON (500 kbps)
```bash
./scripts/setup_canable.sh up        # default: canable0 @ 500000
./scripts/setup_canable.sh up canable0 500000
```
Manual equivalent:
```bash
sudo ip link set canable0 type can bitrate 500000 && sudo ip link set canable0 up
```

### Turn CANable OFF
```bash
./scripts/setup_canable.sh down canable0
```
Manual equivalent:
```bash
sudo ip link set canable0 down
```

### Check Status & Link
```bash
./scripts/setup_canable.sh status
ip -details link show canable0
```

> The bridge node also auto-configures the interface itself (see
> `autoware_vehicle_bridge` `can_bitrate` param), but bringing the interface up
> explicitly is fine and preferred for sniffing before/without running a bridge.

---

## 6. Running Autoware / Vehicle Bridges (Testing Stage)

Whenever testing with the CANable Pro plugged in, pass `can_interface:=canable0`:

### 1. Autoware High-Bus Vehicle Bridge
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

### 4. Direct Bridge Automated Bench Test Script
```bash
python3 autoware/src/our_packages/direct_bridge/scripts/run_bench.py --interface canable0
```

---

## 7. Sniffing & Debugging CAN Traffic

```bash
# View all traffic with timestamps
candump -tz canable0

# Filter for Autoware control commands (0x300-0x303) and Host Heartbeat (0x7FC)
candump -tz canable0,300:303,7FC:7FC

# Filter for Actuator frames (0x204 MTR, 0x169 SES, 0x7B9 SEB, 0x110 SYS)
candump -tz canable0,204:7FF,169:7FF,7B9:7FF,110:7FF
```

Quick sanity check that TX/RX works:
```bash
cansend canable0 123#DEADBEEF      # send a test frame
candump -tz canable0               # confirm you see frames
```

---

## 8. Helper Script Reference

`scripts/setup_canable.sh` is the turnkey manager:

```bash
./scripts/setup_canable.sh up          canable0 500000   # Bring UP (ON)
./scripts/setup_canable.sh down        canable0          # Bring DOWN (OFF)
./scripts/setup_canable.sh status                        # Show all CAN links
./scripts/setup_canable.sh dump        canable0          # Live packet sniffer
./scripts/setup_canable.sh install-udev                  # Fixed canable0 name
./scripts/setup_canable.sh install-sudo                  # Passwordless sudo
```

---

## 9. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| No `canable0` / only `can2` | udev rule not installed → run `install-udev` + re-plug |
| `Operation not permitted` | Missing passwordless sudo → run `install-sudo` |
| `ip link set ... bitrate` fails | Interface already UP: bring DOWN first (script does this) |
| `gs_usb` not loaded | `sudo modprobe gs_usb` (or `setup_canable.sh up` loads it) |
| `candump` shows nothing | Not a bus issue: no other node is transmitting; `cansend` a test frame |

---

## Document history

- **2026-09-01**: Combined the two CANable documents into this single canonical
  guide. Interface is `canable0` (serial-keyed udev), added passwordless sudo
  (`install-sudo`), and aligned the helper script with the fixed name.
- **Superseded**: `docs/hardware/CANABLE_SETUP.md` (older, used `canable0` via a
  vendor/product-only udev rule and referenced `canX` names in places).
