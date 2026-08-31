import paramiko
import sys
import time

def ssh_connect_and_run(host, username, password, commands, timeout=60):
    """Connect to SSH and run commands"""
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {host}...")
        client.connect(host, username=username, password=password, timeout=timeout)
        print("Connected!\n")
        
        results = []
        
        for i, cmd in enumerate(commands, 1):
            print(f"[{i}/{len(commands)}] >>> {cmd}")
            stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
            
            # Get output
            output = stdout.read().decode('utf-8', errors='replace')
            error = stderr.read().decode('utf-8', errors='replace')
            exit_code = stdout.channel.recv_exit_status()
            
            if output:
                print(output)
            if error:
                print(f"STDERR: {error}", file=sys.stderr)
            
            results.append({
                'command': cmd,
                'output': output,
                'error': error,
                'exit_code': exit_code
            })
            
            # Wait between commands
            time.sleep(2)
        
        return results
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return None
    finally:
        client.close()

def main():
    host = "172.16.25.67"
    username = "med1"
    password = "med1"
    
    print("\n" + "="*60)
    print("E-TRIKE BUILD AND TEST")
    print("="*60 + "\n")
    
    # Step 1: Check Docker status and start container if needed
    print("\n[STEP 1] Checking Docker status...")
    commands = [
        "docker ps -a --format '{{.Names}} {{.Status}}'",
        "docker images | grep autoware",
    ]
    results = ssh_connect_and_run(host, username, password, commands, timeout=30)
    
    # Step 2: Start Docker container with shell
    print("\n[STEP 2] Starting Docker container...")
    commands = [
        # Run docker shell in detached mode with proper terminal
        "docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all --net=host --ipc=host -v ~/av_project/autoware:/workspace/autoware -v ~/av_project/vehicle:/workspace/vehicle ghcr.io/autowarefoundation/autoware:universe-cuda-humble bash -c 'while true; do sleep 1000; done' 2>&1 || echo 'Container may already exist'",
        
        # Wait for container to be ready
        "sleep 3",
        
        # Check container is running
        "docker ps --filter 'name=autoware_test' --format '{{.Names}}: {{.Status}}'",
    ]
    results = ssh_connect_and_run(host, username, password, commands, timeout=60)
    
    # Step 3: Build packages
    print("\n[STEP 3] Building packages...")
    commands = [
        "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && colcon build --symlink-install --packages-select etrike_protocol autoware_vehicle_bridge etrike_vehicle_description etrike_vehicle_launch 2>&1'",
    ]
    results = ssh_connect_and_run(host, username, password, commands, timeout=300)
    
    # Step 4: Run unit tests
    print("\n[STEP 4] Running unit tests...")
    commands = [
        "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && source install/setup.bash && colcon test --packages-select autoware_vehicle_bridge 2>&1'",
        "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && colcon test-result --verbose 2>&1'",
    ]
    results = ssh_connect_and_run(host, username, password, commands, timeout=120)
    
    # Step 5: Setup virtual CAN on host
    print("\n[STEP 5] Setting up virtual CAN...")
    commands = [
        "sudo modprobe vcan 2>&1 || echo 'vcan module load failed'",
        "sudo ip link add dev vcan0 type vcan 2>&1 || echo 'vcan0 already exists'",
        "sudo ip link set up vcan0 2>&1 && echo 'vcan0 is UP'",
        "ip link show vcan0 2>&1",
    ]
    results = ssh_connect_and_run(host, username, password, commands, timeout=30)
    
    # Step 6: Install can-utils
    print("\n[STEP 6] Installing can-utils...")
    commands = [
        "which cansend 2>&1 || (sudo apt-get update && sudo apt-get install -y can-utils 2>&1 | tail -10)",
    ]
    results = ssh_connect_and_run(host, username, password, commands, timeout=120)
    
    # Step 7: Launch vehicle bridge
    print("\n[STEP 7] Launching vehicle bridge...")
    commands = [
        # Make sure Docker can access host vcan0
        "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml can_interface:=vcan0' 2>&1",
        "sleep 5",
        "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 node list 2>&1'",
    ]
    results = ssh_connect_and_run(host, username, password, commands, timeout=60)
    
    # Step 8: Inject CAN feedback
    print("\n[STEP 8] Injecting CAN feedback...")
    commands = [
        "sudo cansend vcan0 7FD#01.00 2>&1 && echo 'RT heartbeat sent'",
        "sudo cansend vcan0 011#00.01.00 2>&1 && echo 'SYS safety status sent'",
        "sudo cansend vcan0 210#01.00.00.00.00.00 2>&1 && echo 'RT state report sent'",
        "sudo cansend vcan0 121#E8.03.00.00.01.00.00.00 2>&1 && echo 'RT motion report sent'",
        "sleep 2",
    ]
    results = ssh_connect_and_run(host, username, password, commands, timeout=30)
    
    # Step 9: Check diagnostics
    print("\n[STEP 9] Checking diagnostics...")
    commands = [
        "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 5 ros2 topic echo /diagnostics --once 2>&1'",
    ]
    results = ssh_connect_and_run(host, username, password, commands, timeout=30)
    
    # Step 10: Cleanup
    print("\n[STEP 10] Cleanup...")
    commands = [
        "docker stop autoware_test 2>&1 || echo 'Container not running'",
        "docker rm autoware_test 2>&1 || echo 'Container not found'",
        "sudo ip link set down vcan0 2>&1 || echo 'vcan0 already down'",
        "sudo ip link del vcan0 2>&1 || echo 'vcan0 already deleted'",
    ]
    results = ssh_connect_and_run(host, username, password, commands, timeout=30)
    
    print("\n" + "="*60)
    print("BUILD AND TEST COMPLETE")
    print("="*60)

if __name__ == "__main__":
    main()
