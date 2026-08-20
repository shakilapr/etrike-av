# Mapping Without an IMU (Hardware Issue)

**Date Recorded:** 2026-08-20
**Component:** Mapping / Localization
**Status:** Open Hardware Limitation

## Issue Description

The E-Trike currently (as of August 20, 2026) uses an **IMU stub** (no physical hardware IMU). Because of this, the `lidarslam_ros2` mapping pipeline relies purely on LiDAR odometry from the Hesai XT32M2X and vehicle kinematics. 

While LiDAR-only SLAM works acceptably on straight paths, the lack of high-frequency inertial data causes the scan-matcher to lose track of rotation during **sharp turns**. This results in distorted maps and drift.

## Investigation: Can we use Camera + LiDAR fusion instead?

A proposed workaround was to fuse Visual Odometry (from the `etrike_kinect2` camera) with the Hesai XT32M2X LiDAR (Visual-LiDAR SLAM) to compensate for the missing IMU.

**Conclusion: Not Recommended for this hardware configuration.**

1. **Sensor Limitations (Microsoft Kinect V2):** The Microsoft Kinect V2 uses an infrared (IR) Time-of-Flight sensor for depth. This sensor gets completely blinded by sunlight outdoors, destroying its depth-sensing capabilities. 
2. **Visual Odometry Vulnerability:** Relying solely on the Kinect's RGB camera for monocular visual odometry is highly vulnerable to motion blur caused by the E-Trike's vibrations and rapid turns.
3. **Algorithm Constraints:** State-of-the-art Visual-LiDAR SLAM algorithms (such as LVI-SAM, FAST-LIVO, or R3LIVE) strictly require a hardware IMU to seed the visual tracking and LiDAR scan matching. Even fallback systems like RTAB-Map struggle without IMU stabilization outdoors.

## Recommended Solutions

### 1. (Preferred) Install a Hardware IMU
The most robust and standard Autoware approach is to install a physical IMU. 
*   **Examples:** Tamagawa Seiki (e.g., AU5854 - standard Autoware), Xsens (e.g., MTi-670 / MTi-680), or a properly integrated Bosch BNO085/BMI088.
*   **Impact:** Instantly provides the high-frequency rotation data required to de-skew LiDAR scans and stabilize the `lidarslam_ros2` backend during sharp turns.

### 2. (Software Alternative) Tune or Swap LiDAR Odometry
If adding hardware is delayed, we can attempt to improve pure-LiDAR tracking:
*   **Tuning `lidarslam_ros2`:** Change the `scan_matcher` registration method from `NDT` to `FastGICP` or `SmallGICP`, which sometimes handles rotation more gracefully.
*   **Evaluate KISS-ICP:** Integrate [KISS-ICP](https://github.com/PRBonn/kiss-icp), a modern, highly robust pure-LiDAR odometry pipeline that performs exceptionally well without an IMU or camera, even during aggressive maneuvers.
