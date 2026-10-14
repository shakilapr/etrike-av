#!/usr/bin/env bash
echo "=== 1. Active ROS 2 Nodes ==="
docker exec autoware_test bash -c "source /opt/ros/humble/setup.bash && ros2 node list" 2>/dev/null || echo "Failed to get node list"

echo ""
echo "=== 2. Camera Image Topics & Rates ==="
docker exec autoware_test bash -c "source /opt/ros/humble/setup.bash && timeout 3 ros2 topic hz /kinect_front/color/image_raw" 2>/dev/null || echo "No /kinect_front/color/image_raw"

echo ""
echo "=== 3. Perception Debug Image Rate ==="
docker exec autoware_test bash -c "source /opt/ros/humble/setup.bash && timeout 3 ros2 topic hz /bench_perception/camera/debug_image" 2>/dev/null || echo "No /bench_perception/camera/debug_image"

echo ""
echo "=== 4. USB Devices (Kinect) ==="
lsusb

echo ""
echo "=== 5. Kinect Log ==="
docker exec autoware_test cat /tmp/kinect_front.log 2>/dev/null | tail -n 20 || echo "No container kinect log"

echo ""
echo "=== 6. YOLO Log ==="
docker exec autoware_test cat /tmp/yolo_perception.log 2>/dev/null | tail -n 25 || echo "No container yolo log"
