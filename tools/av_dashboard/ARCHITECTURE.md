# AV Dashboard — Architecture

> E-Trike Autonomous Vehicle cockpit, telemetry monitor and 3D digital twin.
> Location: `tools/av_dashboard/` · Version: 2.0.0 · License: Apache-2.0

This document describes the complete architecture of the AV Dashboard: its
process topology, data models, the exact coordinate/temporal math it applies,
the 3D assets and rigs it renders, and the protocols it speaks. Every claim is
grounded in a source file with a `path:line` reference.

---

## 1. Purpose & Scope

The AV Dashboard is the operator-facing **glanceable HMI** for the E-Trike
Autonomous Vehicle. It provides three distinct views:

| View | Component | Purpose |
|------|-----------|---------|
| **CAN Monitor** | `CanDirectoryTable`, `BitMatrix64`, `SignalRoster`, `TelemetrySidebar` | Engineering bus inspection: every CAN ID, live bit-level payload matrix, decoded signal roster with physical values |
| **3D Cockpit** | `DriveCockpit3D` + `cockpit/*` | Digital twin: ego vehicle, road, planned trajectory, perception actors, pedestrian skeletons, live LiDAR point cloud, automotive HUD |
| **360° Radar** | `RadarView` | Top-down polar scope of fused perception objects with proximity threat assessment |

The dashboard is **read-only with respect to the vehicle**: it never commands
actuators. It only renders state. This is consistent with the project rule that
"HMI is informational/control, not the sole safety mechanism."

---

