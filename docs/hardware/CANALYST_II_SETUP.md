# CANalyst-II USB-to-CAN Setup & Operation Guide

This document is the definitive guide for connecting, configuring, and operating the **CANalyst-II** (and Chuangxin / Waveshare USB-CAN-B compatible) USB-to-CAN dual-channel adapter on the E-Trike **NVIDIA Jetson AGX Orin** (`172.16.25.67`) with ROS 2 and Autoware Universe.

---

## 1. Overview & Interface Mapping

On the E-Trike Jetson Orin, physical CAN interfaces are mapped as follows:

| Interface | Hardware Device | Role / Purpose |
|---|---|---|
| **`can0`** | Onboard Jetson MTTCAN 0 | Native hardware CAN controller (Vehicle High-Bus) |
| **`can1`** | Onboard Jetson MTTCAN 1 | Native hardware CAN controller (Vehicle Low-Bus) |
| **`can2`** | **CANalyst-II USB Adapter** (`04d8:0053`) | **Bench testing, vehicle diagnostics, and Autoware HIL** |
| **`can3`** | CANalyst-II Secondary Channel (Optional) | Gateway passthrough or secondary bus sniffer |

> [!NOTE]
> On NVIDIA Jetson platforms, `can0` and `can1` are reserved by the hardware SoC (`mttcan`). The CANalyst-II is mapped to **`can2`** across all workspace scripts ([`scripts/start_bridge_can2.sh`](../../scripts/start_bridge_can2.sh) and [`scripts/run_can_watcher.sh`](../../scripts/run_can_watcher.sh)).

---

## 2. Physical Wiring & Pinout

The CANalyst-II features a 6-pin or 10-pin screw terminal block with two independent channels:

```
          ┌────────────────────────────────────────┐
          │            CANalyst-II                 │
          │                                        │
          │   [CAN 1]                 [CAN 2]      │
          │  CH  CL  GND             CH  CL  GND   │
          └───┬───┬───┬───────────────┬───┬───┬────┘
              │   │   │               │   │   │
              │   │   │               │   │   └─ Shield / Signal GND
              │   │   │               │   └───── CAN2_L
              │   │   │               └───────── CAN2_H
              │   │   └─ Shield / Signal GND
              │   └───── CAN1_L (Vehicle CAN Low - typically green/blue wire)
              └───────── CAN1_H (Vehicle CAN High - typically yellow/white wire)
```

### 120Ω Termination Resistor Configuration
* **Tapping into an existing vehicle bus (Sniffer / Middleman)**: Keep the internal 120Ω termination resistor switch set to **OFF** (open). The vehicle harness already contains 120Ω end-of-line termination resistors.
* **Bench point-to-point testing (Jetson ↔ Single ECU / Actuator)**: Switch the 120Ω termination resistor to **ON**.

---

## 3. Architecture: Why Autoware Code Does Not Change

The vehicle bridge node ([`autoware_vehicle_bridge`](../../autoware/src/our_packages/autoware_vehicle_bridge)) interacts with the operating system strictly using Linux **SocketCAN** (`socket(PF_CAN, SOCK_RAW, CAN_RAW)`).

```
   ┌────────────────────────────────────────────────────────┐
   │             Autoware ROS 2 Universe Stack              │
   │  (/control/command/control_cmd, /vehicle/status/...)   │
   └───────────────────────────┬────────────────────────────┘
                               │
   ┌───────────────────────────▼────────────────────────────┐
   │         autoware_vehicle_bridge (Docker Container)     │
   │           bound to can_interface := "can2"             │
   └───────────────────────────┬────────────────────────────┘
                               │ Linux SocketCAN API
 ══════════════════════════════╪══════════════════════════════ Host OS
                               │
                      [ can2 (SocketCAN) ]
                               │
   ┌───────────────────────────▼────────────────────────────┐
   │     scripts/canalyst_socketcan_daemon.py (Host)        │
   │         (Bidirectional USB Bulk Pipe Bridge)           │
   └───────────────────────────┬────────────────────────────┘
                               │ USB Bulk In / Out (04d8:0053)
   ┌───────────────────────────▼────────────────────────────┐
   │                 CANalyst-II Hardware                   │
   └───────────────────────────┬────────────────────────────┘
                               │ Physical CAN Bus
                   [ E-Trike RT / SYS / MTR ECUs ]
```

Because [`scripts/canalyst_socketcan_daemon.py`](../../scripts/canalyst_socketcan_daemon.py) presents the hardware as standard Linux `can2`:
1. **Zero C++ code modifications** are required in `autoware_vehicle_bridge`.
2. Standard Linux utilities (`candump`, `cansend`, Wireshark) work natively.
3. The workspace's graphical CAN Watcher ([`scripts/run_can_watcher.sh`](../../scripts/run_can_watcher.sh)) connects directly to `can2`.

---

## 4. How to Plug In and Start (Step-by-Step)

### Step 1: Connect Hardware
1. Connect **CAN1_H**, **CAN1_L**, and **GND** on the CANalyst-II to your vehicle CAN bus.
2. Plug the USB Type-A/B cable into any USB port on the Jetson Orin.
3. Verify the Jetson enumerates the adapter:
   ```bash
   lsusb | grep -i "04d8:0053"
   ```
   *Expected output:*
   ```
   Bus 001 Device 007: ID 04d8:0053 Microchip Technology, Inc. Chuangxin Tech USBCAN/CANalyst-II
   ```

