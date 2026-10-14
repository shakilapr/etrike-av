# YOLO26x Perception, 3D Cockpit & Display Integration

**System Platform**: NVIDIA Jetson AGX Orin 64 GB (Ampere `SM 8.7`, Tegra234)  
**Software Stack**: ROS 2 Humble • TensorRT 10.3.0.30 • CUDA 12.6 • CycloneDDS  
**Primary Sensors**: Microsoft Kinect v2 Front Camera (USB 3.0 @ 2:4) • Hesai Pandar XT32M2X LiDAR  

---

## 1. Executive Summary & Architecture

This document records the end-to-end implementation and verification of the vision and display perception stack for the autonomous E-Trike platform. The primary camera model was transitioned to **YOLO26x** (TensorRT 10.3 FP16, end-to-end NMS-free) coupled with **RTMPose-s** for anthropometric human skeleton tracking, independent LiDAR clustering, and multi-window visualization on the physical Jetson display.

```
                           +----------------------------------------+
                           |   Kinect v2 Camera (Front RGB + Depth) |
                           +-------------------+--------------------+
                                               |
                                     (1920x1080 @ 30 Hz)
                                               v
                          +------------------------------------------+
                          |      etrike_yolo_perception Node         |
                          | (ROS 2 Humble Native LifecycleNode)      |
                          +--------------------+---------------------+
                                               |
                          +--------------------+---------------------+
                          |                                          |
                          v                                          v
             +--------------------------+               +--------------------------+
             |    YOLO26x TRT FP16      |               |     RTMPose-s FP16       |
             |   (55.7M Params, FP16)   |               |   (17 COCO Keypoints)    |
             | 21.37 ms / 46.8 FPS      |               |  1.4 ms / SimCC head     |
             | Output: (1, 300, 6)      |               +------------+-------------+
             | [x1, y1, x2, y2, s, c]   |                            |
             +------------+-------------+                            |
                          |                                          |
                          +--------------------+---------------------+
                                               |
                                               v
             +-----------------------------------------------------------------------+
             |                      Isolated Bench Topics                            |
             | • /bench_perception/objects      (Autoware DetectedObjects)           |
             | • /bench_perception/human_poses  (JSON 17-Keypoint Skeletal Frames)   |
             | • /bench_perception/camera/debug_image (Live Annotated Video Stream)  |
             +---------------------------------+-------------------------------------+
                                               |
                                               v
             +-----------------------------------------------------------------------+
             |                  AV Dashboard Backend (server.py)                     |
             |          WebSockets /ws/v1/stream • MJPEG Stream /api/v1/camera       |
             +---------------------------------+-------------------------------------+
                                               |
                         +---------------------+---------------------+
                         |                                           |
                         v                                           v
       +-----------------------------------+       +-----------------------------------+
       |     Jetson Monitor: Window 1      |       |     Jetson Monitor: Window 2      |
       | Full 3D Cockpit & Radar HUD       |       | Dedicated Full-Window Camera      |
       | • Three.js 3D Vehicle Radar       |       | • Live Video with Bounding Boxes  |
       | • SMPL 3D Rigged Humanoid Avatars |       | • RTMPose Skeletal Overlay        |
       | • URL: http://localhost:8080      |       | • URL: http://localhost:8080/camera|
       +-----------------------------------+       +-----------------------------------+
```

---

## 2. YOLO26x Model Specifications & Benchmarks

### 2.1 Model Characteristics
* **Weights Checkpoint**: `data/ml_models/yolo26x.pt` (118.66 MB)
* **Parameters**: **55,725,948** (55.7M)
* **Compute Complexity**: **193.9 GFLOPs** @ $1 \times 3 \times 640 \times 640$
* **Output Topology**: End-to-End dual-head NMS-free direct $(1, 300, 6)$ tensor:
  $$\text{output0} = [x_1, y_1, x_2, y_2, \text{confidence}, \text{class\_id}]$$
  *(Eliminates manual CPU Non-Maximum Suppression completely).*

### 2.2 Live Hardware Benchmark on Jetson AGX Orin (SM 8.7 Ampere)
Measured directly on the Orin GPU via `scripts/test_yolo26x_infer.py` using asynchronous CUDA streams:

| Benchmark Metric | YOLO26x FP16 (Measured) | YOLOv8x FP16 (Previous) | Operational Budget |
| :--- | :--- | :--- | :--- |
| **Engine Serialization Size** | **111.45 MB** | 133.16 MB | $< 250\text{ MB}$ |
| **Average GPU Compute Latency** | **21.37 ms** | 24.08 ms | $< 33.3\text{ ms}$ (30 FPS) |
| **Minimum Compute Latency** | **20.60 ms** | 23.85 ms | — |
| **Maximum Compute Latency** | **22.02 ms** | 25.40 ms | $< 35.0\text{ ms}$ |
| **Effective Inference Throughput** | **46.8 FPS** | 41.5 FPS | $\ge 30\text{ FPS}$ |
| **Postprocessing / NMS Overhead** | **0.00 ms (Zero NMS)** | 4.80 ms (CPU NMS) | Minimal |

