# Kinect v2 Driver Bring-up — Postmortem & Field Notes

Author: E-Trike dev session
Status: WORKING (front camera streaming into RViz on the Jetson monitor)
Date: 2026-08-20

This document records what was done, what failed, what got right, and how the
Kinect v2 driver works *now*. It is meant as a reference for the next person
(usually me, a month later) who has to touch this stack.

---

## 1. TL;DR — current state

The front Kinect v2 streams color + depth through ROS 2 on the Jetson AGX Orin,
and the image is visible in an RViz window on the Jetson's physical monitor
(`DISPLAY=:1`).

```
ros2 launch etrike_kinect2 kinect_view.launch.py camera:=front
```

gives:

- `/kinect_front/color/image_raw`  — `sensor_msgs/Image`, `bgr8`, 1920×1080
- `/kinect_front/depth/image_raw`  — `sensor_msgs/Image`, `32FC1` meters, 512×424
- lifecycle node auto-activates (`active [3]`)
- RViz subscribes to the color stream (Best Effort QoS) and displays it live

Measured frame rate: ~5 Hz. This is a **device/CPU-pipeline limit**, not a
software bug (see §6).

---

## 2. The stack

```
Kinect v2 (Xbox One sensor)         → 045e:02d8 (+ 045e:02d9 adaptor)
    │ USB 3.0 SuperSpeed (tegra-xusb, 10000M)
    ▼
libfreenect2 0.2.0 (CPU pipeline)   → installed in the container at /usr
    ▼
etrike_kinect2 package
    ├── Kinect2Device (no ROS; enumerate / open / start / wait_for_frames)
    ├── Kinect2Node  (rclcpp_lifecycle::LifecycleNode)
    └── frame_converter (libfreenect2 Frame → sensor_msgs/Image)
    ▼
/kinect_front/{color,depth}/image_raw
    ▼
RViz2 (kinect_viewer) on DISPLAY=:1
```

Key facts learned:

- The Kinect v2 is a **USB 3.0-only** device. On the Jetson it must sit on the
  SuperSpeed `tegra-xusb` controller (check `lsusb -t`: `5000M`), not a USB 2
  port.
- libfreenect2 here is built **CPU-only** (`CpuPacketPipeline`) — no CUDA/OpenCL.
  That's why the frame rate is ~5 Hz instead of the nominal 30 Hz.
- Header include path is `#include <libfreenect2/libfreenect2.hpp>` (note the
  `libfreenect2/` prefix, not `freenect2/`).
- The container image `etrike-kinect-build:latest` (see `docker/Dockerfile.kinect`)
  layers libfreenect2 + udev rules on top of the Autoware Humble base.

---

## 3. What we did, in order

### 3.1 Built the driver package from scratch

Wrote `etrike_kinect2` as a ROS 2 **LifecycleNode** driver:

- one node per camera, selected by serial
- `on_configure` loads params, builds placeholder CameraInfo, creates publishers
  — does **not** require the device to be present
- `on_activate` spawns the capture thread
- hotplug-aware: enumerates USB while disconnected, connects on serial match,
  reconnects on replug

### 3.2 Built a derived Docker image with libfreenect2

The stock Autoware image has no libfreenect2. Added `docker/Dockerfile.kinect`,
`docker/make_image.sh`, and made `docker/build.sh` / `docker/shell.sh` /
`run_tests.sh` honor an `IMAGE` env var (default `etrike-kinect-build:latest`).

### 3.3 Verified the hardware in isolation (no ROS)

Wrote standalone C++ tools under `tools/` that talk to the Kinect directly:

- `tools/fn2_open.cpp` — open + start + stop + close
- `tools/fn2_frames.cpp` — open + loop `waitForNewFrame()`, prints
  `GOT=N LOST=M`

These proved the camera, USB, and libfreenect2 all work without any ROS in the
way. **This is the fastest way to isolate "camera problem" from "our code
problem".**

### 3.4 Filled in the serial number

`ros2 run etrike_kinect2 kinect2_node_exec --discover` found the front sensor
serial `500076343042`. Written to `config/kinect_front.yaml`.

### 3.5 Got topics streaming

After fixing the param-file/namespace mismatch (§4.1) and the topic remapping
(§4.4), `/kinect_front/color/image_raw` publishes at ~5 Hz.

