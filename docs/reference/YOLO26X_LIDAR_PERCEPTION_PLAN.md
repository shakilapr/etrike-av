# Implementation Plan: YOLO26x + Independent LiDAR Perception

**Target Platform**: NVIDIA Jetson AGX Orin Developer Kit (64 GB RAM, 275 TOPS, Ampere GPU)  
**Sensors**: Hesai Pandar XT32M2X (3D LiDAR) + Kinect v2 / Automotive RGB Camera  
**Middleware**: ROS 2 Humble / CycloneDDS (`rmw_cyclonedds_cpp`)  
**Workspace Constraints**: All custom packages in `autoware/src/our_packages/` (Strict `AGENTS.md` rules)  
**Reference Isolation Spec**: [`docs/reference/BENCH_SENSOR_SIMULATION_ISOLATION.md`](file:///e:/work/av_project/docs/reference/BENCH_SENSOR_SIMULATION_ISOLATION.md)

---

## ⚠️ Critical Architecture Requirement: Dual-System Bench Isolation

As documented in [`BENCH_SENSOR_SIMULATION_ISOLATION.md`](file:///e:/work/av_project/docs/reference/BENCH_SENSOR_SIMULATION_ISOLATION.md), the E-Trike platform operates under two coexisting modes that **must never conflict**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ SYSTEM 1: Autoware Simulation & Wheel Movement (Virtual Road)          │
│                                                                        │
│ • Purpose: Simulates vehicle driving on a Lanelet2 vector road map,     │
│   plans trajectories, and sends motion commands to bench actuators.    │
│ • Localization: Simulated by simple_planning_simulator (map -> base). │
│ • Actuation: autoware_vehicle_bridge forwards commands to CAN bus      │
│   (0x300 speed/gear, 0x303 steering, 0x301 brake).                     │
│ • STRICT RULE: Must drive freely without stopping for lab furniture!   │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ SYSTEM 2: Physical Bench Sensors & Telemetry (Real-World Lab)          │
│                                                                        │
│ • Purpose: Evaluates physical sensors (Hesai LiDAR + Kinect Camera)    │
│   and tests real-time 3D pedestrian/obstacle detection in the room.    │
│ • Environment: Stationary test bench pointing at the room and people.  │
│ • Destination: Streams live data ONLY to the AV Dashboard display.     │
│ • STRICT RULE: Must NEVER touch Autoware planning or localization!    │
└────────────────────────────────────────────────────────────────────────┘
```

### The Three Strict Isolation Boundaries

1. **Perception Topic Isolation**:
   - In Bench Mode: YOLO26x, CenterPoint, and clustering publish exclusively to **`/bench_perception/*`** namespaces.
   - They **must never** publish directly to Autoware's `/perception/object_recognition/detection/objects` during bench mode.
   - If bench obstacles leaked into Autoware's `obstacle_stop_planner`, Autoware would command 0 m/s and full brake, locking the physical bench wheels!

2. **LiDAR & Camera Relay Decoupling**:
   - Raw physical sensor streams stay strictly on their own hardware driver topics (`/sensing/lidar/top/pointcloud_raw_ex` and `/kinect_front/*`).
   - Relays into Autoware internal localization topics (`pointcloud_before_sync` and `camera0`) are disabled on the bench.
   - Feeding stationary room point clouds into Autoware localization while the simulated car moves at 15 km/h causes map-matching divergence and catastrophic TF jumps!

3. **Dashboard Dual-Feed Routing**:
   - `tools/av_dashboard/backend/ros2_bridge.py` subscribes to `/bench_perception/objects`.
   - The AV Dashboard renders the real people and obstacles in the room on the 3D Cockpit, while simultaneously displaying simulated vehicle speed, steering, and CAN telemetry.

### Topic Routing Matrix

| Pipeline Component | Bench Mode Topic (Isolated) | Production Vehicle Mode Topic | Consumer |
|---|---|---|---|
| **YOLOv8x / YOLO26x 2D ROIs** | `/bench_perception/camera/yolo26x/rois` | `/perception/object_recognition/detection/rois0` | ROI Cluster Fusion / HMI |
| **YOLO Debug Image** | `/bench_perception/camera/debug_image` | `/perception/camera/debug_image` | AV Dashboard Web Stream |
| **RTMPose-s Skeletal Poses** | `/bench_perception/human_poses` | `/perception/human_poses` | **SMPL Rigged Mesh Controller** / HMI |
| **CenterPoint 3D Objects**| `/bench_perception/lidar/objects` | `/perception/object_recognition/detection/objects` | Coordinator / Autoware Tracker |
| **Euclidean Clusters** | `/bench_perception/lidar/clusters` | `/perception/object_recognition/detection/clustering/objects`| Safety Guard / HMI |
| **Perception Coordinator**| `/bench_perception/objects` | `/perception/object_recognition/objects` | **AV Dashboard (Bench)** / **Planning (Vehicle)** |

---

## Architecture Overview

```
                                      ┌─────────────────────────────────────────────────────────┐
                                      │              PRIMARY SENSORS & DRIVERS                  │
                                      │                                                         │
                                      │  [RGB Camera (Kinect/GMSL2)]   [Hesai XT32M2X 360°]    │
                                      │       1920x1080 @ 30 Hz           Ethernet @ 10-20 Hz   │
                                      └──────────────┬─────────────────────────┬────────────────┘
                                                     │                         │
                                                     ▼                         ▼
┌────────────────────────────────────────────────────────┐ ┌────────────────────────────────────────────────────────┐
│             CAMERA PIPELINE (INDEPENDENT)              │ │              LiDAR PIPELINE (INDEPENDENT)              │
│                                                        │ │                                                        │
│  • Input: /kinect_front/color/image_raw                │ │  • Input: /sensing/lidar/top/pointcloud_raw_ex         │
│  • Node: YOLO TensorRT FP16 (LifecycleNode)            │ │  • Preprocessing: Crop, ground filter, downsample      │
│  • Latency: ~24 ms TRT FP16 @ 640x640 (~41 FPS)        │ │  • 3D ML Detector: CenterPoint (PointPillars/TensorRT) │
│  • Top-Down Human Pose Branch: RTMPose-s (SimCC FP16)  │ │  • Geometric Obstacles: Euclidean Cluster + Occupancy   │
│    (17 keypoints @ 1.5 ms on person crops)             │ │  • Output (Bench): /bench_perception/lidar/objects     │
│  • Output (Bench): /bench_perception/objects           │ │                   /bench_perception/lidar/clusters    │
│                   /bench_perception/human_poses        │ │                                                        │
│                   /bench_perception/camera/debug_image │ │                                                        │
└───────────────────────────┬────────────────────────────┘ └───────────────────────────┬────────────────────────────┘
                            │                                                          │
                            └───────────────────────────┬──────────────────────────────┘
                                                        │
                                                        ▼
                            ┌──────────────────────────────────────────────────────────┐
                            │      PERCEPTION COORDINATOR & OPTIONAL LATE FUSION       │
                            │                                                          │
                            │  • Fallback Rule: Camera failure DOES NOT kill LiDAR    │
                            │  • Fallback Rule: LiDAR failure DOES NOT kill Camera    │
                            │  • Association: Autoware ROI Cluster Fusion (Optional)   │
                            │  • Output Topic (Bench): /bench_perception/objects       │
                            │  • Output Topic (Vehicle): /perception/.../objects       │
                            └───────────────────────────┬──────────────────────────────┘
                                                        │
                                                        ▼
                            ┌──────────────────────────────────────────────────────────┐
                            │        SAFETY SUPERVISOR & COCKPIT 3D DASHBOARD          │
                            │                                                          │
                            │  • Realistic Digital Human Motion: SMPL Rigged Mesh      │
                            │    (SkinnedMesh driven by RTMPose observed keypoints)    │
                            │  • Autonomous Emergency Braking (LiDAR-geometric guard)  │
                            │  • AV Dashboard (DriveCockpit3D live 3D visualization)   │
                            │  • CAN Gateway / Stability Guard fail-closed command     │
                            └──────────────────────────────────────────────────────────┘
```

---

## Detailed Execution Phases

### Phase 1: Model Export & TensorRT 10.3 Engine Compilation — [COMPLETED]

#### Accomplished Deliverables
1. **Engine Exported & Compiled**:
   - Model: YOLOv8x ($1 \times 3 \times 640 \times 640$, FP16).
   - Compiled directly on Jetson AGX Orin Ampere GPU (`SM 8.7`, Tegra234) using `trtexec`.
   - Output Path: `/workspace/data/ml_models/yolov8x_fp16.engine` (133.16 MB).
   - Raw TensorRT Compute Latency: **24.08 ms** (~41 FPS).
2. **Environment & Dependency Fixes**:
   - Pinned `numpy<2.0` (`numpy==1.26.4`) inside Docker to maintain full binary compatibility with ROS 2 Humble `cv_bridge`.
   - Installed official Tegra234 `libnvinfer-bin` / `python3-libnvinfer` (`10.3.0.30`) from NVIDIA Jetson R36.5 repository.
   - Provisioned missing `libcudla.so.1` dependency from host CUDA 12.6.
3. **Verification on Real Bench Data**:
   - Ran inference on [`camera_snap.jpg`](file:///e:/work/av_project/camera_snap.jpg). Detected seated person at laptop (`person 58.2%`), laptop (`63.5%`), and office chairs (`71% – 94%`). Visual detection verified in [`yolo_detected_snap.jpg`](file:///e:/work/av_project/yolo_detected_snap.jpg).

---

### Phase 2: Camera Pipeline — Native ROS 2 Lifecycle Node (`our_packages`) — [COMPLETED]

#### Accomplished Deliverables
1. **Node Architecture (`yolo_perception_node.py`)**:
   - Location: [`autoware/src/our_packages/etrike_yolo_perception/`](file:///e:/work/av_project/autoware/src/our_packages/etrike_yolo_perception)
   - Architecture: Full `LifecycleNode` (`unconfigured` $\to$ `inactive` $\to$ `active`) with zero external Python wrapper dependencies (direct `ctypes` bindings to `libcudart.so` for CUDA malloc, copy, and stream management).
   - Includes automatic state transition parameter `auto_start: true`.
2. **Strict Dual-System Bench Isolation**:
   - Routes to isolated namespaces:
     - Objects: `/bench_perception/objects` (`autoware_perception_msgs/msg/DetectedObjects`)
     - Debug Image: `/bench_perception/camera/debug_image` (`sensor_msgs/msg/Image`)
     - Status: `/bench_perception/status` (`std_msgs/msg/String` JSON telemetry)
3. **Live Hardware Verification**:
   - Executed live with physical Kinect v2 (`single_kinect.launch.py`) on AGX Orin.
   - Processing Rate: **14.8 – 17.3 FPS** end-to-end (including $1920\times1080$ frame transport, letterboxing, TensorRT inference, and NMS).
   - Live annotated image saved and verified at [`live_yolo_debug.jpg`](file:///e:/work/av_project/live_yolo_debug.jpg) (detected chairs at 80-85%, desktop mouse at 46%, laptop at 84%).

---

### Phase 2B: RTMPose-s Edge Human Pose Estimation (Top-Down Branch)

#### Objective
Deploy **RTMPose-s** (MMPose / OpenMMLab) in TensorRT FP16 on Jetson AGX Orin to extract real 2D/3D skeletal keypoints (17 COCO joints) for all detected pedestrians, enabling observed-motion digital human visualization (seated, walking, crouching, gesturing).

#### Architecture & Latency Profile
- **Model**: `rtmpose-s` (SimCC coordinate classification).
- **Parameters / FLOPs**: ~3.3M parameters, 0.7 GFLOPs ($256 \times 192$ input).
- **Inference Latency on AGX Orin**: **~1.2 – 1.8 ms** per person crop.
- **Top-Down Coupling**: Runs *only* on cropped person bounding boxes produced by Phase 2 YOLO node. Total overhead for 1–3 pedestrians in frame: $<5\text{ ms}$.

#### Deliverables
1. **Engine Export**:
   - Export `rtmpose-s` to ONNX with SimCC heads $\to$ compile to TensorRT 10.3 FP16 (`rtmpose_s_fp16.engine`, ~7 MB).
2. **Node Extension (`etrike_yolo_perception`)**:
   - For each detected object where `coco_label == "person"`:
     - Crop image region with affine padding.
     - Execute RTMPose-s TensorRT engine.
     - Decode 17 joints: `[nose, left_eye, right_eye, left_ear, right_ear, left_shoulder, right_shoulder, left_elbow, right_elbow, left_wrist, right_wrist, left_hip, right_hip, left_knee, right_knee, left_ankle, right_ankle]`.
3. **Telemetry & Topic Publication**:
   - Publish structured keypoint payloads to `/bench_perception/human_poses` (`std_msgs/msg/String` JSON or custom perception msg), consumed by dashboard bridge.

---

### Phase 3: Independent LiDAR Perception Pipeline

#### Objective
Deploy upstream Autoware CenterPoint and Euclidean Clustering packages for 360° metric 3D obstacle detection without camera dependency.

#### Tasks
1. **LiDAR Driver Verification**:
   - Launch Hesai XT32M2X via `etrike_sensor_kit_launch/launch/lidar.launch.xml` (`sensor_ip:=192.168.1.201`).
   - Confirm PointCloud2 format: `x, y, z, intensity, ring, timestamp`.
2. **CenterPoint Configuration**:
   - Configure parameter files in `etrike_common_launch` for Hesai 32-ring elevation range ($-16^\circ$ to $+15^\circ$).
   - Remap output to `/bench_perception/lidar/objects` in bench mode.
3. **Geometric Clustering & Occupancy Grid**:
   - Configure `autoware_euclidean_cluster` for unclassified obstacle detection (debris, boxes, traffic pylons).
   - Remap output to `/bench_perception/lidar/clusters` in bench mode.

---

### Phase 4: Concurrent Execution & Concurrency Profiling on AGX Orin

#### Objective
Run both camera (YOLO26x) and LiDAR (CenterPoint + Clustering) pipelines simultaneously and profile resource competition.

#### KPIs & Validation Targets
| Subsystem | Metric | KPI Target |
|---|---|---|
| **YOLO26x Pipeline** | End-to-End Rate | $\ge 25 - 30\text{ Hz}$ |
| **CenterPoint Pipeline** | End-to-End Rate | Match LiDAR ($10 - 20\text{ Hz}$) |
| **Total VRAM / Unified RAM** | Active Retained Memory | $\le 6.0\text{ GB}$ (out of 64 GB) |
| **GPU Utilization** | Load during concurrent infer | $\le 65\%$ (headroom for planning/localization) |
| **Worst-Case Latency** | Sensor frame $\to$ Object msg | $\le 45\text{ ms}$ |

---

### Phase 5: Perception Coordinator & Optional ROI Late Fusion

#### Objective
Coordinate outputs so that downstream planning and HMI receive clean semantic objects without creating a single point of failure.

#### Implementation
1. **Perception Coordinator (`perception_coordinator_node.py`)**:
   - Priority rules:
     - If both Camera and LiDAR are healthy: Associate YOLO26x classification with 3D LiDAR clusters via `autoware_image_projection_based_fusion` (ROI cluster fusion).
     - If Camera drops: Seamlessly pass raw LiDAR CenterPoint + Euclidean clusters as primary obstacles.
     - If LiDAR drops: Pass Camera detections (with depth backprojection if available) and issue degraded-mode warning.
     - Retain unmatched LiDAR obstacles as `UNKNOWN` (never drop a physical obstacle because vision missed it).
2. **Bench vs Vehicle Output Destination**:
   - Bench Mode: Publishes to `/bench_perception/objects` (consumed by AV Dashboard).
   - Vehicle Mode: Publishes to `/perception/object_recognition/objects` (consumed by Autoware planning).

---

### Phase 6: HMI, Dashboard & Realistic Human Motion Visualization

#### Objective
Stream unified perception objects and RTMPose-s skeletal keypoints to the 3D Cockpit HMI, replacing synthetic walk-cycles with a **realistic, slate-grey SMPL-derived rigged mesh following observed motion**, while maintaining CAN stability guards and bench isolation.

#### Implementation & Architecture
1. **SMPL-Derived Rigged Humanoid Asset**:
   - Location: `tools/av_dashboard/frontend/public/models/pedestrian_smpl.glb`
   - Topology: Game-ready low-poly decimation of the canonical SMPL model (~2,000–3,500 triangles).
   - Material: Neutral slate-grey PBR (`#94a3b8` / `#64748b`, roughness 0.45, metalness 0.15) with subtle cyan rim lighting (`#38bdf8`) for high-contrast visibility against road asphalt without the "uncanny valley" of textured faces.
   - Rigging: Standard humanoid skeleton (`Hips`, `Spine`, `Chest`, `Neck`, `Head`, `LeftUpLeg`, `LeftLeg`, `LeftFoot`, `RightUpLeg`, `RightLeg`, `RightFoot`, `LeftArm`, `LeftForeArm`, `RightArm`, `RightForeArm`).

2. **ROS 2 Bridge Forwarding (`ros2_bridge.py`)**:
   - Subscribe to `/bench_perception/human_poses` and `/bench_perception/objects`.
   - Forward normalized 17-keypoint skeletal arrays attached to each pedestrian actor payload over WebSocket to frontend.

3. **Observed Motion Controller in Three.js (`SurroundingTraffic.ts`)**:
   - Replace synthetic sine-wave limb swinging (`walkAngle = Math.sin(...) * 0.42`) with **direct bone rotation kinematics**:
     - **Seated Pose Detection**: When hip-to-knee and knee-to-ankle vectors form a seated ~90° angle, the SMPL mesh naturally adopts the seated posture at the detected chair/desk location.
     - **Upper Body & Gestures**: Shoulders, elbows, and wrists mirror real-world waving, phone-checking, or walking arm swings.
     - **Distance Fallback**: For distant pedestrians ($> 15\text{ m}$) where keypoint resolution degrades, smoothly blend into a procedural idle/walking animation.

4. **Safety Guard Tripwire & Isolation Verification**:
   - In bench mode, verify simulated vehicle continues driving on vector road map while real-world humans and obstacles appear live on the 3D dashboard without triggering vehicle emergency stop.