## 2. Process & Deployment Topology

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Windows workstation / Linux runtime                                     │
│                                                                          │
│  ┌───────────────────────┐        ┌──────────────────────────────────┐   │
│  │  Electron shell       │        │  Browser (chromium kiosk)        │   │
│  │  electron/main.js     │        │  Jetson physical display         │   │
│  │  - spawns backend     │        │                                  │   │
│  │  - loads BACKEND_URL  │        │                                  │   │
│  └──────────┬────────────┘        └───────────────┬──────────────────┘   │
│             │  http://127.0.0.1:8080              │                       │
│             ▼                                     ▼                       │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Python FastAPI backend   tools/av_dashboard/backend/server.py    │  │
│  │                                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │  │
│  │  │ CAN transport│  │ ROS2 bridge  │  │ MHR sidecar (optional)   │  │  │
│  │  │ transport.py │  │ ros2_bridge  │  │ mhr_engine / mhr_service │  │  │
│  │  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘  │  │
│  │         │ SocketCAN/Sim   │ rclpy thread           │ torch thread    │  │
│  └─────────┼─────────────────┼────────────────────────┼───────────────┘  │
│            ▼                 ▼                        ▼                  │
│      can2 (CAN bus)    Autoware topics           mhr_model.pt           │
│                        (Humble + CycloneDDS)                            │
└─────────────────────────────────────────────────────────────────────────┘
```

Source: `backend/server.py:34`, `electron/main.js:39`, `electron/main.js:83`.

### 2.1 Execution modes

`create_transport()` selects the transport at startup (`backend/transport.py:323`):

| Mode | Trigger | Transport class | Behaviour |
|------|---------|-----------------|-----------|
| **SocketCAN** | `platform.system() == "Linux"` and no `--sim` | `SocketCanTransport` | Raw `AF_CAN`/`CAN_RAW` socket bound to the interface, auto-reconnect |
| **Simulated** | `--sim` flag | `SimulatedCanTransport` | Deterministic E-Trike frame generator at 100 Hz base tick |
| **Offline** | non-Linux, no `--sim` | `OfflineCanTransport` | Idle; API still serves, telemetry reads `OFFLINE` |

`electron/main.js:83` always launches the backend with `--sim` when it has to
spawn it, because the Electron shell typically runs on Windows where SocketCAN
does not exist. The Jetson scripts (`scripts/open_av_dashboard_display.sh`)
launch it inside the `autoware_test` container with real `can2` + rclpy.

### 2.2 Thread inventory (backend)

| Thread / task | Created at | Rate | Responsibility |
|---------------|-----------|------|----------------|
| `ingest_can_loop` (asyncio task) | `server.py:499` | bus-driven, broadcast throttled to 25 Hz | Read CAN frames, decode, update telemetry, broadcast |
| `broadcast_ros_loop` (asyncio task) | `server.py:500` | 10 Hz | Stream ROS perception/heartbeat even without CAN traffic |
| `mhr-worker` (daemon thread) | `server.py:502` | 12.5 Hz (`time.sleep(0.08)`) | Evaluate MHR mesh off the event loop |
| ROS node spin thread (daemon) | `ros2_bridge.py:178` | `spin_once` 0.1 s timeout | All rclpy subscriptions + tf listener |

Concurrent WebSocket sends from the two loops are serialized by
`asyncio.Lock` `_send_lock` (`server.py:58`, `server.py:93`).

---

## 3. Data Models

### 3.1 CAN contract models (Python)

`backend/contracts.py` defines the two dataclasses that model the entire E-Trike
CAN protocol. Nothing is hardcoded — every ID/signal is loaded from YAML.

**`SignalDef`** (`contracts.py:35`)
```
name, byte, bit, bits, endian ("little"|"big"), signed,
scale (factor), offset, min_val, max_val, unit, comment, color
```

**`MessageDef`** (`contracts.py:52`)
```
key, name, dlc, id, id_hex, bus, buses[], sender, receivers[],
cycle_ms, access ("TX"|"RX"), signals[]
```

`ContractRegistry` (`contracts.py:71`) loads `contracts/*.yaml`, indexes by
numeric ID and by key, and performs bit-level decode. It searches, in order:
the `--yaml-dir` argument, `tools/av_dashboard/contracts`, `tools/can_watcher/contracts`,
`autoware/src/our_packages/direct_bridge/protocol/contracts`, then a git fallback
`git show etrike/main:protocol/contracts/*.yaml` (`contracts.py:115`).

### 3.2 TypeScript models (`frontend/src/types/can.ts`)

Mirror of the Python contract models plus the live-stream models:

- `SignalDef`, `MessageDef`, `BitCell`, `FrameSnapshot` (lines 1–51)
- `TelemetrySummary` (line 53) — the high-level vehicle state object
- `PerceptionObject` (line 89) — **the central 3D actor model**
- `TrajectoryPoint` (line 105)
- `HumanPoseItem` / `HumanPosesPayload` (lines 127–145)
- `MhrHumanActor` / `MhrHumanPayload` (lines 148–163)
- `RosStatus` (line 165)

### 3.3 The `PerceptionObject` model (single shared actor type)

Every perceived entity — car, pedestrian, cone, LiDAR cluster, fused track —
is normalized into one shape and rendered by one pipeline:

```ts
interface PerceptionObject {
  id: string | number;
  label: 'CAR'|'TRUCK'|'BUS'|'MOTORCYCLE'|'PEDESTRIAN'|'BICYCLE'
        |'BOX'|'CLUSTER'|'OBSTACLE'|'UNKNOWN'|string;
  x: number;   // lateral position (m, right positive)  — Three.js X
  y: number;   // vertical height (m)                   — Three.js Y
  z: number;   // longitudinal (m, forward negative)    — Three.js Z
  dx: number;  // length  (REP-103 X)
  dy: number;  // width   (REP-103 Y)
  dz: number;  // height  (REP-103 Z)
  yaw: number; speed_kmh: number;
  sensor?: 'fused'|'camera'|'lidar'|string;  // provenance
  fused?: boolean; distance?: number;
}
```

### 3.4 `TelemetrySummary` — the glanceable vehicle state

`server.py:139` seeds it; `update_telemetry_summary()` (`server.py:251`) fills it
from decoded CAN signals. It carries command vs. actual pairs (speed, steer,
brake, lights, gear), derived motor RPM and throttle, bus rate, and a
`telemetry_source` enum (`ECU_FEEDBACK` / `BENCH_CMD` / `ROS_SIM` / `SIMULATED` /
`OFFLINE`).

---

## 4. The CAN Data Path

### 4.1 Frame ingest & decode

`ingest_can_loop` (`server.py:389`):
1. Accumulates per-ID rate via a rolling 1.0 s window (`recent_timestamps`).
2. `registry.decode_frame(can_id, data)` → `(decoded_signals, bit_cells)`.
3. `update_telemetry_summary(can_id, decoded, raw)` folds the frame into `TelemetrySummary`.
4. Throttled broadcast: at most every 40 ms (**≈25 Hz**, `server.py:443`).

### 4.2 Bit-level decode math (`contracts.py:251`)

For a signal at `start_bit = byte*8 + bit` with width `bits`:

- **Little-endian (Intel)**: accumulate bit-by-bit
  `raw |= ((data[g//8] >> (g%8)) & 1) << offset` for each bit offset.
- **Big-endian (Motorola), byte-aligned** (`bit == 0`, `bits % 8 == 0`):
  `raw = (raw << 8) | data[byte + i]` over `bits/8` bytes.
- **Big-endian within one byte**: `raw = (data[byte] >> bit) & ((1<<bits)-1)`.
- **Big-endian crossing bytes (unaligned)**: chunked left-shift accumulation.

Sign extension:
```
if signed and (raw & (1 << (bits-1))):  raw -= 1 << bits
```

Physical value:
```
phys = raw * scale + offset
```
`scale` comes from the YAML `factor` (default 1.0), `offset` from `offset`
(default 0.0). Example: `steer_diag.angle_0_1deg` uses `factor: 0.1`,
`offset: -3000` → `deg = raw*0.1 - 300.0` (`rt.yaml`).

### 4.3 64-bit matrix (`contracts.py:313`)

`decode_frame` also returns 64 `bit_cells` (one per bit of the 8-byte payload),
each tagged with the owning signal name and its palette color. The frontend
`BitMatrix64` renders this as an 8×8 grid, Bit 7 (MSB) → Bit 0 (LSB) per row.

### 4.4 Derived telemetry math (`server.py`)

Unit conversions and derivations applied to raw decoded values:

| Quantity | Formula | Source |
|----------|---------|--------|
| Speed mm/s → km/h | `value * 0.0036` | `server.py:264` |
| Steer 0.1° → deg | `raw * 0.1` | `server.py:297` |
| Steer diag raw → deg | `(raw - 30000) * 0.1` | `server.py:308` |
| Brake kPa (diag) | `raw * 0.05` | `server.py:325` |
| Motor RPM | `round((abs(mmps)/1000) / (2π·0.254) * 60)` | `server.py:370` |
| Throttle % | `min(100, abs(mmps)/3000 * 100)` | `server.py:381` |

The motor RPM formula inverts the wheel circumference: `2π·r` with effective
radius `r = 0.254 m` (0.203 m wheel + tyre), converting linear m/s to wheel
rev/s then to RPM.

### 4.5 Telemetry source selection (`server.py:164`)

`_refresh_telemetry_summary` resolves the source of truth in priority order:

1. `SIMULATED` — transport is `SimulatedCanTransport`.
2. `ECU_FEEDBACK` — a hardware feedback frame (`0x121,0x210,0x310,0x311,0x011`)
   arrived within `FEEDBACK_FRESH_SEC = 1.5 s`.
3. `BENCH_CMD` — only host command frames (`0x300..0x303`) are present. In this
   mode the command values are **mirrored into `_act`** so the 3D cockpit moves
   on a bench with no physical ECUs (`server.py:191`).
4. `ROS_SIM` — no CAN, but a fresh ROS ego pose / vehicle status exists.
5. `OFFLINE`.

Staleness is enforced: `motor_rpm` and `throttle_pct` decay to `None` after 1.5 s
without their feedback IDs (`server.py:243`).

### 4.6 Frame rate decay (`server.py:120`)

`_decay_stale_frame_rates` runs on the ROS heartbeat loop and zeroes per-ID
`rate_hz` when no frames arrive within 1.0 s, so the UI never shows frozen rates.

---

## 5. The ROS 2 Path

`backend/ros2_bridge.py` runs a background rclpy node `av_dashboard_ros2_bridge`
(`ros2_bridge.py:199`) with a universal sensor QoS profile
(`BEST_EFFORT` + `VOLATILE`, depth 1) so it connects to both reliable and
best-effort publishers (`ros2_bridge.py:202`).

### 5.1 Subscribed topics

| Logical source | Topic(s) | Msg type |
|----------------|----------|----------|
| Ego odometry | `/localization/kinematic_state`, `/localization/pose_twist_fusion_filter/kinematic_state` | `nav_msgs/Odometry` |
| Ego pose (fallback) | `/current_pose` | `geometry_msgs/PoseStamped` |
| Ego pose (2nd fallback) | tf2 `map → base_link` | `tf2_ros` |
| Tracking | `/perception/object_recognition/tracking/objects` | `TrackedObjects` |
| Prediction | `/perception/object_recognition/objects` | `PredictedObjects` |
| Camera detection | `/bench_perception/objects`, `/perception/camera/objects` | `DetectedObjects` |
| 3D detection | `/perception/object_recognition/detection/objects` (+ centerpoint variants) | `DetectedObjects` |
| LiDAR clusters | `/bench_perception/clusters`, `.../clustering/objects` | `DetectedObjects` |
| Bench status | `/bench_perception/status` | `std_msgs/String` (JSON) |
| Human poses | `/bench_perception/human_poses`, `/perception/human_poses` | `std_msgs/String` (JSON) |
| Camera image | `/perception/fusion/annotated_camera`, `/bench_perception/camera/debug_image`, `/kinect_front/color/image_raw` | `sensor_msgs/Image` |
| LiDAR cloud | `/sensing/lidar/top/pointcloud_raw_ex`, `.../concatenated/pointcloud`, etc. | `sensor_msgs/PointCloud2` |
| Fusion tracks | `/perception/fusion/lidar_boxes_3d` | `MarkerArray` |
| Trajectory | `/planning/scenario_planning/trajectory`, `/planning/trajectory` | `autoware_planning_msgs/Trajectory` |
| Vehicle status | `/vehicle/status/*` (velocity, steering, gear, control_mode, turn, hazard) | autoware_vehicle_msgs |
| Control command | `/control/command/control_cmd` | `autoware_control_msgs/Control` |

### 5.2 Ego pose resolution order (`ros2_bridge.py:510–574`)

1. Odometry (`_on_odometry`) — preferred while fresh.
2. `/current_pose` — rejected if odometry is younger than `ODOM_FRESH_SEC = 1.0 s`.
3. tf2 `map → base_link` (`_update_ego_from_tf`, 20 Hz timer) — used when
   odometry is absent/stale.

If none are available, `pose_ok` is `false` and object coordinates are emitted as
placeholders `(0,0,0,0)` so the HUD honestly reports "WAITING FOR
LOCALIZATION" rather than drawing ghosts (`ros2_bridge.py:699`).

### 5.3 Object normalization

`_process_objects_batch` (`ros2_bridge.py:720`) handles the upstream Autoware
sources (tracking / prediction / detection). `_process_camera_objects_batch`
(`ros2_bridge.py:875`) handles YOLO camera objects. `_process_clustering_batch`
(`ros2_bridge.py:795`) handles LiDAR clusters. Each:

1. Extracts pose from `kinematics` (initial vs. current pose for predictions —
   `_extract_pose`, `ros2_bridge.py:651`).
2. Computes object yaw from the orientation quaternion.
3. Converts to Three.js coordinates (§6).
4. Reads bounding box `shape.dimensions` (x/y/z), falling back to
   `(2.0, 1.8, 1.5)` for vehicles and `(0.8,0.8,1.7)` for pedestrians.
5. Computes speed `sqrt(vx²+vy²)·3.6` km/h from `twist`.

Classification uses `LABEL_MAP` (`ros2_bridge.py:32`), mapping the Autoware
`ObjectClassification.label` enum to display labels and picking the
highest-probability hypothesis.

### 5.4 Perception source arbitration (`ros2_bridge.py:1249`)

`get_latest_data()` selects the object set the cockpit renders, in priority
order:

1. **`fusion_mesh_node`** — if `/perception/fusion/lidar_boxes_3d` is fresh.
   Camera pedestrians not already covered (< 2.5 m) are injected so MHR keeps
   its `det_N` IDs.
2. **Bench COMBINED** — camera ∩ LiDAR fusion: greedy nearest-neighbour pairing
   with a **2.2 m** gate; matched pairs blend position
   `merged = 0.4·camera + 0.6·lidar` and take LiDAR box dimensions.
3. **CAMERA_ONLY** / **LIDAR_ONLY**.
4. **Upstream tracking → prediction** fallback.

Freshness constants: `SOURCE_STALE_SEC = 1.5 s`, `ODOM_FRESH_SEC = 1.0 s`
(`ros2_bridge.py:51`, `:53`).

A **final pedestrian deduplication** pass (`ros2_bridge.py:1451`) collapses any
two pedestrians within **2.0 m**, keeping the higher-provenance one
(`fused > camera > lidar`) and preserving any `det_N` ID.

### 5.5 Trajectory sampling (`ros2_bridge.py:1166`)

The planned trajectory is capped to 32 points while always keeping the endpoint:
```
indices = range(n)                          if n <= 32
indices = round(k * (n-1) / 31) for k in 0..31   otherwise
```

---

## 6. Coordinate Systems & Exact Transform Math

The single most important invariant: **all producers must land in one Three.js
frame**. The shared constant is
`BASE_LINK_TO_SCENE_Z_OFFSET = 1.0` (`ros2_bridge.py:59`).

### 6.1 Frames

| Frame | Axes | Origin |
|-------|------|--------|
| ROS `map` / `odom` | +X East-ish, +Y North-ish, +Z up | global |
| ROS `base_link` (REP-103) | +X forward, +Y left, +Z up | ground projection of **rear axle** |
| three.js scene | +X right, +Y up, −Z forward | **wheelbase centre** |

The scene origin is the wheelbase centre; base_link sits at `Z = +1.0 m`
because the wheelbase is `L = 2.0 m` and the rear axle is 1.0 m behind the
centre (see §8.2).

### 6.2 Map-frame → base_link → Three.js (`ros2_bridge.py:576`)

```
dx = x - ego_x;  dy = y - ego_y;  dz = z - ego_z
cos_yaw = cos(ego_yaw);  sin_yaw = sin(ego_yaw)

# rotate into base_link (forward +X, left +Y)
base_x =  cos_yaw*dx + sin_yaw*dy
base_y = -sin_yaw*dx + cos_yaw*dy

# base_link basis (x=+Y_ros, z=-X_ros) is a mirror → heading negated
rel_yaw = -(yaw - ego_yaw)

# into three.js
three_x = base_y
three_y = dz
three_z = BASE_LINK_TO_SCENE_Z_OFFSET - base_x
```

### 6.3 Already-relative transform (`ros2_bridge.py:623`)

When object poses are already base_link-relative:
```
three_x =  y
three_y =  z
three_z =  1.0 - x
rel_yaw = -yaw
```

### 6.4 Sensor-frame → base_link (`ros2_bridge.py:688`)

For objects published in a sensor frame (e.g. `kinect_front_link`) the bridge
looks up `base_link → sensor` via tf2 (`_lookup_sensor_to_base_link`,
`ros2_bridge.py:705`) and applies:
```
bx = sx + cos(syaw)*x - sin(syaw)*y
by = sy + sin(syaw)*x + cos(syaw)*y
bz = sz + z
byaw = yaw + syaw
```
then `_relative_transform`.

### 6.5 Quaternion → yaw (`ros2_bridge.py:62`)

```
siny_cosp = 2(qw·qz + qx·qy)
cosy_cosp = 1 - 2(qy² + qz²)
yaw = atan2(siny_cosp, cosy_cosp)
```

### 6.6 Ego vehicle (Tuk-tuk) OBJ transform (`TuktukVehicle.ts:258`)

The Autoware CAD mesh is mapped ROS→three.js with the matrix
```
|  0 -1  0  0 |
|  0  0  1  0 |
| -1  0  0  1 |
|  0  0  0  1 |
```
i.e. `x_three = -y_ros`, `y_three = z_ros`, `z_three = 1.0 - x_ros`.

The `human_model.obj` uses the equivalent rotation (`SurroundingTraffic.ts:365`).

### 6.7 LiDAR base_link → three.js (`lidar_streamer.py:132`)

Sensor mounted at `X=+0.575 m`, `Y=0`, `Z=+1.7464 m` from the rear axle:
```
base_x = x_sensor + 0.575
base_y = y_sensor
base_z = z_sensor + 1.7464
three_x =  base_y
three_y =  base_z
three_z =  1.0 - base_x
```

---

## 7. WebSocket / REST API Surface

### 7.1 REST (`server.py`, prefix `/api/v1`)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/catalog` | Full message/signal contract catalogue |
| `GET /api/v1/status` | Backend status, CAN link, ROS status |
| `GET /api/v1/ros` | Raw ROS bridge snapshot |
| `GET /api/v1/mhr/meta` | MHR availability + joint topology |
| `GET /api/v1/mhr/topology` | Packed `uint32` LE triangle indices (binary) |
| `GET /api/v1/camera/stream` | MJPEG multipart live camera (≈25 FPS) |
| `GET /api/v1/camera/snapshot` | Single JPEG |
| `GET /camera` | Standalone full-screen camera viewer page |
| `GET /api/v1/lidar/status` `.../diagnostics` | LiDAR streamer diagnostics |
| `POST /api/v1/lidar/mode` | `filtered` / `raw` / `inspection` |
| `POST /api/v1/lidar/density` | `stride`, `target_points` |

Static frontend is mounted from `frontend/dist` (`server.py:862`), with SPA
fallback routing.

### 7.2 WebSockets

| Socket | Direction | Payload |
|--------|-----------|---------|
| `/ws/v1/stream` (alias `/ws`) | JSON text | `snapshot`, `batch` (25 Hz), `ros` (10 Hz) |
| `/ws/v1/lidar` (alias `/ws/lidar`) | Binary | Raw `Float32` `[x,y,z,intensity]·N` per frame |

**Stream message shape** (`server.py:446`):
```json
{
  "type": "batch" | "ros" | "snapshot",
  "total_frames": 123456,
  "uptime_sec": 42.0,
  "frames": [ FrameSnapshot... ],
  "telemetry": TelemetrySummary,
  "ros_status": RosStatus,
  "perception_objects": [ PerceptionObject... ],
  "planned_trajectory": [ {x,y,z}... ],
  "human_poses": HumanPosesPayload,
  "mhr_human": MhrHumanPayload
}
```

The frontend store (`frontend/src/store/canStore.ts:266`) merges each payload
into Zustand state; `isPaused` short-circuits all updates for frame-freezing.

---

## 8. 3D Rendering Subsystem

`DriveCockpit3D.tsx` owns the WebGL renderer, scene, camera modes and the
requestAnimationFrame loop (`DriveCockpit3D.tsx:102`). Every frame it pulls the
latest Zustand state and drives the sub-renderers.

### 8.1 Scene setup (`DriveCockpit3D.tsx:24`)

- Background/fog: `0x020412`, `FogExp2` density `0.015` (deep midnight navy).
- Camera: `PerspectiveCamera(50°, aspect, 0.1, 300)`.
- Renderer: `antialias: false`, `precision: 'mediump'`, `pixelRatio 1.0`,
  shadows off — tuned for Jetson-class GPUs.
- Lighting: ambient `0.75`, key directional `1.4` from front-left, fill
  `0.9` blue from rear-right, hemisphere cyan rim `0.6`.
- OrbitControls damping `0.05`, polar clamp `π/2 − 0.05`, distance `2–25 m`.

### 8.2 Ego vehicle — `TuktukVehicle.ts`

**Dimensions (exact, from the code):**
- Wheelbase `L = 2.000 m`; rear track `1.150 m` (half-track `0.575 m`).
- Wheel radius `0.203 m`, width `0.102 m`.
- Front wheel pivot at `(0, r, −1.0)`; rear wheels at `(±0.575, r, +1.0)`.
- Body `1.15 × 0.55 × 1.832 m` centred at `Z=0.516`; roof `1.10 × 0.08 × 1.75`
  at `Y=1.65`; headlights at `Z=−0.79`, taillights at `Z=+1.44`.

**Dynamic math (`TuktukVehicle.update`, `TuktukVehicle.ts:275`):**
```
speed_ms      = speedKmh * 1000 / 3600
wheelΔangle   = speed_ms * dt / wheelRadius            # wheel spin
steerTarget   = -(steerDeg * π/180)                    # front pivot
steerCurrent += (steerTarget - steerCurrent) * min(dt*15, 1)
lateralAcc    = speed_ms * (yawRateMrad / 1000)
targetRoll    = clamp(-lateralAcc * 0.04, -0.08, +0.08)   # 3-wheeler banks
rollCurrent  += (targetRoll - rollCurrent) * min(dt*10, 1)
targetPitch   = braking ? min((brakeKpa/5000)*0.04, 0.05) : 0
pitchCurrent += (targetPitch - pitchCurrent) * min(dt*12, 1)
```
Brake light color swaps between `0xf43f5e` (braking) and `0x500724` (idle)
when `brakeKpa > 20`.

**Asset pipeline:** a procedural box/canopy body is built immediately, then
replaced by the real `/models/etrike_body.obj` mesh once the OBJLoader resolves
(`TuktukVehicle.ts:227`). The procedural fallback guarantees the cockpit is never
empty while the asset loads.

### 8.3 Road & trajectory — `RoadEnvironment.ts`

- Road `14 m × 180 m`; ground plane `160 m × 180 m`; 30 lane dashes/line spaced
  `6.0 m`; boundaries and sidewalks drawn as line segments.
- Dashes scroll: `roadOffset += speed_ms·dt`, positions modulo `6.0`.
- **Planned-trajectory ribbon:** if ≥ 3 waypoints, the 32-segment `PlaneGeometry`
  ribbon vertices are set directly to `(x ± 0.7, 0.02, z)` from the ROS
  trajectory (`RoadEnvironment.ts:146`).
- **Kinematic fallback** when no trajectory (`RoadEnvironment.ts:157`):
  ```
  kappa  = tan(steerRad) / L        # L = 2.0 m wheelbase
  z      = -t * 32.0
  curveX = -0.45 * kappa * z²
  ```
  i.e. a parabolic approximation of a constant-curvature arc.
- Ribbon turns cyan + pulses in AUTO mode, neutral dark zinc in MANUAL.

### 8.4 LiDAR range rings — `LidarRangeRings.ts`

Concentric `LineLoop` rings at 5 m intervals to 40 m, centred at the roof mount
`(0, 0, 0.425)`; radial opacity `max(0.18, 0.75 − r/45·0.45)`; 10/20/30 m major
rings brighter; canvas-sprite distance labels (10/20/30/40 m) along −Z.

### 8.5 LiDAR point cloud — `LidarPointCloud.ts` (GPU path)

The streamed binary buffer is mapped into a `THREE.Points` with three dynamic
attributes: `position`, `intensity`, `age`. A rolling history of
`maxTrailFrames = 3` frames is concatenated (cap `maxPoints = 45000`) so old
sweeps fade out.

**Custom GLSL:**
- Vertex: perspective point attenuation
  `gl_PointSize = clamp(baseSize * (28.0/max(-mvPosition.z,0.45)), 1.2, 5.2)`,
  ground points sized finer than obstacles.
- Fragment: circular sprite with soft Gaussian alpha edge; temporal decay
  `alpha *= max(0.25, 1 - age*0.32)`; horizon fade
  `1 - smoothstep(42.0, 65.0, vDist)`; two-tier ground dimming.
- Three selectable palettes: **CYBER** (elevation), **PROXIMITY** (range bands
  red < 1.6 m, amber < 3.2 m, lime < 5.5 m, cyan beyond), **INTENSITY**.
- Ground modes: DIM / OFF / FULL. Self-reflections are tagged with negative
  intensity and drawn crimson in inspection mode.

### 8.6 Perception actors — `SurroundingTraffic.ts`

This is the largest renderer (2176 lines). It pools actors in a `Map` keyed by
object id and animates them at 60 FPS.

**Model selection** (`resolveActiveModel`, `SurroundingTraffic.ts:1285`):

| Perception label | Rendered model |
|------------------|----------------|
| `PEDESTRIAN` | SMPL/MHR humanoid + 17-joint rig |
| `CAR` | procedural sedan (1.85 × 1.45 × 4.3 m) |
| `TRUCK` / `BUS` | procedural van/bus |
| `BICYCLE` / `MOTORCYCLE` | two-wheeler + rider |
| `CONE` | highway cone |
| `CLUSTER` / `UNKNOWN` / `BOX` / `OBSTACLE` | glowing cluster box |

Scaling is driven by the detected dimensions: e.g. pedestrian height scale
`clamp(obj.dz/1.75, 0.8, 1.25)`; car
`(dy/1.85, dz/1.45, dx/4.3)`; cluster `(dy, dz, dx)`.

**Perception→human pose correlation** (`SurroundingTraffic.ts:1417`): each
`human_poses` entry is matched to an actor by ID then by nearest position within
**2.5 m**, using the transform `targetX = y_base`, `targetZ = 1.0 - x_base`.
Unmatched poses spawn new actors.

**Skeleton kinematics** — two paths:

1. **True 3D metric kinematics** (`keypoints_3d` present,
   `SurroundingTraffic.ts:1594`): vectors are projected into the pedestrian body
   frame via yaw rotation
   ```
   fwd = dx·cos(yaw) + dy·sin(yaw)
   lat = -dx·sin(yaw) + dy·cos(yaw)
   up  = dz
   ```
   - Arm pitch: `atan2(fwd, max(0.06, -up))`, clamped `[-0.6, 1.6]`.
   - Arm roll: `atan2(±lat, max(0.06, -up))`, clamped `[-0.4, 1.8]`.
   - Elbow flexion: `acos(clamp(dot(upper,fore)/(|upper|·|fore|), -1, 1))`.
   - Torso roll: `atan2(sh_dz, max(0.15, sh_dxy))`, clamped `[-0.25, 0.25]`.
   - Head yaw: `atan2(noseBody.lat, max(0.08, noseBody.fwd))`, clamped `[-0.65, 0.65]`.
2. **2D image-plane fallback** (`SurroundingTraffic.ts:1687`): uses pixel-space
   shoulder/elbow/wrist slopes with an `armSign` for facing direction.

**Procedural gait math** (`SurroundingTraffic.ts:1863`):
```
walkPhase  = animTime*5.2 + animSeed
walkAngle  = sin(walkPhase) * 0.42 * (1 - seatedBlend)
armAngle   = sin(walkPhase) * 0.35 * (1 - seatedBlend)
kneeFlex   = max(0, ±walkAngle*0.75) * (1 - seatedBlend)
```
A `seatedBlend` interpolates between the standing walk cycle and a seated
posture (hip flexion `−1.45`, knee flexion `+1.45`, arms onto lap).

**RTMPose-s 17-keypoint overlay** (`createRTMPoseSkeletonOverlay`,
`SurroundingTraffic.ts:538`): 17 emissive joint spheres + 16 bone cylinders
(`depthTest: false`, `renderOrder 150/155`) with per-group color coding (face sky,
torso cyan, arms electric-sky, legs amber/orange). Joint positions either come
from the live 3D keypoints or from an anatomically-aligned `fallbackLocal`
layout (`SurroundingTraffic.ts:2021`). Bones are positioned by
`midpoint + quaternion.setFromUnitVectors((0,1,0), dir.normalize())` and scaled
to segment length.

### 8.7 Human mesh assets & rigs

The dashboard ships several human representations, selected in fail-soft order:

| Asset | File | Role |
|-------|------|------|
| **Procedural avatar** | built in code | Immediate fallback: capsule-built athletic silhouette + visor |
| **`human_model.obj`** | `public/models/human_model.obj` (167 KB) | Authentic RViz2 human body mesh |
| **`pedestrian_smpl.glb`** | `public/models/pedestrian_smpl.glb` (2.3 MB) | Rigged 25-bone SkinnedMesh (bones named `m_avg_*`), LBS animation, scale `0.0096`, `rotation.y = π` |
| **MHR** | backend `mhr_model.pt` | Meta Momentum Human Rig TorchScript posed mesh, streamed live |

`generate_smpl_model.js` is the build-time generator that emits
`pedestrian_smpl.glb` from an articulated SMPL-like hierarchy with capsule
geometry and 17 RTMPose joint beacons.

### 8.8 MHR (Meta Momentum Human Rig) — exact math

**Backend engine** (`mhr_engine.py`):
- Loads TorchScript `mhr_model.pt` (`torch.jit.load(...).eval()`).
- **Units:** model returns vertices in **centimetres** → converted with
  `CM_TO_M = 0.01` (`mhr_engine.py:38`, `:191`).
- Parameters are clipped to the model's own `get_parameter_limits()` before
  evaluation (`mhr_engine.py:178`).
- Identity coeffs and 72 face-expression blendshapes are zeroed (neutral).
- **Ground snap:** translate so the lowest vertex sits at `y = 0`
  (`mhr_engine.py:196`).

**Keypoint→parameter mapper** (`mhr_pose_mapper.py`): maps 17 COCO keypoints to
MHR joint angles by name prefix (`_JOINT_PREFIXES`, `mhr_pose_mapper.py:55`).
Interior angle at B:
```
cosθ = clamp( dot(a-b, c-b) / (|a-b|·|c-b|), -1, 1 );  θ = acos(cosθ)
```
Signed 2D angle from reference to vector:
```
θ = atan2(cross, dot),  cross = ref.x*vec.y - ref.y*vec.x
```
Channels written: elbows (`π − interiorAngle`), shoulders/hips (deviation from
"arms/legs down"), spine (shoulder-mid over hip-mid, ×0.5), neck (nose vs
shoulder-mid, ×0.5). Seated actors get fixed `SEATED_HIP_FLEXION = 85°`,
`SEATED_KNEE_FLEXION = 80°`. Truncated actors drop lower-body channels.

**Service** (`mhr_service.py`): evaluates at most **12 Hz**
(`DEFAULT_MIN_INTERVAL_SEC = 1/12`), selects the `max_actors = 2` nearest
pedestrians by `est_z`, and base64-encodes each actor's `float32` LE
`vertices`/`joints` (`_encode_f32`, `mhr_service.py:26`).

**Frontend** (`MhrHuman.ts`): fetches packed topology once, keeps one persistent
mesh per actor, only overwrites the position buffer + recomputes normals when
the backend `revision` changes (`MhrHuman.ts:100`). Native MHR faces +Z, cockpit
actor forward is −Z, so meshes are rotated by `MHR_FORWARD_OFFSET = π`.

### 8.9 Cockpit HUD — `CockpitHud.tsx` + `AutomotiveTelltales.tsx`

Flat, high-contrast, glanceable HUD overlay drawn in DOM/CSS:

- **Telltales** (ISO 2575 styling): PARK, BRAKE, HOLD, READY, EPS, ESTOP, ECU
  TEMP, CAN BUS, HIGH BEAM, HAZARD — each an inline SVG. Consistent with the
  embedded rule "never communicate status by color alone".
- **PRND selector**, 80–96 px speedometer, steering light-tube (center-detent,
  `±45°` full scale), hydraulic brake bar (`0–5000 kPa`), motor RPM + throttle
  tube, CAN bus rate, and CAN controller TEC/REC counters (from `0x620`/`0x600`).
- **Derived HUD states:** `isEpsWarning = steerFault || |steerCmd − steerAct| > 5°`,
  `isHold = speed < 0.5 && brake > 250 kPa`, `maxEcuTemp = max(steerTemp, brakeTemp)`.
- **Proximity banner** (`CockpitHud.tsx:146`): objects with `0 < -z < 25` and
  `|x| < 3.0` m are corridor threats; the nearest is shown if within 12 m
  (pedestrian) or 8 m (vehicle), with LEFT/RIGHT side hint.
- **Braking red flare** and **full-screen E-STOP strobe** are full-viewport
  overlays so a critical fault can never be hidden behind navigation.

### 8.10 Camera modes (`DriveCockpit3D.tsx:158`)

| Mode | Camera position | Look-at | Notes |
|------|-----------------|---------|-------|
| `chase` | `(0, 3.2, 5.8)` lerped | `(0, 0.85, −5.0)` | `factor = min(dt·5, 1)` smoothing |
| `cabin` | `(0, 1.30, −0.40)` | `(0, 1.05, −25)` | ego mesh hidden |
| `orbit` | OrbitControls, target `(0, 0.75, 0.2)` | — | user-controlled |

Hotkeys 1/2/3, Tab to switch view; state persisted in `localStorage`.

---

## 9. Frontend Architecture

### 9.1 Stack

- **React 18** + **TypeScript 5.7** (strict), **Vite 6** build.
- **Zustand** single store (`store/canStore.ts`) — 330 lines, the app's entire state.
- **Three.js 0.186** for all 3D.
- **@tanstack/react-virtual** for the virtualized CAN directory.
- **Tailwind CSS 3.4** + **lucide-react** icons.

### 9.2 Store shape (`canStore.ts`)

Live data: `catalog`, `framesById`, `telemetry`, `perceptionObjects`,
`plannedTrajectory`, `rosStatus`, `humanPoses`, `mhrHuman`, `totalFrames`,
`uptimeSec`, `isConnected`.

View preferences (persisted to `localStorage`): `zoomLevel`, `cameraMode`,
`activeView`, `showTukTuk`, `showSpeed`, `showSkeletons`, `showPointCloud`.

`initWebSocket` (`canStore.ts:243`) is idempotent, picks the correct host for dev
(`:5173` → backend `:8080`) vs. production, and auto-reconnects after 1.5 s.

### 9.3 Component tree

```
App
├── Topbar                       (view switcher, search, filters, zoom, status)
├── activeView === 'cockpit' → DriveCockpit3D
│     ├── CockpitHud             (HUD overlay + AutomotiveTelltales)
│     └── (WebGL canvas)
│           ├── RoadEnvironment
│           ├── LidarRangeRings
│           ├── LidarPointCloud   (+ useLidarStream)
│           ├── TuktukVehicle
│           └── SurroundingTraffic
│                 └── MhrHuman
├── activeView === 'radar' → RadarView
└── activeView === 'monitor'
      ├── TelemetrySidebar
      ├── CanDirectoryTable      (virtualized)
      └── BitMatrix64 + SignalRoster
```

### 9.4 Interaction & accessibility

- Global hotkeys: Space pause, Tab cycle view, 1/2/3 camera, Ctrl±/0 zoom
  (`App.tsx:37`).
- `SignalRoster` supports ↑/↓/Esc navigation between signals.
- UI zoom applied via `document.documentElement.style.zoom`.
- Radar uses class **glyphs** (C/T/B/P/…) so status is never color-only.

---

## 10. The 360° Radar — `RadarView.tsx`

Pure-SVG polar projection (640 px scope). Object math (`RadarView.tsx:61`):
```
lat = obj.x                     # right positive
lon = -obj.z                    # forward positive
dist = hypot(lat, lon)
bearingDeg = round(atan2(lat, lon)·180/π), wrapped to [0,360)
```
Range rings at 25/50/75/100 % of the selected range (15/25/40 m). A Kinect
70° forward-FOV arc is drawn; a rotating sweep beam animates at 140°/s. The
right pane lists actors sorted by proximity with a threat banner
(CRITICAL < 2.0 m, CAUTION < 4.5 m).

---

## 11. Persistence & Configuration

| Item | Mechanism |
|------|-----------|
| Backend port | `--port` or `AV_DASHBOARD_PORT` env (`electron/main.js:39`) |
| CAN interface | `--interface` (default `can2`) |
| Contracts dir | `--yaml-dir`, else workspace search, else git fallback |
| Simulate | `--sim` |
| MHR model path | `MHR_MODEL_PATH` env, else `data/mhr_assets/mhr_model.pt` |
| ROS transport | `RMW_IMPLEMENTATION=rmw_cyclonedds_cpp` (scripts) |
| UI preferences | browser `localStorage` |

---

## 12. Fail-Soft / Fail-Closed Design

The dashboard degrades gracefully at every layer:

| Failure | Behaviour | Source |
|---------|-----------|--------|
| `rclpy` not importable | bridge marked unavailable; CAN-only operation continues | `ros2_bridge.py:171` |
| No ego pose | objects hidden, HUD shows "WAITING FOR LOCALIZATION" | `ros2_bridge.py:699`, `DriveCockpit3D.tsx:143` |
| CAN interface down | SocketCAN retries every 1.5 s; telemetry shows `OFFLINE` | `transport.py:112` |
| CAN stops mid-stream | per-ID rates decay to 0 within 1 s | `server.py:120` |
| MHR assets/torch missing | procedural pedestrian mesh remains authoritative | `mhr_engine.py:89` |
| MHR topology not yet loaded | `MhrHuman` hides its group and retries | `MhrHuman.ts:70` |
| WebGL context creation fails | renderer init caught, cockpit disabled, UI survives | `DriveCockpit3D.tsx:48` |
| OBJ/GLB asset load fails | procedural fallback body/avatar stays | `TuktukVehicle.ts:269` |
| WebSocket drops | client reconnects (1.5 s stream, 2 s LiDAR) | `canStore.ts:316` |

---

## 13. Build & Run

**Backend**
```bash
export PYTHONPATH=$WORKSPACE_ROOT
python3 -m tools.av_dashboard.backend.server --interface can2 --port 8080
# simulation:
python3 -m tools.av_dashboard.backend.server --sim --port 8080
```

**Frontend**
```bash
cd tools/av_dashboard/frontend
pnpm install
pnpm dev      # vite dev server :5173, proxies /api and /ws to :8080
pnpm build    # tsc && vite build → dist/
```

**Electron**
```bash
cd tools/av_dashboard/electron && npm start
```

**Convenience scripts**
- `scripts/run_av_dashboard.ps1` (Windows)
- `scripts/run_av_dashboard.sh` (host/Jetson)
- `scripts/run_dashboard_backend.sh` (containerised, CycloneDDS)
- `scripts/open_av_dashboard_display.sh` (Jetson kiosk, docker `autoware_test`)

**MHR self-test**
```bash
python -m tools.av_dashboard.backend.mhr_selftest
```

---

## 14. File Map

```
tools/av_dashboard/
├── ARCHITECTURE.md                  ← this document
├── backend/
│   ├── server.py                    FastAPI app, WS broadcasters, telemetry math
│   ├── contracts.py                 YAML contract loader + bit-level decoder
│   ├── transport.py                 SocketCAN / Simulated / Offline transports
│   ├── ros2_bridge.py               rclpy subscriptions + coordinate transforms
│   ├── lidar_streamer.py            PointCloud2 decode + binary Float32 packer
│   ├── mhr_engine.py                TorchScript MHR wrapper
│   ├── mhr_pose_mapper.py           COCO keypoints → MHR parameter vector
│   ├── mhr_service.py               MHR eval loop + streamed payload
│   ├── mhr_selftest.py              standalone MHR validation
│   └── requirements-mhr.txt         optional torch/mhr deps
├── contracts/                       network/host/rt/sys/hmi/mtr/pwt/seb/ses YAML
├── data/mhr_assets/mhr_model.pt     MHR TorchScript asset (optional)
├── electron/                        desktop shell (spawns backend, loads URL)
└── frontend/
    ├── index.html, vite.config.ts, tailwind.config.js, tsconfig.json
    ├── scripts/generate_smpl_model.js   build-time GLB generator
    ├── public/models/                etrike_body.obj/stl, human_model.obj,
    │                                 pedestrian_smpl.glb, SMPL UV textures
    └── src/
        ├── App.tsx, main.tsx
        ├── store/canStore.ts          Zustand live store + WS client
        ├── types/can.ts               all shared TS models
        ├── styles/index.css
        └── components/
            ├── Topbar.tsx, TelemetrySidebar.tsx, CanDirectoryTable.tsx,
            │   BitMatrix64.tsx, SignalRoster.tsx
            ├── radar/RadarView.tsx
            └── cockpit/
                ├── DriveCockpit3D.tsx      scene + animation loop
                ├── CockpitHud.tsx          HUD overlay
                ├── AutomotiveTelltales.tsx ISO 2575 telltales
                ├── TuktukVehicle.ts        ego vehicle + dynamics
                ├── RoadEnvironment.ts      road + trajectory ribbon
                ├── LidarRangeRings.ts      polar range rings
                ├── LidarPointCloud.ts      GPU point cloud + GLSL
                ├── useLidarStream.ts       binary WS client
                ├── SurroundingTraffic.ts   actor renderer + rigs
                ├── MhrHuman.ts             MHR mesh consumer
                ├── PerceptionRadar.tsx     mini HUD radar
                └── SensorTriadIndicator.tsx camera/LiDAR/mode chip
```

---

## 15. Key Invariants (do not break)

1. **One Three.js frame for all producers.** `three_z = 1.0 − base_x` must hold
   in `ros2_bridge`, `lidar_streamer`, and the rendered vehicle/algorithms, or
   the cloud, boxes and trajectory will not coexist.
2. **`det_N` IDs are load-bearing.** MHR binds posed meshes by actor id; the
   perception arbitration and dedup passes deliberately preserve `det_N`.
3. **CAN tasks never touch the renderer.** They write JSON/binary; the UI reads
   state. The only shared mutable state is the thread-safe bridge snapshots.
4. **Fail-soft visuals, fail-closed semantics.** Missing assets never blank a
   critical indicator; critical warnings are full-viewport and never navigable-away.
5. **Assets over procedural only when resolved.** Procedural meshes are the
   guaranteed fallback; loaded assets replace them in place.