### 3.6 Got RViz to actually show the image

After fixing the lifecycle auto-activation (§4.3) and the RViz QoS/config (§4.5),
an RViz window on the Jetson monitor displays the live camera feed.

---

## 4. What failed, and the real root causes

This section is the gold. Each failure below was diagnosed with evidence, not
guessing.

### 4.1 Params silently not loading (serial stayed empty)

**Symptom:** node never opened the camera; `ros2 param get /kinect_front serial`
returned `""` (or the node was unreachable).

**Root cause:** the launch files namespaced the node
(`namespace="kinect_front"` + `PushRosNamespace`), so the node's fully-qualified
name became `/kinect_front/kinect_front`. The param file uses the key
`kinect_front:` — which only matches a node named exactly `/kinect_front`. No
match → no params → serial empty → the driver never even tries to open the USB
device.

**Fix:** run the node at root with `namespace=""` and name it exactly
`kinect_{front,rear}` so the param-file key matches.

**Lesson:** a LifecycleNode *requires* the `namespace` kwarg (it is
keyword-only). And when params "silently don't load", suspect the node FQN vs.
the YAML key first.

### 4.2 Wrong config path in a launch file

**Symptom:** `single_kinect.launch.py` loaded `front.yaml` (missing), never
`kinect_front.yaml`.

**Root cause:** config path was built as `[camera, ".yaml"]` = `front.yaml`
instead of `["kinect_", camera, ".yaml"]`.

**Fix:** correct the path join. (Classic copy-paste.)

### 4.3 Unreliable lifecycle auto-activation (the big one)

**Symptom:** the node intermittently stayed `unconfigured [1]` after launch — no
`configured` log line, no image topics. The *same* launch had worked a minute
earlier. Extremely confusing because the underlying driver was fine.

**Root cause:** the launch used

```python
RegisterEventHandler(OnProcessStart(target_action=node, on_start=[configure]))
```

This is inherently **racy**: the node process can fire `ProcessStarted` before
the launch has registered the handler for that event. If the handler is late,
`configure` is never emitted and the node sits in `unconfigured` forever.

**Fix:** stop depending on `OnProcessStart`. Follow the pattern used by
`slam_toolbox`:

1. register `RegisterEventHandler(OnStateTransition(goal_state="inactive",
   entities=[EmitEvent(ChangeState(ACTIVATE))]))` **first**;
2. add the `LifecycleNode`;
3. then emit `EmitEvent(ChangeState(CONFIGURE))` explicitly.

The event handler exists before the configure event is emitted, so the sequence
`configure → inactive → activate` is deterministic.

**Lesson:** do not wire lifecycle startup to `OnProcessStart`. Emit
`ChangeState(CONFIGURE)` directly and hook `OnStateTransition(inactive)` for the
activate step.

### 4.4 Topics landed at the root instead of under the camera

**Symptom:** topics published as `/color/image_raw`, `/depth/image_raw` — not
`/kinect_front/...`.

**Root cause:** `namespace=""` (needed for the param fix in §4.1) removes the
namespace, so relative topic names `color/image_raw` resolve to `/color/image_raw`.

**Fix:** keep `namespace=""` for the param-key match, and **remap** the topics:

```python
remappings=[
    ("color/image_raw",  "/kinect_front/color/image_raw"),
    ("color/camera_info", "/kinect_front/color/camera_info"),
    ("depth/image_raw",   "/kinect_front/depth/image_raw"),
    ("depth/camera_info", "/kinect_front/depth/camera_info"),
    ("ir/image_raw",      "/kinect_front/ir/image_raw"),
]
```

This gives namespaced-looking topics without touching the node FQN (so the
params still load) — and lets front + rear coexist.

### 4.5 RViz silently showed nothing (QoS + env, two separate bugs)

**Symptom:** RViz process ran fine (OpenGL 4.6, no errors), camera streamed at
5 Hz, but no image ever appeared. And when the launch set an `env={...}` dict,
RViz crashed with `libOgreMain.so` / `AMENT_PREFIX_PATH not set` / logging-dir
errors.

**Root causes (three):**

