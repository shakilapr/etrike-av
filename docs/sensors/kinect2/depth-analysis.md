# Kinect v2 Depth Processing — Analysis & Pipeline Comparison

Status: **LIVE** (measurements taken on the Jetson AGX Orin, front Kinect)
Date: 2026-08-24
Companion docs: `KINECT2_BRINGUP.md`, `KINECT2_LINUX_INTEGRATION.md`

This report analyzes the depth-processing options for the Kinect v2 on the
E-Trike and documents the measured comparison between libfreenect2's depth
pipelines, plus a roadmap for further improvement.

---

## 1. How Kinect v2 depth actually works (why pipelines differ)

The Kinect v2 does **not** send a finished 512×424 depth image over USB. Its
Time-of-Flight (ToF) sensor measures phase at **multiple modulation frequencies**
with nine correlation measurements, and software must reconstruct distance.

Two reconstruction approaches exist in libfreenect2:

| Algorithm | Files | Approach |
|---|---|---|
| **Standard** | `cuda_depth_packet_processor.cu` / `cpu_depth_packet_processor.cpp` | Phase unwrapping with the sensor's P0/LUT tables; single hypothesis per pixel |
| **KDE** | `cuda_kde_depth_packet_processor.cu` / `opencl_kde_depth_packet_processor.cu` | Generates **multiple depth hypotheses** per pixel, then uses **kernel-density estimation** to pick the most plausible one; produces a confidence measure, rejects more outliers, improves phase unwrapping |

The KDE variant was developed specifically for Kinect v2 and reported better
depth reconstruction than both Microsoft's SDK and the original algorithm
(Efficient Multi-Frequency Phase Unwrapping using KDE, arXiv:1608.05209).

**Why this matters for us:** our driver previously hardcoded the standard
pipeline. The KDE variant is a *one-line* switch that may improve depth quality
with no architecture change.

---

## 2. What we built

Added a selectable depth pipeline + explicit depth configuration to
`etrike_kinect2`:

### New parameter: `depth_pipeline`

| Value | Pipeline | Available in our build? |
|---|---|---|
| `auto` | Prefer CUDA → CPU fallback | Yes (default) |
| `cpu` | `CpuPacketPipeline` | Yes |
| `cuda` | `CudaPacketPipeline` | Yes |
| `cudakde` | `CudaKdePacketPipeline` | Yes |
| `opencl` | `OpenCLPacketPipeline` | No (not compiled) |
| `opencl_kde` | `OpenCLKdePacketPipeline` | No (not compiled) |

Unavailable pipelines fall back to CPU at runtime (feature-macro guarded).
Code: `kinect2_device.cpp` `open()` switch, `kinect2_node.cpp` string mapping.

### New parameters: depth filtering (now actually applied)

`device_->setConfiguration()` is now called (previously never used):

| Parameter | Default | Effect |
|---|---|---|
| `depth_bilateral_filter` | `true` | Suppresses "flying pixels" |
| `depth_edge_aware_filter` | `true` | Rejects unreliable ToF measurements at depth boundaries |
| `depth_min_m` | `0.5` | Depth clipping range (meters) |
| `depth_max_m` | `4.5` | Depth clipping range (meters) |

---

## 3. Benchmark results (measured on the Jetson AGX Orin)

Test setup: front Kinect (serial `500076343042`), fixed scene, `ros2 topic hz`
for FPS and a custom `depth_stats` subscriber for per-pixel statistics over
20+ frames. Color disabled; depth-only. All at 512×424.

| Pipeline | FPS | Valid pixels | Invalid pixels | Valid % | Mean (m) | Std (m) |
|---|---|---|---|---|---|---|
| **cpu** | **5.0** | ~85,000 | ~132,000 | ~40% | 2.33 | 1.42 |
| **cuda** | **30.0** | ~98,200 | ~118,900 | ~45% | 1.49 | 1.33 |
| **cudakde** | **29.3** | ~98,700 | ~118,400 | ~45% | 2.02 | 1.38 |

Notes:
- **FPS is the headline.** CPU is unusable for real-time (5 Hz); both CUDA
  variants hit ~30 Hz. This is the single biggest quality improvement available.
- **Valid-pixel fraction** is ~45% for both CUDA variants vs ~40% for CPU —
  the CUDA pipelines recover ~13,000 more valid depth pixels per frame.
- The mean/std differ between runs because the scene is not perfectly static
  between measurements (camera pose / scene slightly different each launch).
  For a controlled A/B of CPU-vs-CUDA-KDE at the *same* scene, a fixture is
  required; the numbers above are indicative, not lab-grade.

