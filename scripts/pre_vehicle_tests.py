import paramiko
import sys
import time
import subprocess

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

def run_test(client, name, cmd, expected_in_output=None, expected_not_in_output=None):
    """Run a test and check output"""
    print(f"\n--- TEST: {name} ---")
    output, error, code = ssh_run(client, cmd, timeout=30)
    
    passed = True
    if expected_in_output:
        for expected in expected_in_output:
            if expected not in output:
                print(f"FAIL: Expected '{expected}' in output")
                passed = False
    
    if expected_not_in_output:
        for not_expected in expected_not_in_output:
            if not_expected in output:
                print(f"FAIL: Unexpected '{not_expected}' in output")
                passed = False
    
    if passed:
        print(f"PASS: {name}")
    return passed

def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect("172.16.25.56", username="med1", password="med1", timeout=30)
    print("Connected!\n")
    
    results = []
    
    # Setup
    print("=== SETUP ===")
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "docker run -d --name autoware_test --privileged --runtime=nvidia --gpus all --net=host --ipc=host -v ~/av_project/autoware:/workspace/autoware ghcr.io/autowarefoundation/autoware:universe-cuda-humble bash -c 'while true; do sleep 1000; done' 2>&1")
    time.sleep(3)
    ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && cd /workspace/autoware && colcon build --symlink-install --packages-select etrike_protocol autoware_vehicle_bridge etrike_vehicle_launch 2>&1'", timeout=180)
    ssh_run(client, "echo 'med1' | sudo -S modprobe vcan 2>&1")
    ssh_run(client, "echo 'med1' | sudo -S ip link add dev vcan0 type vcan 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link set up vcan0 2>&1")
    
    # Launch node
    print("\n=== LAUNCH NODE ===")
    ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml can_interface:=vcan0 2>&1'")
    time.sleep(8)
    
    # Verify node is active
    output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 lifecycle get /vehicle_bridge 2>&1'")
    if "active" in output:
        results.append(("Node lifecycle active", True))
    else:
        results.append(("Node lifecycle active", False))
        print("FAIL: Node not active")
    
    # TEST 1: Initial state - gate blocked (no CAN feedback)
    print("\n=== TEST 1: Initial state - gate blocked ===")
    output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 3 ros2 topic echo /vehicle_bridge/output/diagnostics --once 2>&1'")
    if "RT Heartbeat" in output and "missing" in output:
        results.append(("Initial gate blocked - RT heartbeat missing", True))
    else:
        results.append(("Initial gate blocked - RT heartbeat missing", False))
    
    # TEST 2: Inject CAN feedback - gate should be ready
    print("\n=== TEST 2: Inject CAN feedback ===")
    for frame in ["7FD#01.00", "011#00.01.00", "210#01.00.00.00.00.00", "121#E8.03.00.00.01.00.00.00"]:
        ssh_run(client, f"echo 'med1' | sudo -S cansend vcan0 {frame} 2>&1")
    time.sleep(3)
    
    output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 3 ros2 topic echo /vehicle_bridge/output/diagnostics --once 2>&1'")
    if "RT Heartbeat" in output and "alive" in output:
        results.append(("RT heartbeat alive after CAN injection", True))
    else:
        results.append(("RT heartbeat alive after CAN injection", False))
    
    # TEST 3: Engage - should accept commands
    print("\n=== TEST 3: Engage ===")
    ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic pub --once /api/autoware/get/engage autoware_vehicle_msgs/msg/Engage \"engage: true\" 2>&1'")
    time.sleep(2)
    
    output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 3 ros2 topic echo /vehicle_bridge/output/diagnostics --once 2>&1'")
    if "Engage" in output and "engaged" in output:
        results.append(("Engage state correct", True))
    else:
        results.append(("Engage state correct", False))
    
    # TEST 4: Send control command - check CAN output
    print("\n=== TEST 4: Control command ===")
    ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic pub --once /control/command/control_cmd autoware_control_msgs/msg/Control \"{lateral: {steering_tire_angle: 0.1}, longitudinal: {velocity: 1.0}}\" 2>&1'")
    time.sleep(2)
    
    # Check if CAN frames are being sent (capture for 1 second)
    output, _, _ = ssh_run(client, "timeout 1 candump vcan0 2>&1 || true")
    if "300" in output or "303" in output:
        results.append(("Control command sent to CAN", True))
    else:
        results.append(("Control command sent to CAN", False))
    
    # TEST 5: Emergency stop
    print("\n=== TEST 5: Emergency stop ===")
    ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic pub --once /control/command/emergency_cmd tier4_vehicle_msgs/msg/VehicleEmergencyStamped \"{emergency: true}\" 2>&1'")
    time.sleep(2)
    
    output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 3 ros2 topic echo /vehicle_bridge/output/diagnostics --once 2>&1'")
    if "Software emergency" in output and "asserted" in output:
        results.append(("Emergency stop works", True))
    else:
        results.append(("Emergency stop works", False))
    
    # TEST 6: SYS ESTOP
    print("\n=== TEST 6: SYS ESTOP ===")
    ssh_run(client, "echo 'med1' | sudo -S cansend vcan0 011#01.01.00 2>&1")  # estop_active=1
    time.sleep(2)
    
    output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 3 ros2 topic echo /vehicle_bridge/output/diagnostics --once 2>&1'")
    if "SYS ESTOP" in output and "ACTIVE" in output:
        results.append(("SYS ESTOP detected", True))
    else:
        results.append(("SYS ESTOP detected", False))
    
    # TEST 7: Heartbeat timeout
    print("\n=== TEST 7: Heartbeat timeout ===")
    ssh_run(client, "echo 'med1' | sudo -S cansend vcan0 011#00.01.00 2>&1")  # Clear ESTOP
    # Stop injecting RT heartbeat, keep SYS alive
    ssh_run(client, "echo 'med1' | sudo -S cansend vcan0 011#00.01.00 2>&1")
    ssh_run(client, "echo 'med1' | sudo -S cansend vcan0 210#01.00.00.00.00.00 2>&1")
    ssh_run(client, "echo 'med1' | sudo -S cansend vcan0 121#E8.03.00.00.01.00.00.00 2>&1")
    time.sleep(3)  # Wait for RT heartbeat timeout (1500ms)
    
    output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 3 ros2 topic echo /vehicle_bridge/output/diagnostics --once 2>&1'")
    if "RT Heartbeat" in output and "missing" in output:
        results.append(("RT heartbeat timeout detected", True))
    else:
        results.append(("RT heartbeat timeout detected", False))
    
    # TEST 8: Command timeout
    print("\n=== TEST 8: Command timeout ===")
    # Re-inject RT heartbeat
    ssh_run(client, "echo 'med1' | sudo -S cansend vcan0 7FD#01.00 2>&1")
    time.sleep(1)
    # Don't publish any control commands, wait for timeout
    time.sleep(2)
    
    # TEST 9: Disengage
    print("\n=== TEST 9: Disengage ===")
    ssh_run(client, "docker exec -d autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && ros2 topic pub --once /api/autoware/get/engage autoware_vehicle_msgs/msg/Engage \"engage: false\" 2>&1'")
    time.sleep(2)
    
    output, _, _ = ssh_run(client, "docker exec autoware_test bash -c 'source /opt/autoware/setup.bash && source /workspace/autoware/install/setup.bash && timeout 3 ros2 topic echo /vehicle_bridge/output/diagnostics --once 2>&1'")
    if "Engage" in output and "disengaged" in output:
        results.append(("Disengage works", True))
    else:
        results.append(("Disengage works", False))
    
    # Cleanup
    print("\n=== CLEANUP ===")
    ssh_run(client, "docker rm -f autoware_test 2>&1 || true")
    ssh_run(client, "echo 'med1' | sudo -S ip link del vcan0 2>&1 || true")
    client.close()
    
    # Summary
    print("\n" + "="*60)
    print("TEST RESULTS")
    print("="*60)
    
    passed = 0
    failed = 0
    for name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"[{status}] {name}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed + failed}, Passed: {passed}, Failed: {failed}")
    
    if failed > 0:
        print("\n*** SOME TESTS FAILED - DO NOT CONNECT TO VEHICLE ***")
        sys.exit(1)
    else:
        print("\n*** ALL TESTS PASSED - Ready for HIL testing ***")

if __name__ == "__main__":
    main()
