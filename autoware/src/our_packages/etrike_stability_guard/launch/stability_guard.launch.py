"""Launch the E-Trike roll/tip-over stability guard.

Defaults match the Bajaj RE geometry used by the rest of the E-Trike
packages. Pass ``enable_emergency:=true`` only after the CoG height and
track width have been validated on the physical vehicle.
"""

from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description() -> LaunchDescription:
    wheel_base = LaunchConfiguration("wheel_base")
    track_width = LaunchConfiguration("track_width")
    cog_height = LaunchConfiguration("cog_height")
    safety_margin = LaunchConfiguration("safety_margin")
    enable_emergency = LaunchConfiguration("enable_emergency")

    return LaunchDescription(
        [
            DeclareLaunchArgument("wheel_base", default_value="2.0"),
            DeclareLaunchArgument("track_width", default_value="1.15"),
            DeclareLaunchArgument("cog_height", default_value="0.8"),
            DeclareLaunchArgument("safety_margin", default_value="0.6"),
            DeclareLaunchArgument("enable_emergency", default_value="false"),
            Node(
                package="etrike_stability_guard",
                executable="stability_guard_node",
                name="etrike_stability_guard",
                output="screen",
                parameters=[
                    {
                        "wheel_base": wheel_base,
                        "track_width": track_width,
                        "cog_height": cog_height,
                        "safety_margin": safety_margin,
                        "enable_emergency": enable_emergency,
                    }
                ],
            ),
        ]
    )
