#!/usr/bin/env python3
# Copyright 2026 E-Trike Dev. All rights reserved.
"""Hesai PointCloud to Autoware PointXYZIRC Adapter Node.

Converts incoming LiDAR PointCloud2 streams (x, y, z, intensity) into the structured
PointXYZIRC layout required by Autoware BEVFusion and CenterPoint preprocessors.
Computes 32-ring channel index and return_type flags at full sensor rate (10 Hz).
"""

from __future__ import annotations

import math
from typing import Any, List, Optional

import numpy as np
import rclpy
from rclpy.lifecycle import LifecycleNode, LifecyclePublisher, LifecycleState, TransitionCallbackReturn
from rclpy.qos import QoSDurabilityPolicy, QoSHistoryPolicy, QoSProfile, QoSReliabilityPolicy
from sensor_msgs.msg import PointCloud2, PointField
from std_msgs.msg import Header


class HesaiPointXYZIRCAdapterNode(LifecycleNode):
    """Converts raw PointCloud2 to PointXYZIRC layout for BEVFusion."""

    def __init__(self, node_name: str = "hesai_pointxyzirc_adapter") -> None:
        super().__init__(node_name)
        self.declare_parameter("input_topic", "/sensing/lidar/top/pointcloud_raw_ex")
        self.declare_parameter("output_topic", "/sensing/lidar/concatenated/pointcloud")
        self.declare_parameter("ring_count", 32)
        self.declare_parameter("min_elevation_deg", -16.0)
        self.declare_parameter("max_elevation_deg", 15.0)

        self._pub_points: Optional[LifecyclePublisher] = None
        self._sub_points: Optional[Any] = None

        min_elev = math.radians(float(self.get_parameter("min_elevation_deg").value))
        max_elev = math.radians(float(self.get_parameter("max_elevation_deg").value))
        rings = int(self.get_parameter("ring_count").value)
        self._elevation_bins: np.ndarray = np.linspace(min_elev, max_elev, rings)

    def on_configure(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Configuring HesaiPointXYZIRCAdapterNode...")

        qos_profile = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1,
        )

        input_topic = str(self.get_parameter("input_topic").value)
        output_topic = str(self.get_parameter("output_topic").value)

        self._pub_points = self.create_lifecycle_publisher(
            PointCloud2,
            output_topic,
            qos_profile,
        )

        self._sub_points = self.create_subscription(
            PointCloud2,
            input_topic,
            self._on_input_pointcloud,
            qos_profile,
        )

        self.get_logger().info(f"Adapter: {input_topic} -> {output_topic} (PointXYZIRC)")
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Activating HesaiPointXYZIRCAdapterNode...")
        if self._pub_points:
            self._pub_points.on_activate(state)
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Deactivating HesaiPointXYZIRCAdapterNode...")
        if self._pub_points:
            self._pub_points.on_deactivate(state)
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Cleaning up HesaiPointXYZIRCAdapterNode...")
        self._pub_points = None
        self._sub_points = None
        return TransitionCallbackReturn.SUCCESS

    def on_shutdown(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Shutting down HesaiPointXYZIRCAdapterNode...")
        return TransitionCallbackReturn.SUCCESS

    def _on_input_pointcloud(self, msg: PointCloud2) -> None:
        """Process incoming raw point cloud and repack into PointXYZIRC."""
        if not self._pub_points or not self._pub_points.is_activated:
            return

        point_step = msg.point_step
        if point_step < 12:
            return

        raw_bytes = np.frombuffer(msg.data, dtype=np.uint8)
        num_points = len(raw_bytes) // point_step
        if num_points == 0:
            return

        reshaped = raw_bytes[: num_points * point_step].reshape(num_points, point_step)
        xyz_bytes = np.ascontiguousarray(reshaped[:, :12])
        pts = xyz_bytes.view(dtype=np.float32).reshape(-1, 3)

        valid_mask = np.isfinite(pts).all(axis=1)
        valid_pts = pts[valid_mask]
        num_valid = len(valid_pts)
        if num_valid == 0:
            return

        # Extract or compute intensity
        if point_step >= 16:
            intensity_raw = np.ascontiguousarray(reshaped[valid_mask, 12:16]).view(dtype=np.float32).flatten()
            intensity_u8 = np.clip(intensity_raw, 0, 255).astype(np.uint8)
        else:
            intensity_u8 = np.full(num_valid, 100, dtype=np.uint8)

        # Compute vertical elevation and map to 32 beam channels
        r = np.linalg.norm(valid_pts, axis=1)
        r_safe = np.maximum(r, 0.001)
        elevations = np.arcsin(np.clip(valid_pts[:, 2] / r_safe, -1.0, 1.0))
        channels = np.digitize(elevations, self._elevation_bins).astype(np.uint16)
        channels = np.clip(channels, 0, 31).astype(np.uint16)

        # Return type = 1 (strongest / single return)
        return_types = np.ones(num_valid, dtype=np.uint8)

        # Pack structured PointXYZIRC buffer:
        # float32 x, y, z (12 bytes)
        # uint8 intensity (1 byte)
        # uint8 return_type (1 byte)
        # uint16 channel (2 bytes)
        # Total = 16 bytes per point
        dt = np.dtype([
            ("x", "<f4"),
            ("y", "<f4"),
            ("z", "<f4"),
            ("intensity", "u1"),
            ("return_type", "u1"),
            ("channel", "<u2"),
        ])

        structured_arr = np.empty(num_valid, dtype=dt)
        structured_arr["x"] = valid_pts[:, 0]
        structured_arr["y"] = valid_pts[:, 1]
        structured_arr["z"] = valid_pts[:, 2]
        structured_arr["intensity"] = intensity_u8
        structured_arr["return_type"] = return_types
        structured_arr["channel"] = channels

        # Build output PointCloud2 message
        header = Header()
        header.stamp = msg.header.stamp
        header.frame_id = msg.header.frame_id

        out_msg = PointCloud2()
        out_msg.header = header
        out_msg.height = 1
        out_msg.width = num_valid
        out_msg.is_dense = True
        out_msg.is_bigendian = False
        out_msg.point_step = 16
        out_msg.row_step = 16 * num_valid
        out_msg.fields = [
            PointField(name="x", offset=0, datatype=PointField.FLOAT32, count=1),
            PointField(name="y", offset=4, datatype=PointField.FLOAT32, count=1),
            PointField(name="z", offset=8, datatype=PointField.FLOAT32, count=1),
            PointField(name="intensity", offset=12, datatype=PointField.UINT8, count=1),
            PointField(name="return_type", offset=13, datatype=PointField.UINT8, count=1),
            PointField(name="channel", offset=14, datatype=PointField.UINT16, count=1),
        ]
        out_msg.data = structured_arr.tobytes()

        self._pub_points.publish(out_msg)


def main(args: Optional[List[str]] = None) -> None:
    rclpy.init(args=args)
    node = HesaiPointXYZIRCAdapterNode()
    try:
        node.trigger_configure()
        node.trigger_activate()
        rclpy.spin(node)
    except (KeyboardInterrupt, rclpy.executors.ExternalShutdownException):
        pass
    finally:
        node.destroy_node()
        rclpy.try_shutdown()


if __name__ == "__main__":
    main()
