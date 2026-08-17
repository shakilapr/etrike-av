import paramiko
import sys
import time

def ssh_run(client, cmd, timeout=30):
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
    
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all --net=host --ipc=host -v ~/av_project/autoware:/workspace/autoware ghcr.io/autowarefoundation/autoware:universe-cuda-humble bash -c 'while true; do sleep 1000; done' 2>&1")
    time.sleep(3)
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && colcon build --symlink-install --packages-select etrike_protocol autoware_vehicle_bridge etrike_vehicle_launch 2>&1'", timeout=180)
    
    ssh_run(client, "echo 'med1' | sudo -S modprobe vcan 2>&1")
    ssh_run(client, "echo 'med1' | sudo -S ip link add dev vcan0 type vcan 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link set up vcan0 2>&1")
    
    ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml can_interface:=vcan0 2>&1'")
    time.sleep(8)
    
    # Check node info
    print("\n=== Node info ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 node info /vehicle_bridge 2>&1'")
    
    # Check all topics
    print("\n=== All topics ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic list 2>&1'")
    
    # Inject CAN feedback
    print("\n=== Inject CAN ===")
    for frame in ["7FD#01.00", "011#00.01.00", "210#01.00.00.00.00.00", "121#E8.03.00.00.01.00.00.00"]:
        ssh_run(client, f"echo 'med1' | sudo -S cansend vcan0 {frame} 2>&1")
    time.sleep(3)
    
    # Check topics again
    print("\n=== Topics after CAN injection ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic list 2>&1'")
    
    # Try to echo diagnostics with different approaches
    print("\n=== Try diagnostics ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 3 ros2 topic hz /diagnostics 2>&1'")
    
    # Check if there's a /vehicle_bridge/diagnostics topic
    print("\n=== Check vehicle_bridge namespace ===")
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic list | grep -i diag 2>&1'")
    
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link del vcan0 2>&1 || true")
    client.close()

if __name__ == "__main__":
    main()
