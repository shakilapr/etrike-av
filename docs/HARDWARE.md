# Hardware Specification

## 1. Computing Unit
* **Device:** NVIDIA Jetson AGX Orin Developer Kit
* **CPU:** 12-Core ARM Cortex-A78AE (aarch64) @ 2.20 GHz
  * **Architecture:** 64-bit, Little Endian, ARMv8
  * **Caches:** 512 KiB L1, 2 MiB L2, 4 MiB L3
* **Memory (RAM):** 64 GB LPDDR5 (61 GiB Usable)
* **Storage:** 64 GB internal eMMC (`/dev/mmcblk0`)
  * **Current Usage:** ~74% utilized on root partition.
* **Peripherals:** 4-Port USB 3.0 Hub, Bluetooth Radio

## 2. Perception Sensors
### LiDAR: 1x Hesai XT32M2X
* **Type:** 32-channel 360° mechanical LiDAR (905 nm)
* **Range & FOV:** 0.5 to 300 m (80 m @ 10% reflectivity); 360° Horizontal x 40.3° Vertical (-20.8° to +19.5°)
* **Resolution:** 1.3° Vertical; 0.18° Horizontal @ 10 Hz (0.09° @ 5 Hz; 0.36° @ 20 Hz)
* **Accuracy & Precision:** ±1 cm accuracy, 0.5 cm precision (1σ)
* **Return Mode:** Triple Return (captures multiple echoes; spatial resolution remains 32 channels)
* **Time Sync:** GNSS / PTP (1588v2, 802.1AS)
* **Interface:** 100BASE-TX Ethernet (connected via Orin's `eno1` port)
* **Environment:** IP6K7 rating, 10 W power, -20°C to 60°C
* **Role:** Spatial perception and localization. 1.3° vertical resolution requires calculation of mounting height for near-ground and curb coverage.

### Depth Cameras: 2x Kinect for Windows v2
* **Platform:** Configured for Linux
* **Interface:** USB 3.0
* **Role:** RGB-D acquisition, short-range obstacle detection, semantic segmentation.

## 3. Vehicle Control Interface
* **Interface:** RT (Real-Time) through CAN
* **Hardware:** 2x Onboard MTTCAN interfaces (`can0`, `can1` @ 50MHz clock)
* **Target:** Chassis Electronic Control Units (ECUs)
* **Role:** Low-level chassis actuation and telemetry ingestion.
* **Data Flow:**
  * **TX:** Steering, acceleration, braking commands.
  * **RX:** Chassis telemetry, `ecu_temp`, diagnostics.

## 4. Networking Interfaces
* `wlP1p1s0`: Wireless Interface (Wi-Fi)
* `eno1`: Main Ethernet Interface (Down when unplugged, handles LiDAR payload)
* `docker0`: Docker Bridge Network
* `can0`, `can1`: CAN Bus Interfaces
