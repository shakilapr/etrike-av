# etrike_kinect2

Kinect v2 ROS 2 driver for the E-Trike. Two Kinect One sensors (front + rear) via `libfreenect2`.

## Architecture

```
libfreenect2 (CPU-only)
     │
Kinect2Device (no ROS)
     │
Kinect2Node (rclcpp_lifecycle::LifecycleNode, one per camera)
     │
     ├── /kinect_front/color/image_raw  (sensor_msgs/Image, bgr8)
     ├── /kinect_front/color/camera_info
     ├── /kinect_front/depth/image_raw  (sensor_msgs/Image, 32FC1 meters)
     ├── /kinect_front/depth/camera_info
     ├── /kinect_front/ir/image_raw     (optional)
     └── /diagnostics
```

- One ROS node = one physical Kinect = one serial number
- Each node is a LifecycleNode: UNCONFIGURED → INACTIVE → ACTIVE
- The launch files **auto-configure and auto-activate** the node deterministically:
  `RegisterEventHandler(OnStateTransition(inactive))` is registered BEFORE the
  node, then `ChangeState(CONFIGURE)` is emitted explicitly (no `OnProcessStart`
  — that is racy). See `docs/KINECT2_BRINGUP.md` §4.3.
- Topics are remapped to `/kinect_{front,rear}/...` while the node keeps a root
  name so the param-file key `kinect_front:` still matches (§4.4 of the doc).
- **Hotplug-aware**: the device does NOT need to be connected at configure/launch
  time. The node starts, waits, and connects automatically when the target
  serial appears on USB. Unplug → clean disconnect; replug → auto-reconnect.
- While disconnected (no USB, or empty serial) the node stays ACTIVE and
  publishes `waiting for USB` / `waiting for config` diagnostics — it never
  crashes waiting for hardware.
- Two processes (not one container) so one crash doesn't kill both
- TF is owned by URDF, not the driver
- CameraInfo is a placeholder (uncalibrated); dimensions are correct
  (1920×1080 color, 512×424 depth). Fill real intrinsics from URDF later.
- No PointCloud2 from driver — use `depth_image_proc` downstream

## Logic

```
Kinect2Node (LifecycleNode)
  on_configure():
      load params (serial, frame_ids, enable flags)
      build placeholder CameraInfo (uncalibrated)
      create publishers
      return SUCCESS        # device NOT required to be connected yet

  on_activate():
      running_ = true
      spawn capture_thread_ = capture_loop()

  capture_loop():                  # dedicated thread, NOT ros callback
      while running_:
          # --- hotplug discovery (every discover_interval_s) ---
          devices = enumerateDevices()
          present = serial in devices
          if device open AND !present:
              disconnect_device()          # unplugged
          if !device AND present:
              try_connect()                # plugged in → open + start
          # --- streaming (if connected) ---
          if device connected and streaming:
              frames = wait_for_frames(timeout=frame_timeout_ms)
              if !frames:
                  timeouts_++
                  if timeouts_ > reconnect_attempts_:
                      disconnect_device()  # likely unplugged
              else:
                  device_ok_ = true
                  stamp = now()
                  if color_enabled: publish color/image_raw + color/camera_info
                  if depth_enabled: publish depth/image_raw + depth/camera_info
                  if ir_enabled:    publish ir/image_raw
                  release_frames(frames)
          # 1 Hz diagnostics (published even while disconnected)
          if (now - last_diag_time) >= 1s:
              publish /diagnostics (connected bool, fps, timeouts, connects, disconnects)
          sleep(poll_interval_ms)

  try_connect():   open(serial) → start(); on success connects_++
  disconnect_device():  stop(); close(); reset(); disconnects_++
  on_deactivate(): running_=false, join thread, disconnect_device()
  on_cleanup():     reset device + publishers
  on_error():       close device, reset
```

## Topics

### Subscribed
| Topic | Type | QoS | Purpose |
|---|---|---|---|
| — | — | — | No subscriptions (pure publisher; serial via param) |

### Published (per camera, under `/kinect_front/` / `/kinect_rear/`)
| Topic | Type | QoS | Purpose |
|---|---|---|---|
| `color/image_raw` | `sensor_msgs/Image` (bgr8, 1920×1080) | SensorData (Best Effort) | RGB |
| `color/camera_info` | `sensor_msgs/CameraInfo` | SensorData (Best Effort) | RGB intrinsics (factory) |
| `depth/image_raw` | `sensor_msgs/Image` (32FC1, 512×424, meters) | SensorData (Best Effort) | Depth |
| `depth/camera_info` | `sensor_msgs/CameraInfo` | SensorData (Best Effort) | Depth intrinsics (factory) |
| `depth_registered/image_raw` | `sensor_msgs/Image` (bgr8, 512×424) | SensorData (Best Effort) | Color-aligned RGB (if `registration_enabled`) |
| `ir/image_raw` | `sensor_msgs/Image` (mono8) | SensorData (Best Effort) | IR (if `ir_enabled`) |
| `/diagnostics` | `diagnostic_msgs/DiagnosticArray` | SensorData (Best Effort) | FPS, drops, timeouts, reconnects, device health (per-camera name) |

