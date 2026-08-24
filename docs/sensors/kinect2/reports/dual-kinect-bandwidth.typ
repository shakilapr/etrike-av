#set page(paper: "a4", margin: (x: 2.5cm, y: 2.2cm))
#set text(font: "DejaVu Sans", size: 11pt)
#set par(justify: true, leading: 0.7em)
#set heading(numbering: "1.1")
#show heading.where(level: 1): it => [
  #block(above: 1.4em, below: 0.6em)[
    #set text(size: 17pt, weight: "bold")
    #it.body
  ]
]
#show heading.where(level: 2): it => [
  #block(above: 1.1em, below: 0.4em)[
    #set text(size: 14pt, weight: "bold")
    #it.body
  ]
]
#set table(inset: 5pt, stroke: 0.6pt)
#show table: set text(size: 9pt)
#show link: set text(fill: rgb("#1a5fb4"))

#align(center)[
  #text(size: 19pt, weight: "bold")[Two Kinect v2 Cannot Stream Simultaneously]
  #v(2pt)
  #text(size: 11pt, style: "italic")[USB isochronous bandwidth problem — E-Trike]
  #v(4pt)
  #text(size: 9pt, fill: rgb("#777"))[2026-08-24 · Jetson AGX Orin · ROS 2 Humble · libfreenect2 0.2.0]
]
#v(10pt)
#line(length: 100%, stroke: 1pt)
#v(10pt)

= The Symptom

Each Kinect v2 works #text(weight: "bold")[individually] at ~30 Hz (CUDA) / ~5 Hz (CPU). But when both are active at the same time, exactly #text(weight: "bold")[one] of them streams and the #text(weight: "bold")[other] fails to start and crashes:

- Front-only: front streams, rear never connects.
- Rear-only: rear streams, front fails.
- Both launched: the camera that starts *second* always fails.

The failing node prints:

```text
[protocol::UsbControl] failed to set ir interface state! LIBUSB_ERROR_OTHER Other error.
[kinect_front]: opened serial=500076343042 but failed to start streaming
[kinect2_node_exec]: process has died [pid ..., exit code -11, ...]
```

and the kernel logs:

```text
usb 2-3.3.1: Not enough bandwidth for new device state.
usb 2-3.3.1: Not enough bandwidth for altsetting 1
```

The underlying libusb error is:

#raw("libusb: error [op_set_interface] set interface failed, errno=28")

#text(weight: "bold")[errno=28 = ENOSPC] — the USB controller refused the isochronous interface configuration.

= What "Not enough bandwidth for altsetting 1" Means

The Kinect v2 IR interface (#raw(":1.1")) has two alternate settings:

- #text(weight: "bold")[alt setting 0] — no isochronous endpoints (control only)
- #text(weight: "bold")[alt setting 1] — enables the isochronous endpoint (endpoint #raw("0x84"), #raw("wMaxPacketSize=0x400"), #raw("bInterval=1")) that carries the raw IR/depth stream

#raw("startStreams()") calls #raw("libusb_set_interface_alt_setting(handle, 1, 1)") to switch on the isochronous stream. On Linux, the xHCI driver must #text(weight: "bold")[reserve isochronous bandwidth] on the controller for that endpoint. When the budget is already consumed, the kernel returns #raw("ENOSPC") and the alt-setting switch fails — so libfreenect2 reports #raw("LIBUSB_ERROR_OTHER") on #raw("setIrInterfaceState").

This is a real USB bandwidth reservation failure — #text(weight: "bold")[not a ROS bug, not a libfreenect2 bug, not a CUDA issue] (reproduced with the CPU pipeline too).

= The USB Topology on Our Jetson (Root Cause)

#block(fill: rgb("#eef4fb"), inset: 8pt, radius: 4pt)[
```text
tegra-xusb controller (Bus 02, SuperSpeed 10000M)
  └── usb2-port3 (root port 3)
       └── 4-port hub (2-3)
            ├── Port 2 ── hub/1p ── Kinect v2 #2 (2-3.2.1, serial 500396543042, REAR)
            └── Port 3 ── hub/1p ── Kinect v2 #1 (2-3.3.1, serial 500076343042, FRONT)
```
]

