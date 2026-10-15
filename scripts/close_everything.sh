#!/usr/bin/env bash
# ==============================================================================
# Close Everything (close_everything.sh)
# ==============================================================================
# Master shutdown script for the entire E-Trike Autonomous Vehicle stack on Jetson.
#
# Cleanly terminates and frees all system resources:
#   1. ROS 2 & Autoware Universe nodes, launchers, daemons, and RViz2
#   2. Remote Cockpit GUI, remote control nodes, and stability guard
#   3. Vehicle Bridge (CAN <-> Autoware translation layer)
#   4. Sensing & perception drivers (Hesai LiDAR, Kinect v2, bench perception)
#   5. SLAM, mapping, rosbag recording, and playback processes
#   6. AV Dashboard & CAN Watcher backend servers (ports 8080 & 8000)
#   7. Physical display windows (Chromium, Electron, RViz)
#   8. Hardware SocketCAN & CANalyst-II adapters (can2, canable0, slcand)
#   9. Container lifecycle management (restarted clean, stopped, or removed)
#
# Usage:
#   bash scripts/close_everything.sh                   # Clean close + restart container (default)
#   bash scripts/close_everything.sh --stop-container  # Clean close + stop container
#   bash scripts/close_everything.sh --rm-container    # Clean close + delete container
#   bash scripts/close_everything.sh --keep-container  # Clean close + leave container as-is
#   bash scripts/close_everything.sh --help            # Show usage
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
if [ ! -d "$WORKSPACE_ROOT/scripts" ] && [ -d "$HOME/av_project/scripts" ]; then
    WORKSPACE_ROOT="$HOME/av_project"
fi

CONTAINER="autoware_test"
CONTAINER_ACTION="restart" # default: restart container clean and idle to reclaim all GPU/CUDA memory & kill lingering nodes
RESET_CAN=true             # default: cleanly bring down CAN link and daemons for full close

# Parse command line options
while [[ $# -gt 0 ]]; do
    case "$1" in
        --restart-container)
            CONTAINER_ACTION="restart"
            shift
            ;;
        --stop-container)
            CONTAINER_ACTION="stop"
            shift
            ;;
        --rm-container|--kill-container)
            CONTAINER_ACTION="rm"
            shift
            ;;
        --keep-container)
            CONTAINER_ACTION="keep"
            shift
            ;;
        --reset-can|--down-can)
            RESET_CAN=true
            shift
            ;;
        --keep-can)
            RESET_CAN=false
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [--restart-container | --keep-container | --stop-container | --rm-container] [--reset-can | --keep-can]"
            echo ""
            echo "Options:"
            echo "  (default)            Gracefully stop all nodes, free ports, restart container clean, close CAN"
            echo "  --keep-container     Stop in-container nodes without restarting the Docker container"
            echo "  --keep-can           Leave CAN interfaces and daemon running for rapid stack switching"
            echo "  --restart-container  Force Docker container restart (reclaims CUDA/GPU RAM)"
            echo "  --stop-container     Stop all services and stop the docker container ($CONTAINER)"
            echo "  --rm-container       Stop all services and forcefully remove the docker container"
            echo "  --reset-can          Tear down SocketCAN interfaces (can2, canable0) and bridge daemons (default)"
            echo "  --help, -h           Display this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Run '$0 --help' for usage."
            exit 1
            ;;
    esac
done

echo "======================================================================"
echo " [STOP] Closing Everything across E-Trike Stack (Host & Docker)"
echo " Container mode: $CONTAINER_ACTION | Reset CAN: $RESET_CAN"
echo "======================================================================"