1. **`env={...}` replaces, not merges.** `Node(..., env={"DISPLAY": ":1"})` in
   `launch_ros` replaces the *whole* process environment, dropping
   `AMENT_PREFIX_PATH`, `LD_LIBRARY_PATH`, and `HOME`. RViz then can't find its
   Ogre libs or rcl logging dir. Fix: use `SetEnvironmentVariable("DISPLAY",
   ":1")` (merges) instead of `Node(env=...)`.
2. **RViz Image topic config used the wrong YAML shape.** The config had
   `Topic: {FilterString: ..., Topic: ...}` — the RViz2 Image display wants
   `Topic: {Value: /kinect_front/color/image_raw, Reliability Policy: Best
   Effort, ...}`.
3. **QoS mismatch.** The driver publishes with `SensorDataQoS`
   (Best Effort / Volatile). If RViz subscribes with default (Reliable), the
   topics are incompatible and RViz receives zero frames even though
   `ros2 topic info` might show the publisher. Setting the RViz topic's
   `Reliability Policy: Best Effort` fixes it.

**Verification that worked:** after the fix,
`ros2 topic info /kinect_front/color/image_raw -v` shows

```
Subscription count: 1
  Node name: kinect_viewer   QoS Reliability: BEST_EFFORT
```

If you ever see `Subscription count: 0` while RViz is running, the RViz topic
name or QoS is wrong, not the camera.

### 4.6 libfreenect2 "failed to set ir interface state" + segfault

**Symptom (once):** `failed to set ir interface state! LIBUSB_ERROR_OTHER`, then
`LIBUSB_ERROR_NO_DEVICE`, then process crashed (exit -11).

**Root cause:** a **previous crashed run had left the USB interfaces claimed** /
the device was in a stale state. A clean reboot of the Jetson + re-plug cleared
it. Not a persistent bug in our code — it never reproduced after the restart.

**Lesson:** if the Kinect errors at the libusb level, reboot the Jetson and/or
replug before assuming your driver is wrong. Also lower libfreenect2's log level
to `Warning` (Info floods the console at frame rate and can starve the capture
thread).

### 4.7 Re-enumerating USB while streaming corrupted the depth stream

**Symptom:** `DepthPacketStreamParser: 30 packets were lost` on a loop, and no
frames published even though the device was open.

**Root cause:** the hotplug discovery called `enumerateDevices()` every
`discover_interval_s` **even while the device was open and streaming**. Building
a fresh `Freenect2` and re-enumerating the live device re-claims its control
interface and corrupts the transfers.

**Fix:** only enumerate USB while the device is **not** open. While streaming,
rely on the frame loop's timeouts to detect an unplug.

---

## 5. What got right (things that worked first time / were good decisions)

- **LifecycleNode + hotplug**: the driver never requires the camera at launch;
  it connects when the serial appears and reconnects on replug. No crash
  waiting for hardware.
- **Standalone tools before ROS**: `tools/fn2_open.cpp` / `tools/fn2_frames.cpp`
  isolated "camera broken" vs "our code broken" instantly. The standalone test
  (30 frames, 0 lost, `OPEN OK / START OK / DONE`) proved hardware + libfreenect2
  were fine and pointed the finger at the ROS wrapping.
- **Separate device wrapper** (`Kinect2Device`): kept libfreenect2 calls out of
  the node so the capture logic is testable and the ROS lifecycle is clean.
- **Derived Docker image**: keeping libfreenect2 + udev rules in
  `etrike-kinect-build:latest` made rebuilds reproducible and survived container
  recreation.
- **Manual lifecycle as a debugging wedge**: before the launch automation was
  fixed, driving `ros2 lifecycle set /kinect_front configure` /
  `activate` manually isolated "launch is racy" from "driver is broken".
- **Topic remapping over namespacing**: solved the param-key vs. topic-name
  conflict without touching node FQNs.
- **USB diagnostics in `/diagnostics`**: `connected`, fps, `timeouts`,
  `connects`, `disconnects` make it easy to see *what the driver thinks* instead
  of guessing.

---

## 6. Frame rate: 5 Hz is expected, not a bug

The Kinect v2 nominally does 30 Hz, but on this Jetson with the **CPU-only**
libfreenect2 pipeline we measure ~5 Hz. Evidence:

- Standalone `fn2_frames` (no ROS at all): 30 frames took ~7.0 s (≈4.3 Hz),
  90 frames took ~19.2 s.
