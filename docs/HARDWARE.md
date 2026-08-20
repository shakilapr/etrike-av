# Hardware Specification

## 1. Computing Unit
* **Device:** NVIDIA Jetson AGX Orin Developer Kit
* **CPU:** 12-Core ARM Cortex-A78AE (aarch64) @ 2.20 GHz
  * **Architecture:** 64-bit, Little Endian, ARMv8
  * **Caches:** 512 KiB L1, 2 MiB L2, 4 MiB L3
* **GPU & Acceleration:** Orin (nvgpu)
  * **Driver Version:** 540.5.0
  * **CUDA API Version:** 12.6
* **Power & Thermal:**
  * **Configured Power Profile:** `MODE_30W` (configured via `nvpmodel`)
  * **Measured Temperatures:** CPU `42.3°C`, GPU `39.9°C`
* **Memory (RAM):** 64 GB LPDDR5 (61 GiB Usable)
* **Storage & Swap:**
  * **eMMC:** 64 GB internal (`/dev/mmcblk0p1` mounted at `/`, 57G total, 40G used, 15G avail)
  * **Swap Configuration:** 8x ZRAM block devices (`zram0`–`zram7`), ~3.8 GiB each, Priority 5 (Total Swap: 30.6 GiB)
* **Peripherals:** Realtek 4-Port USB 3.0 Hub, Realtek 4-Port USB 2.0 Hub, Bluetooth Radio

## 2. Perception Sensors
### LiDAR: 1x Hesai XT32M2X
* **Type:** 32-channel 360° mechanical LiDAR (905 nm)
* **Physical Specs:** Mass 0.490 kg (490 g), Radius 46.5 mm, Height 75.0 mm
* **Mounting Extrinsics (Relative to `base_link`):**
  * **Origin:** $X = 0.575\text{ m}$, $Y = 0.000\text{ m}$, $Z = 1.7464\text{ m}$ ($1.700\text{ m roof height} + 0.0464\text{ m optical origin}$)
  * **Rotation (RPY):** $(0.0, 0.0, 0.0)$
* **Range & FOV:** 0.5 to 300 m (80 m @ 10% reflectivity); 360° Horizontal x 40.3° Vertical (-20.8° to +19.5°)
* **Resolution:** 1.3° Vertical; 0.18° Horizontal @ 10 Hz (0.09° @ 5 Hz; 0.36° @ 20 Hz)
* **Accuracy & Precision:** ±1 cm accuracy, 0.5 cm precision (1σ)
* **Return Mode:** Triple Return (captures multiple echoes; spatial resolution remains 32 channels)
* **Network & Port Addressing:**
  * **Host Interface & IP:** `eno1` @ `192.168.1.10/24`
  * **Sensor Target IP:** `192.168.1.201`
  * **UDP Point Cloud Port:** `2368`
  * **UDP GNSS/PTP Port:** `10110`

### Depth Cameras: 2x Kinect for Windows v2
* **Platform:** Configured for Linux
* **Interface:** USB 3.0
* **Role:** Short-range RGB-D perception and obstacle detection.

## 3. Vehicle Chassis Kinematics & Geometry
* **Base Platform:** Bajaj RE Three-Wheeler
* **Mass Properties:** Vehicle Mass 337.0 kg; Center of Mass $(X: 0.550\text{ m}, Y: 0.000\text{ m}, Z: 0.800\text{ m})$
* **Dimensions:** Length 2.635 m, Width 1.300 m, Height 1.700 m, Ground Clearance 0.170 m
* **Kinematics:**
  * **Wheelbase:** 2.000 m
  * **Rear Track:** 1.150 m ($0.575\text{ m}$ half-track)
  * **Wheel Radius:** 0.203 m; Wheel Width: 0.102 m
  * **Max Steering Angle:** 0.747 rad ($\approx 42.8^\circ$)

## 4. Vehicle Control Interface
* **Interface:** RT (Real-Time) through CAN
* **Hardware Controllers:** 2x MTTCAN interfaces (`can0`, `can1` @ 50MHz clock)
* **Target:** Chassis Electronic Control Units (ECUs)
* **I/O Functions:**
  * **TX:** Actuation commands (steering, acceleration, braking).
  * **RX:** Chassis status, `ecu_temp`, diagnostics.
