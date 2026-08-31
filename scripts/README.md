# E-Trike AV Scripts Directory

This directory contains utility scripts for workspace management, testing, diagnostics, remote execution, and network setups for the E-Trike Autonomous Vehicle project.

---

## Table of Contents

1. [Workspace Management & Verification](#1-workspace-management--verification)
   - [bootstrap_workspace.sh](file:///E:/work/av_project/scripts/bootstrap_workspace.sh)
   - [audit_repo_sync.ps1](file:///E:/work/av_project/scripts/audit_repo_sync.ps1)
2. [Sensing & Network Configuration](#2-sensing--network-configuration)
   - [setup_lidar_network.sh](file:///E:/work/av_project/scripts/setup_lidar_network.sh)
   - [setup_ptp.sh](file:///E:/work/av_project/scripts/setup_ptp.sh)
   - [lidar_bringup.sh](file:///E:/work/av_project/scripts/lidar_bringup.sh)
   - [lidar_standalone.sh](file:///E:/work/av_project/scripts/lidar_standalone.sh)
3. [DDS & ROS2 Diagnostics](#3-dds--ros2-diagnostics)
   - [dds_diag.sh](file:///E:/work/av_project/scripts/dds_diag.sh)
   - [check_dds_diag.sh](file:///E:/work/av_project/scripts/check_dds_diag.sh)
   - [check_rviz_diag.sh](file:///E:/work/av_project/scripts/check_rviz_diag.sh)
   - [check_rviz_deep.sh](file:///E:/work/av_project/scripts/check_rviz_deep.sh)
4. [Lifecycle & Process Control](#4-lifecycle--process-control)
   - [kill_all.sh](file:///E:/work/av_project/scripts/kill_all.sh)
   - [kill_container.sh](file:///E:/work/av_project/scripts/kill_container.sh)
5. [SSH Remote Commands](#5-ssh-remote-commands)
   - [ssh_connect.ps1](file:///E:/work/av_project/scripts/ssh_connect.ps1)
   - [ssh_test.py](file:///E:/work/av_project/scripts/ssh_test.py)
6. [E-Trike Build & Test Runners](#6-e-trike-build--test-runners)
   - [run_tests.py](file:///E:/work/av_project/scripts/run_tests.py)
   - [pre_vehicle_tests.py](file:///E:/work/av_project/scripts/pre_vehicle_tests.py)
   - [test_autoware_integration.py](file:///E:/work/av_project/scripts/test_autoware_integration.py)
   - [final_test.py](file:///E:/work/av_project/scripts/final_test.py)
7. [Debugging & Environment Probes](#7-debugging--environment-probes)
   - [check_etrike_launch_error.py](file:///E:/work/av_project/scripts/check_etrike_launch_error.py)
   - [check_topics.py](file:///E:/work/av_project/scripts/check_topics.py)
   - [check_vehicle_launch.py](file:///E:/work/av_project/scripts/check_vehicle_launch.py)
   - [debug_autoware.py](file:///E:/work/av_project/scripts/debug_autoware.py)
   - [debug_lifecycle.py](file:///E:/work/av_project/scripts/debug_lifecycle.py)
   - [debug_node.py](file:///E:/work/av_project/scripts/debug_node.py)
   - [debug_tests.py](file:///E:/work/av_project/scripts/debug_tests.py)
8. [Automatic Bug Fixers](#8-automatic-bug-fixers)
   - [fix_and_rebuild.py](file:///E:/work/av_project/scripts/fix_and_rebuild.py)
   - [fix_launch.py](file:///E:/work/av_project/scripts/fix_launch.py)
   - [fix_yaml.py](file:///E:/work/av_project/scripts/fix_yaml.py)
9. [Protocol Synchronization](#9-protocol-synchronization)
   - [update-protocol.sh](file:///E:/work/av_project/scripts/update-protocol.sh)
   - [update-protocol.ps1](file:///E:/work/av_project/scripts/update-protocol.ps1)

---

## 1. Workspace Management & Verification

### [bootstrap_workspace.sh](file:///E:/work/av_project/scripts/bootstrap_workspace.sh)
* **Description**: Initializes and reconstructs the full source workspace (upstream Autoware packages + E-Trike patches) from a fresh repository clone.
* **Pseudo-code**:
  ```python
  ASSERT tools (vcs, python3, git) are installed
  ASSERT repositories/autoware.repos file exists

  PRINT "[STEP 1] Importing upstream Autoware repositories..."
  RUN "vcs import autoware/src < repositories/autoware.repos"

  PRINT "[STEP 2] Verifying upstream folders exist..."
  FOR each key_directory IN [autoware_msgs, autoware_universe, autoware_launch, nebula]:
      IF key_directory does not exist:
          PRINT "ERROR: missing upstream components"
          EXIT 1

  PRINT "[STEP 3] Applying E-Trike patches..."
  IF patches/apply_nebula_firetime_patch.sh exists:
      EXECUTE patches/apply_nebula_firetime_patch.sh

  PRINT "[STEP 4] Verifying our_packages exist..."
  FOR each etrike_package IN [autoware_vehicle_bridge, etrike_protocol, etrike_vehicle_description, ...]:
      IF autoware/src/our_packages/etrike_package does not exist:
          PRINT "ERROR: E-Trike packages missing"
          EXIT 1

  PRINT "Bootstrap complete. Ready for docker build."
  ```

### [audit_repo_sync.ps1](file:///E:/work/av_project/scripts/audit_repo_sync.ps1)
* **Description**: Full audit PowerShell script checking local source packages and workspace sync against upstreampinned versions on GitHub, uncommitted changes, junk files, and untracked scripts.
* **Pseudo-code**:
  ```python
  # Part 1: Main repository status
  RUN "git fetch origin"
  IF local_HEAD != origin/main:
      IF ahead:
          WARN "Local is ahead, needs push"
      IF behind:
          ERROR "Local is behind, needs pull"
  IF tracked files have uncommitted changes:
      ERROR "Uncommitted changes found"

  # Part 2: check our_packages/
  IF diff in autoware/src/our_packages/:
      ERROR "Modified files in our_packages/"
  IF untracked files in our_packages/ (excluding __pycache__):
      WARN "Untracked files in our_packages/"

  # Part 3: check all upstream repos
  IF NOT SkipUpstream:
      PARSE repositories/autoware.repos to extract URL and version for each repo
      FOR each repo:
          IF local folder missing:
              ERROR "Directory missing"
              CONTINUE
          FETCH file tree from GitHub API at pinned version (recursive)
          FILTER only source code files (cpp, hpp, py, xml, yaml, etc.)
          FOR each upstream file:
              IF local file exists:
                  COMPUTE local git blob SHA
                  IF local_SHA != upstream_SHA AND file NOT in expected_patches:
                      WARN "Unexpected modification in file"
                      
  # Part 4: Untracked scripts & junk
  IF untracked files in scripts/*.sh, scripts/*.py:
      WARN "Untracked scripts found"
  IF files matching *.sync-conflict*, *.orig, *.bak:
      WARN "Junk files found"
  
  # Part 5: Nested git repositories
  FOR each subdirectory with .git in our_packages/:
      IF nested repo has modified files:
          WARN "Uncommitted changes in nested repo"
  ```

---

## 2. Sensing & Network Configuration

### [setup_lidar_network.sh](file:///E:/work/av_project/scripts/setup_lidar_network.sh)
* **Description**: Configures the host Jetson Orin's ethernet interface with the static IP needed to talk to the Hesai XT32M2X LiDAR sensor.
* **Pseudo-code**:
  ```python
  READ interface (default eno1), host_ip (default 192.168.1.10), sensor_ip (default 192.168.1.201)
  ASSERT interface exists in /sys/class/net/

  PRINT "Configuring network interface..."
  TRY:
      ADD host_ip/24 to interface
  EXCEPT:
      IF interface already has host_ip:
          OK
      ELSE:
          PRINT "Conflict: Interface has different IP"
          EXIT 1

  BRING interface UP

  PRINT "Pinging sensor..."
  IF ping to sensor_ip succeeds:
      PRINT "Sensor reachable"
  ELSE:
      WARN "Sensor not responding"

  PRINT "Checking for UDP traffic..."
  LISTEN on interface for UDP packets on port 2368 for 5 seconds (via tcpdump)
  IF packets received:
      PRINT "UDP packets detected. Sensor is streaming."
  ELSE:
      WARN "No UDP packets detected."
  ```

### [setup_ptp.sh](file:///E:/work/av_project/scripts/setup_ptp.sh)
* **Description**: Configures and runs Precision Time Protocol (PTP) synchronization daemon `ptp4l` and hardware clock sync `phc2sys` along with `chrony` on the Jetson Orin.
* **Pseudo-code**:
  ```python
  READ interface (default eno1)
  ASSERT commands (ptp4l, phc2sys, chronyc) exist

  CHECK PTP hardware clock support (/dev/ptp0, /dev/ptp1, /dev/ptp2)
  IF hardware device found:
      timestamping = "hardware"
  ELSE:
      timestamping = "software"

  PRINT "Configuring chrony..."
  COPY config/chrony.conf TO /etc/chrony/chrony.conf
  RESTART chrony daemon

  PRINT "Configuring ptp4l..."
  COPY config/ptp4l.conf TO /etc/ptp4l.conf
  KILL any running ptp4l processes

  IF timestamping == "hardware":
      START ptp4l in background: "ptp4l -i interface -f /etc/ptp4l.conf -m"
      KILL any running phc2sys processes
      START phc2sys in background: "phc2sys -s ptp_device -c CLOCK_REALTIME -m -O 0"
  ELSE:
      START ptp4l in background: "ptp4l -i interface -f /etc/ptp4l.conf -m -S"
  ```

### [lidar_bringup.sh](file:///E:/work/av_project/scripts/lidar_bringup.sh)
* **Description**: LiDAR bench validation helper. Asserts network connectivity and UDP streaming, then launches the Autoware sensing pipeline.
* **Pseudo-code**:
  ```python
  PARSE flags: check_only, no_driver, rviz3d
  
  # Step 1: Network Check
  IF ping sensor_ip fails:
      IF NOT check_only: EXIT 1

  # Step 2: UDP Check
  LISTEN on interface for UDP port 2368 for 5 seconds
  IF packet_count == 0:
      WARN "No UDP packets detected"

  IF check_only:
      EXIT 0

  # Step 3: Launch
  SOURCE /opt/autoware/setup.bash
  SOURCE workspace_install/setup.bash

  IF rviz3d:
      SET rviz_config = etrike_common_launch/rviz/etrike.rviz
  
  SET launch_args = [map_path, sensor_model:=etrike_sensor_kit, vehicle_model:=etrike_vehicle]
  IF no_driver == False:
      launch_args += [launch_sensing_driver:=true]
  ELSE:
      launch_args += [launch_sensing_driver:=false]

  LAUNCH "ros2 launch autoware_launch autoware.launch.xml" with launch_args in background (save PID)
  WAIT 15 seconds for nodes to spin up

  # Step 4: Topic Verification
  IF "/sensing/lidar/top/pointcloud_raw_ex" in ros2 topic list:
      PRINT "pointcloud_raw_ex advertised"
  IF "/sensing/lidar/top/pointcloud_before_sync" in ros2 topic list:
      PRINT "pointcloud_before_sync advertised"
  MEASURE hz rate of "/sensing/lidar/top/pointcloud_raw_ex" for 5 seconds

  # Step 5: TF Check
  CHECK TF transform from base_link to lidar_link
  
  WAIT for background launch process to exit
  ```

### [lidar_standalone.sh](file:///E:/work/av_project/scripts/lidar_standalone.sh)
* **Description**: Starts a container on the host with NVIDIA runtime and display forwarding to launch the Nebula Hesai driver and RViz2 for 3D point cloud visualization.
* **Pseudo-code**:
  ```python
  IF inside Autoware container:
      SOURCE /opt/autoware/setup.bash and workspace
      EXECUTE "ros2 launch etrike_lidar_viewer lidar_view.launch.py" directly
      EXIT

  # On Host
  ASSERT sensor_ip is reachable
  REMOVE any existing lidar_rviz container
  ALLOW local docker connections to X server (xhost)

  RUN docker container:
      - Privileged, runtime=nvidia, gpus=all, net=host, ipc=host
      - DISPLAY, XDG_RUNTIME_DIR, and X11-unix volume mount for graphical forwarding
      - Workspace directories mounted
      - COMMAND: Source environments and launch "ros2 launch etrike_lidar_viewer lidar_view.launch.py"
  ```

---

## 3. DDS & ROS2 Diagnostics

### [dds_diag.sh](file:///E:/work/av_project/scripts/dds_diag.sh)
* **Description**: Minimal environment check inside the container/host to report environment variables, RMW packages, basic topics, and check if RViz2 or `robot_state_publisher` are running.
* **Pseudo-code**:
  ```python
  SOURCE /opt/autoware/setup.bash and workspace setup
  PRINT RMW_IMPLEMENTATION and ROS_DOMAIN_ID
  PRINT path to ros2 CLI binary
  PRINT installed RMW debian packages (dpkg -l)
  PRINT status of workspace setup bash scripts
  PRINT first 10 ROS topics (timeout 5s)
  PRINT first 10 ROS nodes (timeout 5s)
  PRINT size of /robot_description output
  PRINT running rviz2 processes
  PRINT running robot_state_publisher processes
  ```

### [check_dds_diag.sh](file:///E:/work/av_project/scripts/check_dds_diag.sh)
* **Description**: Detailed diagnostic script for CycloneDDS / ROS2 RMW interfaces, examining ROS daemon status, environment, and checking root `.ros` directory.
* **Pseudo-code**:
  ```python
  PRINT RMW_IMPLEMENTATION, ROS_DOMAIN_ID, and CYCLONEDDS_URI
  LIST files in /root/.ros/
  FIND cyclonedds*.xml or rmw_implementation* configuration files
  SOURCE ROS2 paths
  PRINT running ros2 daemon processes (pgrep)
  RUN "timeout 5 ros2 topic list" (show first 10)
  RUN "timeout 5 ros2 node list" (show first 10)
  ```

### [check_rviz_diag.sh](file:///E:/work/av_project/scripts/check_rviz_diag.sh)
* **Description**: Quick script to troubleshoot RViz launch issues on the Jetson. Inspects error/warn logs, tf/map/robot_description topics, and checking running processes.
* **Pseudo-code**:
  ```python
  GREP "/tmp/launch2.log" for "ERROR", "WARN", "tf_fail", "map_fail", or "robot_model"
  PRINT number of active robot_state_publisher processes
  SOURCE ROS2 setups
  LIST active topics containing tf, map, robot_desc, or pointcloud
  PRINT running rviz2 processes
  TAIL last 50 lines of /tmp/launch2.log
  ```

### [check_rviz_deep.sh](file:///E:/work/av_project/scripts/check_rviz_deep.sh)
* **Description**: Deeper RViz troubleshooting tool analyzing ROS log paths, `/tmp` launch records, active nodes, filtered topics, `/robot_description` size, and RViz logs.
* **Pseudo-code**:
  ```python
  LIST files in /root/.ros/log/
  LIST launch logs in /tmp
  TAIL last 30 lines of /tmp/launch.log and /tmp/launch2.log
  SOURCE ROS2 setups
  RUN "timeout 8 ros2 node list" (show first 30)
  RUN "timeout 8 ros2 topic list" filtering tf/map/robot_desc/pointcloud/vehicle
  PRINT size of /robot_description (in bytes)
  TAIL last 30 lines of latest rviz2*.log
  PRINT active processes matching ros2, rviz, robot_state, planning, control
  ```

---

## 4. Lifecycle & Process Control

### [kill_all.sh](file:///E:/work/av_project/scripts/kill_all.sh)
* **Description**: Cleanly removes the test container and forcefully terminates leftover ROS2/RViz processes on the host.
* **Pseudo-code**:
  ```python
  REMOVE docker container autoware_test (forcefully)
  TERMINATE all host processes matching "ros2" (SIGKILL)
  TERMINATE all host processes matching "rviz2" (SIGKILL)
  TERMINATE all host processes matching "robot_state_publisher" (SIGKILL)
  TERMINATE all host processes matching "planning_simulator" (SIGKILL)
  PRINT list of remaining docker containers
  PRINT count of active ros2 processes
  ```

### [kill_container.sh](file:///E:/work/av_project/scripts/kill_container.sh)
* **Description**: Targets leftover processes inside a running container or local host environment.
* **Pseudo-code**:
  ```python
  KILL all processes matching "ros2 launch" (SIGKILL)
  KILL all python planning_simulator processes
  KILL all rviz2 processes
  KILL all robot_state_publisher processes
  KILL remaining python3 processes
  PRINT count of active ros2 processes
  ```

---

## 5. SSH Remote Commands

### [ssh_connect.ps1](file:///E:/work/av_project/scripts/ssh_connect.ps1)
* **Description**: Utility PowerShell wrapper that invokes PuTTY's `plink.exe` using a transient `expect` automation file to bypass host key prompts when connecting to the Jetson (`172.16.25.67`).
* **Pseudo-code**:
  ```python
  READ Command (default: hostname output)
  SET expectScript = TRANSIENT SCRIPT:
      - Spawn plink -ssh med1@172.16.25.67 Command
      - IF prompted with "The host key is not cached" -> send "y"
      - IF prompted with "Store key in cache" -> send "y"
  WRITE expectScript to a temporary .exp file
  TRY:
      RUN "expect temp_file"
  EXCEPT:
      WARN "expect not available, manual plink execution required"
  FINALLY:
      DELETE temporary .exp file
  ```

### [ssh_test.py](file:///E:/work/av_project/scripts/ssh_test.py)
* **Description**: Verifies Paramiko SSH connectivity and authentication details from Windows to the remote Jetson target.
* **Pseudo-code**:
  ```python
  INITIALIZE Paramiko SSHClient
  SET missing host key policy to AutoAddPolicy
  CONNECT to 172.16.25.67 (username med1, password med1)
  
  FOR each command IN ["Connection successful", "hostname", "uname -a", "ls -la ~/av_project/"]:
      EXECUTE command on remote
      PRINT stdout and stderr outputs
      WAIT 1 second
      
  CLOSE connection
  ```

---

## 6. E-Trike Build & Test Runners

### [run_tests.py](file:///E:/work/av_project/scripts/run_tests.py)
* **Description**: Automates package building, C++ unit tests, virtual CAN setup, node integration launching, and diagnostics checks on the remote Jetson.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  
  # Step 1-2: Setup Docker
  CLEANUP "autoware_test" container
  RUN container in detached mode (privileged, nvidia, host network, mounted workspaces)
  
  # Step 3: Build
  EXECUTE colcon build in container for [etrike_protocol, autoware_vehicle_bridge, description, launch]
  
  # Step 4: Unit tests
  EXECUTE "colcon test" for autoware_vehicle_bridge
  EXECUTE "colcon test-result"
  
  # Step 5-6: Setup host CAN
  LOAD vcan kernel module
  CREATE and bring up vcan0 link
  INSTALL can-utils if not installed
  
  # Step 7: Launch node
  LAUNCH vehicle_interface.launch.xml inside container (in background)
  
  # Step 8: Inject CAN feedback
  SEND CAN frames:
      - 7FD#01.00 (RT Heartbeat)
      - 011#00.01.00 (SYS Safety Status)
      - 210#01.00.00.00.00.00 (RT State Report)
      - 121#E8.03.00.00.01.00.00.00 (RT Motion Report)
      
  # Step 9: Diagnostics
  ECHO /diagnostics topic inside container (timeout 5s)
  
  # Step 10: Cleanup
  STOP and REMOVE container
  DELETE vcan0 link
  ```

### [pre_vehicle_tests.py](file:///E:/work/av_project/scripts/pre_vehicle_tests.py)
* **Description**: Safety validation script executing 9 functional scenarios (engage, disengage, estop, heartbeat timeout, command timeout, and feedback status) via virtual CAN injection before running on a real vehicle.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  SPIN UP autoware_test container and BUILD packages
  CREATE and bring up vcan0 interface on host
  LAUNCH vehicle_interface.launch.xml in background
  
  # Verify Node Lifecycle State
  IF /vehicle_bridge lifecycle is active:
      RECORD PASS
  
  # TEST 1: Initial state - gate blocked (no CAN feedback)
  ECHO /vehicle_bridge/output/diagnostics
  IF "RT Heartbeat" is missing: RECORD PASS
  
  # TEST 2: Inject CAN feedback (alive state)
  SEND vcan0: 7FD#01.00, 011#00.01.00, 210#01... and 121#E8...
  ECHO /vehicle_bridge/output/diagnostics
  IF "RT Heartbeat" is alive: RECORD PASS
  
  # TEST 3: Engage command
  PUBLISH to /api/autoware/get/engage: "engage: true"
  IF diagnostics report "engaged": RECORD PASS
  
  # TEST 4: Lateral/Longitudinal control command
  PUBLISH to /control/command/control_cmd
  LISTEN to vcan0 via candump for 1 second
  IF IDs 300 or 303 are present: RECORD PASS
  
  # TEST 5: Software emergency stop
  PUBLISH to /control/command/emergency_cmd: "emergency: true"
  IF diagnostics report "Software emergency asserted": RECORD PASS
  
  # TEST 6: Hardware/System ESTOP injection
  SEND vcan0: 011#01.01.00 (estop active)
  IF diagnostics report "SYS ESTOP ACTIVE": RECORD PASS
  
  # TEST 7: RT Heartbeat timeout detection
  SEND vcan0: 011#00.01.00 (clear estop)
  STOP sending 7FD#01.00 (RT Heartbeat)
  WAIT 3 seconds (timeout is 1.5s)
  IF diagnostics report "RT Heartbeat missing": RECORD PASS
  
  # TEST 8: Command timeout validation
  SEND vcan0: 7FD#01.00 (re-enable heartbeat)
  STOP publishing control commands for 2 seconds
  (Checks command timeout handler logs/state)
  
  # TEST 9: Disengage command
  PUBLISH to /api/autoware/get/engage: "engage: false"
  IF diagnostics report "disengaged": RECORD PASS
  
  CLEANUP docker and vcan0
  PRINT results summary (fail if any test failed)
  ```

### [test_autoware_integration.py](file:///E:/work/av_project/scripts/test_autoware_integration.py)
* **Description**: Connects via SSH to test baseline simulation launches with both the generic `sample_vehicle` model and the custom `etrike_vehicle` model.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  SPIN UP autoware_test container and BUILD packages

  # TEST 1: Launch with sample_vehicle
  LAUNCH planning_simulator.launch.xml in background (vehicle_model:=sample_vehicle, rviz:=false)
  WAIT up to 90 seconds for nodes to initialize
  IF node list size > 5:
      RECORD PASS
  LIST active vehicle-related topics
  STOP simulator (pkill -f ros2)

  # TEST 2: Launch with etrike_vehicle
  LAUNCH planning_simulator.launch.xml in background (vehicle_model:=etrike_vehicle, rviz:=false)
  WAIT up to 90 seconds
  IF node list size > 5:
      RECORD PASS
  IF "/vehicle_bridge" is running:
      RECORD PASS
  GET lifecycle state of "/vehicle_bridge" (assert active)
  
  CLEANUP container
  PRINT results summary
  ```

### [final_test.py](file:///E:/work/av_project/scripts/final_test.py)
* **Description**: Performs a quick integration test verifying that CAN feedback signals map to diagnostic topics and vehicle status topics inside the Docker container.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  SPIN UP autoware_test container and BUILD packages
  SETUP vcan0 on host
  LAUNCH vehicle_interface.launch.xml in background
  WAIT 8 seconds
  
  GET lifecycle of /vehicle_bridge (assert active)
  
  # Inject CAN feedback
  SEND vcan0: 7FD#01.00, 011#00.01.00, 210#01.00.00.00.00.00, 121#E8.03.00.00.01.00.00.00
  WAIT 3 seconds
  
  # Check output topics
  ECHO /vehicle_bridge/output/diagnostics (assert message is received)
  ECHO /vehicle/status/velocity_status (assert velocity matches injected CAN values)
  
  CLEANUP container and vcan0
  ```

---

## 7. Debugging & Environment Probes

### [check_etrike_launch_error.py](file:///E:/work/av_project/scripts/check_etrike_launch_error.py)
* **Description**: Remote runner to launch `planning_simulator.launch.xml` with `etrike_vehicle` in the foreground to capture startup bugs and dependency issues.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  SPIN UP autoware_test container
  BUILD etrike_protocol, autoware_vehicle_bridge, description, and launch
  
  LAUNCH in foreground:
      "timeout 60 ros2 launch autoware_launch planning_simulator.launch.xml vehicle_model:=etrike_vehicle sensor_model:=sample_sensor_kit rviz:=false"
  PRINT stdout and stderr from launch (timeout at 75s)
  
  CLEANUP container
  ```

### [check_topics.py](file:///E:/work/av_project/scripts/check_topics.py)
* **Description**: Investigates how the vehicle bridge responds before and after injecting various CAN frames (diagnostic checks).
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  SPIN UP container, build packages, setup vcan0
  LAUNCH vehicle_interface.launch.xml in background
  WAIT 8 seconds
  
  PRINT node info /vehicle_bridge
  PRINT list of active topics (initial)
  
  # Inject CAN frames
  SEND vcan0: 7FD#01.00, 011#00.01.00, 210#01.00.00.00.00.00, 121#E8.03.00.00.01.00.00.00
  WAIT 3 seconds
  
  PRINT list of active topics (after CAN injection)
  PRINT diagnostic topic frequency: "ros2 topic hz /diagnostics"
  GREP topic list for "diag"
  
  CLEANUP container and vcan0
  ```

### [check_vehicle_launch.py](file:///E:/work/av_project/scripts/check_vehicle_launch.py)
* **Description**: Inspects upstream and sample launch files and checks the files/YAML configuration within the container.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  SPIN UP container
  
  # Output file contents
  CAT /opt/autoware/tier4_vehicle_launch/share/tier4_vehicle_launch/launch/vehicle.launch.xml
  CAT /opt/autoware/sample_vehicle_launch/share/sample_vehicle_launch/launch/vehicle_interface.launch.xml
  
  # List files
  FIND files in /opt/autoware/sample_vehicle_launch
  FIND files in /opt/autoware/sample_vehicle_description
  
  # Output yaml param file
  CAT /opt/autoware/sample_vehicle_description/share/sample_vehicle_description/config/vehicle_info.param.yaml
  
  CLEANUP container
  ```

### [debug_autoware.py](file:///E:/work/av_project/scripts/debug_autoware.py)
* **Description**: Starts the Autoware planning simulator and queries environment parameters and ROS status inside the container.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  SPIN UP container, build packages
  LIST contents of map directory ~/autoware_map/sample-map-planning/
  
  LAUNCH in foreground: "timeout 30 ros2 launch autoware_launch planning_simulator.launch.xml map_path:=/autoware_map/sample-map-planning vehicle_model:=etrike_vehicle sensor_model:=sample_sensor_kit rviz:=false"
  
  PRINT ROS_DOMAIN_ID and RMW_IMPLEMENTATION
  RUN "ros2 doctor --report" (first 50 lines)
  
  CLEANUP container
  ```

### [debug_lifecycle.py](file:///E:/work/av_project/scripts/debug_lifecycle.py)
* **Description**: Directly transitions the `/vehicle_bridge` lifecycle node and injects CAN messages to inspect resulting states and logs.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  SPIN UP container, build packages, setup vcan0
  LAUNCH vehicle_interface.launch.xml in background
  WAIT 8 seconds
  
  PRINT current lifecycle state of /vehicle_bridge
  PRINT /vehicle_bridge node info
  PRINT list of active topics (verbose mode)
  
  # Transition state manually
  RUN "ros2 lifecycle set /vehicle_bridge configure"
  PRINT lifecycle state
  RUN "ros2 lifecycle set /vehicle_bridge activate"
  PRINT lifecycle state
  
  # Inject CAN
  SEND vcan0: 7FD#01.00, 011#00.01.00, 210#01.00.00.00.00.00, 121#E8.03.00.00.01.00.00.00
  ECHO /diagnostics (once)
  ECHO /rosout (once)
  
  CLEANUP container and vcan0
  ```

### [debug_node.py](file:///E:/work/av_project/scripts/debug_node.py)
* **Description**: Launches `vehicle_interface.launch.xml` in the foreground for 15 seconds to check for startup crashes.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  SPIN UP container, build packages, setup vcan0
  
  LAUNCH in foreground: "timeout 15 ros2 launch etrike_vehicle_launch vehicle_interface.launch.xml can_interface:=vcan0"
  
  CLEANUP container and vcan0
  ```

### [debug_tests.py](file:///E:/work/av_project/scripts/debug_tests.py)
* **Description**: Inspects C++ unit test logs, executes the test binaries directly, and launches the node to query interface health.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  SPIN UP container, build packages
  
  # Inspect unit tests
  CAT /workspace/autoware/build/autoware_vehicle_bridge/Testing/Temporary/LastTest.log
  RUN unit test binary directly: "/workspace/autoware/build/autoware_vehicle_bridge/test_motion_conversion"
  
  # Check runtime
  SETUP vcan0
  LAUNCH vehicle_interface.launch.xml in foreground (10 seconds)
  PRINT node list
  PRINT topic list
  
  CLEANUP container and vcan0
  ```

---

## 8. Automatic Bug Fixers

### [fix_and_rebuild.py](file:///E:/work/av_project/scripts/fix_and_rebuild.py)
* **Description**: Fixes a specific scope declaration bug (CallbackReturn) in `vehicle_bridge_node.cpp` via sed, runs build/unit tests, and tests integration behavior.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  
  # Fix scope issue
  REPLACE "CallbackReturn VehicleBridgeNode::" WITH "rclcpp_lifecycle::node_interfaces::LifecycleNodeInterface::CallbackReturn VehicleBridgeNode::" in vehicle_bridge_node.cpp
  GREP for std::clamp and s.values in vehicle_bridge_node.cpp
  
  SPIN UP container
  BUILD autoware_vehicle_bridge
  
  IF build succeeds:
      RUN "colcon test"
      RUN "colcon test-result --verbose"
      
      # Test running bridge
      SETUP vcan0
      LAUNCH vehicle_interface.launch.xml in background
      WAIT 5 seconds
      PRINT node list
      
      # Inject CAN feedback
      SEND vcan0: 7FD#01.00, 011#00.01.00, 210#01.00.00.00.00.00, 121#E8.03.00.00.01.00.00.00
      ECHO /diagnostics (once)
      
  CLEANUP container and vcan0
  ```

### [fix_launch.py](file:///E:/work/av_project/scripts/fix_launch.py)
* **Description**: Writes an updated `vehicle_bridge.launch.py` to fix a node namespace configuration issue, rebuilds the package, and verifies functionality using `cansend`.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  
  # Overwrite launch file
  WRITE updated python launch code to ~/av_project/autoware/src/our_packages/autoware_vehicle_bridge/launch/vehicle_bridge.launch.py (defining namespace="")
  
  SPIN UP container
  BUILD autoware_vehicle_bridge
  SETUP vcan0 on host
  LAUNCH vehicle_interface.launch.xml in background
  WAIT 8 seconds
  
  PRINT node list
  PRINT topic list
  
  # Inject CAN
  SEND vcan0: 7FD#01.00, 011#00.01.00, 210#01.00.00.00.00.00, 121#E8.03.00.00.01.00.00.00
  ECHO /diagnostics (once)
  
  CLEANUP container and vcan0
  ```

### [fix_yaml.py](file:///E:/work/av_project/scripts/fix_yaml.py)
* **Description**: Fixes a parameter type casting crash in `etrike.param.yaml` (integer to double conversion), rebuilds, and launches the node to test functionality.
* **Pseudo-code**:
  ```python
  CONNECT via SSH to 172.16.25.67
  
  # Fix YAML type error
  REPLACE "max_brake_pressure_kpa: 5000" WITH "max_brake_pressure_kpa: 5000.0" in etrike.param.yaml
  
  SPIN UP container
  BUILD autoware_vehicle_bridge
  SETUP vcan0
  LAUNCH vehicle_interface.launch.xml in background
  WAIT 8 seconds
  
  PRINT node list
  PRINT lifecycle status of /vehicle_bridge
  
  # Inject CAN
  SEND vcan0: 7FD#01.00, 011#00.01.00, 210#01.00.00.00.00.00, 121#E8.03.00.00.01.00.00.00
  ECHO /diagnostics (once)
  
  CLEANUP container and vcan0
  ```

---

## 9. Protocol Synchronization

### [update-protocol.sh](file:///E:/work/av_project/scripts/update-protocol.sh)
* **Description**: Bash script to fetch raw YAML contract specs from the upstream `etrike` repository, generate updated C++ headers using python tools, and copy them to the local `our_packages/etrike_protocol` workspace.
* **Pseudo-code**:
  ```python
  READ branch (default: main)
  CREATE temporary directory
  SET cleanup handler (trap) to delete temporary directory on exit
  
  CLONE etrike repository with depth 1 (sparse clone) into temporary directory
  SET sparse checkout folders: [contracts, tools, vectors, core, codecs/python]
  GET commit hash
  
  GENERATE headers:
      RUN "python -m tools.protocol generate" inside temp/etrike/protocol
      
  COPY generated C++ header to autoware/src/our_packages/etrike_protocol/generated/cpp/etrike_protocol.hpp
  
  IF test vectors folder exists:
      REMOVE local vectors folder
      COPY test vectors to autoware/src/our_packages/etrike_protocol/vectors
      
  PRINT success message and commit git commands
  ```

### [update-protocol.ps1](file:///E:/work/av_project/scripts/update-protocol.ps1)
* **Description**: PowerShell equivalent of the `update-protocol.sh` script, automating sparse clone, Python-based code generation, and directory copying on Windows systems.
* **Pseudo-code**:
  ```python
  READ Branch (default: main)
  CREATE temporary directory
  
  TRY:
      CLONE etrike repository with depth 1 (sparse clone) into temporary directory
      SET sparse checkout folders: [contracts, tools, vectors, core, codecs/python]
      GET commit hash
      
      GENERATE headers:
          RUN "python -m tools.protocol generate" inside temp/etrike/protocol
          
      IF python command fails:
          EXIT 1
          
      COPY generated C++ header to autoware/src/our_packages/etrike_protocol/generated/cpp/etrike_protocol.hpp
      
      IF test vectors folder exists:
          REMOVE local vectors folder
          COPY test vectors to autoware/src/our_packages/etrike_protocol/vectors
          
      PRINT success message and commit git commands
  FINALLY:
      REMOVE temporary directory recursively
  ```
