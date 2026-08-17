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

"""Validate the E-Trike Hesai XT32M2X calibration CSV and launch configs.

These tests run with pytest under ``colcon test`` and do not require a running
ROS 2 stack or connected sensor. They guard against accidental corruption of
the device-specific angle-correction file and the preprocessor param yamls.
"""

import csv
import os
from pathlib import Path

import yaml


def _pkg_share() -> Path:
    # colcon sets AMENT_PREFIX_PREFIX-style env; fall back to the source tree
    # location so the test also passes when run directly with pytest.
    for env in ("ETRIKE_COMMON_LAUNCH_PACKAGE_SHARE",):
        if os.environ.get(env):
            return Path(os.environ[env])
    return Path(__file__).resolve().parents[1]


def test_calibration_csv_has_32_channels() -> None:
    csv_path = _pkg_share() / "config" / "lidar" / "PandarXT32M.csv"
    assert csv_path.is_file(), f"missing calibration file: {csv_path}"

    with csv_path.open(newline="") as f:
        reader = csv.DictReader(f)
        assert reader.fieldnames == ["Channel", "Elevation", "Azimuth"]
        rows = list(reader)

    assert len(rows) == 32, f"expected 32 channels, got {len(rows)}"

    channels = [int(r["Channel"]) for r in rows]
    assert channels == list(range(1, 33)), "channels must be 1..32 in order"


def test_calibration_elevation_range_matches_xt32m2x() -> None:
    csv_path = _pkg_share() / "config" / "lidar" / "PandarXT32M.csv"
    with csv_path.open(newline="") as f:
        rows = list(csv.DictReader(f))

    elevations = [float(r["Elevation"]) for r in rows]
    # Hesai XT32M2X FOV: -20.8 deg to +19.5 deg (manual + Nebula fov_mdeg).
    assert max(elevations) <= 19.5, f"max elevation {max(elevations)} exceeds +19.5"
    assert min(elevations) >= -20.8, f"min elevation {min(elevations)} below -20.8"
    # Channel 1 must be near the top (+19.43 deg per device calibration).
    assert abs(elevations[0] - 19.433708) < 1e-3
    # Channel 32 must be near the bottom (-20.75 deg per device calibration).
    assert abs(elevations[-1] - (-20.747455)) < 1e-3


def test_calibration_azimuth_values_are_reasonable() -> None:
    csv_path = _pkg_share() / "config" / "lidar" / "PandarXT32M.csv"
    with csv_path.open(newline="") as f:
        rows = list(csv.DictReader(f))

    azimuths = [float(r["Azimuth"]) for r in rows]
    # Per-channel azimuth offsets are small (sub-degree) for the XT32M2X.
    for az in azimuths:
        assert -1.0 < az < 1.0, f"azimuth {az} outside expected sub-degree range"


def test_distortion_corrector_param_yaml_loads() -> None:
    p = _pkg_share() / "config" / "distortion_corrector_node.param.yaml"
    data = yaml.safe_load(p.read_text())
    params = data["/**"]["ros__parameters"]
    assert params["base_frame"] == "base_link"
    assert "use_imu" in params


def test_ring_outlier_filter_param_yaml_loads() -> None:
    p = _pkg_share() / "config" / "ring_outlier_filter_node.param.yaml"
    data = yaml.safe_load(p.read_text())
    params = data["/**"]["ros__parameters"]
    assert params["max_rings_num"] >= 32, "ring outlier filter must support >= 32 rings"
