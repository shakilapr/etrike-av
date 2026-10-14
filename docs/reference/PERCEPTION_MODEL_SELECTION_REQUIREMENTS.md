# Autonomous Vehicle Perception & Classification Model Requirements Specification

**Project**: E-Trike Autonomous Vehicle  
**Target Platform**: **NVIDIA Jetson AGX Orin Developer Kit (64 GB)**  
**SoC / Part**: Tegra234 (p3701-0005, 699-13701-0005-501 G.0)  
**L4T / JetPack**: L4T 36.5.2 (JetPack 6.x) | CUDA 12.6 | TensorRT 10.3.0.30 | cuDNN 9.3.0  
**Software Middleware**: ROS 2 Humble / Autoware Universe  
**Document Purpose**: Technical evaluation criteria and formal requirements for selecting and benchmarking the primary perception & classification model(s).

---

## 1. Executive Summary & Objective

The objective is to replace the legacy CPU-based fallback model (OpenCV HOG + SVM) with a production-grade, deep-learning perception pipeline. 

With the **NVIDIA Jetson AGX Orin 64 GB** (275 TOPS AI compute, 64 GB unified LPDDR5 RAM), compute is **no longer a bottleneck**. The platform can comfortably execute medium-to-large multi-modal neural networks (surround camera 2D, dense 3D LiDAR voxel detection, and BEV fusion) at 30+ FPS.

The selected model must perform real-time, high-accuracy object detection, robustly handling complex real-world scenes—including occluded and non-standing pedestrians (seated, crouching, leaning), two-wheelers, vehicles, and general road obstacles.

---

## 2. Hardware Platform & Verified Compute Specifications

Verified via live inspection (`/proc/device-tree/model`, `jtop`, `lscpu`, `nvidia-smi`):

| Parameter | Verified Hardware Specification |
|---|---|
| **SoC / Board** | **NVIDIA Jetson AGX Orin Developer Kit (64 GB RAM)** |
| **Module Part Number** | `p3701-0005` (699-13701-0005-501 G.0, SoC: `tegra234`) |
| **GPU Architecture** | **NVIDIA Ampere (2048 CUDA Cores, 64 Tensor Cores)** |
| **AI Compute Throughput** | **Up to 275 TOPS (INT8 Sparse) / 138 Dense TFLOPS (FP16)** |
| **CPU Architecture** | **12-core Arm® Cortex®-A78AE v8.2 64-bit @ up to 2.2 GHz** |
| **System Memory** | **64 GB LPDDR5** (204.8 GB/s unified memory bandwidth, >54 GB currently free) |
| **Perception Memory Budget** | **Up to 4.0 – 8.0 GB dedicated RAM/VRAM** (ample headroom for large models) |
| **Power Profile Modes** | Configurable: 15W, 30W, 50W, MAXN (up to 60W / 75W) |
| **Runtime Acceleration** | **NVIDIA TensorRT 10.3.0.30** / **CUDA 12.6** / **cuDNN 9.3.0** |
| **Host OS & Driver** | Ubuntu 22.04 LTS (Kernel 5.15.199-tegra, L4T R36.5.2, NVIDIA Driver 540.5.0) |

---

## 3. Sensor Suite

The perception model will interface with data streamed from the following active sensors:

1. **2D / RGB-D Camera (Kinect v2 / Automotive USB3/GMSL2)**:
   - Color Resolution: $1920 \times 1080$ @ 30 Hz (native 1080p inference or downsampled $1280 \times 720$ / $640 \times 640$ as appropriate)
   - Depth Stream: $512 \times 424$ @ 30 Hz, range $0.5\text{ m} - 4.5\text{ m}$
2. **3D LiDAR (Hesai Pandar XT32M2X)**:
   - 32-channel spinning mechanical LiDAR
   - Horizontal FOV: 360°, Vertical FOV: 31° ($-16^\circ$ to $+15^\circ$)
   - Measurement Range: $0.05\text{ m}$ to $80\text{ m}$
   - Output Rate: 10 Hz or 20 Hz (PointCloud2 format)

---

## 4. Operational Design Domain (ODD)

The vehicle is an autonomous electric trike (max speed: $25\text{ km/h}$) operating in:
* **Environments**: University/corporate campus roadways, pedestrian pathways, shared cycle tracks, parking areas, and indoor/bench test environments.
* **Lighting Conditions**: Bright direct sunlight, deep tree/canopy shadows, indoor artificial lighting, and dusk/overcast.
* **Pedestrian Scenarios (Critical Failure Point of Legacy HOG+SVM)**:
  - Upright pedestrians walking, jogging, and standing.
  - **Seated individuals** (on benches, chairs, curbs, stairs, or grass).
  - **Occluded individuals** (partially hidden by desks, parked bicycles, carts, or pillars).
  - Groups of pedestrians walking in close proximity (must avoid merging into a single cluster).
  - Pedestrians pushing carts, strollers, or carrying bags/backpacks.

---

## 5. Mandatory Target Classes

The model must classify objects into the standard `autoware_perception_msgs/msg/ObjectClassification` schema:

| Class ID | Semantic Label | Minimum Detection Range | Notes & Specific Requirements |
|:---:|---|:---:|---|
| **7** | `PEDESTRIAN` | $0.5\text{ m} - 35\text{ m}$ | Must detect standing, seated, crouching, and occluded poses. |
| **6** | `BICYCLE` | $0.5\text{ m} - 40\text{ m}$ | Cyclist riding bicycle or pushing bicycle. |
| **5** | `MOTORCYCLE` | $0.5\text{ m} - 45\text{ m}$ | E-scooters, scooters, and motorcycles with/without riders. |
| **1** | `CAR` | $0.5\text{ m} - 50\text{ m}$ | Passenger sedans, hatchbacks, SUVs, auto-rickshaws. |
| **2** | `TRUCK` / `BUS` | $0.5\text{ m} - 60\text{ m}$ | Delivery vans, campus utility shuttles, trucks. |
| **0 / 9** | `HAZARD` / `UNKNOWN` | $0.5\text{ m} - 25\text{ m}$ | Traffic cones, barriers, boxes, trash cans, fallen debris. |

---

## 6. Quantitative Performance Targets (KPIs)

Given the high compute capacity of the **AGX Orin 64 GB**, high-capacity models (e.g. YOLO Medium/Large, CenterPoint VoxelNet) are fully viable:

| Metric | Minimum Acceptable | Target / Ideal | Evaluation Method |
|---|:---:|:---:|---|
| **Inference Latency** | $\le 15\text{ ms}$ | **$\le 5 - 8\text{ ms}$** | TensorRT FP16 on AGX Orin Ampere GPU |
| **Frame Rate** | $\ge 20\text{ FPS}$ | **$\ge 30\text{ FPS}$** | End-to-end (Capture $\to$ Preprocess $\to$ Infer $\to$ Postprocess) |
| **mAP@50 (Pedestrian)** | $\ge 78.0\%$ | **$\ge 88.0\%$** | Evaluated on validation set including non-standing poses |
| **mAP@50 (Overall)** | $\ge 72.0\%$ | **$\ge 84.0\%$** | COCO / nuScenes / custom campus dataset |
| **Peak Memory Footprint** | $\le 4.0\text{ GB}$ | **$\le 2.0\text{ GB}$** | Measured via `jtop` during continuous run |
| **False Positive Rate** | $< 1.0\%$ | **$< 0.2\%$** | Stationary background without moving entities |
| **Near-Field Blind Zone** | $< 0.8\text{ m}$ | **$< 0.5\text{ m}$** | Critical forward braking zone |

---

## 7. Software & Pipeline Integration Requirements

1. **ROS 2 Humble Native**:
   - Must be wrapped in a standard ROS 2 `LifecycleNode` (conforming to `AGENTS.md` guidelines).
   - Timeouts on all input topic subscriptions (fail-closed behavior).
   - Input topic: `sensor_msgs/msg/Image` and/or `sensor_msgs/msg/PointCloud2`.
   - Output topic: `autoware_perception_msgs/msg/DetectedObjects` with 3D bounding boxes (`geometry_msgs/msg/Pose` in vehicle `base_link` frame).
2. **Export & Runtime Support**:
   - Must export cleanly to **ONNX** (Opset 13-17).
   - Must compile cleanly via `trtexec` or TensorRT 10.3 API targeting **CUDA Compute Capability 8.7** (Ampere).
   - Precision: FP16 (or INT8 if calibration cache is provided).
3. **Multi-Sensor Fusion Capability**:
   - Supported architectures:
     - 2D Camera Detection + Depth/LiDAR ROI projection (late fusion).
     - Native 3D LiDAR Object Detection (CenterPoint / VoxelNet).
     - Multi-modal Bird's-Eye-View (BEV) fusion.

---

## 8. Recommended Model Candidates for the AGX Orin 64 GB

Because the AGX Orin provides 275 TOPS and 64 GB RAM, the evaluator is **not** restricted to tiny models:

### Tier A: 2D Vision Detectors (Camera-Based)
* **YOLOX-Medium / YOLOX-Large**: Native Autoware Universe support (`autoware_tensorrt_yolox`), anchor-free, expected latency on AGX Orin: **~4–7 ms**.
* **YOLOv8-Medium / YOLOv8-Large / YOLO11-Medium**: State-of-the-art mAP across occluded and non-standard poses; expected latency on AGX Orin: **~5–8 ms**.
* **RT-DETR (Real-Time Detection Transformer)**: End-to-end transformer without NMS; excellent for densely packed pedestrians and overlapping obstacles; expected latency: **~8–12 ms**.

### Tier B: 3D LiDAR Detectors
* **CenterPoint with VoxelNet backbone**: Native Autoware package (`autoware_lidar_centerpoint`). VoxelNet offers significantly higher precision than PointPillars, and easily runs in real-time on AGX Orin (**~10–14 ms**).

### Tier C: Multi-Modal Fusion
* **ROI Cluster Fusion / PointPainting**: Fuses 2D camera bounding boxes with 3D LiDAR clusters to provide verified semantic labels and millimeter-accurate 3D centroids.

---

## 9. Deliverables Expected from Evaluator

The evaluator or vendor must provide:
1. **Benchmark Report**:
   - Model name, weights size (MB), input resolution, inference latency (ms on AGX Orin), memory consumption (MB), and mAP scores.
2. **Compiled TensorRT Engine**:
   - Validated `.onnx` and pre-built `.engine` file compiled for AGX Orin (SM 8.7, TensorRT 10.3, CUDA 12.6).
3. **Validation Visualizations**:
   - Side-by-side inference detections on test footage/bags demonstrating:
     1. Standing pedestrians.
     2. Seated person (desk/bench).
     3. Partially occluded person.
     4. Two-wheelers / bicycles / e-scooters.
4. **Integration Code**:
   - Standalone C++ or Python inference class wrapping the TensorRT 10.3 engine for direct integration into ROS 2.
