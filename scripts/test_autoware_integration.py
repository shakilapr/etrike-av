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

def wait_for_nodes(client, timeout=60):
    """Wait for Autoware nodes to start"""
    print(f"  Waiting up to {timeout}s for nodes to start...")
    start = time.time()
    while time.time() - start < timeout:
        output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 node list 2>&1'", timeout=15)
        nodes = [n for n in output.strip().split('\n') if n.strip()]
        if len(nodes) > 3:  # More than just ros2cli nodes
            return nodes
        time.sleep(5)
    return []

def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("172.16.25.56", username="med1", password="med1", timeout=30)
    print("Connected!\n")
    
    results = []
    
    # Setup
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all --net=host --ipc=host -v ~/av_project/autoware:/workspace/autoware -v ~/autoware_map:/autoware_map ghcr.io/autowarefoundation/autoware:universe-cuda-humble bash -c 'while true; do sleep 1000; done' 2>&1")
    time.sleep(3)
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && colcon build --symlink-install --packages-select etrike_protocol autoware_vehicle_bridge etrike_vehicle_description etrike_vehicle_launch 2>&1'", timeout=180)
    
    # ==================================================================
    # TEST 1: Launch Autoware planning simulator (baseline with sample_vehicle)
    # ==================================================================
    print("="*60)
    print("TEST 1: Autoware planning simulator with sample_vehicle")
    print("="*60)
    
    ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 launch autoware_launch planning_simulator.launch.xml map_path:=/autoware_map/sample-map-planning vehicle_model:=sample_vehicle sensor_model:=sample_sensor_kit rviz:=false 2>&1'")
    
    nodes = wait_for_nodes(client, timeout=90)
    if len(nodes) > 5:
        results.append(("Autoware starts with sample_vehicle", True))
        print(f"  Found {len(nodes)} nodes")
    else:
        results.append(("Autoware starts with sample_vehicle", False))
        print(f"  Only found {len(nodes)} nodes")
    
    # List key nodes
    print("\n  Key nodes:")
    for n in nodes:
        if any(k in n for k in ['planning', 'control', 'vehicle', 'system', 'map']):
            print(f"    {n}")
    
    # Check topics
    output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic list 2>&1'", timeout=15)
    topics = output.strip().split('\n')
    vehicle_topics = [t for t in topics if 'vehicle' in t.lower()]
    print(f"\n  Vehicle topics ({len(vehicle_topics)}):")
    for t in vehicle_topics:
        print(f"    {t}")
    
    # Stop Autoware
    print("\n  Stopping Autoware...")
    ssh_run(client, "docker exec autoware_test bash -c 'pkill -f ros2 2>&1 || true'")
    time.sleep(5)
    
    # ==================================================================
    # TEST 2: Launch with etrike vehicle
    # ==================================================================
    print("\n" + "="*60)
    print("TEST 2: Autoware planning simulator with etrike_vehicle")
    print("="*60)
    
    ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 launch autoware_launch planning_simulator.launch.xml map_path:=/autoware_map/sample-map-planning vehicle_model:=etrike_vehicle sensor_model:=sample_sensor_kit rviz:=false 2>&1'")
    
    nodes = wait_for_nodes(client, timeout=90)
    if len(nodes) > 5:
        results.append(("Autoware starts with etrike_vehicle", True))
        print(f"  Found {len(nodes)} nodes")
    else:
        results.append(("Autoware starts with etrike_vehicle", False))
        print(f"  Only found {len(nodes)} nodes")
    
    # List key nodes
    print("\n  Key nodes:")
    for n in nodes:
        if any(k in n for k in ['planning', 'control', 'vehicle', 'system', 'map']):
            print(f"    {n}")
    
    # Check if vehicle_bridge is in the list
    bridge_found = any('vehicle_bridge' in n for n in nodes)
    results.append(("Vehicle bridge node launched by Autoware", bridge_found))
    if bridge_found:
        print("\n  Vehicle bridge node found in Autoware launch!")
    
    # Check topics
    output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic list 2>&1'", timeout=15)
    topics = output.strip().split('\n')
    vehicle_topics = [t for t in topics if 'vehicle' in t.lower()]
    print(f"\n  Vehicle topics ({len(vehicle_topics)}):")
    for t in vehicle_topics:
        print(f"    {t}")
    
    # Check lifecycle of vehicle_bridge if it exists
    if bridge_found:
        output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 lifecycle get /vehicle_bridge 2>&1'", timeout=15)
        print(f"\n  Vehicle bridge lifecycle: {output.strip()}")
        if "active" in output:
            results.append(("Vehicle bridge activated by Autoware", True))
        else:
            results.append(("Vehicle bridge activated by Autoware", False))
    
    # ==================================================================
    # SUMMARY
    # ==================================================================
    print("\n" + "="*60)
    print("RESULTS")
    print("="*60)
    
    for name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"  [{status}] {name}")
    
    passed = sum(1 for _, r in results if r)
    print(f"\n  {passed}/{len(results)} passed")
    
    # Cleanup
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    client.close()

if __name__ == "__main__":
    main()
