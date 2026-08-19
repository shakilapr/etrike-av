# Hardware Specification

## 1. Compute
* **Unit:** NVIDIA Jetson AGX Orin 64GB
* **Role:** Primary compute node (Autoware Universe, sensor fusion, motion planning, control loops).

## 2. Perception Sensors
* **LiDAR:** 1x Hesai XT32M2X
  * **Type:** 32-channel mechanical 3D LiDAR
  * **Role:** Primary 360-degree spatial perception, localization, mapping.
* **Depth Cameras:** 2x Kinect for Windows v2
  * **Platform:** Configured for Linux
  * **Role:** RGB-D acquisition, short-range obstacle detection, semantic segmentation.

## 3. Vehicle Control Interface
* **Interface:** RT (Real-Time) through CAN
* **Target:** Chassis Electronic Control Units (ECUs)
* **Role:** Low-level chassis actuation and telemetry ingestion.
* **I/O:**
  * **TX:** Steering, acceleration, braking commands.
  * **RX:** Chassis telemetry, `ecu_temp`, diagnostics.
