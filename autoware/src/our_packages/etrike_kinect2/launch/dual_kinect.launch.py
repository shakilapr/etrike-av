from launch import LaunchDescription
from launch.actions import GroupAction
from launch.substitutions import PathJoinSubstitution
from launch_ros.actions import Node, PushRosNamespace
from launch_ros.substitutions import FindPackageShare


def generate_launch_description():
    # Serial numbers are read from config YAML files.
    # Edit config/kinect_front.yaml and config/kinect_rear.yaml before launching.

    front_node = GroupAction([
        PushRosNamespace("kinect_front"),
        Node(
            package="etrike_kinect2",
            executable="kinect2_node_exec",
            name="kinect_front",
            parameters=[
                PathJoinSubstitution([
                    FindPackageShare("etrike_kinect2"), "config", "kinect_front.yaml"
                ]),
            ],
            output="screen",
        ),
    ])

    rear_node = GroupAction([
        PushRosNamespace("kinect_rear"),
        Node(
            package="etrike_kinect2",
            executable="kinect2_node_exec",
            name="kinect_rear",
            parameters=[
                PathJoinSubstitution([
                    FindPackageShare("etrike_kinect2"), "config", "kinect_rear.yaml"
                ]),
            ],
            output="screen",
        ),
    ])

    return LaunchDescription([
        front_node,
        rear_node,
    ])
