"""Validate the E-Trike sensor-kit launch files are well-formed and wired correctly.

These tests parse the XML launch files without launching ROS 2 nodes. They
guard against broken include paths, wrong package names, and missing args.
"""

import xml.etree.ElementTree as ET
from pathlib import Path


PKG = "etrike_sensor_kit_launch"


def _launch_dir() -> Path:
    return Path(__file__).resolve().parents[1] / "launch"


def _parse(filename: str) -> ET.Element:
    path = _launch_dir() / filename
    assert path.is_file(), f"missing launch file: {path}"
    return ET.parse(path).getroot()


def _collect_includes(root: ET.Element) -> list[str]:
    includes = []
    for inc in root.iter("include"):
        f = inc.get("file", "")
        if f:
            includes.append(f)
    return includes


def test_sensing_launch_exists_and_is_valid_xml() -> None:
    root = _parse("sensing.launch.xml")
    assert root.tag == "launch"


def test_sensing_launch_includes_lidar_and_velocity_converter() -> None:
    root = _parse("sensing.launch.xml")
    includes = _collect_includes(root)
    inc_text = " ".join(includes)
    assert "lidar.launch.xml" in inc_text, "sensing.launch.xml must include lidar.launch.xml"
    assert (
        "autoware_vehicle_velocity_converter" in inc_text
    ), "sensing.launch.xml must include the velocity converter"


def test_lidar_launch_includes_hesai_xt32m2x() -> None:
    root = _parse("lidar.launch.xml")
    includes = _collect_includes(root)
    inc_text = " ".join(includes)
    assert (
        "etrike_common_launch" in inc_text
    ), "lidar.launch.xml must include etrike_common_launch"
    assert (
        "hesai_XT32M2X.launch.xml" in inc_text
    ), "lidar.launch.xml must include hesai_XT32M2X.launch.xml"


def test_lidar_launch_uses_lidar_link_frame() -> None:
    root = _parse("lidar.launch.xml")
    # sensor_frame="lidar_link" is passed into the hesai_XT32M2X include,
    # matching the lidar_link frame already defined in vehicle.xacro's TF tree.
    found = False
    for arg in root.iter("arg"):
        if arg.get("name") == "sensor_frame" and arg.get("value") == "lidar_link":
            found = True
            break
    assert found, "lidar.launch.xml must pass sensor_frame=lidar_link to the driver"


def test_lidar_launch_has_lidar_namespace() -> None:
    root = _parse("lidar.launch.xml")
    ns_elements = list(root.iter("push-ros-namespace"))
    namespaces = [e.get("namespace", "") for e in ns_elements]
    assert "lidar" in namespaces, "lidar.launch.xml must push ros-namespace 'lidar'"


def test_sensing_launch_has_required_args() -> None:
    root = _parse("sensing.launch.xml")
    arg_names = {arg.get("name") for arg in root.iter("arg")}
    for required in ("launch_driver", "vehicle_mirror_param_file", "pointcloud_container_name"):
        assert required in arg_names, f"sensing.launch.xml missing arg: {required}"
