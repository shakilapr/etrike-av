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
    if error:
        print(f"STDERR: {error}", file=sys.stderr)
    return output, error, exit_code

def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("172.16.25.56", username="med1", password="med1", timeout=30)
    print("Connected!\n")
    
    # Start container
    print("=== Setup ===")
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all --net=host --ipc=host -v ~/av_project/autoware:/workspace/autoware ghcr.io/autowarefoundation/autoware:universe-cuda-humble bash -c 'while true; do sleep 1000; done' 2>&1")
    time.sleep(3)
    
    # Build
    print("\n=== Build ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && colcon build --symlink-install --packages-select etrike_protocol autoware_vehicle_bridge etrike_vehicle_description etrike_vehicle_launch 2>&1'", timeout=300)
    
    # Check test failure
    print("\n=== Test failure details ===")
    ssh_run(client, "docker exec autoware_test bash -c 'cat /workspace/autoware/build/autoware_vehicle_bridge/Testing/Temporary/LastTest.log 2>&1'")
    
    # Try running test manually
    print("\n=== Run test manually ===")
    ssh_run(client, "docker exec autoware_test bash -c '/workspace/autoware/build/autoware_vehicle_bridge/test_motion_conversion 2>&1'")
    
    # Check if node launches
    print("\n=== Launch node and check ===")
    ssh_run(client, "echo 'med1' | sudo -S modprobe vcan 2>&1")
    ssh_run(client, "echo 'med1' | sudo -S ip link add dev vcan0 type vcan 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link set up vcan0 2>&1")
    
    # Launch in foreground to see errors
    print("\n=== Launch node (foreground, 10s) ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 10 ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml can_interface:=vcan0 2>&1'", timeout=30)
    
    # Check node list
    print("\n=== Check nodes ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 node list 2>&1'")
    
    # Check topics
    print("\n=== Check topics ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic list 2>&1'")
    
    # Cleanup
    print("\n=== Cleanup ===")
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link del vcan0 2>&1 || true")
    
    client.close()
    print("\nDone!")

if __name__ == "__main__":
    main()
