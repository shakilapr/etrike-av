# PandarView2 - Point Cloud Visualization

**Date:** 2026-08-17  
**Status:** Documented (x86_64 only)

---

## Overview

PandarView2 is Hesai's official point cloud visualization and recording software.

| Item | Details |
|------|---------|
| Version | V2.1.7 |
| Platforms | Windows 10/11 (64-bit), Ubuntu 20.04/22.04/24.04 (x86_64 only) |
| Download | https://www.hesaitech.com/downloads/ |
| Manual | PandarView2_User_Manual_PV2-en-250810.pdf |

**⚠️ Cannot run on Jetson (aarch64) — x86_64 binary only.**

---

## Supported LiDAR Models

- XT32M2X ✅ (our model)
- OT128, QT128, AT128, Pandar128, JT16, etc.

---

## Network Settings

| Parameter | Default | Description |
|-----------|---------|-------------|
| Host IP | Any | Your PC's IP address |
| UDP Port | 2368 | LiDAR's destination port for point cloud |
| PTC Port | (optional) | For API access |
| Fault Message Port | (optional) | For fault info |
| Multicast IP | (optional) | For multicast mode |

---

## Key Features

1. **Live view** — Connect via UDP and visualize point cloud in real-time
2. **Record** — Save as .pcap files for offline analysis
3. **Playback** — Load .pcap files and replay
4. **Correction** — Import angle/firetime correction files
5. **Export** — Dump frames to .pcd files

---

## Mouse Shortcuts

| Action | Control |
|--------|---------|
| Rotate | Left-button drag |
| Zoom | Right-button drag or scroll wheel |
| Pan | Press wheel and drag |
| Spin | Shift + left-button drag |

---

## Correction Files (XT32M2X)

Located in `docs/XT32M/`:

- `XT32M2X_Angle_Correction_File-1.csv` — Angle correction
- `XT32M2X_Firetime_Correction_File.csv.csv` — Firetime correction
- `XT32M2X_Model.step` — 3D model

---

## Alternatives for Jetson

Since PandarView2 is x86_64 only, use these on Jetson:

1. **rviz2** — ROS 2 visualization tool (native aarch64)
2. **HesaiLidar_ROS_2.0** — ROS 2 driver with visualization
3. **Run PandarView2 on Windows** — Connect to LiDAR remotely

---

## Installation (Windows)

1. Download from https://www.hesaitech.com/downloads/
2. Extract `PandarView_Release_Win64_V2.1.7.zip`
3. Run `PandarView.exe`

## Installation (Ubuntu x86_64)

1. Download `PandarView2_Release_Ubuntu_V2.1.7.zip`
2. Extract: `unzip PandarView2_Release_Ubuntu_V2.1.7.zip`
3. Run installer: `echo "y" | ./PandarView2_Release_Ubuntu_V2.1.7.bin`
4. Launch: `cd ~/PandarView2 && ./PandarView.sh`

---

*Last updated: 2026-08-17*
