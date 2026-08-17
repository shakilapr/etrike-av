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

"""Validate the E-Trike sensor-kit description URDF and calibration files.

These tests check XML/YAML structure without requiring xacro or ROS 2. They
guard against malformed xacro includes and ensure the calibration yamls have
the keys Autoware's vehicle launch expects.
"""

import xml.etree.ElementTree as ET
from pathlib import Path

import yaml


def _pkg_root() -> Path:
    return Path(__file__).resolve().parents[1]


def _localname(tag: str) -> str:
    """Return the local part of a possibly-namespaced XML tag."""
    return tag.split("}")[-1]


def test_sensor_kit_xacro_is_valid_xml() -> None:
    p = _pkg_root() / "urdf" / "sensor_kit.xacro"
    assert p.is_file()
    root = ET.parse(p).getroot()
    assert root.tag == "robot"

    # xacro:macro is namespaced (xmlns:xacro), so ElementTree sees
    # {http://ros.org/wiki/xacro}macro. Match by local-name suffix.
    macros = [t for t in root.iter() if _localname(t.tag) == "macro"]
    assert len(macros) >= 1, "sensor_kit.xacro must define a xacro:macro"
    assert macros[0].get("name") == "sensor_kit_macro"


def test_sensors_xacro_includes_sensor_kit_and_calls_macro() -> None:
    p = _pkg_root() / "urdf" / "sensors.xacro"
    assert p.is_file()
    content = p.read_text()
    assert "sensor_kit.xacro" in content, "sensors.xacro must include sensor_kit.xacro"
    assert "sensor_kit_macro" in content, "sensors.xacro must call sensor_kit_macro"

    root = ET.parse(p).getroot()
    assert root.tag == "robot"
    assert root.get("name") == "vehicle"


def test_sensor_kit_xacro_does_not_parent_lidar_link() -> None:
    """lidar_link is already defined in etrike_vehicle_description/vehicle.xacro.

    The sensor_kit must not create a second joint parenting lidar_link, or the
    combined URDF will have a duplicate-parent error. We check parsed XML
    elements only (not comments) to avoid false positives from documentation.
    """
    p = _pkg_root() / "urdf" / "sensor_kit.xacro"
    root = ET.parse(p).getroot()
    for joint in root.iter():
        if _localname(joint.tag) != "joint":
            continue
        child_elem = joint.find("child")
        if child_elem is not None and child_elem.text == "lidar_link":
            raise AssertionError(
                "sensor_kit.xacro must not create a joint with child=lidar_link — "
                "it is already parented in etrike_vehicle_description/vehicle.xacro"
            )


def test_sensors_calibration_yaml_has_base_link_to_sensor_kit() -> None:
    p = _pkg_root() / "config" / "sensors_calibration.yaml"
    data = yaml.safe_load(p.read_text())
    assert "base_link" in data
    assert "sensor_kit_base_link" in data["base_link"]
    transform = data["base_link"]["sensor_kit_base_link"]
    for key in ("x", "y", "z", "roll", "pitch", "yaw"):
        assert key in transform, f"missing key '{key}' in sensors_calibration.yaml"


def test_sensor_kit_calibration_yaml_loads() -> None:
    p = _pkg_root() / "config" / "sensor_kit_calibration.yaml"
    data = yaml.safe_load(p.read_text())
    # May be empty (sensor_kit_base_link: {}) since lidar_link is already placed
    # by vehicle.xacro. Just verify it parses.
    assert isinstance(data, dict)
