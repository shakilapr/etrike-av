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
    
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all --net=host --ipc=host -v ~/av_project/autoware:/workspace/autoware ghcr.io/autowarefoundation/autoware:universe-cuda-humble bash -c 'while true; do sleep 1000; done' 2>&1")
    time.sleep(3)
    
    # Read the key vehicle launch files
    print("=== tier4_vehicle_launch/launch/vehicle.launch.xml ===")
    ssh_run(client, "docker exec autoware_test bash -c 'cat /opt/autoware/tier4_vehicle_launch/share/tier4_vehicle_launch/launch/vehicle.launch.xml 2>&1'")
    
    print("\n=== sample_vehicle_launch/launch/vehicle_interface.launch.xml ===")
    ssh_run(client, "docker exec autoware_test bash -c 'cat /opt/autoware/sample_vehicle_launch/share/sample_vehicle_launch/launch/vehicle_interface.launch.xml 2>&1'")
    
    # Check what files are in sample_vehicle_launch
    print("\n=== sample_vehicle_launch files ===")
    ssh_run(client, "docker exec autoware_test bash -c 'find /opt/autoware/sample_vehicle_launch -type f 2>&1'")
    
    # Check sample_vehicle_description
    print("\n=== sample_vehicle_description files ===")
    ssh_run(client, "docker exec autoware_test bash -c 'find /opt/autoware/sample_vehicle_description -type f 2>&1 | head -20'")
    
    # Read sample_vehicle_description config
    print("\n=== sample_vehicle_description/vehicle_info.param.yaml ===")
    ssh_run(client, "docker exec autoware_test bash -c 'cat /opt/autoware/sample_vehicle_description/share/sample_vehicle_description/config/vehicle_info.param.yaml 2>&1'")
    
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    client.close()

if __name__ == "__main__":
    main()