# ------------------------------------------------------------------------------
# STEP 1: Graceful Termination of Control & Critical Nodes
# ------------------------------------------------------------------------------
echo "--> 1. Requesting graceful shutdown for control nodes & bridges..."

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    docker exec -u root "$CONTAINER" bash -c "
        pkill -INT -f 'vehicle_bridge' 2>/dev/null || true
        pkill -INT -f 'etrike_remote_control' 2>/dev/null || true
        pkill -INT -f 'remote_control_node' 2>/dev/null || true
        pkill -INT -f 'remote_control_gui' 2>/dev/null || true
        pkill -INT -f 'yolo_cam_viewer' 2>/dev/null || true
        pkill -INT -f 'yolo-camera' 2>/dev/null || true
        pkill -INT -f 'yolo_perception_node' 2>/dev/null || true
        pkill -INT -f 'fusion_mesh_node' 2>/dev/null || true
        pkill -INT -f 'bench_perception_node' 2>/dev/null || true
        pkill -INT -f 'kinect2_node_exec' 2>/dev/null || true
        pkill -INT -f 'single_kinect' 2>/dev/null || true
        pkill -INT -f 'kinect' 2>/dev/null || true
        pkill -INT -f 'rosbag2' 2>/dev/null || true
    " 2>/dev/null || true
fi
pkill -INT -f "etrike_remote_control" 2>/dev/null || true
pkill -INT -f "vehicle_bridge" 2>/dev/null || true
pkill -INT -f "yolo_cam_viewer" 2>/dev/null || true
pkill -INT -f "yolo-camera" 2>/dev/null || true
pkill -INT -f "yolo_perception_node" 2>/dev/null || true
pkill -INT -f "bench_perception_node" 2>/dev/null || true
pkill -INT -f "kinect2_node_exec" 2>/dev/null || true
pkill -INT -f "single_kinect" 2>/dev/null || true
pkill -INT -f "kinect" 2>/dev/null || true
pkill -INT -f "open_cockpit_and_camera_monitor" 2>/dev/null || true

sleep 0.8

# ------------------------------------------------------------------------------
# STEP 2: Stop In-Container ROS 2, Perception, SLAM, and Web Services
# ------------------------------------------------------------------------------
echo "--> 2. Stopping all processes inside Docker container ($CONTAINER)..."

if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    docker exec -u root "$CONTAINER" bash -c '
        # Autoware & ROS 2 Core (Universe, Planning, Control, Sim)
        pkill --signal SIGKILL -f "ros2" 2>/dev/null || true
        pkill --signal SIGKILL -f "rviz" 2>/dev/null || true
        pkill --signal SIGKILL -f "component_container" 2>/dev/null || true
        pkill --signal SIGKILL -f "planning" 2>/dev/null || true
        pkill --signal SIGKILL -f "control" 2>/dev/null || true
        pkill --signal SIGKILL -f "autoware" 2>/dev/null || true
        pkill --signal SIGKILL -f "vehicle_bridge" 2>/dev/null || true
        pkill --signal SIGKILL -f "remote_control" 2>/dev/null || true
        pkill --signal SIGKILL -f "kinect2_node_exec" 2>/dev/null || true
        pkill --signal SIGKILL -f "single_kinect" 2>/dev/null || true
        pkill --signal SIGKILL -f "kinect" 2>/dev/null || true
        pkill --signal SIGKILL -f "hesai" 2>/dev/null || true
        pkill --signal SIGKILL -f "yolo_cam_viewer" 2>/dev/null || true
        pkill --signal SIGKILL -f "yolo-camera" 2>/dev/null || true
        pkill --signal SIGKILL -f "yolo_perception_node" 2>/dev/null || true
        pkill --signal SIGKILL -f "fusion_mesh_node" 2>/dev/null || true
        pkill --signal SIGKILL -f "perception" 2>/dev/null || true
        pkill --signal SIGKILL -f "static_transform_publisher.*kinect" 2>/dev/null || true
        pkill --signal SIGKILL -f "robot_state_publisher" 2>/dev/null || true
        pkill --signal SIGKILL -f "tools.av_dashboard" 2>/dev/null || true
        pkill --signal SIGKILL -f "tools.can_watcher" 2>/dev/null || true

        # Clean all remaining processes inside container except PID 1 and current shell
        for p in $(ps -eo pid= 2>/dev/null); do
            p_trimmed=$(echo "$p" | tr -d " ")
            if [ -n "$p_trimmed" ] && [ "$p_trimmed" -gt 1 ] 2>/dev/null && [ "$p_trimmed" -ne $$ ] 2>/dev/null; then
                kill -9 "$p_trimmed" 2>/dev/null || true
            fi
        done
        ros2 daemon stop 2>/dev/null || true
    ' 2>/dev/null || true
    echo "  [OK] In-container processes terminated."
