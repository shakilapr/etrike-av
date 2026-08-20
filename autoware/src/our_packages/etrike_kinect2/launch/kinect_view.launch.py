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

"""
Standalone Kinect v2 viewer (RGB + depth) for the E-Trike.

Launches the etrike_kinect2 driver and an RViz2 window showing the
color and depth image streams. Intended for quick bring-up / debugging
on the Jetson - independent of the full Autoware stack.

Usage (on the Jetson, inside the Autoware container):

    # Both cameras (requires serials in config/kinect_front.yaml + rear):
    ros2 launch etrike_kinect2 kinect_view.launch.py camera:=dual

    # Single camera (front or rear):
    ros2 launch etrike_kinect2 kinect_view.launch.py camera:=front
    ros2 launch etrike_kinect2 kinect_view.launch.py camera:=rear

Prereqs:
    - libfreenect2 installed, udev rules, USB 3.0
    - serial numbers filled into config/kinect_{front,rear}.yaml
      (find them with: ros2 run etrike_kinect2 kinect2_node_exec --discover)
"""

import os

from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, EmitEvent, RegisterEventHandler
from launch.event_handlers import OnProcessStart
from launch.events import matches_action
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import LifecycleNode, Node
from launch_ros.event_handlers import OnStateTransition
from launch_ros.events.lifecycle import ChangeState
from launch_ros.substitutions import FindPackageShare
from lifecycle_msgs.msg import Transition


def _camera_node(camera: str):
    # Node is named "kinect_<camera>" (no ROS namespace) so the param file key
    # "kinect_<camera>" matches — namespacing would hide params.
    node = LifecycleNode(
        package="etrike_kinect2",
        executable="kinect2_node_exec",
        name=f"kinect_{camera}",
        parameters=[
            PathJoinSubstitution([
                FindPackageShare("etrike_kinect2"),
                "config",
                f"kinect_{camera}.yaml",
            ]),
        ],
        output="screen",
    )

    configure = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(node),
            transition_id=Transition.TRANSITION_CONFIGURE,
        )
    )
    activate = EmitEvent(
        event=ChangeState(
            lifecycle_node_matcher=matches_action(node),
            transition_id=Transition.TRANSITION_ACTIVATE,
        )
    )

    return LaunchDescription([
        node,
        RegisterEventHandler(
            OnProcessStart(target_action=node, on_start=[configure])
        ),
        RegisterEventHandler(
            OnStateTransition(
                target_lifecycle_node=node,
                goal_state="inactive",
                entities=[activate],
            )
        ),
    ])


def generate_launch_description() -> LaunchDescription:
    share = get_package_share_directory("etrike_kinect2")

    camera_arg = DeclareLaunchArgument(
        "camera", default_value="dual",
        description="Which camera(s) to view: front, rear, or dual",
    )
    camera = LaunchConfiguration("camera")

    nodes = []
    if str(camera.perform(None)) == "front":
        nodes.append(_camera_node("front"))
    elif str(camera.perform(None)) == "rear":
        nodes.append(_camera_node("rear"))
    else:
        nodes.append(_camera_node("front"))
        nodes.append(_camera_node("rear"))

    rviz = Node(
        package="rviz2",
        executable="rviz2",
        name="rviz2",
        # Always render on the Jetson's physical monitor (:1), whether this
        # launch is triggered from a local terminal or over SSH.
        env=[("DISPLAY", ":1")],
        arguments=["-d", os.path.join(share, "rviz", "kinect_view.rviz")],
        output="screen",
    )

    return LaunchDescription([camera_arg] + nodes + [rviz])