**Screenshots** are saved locally on the Jetson (`/tmp/depth_{cpu,cuda,cudakde}.png`,
`/tmp/color_view.png`, captured via `scrot` on `DISPLAY=:1` while each pipeline
rendered in `rqt_image_view`): the three depth frames are visually similar (same
scene), as expected — the pipelines differ in rate, outlier rejection, and phase
quality rather than gross appearance. Brightness distribution measured nearly
identical (~40% dark / ~55% bright for all three).

**Bottom line:** switch from CPU to a CUDA pipeline (either `cuda` or `cudakde`)
for real-time depth. `cudakde` is the theoretically better algorithm at the same
FPS; the valid-pixel count is marginally higher. We recommend `cudakde` as the
default pending a controlled side-by-side.

---

## 4. Screenshots

Captured on the Jetson monitor and kept **locally on the Jetson only** (not in
git — `.gitignore` ignores `*.png`):

- `/tmp/depth_cpu.png` — CPU pipeline depth view
- `/tmp/depth_cuda.png` — CUDA pipeline depth view
- `/tmp/depth_cudakde.png` — CUDA-KDE pipeline depth view
- `/tmp/color_view.png` — color (RGB) reference view

> Screenshots are captures of the Jetson monitor (`DISPLAY=:1`) while
> `rqt_image_view` displayed the stream, so they include the window chrome.

---

## 5. Roadmap (ranked)

| Stage | Upgrade | Benefit | Difficulty |
|---|---|---|---|
| **1** | Switch default to `cudakde` | Better ToF reconstruction at 30 Hz | **Very low** (done — param exists) |
| **2** | Proper depth visualization | Perceived quality | Very low |
| **3** | Per-unit `iai_kinect2` calibration | Accuracy/alignment (fixes the ~24 mm depth offset, color distortion) | Low–medium |
| **4** | Explicit depth config | Tunability (done — filters/range now applied) | Low |
| **5** | Edge-preserving spatial filter | Noise/detail | Low |
| **6** | Conservative temporal filter | Substantial noise reduction | Medium |
| **7** | Confidence map | Robotics-safe downstream | Medium |
| **8** | SelfReDepth (neural) on Orin | Large restoration | Medium–high |
| **9** | GIGA-ToF | Advanced research | High |
| **10** | Custom raw-ToF decoder | Maximum control | Very high |

### Stage 1: `cudakde` default (recommended now)

Set in `config/kinect_front.yaml` / `kinect_rear.yaml`:

```yaml
depth_pipeline: "cudakde"
```

or at runtime:

```bash
ros2 param set /kinect_front depth_pipeline cudakde   # needs re-activate
```

### Stages 5–7: post-processing layer

Keep the raw topic untouched and add a filter node that subscribes to
`/kinect_front/depth/image_raw`:

- **Spatial**: depth-aware edge-preserving (domain transform), NOT Gaussian
  (Gaussian smears the person/wall boundary).
- **Temporal**: motion-aware — only blend when
  `|current - previous| < threshold`; never for moving objects (vehicle moves!).
- **Confidence**: publish a separate confidence channel rather than inventing
  depth (avoid aggressive hole filling for an autonomous vehicle).

### Stage 3: calibration

The `iai_kinect2` lineage ships `data/<serial>/calib_{color,ir,pose,depth}.yaml`
and a calibration tool. Factory params from `getIrCameraParams()` are good but a
per-unit calibration fixes:
- the static **~24 mm depth offset** (`depthShift`);
- color distortion (currently dropped to zeros);
- RGB↔IR extrinsics for accurate registered depth.

### Stages 8–10: ML / raw-ToF (research)

SelfReDepth (2024) and GIGA-ToF (ICCV 2025) target exactly our platform
(Jetson + CUDA + Kinect v2 + RGB + 30 FPS). They are perception *assistance*,
not ground truth. FLAT/NVIDIA is older (TF 1.9) — reference only. Custom raw-ToF
reconstruction is a research project.

---

## 6. Hard limitations (no software fixes)

- **Direct sunlight** physically overwhelms the IR ToF detector → outdoor depth
  unusable (documented in `docs/mapping/issues/mapping_without_imu.md`).
- **Range** ~0.5–4.5 m nominal — a short-range indoor sensor.
- None of the above changes these; they only extract the best possible depth
  **within** the sensor's physical envelope.

---

## 7. Files changed for this analysis

- `etrike_kinect2/src/kinect2_device.cpp` — pipeline switch + `setConfiguration`
- `etrike_kinect2/src/kinect2_node.cpp` — `depth_pipeline` / filter params
- `etrike_kinect2/include/etrike_kinect2/kinect2_device.hpp` — `PipelineType`,
  `DepthConfig`
- `etrike_kinect2/include/etrike_kinect2/kinect2_node.hpp` — new param fields
- `etrike_kinect2/config/kinect_{front,rear}.yaml` — new params
- Commit: `9f6de00`
