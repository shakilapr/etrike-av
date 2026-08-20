#!/bin/bash
# E-Trike Kinect v2 driver — convenience launch script.
#
# Usage:
#   ./run.sh discover         Print connected Kinect serial numbers
#   ./run.sh front            Launch front Kinect only
#   ./run.sh rear             Launch rear Kinect only
#   ./run.sh dual             Launch both Kinects (separate processes)
#   ./run.sh view [dual|front|rear]   Open RViz window on Jetson monitor (DISPLAY=:1)
#   ./run.sh test             Run launch test
#
# Prerequisites:
#   - libfreenect2 installed (CPU build)
#   - udev rules installed: sudo cp libfreenect2/platform/linux/udev/90-kinect2.rules /etc/udev/rules.d/
#   - Workspace built: colcon build --packages-select etrike_kinect2

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source ROS 2 and workspace
if [ -f /opt/ros/humble/setup.bash ]; then
    source /opt/ros/humble/setup.bash
fi
if [ -f "$SCRIPT_DIR/../../../../install/setup.bash" ]; then
    source "$SCRIPT_DIR/../../../../install/setup.bash"
elif [ -f "$SCRIPT_DIR/../../install/setup.bash" ]; then
    source "$SCRIPT_DIR/../../install/setup.bash"
fi

case "${1:-dual}" in
    discover)
        echo "Discovering Kinect v2 devices..."
        ros2 run etrike_kinect2 kinect2_node_exec --discover
        ;;
    front)
        echo "Launching front Kinect..."
        ros2 launch etrike_kinect2 single_kinect.launch.py camera:=front
        ;;
    rear)
        echo "Launching rear Kinect..."
        ros2 launch etrike_kinect2 single_kinect.launch.py camera:=rear
        ;;
    dual)
        echo "Launching dual Kinect (front + rear)..."
        ros2 launch etrike_kinect2 dual_kinect.launch.py "$@"
        ;;
    test)
        echo "Running launch tests..."
        colcon test --packages-select etrike_kinect2 --event-handlers console_cohesion+
        colcon test-result --verbose
        ;;
    view)
        # Open an RViz2 window on the Jetson's monitor (DISPLAY=:1).
        # The camera is physically on the Jetson; the monitor is :1.
        CAMERA="${2:-dual}"
        export DISPLAY="${DISPLAY:-:1}"
        echo "Opening Kinect viewer on DISPLAY=$DISPLAY (camera=$CAMERA)..."
        ros2 launch etrike_kinect2 kinect_view.launch.py camera:="$CAMERA"
        ;;
    *)
        echo "Usage: $0 [discover|front|rear|dual|view|test]"
        exit 1
        ;;
esac
