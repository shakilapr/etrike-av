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


def test_firetime_csv_has_32_channels() -> None:
    csv_path = _pkg_share() / "config" / "lidar" / "XT32M2X_Firetime.csv"
    assert csv_path.is_file(), f"missing firetime file: {csv_path}"

    with csv_path.open(newline="") as f:
        reader = csv.DictReader(f)
        assert reader.fieldnames == ["Channel", "fire time(us)"]
        rows = list(reader)

    assert len(rows) == 32, f"expected 32 channels, got {len(rows)}"

    channels = [int(r["Channel"]) for r in rows]
    assert channels == list(range(1, 33)), "channels must be 1..32 in order"


def test_firetime_values_are_reasonable() -> None:
    csv_path = _pkg_share() / "config" / "lidar" / "XT32M2X_Firetime.csv"
    with csv_path.open(newline="") as f:
        rows = list(csv.DictReader(f))

    firetimes_us = [float(r["fire time(us)"]) for r in rows]
    # XT32M2X firetimes range from ~6 us to ~49 us per the device calibration.
    for ft in firetimes_us:
        assert 0.0 <= ft <= 60.0, f"firetime {ft} us outside expected 0-60 us range"


def test_firetime_differs_from_nebula_hardcoded_formula() -> None:
    """Verify the device CSV differs from Nebula's built-in formula.

    The Nebula PandarXT32M decoder uses: 368 + 2888 * channel_id ns (where
    channel_id wraps at 16). This test confirms the device CSV provides
    different (more accurate) values, which is the reason we deploy it.
    """
    csv_path = _pkg_share() / "config" / "lidar" / "XT32M2X_Firetime.csv"
    with csv_path.open(newline="") as f:
        rows = list(csv.DictReader(f))

    differences = []
    for r in rows:
        ch = int(r["Channel"])
        device_us = float(r["fire time(us)"])
        ch_idx = (ch - 1) % 16
        nebula_us = (368 + 2888 * ch_idx) / 1000.0
        differences.append(abs(device_us - nebula_us))

    mean_diff = sum(differences) / len(differences)
    # The mean absolute difference should be non-trivial (~5.6 us per analysis).
    assert mean_diff > 1.0, (
        f"mean firetime difference {mean_diff:.3f} us is too small — "
        "the device CSV should differ meaningfully from Nebula's hard-coded formula"
    )


def test_etrike_rviz_config_exists_and_is_valid() -> None:
    """etrike.rviz is the dedicated 3D config for viewing the lidar cloud.

    The stock autoware.rviz used by the planning simulator is top-down
    (TopDownOrtho) and does not include the lidar's own point cloud topics,
    so this config exists to actually see the XT32M2X cloud in 3D.
    """
    p = _pkg_share() / "rviz" / "etrike.rviz"
    assert p.is_file(), f"missing rviz config: {p}"
    data = yaml.safe_load(p.read_text())

    fixed_frame = data["Visualization Manager"]["Global Options"]["Fixed Frame"]
    assert fixed_frame == "base_link", f"fixed frame should be base_link, got {fixed_frame}"

    displays = data["Visualization Manager"]["Displays"]
    topics = [d["Topic"]["Value"] for d in displays if "Topic" in d]
    assert "/sensing/lidar/top/pointcloud_before_sync" in topics, (
        "etrike.rviz must include the preprocessed lidar cloud display"
    )
    assert "/sensing/lidar/top/pointcloud_raw_ex" in topics, (
        "etrike.rviz must include the raw lidar cloud display"
    )

    # Default view must be a 3D view (not TopDownOrtho) so the cloud is visible.
    views = data["Visualization Manager"]["Views"]
    assert views["Current"] == "ThirdPersonFollower", (
        "etrike.rviz should default to a 3D view; got " + str(views["Current"])
    )
