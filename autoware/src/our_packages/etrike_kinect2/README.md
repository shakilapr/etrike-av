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
