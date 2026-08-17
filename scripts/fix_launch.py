import paramiko
import sys
import time

def ssh_run(client, cmd, timeout=60):
    print(f">>> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    output = stdout.read().decode('utf-8', errors='replace')
    error = stderr.read().decode('utf-8', errors='replace')
    exit_code = stdout.channel.recv_exit_status()
    if output:
        print(output)
    if error and exit_code != 0:
        print(f"STDERR: {error}", file=sys.stderr)
    return output, error, exit_code

def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("172.16.25.56", username="med1", password="med1", timeout=30)
    print("Connected!\n")
    
    # Fix launch file - add namespace parameter
    print("=== FIX: Launch file namespace ===")
    new_launch = '''"""Launch and activate the E-Trike lifecycle vehicle bridge."""

from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, EmitEvent, RegisterEventHandler
from launch.event_handlers import OnProcessStart
from launch.events import matches_action
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import LifecycleNode
from launch_ros.event_handlers import OnStateTransition
from launch_ros.events.lifecycle import ChangeState
from launch_ros.substitutions import FindPackageShare
from lifecycle_msgs.msg import Transition


def generate_launch_description() -> LaunchDescription:
    can_interface = LaunchConfiguration("can_interface")
    engage_topic = LaunchConfiguration("engage_topic")
    parameter_file = PathJoinSubstitution(
        [FindPackageShare("autoware_vehicle_bridge"), "config", "etrike.param.yaml"]
    )

    bridge = LifecycleNode(
        package="autoware_vehicle_bridge",
        executable="vehicle_bridge_node",
        name="vehicle_bridge",
        namespace="",
        output="screen",
        parameters=[parameter_file, {"can_interface": can_interface}],
        remappings=[("~/input/engage", engage_topic)],
    )

    configure = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(bridge),
            transition_id=Transition.TRANSITION_CONFIGURE,
        )
    )
    activate = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(bridge),
            transition_id=Transition.TRANSITION_ACTIVATE,
        )
    )

    return LaunchDescription(
        [
            DeclareLaunchArgument("can_interface", default_value="can0"),
            DeclareLaunchArgument(
                "engage_topic",
                default_value="/api/autoware/get/engage",
                description="Topic of type autoware_vehicle_msgs/msg/Engage the bridge "
                "subscribes to. Verify this is a PUBLISHED topic in the target Autoware "
                "Universe version; if engage is only exposed as an external-API service, "
                "this must be remapped to the real engage topic (e.g. /control/engage).",
            ),
            bridge,
            RegisterEventHandler(
                OnProcessStart(target_action=bridge, on_start=[configure])
            ),
            RegisterEventHandler(
                OnStateTransition(
                    target_lifecycle_node=bridge,
                    goal_state="inactive",
                    entities=[activate],
                )
            ),
        ]
    )
'''
    
    ssh_run(client, f"cat > ~/av_project/autoware/src/our_packages/autoware_vehicle_bridge/launch/vehicle_bridge.launch.py << 'PYEOF'\n{new_launch}\nPYEOF")
    
    # Rebuild
    print("\n=== Rebuild ===")
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all --net=host --ipc=host -v ~/av_project/autoware:/workspace/autoware ghcr.io/autowarefoundation/autoware:universe-cuda-humble bash -c 'while true; do sleep 1000; done' 2>&1")
    time.sleep(3)
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && colcon build --symlink-install --packages-select autoware_vehicle_bridge 2>&1'", timeout=180)
    
    # Setup vcan
    print("\n=== Setup vcan ===")
    ssh_run(client, "echo 'med1' | sudo -S modprobe vcan 2>&1")
    ssh_run(client, "echo 'med1' | sudo -S ip link add dev vcan0 type vcan 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link set up vcan0 2>&1")
    
    # Launch node
    print("\n=== Launch node ===")
    ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml can_interface:=vcan0 2>&1'")
    time.sleep(8)
    
    # Check node
    print("\n=== Check node ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 node list 2>&1'")
    
    # Check topics
    print("\n=== Check topics ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic list 2>&1'")
    
    # Inject CAN feedback
    print("\n=== Inject CAN feedback ===")
    for frame in ["7FD#01.00", "011#00.01.00", "210#01.00.00.00.00.00", "121#E8.03.00.00.01.00.00.00"]:
        ssh_run(client, f"echo 'med1' | sudo -S cansend vcan0 {frame} 2>&1")
    
    time.sleep(3)
    
    # Check diagnostics
    print("\n=== Check diagnostics ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 5 ros2 topic echo /diagnostics --once 2>&1'")
    
    # Cleanup
    print("\n=== Cleanup ===")
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link del vcan0 2>&1 || true")
    
    client.close()
    print("\nDone!")

if __name__ == "__main__":
    main()
