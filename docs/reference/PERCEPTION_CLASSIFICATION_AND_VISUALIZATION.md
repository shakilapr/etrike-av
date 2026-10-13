# Perception, Classification, and 3D Visualization Architecture

This document provides a comprehensive technical reference for the perception, object classification, coordinate transformation, and vehicle-relative 3D digital driving visualization pipeline within the E-Trike autonomous vehicle project.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PERCEPTION PIPELINE                                  │
│                                                                                        │
│   [Kinect v2 Color] ──> OpenCV HOG + SVM ─────────┐                                    │
│                                                   ▼                                    │
│   [Kinect v2 Depth] ──> Vectorized Backprojection ──> Multi-Modal Fusion ──> Detected  │
│                         & 3D Anthropometrics          & PCA Tracking         Objects   │
│                                                   ▲                                    │
│   [Hesai XT32M2X]   ──> PointCloud Preprocessing ─┘                                    │
└─────────────────────────────────────────┬──────────────────────────────────────────────┘
                                          │ ROS 2 (/perception/.../objects)
                                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              COORDINATE TRANSFORMATION & BRIDGE                        │
│                                                                                        │
│   Global Map Frame (x, y, z) ──> TF2 / Odometry ──> Vehicle-Relative Base Link         │
│                                                     (-Z forward, +X right, +Y up)      │
│                                                                                        │
│   ROS 2 Bridge (ros2_bridge.py) ──> WebSockets (10-20 Hz) ──> AV Dashboard             │
└─────────────────────────────────────────┬──────────────────────────────────────────────┘
                                          │ WebSocket Stream
                                          ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              3D DIGITAL DRIVING VISUALIZATION                          │
│                                                                                        │
│   • Vehicle-relative chase camera with dynamic hazard auto-framing                     │
│   • Semantic 3D models (articulated pedestrians, sedans, trucks, cyclists)            │
│   • Neutral slate-grey geometric obstacles for unclassified objects                    │
│   • HUD proximity distance pills (< 3.5 m critical amber/red alert)                   │
│   • Optional subsampled Point Cloud layer toggle                                       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Classification & Detection Architecture

The project employs a two-tier perception architecture:
1. **Tier 1 — Standalone Bench Perception Pipeline**: A lightweight, CPU/GPU-balanced hybrid perception node running on the physical lab bench or vehicle without requiring a full autonomous driving stack or pre-built HD map.
2. **Tier 2 — Upstream Autoware Universe Deep Learning Pipeline**: A production autonomous driving perception stack leveraging TensorRT neural networks for 3D point cloud detection, 2D camera vision, and multi-sensor fusion.

---

## 2. Tier 1: Standalone Bench Perception Pipeline

