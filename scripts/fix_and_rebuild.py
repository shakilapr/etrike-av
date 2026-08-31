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
    client.connect("172.16.25.67", username="med1", password="med1", timeout=30)
    print("Connected!\n")
    
    # The issue: CallbackReturn is not in scope in the .cpp file
    # In Humble, it's rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn
    # But in the header it's just CallbackReturn (which works because of the class inheritance)
    # In the .cpp file we need to qualify it
    
    # Fix: Replace bare CallbackReturn with the full type in .cpp
    print("=== FIX: CallbackReturn in .cpp ===")
    ssh_run(client, r"""sed -i 's/^CallbackReturn VehicleBridgeNode::/rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn VehicleBridgeNode::/' ~/av_project/autoware/src/our_packages/autoware_vehicle_bridge/src/vehicle_bridge_node.cpp""")
    
    # Also need to fix the std::clamp issue - let me check what line looks like now
    print("\n=== Check clamp line ===")
    ssh_run(client, "grep -n 'std::clamp' ~/av_project/autoware/src/our_packages/autoware_vehicle_bridge/src/vehicle_bridge_node.cpp")
    
    # Check values assignment lines
    print("\n=== Check values lines ===")
    ssh_run(client, "grep -n 's.values' ~/av_project/autoware/src/our_packages/autoware_vehicle_bridge/src/vehicle_bridge_node.cpp")
    
    # Build
    print("\n=== BUILD ===")
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all --net=host --ipc=host -v ~/av_project/autoware:/workspace/autoware ghcr.io/autowarefoundation/autoware:universe-cuda-humble bash -c 'while true; do sleep 1000; done' 2>&1")
    time.sleep(3)
    
    output, error, code = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && colcon build --symlink-install --packages-select autoware_vehicle_bridge 2>&1'", timeout=300)
    
    if code == 0:
        print("\n*** BUILD SUCCEEDED! ***")
        
        print("\n=== Running unit tests ===")
        ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && source install/setup.bash && colcon test --packages-select autoware_vehicle_bridge 2>&1'")
        ssh_run(client, "docker exec autoware_test bash -c 'colcon test-result --verbose 2>&1'")
        
        print("\n=== Integration test ===")
        ssh_run(client, "echo 'med1' | sudo -S modprobe vcan 2>&1")
        ssh_run(client, "echo 'med1' | sudo -S ip link add dev vcan0 type vcan 2>&1 || true")
        ssh_run(client, "echo 'med1' | sudo -S ip link set up vcan0 2>&1")
        
        ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml can_interface:=vcan0' 2>&1")
        time.sleep(5)
        ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 node list 2>&1'")
        
        for frame in ["7FD#01.00", "011#00.01.00", "210#01.00.00.00.00.00", "121#E8.03.00.00.01.00.00.00"]:
            ssh_run(client, f"echo 'med1' | sudo -S cansend vcan0 {frame} 2>&1")
        
        time.sleep(3)
        ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 5 ros2 topic echo /diagnostics --once 2>&1'")
    
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link del vcan0 2>&1 || true")
    client.close()
    print("\nDone!")

if __name__ == "__main__":
    main()
