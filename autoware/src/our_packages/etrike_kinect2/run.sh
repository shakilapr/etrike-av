#!/bin/bash
# E-Trike Kinect v2 driver — convenience launch script.
#
# Usage:
#   ./run.sh discover         Print connected Kinect serial numbers
#   ./run.sh front            Launch front Kinect only
#   ./run.sh rear             Launch rear Kinect only
#   ./run.sh dual             Launch both Kinects (separate processes)
#   ./run.sh view [dual|front|rear]   Open RViz window on Jetson monitor (DISPLAY=:1)
#                                    NOTE: RViz stretches images to fill panels
#   ./run.sh viewrgb [front|rear]    Aspect-correct color preview (rqt_image_view)
#   ./run.sh viewdepth [front|rear]  Aspect-correct depth preview (rqt_image_view)
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
        # Note: do NOT forward "$@" here — the first arg is "dual" itself
        # and would be passed to the launch file as a stray positional arg.
        ros2 launch etrike_kinect2 dual_kinect.launch.py
        ;;
    test)
        echo "Running launch tests..."
        colcon test --packages-select etrike_kinect2 --event-handlers console_cohesion+
        colcon test-result --verbose
        ;;
    view)
        # Open an RViz2 window on the Jetson's monitor (DISPLAY=:1).
        # The camera is physically on the Jetson; the monitor is :1.
        # Works identically from the Jetson's local terminal and over SSH,
        # because the launch file forces DISPLAY=:1 on the RViz node.
        # NOTE: RViz's Image display stretches images to fill the panel; use
        # `./run.sh viewrgb` / `./run.sh viewdepth` for aspect-correct preview.
        CAMERA="${2:-dual}"
        export DISPLAY=:1
        if [ ! -d /tmp/.X11-unix ]; then
            echo "ERROR: /tmp/.X11-unix not mounted — is this inside the container with X11 passthrough?" >&2
            exit 1
        fi
        echo "Opening Kinect viewer on DISPLAY=$DISPLAY (camera=$CAMERA)..."
        echo "  (run from Jetson terminal or over SSH — window appears on the Jetson monitor)"
        ros2 launch etrike_kinect2 kinect_view.launch.py camera:="$CAMERA"
        ;;
    viewrgb)
        # Aspect-correct color preview using rqt_image_view (preserves native
        # aspect ratio, unlike RViz's Image display).
        CAMERA="${2:-front}"
        export DISPLAY=:1
        export QT_QPA_PLATFORM=xcb
        export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/tmp/runtime-root}"
        mkdir -p "$XDG_RUNTIME_DIR" && chmod 700 "$XDG_RUNTIME_DIR"
        echo "Opening aspect-correct COLOR view: /kinect_${CAMERA}/color/image_raw on DISPLAY=$DISPLAY"
        /opt/ros/humble/lib/rqt_image_view/rqt_image_view "/kinect_${CAMERA}/color/image_raw"
        ;;
    viewdepth)
        # Aspect-correct depth preview using rqt_image_view.
        CAMERA="${2:-front}"
        export DISPLAY=:1
        export QT_QPA_PLATFORM=xcb
        export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/tmp/runtime-root}"
        mkdir -p "$XDG_RUNTIME_DIR" && chmod 700 "$XDG_RUNTIME_DIR"
        echo "Opening aspect-correct DEPTH view: /kinect_${CAMERA}/depth/image_raw on DISPLAY=$DISPLAY"
        /opt/ros/humble/lib/rqt_image_view/rqt_image_view "/kinect_${CAMERA}/depth/image_raw"
        ;;
    *)
        echo "Usage: $0 [discover|front|rear|dual|view|viewrgb|viewdepth|test]"
        exit 1
        ;;
esac
