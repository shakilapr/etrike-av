#!/usr/bin/env bash
set -e

source /opt/ros/humble/setup.bash
source /workspace/autoware/install/setup.bash

echo "=== 0. Pre-cleaning any stale processes ==="
pkill -9 -f kinect2_node_exec 2>/dev/null || true
pkill -9 -f yolo_perception_node 2>/dev/null || true
sleep 1

echo "=== 1. Starting Kinect v2 Front Driver ==="
ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front > /tmp/kinect_run.log 2>&1 &
KINECT_PID=$!
echo "Kinect launcher PID: $KINECT_PID"

cleanup() {
    echo "=== Cleaning up test processes ==="
    kill -9 $KINECT_PID 2>/dev/null || true
    pkill -9 -f kinect2_node_exec 2>/dev/null || true
    pkill -9 -f yolo_perception_node 2>/dev/null || true
}
trap cleanup EXIT INT TERM

sleep 4
echo "--- Kinect Driver Startup Log: ---"
cat /tmp/kinect_run.log | tail -n 15 || true

echo "=== 2. Starting YOLO Perception Node (Bench Isolation Mode) ==="
ros2 launch etrike_yolo_perception yolo_perception.launch.py publish_mode:=bench > /tmp/yolo_run.log 2>&1 &
YOLO_PID=$!
echo "YOLO launcher PID: $YOLO_PID"

sleep 5
echo "--- YOLO Perception Startup Log: ---"
cat /tmp/yolo_run.log | tail -n 15 || true

echo "=== 3. Listing Active Topics ==="
ros2 topic list | grep -E "bench_perception|kinect" || true

echo "=== 4. Sampling /bench_perception/status ==="
python3 -c "
import rclpy
from std_msgs.msg import String

rclpy.init()
node = rclpy.create_node('status_listener')
received = []

def cb(msg):
    print(f'STATUS TELEMETRY: {msg.data}')
    received.append(msg.data)

sub = node.create_subscription(String, '/bench_perception/status', cb, 10)
start_time = node.get_clock().now()
while (node.get_clock().now() - start_time).nanoseconds < 4e9 and len(received) < 3:
    rclpy.spin_once(node, timeout_sec=0.2)

if not received:
    print('WARNING: No status telemetry received within 4 seconds')
node.destroy_node()
rclpy.shutdown()
" || true

echo "=== 5. Sampling /bench_perception/objects ==="
python3 -c "
import rclpy
from autoware_perception_msgs.msg import DetectedObjects

rclpy.init()
node = rclpy.create_node('objects_listener')
received = []

def cb(msg):
    print(f'DETECTED OBJECTS: count={len(msg.objects)} frame={msg.header.frame_id}')
    for i, obj in enumerate(msg.objects):
        cls_name = obj.classification[0].label if obj.classification else 'unknown'
        prob = obj.classification[0].probability if obj.classification else 0.0
        pos = obj.kinematics.pose_with_covariance.pose.position
        print(f'  [{i}] class_label={cls_name} prob={prob:.2f} pos=({pos.x:.2f}, {pos.y:.2f}, {pos.z:.2f})')
    received.append(msg)

sub = node.create_subscription(DetectedObjects, '/bench_perception/objects', cb, 10)
start_time = node.get_clock().now()
while (node.get_clock().now() - start_time).nanoseconds < 4e9 and len(received) < 2:
    rclpy.spin_once(node, timeout_sec=0.2)

if not received:
    print('WARNING: No detected objects received within 4 seconds')
node.destroy_node()
rclpy.shutdown()
" || true

echo "=== 5.1 Saving live debug frame to /workspace/data/live_yolo_debug.jpg ==="
python3 -c "
import cv2
from cv_bridge import CvBridge
import rclpy
from rclpy.qos import qos_profile_sensor_data
from sensor_msgs.msg import Image

rclpy.init()
node = rclpy.create_node('img_saver')
bridge = CvBridge()
saved = False

def cb(msg):
    global saved
    if not saved:
        frame = bridge.imgmsg_to_cv2(msg, desired_encoding='bgr8')
        cv2.imwrite('/workspace/data/live_yolo_debug.jpg', frame)
        print('Saved live annotated debug frame successfully: /workspace/data/live_yolo_debug.jpg')
        saved = True

sub = node.create_subscription(Image, '/bench_perception/camera/debug_image', cb, qos_profile_sensor_data)
start_time = node.get_clock().now()
while (node.get_clock().now() - start_time).nanoseconds < 4e9 and not saved:
    rclpy.spin_once(node, timeout_sec=0.2)

node.destroy_node()
rclpy.shutdown()
" || true

echo "=== 5.2 Sampling /bench_perception/human_poses ==="
python3 -c "
import rclpy
from std_msgs.msg import String
import json

rclpy.init()
node = rclpy.create_node('poses_listener')
received = []

def cb(msg):
    data = json.loads(msg.data)
    print(f'HUMAN POSES: count={data.get(\"count\", 0)}')
    for p in data.get('poses', []):
        print(f'  pose id={p.get(\"id\")} posture={p.get(\"posture\")} is_seated={p.get(\"is_seated\")} conf={p.get(\"confidence\")}')
    received.append(data)

sub = node.create_subscription(String, '/bench_perception/human_poses', cb, 10)
start_time = node.get_clock().now()
while (node.get_clock().now() - start_time).nanoseconds < 4e9 and len(received) < 2:
    rclpy.spin_once(node, timeout_sec=0.2)

if not received:
    print('NOTE: No human poses received (no person in frame or waiting for detection)')
node.destroy_node()
rclpy.shutdown()
" || true

echo "=== 6. Test Finished ==="
