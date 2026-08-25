# Kinect v2 — Project Handover Document

Status: **HANDOVER** — single camera working; dual blocked by USB wiring
Date: 2026-08-24
Author: E-Trike dev session

This is the master handover document for the Kinect v2 camera stack on the
E-Trike. It covers: what we built, the stack, all code/packages/nodes/topics,
what works, what's left to do, and where everything lives.

---

## 1. TL;DR — current state

| Item | Status |
|---|---|
| Front Kinect v2 (serial `500076343042`) | ✅ streams color+depth (~30 Hz CUDA / ~5 Hz CPU full, ~30 Hz CPU RGB) |
| Rear Kinect v2 (serial `500396543042`) | ✅ works individually |
| Both simultaneously | ❌ blocked — USB isochronous bandwidth on shared root port (see §7) |
| Driver package `etrike_kinect2` | ✅ builds, tests pass (151/0) |
| Python GUI viewer | ✅ works, camera switch (front/rear/both) |
| FastAPI web viewer | ✅ works, switch API + MJPEG stream |
| Calibration | ⏳ factory params only; per-unit calibration not done |

---

## 2. The stack

```
Kinect v2 (045e:02d8) + Kinect Adapter (045e:02d9)
   │ USB 3.0 SuperSpeed (tegra-xusb, single controller)
   ▼
libfreenect2 0.2.0  (in container image etrike-kinect-build:latest)
   │ CUDA / CPU depth pipeline (CUDA targets sm_87)
   ▼
etrike_kinect2  (ROS 2 Humble package)
   ├── Kinect2Device  (no ROS: enumerate/open/start/wait_for_frames)  src/kinect2_device.cpp
   ├── Kinect2Node    (rclcpp_lifecycle::LifecycleNode, one per camera) src/kinect2_node.cpp
   ├── frame_converter (libfreenect2 Frame → sensor_msgs/Image)        src/frame_converter.cpp
   └── scripts/       (Python GUI + FastAPI + capture tools)
   ▼
Topics: /kinect_{front,rear}/{color,depth,depth_registered,ir}/image_raw
   ▼
Viewers: kinect_dual_view.py (GUI) · kinect_fastapi.py (web) · rqt_image_view · RViz
```

Container/vehicle setup:
- Jetson AGX Orin, Ubuntu 22.04, kernel 5.15.185-tegra, ROS 2 Humble
- Container `autoware_test` from image `etrike-kinect-build:latest`
  (USB passthrough `-v /dev/bus/usb:/dev/bus/usb`, X11 `DISPLAY=:1`)
- `usbfs_memory_mb=64` (must be re-set after reboot: `sudo sh -c 'echo 64 > /sys/module/usbcore/parameters/usbfs_memory_mb'`)
- X authorization after reboot: `DISPLAY=:1 xhost +local:`

---

## 3. Code inventory

### ROS 2 package: `autoware/src/our_packages/etrike_kinect2/`

| Path | Purpose |
|---|---|
| `src/kinect2_node.cpp` | LifecycleNode: on_configure/activate/deactivate/cleanup, capture thread, hotplug, diagnostics, CameraInfo |
| `src/kinect2_device.cpp` | libfreenect2 wrapper: enumerate, open (pipeline select), startStreams, wait_for_frames, release |
| `src/frame_converter.cpp` | Frame→Image: color (bgr8), depth (32FC1 meters), IR (mono8), registered depth |
| `src/main.cpp` | Entry point + `--discover` mode |
| `include/etrike_kinect2/kinect2_node.hpp` | Node class declaration |
| `include/etrike_kinect2/kinect2_device.hpp` | Device class + FrameSet/DeviceInfo/PipelineType/DepthConfig |
| `include/etrike_kinect2/frame_converter.hpp` | Converter declarations |
| `config/kinect_front.yaml` | Front params (serial `500076343042`) |
| `config/kinect_rear.yaml` | Rear params (serial `500396543042`) |
| `launch/single_kinect.launch.py` | One camera, deterministic lifecycle auto-activate |
| `launch/dual_kinect.launch.py` | Both cameras (no RViz) |
| `launch/kinect_view.launch.py` | Camera + RViz on DISPLAY=:1 |
| `rviz/kinect_view.rviz` | RViz config (Best Effort QoS) |
| `scripts/kinect_dual_view.py` | Python GUI viewer with camera-switch buttons |
| `scripts/kinect_fastapi.py` | FastAPI web viewer + switch API + MJPEG |
| `scripts/kinect_capture.py` | Video (mp4) + PNG snapshot capture |
| `tools/fn2_open.cpp` | Standalone open/start/stop test (no ROS) |
| `tools/fn2_frames.cpp` | Standalone N-frame streaming test |
| `test/test_launch.py` | Launch test (hotplug idle, "waiting for USB") |
| `run.sh` | Convenience: discover/front/rear/dual/view/viewrgb/viewdepth/test |
| `urdf/kinect_v2.xacro` | URDF frames macro |
| `CMakeLists.txt` / `package.xml` | Build / manifest |