else
    echo "  [INFO] Container $CONTAINER is not running."
fi

# ------------------------------------------------------------------------------
# STEP 3: Stop Host Web Servers, Dev Servers, and UI Windows
# ------------------------------------------------------------------------------
echo "--> 3. Stopping host-side servers, browser windows, and UI displays..."

# Backend API servers
pkill -9 -f "tools.can_watcher.backend.server" 2>/dev/null || true
pkill -9 -f "tools.av_dashboard.backend.server" 2>/dev/null || true
pkill -9 -f "autoware_teleop_web" 2>/dev/null || true
pkill -9 -f "autoware_teleop" 2>/dev/null || true
pkill -9 -f "vite" 2>/dev/null || true

# Host GUI / Display windows (matches snap, deb, and native chrome/chromium/epiphany)
pkill -9 -f "chromium_camera" 2>/dev/null || true
pkill -9 -f "chromium_cockpit" 2>/dev/null || true
pkill -9 -f "user-data-dir=/tmp/chromium" 2>/dev/null || true
pkill -9 -f "chromium" 2>/dev/null || true
pkill -9 -f "chrome" 2>/dev/null || true
killall -9 chrome chromium chromium-browser 2>/dev/null || true
pkill -9 -f "epiphany" 2>/dev/null || true
pkill -9 -f "electron" 2>/dev/null || true
pkill -9 -f "rviz2" 2>/dev/null || true
pkill -9 -f "remote_control_gui" 2>/dev/null || true
pkill -9 -f "remote_control_node" 2>/dev/null || true
pkill -9 -f "loop_mapping" 2>/dev/null || true
pkill -9 -f "record_slam" 2>/dev/null || true

# Camera & Perception GUI windows and scripts (host & X11)
pkill -9 -f "yolo-camera" 2>/dev/null || true
pkill -9 -f "yolo_cam_viewer" 2>/dev/null || true
pkill -9 -f "open_cockpit_and_camera_monitor" 2>/dev/null || true
pkill -9 -f "rqt_image_view" 2>/dev/null || true
pkill -9 -f "kinect2_node_exec" 2>/dev/null || true
pkill -9 -f "single_kinect" 2>/dev/null || true
pkill -9 -f "kinect" 2>/dev/null || true

# Host ROS2/bridge/perception leftovers
pkill -9 -f "ros2" 2>/dev/null || true
pkill -9 -f "vehicle_bridge" 2>/dev/null || true
pkill -9 -f "etrike_remote_control" 2>/dev/null || true
pkill -9 -f "bench_perception_node" 2>/dev/null || true
pkill -9 -f "yolo_perception_node" 2>/dev/null || true
pkill -9 -f "etrike_yolo_perception" 2>/dev/null || true
pkill -9 -f "planning_simulator" 2>/dev/null || true
pkill -9 -f "trajectory_follower" 2>/dev/null || true
pkill -9 -f "vehicle_cmd_gate" 2>/dev/null || true

echo "  [OK] Host servers and UI windows stopped."

# Clean orphaned ROS 2 DDS shared memory segments (safe targeted cleanup)
echo "--> Cleaning orphaned ROS 2 DDS shared memory mutexes..."
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    docker exec -u root "$CONTAINER" bash -c "rm -rf /dev/shm/fastrtps_* /dev/shm/sem.fastrtps_* /dev/shm/cyclonedds_* 2>/dev/null || true" 2>/dev/null || true
fi
rm -rf /dev/shm/fastrtps_* /dev/shm/sem.fastrtps_* /dev/shm/cyclonedds_* 2>/dev/null || true

