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
     ├── /kinect/{front,rear}/color/image_raw  (sensor_msgs/Image, bgr8)
     ├── /kinect/{front,rear}/color/camera_info
     ├── /kinect/{front,rear}/depth/image_raw  (sensor_msgs/Image, 32FC1 meters)
     ├── /kinect/{front,rear}/depth/camera_info
     ├── /kinect/{front,rear}/ir/image_raw     (optional)
     └── /diagnostics
```

- One ROS node = one physical Kinect = one serial number
- Each node is a LifecycleNode: UNCONFIGURED → INACTIVE → ACTIVE
- Fail-closed: if configure fails, stays UNCONFIGURED
- Automatic recovery on USB timeout (bounded retries → lifecycle ERROR)
- Two processes (not one container) so one crash doesn't kill both
- TF is owned by URDF, not the driver
- No PointCloud2 from driver — use `depth_image_proc` downstream

## Logic

```
Kinect2Node (LifecycleNode)
  on_configure():
      load params (serial, frame_ids, enable flags)
      if serial == "": return FAILURE
      device_.open(serial)         # libfreenect2 enumerate → openDevice
      create publishers + camera_info_managers
      return SUCCESS

  on_activate():
      device_.start()              # streaming begins
      spawn capture_thread_ = capture_loop()

  capture_loop():                  # dedicated thread, NOT ros callback
      while running_:
          frames = wait_for_frames(timeout=5000)
          if !frames:
              timeouts_++
              if timeouts_ > reconnect_attempts_:
                  device_.stop(); device_.close()
                  sleep(reconnect_delay_s_)
                  if device_.open(serial) && device_.start():
                      reconnects_++; timeouts_ = 0
                  else:
                      device_ok_ = false; break
              continue
          device_ok_ = true
          stamp = now()
          if color_enabled: publish color/image_raw + color/camera_info
          if depth_enabled: publish depth/image_raw + depth/camera_info
          if ir_enabled:    publish ir/image_raw
          release_frames(frames)
          # 1 Hz diagnostics
          if (now - diag_timer) >= 1s:
              publish /diagnostics (fps, drops, timeouts, reconnects)

  on_deactivate(): stop streaming, join thread, stop device
  on_cleanup():     reset device + publishers
  on_error():       close device, reset
```

## Topics

### Subscribed
| Topic | Type | QoS | Purpose |
|---|---|---|---|
| — | — | — | No subscriptions (pure publisher; serial via param) |

### Published (per camera, under `/kinect/{front,rear}/`)
| Topic | Type | QoS | Purpose |
|---|---|---|---|
| `color/image_raw` | `sensor_msgs/Image` (bgr8, 1920×1080) | SensorData | RGB |
| `color/camera_info` | `sensor_msgs/CameraInfo` | SensorData | RGB intrinsics |
| `depth/image_raw` | `sensor_msgs/Image` (32FC1, 512×424, meters) | SensorData | Depth |
| `depth/camera_info` | `sensor_msgs/CameraInfo` | SensorData | Depth intrinsics |
| `ir/image_raw` | `sensor_msgs/Image` (mono8) | SensorData | IR (if `ir_enabled`) |
| `/diagnostics` | `diagnostic_msgs/DiagnosticArray` | SensorData | FPS, drops, timeouts, reconnects, device health |

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
./run.sh front    # front only
./run.sh rear     # rear only
./run.sh dual     # both
```

### View RGB + Depth on the Jetson monitor

The Kinect is physically plugged into the Jetson. The monitor attached to the
Jetson is `DISPLAY=:1` (inside the Docker container, X11 is passed through
`/tmp/.X11-unix`). So you open the window **from inside the container**, not
from Windows.

**One command (after the container is up):**

```bash
# On the Jetson (SSH into it, then enter the container):
./docker/shell.sh
# inside container:
ros2 launch etrike_kinect2 kinect_view.launch.py camera:=dual
```

This opens an RViz2 window on the Jetson's monitor showing four `Image` panels:
front color, front depth, rear color, rear depth.

If the container is not running yet, start it with the display passthrough
(one-time, from the Jetson host):

```bash
DISPLAY=:1 xhost +local:docker
docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all \
  --net=host --ipc=host \
  -e DISPLAY=:1 -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v ~/av_project/autoware:/workspace/autoware \
  ghcr.io/autowarefoundation/autoware:universe-cuda-humble \
  bash -c 'while true; do sleep 1000; done'
```

Then, from the Jetson host:

```bash
docker exec -it autoware_test bash -c \
  'export DISPLAY=:1; source /opt/autoware/setup.bash; \
   source /workspace/autoware/install/setup.bash; \
   colcon build --symlink-install --packages-select etrike_kinect2; \
   ros2 launch etrike_kinect2 kinect_view.launch.py camera:=dual'
```

> If you prefer a bare image view (lighter than RViz) on the same monitor:
> ```bash
> ros2 run rqt_image_view rqt_image_view /kinect/front/color/image_raw
> ```

**Data flow when you plug a Kinect into USB:**
```
USB 3.0 port (SuperSpeed)
   │ libfreenect2 (kernel usb + libusb)
   ▼
Kinect2Device (enumerate by serial → openDevice)
   │ wait_for_frames() in capture thread
   ▼
Kinect2Node (LifecycleNode)
   │ frame_converter (libfreenect2 Frame → sensor_msgs/Image)
   ▼
/kinect/{front,rear}/{color,depth}/image_raw   (bgr8 / 32FC1-meters)
   │
   ▼
RViz2 Image panel (on DISPLAY=:1)  ← you see RGB + depth live
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
| `frame_id_color` | string | `kinect_color_optical_frame` | TF frame for RGB |
| `frame_id_depth` | string | `kinect_depth_optical_frame` | TF frame for depth |
| `depth_min_m` | double | `0.5` | Min depth range |
| `depth_max_m` | double | `4.5` | Max depth range |
| `reconnect_attempts` | int | `3` | Max reconnect retries |
| `reconnect_delay_s` | double | `2.0` | Delay between reconnects |

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
