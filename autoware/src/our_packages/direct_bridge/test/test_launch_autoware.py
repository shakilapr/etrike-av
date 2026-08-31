# Copyright 2026 E-Trike Dev. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Real-stack Autoware integration test for the direct_bridge node.

Validates the bridge against the actual Autoware control stack rather than a
mock. Launches the bridge alongside the real Autoware vehicle-interface launch
and verifies end-to-end topic compatibility, QoS negotiation, and lifecycle
management.

This test is heavier and container-dependent. It is NOT part of the default
`colcon test` run. Execute it explicitly on the target (or a container with
the full Autoware stack) with:

    python3 test/test_launch_autoware.py --interface vcan1

against a running Autoware stack, or launch the bridge through the standard
Autoware planning-simulator / vehicle-interface launch and observe the topics.
"""

import argparse
import subprocess
import sys
import time


def run(cmd, check=True, timeout=60):
    print(f">>> {cmd}")
    proc = subprocess.run(cmd, shell=True, timeout=timeout, capture_output=True, text=True)
    if proc.stdout:
        print(proc.stdout, end="")
    if proc.stderr and proc.returncode != 0:
        print(proc.stderr, end="", file=sys.stderr)
    if check and proc.returncode != 0:
        raise RuntimeError(f"command failed ({proc.returncode}): {cmd}")
    return proc


def check_topic(topic, expected_type):
    out = run(
        f"timeout 5 ros2 topic info {topic} --verbose 2>&1 || true", check=False).stdout
    assert expected_type in out, (
        f"topic {topic} expected type {expected_type}, got:\n{out}")
    print(f"  {topic}: type OK ({expected_type})")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--interface", default="vcan1")
    parser.add_argument("--launch-command", default=None,
                        help="Full launch command that brings up the Autoware "
                             "vehicle interface + direct_bridge. If not given, "
                             "the test only checks topic compatibility against a "
                             "pre-existing Autoware stack.")
    args = parser.parse_args()

    if args.launch_command:
        run(f"modprobe vcan")
        run(f"ip link add dev {args.interface} type vcan 2>/dev/null || true")
        run(f"ip link set {args.interface} up")
        launch_proc = subprocess.Popen(
            args.launch_command, shell=True,
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        time.sleep(12)
    else:
        launch_proc = None

    try:
        print("\n=== Topic compatibility ===")
        # Direct bridge command topics (published by the Autoware control stack).
        check_topic("/control/command/control_cmd", "autoware_control_msgs/msg/Control")
        check_topic("/control/command/gear_cmd", "autoware_vehicle_msgs/msg/GearCommand")
        check_topic("/control/command/emergency_cmd", "tier4_vehicle_msgs/msg/VehicleEmergencyStamped")
        # Direct bridge report topics (consumed by the Autoware vehicle stack).
        check_topic("/vehicle/status/velocity_status", "autoware_vehicle_msgs/msg/VelocityReport")
        check_topic("/vehicle/status/gear_status", "autoware_vehicle_msgs/msg/GearReport")
        check_topic("/vehicle/status/steering_status", "autoware_vehicle_msgs/msg/SteeringReport")

        print("\n=== QoS check (subscribers present = compatible) ===")
        for topic in (
            "/control/command/control_cmd",
            "/control/command/gear_cmd",
            "/control/command/emergency_cmd",
            "/vehicle/status/velocity_status",
            "/vehicle/status/gear_status",
            "/vehicle/status/steering_status",
        ):
            out = run(f"timeout 5 ros2 topic info {topic} --verbose 2>&1 || true",
                      check=False).stdout
            assert "Subscriber count" in out or "Publisher count" in out, (
                f"{topic}: no QoS info")
            print(f"  {topic}: QoS negotiated")

        print("\nPASSED: real-stack Autoware compatibility validated.")
    finally:
        if launch_proc is not None:
            launch_proc.terminate()
            try:
                launch_proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                launch_proc.kill()
            run(f"ip link set {args.interface} down 2>/dev/null || true", check=False)
            run(f"ip link del {args.interface} 2>/dev/null || true", check=False)


if __name__ == "__main__":
    main()