# ------------------------------------------------------------------------------
# STEP 4: CAN Adapter Lifecycle Handling
# ------------------------------------------------------------------------------
if [ "$RESET_CAN" = "true" ]; then
    echo "--> 4. Bringing down CAN interfaces and bridge daemons..."

    # CANalyst-II bridge daemon teardown
    pkill -9 -f "canalyst_socketcan_daemon.py" 2>/dev/null || true
    sudo pkill -9 -f "canalyst_socketcan_daemon.py" 2>/dev/null || true
    if [ -f "$WORKSPACE_ROOT/scripts/setup_canalyst.sh" ]; then
        bash "$WORKSPACE_ROOT/scripts/setup_canalyst.sh" down "can2" >/dev/null 2>&1 || true
    fi

    # SocketCAN interfaces
    for iface in can2 canable0 can0 can1 vcan0; do
        if ip link show "$iface" >/dev/null 2>&1; then
            sudo ip link set "$iface" down 2>/dev/null || true
        fi
    done

    # Kill SLCAN daemons if present
    pkill -9 -f "slcand" 2>/dev/null || true
    pkill -9 -f "slcan_attach" 2>/dev/null || true

    echo "  [OK] CAN interfaces brought down."
else
    echo "--> 4. Preserving active CAN interface (SocketCAN link kept ready for next stack)."
fi

# ------------------------------------------------------------------------------
# STEP 5: Container Lifecycle Handling
# ------------------------------------------------------------------------------
echo "--> 5. Managing Docker container ($CONTAINER)..."

case "$CONTAINER_ACTION" in
    stop)
        docker stop "$CONTAINER" >/dev/null 2>&1 || true
        echo "  [OK] Container $CONTAINER stopped."
        ;;
    rm)
        docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
        echo "  [OK] Container $CONTAINER removed."
        ;;
    restart)
        if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
            docker restart "$CONTAINER" >/dev/null 2>&1 || true
            echo "  [OK] Container $CONTAINER cleanly restarted and idle."
        else
            echo "  [INFO] Container $CONTAINER is not currently running."
        fi
        ;;
    keep)
        echo "  [OK] Container $CONTAINER kept running in clean idle state."
        ;;
esac

# ------------------------------------------------------------------------------
# STEP 6: Status & Resource Summary
# ------------------------------------------------------------------------------
echo "======================================================================"
echo " Shutdown Summary"
echo "======================================================================"

# Docker status
echo -n "  Docker Container:       "
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "RUNNING (clean/idle)"
elif docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "STOPPED"
else
    echo "NOT PRESENT"
fi

# CAN interfaces status
echo -n "  CAN Interface (can2):   "
if ip link show can2 2>/dev/null | grep -q "UP"; then
    echo "UP (WARNING)"
else
    echo "DOWN / CLOSED"
fi

echo -n "  CAN Interface (canable):"
if ip link show canable0 2>/dev/null | grep -q "UP"; then
    echo "UP (WARNING)"
else
    echo "DOWN / CLOSED"
fi

# ROS 2 process count
ROS_COUNT=$(pgrep -f "ros2" 2>/dev/null | wc -l || echo "0")
ROS_COUNT=$(echo "$ROS_COUNT" | tr -d ' ')
echo "  Remaining ROS processes: $ROS_COUNT"

# Port checks
PORT_8080=$(lsof -i :8080 -t 2>/dev/null || true)
PORT_8000=$(lsof -i :8000 -t 2>/dev/null || true)
if [ -z "$PORT_8080" ]; then
    echo "  Port 8080 (Dashboard):  FREE"
else
    echo "  Port 8080 (Dashboard):  IN USE (PID $PORT_8080)"
fi
if [ -z "$PORT_8000" ]; then
    echo "  Port 8000 (CAN Watch):  FREE"
else
    echo "  Port 8000 (CAN Watch):  IN USE (PID $PORT_8000)"
fi

echo "======================================================================"
echo " [COMPLETE] Everything is closed. System is in a clean state."
echo " To start fresh:"
echo "   - Bench Simulator:      bash scripts/open-etrike.sh --bench"
echo "   - Hybrid Bench (Sensors): bash scripts/open-etrike.sh --hybrid-bench"
echo "   - Remote Control GUI:   bash scripts/open_remote_control.sh"
echo "======================================================================"
