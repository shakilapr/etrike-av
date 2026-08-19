import unittest

import launch
import launch_ros.actions
import launch_testing
import launch_testing.actions
import launch_testing.markers
import pytest


@pytest.mark.launch_test
@launch_testing.marks.keep_alive(substrate=5)
def generate_test_description():
    kinect_node = launch_ros.actions.Node(
        package="etrike_kinect2",
        executable="kinect2_node_exec",
        name="kinect2_test",
        parameters=[{"serial": "test_no_device"}],
        output="screen",
    )

    return launch.LaunchDescription([
        kinect_node,
        launch_testing.actions.ReadyToTest(),
    ])


class TestKinect2Node(unittest.TestCase):
    def test_node_starts(self, proc_output, kinect2_test):
        pass