### Docker (container image)

| Path | Purpose |
|---|---|
| `docker/Dockerfile.kinect` | Builds libfreenect2 (CUDA sm_87) + rqt-image-view into the Autoware image |
| `docker/make_image.sh` | `docker build` → `etrike-kinect-build:latest` |
| `docker/build.sh`, `shell.sh`, `run_tests.sh` | Use `IMAGE` env (default `etrike-kinect-build:latest`) |

### Reference repos (kept for learning)

| Path | Content |
|---|---|
| `references/libfreenect2/` | Upstream libfreenect2 source |
| `references/iai_kinect2/` | ROS1 driver + calibration + registration |
| `references/kinect2_ros2/` | ROS2 port (CPU-only) |
| `references/kinect_v2_ros2_wrapper/` | Minimal single-node driver |
| `references/pylibfreenect2/` | Python bindings |
| `references/open_ptrack/` | Multi-camera tracking |
| `autoware/src/our_packages/kinect2_ros2_test/` | Submodule clone of kinect2_ros2 |

---

## 4. Nodes and topics

### Nodes (one LifecycleNode per camera, named `kinect_{front,rear}`)

| Node | Config | Param file |
|---|---|---|
| `/kinect_front` | LifecycleNode | `config/kinect_front.yaml` |
| `/kinect_rear` | LifecycleNode | `config/kinect_rear.yaml` |

Viewer/UI nodes:
- `cam_front`, `cam_rear` — Python GUI subscriptions
- `web_cam_front`, `web_cam_rear` — FastAPI subscriptions
- `kinect_capture` — capture tool

### Topics (per camera, remapped to `/kinect_{front,rear}/...`)

| Topic | Type | QoS | Content |
|---|---|---|---|
| `color/image_raw` | `sensor_msgs/Image` | Best Effort | RGB bgr8 1920×1080 |
| `color/camera_info` | `sensor_msgs/CameraInfo` | Best Effort | factory intrinsics |
| `depth/image_raw` | `sensor_msgs/Image` | Best Effort | 32FC1 meters 512×424 |
| `depth/camera_info` | `sensor_msgs/CameraInfo` | Best Effort | factory intrinsics |
| `depth_registered/image_raw` | `sensor_msgs/Image` | Best Effort | color-aligned-to-depth bgr8 |
| `ir/image_raw` | `sensor_msgs/Image` | Best Effort | mono8 (if enabled) |
| `/diagnostics` | `diagnostic_msgs/DiagnosticArray` | Best Effort | fps, connected, timeouts |

### Parameters (per camera)

`serial`, `color_enabled`, `depth_enabled`, `ir_enabled`, `registration_enabled`,
`frame_id_*`, `depth_pipeline` (`auto`/`cpu`/`cuda`/`cudakde`/`opencl`/`opencl_kde`),
`depth_bilateral_filter`, `depth_edge_aware_filter`, `depth_min_m`, `depth_max_m`,
`reconnect_attempts`, `discover_interval_s`, `frame_timeout_ms`, `poll_interval_ms`.

---

## 5. What we did (chronology)

1. **Built the driver package** from scratch (`etrike_kinect2`) as a LifecycleNode
   with hotplug + diagnostics + serial selection.
2. **Derived Docker image** `etrike-kinect-build:latest` with libfreenect2
   (CUDA enabled, sm_87) + udev rules + rqt-image-view.
3. **Fixed the big bugs**:
   - param-file/namespace mismatch (node FQN vs YAML key)
   - lifecycle auto-activation race (`OnProcessStart` → deterministic
     `ChangeState` pattern)
   - topic remapping under `/kinect_<cam>/`
   - RViz QoS (Best Effort) + env handling
   - enumerate-only-when-disconnected (USB re-enumeration corrupted depth)
4. **CUDA acceleration**: rebuilt libfreenect2 for CUDA (fixed `helper_math.h`
   for CUDA 12, targeted sm_87) → depth went ~5 Hz → ~30 Hz.
5. **CameraInfo correctness**: real factory intrinsics + correct dims
   (color 1920×1080, depth 512×424).
6. **Selectable depth pipeline** + applied `setConfiguration` (bilateral/edge
   filters, min/max range).
7. **Python GUI viewer** with camera switch (front/rear/both) + black error
   panels for disconnected cameras.
8. **FastAPI web viewer** with switch API + MJPEG stream + snapshot capture.
9. **Dual-camera diagnostics**: both cameras work individually; identified the
   USB bandwidth limitation for simultaneous use.

---

