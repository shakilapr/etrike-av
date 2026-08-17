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
    
    # Setup
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all --net=host --ipc=host -v ~/av_project/autoware:/workspace/autoware -v ~/autoware_map:/autoware_map ghcr.io/autowarefoundation/autoware:universe-cuda-humble bash -c 'while true; do sleep 1000; done' 2>&1")
    time.sleep(3)
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && colcon build --symlink-install --packages-select etrike_protocol autoware_vehicle_bridge etrike_vehicle_description etrike_vehicle_launch 2>&1'", timeout=180)
    
    # Check what's in the map directory
    print("\n=== Map contents ===")
    ssh_run(client, "ls -la ~/autoware_map/sample-map-planning/ 2>&1")
    
    # Try launching with foreground to see errors
    print("\n=== Launch Autoware (foreground, 30s timeout) ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 30 ros2 launch autoware_launch planning_simulator.launch.xml map_path:=/autoware_map/sample-map-planning vehicle_model:=sample_vehicle sensor_model:=sample_sensor_kit rviz:=false 2>&1'", timeout=45)
    
    # Check ROS domain ID
    print("\n=== ROS environment ===")
    ssh_run(client, "docker exec autoware_test bash -c 'echo ROS_DOMAIN_ID=$ROS_DOMAIN_ID && echo RMW_IMPLEMENTATION=$RMW_IMPLEMENTATION'")
    
    # Try simple ros2 commands
    print("\n=== Test ros2 commands ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && ros2 doctor --report 2>&1 | head -50'")
    
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    client.close()

if __name__ == "__main__":
    main()
