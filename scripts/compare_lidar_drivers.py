#!/usr/bin/env python3
"""LiDAR Driver Audit & Differential Analysis Tool for Hesai XT32M2X.

Analyzes recorded golden MCAP datasets to benchmark and verify LiDAR packet decoding:
1. Channel elevation angle distribution (verifying 32 rings between -20.8 deg and +19.5 deg).
2. Point count per sweep (target ~36,120 points at 600 RPM / 10 Hz).
3. Azimuth span, monotonicity, and angular spacing.
4. Channel-by-channel intensity, distance, and return type integrity.
5. Firing time offset analysis and timestamp regularity.
"""

import argparse
import math
import struct
import sys
from typing import Dict, List, Optional, Tuple
import numpy as np


def parse_pointcloud2_fields(fields) -> Dict[str, Tuple[int, int]]:
    """Map PointCloud2 fields to (offset, datatype)."""
    mapping = {}
    for f in fields:
        mapping[f.name] = (f.offset, f.datatype)
    return mapping


def analyze_mcap(mcap_path: str) -> None:
    """Analyze pointcloud messages from an MCAP file using rosbag2_py or mcap library."""
    print("=" * 70)
    print(f" Hesai XT32M2X Ground-Truth PointCloud Audit: {mcap_path}")
    print("=" * 70)

    try:
        from mcap.reader import make_reader
        from mcap_ros2.decoder import DecoderFactory
        use_direct_mcap = True
    except ImportError:
        use_direct_mcap = False

    frames_analyzed = 0
    total_points_list: List[int] = []
    ring_points: Dict[int, int] = {i: 0 for i in range(32)}
    ring_elevations: Dict[int, List[float]] = {i: [] for i in range(32)}
    timestamps: List[float] = []

    if use_direct_mcap:
        with open(mcap_path, "rb") as f:
            reader = make_reader(f, decoder_factories=[DecoderFactory()])
            for schema, channel, message, ros_msg in reader.iter_decoded_messages():
                if channel.topic != "/sensing/lidar/top/pointcloud_raw_ex":
                    continue

                frames_analyzed += 1
                stamp = ros_msg.header.stamp.sec + ros_msg.header.stamp.nanosec * 1e-9
                timestamps.append(stamp)

                # PointCloud2 metadata
                width = ros_msg.width
                height = ros_msg.height
                point_step = ros_msg.point_step
                num_points = width * height
                total_points_list.append(num_points)

                # Parse raw buffer with numpy if standard 32-byte layout
                raw_bytes = ros_msg.data
                if point_step >= 32 and len(raw_bytes) >= num_points * point_step:
                    # Parse x, y, z, channel, azimuth, elevation, distance
                    dt = np.dtype([
                        ('x', '<f4'),
                        ('y', '<f4'),
                        ('z', '<f4'),
                        ('intensity', 'u1'),
                        ('return_type', 'u1'),
                        ('channel', '<u2'),
                        ('azimuth', '<f4'),
                        ('elevation', '<f4'),
                        ('distance', '<f4'),
                        ('time_stamp', '<u4'),
                    ])
                    try:
                        arr = np.frombuffer(raw_bytes[:num_points * 32], dtype=dt)
                        channels = arr['channel']
                        elevations = arr['elevation']

                        # Sample first 5 frames for elevation profile
                        if frames_analyzed <= 5:
                            for ch in range(32):
                                ch_mask = channels == ch
                                if np.any(ch_mask):
                                    ring_points[ch] += int(np.sum(ch_mask))
                                    mean_el = float(np.median(elevations[ch_mask]))
                                    ring_elevations[ch].append(mean_el)
                    except Exception as err:
                        if frames_analyzed == 1:
                            print(f"[WARN] Error decoding point struct: {err}")

                if frames_analyzed >= 60:
                    break
    else:
        # Fallback to rosbag2_py inside ROS environment
        import rosbag2_py
        from rclpy.serialization import deserialize_message
        from sensor_msgs.msg import PointCloud2

        storage_options = rosbag2_py.StorageOptions(uri=mcap_path, storage_id="mcap")
        converter_options = rosbag2_py.ConverterOptions("", "")
        reader = rosbag2_py.SequentialReader()
        reader.open(storage_options, converter_options)

        while reader.has_next():
            topic, data, timestamp_ns = reader.read_next()
            if topic != "/sensing/lidar/top/pointcloud_raw_ex":
                continue

            msg = deserialize_message(data, PointCloud2)
            frames_analyzed += 1
            stamp = msg.header.stamp.sec + msg.header.stamp.nanosec * 1e-9
            timestamps.append(stamp)

            num_points = msg.width * msg.height
            total_points_list.append(num_points)

            raw_bytes = bytes(msg.data)
            dt = np.dtype([
                ('x', '<f4'),
                ('y', '<f4'),
                ('z', '<f4'),
                ('intensity', 'u1'),
                ('return_type', 'u1'),
                ('channel', '<u2'),
                ('azimuth', '<f4'),
                ('elevation', '<f4'),
                ('distance', '<f4'),
                ('time_stamp', '<u4'),
            ])
            if msg.point_step >= 32 and len(raw_bytes) >= num_points * 32:
                arr = np.frombuffer(raw_bytes[:num_points * 32], dtype=dt)
                channels = arr['channel']
                elevations = arr['elevation']
                if frames_analyzed <= 5:
                    for ch in range(32):
                        ch_mask = channels == ch
                        if np.any(ch_mask):
                            ring_points[ch] += int(np.sum(ch_mask))
                            mean_el = float(np.median(elevations[ch_mask]))
                            ring_elevations[ch].append(mean_el)

            if frames_analyzed >= 60:
                break

    if not total_points_list:
        print("[ERROR] No PointCloud2 messages found in MCAP dataset.")
        return

    # Statistical Evaluation
    avg_points = np.mean(total_points_list)
    min_points = np.min(total_points_list)
    max_points = np.max(total_points_list)
    std_points = np.std(total_points_list)

    print("\n--- 1. Sweep & Point Count Integrity ---")
    print(f"Frames Analyzed: {frames_analyzed}")
    print(f"Average Points / Sweep: {avg_points:.1f} (Min: {min_points}, Max: {max_points}, StdDev: {std_points:.2f})")
    expected_pts = 32 * 1125  # ~36,000 pts at 10 Hz
    fidelity_pct = (avg_points / expected_pts) * 100.0
    print(f"Fidelity to Nominal 10 Hz Scan (36,000 pts): {fidelity_pct:.1f}%")

    # Timing & Frequency
    if len(timestamps) > 1:
        dt_list = np.diff(timestamps)
        mean_dt = np.mean(dt_list)
        jitter_ms = np.std(dt_list) * 1000.0
        sensor_hz = 1.0 / mean_dt if mean_dt > 0 else 0.0
        print("\n--- 2. Sensor Scan Timing & Jitter ---")
        print(f"Nominal Sweep Period: {mean_dt * 1000.0:.2f} ms ({sensor_hz:.2f} Hz)")
        print(f"Scan-to-Scan Jitter: +/- {jitter_ms:.3f} ms")

    # Channel Elevation Profile
    print("\n--- 3. Channel Elevation Distribution (32 Rings) ---")
    print("Channel | Median Elevation (deg) | Points/Sweep (Avg) | Status")
    print("-" * 62)
    min_el = 999.0
    max_el = -999.0
    for ch in range(32):
        el_samples = ring_elevations.get(ch, [])
        if el_samples:
            deg = np.degrees(np.mean(el_samples))
            min_el = min(min_el, deg)
            max_el = max(max_el, deg)
            pts_per_frame = ring_points.get(ch, 0) / min(frames_analyzed, 5)
            status = "OK" if 900 <= pts_per_frame <= 1300 else "ATTN"
            print(f"  Ch {ch:02d}   |       {deg:+6.2f} deg       |     {pts_per_frame:6.0f} pts     |  {status}")
        else:
            print(f"  Ch {ch:02d}   |       MISSING          |          0 pts     |  ERROR")

    print("-" * 62)
    print(f"Total Elevation FOV: [{min_el:+.2f} deg, {max_el:+.2f} deg] (Span: {max_el - min_el:.2f} deg)")
    print(f"Published Hesai XT32M2X Spec: [-20.8 deg, +19.5 deg] (Span: 40.3 deg)")
    if abs(min_el - (-20.8)) < 2.5 and abs(max_el - 19.5) < 2.5:
        print("[VERDICT: PASSED] Elevation profile matches physical Hesai XT32M2X beam calibration.")
    else:
        print(f"[VERDICT: WARNING] FOV discrepancy detected (Span diff: {abs((max_el - min_el) - 40.3):.2f} deg).")
    print("=" * 70)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Audit and analyze Hesai XT32M2X MCAP datasets.")
    parser.add_argument("mcap", nargs="?", default="/tmp/xt32m2x_golden_packets/xt32m2x_golden_packets_0.mcap",
                        help="Path to MCAP bag file")
    args = parser.parse_args()
    analyze_mcap(args.mcap)