- The ROS node publishes at exactly `5.00x Hz` with tiny jitter
  (`0.197–0.204 s`).

The perfectly even ~200 ms cadence looks like throttling, but it is *not* our
loop — the standalone tool shows the same rate. It is the CPU pipeline running
the 1920×1080 depth decode on a Jetson at this utilization.

If 30 Hz is required later, options (in order of effort):
1. Enable an accelerated pipeline (OpenCL/CUDA build of libfreenect2) — requires
   rebuilding the derived image.
2. Reduce color resolution.
3. Tune CPU clocks / isolate cores for the capture thread.

Do **not** go hunting for a 200 ms sleep in our code — there isn't one in the
streaming path (verified during the investigation).

---

## 7. How it works now (the working recipe)

### One-time prerequisites (already done)

1. Container `autoware_test` runs the derived image
   `etrike-kinect-build:latest` with USB passthrough:
   ```
   -v /dev/bus/usb:/dev/bus/usb
   -e DISPLAY=:1 -v /tmp/.X11-unix:/tmp/.X11-unix:ro
   ```
2. `DISPLAY=:1 xhost +local:` run on the Jetson host (authorizes the container
   to draw on the monitor).
3. `config/kinect_front.yaml` has `serial: "500076343042"`.

### Build

```bash
cd /workspace/autoware
colcon build --symlink-install --packages-select etrike_kinect2
source install/setup.bash
```

### Launch the viewer (camera + RViz on the monitor)

```bash
ros2 launch etrike_kinect2 kinect_view.launch.py camera:=front
```

Expected:

| Check | Command | Result |
|---|---|---|
| lifecycle | `ros2 lifecycle get /kinect_front` | `active [3]` |
| topics | `ros2 topic list \| grep kinect_front` | color + depth + ir topics |
| stream | `ros2 topic hz /kinect_front/color/image_raw` | ~5.0 Hz |
| RViz sub | `ros2 topic info /kinect_front/color/image_raw -v` | `Subscription count: 1`, Best Effort |
| window | look at the Jetson monitor | live color + depth feed |

### Launch the driver only (no RViz)

```bash
ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front
```

### Both cameras

```bash
ros2 launch etrike_kinect2 kinect_view.launch.py camera:=dual
```
(rear requires `config/kinect_rear.yaml` serial filled and the rear sensor
plugged in on a separate USB 3 path.)

---

## 8. Topic / QoS reference

| Topic | Type | QoS (publisher) |
|---|---|---|
| `/kinect_front/color/image_raw` | `sensor_msgs/Image` bgr8 1920×1080 | Best Effort, Keep Last 5, Volatile |
| `/kinect_front/color/camera_info` | `sensor_msgs/CameraInfo` | same |
| `/kinect_front/depth/image_raw` | `sensor_msgs/Image` 32FC1 512×424 (meters) | same |
| `/kinect_front/depth/camera_info` | `sensor_msgs/CameraInfo` | same |
| `/kinect_front/ir/image_raw` | `sensor_msgs/Image` mono8 (if enabled) | same |
| `/diagnostics` | `diagnostic_msgs/DiagnosticArray` | same |

RViz Image displays must subscribe with **Best Effort** to receive these
(see §4.5).

---

## 9. Reference repositories

- libfreenect2: https://github.com/OpenKinect/libfreenect2
- krepa098/kinect2_ros2 (ROS 2 bridge, plain `rclcpp::Node`, the proven reference
  we based our design on): https://github.com/krepa098/kinect2_ros2
  (shallow clone kept at `autoware/src/our_packages/kinect2_ros2_test`)
- Troubleshooting wiki (Jetson, USB3, usbfs memory, IR interface quirks):
  https://github.com/OpenKinect/libfreenect2/wiki/Troubleshooting

## 10. Commits that brought this up

- `8d72dfd` — build on Jetson, auto-activate lifecycle, hotplug idle test (49/0)
- `5f38d13` — persist libfreenect2 in derived image; build/shell/test scripts use it
- `45f20a4` — serial number + launch files for proper node naming/config
- `9bade03` — enumerate only when disconnected; standalone tools; lower lib log level
- `ce627b6` — remap topics under /kinect_<cam>; RViz shows live feed
- `34650a6` — deterministic lifecycle auto-activate; RViz Best-Effort QoS config
