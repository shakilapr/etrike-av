# Kinect v2 Dual-Camera Testing — Modes, UI & Results

Status: TESTED — single camera works; dual blocked by USB bandwidth on current wiring
Date: 2026-08-24
Companion: `problem-dual-kinect-bandwidth.md` (root-cause), `KINECT2_BRINGUP.md`

---

## 1. What was tested

Both Kinect v2 sensors (front `500076343042`, rear `500396543042`) were tested
in every combination of camera × stream mode, plus a Python GUI viewer and a
video/snapshot capture tool.

### Modes

| Mode | Color | Depth | Expected |
|---|---|---|---|
| **full** | ✓ | ✓ | color 1920×1080 + depth 512×424 (CPU ~5 Hz) |
| **rgb** | ✓ | ✗ | color only (CPU ~30 Hz — no depth decode) |

---

## 2. Results per camera (individual)

Each camera works individually. Measured with `ros2 topic hz` (CPU pipeline —
the reliable one; see §4 for the CUDA caveat).

| Camera | Mode | Color FPS | Depth FPS | Streams? |
|---|---|---|---|---|
| Front | full | ~5.0 | ~4.9 | ✓ |
| Front | rgb | **~30.0** | — | ✓ |
| Rear | full | ~5.0 | ~4.9 | ✓ |
| Rear | rgb | **~30.0** | — | ✓ |

**Key finding:** RGB-only mode reaches the full **30 Hz** (CPU) because the depth
decode is skipped; full mode is depth-decode-bound at ~5 Hz on CPU.

---

## 3. Dual-camera (both at once)

| Combination | Mode | Result |
|---|---|---|
| Both | full | ❌ second camera fails `ir interface state` (bandwidth) |
| Both | rgb | ❌ same failure — libfreenect2 always enables IR interface |
| Both | rgb (staggered) | ❌ same |

**Root cause:** both cameras share one `tegra-xusb` root port / hub. The IR
interface alt-setting 1 reserves isochronous bandwidth that one camera consumes;
the second cannot reserve it (`Not enough bandwidth for altsetting 1`,
`errno=28 ENOSPC`). RGB-only does not help because libfreenect2 enables the IR
interface unconditionally in `startStreams()`. See
`problem-dual-kinect-bandwidth.md`.

**Fix:** move one camera to a different root port (e.g. USB-C) so
`lsusb -t` shows the two `02d8` sensors under different top-level branches.

---

## 4. CUDA vs CPU pipeline caveat

- **CPU pipeline**: reliable in both standalone and the ROS node (~5 Hz full,
  ~30 Hz rgb). Use for bring-up/UI.
- **CUDA pipeline**: works standalone and in a freshly-launched node (~30 Hz),
  but after repeated node restarts it can fail to submit transfers
  (`LIBUSB_ERROR_NO_DEVICE`) in the ROS node context. The cause is the device
  wedging after abrupt termination (SIGKILL during active transfers), not the
  pipeline itself. Graceful deactivate (not SIGKILL) avoids it.

---

## 5. Python GUI viewer (`kinect_dual_view.py`)

OpenCV-based (cv2) viewer:

- Subscribes to `/kinect_front/color/image_raw` and `/kinect_rear/color/image_raw`
  (Best-Effort QoS, matching the driver).
- **One camera connected** → single window with the live RGB feed + FPS overlay.
- **Both connected** → side-by-side window with both feeds.
- **None connected** → "No Kinect connected" placeholder.
- Auto-detects connect/disconnect; press `q` to quit.

Usage:

```bash
python3 scripts/kinect_dual_view.py            # start the viewer
# (driver must be running first, e.g. ./run.sh front)
```

**Verified:** with the front camera running (rgb mode, ~30 Hz), the UI opens,
subscribes, and renders the live feed on the Jetson monitor (`DISPLAY=:1`).

> Because two cameras cannot stream simultaneously on the current wiring, the
> UI currently shows one camera. Once the wiring is fixed (separate root
> ports), the same UI shows both without changes.

---

## 6. Video + snapshot capture (`kinect_capture.py`)

Records an MP4 and PNG snapshots from any Kinect topic:

```bash
python3 scripts/kinect_capture.py /kinect_front/color/image_raw front_full_color \
    --seconds 6 --snaps 3
```

Captured (stored locally on the Jetson, not in git):

| File | Camera | Mode | Size |
|---|---|---|---|
| `front_full_color.mp4` | Front | full | 1.3 MB |
| `front_rgb_color.mp4` | Front | rgb | 6.3 MB |
| `rear_full_color.mp4` | Rear | full | 1.4 MB |
| `rear_rgb_color.mp4` | Rear | rgb | 6.0 MB |

Plus 3 PNG snaps per video (in `/tmp/capture/` on the Jetson).

---

## 7. Summary

| Question | Answer |
|---|---|
| Do both cameras work? | ✅ Each works individually (full ~5 Hz, rgb ~30 Hz) |
| Do both work simultaneously? | ❌ Not on current wiring (USB bandwidth on one root port) |
| Is it a driver bug? | No — libfreenect2 + hardware verified; kernel `Not enough bandwidth` |
| RGB-only fix dual? | No — libfreenect2 always reserves the IR interface |
| UI shows one camera? | ✅ Verified live on the monitor |
| UI shows both? | Ready — needs the physical wiring fix (separate root ports) |