### Step 2: One-Time Setup (Permissions & Dependencies)
If running on a freshly deployed Jetson:
```bash
# 1. Install persistent udev permissions
./scripts/setup_canalyst.sh install-udev

# 2. Install python-can with canalyst backend
pip3 install --user "python-can[canalystii]"
```

### Step 3: Bring Up the CANalyst-II Bridge
Run the bring-up command specifying interface `can2` and bitrate `500000` (500 kbps):
```bash
./scripts/setup_canalyst.sh up can2 500000
```
*Expected output:*
```
========================================
 Bringing UP CANalyst-II Bridge (can2)
========================================
── Checking USB enumeration ──
  [OK] CANalyst-II adapter detected on USB bus (04d8:0053).
Starting canalyst_socketcan_daemon.py in background...
  [OK] Bridge daemon started (PID 7104).
  Logs: /tmp/canalyst_can2.log
```

### Step 4: Verify Live CAN Traffic
Run the traffic analyzer to inspect incoming ECU addresses:
```bash
python3 scripts/analyze_canalyst_traffic.py --interface can2 --duration 3.0
```
*Expected output:*
```
=========================================================================================
 Captured CAN Addresses on 'can2' (Duration: 3.0s)
=========================================================================================
CAN ID (Hex)   ID (Dec)   Freq (Hz)    DLC    Last Data (Hex)            Signal / Purpose
-------------- ---------- ------------ ------ -------------------------- ------------------------------
0x121          289        9.7          8      00 00 00 00 00 00 07 F3    RT_MOTION_RPT (Velocity, Heading Rate, Gear)
0x169          361        49.6         8      02 75 30 01 48 33 00 C2    SYS_THROTTLE_STS / ADC Feedback
0x201          513        49.6         8      03 75 30 01 48 79 33 BA    RT_ACTUATOR_STS (Steering/Brake telemetry)
0x204          516        99.6         8      00 00 00 00 00 00 00 00    MTR_TELEMETRY_RPT (Inverter/Motor Status)
0x206          518        49.6         8      00 00 00 10 00 00 00 00    MTR_MOTOR_FBK (RPM, Temperature, Gear State)
0x721          1825       49.6         8      07 02 58 00 00 00 33 91    DIAG_SERVICE_RSP (ECU Response)
0x7B9          1977       49.6         8      03 02 58 00 00 00 33 95    BMS_BATTERY_STS (Battery Telemetry)
0x7FD          2045       2.0          8      30 05 00 00 00 00 00 00    RT_HEARTBEAT (Real-Time Controller Liveness)
0x7FE          2046       9.7          8      F3 05 00 00 00 00 00 00    RT_NODE_STATUS / SYS_NODE_STATUS (ECU State)
---------------------------------------------------------------------------------------------------------
Total Unique Addresses: 12 | Total Frames Captured: 1715
```

### Step 5: Start Autoware Universe Vehicle Bridge
Start the vehicle bridge containerized service:
```bash
./scripts/start_bridge_can2.sh
```
Verify Autoware diagnostics:
```bash
docker exec autoware_test bash -c \
  "source /opt/ros/humble/setup.bash && ros2 topic echo /vehicle_bridge/output/diagnostics --once"
```
*Expected status:*
```yaml
- level: "\0"
  name: CAN
  message: connected
- level: "\0"
  name: RT motion report
  message: fresh
```

---

## 5. Watching as a Middleman (Live Sniffing)

### Option A: Terminal Sniffer (`candump`)
To watch color-coded CAN traffic with delta timestamps in the terminal:
```bash
./scripts/setup_canalyst.sh dump can2
```

### Option B: Graphical Web UI (CAN Watcher)
Start the built-in cockpit CAN monitoring server:
```bash
./scripts/run_can_watcher.sh can2 8000
```
Open in your browser:
```
http://172.16.25.67:8000
```
*Features:* Live bit matrix visualizer, signal decoding against `etrike_protocol`, big-endian bit mapping, and message frequency graphs.

---

## 6. Teardown / Stopping
When bench testing is complete:
```bash
# 1. Stop vehicle bridge
docker exec autoware_test pkill -f vehicle_bridge

# 2. Stop CANalyst bridge daemon and bring down can2
./scripts/setup_canalyst.sh down can2
```

---

## 7. Troubleshooting

| Symptom | Cause | Solution |
|---|---|---|
| `CANalyst-II USB device not detected` | Loose USB cable or device in sleep mode | Re-plug USB cable and check `dmesg \| grep -i usb`. |
| `Permission denied` opening USB | User not in `dialout` group or missing udev rule | Run `./scripts/setup_canalyst.sh install-udev`, then re-plug USB. |
| `Errors` incrementing in `/tmp/canalyst_can2.log` | Loopback echo or non-8-byte payload | Ensure you are using the latest `scripts/canalyst_socketcan_daemon.py` which sets `receive_own_messages=False` and auto-pads frames to 8 bytes. |
| Autoware says `RT Heartbeat missing` | Real-time ECU is powered off or disconnected | Verify vehicle 12V ignition/power rail is turned on. |
