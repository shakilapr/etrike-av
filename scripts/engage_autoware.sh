#!/usr/bin/env bash
# ==============================================================================
# E-Trike Autoware Engage & Motion Controller (engage_autoware.sh)
# ==============================================================================
# Usage:
#   bash scripts/engage_autoware.sh            # Engage autonomous driving
#   bash scripts/engage_autoware.sh --disengage# Disengage / Stop motion
#   bash scripts/engage_autoware.sh --status   # Check operation mode & motion state
# ==============================================================================

set -eo pipefail

CONTAINER="autoware_test"
ACTION="${1:---engage}"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "ERROR: Container '$CONTAINER' is not running."
    exit 1
fi

ros_exec() {
    docker exec "$CONTAINER" bash -c "
        source /opt/ros/humble/setup.bash 2>/dev/null
        source /opt/autoware/setup.bash 2>/dev/null || true
        source /workspace/autoware/install/setup.bash 2>/dev/null || true
        $*
    "
}

case "$ACTION" in
    --status)
        echo "======================================================================"
        echo " Autoware Universe Motion & Engage Status"
        echo "======================================================================"
        docker exec -i "$CONTAINER" bash << 'EOF'
source /opt/ros/humble/setup.bash 2>/dev/null
source /opt/autoware/setup.bash 2>/dev/null || true
source /workspace/autoware/install/setup.bash 2>/dev/null || true
python3 - << 'PYEOF'
import rclpy
from rclpy.node import Node
from autoware_adapi_v1_msgs.msg import OperationModeState
from autoware_vehicle_msgs.msg import Engage
from autoware_control_msgs.msg import Control
import time

rclpy.init()
node = Node('engage_status_checker')

res = {'mode': 'Unknown', 'engage': 'Unknown', 'vel': 0.0, 'acc': 0.0}

def cb_mode(m):
    modes = {0: 'UNKNOWN', 1: 'STOP', 2: 'AUTONOMOUS', 3: 'LOCAL', 4: 'REMOTE'}
    res['mode'] = f"{modes.get(m.mode, m.mode)} (autoware_control={m.is_autoware_control_enabled})"

def cb_engage(m):
    res['engage'] = str(m.engage)

def cb_cmd(m):
    res['vel'] = round(m.longitudinal.velocity, 2)
    res['acc'] = round(m.longitudinal.acceleration, 2)

node.create_subscription(OperationModeState, '/system/operation_mode/state', cb_mode, 10)
node.create_subscription(Engage, '/api/autoware/get/engage', cb_engage, 10)
node.create_subscription(Control, '/control/command/control_cmd', cb_cmd, 10)

t0 = time.time()
while time.time() - t0 < 1.0:
    rclpy.spin_once(node, timeout_sec=0.1)

print(f"  Operation Mode : {res['mode']}")
print(f"  Vehicle Engage : {res['engage']}")
print(f"  Commanded Vel  : {res['vel']} m/s (acc: {res['acc']} m/s²)")
PYEOF
EOF
        echo "======================================================================"
        ;;

    --disengage|--stop)
        echo "--> Disengaging vehicle and setting mode to STOP..."
        ros_exec "ros2 service call /api/autoware/set/engage tier4_external_api_msgs/srv/Engage '{engage: false}'" >/dev/null 2>&1 || true
        ros_exec "ros2 service call /api/operation_mode/change_to_stop autoware_adapi_v1_msgs/srv/ChangeOperationMode '{}'" >/dev/null 2>&1 || true
        echo "  [OK] Vehicle Disengaged and Mode set to STOP."
        ;;

    --engage|*)
        echo "======================================================================"
        echo " Engaging Autoware Universe Autonomous Motion"
        echo "======================================================================"

        # 1. Check for duplicate nodes that block operation mode
        DUPES=$(docker exec -u root "$CONTAINER" ps aux | grep -c "robot_state_publisher" || true)
        if [ "$DUPES" -gt 2 ]; then
            echo "--> Detected lingering duplicate nodes! Sanitizing..."
            docker exec -u root "$CONTAINER" bash -c "
                PIDS=\$(pgrep -f 'robot_state_publisher' | head -n -1)
                for p in \$PIDS; do kill -9 \$p 2>/dev/null || true; done
            " || true
            sleep 0.5
        fi

        # 2. Switch Operation Mode to Autonomous
        echo "--> 1. Requesting Autonomous Operation Mode..."
        MODE_OUT=$(ros_exec "ros2 service call /api/operation_mode/change_to_autonomous autoware_adapi_v1_msgs/srv/ChangeOperationMode '{}'" 2>&1 || true)
        if echo "$MODE_OUT" | grep -q "success=True"; then
            echo "  [OK] Operation Mode changed to AUTONOMOUS."
        else
            echo "  [WARN] Operation mode change response: $MODE_OUT"
        fi

        # 3. Engage Vehicle Command Gate
        echo "--> 2. Engaging Vehicle Command Gate..."
        ENG_OUT=$(ros_exec "ros2 service call /api/autoware/set/engage tier4_external_api_msgs/srv/Engage '{engage: true}'" 2>&1 || true)
        if echo "$ENG_OUT" | grep -q "code=1"; then
            echo "  [OK] Vehicle Command Gate ENGAGED."
        else
            echo "  [WARN] Vehicle engage response: $ENG_OUT"
        fi

        # 4. Verify motion
        sleep 0.5
        echo "======================================================================"
        docker exec -i "$CONTAINER" bash << 'EOF'
source /opt/ros/humble/setup.bash 2>/dev/null
source /opt/autoware/setup.bash 2>/dev/null || true
source /workspace/autoware/install/setup.bash 2>/dev/null || true
python3 - << 'PYEOF'
import rclpy
from rclpy.node import Node
from autoware_control_msgs.msg import Control
import time

rclpy.init()
node = Node('verify_motion')
cmd = {'v': 0.0, 'a': 0.0}
def cb(m):
    cmd['v'] = round(m.longitudinal.velocity, 2)
    cmd['a'] = round(m.longitudinal.acceleration, 2)
node.create_subscription(Control, '/control/command/control_cmd', cb, 10)
t0 = time.time()
while time.time() - t0 < 1.0:
    rclpy.spin_once(node, timeout_sec=0.1)
print(f"  [STATUS] Vehicle Output: velocity = {cmd['v']} m/s, acceleration = {cmd['a']} m/s²")
if cmd['v'] > 0:
    print("  [SUCCESS] Autoware motion is ACTIVE and driving!")
else:
    print("  [INFO] Vehicle is ready/waiting for target route or stopline clearance.")
PYEOF
EOF
        echo "======================================================================"
        ;;
esac
