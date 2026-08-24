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
  #text(size: 19pt, weight: "bold")[Kinect v2 Depth Configuration]
  #v(2pt)
  #text(size: 11pt, style: "italic")[Recommended Settings & Analysis — E-Trike]
  #v(4pt)
  #text(size: 9pt, fill: rgb("#777"))[2026-08-24 · Jetson AGX Orin · ROS 2 Humble · libfreenect2 0.2.0]
]
#v(10pt)
#line(length: 100%, stroke: 1pt)
#v(10pt)

= Executive Summary

The Kinect v2 depth sensor works on Linux via #link("https://github.com/OpenKinect/libfreenect2")[libfreenect2], which reverse-engineered Microsoft's proprietary USB protocol. The single most impactful improvement measured on this vehicle is the #text(weight: "bold")[depth processing pipeline]: switching from the CPU pipeline (~5 Hz) to a CUDA pipeline reaches the sensor's native ~30 Hz, and the #text(weight: "bold")[KDE variant] additionally improves ToF phase reconstruction.

This document gives the recommended production configuration, the measured evidence behind it, and the reasons for each setting.

= Recommended Configuration

```yaml
depth_pipeline: "cudakde"
depth_bilateral_filter: true
depth_edge_aware_filter: true
depth_min_m: 0.3
depth_max_m: 4.5
```

These map to the node parameters in #raw("config/kinect_front.yaml") and #raw("config/kinect_rear.yaml"), and are now actually applied to the device via #raw("setConfiguration()") (previously dead parameters).

= Measured Evidence

Test setup: front Kinect (serial #raw("500076343042")), fixed indoor scene, depth-only at 512×424, FPS via #raw("ros2 topic hz"), pixel statistics via a dedicated subscriber over 20+ frames.

#table(
  columns: 5,
  stroke: 0.6pt,
  table.header([*Pipeline*], [*FPS*], [*Valid px*], [*Valid %*], [*Depth std (m)*]),
  [cpu],   [5.0],  [~85,000],  [~40%], [1.42],
  [cuda],  [30.0], [~98,200],  [~45%], [1.33],
  [cudakde], [29.3], [~98,700], [~45%], [1.38],
)

== Interpretation

- #text(weight: "bold")[CPU is not real-time.] 5 Hz is unusable for obstacle detection on a moving vehicle.
- #text(weight: "bold")[CUDA variants reach ~30 Hz] — the sensor's native rate — and recover ~13,000 more valid depth pixels per frame than CPU.
- #text(weight: "bold")[KDE vs plain CUDA] are frame-rate-equal. KDE performs multi-hypothesis phase unwrapping with kernel-density estimation, yielding better outlier rejection. The valid-pixel count is marginally higher. This is why #raw("cudakde") is recommended.
- The mean/range of valid depth is scene-dependent; the standard deviation column is indicative noise, not lab-grade (the scene shifted slightly between runs).

= Why Each Setting

== Pipeline: cudakde

The Kinect v2 does not transmit finished depth. Its ToF sensor measures phase at multiple modulation frequencies with nine correlation measurements; software reconstructs distance. Two libfreenect2 algorithms exist:

#table(
  columns: 3,
  stroke: 0.6pt,
  table.header([*Algorithm*], [*Source*], [*Approach*]),
  [Standard], [#raw("cuda_depth_packet_processor.cu")], [Phase unwrapping via sensor P0/LUT tables; one hypothesis per pixel],
  [KDE], [#raw("cuda_kde_depth_packet_processor.cu")], [Multiple depth hypotheses per pixel; kernel-density estimation picks the most plausible; better outlier rejection and phase unwrapping],
)

The KDE algorithm was developed specifically for Kinect v2 and reported better depth than both Microsoft's SDK and the original algorithm.

== Filters

#text(weight: "bold")[Bilateral filter] removes isolated "flying pixels" by comparing each pixel to its neighborhood.
#text(weight: "bold")[Edge-aware filter] rejects unreliable ToF measurements at depth discontinuities (object silhouettes). Both are inexpensive on the GPU and reduce the two most common ToF artifacts. They default to enabled upstream; we keep them on.

== Range clipping

Depth is clipped to #raw("[0.3, 4.5]") m inside the driver. Lowering the minimum to 0.3 m captures close obstacles relevant to a three-wheeler; the ToF sensor is accurate near-field. Keeping the maximum at 4.5 m avoids reporting garbage beyond the sensor's physical envelope.

#block(fill: rgb("#fef3cd"), inset: 8pt, radius: 4pt)[
  #text(weight: "bold")[Warning: ] Direct sunlight physically overwhelms the IR ToF detector — no software setting can recover outdoor depth. The Kinect v2 is fundamentally a short-range indoor sensor.
]

= Next Steps

1. #text(weight: "bold")[Set] #raw("depth_pipeline: cudakde") in both config files (currently #raw("auto"), which resolves to plain CUDA).
2. #text(weight: "bold")[Per-unit calibration] — the reference #link("https://github.com/code-iai/iai_kinect2")[iai_kinect2] tooling produces #raw("data/<serial>/calib_{color,ir,pose,depth}.yaml"), correcting the ~13-24 mm static depth offset and color distortion. This is the largest remaining accuracy gain.
3. #text(weight: "bold")[Downstream filtering] — a motion-aware temporal filter (blend only when the scene is static) plus a separate confidence channel, rather than aggressive hole-filling, is safe for an autonomous vehicle.
4. #text(weight: "bold")[Future] — SelfReDepth (2024) or GIGA-ToF (ICCV 2025) neural restoration on the Orin are research-stage options; treat neural depth as perception assistance, not ground truth.

#v(16pt)
#line(length: 100%, stroke: 0.5pt)
#v(6pt)
#text(size: 9pt, fill: rgb("#999"))[Generated by Typst from the E-Trike Kinect depth analysis. Companion: depth-analysis.md (this folder)]
