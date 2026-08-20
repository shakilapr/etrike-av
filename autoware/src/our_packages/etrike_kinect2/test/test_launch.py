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

import time

import launch
import launch_ros.actions
import launch_ros.events.lifecycle
import launch_testing
import pytest
import rclpy
import lifecycle_msgs.msg
from launch.events import matches_action
from launch_ros.actions import LifecycleNode
from launch.actions import EmitEvent, RegisterEventHandler
from launch.event_handlers import OnProcessStart
from launch_ros.event_handlers import OnStateTransition
from rclpy.node import Node
from diagnostic_msgs.msg import DiagnosticArray


@pytest.mark.launch_test
def generate_test_description():
    # A dummy serial (no device present) -> node must start, auto-activate,
    # and sit in "waiting for USB" without crashing (hotplug idle path,
    # i.e. the normal state before a Kinect is plugged in).
    kinect_node = LifecycleNode(
        package="etrike_kinect2",
        executable="kinect2_node_exec",
        name="kinect2_test",
        namespace="kinect2_test",
        parameters=[{"serial": "TEST_DUMMY_SERIAL"}],
        output="screen",
    )

    configure = EmitEvent(
        event=launch_ros.events.lifecycle.ChangeState(
            lifecycle_node_matcher=matches_action(kinect_node),
            transition_id=lifecycle_msgs.msg.Transition.TRANSITION_CONFIGURE,
        )
    )
    activate = EmitEvent(
        event=launch_ros.events.lifecycle.ChangeState(
            lifecycle_node_matcher=matches_action(kinect_node),
            transition_id=lifecycle_msgs.msg.Transition.TRANSITION_ACTIVATE,
        )
    )

    return launch.LaunchDescription([
        kinect_node,
        RegisterEventHandler(
            OnProcessStart(target_action=kinect_node, on_start=[configure])
        ),
        RegisterEventHandler(
            OnStateTransition(
                target_lifecycle_node=kinect_node,
                goal_state="inactive",
                entities=[activate],
            )
        ),
        launch_testing.actions.ReadyToTest(),
    ])


class DiagnosticsListener(Node):
    def __init__(self):
        super().__init__("kinect2_diag_listener")
        self.received = []
        self.sub = self.create_subscription(
            DiagnosticArray, "/diagnostics", self.cb, 10)

    def cb(self, msg):
        for s in msg.status:
            self.received.append(s.message)


def test_reports_waiting_for_usb():
    # Runs while the launched node is alive (plain test_* function).
    rclpy.init()
    try:
        listener = DiagnosticsListener()
        deadline = time.time() + 15.0
        while time.time() < deadline:
            rclpy.spin_once(listener, timeout_sec=0.5)
            if any("waiting for USB" in m for m in listener.received):
                break
        assert any("waiting for USB" in m for m in listener.received), \
            f"expected 'waiting for USB' diagnostics, got: {listener.received}"
    finally:
        rclpy.shutdown()
