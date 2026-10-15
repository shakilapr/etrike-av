#!/usr/bin/env bash
# ==============================================================================
# Close Camera & Perception (close_camera.sh)
# ==============================================================================
# Cleanly terminates and frees all camera and perception resources:
#   1. Native YOLO26x Camera Viewer window (yolo_cam_viewer)
#   2. Kinect v2 hardware driver (kinect2_node_exec / single_kinect)
#   3. YOLO26x & RTMPose-s perception nodes (yolo_perception_node.py)
#   4. Camera static transform publishers
#   5. Dedicated camera browser viewports / host viewer scripts
#
# Usage:
#   bash scripts/close_camera.sh
# ==============================================================================

set -eo pipefail

CONTAINER="autoware_test"

echo "======================================================================"
echo " [STOP] Closing Camera & Perception (Kinect v2 + YOLO26x Viewer)"
echo "======================================================================"

# 1. Stop host viewer launchers and X11 camera windows
echo "--> 1. Stopping host-side camera scripts and viewers..."
pkill -INT -f "yolo-camera.sh" 2>/dev/null || true
pkill -INT -f "yolo_cam_viewer" 2>/dev/null || true
pkill -INT -f "open_cockpit_and_camera_monitor" 2>/dev/null || true
pkill -INT -f "rqt_image_view" 2>/dev/null || true
sleep 0.5
pkill -9 -f "yolo-camera.sh" 2>/dev/null || true
pkill -9 -f "yolo_cam_viewer" 2>/dev/null || true
pkill -9 -f "open_cockpit_and_camera_monitor" 2>/dev/null || true
pkill -9 -f "rqt_image_view" 2>/dev/null || true

# 2. Stop in-container camera driver, perception nodes, and viewer
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "--> 2. Stopping camera & perception processes inside Docker ($CONTAINER)..."
    docker exec -u root "$CONTAINER" bash -c "
        # Viewer window
        pkill -INT -f 'yolo_cam_viewer' 2>/dev/null || true
        # YOLO & RTMPose perception
        pkill -INT -f 'yolo_perception_node' 2>/dev/null || true
        pkill -INT -f 'fusion_mesh_node' 2>/dev/null || true
        pkill -INT -f 'bench_perception_node' 2>/dev/null || true
        # Kinect v2 hardware driver
        pkill -INT -f 'kinect2_node_exec' 2>/dev/null || true
        pkill -INT -f 'single_kinect' 2>/dev/null || true
        pkill -INT -f 'dual_kinect' 2>/dev/null || true
        sleep 0.5
        # Force terminate any remaining camera processes
        pkill --signal SIGKILL -f 'yolo_cam_viewer' 2>/dev/null || true
        pkill --signal SIGKILL -f 'kinect2_node_exec' 2>/dev/null || true
        pkill --signal SIGKILL -f 'single_kinect' 2>/dev/null || true
        pkill --signal SIGKILL -f 'dual_kinect' 2>/dev/null || true
        pkill --signal SIGKILL -f 'yolo_perception_node' 2>/dev/null || true
        pkill --signal SIGKILL -f 'fusion_mesh_node' 2>/dev/null || true
        pkill --signal SIGKILL -f 'static_transform_publisher.*kinect' 2>/dev/null || true
        rm -f /tmp/yolo_cam_viewer.py 2>/dev/null || true
    " 2>/dev/null || true
    echo "  [OK] In-container camera and perception processes stopped."
else
    echo "  [INFO] Container $CONTAINER is not currently running."
fi

# 3. Clean any orphaned host processes
pkill -9 -f "kinect2_node_exec" 2>/dev/null || true

echo "======================================================================"
echo " [COMPLETE] Camera and perception nodes successfully closed."
echo " To reopen camera viewer:"
echo "   bash scripts/yolo-camera.sh"
echo "======================================================================"