## 6. What works now (verified)

- Front camera: full mode ~30 Hz (CUDA), RGB-only ~30 Hz (CPU), full CPU ~5 Hz
- Rear camera: same (individually)
- CameraInfo: correct dimensions + factory intrinsics
- Registered depth topic (`depth_registered/image_raw`)
- Python GUI: opens, shows live feed, camera switch via keys 1/2/0 and buttons
- FastAPI: web page, switch API, MJPEG stream, snapshot capture
- Driver launch: deterministic lifecycle auto-activate
- Tests: 151 pass, 0 failures

---

## 7. Known problems / what's left

### P0: Dual-camera simultaneous streaming — BLOCKED

Both cameras work individually but **cannot run at the same time** because they
share one `tegra-xusb` root port / hub. The second camera fails:

```
usb 2-3.3.1: Not enough bandwidth for altsetting 1
[protocol::UsbControl] failed to set ir interface state! LIBUSB_ERROR_OTHER
```

**Fix (physical):** move one Kinect to a **different root port** (e.g. the
USB-C port) so `lsusb -t` shows the two `02d8` sensors under different
top-level branches of Bus 02. Then both should stream at ~30 Hz.
See `problem-dual-kinect-bandwidth.md`.

### P1: Device wedges after abrupt termination

`pkill -9` during active transfers leaves the Kinect in a bad state
(`LIBUSB_ERROR_NO_DEVICE`) until a USB reset or reboot. Use graceful deactivate,
or reset via `echo 0 > /sys/bus/usb/devices/<path>/authorized` then `1`.

### P2: Per-unit calibration (accuracy)

The reference `iai_kinect2` has calibration (color/IR intrinsics, stereo pose,
depth shift ~13-24 mm). Not yet applied. This is the largest remaining
accuracy improvement.

### P3: CUDA pipeline in ROS node can be flaky after repeated restarts

CUDA works standalone and in a fresh node (~30 Hz) but can fail with
`LIBUSB_ERROR_NO_DEVICE` after many open/close cycles in the node context.
CPU pipeline is the reliable fallback (~5 Hz full, ~30 Hz RGB).

### P4: Cosmetics / hardening

- `depth_registered/image_raw` is mislabeled (it's color-on-depth, not
  depth-on-RGB) — rename or document before consumers depend on it.
- `depth_min_m`/`depth_max_m` are now applied via `setConfiguration`; verify.
- `frame->status` validation not done (reference bridge checks it).
- FastAPI + rqt-image-view + xdotool installed ad-hoc in the container — add to
  `docker/Dockerfile.kinect` for persistence.

---

## 8. How to run

```bash
# Build
cd /workspace/autoware
source /opt/ros/humble/setup.bash
colcon build --symlink-install --packages-select etrike_kinect2
source install/setup.bash

# Discover serials
ros2 run etrike_kinect2 kinect2_node_exec --discover

# Launch one camera (front or rear)
ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front

# Python GUI (on Jetson monitor)
python3 scripts/kinect_dual_view.py        # 1/2/0 switch, q quit

# FastAPI web viewer
python3 scripts/kinect_fastapi.py --port 8000
# browser → http://<jetson-ip>:8000/

# Capture video + snaps
python3 scripts/kinect_capture.py /kinect_front/color/image_raw out --seconds 6 --snaps 3

# Tests
colcon test --packages-select etrike_kinect2
```

---

## 9. Docs index

| Document | Path | Content |
|---|---|---|
| **This handover** | `docs/sensors/kinect2/HANDOVER.md` | master summary |
| Bring-up postmortem | `docs/sensors/kinect2/KINECT2_BRINGUP.md` | what failed + fixes |
| Linux integration report | `docs/sensors/kinect2/KINECT2_LINUX_INTEGRATION.md` | full stack analysis |
| Dual-camera bandwidth problem | `docs/sensors/kinect2/problem-dual-kinect-bandwidth.md` | root cause + fix |
| Dual-camera test report | `docs/sensors/kinect2/dual-camera-test-report.md` | modes + UI + results |
| Depth analysis | `docs/sensors/kinect2/reports/depth-analysis.md` (+ .typ/.pdf) | pipeline benchmark |
| Bandwidth report | `docs/sensors/kinect2/reports/dual-kinect-bandwidth.pdf` | PDF version |
| Package README | `autoware/src/our_packages/etrike_kinect2/README.md` | usage |

---

## 10. Key commits

- `b917200` CUDA depth pipeline + Dockerfile
- `cb7acf0` factory CameraInfo, registration, per-stream start, steady-clock
- `9f6de00` selectable depth pipeline + setConfiguration
- `a555ba2` Python GUI + capture tool
- `abb938c` camera-switch button + FastAPI viewer
- `8d84f99` FastAPI + GUI black error panels, robust switch