> CameraInfo intrinsics come from libfreenect2's factory calibration
> (`getColorCameraParams` / `getIrCameraParams`), not placeholders — safe for
> `depth_image_proc` / point-cloud generation.
>
> RViz Image displays must use **Best Effort** QoS to receive these streams.

> `frame_id` of each image = `frame_id_color` / `frame_id_depth` / `frame_id_ir`
> (default `kinect_front_rgb_optical_frame`, etc., defined in URDF).

## Inter-package wiring
- `etrike_sensor_kit_description/urdf/kinect_v2.xacro` defines the optical frames.
- `sensing.launch.xml` (etrike_sensor_kit_launch) includes `dual_kinect.launch.py`
  guarded by `launch_kinect:=true`.
- Downstream `depth_image_proc` consumes `depth/image_raw` + `depth/camera_info`
  to produce PointCloud2 (not done in this package).

## Prerequisites

### libfreenect2

The package links against libfreenect2 via pkg-config (module name
`freenect2`). The recommended path is to build the derived image that layers
libfreenect2 on top of the Autoware base (so builds are reproducible and
survive container recreation):

```bash
./docker/make_image.sh          # tags etrike-kinect-build:latest
./docker/build.sh               # builds E-Trike packages in that image
```

To install libfreenect2 manually into a running container instead, build and
install it CPU-only (no OpenCL/CUDA/OpenGL needed on the Jetson):

```bash
sudo apt install -y build-essential cmake pkg-config \
    libusb-1.0-0-dev libturbojpeg0-dev libglfw3-dev

git clone https://github.com/OpenKinect/libfreenect2.git
cd libfreenect2
mkdir build && cd build
cmake .. -DENABLE_OPENCL=OFF -DENABLE_CUDA=OFF -DENABLE_OPENGL=OFF \
    -DENABLE_VAAPI=OFF -DENABLE_TEGRAJPEG=OFF -DBUILD_OPENNI2_DRIVER=OFF \
    -DCMAKE_INSTALL_PREFIX=/usr
make -j$(nproc)
sudo make install
sudo ldconfig
# verify:
pkg-config --exists freenect2 && echo "libfreenect2 OK"
```

### udev rules

```bash
sudo cp ../platform/linux/udev/90-kinect2.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules && sudo udevadm trigger
```

### USBFS memory (for two Kinects)

```bash
echo 64 | sudo tee /sys/module/usbcore/parameters/usbfs_memory_mb
```

## Build

```bash
cd ~/ros2_ws
colcon build --symlink-install --packages-select etrike_kinect2
source install/setup.bash
```

## Usage

### Discover serial numbers

```bash
./run.sh discover
# or:
ros2 run etrike_kinect2 kinect2_node_exec --discover
```

### Edit config with discovered serials

```bash
vi config/kinect_front.yaml   # set serial: "012345678901"
vi config/kinect_rear.yaml    # set serial: "109876543210"
```

### Launch

```bash
ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front   # front only
ros2 launch etrike_kinect2 single_kinect.launch.py camera:=rear    # rear only
ros2 launch etrike_kinect2 dual_kinect.launch.py                   # both (no RViz)
```

### View RGB + Depth on the Jetson monitor

The Kinect is physically plugged into the Jetson. The monitor attached to the
Jetson is `DISPLAY=:1` (inside the Docker container, X11 is passed through
`/tmp/.X11-unix`). All viewers below force `:1`, so the window always appears
on the Jetson's monitor, never on Windows — whether you run them from the
Jetson's own terminal or over SSH.

#### Aspect-correct preview (recommended): rqt_image_view

RViz's `Image` display **stretches** the frame to fill its panel (no aspect-ratio
lock), so the 16:9 color feed and the 512×424 depth feed get distorted.
`rqt_image_view` preserves the native aspect ratio — use it whenever you want an
honest view of what the camera sees.

Color:

```bash
ros2 run rqt_image_view rqt_image_view /kinect_front/color/image_raw
# or: ./run.sh viewrgb front
```

Depth:

```bash
ros2 run rqt_image_view rqt_image_view /kinect_front/depth/image_raw
# or: ./run.sh viewdepth front
```

For the rear camera use `/kinect_rear/...` (and `./run.sh viewrgb rear` /
`./run.sh viewdepth rear`).

> `rqt_image_view` is installed in the image (`docker/Dockerfile.kinect` installs
> `ros-humble-rqt-image-view`). Its binary is
> `/opt/ros/humble/lib/rqt_image_view/rqt_image_view`.

#### Multi-panel view (stretched): RViz

If you want several streams in one window (front color + front depth + rear
color + rear depth), RViz does it — but be aware the images are stretched to
fill the panels:

```bash
ros2 launch etrike_kinect2 kinect_view.launch.py camera:=dual
# or: ./run.sh view dual
```

From over SSH:

```bash
ssh med1@172.16.25.56
./docker/shell.sh            # enter the container
./run.sh view dual           # window appears on the Jetson monitor (DISPLAY=:1)
```

**X authorization (one-time after a container recreate):** a fresh container is a
new X client, so re-allow it on the Jetson host:

```bash
DISPLAY=:1 xhost +local:
```

If the container is not running yet, start it with the display passthrough
(one-time, from the Jetson host):

```bash
DISPLAY=:1 xhost +local:docker
docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -e DISPLAY=:1 -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/av_project/autoware:/workspace/autoware \
  -v /dev/bus/usb:/dev/bus/usb \
  etrike-kinect-build:latest \
  bash -c 'while true; do sleep 1000; done'
```

Then, from the Jetson host (or over SSH):

```bash
docker exec -it autoware_test bash -c \
  'export DISPLAY=:1; source /opt/ros/humble/setup.bash; \
   source /workspace/autoware/install/setup.bash; \
   colcon build --symlink-install --packages-select etrike_kinect2; \
   ros2 launch etrike_kinect2 kinect_view.launch.py camera:=dual'
```

**Data flow when you plug a Kinect into USB:**
```
USB 3.0 port (SuperSpeed)
   │ libfreenect2 (kernel usb + libusb, CUDA depth pipeline)
   ▼
Kinect2Device (enumerate by serial → openDevice)
   │ wait_for_frames() in capture thread (~30 Hz with CUDA)
   ▼
Kinect2Node (LifecycleNode)
   │ frame_converter (libfreenect2 Frame → sensor_msgs/Image)
   ▼
/kinect_front/{color,depth,depth_registered}/image_raw   (bgr8 / 32FC1-meters / bgr8)
   │
   ▼
rqt_image_view (aspect-correct) or RViz2 (stretched) on DISPLAY=:1
```

> Depth is published as `32FC1` **meters** (not mm, not encoded). In RViz the
> depth panel renders it as a grayscale heightmap; for a colored point cloud,
> pipe `depth/image_raw` + `depth/camera_info` into `depth_image_proc`.

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `serial` | string | `""` | Kinect v2 serial number (required) |
| `color_enabled` | bool | `true` | Publish RGB |
| `depth_enabled` | bool | `true` | Publish depth |
| `ir_enabled` | bool | `false` | Publish IR |
| `registration_enabled` | bool | `true` | libfreenect2 depth↔RGB registration |
| `frame_id_color` | string | `kinect_front_rgb_optical_frame` | TF frame for RGB |
| `frame_id_depth` | string | `kinect_front_depth_optical_frame` | TF frame for depth |
| `depth_min_m` | double | `0.5` | Min depth range |
| `depth_max_m` | double | `4.5` | Max depth range |
| `reconnect_attempts` | int | `3` | Max timeouts before treating device as gone |
| `reconnect_delay_s` | double | `2.0` | (reserved) delay between reconnects |
| `discover_interval_s` | double | `1.0` | USB re-enumeration period while disconnected |
| `frame_timeout_ms` | int | `5000` | Per-frame wait timeout |
| `poll_interval_ms` | int | `100` | Idle loop sleep between discovery/stream polls |

## USB Topology

Do not put both Kinects on the same USB hub. Use separate SuperSpeed paths:

```
Kinect FRONT → USB-A SuperSpeed (onboard hub)
Kinect REAR  → USB-C J39/J40 (separate path via adapter)
```

Verify with `lsusb -t` that each Kinect shows `5000M` under different paths.

## Troubleshooting

| Symptom | Fix |
|---|---|
| No devices found | Check USB 3.0, udev rules, `lsusb` |
| One works, two fails | Separate USB paths, increase usbfs_memory_mb |
| Bandwidth error | Change USB controller, not memory |
| Timeout + reconnect | Check cable, powered adapter |
