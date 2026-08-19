from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare


def generate_launch_description():
    camera_arg = DeclareLaunchArgument(
        "camera",
        default_value="front",
        description="Which camera to launch: front or rear",
    )

    camera = LaunchConfiguration("camera")

    config_file = PathJoinSubstitution([
        FindPackageShare("etrike_kinect2"),
        "config",
        [camera, ".yaml"],
    ])

    return LaunchDescription([
        camera_arg,
        Node(
            package="etrike_kinect2",
            executable="kinect2_node_exec",
            name=["kinect_", camera],
            namespace=["kinect_", camera],
            parameters=[config_file],
            output="screen",
        ),
    ])
