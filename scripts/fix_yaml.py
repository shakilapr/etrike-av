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
    
    # Fix YAML - change integer 5000 to float 5000.0
    print("=== Fix etrike.param.yaml ===")
    ssh_run(client, "sed -i 's/max_brake_pressure_kpa: 5000/max_brake_pressure_kpa: 5000.0/' ~/av_project/autoware/src/our_packages/autoware_vehicle_bridge/config/etrike.param.yaml")
    ssh_run(client, "cat ~/av_project/autoware/src/our_packages/autoware_vehicle_bridge/config/etrike.param.yaml")
    
    # Rebuild and test
    print("\n=== Rebuild and test ===")
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all --net=host --ipc=host -v ~/av_project/autoware:/workspace/autoware ghcr.io/autowarefoundation/autoware:universe-cuda-humble bash -c 'while true; do sleep 1000; done' 2>&1")
    time.sleep(3)
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && colcon build --symlink-install --packages-select autoware_vehicle_bridge 2>&1'", timeout=180)
    
    ssh_run(client, "echo 'med1' | sudo -S modprobe vcan 2>&1")
    ssh_run(client, "echo 'med1' | sudo -S ip link add dev vcan0 type vcan 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link set up vcan0 2>&1")
    
    # Launch
    print("\n=== Launch ===")
    ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml can_interface:=vcan0 2>&1'")
    time.sleep(8)
    
    # Check node
    print("\n=== Check node ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 node list 2>&1'")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 lifecycle get /vehicle_bridge 2>&1'")
    
    # Inject CAN
    print("\n=== Inject CAN feedback ===")
    for frame in ["7FD#01.00", "011#00.01.00", "210#01.00.00.00.00.00", "121#E8.03.00.00.01.00.00.00"]:
        ssh_run(client, f"echo 'med1' | sudo -S cansend vcan0 {frame} 2>&1")
    time.sleep(3)
    
    # Check diagnostics
    print("\n=== Check diagnostics ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 5 ros2 topic echo /diagnostics --once 2>&1'")
    
    # Cleanup
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link del vcan0 2>&1 || true")
    client.close()
    print("\nDone!")

if __name__ == "__main__":
    main()
