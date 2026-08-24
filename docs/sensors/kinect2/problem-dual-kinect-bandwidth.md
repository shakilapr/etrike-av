# Problem: Two Kinect v2 Cannot Stream Simultaneously on One Jetson AGX Orin

Status: OPEN — needs a physical USB re-wiring
Date: 2026-08-24

---

## 1. The symptom

Each Kinect v2 works **individually** at ~30 Hz (CUDA) / ~5 Hz (CPU). But when
both are active at the same time, exactly **one** of them streams and the
**other** fails to start and crashes:

- Front-only: front streams, rear never connects.
- Rear-only: rear streams, front fails.
- Both launched: the camera that starts *second* always fails.

The failing node prints:

```
[protocol::UsbControl] failed to set ir interface state! LIBUSB_ERROR_OTHER Other error.
[kinect_front]: opened serial=500076343042 but failed to start streaming
[kinect2_node_exec]: process has died [pid ..., exit code -11, ...]
```

and the kernel logs:

```
usb 2-3.3.1: Not enough bandwidth for new device state.
usb 2-3.3.1: Not enough bandwidth for altsetting 1
```

The underlying libusb error is:

```
libusb: error [op_set_interface] set interface failed, errno=28
```

(`errno=28` = `ENOSPC` — the USB controller refused the isochronous interface
configuration.)

---

## 2. What "Not enough bandwidth for altsetting 1" means

The Kinect v2 IR interface (`:1.1`) has two alternate settings:

- **alt setting 0** — no isochronous endpoints (control only)
- **alt setting 1** — enables the isochronous endpoint (endpoint `0x84`,
  `wMaxPacketSize=0x400`, `bInterval=1`) that carries the raw IR/depth stream

`startStreams()` calls `libusb_set_interface_alt_setting(handle, 1, 1)` to
switch on the isochronous stream. On Linux, the xHCI driver must **reserve
isochronous bandwidth** on the controller for that endpoint. When the budget is
already consumed, the kernel returns `ENOSPC` and the alt-setting switch fails →
libfreenect2 reports `LIBUSB_ERROR_OTHER` on `setIrInterfaceState`.

This is a real USB bandwidth reservation failure — not a ROS bug, not a
libfreenect2 bug, not a CUDA issue (reproduced with CPU pipeline too).

---

## 3. The USB topology on our Jetson (the root cause)

```
tegra-xusb controller (Bus 02, SuperSpeed 10000M)
  └── usb2-port3 (root port 3)
       └── 4-port hub (2-3)
            ├── Port 2 ── hub/1p ── Kinect v2 #2 (2-3.2.1, serial 500396543042, REAR)
            └── Port 3 ── hub/1p ── Kinect v2 #1 (2-3.3.1, serial 500076343042, FRONT)
```

- Both Kinects are behind the **same 4-port USB hub** on the **same root port 3**.
- A single hub's upstream link / the xHCI's per-root-port isochronous budget
  cannot hold two full Kinect v2 streams (~180 MB/s each: color 1920×1080@30 +
  IR/depth 512×424@30).
- The **first** camera to start consumes the budget; the **second** cannot
  reserve its IR interface → fails with `ENOSPC` and segfaults (a libfreenect2
  cleanup bug on the failed start).

---

## 4. What we already verified (evidence)

| Test | Result |
|---|---|
| Front alone (CUDA) | ✅ ~30 Hz |
| Rear alone (CUDA) | ✅ ~30 Hz |
| Front alone (CPU) | ✅ ~5 Hz |
| Rear alone (CPU) | ✅ ~6 Hz |
| Both, CUDA | ❌ one fails `ir interface state` (ENOSPC) + segfault |
| Both, CPU | ❌ same failure (not CUDA-related) |
| Both, staggered start | ❌ same failure |
| Both, single libfreenect2 context/process | ❌ same failure on the first `start()` |
| `usbfs_memory_mb` 16 → 64 | fixed earlier `LIBUSB_ERROR_NO_MEM`; did NOT fix bandwidth |
| Transfer-pool tuning (`LIBFREENECT2_IR_PACKETS` etc.) | ❌ did not fix |
| After the failed start | the whole USB bus can wedge → needs a Jetson reboot |

Also: even in a single `Freenect2` context opening both devices succeeds, but
`start()` on the first device already fails — proving the bandwidth reservation
is the hard constraint, not enumeration or multi-process handling.

---

## 5. Why the hardware supports it, and what to do

The AGX Orin's `tegra-xusb` has **4 SuperSpeed root ports** (`usb2-port1` through
`usb2-port4`). The hardware is capable of two Kinects — but each needs its own
root port so the xHCI controller can allocate independent isochronous bandwidth.

**The fix is physical:** move one Kinect to a different USB3 connector that
routes to a *different root port* than the shared 4-port hub. On the AGX Orin
developer kit that is typically the **USB-C port** (separate root port) or a
USB-A port that is not behind the same hub.

**Success criterion:** after re-wiring, `lsusb -t` must show the two `02d8`
sensors under **different top-level branches** of Bus 02, e.g.:

```
Bus 02 Port 1: tegra-xusb/4p
   ├── Port 1: ...  Kinect v2 A (direct root port)
   └── Port 3: ...  4-port hub
                      └── Port 2: ... Kinect v2 B
```

NOT both under the same `hub/4p`.

---

## 6. Reference

This matches libfreenect2's documented multi-Kinect requirement: separate USB
3.0 host controllers (or here, separate root ports), because each Kinect v2
uses ~1/3 of a SuperSpeed controller's isochronous budget and two exceed a
single hub/root-port budget.

Issues with the identical error:
- OpenKinect/libfreenect2 #971, #615, #500, #97 — "Not enough bandwidth"