---

## 3. Perception Node Architecture (`etrike_yolo_perception`)

The node is packaged under `autoware/src/our_packages/etrike_yolo_perception`:
* **Node Class**: `YoloPerceptionNode` (ROS 2 `LifecycleNode`, fail-closed).
* **Direct CUDA Runtime Memory**: Bypasses heavy Python wrappers using `libcudart.so` via `ctypes` (`cudaMalloc`, `cudaMemcpyAsync`, `cudaStreamSynchronize`).
* **Dynamic Tensor Binding Auto-Discovery**:
  ```python
  detected_shape = tuple(self._engine.get_tensor_shape("output0"))
  if len(detected_shape) == 3 and detected_shape[-1] == 6:
      # YOLO26x end-to-end NMS-free direct decoding
  elif len(detected_shape) == 3 and (detected_shape[1] == 84 or detected_shape[2] == 8400):
      # YOLOv8x transposition + NMSBoxes fallback
  ```
* **Graceful Disk Fallback**: Configured to load `/workspace/data/ml_models/yolo26x_fp16.engine`, with automatic fallback to `/workspace/data/ml_models/yolov8x_fp16.engine` if the primary file is missing.
* **Metric Depth Sampling**: Intersects detected 2D bounding boxes with Kinect ToF depth map (`/kinect_front/depth/image_raw`) to localize actors in vehicle `base_link` metric coordinates $(X, Y, Z)$.

---

## 4. Multi-Window Display Integration on Jetson Physical Monitor

The display layout decouples driving instrumentation from live video surveillance:

### 4.1 Window 1: Full 3D Cockpit & Radar HUD (`http://localhost:8080`)
* **Technology**: React 18, Vite, Three.js, WebGL.
* **Features**:
  * Real-time 3D bird's-eye and third-person ego-relative radar tracking.
  * Humanoid actors rendered as neutral slate-grey rigged SMPL avatars with posture classification (`SEATED`, `STANDING`).
  * CAN bus health, gear arbitration (`P`, `R`, `N`, `D`), speed, steering, and diagnostic trouble codes.

### 4.2 Window 2: Dedicated Full-Window Camera Stream (`http://localhost:8080/camera`)
* **Technology**: Standalone dark-mode HTML5 responsive stream.
* **Features**:
  * Clean, borderless video viewport.
  * Bounding boxes with semantic class labels (`person`, `chair`, `tv`, `bottle`), detection confidence, and metric distance.
  * RTMPose-s 17-keypoint skeleton lines in bright yellow tracing active head, arm, torso, and leg articulation.
  * Keyboard shortcut: `F` toggles true fullscreen.

### 4.3 Multi-Window Launch Script
Script: `scripts/open_cockpit_and_camera_monitor.sh`
* Automatically discovers real host X11 display (`DISPLAY=:1`) and active authority (`/run/user/1000/gdm/Xauthority`).
* Launches Window 1 maximized and Window 2 as a dedicated pop-out viewport.

---

## 5. Operations & Troubleshooting Runbook

### 5.1 Starting the Complete System
```bash
# 1. Start Kinect camera, YOLO26x perception, and backend server
bash /home/med1/av_project/scripts/start_live_bench_perception.sh 8080 can2

# 2. Open 3D Cockpit and Dedicated Camera windows on Jetson monitor
bash /home/med1/av_project/scripts/open_cockpit_and_camera_monitor.sh 8080
```

### 5.2 Closing All Applications Cleanly
```bash
# On Jetson Linux:
bash /home/med1/av_project/scripts/close_everything.sh

# On Windows:
pwsh -File scripts/close_everything.ps1 -LocalOnly
```

### 5.3 Troubleshooting: Kinect USB Disconnect / Stale Handle
* **Symptom**: Camera stream freezes; log shows `[usb::TransferPool] failed to submit transfer: LIBUSB_ERROR_NO_DEVICE`.
* **Root Cause**: Isochronous USB 3.0 renegotiation shifted device ID on Bus 002 (e.g. Device 004 $\to$ Device 010).
* **Recovery Command** (takes 3 seconds):
  ```bash
  docker exec autoware_test pkill -9 -f kinect2_node_exec
  docker exec -d autoware_test bash -c "
      source /opt/ros/humble/setup.bash
      source /workspace/autoware/install/setup.bash
      export RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
      ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front > /tmp/kinect_front.log 2>&1
  "
  ```