- Both Kinects are behind the #text(weight: "bold")[same 4-port USB hub] on the #text(weight: "bold")[same root port 3].
- A single hub's upstream link / the xHCI's per-root-port isochronous budget cannot hold two full Kinect v2 streams (~180 MB/s each: color 1920×1080\@30 + IR/depth 512×424\@30).
- The #text(weight: "bold")[first] camera to start consumes the budget; the #text(weight: "bold")[second] cannot reserve its IR interface → fails with #raw("ENOSPC") and segfaults (a libfreenect2 cleanup bug on the failed start).

= Evidence

#table(
  columns: 2,
  stroke: 0.6pt,
  table.header([*Test*], [*Result*]),
  [Front alone (CUDA)], [✅ ~30 Hz],
  [Rear alone (CUDA)], [✅ ~30 Hz],
  [Front alone (CPU)], [✅ ~5 Hz],
  [Rear alone (CPU)], [✅ ~6 Hz],
  [Both, CUDA], [❌ one fails #raw("ir interface state") (ENOSPC) + segfault],
  [Both, CPU], [❌ same failure (not CUDA-related)],
  [Both, staggered start], [❌ same failure],
  [Both, single libfreenect2 context/process], [❌ same failure on the first #raw("start()")],
  [#raw("usbfs_memory_mb") 16 → 64], [fixed earlier #raw("LIBUSB_ERROR_NO_MEM"); did NOT fix bandwidth],
  [Transfer-pool tuning], [❌ did not fix],
  [After the failed start], [the whole USB bus can wedge → needs a Jetson reboot],
)

Also: even in a single #raw("Freenect2") context opening both devices succeeds, but #raw("start()") on the first device already fails — proving the bandwidth reservation is the hard constraint, not enumeration or multi-process handling.

= Why the Hardware Supports It, and What to Do

The AGX Orin's #raw("tegra-xusb") has #text(weight: "bold")[4 SuperSpeed root ports] (#raw("usb2-port1") through #raw("usb2-port4")). The hardware is capable of two Kinects — but each needs its own root port so the xHCI controller can allocate independent isochronous bandwidth.

#block(fill: rgb("#e6f4e6"), inset: 8pt, radius: 4pt)[
  #text(weight: "bold")[The fix is physical: ] move one Kinect to a different USB3 connector that routes to a *different root port* than the shared 4-port hub. On the AGX Orin developer kit that is typically the #text(weight: "bold")[USB-C port] (separate root port) or a USB-A port that is not behind the same hub.
]

#text(weight: "bold")[Success criterion:] after re-wiring, #raw("lsusb -t") must show the two #raw("02d8") sensors under #text(weight: "bold")[different top-level branches] of Bus 02, e.g.:

#block(fill: rgb("#eef4fb"), inset: 8pt, radius: 4pt)[
```text
Bus 02 Port 1: tegra-xusb/4p
   ├── Port 1: ...  Kinect v2 A (direct root port)
   └── Port 3: ...  4-port hub
                      └── Port 2: ... Kinect v2 B
```
]

NOT both under the same #raw("hub/4p").

= Reference

This matches libfreenect2's documented multi-Kinect requirement: separate USB 3.0 host controllers (or here, separate root ports), because each Kinect v2 uses ~1/3 of a SuperSpeed controller's isochronous budget and two exceed a single hub/root-port budget.

Issues with the identical error: OpenKinect/libfreenect2 #link("https://github.com/OpenKinect/libfreenect2/issues/971")[#971], #link("https://github.com/OpenKinect/libfreenect2/issues/615")[#615], #link("https://github.com/OpenKinect/libfreenect2/issues/500")[#500], #link("https://github.com/OpenKinect/libfreenect2/issues/97")[#97] — "Not enough bandwidth".

#v(16pt)
#line(length: 100%, stroke: 0.5pt)
#v(6pt)
#text(size: 9pt, fill: rgb("#999"))[Generated by Typst. Companion: docs/sensors/kinect2/problem-dual-kinect-bandwidth.md]