Implemented in:
[`autoware/src/our_packages/etrike_common_launch/scripts/bench_perception_node.py`](file:///e:/work/av_project/autoware/src/our_packages/etrike_common_launch/scripts/bench_perception_node.py)

### 2.1 2D Vision Classification Model

| Attribute | Specification |
|---|---|
| **Model Type** | Histogram of Oriented Gradients (HOG) + Linear Support Vector Machine (SVM) |
| **Architecture** | Dalal & Triggs Pedestrian Detector |
| **Library** | OpenCV (`cv2.HOGDescriptor`) |
| **Pretrained Weights** | `cv2.HOGDescriptor_getDefaultPeopleDetector()` (INRIA Person Dataset) |
| **Detection Window** | $64 \times 128\text{ pixels}$ |
| **Block Size / Stride** | $16 \times 16\text{ px}$ block / $8 \times 8\text{ px}$ cell size / 9 orientation gradient bins |
| **Input Image Resolution** | Downsampled to $640 \times 360$ (ensures a human at $2.8\text{ m}$ spans $\sim 160\text{ px}$, well within the $128\text{ px}$ detector window) |
| **Detection Stride & Scale** | `winStride=(4, 4)`, `padding=(8, 8)`, `scale=1.03` |
| **Output Representation** | Normalized bounding boxes $[x_{\min}, y_{\min}, x_{\max}, y_{\max}] \in [0.0, 1.0]$ |

### 2.2 3D Depth Point Cloud Geometry & Spatial Clustering

The depth sensor produces raw depth frames ($512 \times 424$ resolution at 30 Hz). The node performs:

1. **Vectorized Depth Backprojection**:
   Converts optical pixel coordinates $(u, v)$ and depth value $d$ into 3D optical coordinates $(X_{\text{opt}}, Y_{\text{opt}}, Z_{\text{opt}})$ using pinhole camera intrinsics:
   $$X_{\text{opt}} = \frac{(u - c_x) \cdot d}{f_x}, \quad Y_{\text{opt}} = \frac{(v - c_y) \cdot d}{f_y}, \quad Z_{\text{opt}} = d$$
2. **Extrinsic Base Link Transformation**:
   Transforms from optical convention ($+Z$ forward, $+X$ right, $+Y$ down) to vehicle `base_link` convention ($+X$ forward, $+Y$ left, $+Z$ up):
   $$X_{\text{base}} = Z_{\text{opt}} + x_{\text{mount}}$$
   $$Y_{\text{base}} = -X_{\text{opt}} + y_{\text{mount}}$$
   $$Z_{\text{base}} = -Y_{\text{opt}} + z_{\text{mount}}$$
   Where sensor mount offsets are $x_{\text{mount}} = 1.20\text{ m}$, $y_{\text{mount}} = 0.00\text{ m}$, $z_{\text{mount}} = 1.00\text{ m}$.
3. **Voxel Grid Spatial Hashing**:
   Points are hashed into discrete $0.28\text{ m}$ cubic voxel bins. Connected adjacent voxels are extracted into discrete physical object clusters in $\mathcal{O}(N)$ time.
4. **PCA Orientation Estimation**:
   For each cluster, the spatial covariance matrix of $(x, y)$ coordinates is calculated via `np.cov()`. The eigenvectors of the covariance matrix (`np.linalg.eigh()`) define the principal yaw heading angle:
   $$\theta = \operatorname{atan2}(v_{y}, v_{x})$$

### 2.3 3D Depth Anthropometric Silhouette Classifier

Point cloud clusters are evaluated against strict human physical anthropometric criteria. This ensures human detection functions reliably even under partial visual occlusion (e.g., lower-body occluded by office chairs, desks, or partitions):

$$\text{is\_human\_scale} = \begin{cases}
0.95\text{ m} \le \text{height} \le 2.20\text{ m} \\
0.25\text{ m} \le \text{width} \le 1.05\text{ m} \\
\text{depth\_thickness} \le 0.95\text{ m} \\
\frac{\text{height}}{\max(0.15, \text{width})} \ge 1.30 \quad (\text{vertical aspect ratio}) \\
0.45\text{ m} \le z_{\text{centroid}} \le 1.70\text{ m} \quad (\text{torso elevation})
\end{cases}$$

### 2.4 Multi-Modal Fusion & Classification Scoring

The 3D cluster centroid is backprojected into normalized 2D camera coordinates $(u_{\text{norm}}, v_{\text{norm}})$. A $35\%$ boundary expansion accounts for the physical stereo baseline between the RGB and Depth lenses ($5.2\text{ cm}$).

```
                               ┌──────────────────────────┐
                               │  3D Point Cloud Cluster  │
                               └────────────┬─────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
      ┌───────────────────────────┐                   ┌───────────────────────────┐
      │  3D Anthropometric Check  │                   │  2D HOG-SVM Vision BBox   │
      └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                    │                                               │
                    │               ┌───────────────────────────────┘
                    ▼               ▼
      ┌───────────────────────────────────────────┐
      │          Multi-Modal Decision Logic       │
      ├───────────────────────────────────────────┤
      │ • Vision Confirmed + 3D Anthropometrics   │ ──> PEDESTRIAN (Confidence: 0.98)
      │ • Vision Confirmed (partial occlusion)    │ ──> PEDESTRIAN (Confidence: 0.95)
      │ • 3D Anthropometrics (upright human shape)│ ──> PEDESTRIAN (Confidence: 0.92)
      │ • Neither matched (desks, walls, boxes)   │ ──> UNKNOWN    (Confidence: 0.90)
      └───────────────────────────────────────────┘
```

---

## 3. Tier 2: Upstream Autoware Universe Pipeline

When operating in full autonomous mode (`autoware.launch.xml` with `perception_mode:=camera_lidar_fusion` or `lidar`), the pipeline uses TensorRT models accelerated on the Jetson Orin GPU:

```
[Hesai XT32M2X] ──> Pointcloud Preprocessor ──> CenterPoint 3D ──┐
                                                 (TensorRT)       │
                                                                  ▼
                                                          ROI Cluster Fusion ──> Multi-Object
                                                                  ▲              Tracking
[Cameras]       ──> Image Rectification     ──> YOLOX 2D ─────────┘              & Prediction
                                                 (TensorRT)
```

### 3.1 3D LiDAR Object Detection: CenterPoint

* **Package**: `autoware_lidar_centerpoint`
* **Architecture**: Anchor-free 3D detector with PointPillars/VoxelNet feature encoder + 2D CNN backbone + Center heatmap heads.
* **Inference Backend**: NVIDIA TensorRT running on Jetson Orin Nano GPU (FP16 precision).
* **Model Inputs**: 3D PointCloud2 sweeps $(x, y, z, \text{intensity})$.
* **Model Outputs**: 3D bounding box center $(x, y, z)$, dimensions $(w, l, h)$, heading angle $\theta$, velocity $(v_x, v_y)$, and class probabilities.
* **Output Classes**: `CAR`, `TRUCK`, `BUS`, `PEDESTRIAN`, `BICYCLE`.

### 3.2 2D Camera Object Detection: YOLOX

* **Package**: `autoware_tensorrt_yolox`
* **Architecture**: Anchor-free single-stage 2D object detection network (YOLOX-Tiny / YOLOX-S).
* **Inference Backend**: NVIDIA TensorRT.
* **Inputs**: Rectified color camera images.
* **Outputs**: 2D bounding boxes with classification scores.

### 3.3 Multi-Sensor ROI Fusion

* **Package**: `autoware_image_projection_based_fusion` / `roi_cluster_fusion`
* **Operation**: Projects 3D LiDAR point clusters into calibrated 2D camera image planes. Overlapping 2D bounding boxes transfer semantic classification labels onto the 3D point clusters.

---

## 4. Classification Schema & Message Definitions

All perception packages publish standard ROS 2 messages adhering to Autoware interface contracts:

### 4.1 Topic Endpoints

| Topic | Message Type | Publishing Rate |
|---|---|---|
| `/perception/object_recognition/detection/objects` | `autoware_perception_msgs/msg/DetectedObjects` | 10 Hz |
| `/perception/object_recognition/tracking/objects` | `autoware_perception_msgs/msg/TrackedObjects` | 10 Hz |
| `/perception/object_recognition/objects` | `autoware_perception_msgs/msg/PredictedObjects` | 10 Hz |

### 4.2 Semantic Classification Enum Mapping

Defined in `autoware_perception_msgs/msg/ObjectClassification.msg`:

```yaml
uint8 UNKNOWN = 0
uint8 CAR = 1
uint8 TRUCK = 2
uint8 BUS = 3
uint8 TRAILER = 4      # Mapped to TRUCK in HMI
uint8 MOTORCYCLE = 5
uint8 BICYCLE = 6
uint8 PEDESTRIAN = 7
uint8 ANIMAL = 8       # Mapped to PEDESTRIAN in HMI
uint8 HAZARD = 9       # Mapped to BOX in HMI
uint8 OVER_DRIVABLE = 10
uint8 UNDER_DRIVABLE = 11
```

---

## 5. Vehicle-Relative 3D Digital Driving Visualization

Implemented in:
* [`tools/av_dashboard/frontend/src/components/cockpit/DriveCockpit3D.tsx`](file:///e:/work/av_project/tools/av_dashboard/frontend/src/components/cockpit/DriveCockpit3D.tsx)
* [`tools/av_dashboard/frontend/src/components/cockpit/SurroundingTraffic.ts`](file:///e:/work/av_project/tools/av_dashboard/frontend/src/components/cockpit/SurroundingTraffic.ts)
* [`tools/av_dashboard/frontend/src/components/cockpit/RoadEnvironment.ts`](file:///e:/work/av_project/tools/av_dashboard/frontend/src/components/cockpit/RoadEnvironment.ts)

### 5.1 Coordinate Frame Conversion

The 3D driving visualization operates in a vehicle-relative coordinate frame:
* **Ego Vehicle**: Visual anchor at bottom-center $(0, 0, 0)$.
* **Coordinate System**:
  * $-Z$: Ahead / Forward
  * $+Z$: Behind / Reverse
  * $+X$: Right flank
  * $-X$: Left flank
  * $+Y$: Up (elevation)

The backend bridge ([`tools/av_dashboard/backend/ros2_bridge.py`](file:///e:/work/av_project/tools/av_dashboard/backend/ros2_bridge.py)) converts all incoming objects from either global map frame or sensor frame into vehicle `base_link` before transmission to the frontend.

### 5.2 Semantic 3D Model Representation

| Detected Class | 3D Visual Mesh | Visual Details |
|---|---|---|
| `PEDESTRIAN` | Articulated Humanoid Model | Multi-segment limbs (head, torso, pelvis, arms, legs) with dynamic walk-cycle animations synchronized to frame delta. |
| `CAR` | Aerodynamic Passenger Sedan | Lower chassis, sloping hood, curved glass canopy, 4 aerodynamic wheels, front/rear LED light bars, ground contact shadow. |
| `TRUCK` / `BUS` | Commercial Transit Vehicle | Heavy cargo box, forward cab, windshield, dual-axle wheels, rear safety reflectors. |
| `MOTORCYCLE` / `BICYCLE` | Two-Wheeler Cyclist | Frame geometry, wheels, handlebars, and rider silhouette. |
| `CONE` | Highway Traffic Pylon | Square rubber base plate, tapered safety orange cone, white reflective collar. |
| `UNKNOWN` / `BOX` | Neutral Slate-Grey Obstacle | Low-poly rounded cylinder mass with an automotive crown ring and contact shadow. Unclassified physical obstacles are never rendered as misleading traffic cones. |

### 5.3 Proximity Distance Indicators (HUD Distance Pills)

* **Lead Hazard Detection**: The node calculates the closest active obstacle directly in the vehicle's forward corridor ($|X| < 1.6\text{ m}$, $Z \in [-12.0, -0.3]\text{ m}$).
* **Distance Pill Sprite**: Displays a minimalist distance label (e.g. `2.8 m`) positioned above the lead obstacle.
* **Critical Threshold Alert**: When the lead hazard is within $3.5\text{ m}$, the badge switches to a vibrant warning red style (`#ef4444`).
* **Texture Caching**: Canvas rendering is cached on `sprite.userData`. The canvas context is updated only when text or alert status changes, preventing GPU texture recreation thrashing during 60 FPS animation.

### 5.4 Dynamic Camera Auto-Framing

The chase camera dynamically adjusts its elevation and focal point based on situational risk:
* **Standard Driving**: Camera at $(0, 2.5, 5.2)$ looking at $(0, 0.75, -8.0)$.
* **Proximity Hazard Ahead ($< 4.0\text{ m}$)**: Camera smoothly transitions to $(0, 2.85, 5.6)$ looking at $(0, 0.90, -6.0)$, providing the driver with an elevated, forward-focused perspective of the obstacle.

---

## 6. Camera Point Cloud Layer Architecture

To visualize raw depth measurements alongside semantic 3D models, an optional point cloud layer is supported.

### 6.1 Bandwidth & Streaming Analysis

| Stream Mode | Resolution / Points | Bytes per Frame | Bandwidth @ 15 Hz | Feasibility |
|---|---|---|---|---|
| **Raw Depth Stream** | $512 \times 424 = 217,088$ pts | $\sim 1.74\text{ MB}$ (float32 $\times 3$) | $\sim 26.1\text{ MB/s}$ | **Unfeasible**: Overloads browser WebSocket and causes UI frame drops. |
| **Subsampled Cloud (Stride 4)** | $128 \times 106 \approx 13,568$ pts | $\sim 108\text{ KB}$ | $\sim 1.62\text{ MB/s}$ | **Acceptable**: Works on wired gigabit ethernet. |
| **Optimized Cloud (Stride 6)** | $85 \times 70 \approx 5,950$ pts | $\sim 47.6\text{ KB}$ | $\sim 0.71\text{ MB/s}$ | **Recommended**: High visual fidelity, 60 FPS rendering on Jetson display. |

### 6.2 Frontend Three.js Points Implementation

```typescript
// Subsampled Camera Depth Point Cloud Layer
const maxPoints = 8000;
const positions = new Float32Array(maxPoints * 3);
const colors = new Float32Array(maxPoints * 3);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 0.04,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
});

const pointCloud = new THREE.Points(geometry, material);
scene.add(pointCloud);
```

### 6.3 Layer Toggle Control

The Cockpit HUD exposes top-bar layer toggles:
```
[ 🛣️ Road: ON ]   [ 🚗 Actors: ON ]   [ ☁️ Point Cloud: ON / OFF ]
```
When toggled OFF, point geometry updates are suspended and `pointCloud.visible = false`, consuming zero rendering budget.

---

## 7. Hardware Setup & Execution Reference

### 7.1 Sensor Hardware Prerequisites

1. **Microsoft Kinect v2**:
   * Must be connected to a dedicated **USB 3.0 controller** (SuperSpeed 5 Gbps, Isochronous bandwidth).
   * External **12V DC power brick** must be connected and powered on.
   * Verify USB enumeration on host:
     ```bash
     lsusb | grep "045e:02d8"
     ```
2. **Hesai XT32M2X 360° LiDAR**:
   * Connected via Ethernet to `eno1` / `eth0`.
   * Static IP configured at `192.168.1.201` on subnet `192.168.1.0/24`.
   * Verify network link:
     ```bash
     ping -c 1 192.168.1.201
     ```

### 7.2 Running the Pipeline

To launch the standalone perception pipeline and open the 3D cockpit on the physical display (`:1`):

```bash
# On the Jetson (or via SSH: ssh -n med1@172.16.25.67)
bash scripts/run_bench_perception.sh can2 8080
```

### 7.3 Building Packages on Jetson (Remote Build)

To utilize the Jetson's hardware capabilities:

```bash
# Build frontend dashboard production bundle
ssh med1@172.16.25.67 "cd /home/med1/av_project/tools/av_dashboard/frontend && npm run build"

# Build ROS 2 workspace packages
ssh med1@172.16.25.67 "docker exec autoware_test bash -c 'source /opt/ros/humble/setup.bash && colcon build --symlink-install --packages-select etrike_common_launch etrike_kinect2'"
```
