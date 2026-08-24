# Kinect v2 on Linux — E-Trike Full Report

Status: **LIVE** — front Kinect streaming at ~30 Hz (CUDA) into the Jetson monitor.
Companion: `KINECT2_BRINGUP.md` (bring-up postmortem), `etrike_kinect2/README.md` (usage).

---

## 1. Executive summary

The E-Trike runs **2× Kinect for Windows v2** on a Jetson AGX Orin (ROS 2 Humble/Autoware).
Two packages exist:

| Package | Role | Status |
|---|---|---|
| `etrike_kinect2` | **Production** driver. `LifecycleNode` per camera, `libfreenect2` backend, serial-based selection, hotplug, CUDA depth pipeline. | **Working** — front streams color+depth+registered at ~30 Hz |
| `kinect2_ros2_test` | Shallow clone of `krepa098/kinect2_ros2` (a ROS2 port of Univ. Bremen's ROS1 `iai_kinect2`) for bring-up/smoke reference. | Reference only, not production |

The sensor is a *"made for Windows"* device (Microsoft ships only a Windows SDK).
It works on Linux purely because **`libfreenect2` reverse-engineered the proprietary
USB protocol** and drives it from user-space via `libusb` — no kernel driver, no
Microsoft code. The ROS2 reference bridge is Linux-native C++; only the *hardware*
was ever Windows-only (see §3).

**Current state (verified):**

```
/kinect_front/color/image_raw          sensor_msgs/Image  bgr8  1920×1080  ~29.3 Hz
/kinect_front/depth/image_raw          sensor_msgs/Image  32FC1 512×424   ~29.3 Hz  (meters)
/kinect_front/depth_registered/image_raw sensor_msgs/Image bgr8 512×424   ~30 Hz    (color-on-depth)
lifecycle: active [3]   (auto-activated deterministically)
viewer:    rqt_image_view (aspect-correct) on DISPLAY=:1
```

---

## 2. The stack

```
Kinect v2  (045e:02d8) + Kinect Adapter (045e:02d9)   ← "Kinect for Windows v2"
   │ USB 3.0 SuperSpeed (tegra-xusb, 5000M/10000M)
   ▼
libfreenect2 0.2.0   (user-space, libusb, CUDA depth pipeline, TurboJPEG color)
   │  /usr  (pkg-config module "freenect2")
   ▼
etrike_kinect2
   ├─ Kinect2Device  (no ROS: enumerate → open → start → wait_for_frames)  src/kinect2_device.cpp
   ├─ Kinect2Node    (rclcpp_lifecycle::LifecycleNode, one per camera)     src/kinect2_node.cpp
   └─ frame_converter (libfreenect2 Frame → sensor_msgs/Image)             src/frame_converter.cpp
   ▼
/kinect_{front,rear}/{color,depth,depth_registered}/image_raw + camera_info
   ▼
rqt_image_view (aspect-correct) / RViz2 on Jetson monitor (DISPLAY=:1)
```

Build/bootstrapping:
- `docker/Dockerfile.kinect` layers libfreenect2 **built from source with CUDA ON**
  (`-DENABLE_CUDA=ON`, targeting `sm_87` for Orin) on the Autoware Humble base.
  It also installs `ros-humble-rqt-image-view` (aspect-correct preview).
- udev rule `90-kinect2.rules` → `/etc/udev/rules.d/` (VID 045e, PIDs 02c4/02d8/02d9, MODE 0666).
- `usbfs_memory_mb=64` recommended for two Kinects.
- Container passes through `/dev/bus/usb`, `DISPLAY=:1`, `/tmp/.X11-unix`.

---

## 3. Why it works despite being "made for Windows"

1. **The sensor is just a USB 3.0 device** (VID/PID `045e:02d8` + `045e:02d9` adapter).
   "Kinect for Windows v2" was Microsoft's PC-dev kit branding; the only Windows
   thing about it was Microsoft's proprietary KinectSDK 2.0.
2. **libfreenect2 reverse-engineered the vendor protocol.** It drives the device
   entirely from user-space over `libusb`/usbfs — the Linux kernel needs no driver
   beyond the generic `usb` + `usbcore` modules. This is the single reason Linux
   integration is possible at all. (Windows, by contrast, used Microsoft's kernel
   driver + SDK.)
3. **The device needs its "Kinect Adapter"** (02d9) that breaks out the proprietary
   8-pin connector to USB 3 + external 12 V power, and on some variants handles the
   firmware/Xbox handshake. That's why the Jetson needs a powered path and
   `-v /dev/bus/usb:/dev/bus/usb`.
4. **The reference ROS2 code is not Windows code.** `kinect2_ros2_test` is Univ.
   Bremen's `iai_kinect2` (Linux ROS1) ported by krepa098 to ROS2. Its only platform
   ifdefs are thread naming (`__linux__`/`__APPLE__`). Nothing Windows.
5. **The Jetson-specific work** (the hard part): build libfreenect2 from source for
   aarch64, patch `helper_math.h` for CUDA 12, target `sm_87`, install udev rules,
   raise `usbfs_memory_mb`. Without those the CUDA depth pipeline won't build/run
   (see §5.1).

---

## 4. How the production driver works (code walkthrough)

### 4.1 Device layer — `kinect2_device.cpp`

- `enumerateDevices()` builds a fresh `Freenect2`, iterates, returns serials
  (used by `main.cpp --discover` and the hotplug discovery loop).
- `open(serial, color, depth, ir)`:
  - picks **CUDA pipeline first** (`CudaPacketPipeline`) when
    `LIBFREENECT2_WITH_CUDA_SUPPORT` is defined, falls back to `CpuPacketPipeline`
    on exception;
  - `openDevice(serial, pipeline)`;
  - builds `libfreenect2::Registration` from factory `getIrCameraParams()` /
    `getColorCameraParams()`;
  - **two separate listeners** (design inherited from `kinect2_bridge`):
    `listener_color_` (Frame::Color) and `listener_irdepth_` (Frame::Ir|Depth).
    This lets RGB and IR+depth return at their own cadence instead of forcing
    3-way synchronization.
- `start()` calls `device_->startStreams(enable_color_, enable_depth_)` — disabled
  streams are never acquired, saving USB bandwidth on dual-camera. IR rides the
  depth interface, so `ir_enabled` only gates publishing.
- `wait_for_frames()`: pulls a depth+IR pair, then a color frame; if color times
  out after depth arrived, it releases the depth pair so the caller's release path
  stays consistent.
- `release_frames()` returns frames to the correct listener.

### 4.2 Node layer — `kinect2_node.cpp`

- `LifecycleNode`: `on_configure` creates publishers and builds placeholder
  CameraInfo (**does not require hardware**); `on_activate` spawns `capture_loop`.
- `capture_loop()`:
  - **hotplug discovery only while the device is closed** — deliberately avoids
    `enumerateDevices()` while streaming because re-enumerating a live Kinect
    re-claims its control interface and corrupts the depth transfer (hit and fixed
    during bring-up, §4.7 of the bring-up doc);
  - streaming path blocks on `wait_for_frames(timeout_ms)` (event-driven, ~30 Hz
    with CUDA);
  - `timeouts_` counter → after `reconnect_attempts_` (3) treats the device as
    gone, disconnects, reconnects on replug;
  - 1 Hz `/diagnostics` (serial, connected, fps, drops, timeouts, connects/
    disconnects) published **even while disconnected** — never crashes waiting for
    hardware.
- `build_camera_info()` fills `sensor_msgs/CameraInfo` with **factory intrinsics**
  after `open()` succeeds; depth `d` carries the IR distortion vector
  `{k1,k2,p1,p2,k3}`. Dimensions match the streams (color 1920×1080, depth
  512×424) — this was a correctness bug that got fixed (was 1920×1080 for depth).

### 4.3 Frame conversion — `frame_converter.cpp`

- color: `BGRA→BGR`, published `bgr8` 1920×1080.
- depth: `CV_32FC1` raw (`frame.data`, float **mm**) → `/1000.0` → published
  `32FC1` **meters** — exactly what Autoware's `depth_image_proc` expects.
- IR: min-max normalized to `mono8` for viewing.
- registered: `Registration::apply(rgb, depth, undistorted, registered)` then
  `BGRA→BGR`. **Note:** this is registered *color* warped onto the *depth* grid
  (BGR8, 512×424), not depth warped onto RGB — see §5.10.

### 4.4 Launch — deterministic lifecycle

`single_kinect.launch.py` uses the **slam_toolbox pattern** that bring-up proved
reliable:
1. register `OnStateTransition(goal_state="inactive" → emit ACTIVATE)` **first**;
2. add the `LifecycleNode`;
3. explicitly emit `CONFIGURE` (no racy `OnProcessStart`).

Node runs at `namespace=""` named exactly `kinect_{front,rear}` so the YAML key
`kinect_front:` matches; topics are **remapped** to `/kinect_front/...` so the
param key and namespaced-looking topics both work.

---

## 5. Depth camera issues we face

### 5.1 CUDA pipeline build/runtime (the big one — now solved)

- Stock libfreenect2 builds the CUDA kernels for `sm_52` (hardcoded 2015-era
  default). On CUDA 12.8 the embedded PTX fails at runtime:
  `cudaGetLastError(): the provided PTX was compiled with an unsupported toolchain`
  → `DepthPacketStreamParser: Packet buffer is NULL`, zero frames.
- **Fix:** rebuild libfreenect2 in the Docker image with
  `-DCUDA_NVCC_FLAGS="-gencode arch=compute_87,code=sm_87 -gencode arch=compute_87,code=compute_87"`.
  Also fetch `helper_math.h` from NVIDIA cuda-samples (CUDA 12 removed it from the
  toolkit, but libfreenect2's `.cu` still `#include`s it).
- **Result:** ~5 Hz (CPU) → **~30 Hz** (CUDA) on color + depth + registered.

### 5.2 Frame rate was 5 Hz (CPU pipeline)

`CpuPacketPipeline` decodes 1920×1080 depth on the Orin's CPU → ~4.3–5 Hz
(standalone `fn2_frames` measured the same; it was never our loop). Now mitigated
by the CUDA pipeline (§5.1).

### 5.3 Sunlight blinds the ToF depth sensor

IR Time-of-Flight is destroyed by direct sun → outdoor depth unusable. VSLAM
fusion was rejected for this reason (`docs/mapping/issues/mapping_without_imu.md`).

### 5.4 Short depth range

0.5–4.5 m nominal. Kinect v2 is a short-range indoor sensor.

### 5.5 RGB motion blur

A vibrating three-wheeler blurs 1920×1080 RGB → monocular VO is fragile.

### 5.6 USB bandwidth / packet drops on tegra-xusb

`DepthPacketStreamParser: 30 packets were lost` is the classic Jetson symptom
(isochronous depth stream). Fix USB path / kernel / `usbfs_memory_mb`, not the
driver. The standalone `tools/fn2_frames.cpp` documents this.

### 5.7 Two Kinects need separate SuperSpeed paths

Both on one hub fails. Front on onboard USB-A, rear on USB-C J39/J40 (separate
path via adapter). Verify distinct 5000M branches with `lsusb -t`.

### 5.8 Stale USB state after a crash

`failed to set ir interface state! LIBUSB_ERROR_OTHER` then segfault (exit -11).
Root cause: a previous run left the interface claimed. Fix: reboot + replug.
(Observed once, never reproduced after a clean restart.)

### 5.9 Depth accuracy — per-unit calibration

The `iai_kinect2` lineage found a **static depth offset ~24 mm** and per-sensor
intrinsic variation (shipped `calib_depth.yaml` has `depthShift: -13.35`). Factory
params from `getIrCameraParams()` are good but not as good as a full per-unit
calibration (color/IR intrinsics, stereo pose, depth shift). The reference
repos ship `data/<serial>/calib_*.yaml` sets (serials `196605135147`,
`299150235147`) we could adopt.

### 5.10 `depth_registered/image_raw` is mislabeled

`to_registered_depth_image()` runs `Registration::apply` and publishes
**color-aligned-to-the-depth-grid** (BGR8, 512×424) — i.e. registered *color*,
not registered *depth*. In ROS convention `depth_registered/image_raw` normally
means depth warped onto the RGB camera. The README calls it "Color-aligned depth".
Either rename to `color_aligned_to_depth` or implement true depth→RGB registration
(the CPU path in `kinect2_registration` does this via inverse projection + z-buffer).

### 5.11 Depth filters / range params declared but never applied

`device_->setConfiguration()` (bilateral/edge-aware filters, MinDepth/MaxDepth) is
never called. `depth_min_m`/`depth_max_m` are documented in the README but not even
declared in the node; `reconnect_delay_s` is declared/read but unused (dead param).

### 5.12 No `frame->status` validation

`kinect2_bridge.cpp` checks `irFrame->status != 0 || depthFrame->status != 0` and
kills itself on a bad depth packet. `etrike_kinect2` ignores `frame->status` — a
corrupt depth frame would be published silently instead of triggering a reconnect.

### 5.13 Registration runs on CPU every frame

`registration_enabled: true` → `Registration::apply` at 512×424 per frame in the
capture thread (on top of raw color conversion). Real per-frame work; minor when
the CUDA pipeline is active.

### 5.14 Color distortion is dropped

`build_camera_info` writes zero distortion for color (only IR gets the `{k1,k2,p1,p2,k3}`
vector), even though factory `fx/fy/cx/cy` are used. Fine for consumers that don't
undistort color, but a full `iai_kinect2` calibration would fix the rectified stream.

---

## 6. What the reference repos taught us / how they differ

Reference clones live in `references/` (and `autoware/src/our_packages/kinect2_ros2_test`):

| Repo | Role | Key architecture |
|---|---|---|
| **libfreenect2** | Core driver | Reverse-engineered USB protocol; libusb; per-pipeline depth decode (CPU/OpenCL/OpenGL/CUDA/KDE); `start()` = both, `startStreams(rgb,depth)`; polynomial factory `Registration`; USB resets + retries in `openDevice`; multi-Kinect via serial |
| **iai_kinect2** (ROS1) | Full driver suite | `kinect2_bridge` + `kinect2_registration` (CPU/OpenCL) + `kinect2_calibration` + viewer; subscription-gated `startStreams`; worker-thread pool; 3 resolutions (HD/QHD/SD); JPEG/TIFF compressed pairs; per-sensor `data/<serial>/calib_*.yaml`; `depth_image_proc` point clouds in launch |
| **kinect2_ros2** (krepa098) | ROS2 port of iai | Same as iai but **CPU-only** build (all GPU paths compiled out); wall-timer instead of subscriber-status callbacks; qhd point-cloud node |
| **kinect_v2_ros2_wrapper** | Minimal single-node | One `SyncMultiFrameListener`; always `start()`; no serial param; registration via factory params; CameraInfo as ROS params |
| **pylibfreenect2** | Python bindings | Cython 1:1 API wrap; shows the canonical usage (create registration after `start()`) |
| **open_ptrack** | Multi-camera tracking | Consumer; per-sensor `id`+`serial`, namespaced bridge instances; `kinect2_bridge_ir.launch` fork for `/depth_ir/points`; kernel/USB notes |

**What `etrike_kinect2` kept (the robust parts):**
- two-listener design (RGB and IR+depth decoupled);
- separate processes per camera (one crash doesn't kill both);
- serial selection + hotplug;
- lifecycle + diagnostics + never-crashes-on-absent-hardware;
- CUDA pipeline (better than the reference's CPU-only ROS2 port).

**What it dropped (vs iai/kinect2_ros2):**
- compressed topics, QHD/HD downsampling;
- worker-thread pool (single capture thread is enough at 30 Hz);
- calibration-file loading (`data/<serial>/*.yaml`) — factory params only;
- subscription-gated streaming (always streams while active);
- TF publishing (URDF owns TF);
- PointCloud2 (delegated to `depth_image_proc`);
- `frame->status` validation (should be added back).

**Gaps worth reclaiming from the reference:**
1. `data/<serial>/` calibration loading (fixes §5.9 and §5.14, improves depth↔RGB alignment).
2. `frame->status` checks (fixes §5.12).
3. `setConfiguration` for depth filters/range (fixes §5.11).

---

## 7. Calibration (reference format)

`kinect2_bridge/data/<serial>/` contains OpenCV `FileStorage` YAML files:
- `calib_color.yaml` → `cameraMatrix` (3×3), `distortionCoefficients` (1×5),
  `rotation`, `projection`.
- `calib_ir.yaml` → same, at 512×424 scale (fx≈366.9, fy≈364.8, cx≈243.0, cy≈207.7).
- `calib_pose.yaml` → `rotation`, `translation`, `essential`, `fundamental`
  (IR→RGB stereo extrinsics).
- `calib_depth.yaml` → single `depthShift` scalar (mm static offset, e.g. -13.35).

The calibration tool (`kinect2_calibration`) records color/IR/sync with a
checkerboard, calibrates intrinsics, does `stereoCalibrate` (fixing intrinsics),
then solves `solvePnPRansac` for the depth offset.

---

## 8. Recommended next steps

1. ~~Enable CUDA pipeline + measure~~ — **done** (~30 Hz verified, commit `b917200`).
2. Run a per-unit calibration (or copy the two shipped `data/<serial>/` sets) and
   wire `calib_*` loading into `etrike_kinect2` for depth shift + accurate stereo
   extrinsics (§5.9, §5.14).
3. Apply `setConfiguration` (bilateral/edge-aware filters, MinDepth/MaxDepth) and
   implement or remove dead `depth_min_m`/`depth_max_m`/`reconnect_delay_s` (§5.11).
4. Add `frame->status` checks in `wait_for_frames` (mirror bridge) and trigger the
   reconnect path on a bad packet (§5.12).
5. Fix the `depth_registered` semantics (rename to color-aligned, or implement true
   registered depth) before any consumer depends on it (§5.10).
6. Decide `kinect2_ros2_test`'s fate — dirty shallow clone marked "not production".
   Keep as calibration/reference source, or remove and keep only the calibration data.
7. Rebuild the derived image so the `rqt-image-view` install (currently added to the
   Dockerfile) and any calibration changes are baked in; re-run
   `docker/make_image.sh`.

---

## 9. References

- libfreenect2: https://github.com/OpenKinect/libfreenect2
  (local clone `references/libfreenect2`; troubleshooting wiki covers Jetson/USB3/usbfs/IR quirks)
- krepa098/kinect2_ros2: https://github.com/krepa098/kinect2_ros2
  (local clones `references/kinect2_ros2` + `autoware/src/our_packages/kinect2_ros2_test`)
- code-iai/iai_kinect2: https://github.com/code-iai/iai_kinect2 (local `references/iai_kinect2`)
- kinect_v2_ros2_wrapper: local `references/kinect_v2_ros2_wrapper`
- pylibfreenect2: local `references/pylibfreenect2`
- open_ptrack: local `references/open_ptrack`
