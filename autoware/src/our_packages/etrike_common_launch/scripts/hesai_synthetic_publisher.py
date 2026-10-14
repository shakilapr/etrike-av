#!/usr/bin/env python3
# Copyright 2026 E-Trike Dev. All rights reserved.
"""Synthetic Hesai XT32 LiDAR Publisher for Bench Testing & Multi-Modal Fusion.

Generates realistic 32-ring LiDAR point clouds at 10 Hz when physical LiDAR
hardware is offline or in bench simulation mode.
Aligns synthetic 3D point clusters with live camera human detections to enable
bench multi-modal Camera+LiDAR fusion testing.
"""

from __future__ import annotations

import json
import math
import time
from typing import Any, List, Optional, Tuple

import numpy as np
import rclpy
from rclpy.lifecycle import LifecycleNode, LifecyclePublisher, LifecycleState, TransitionCallbackReturn
from rclpy.qos import QoSDurabilityPolicy, QoSHistoryPolicy, QoSProfile, QoSReliabilityPolicy
from sensor_msgs.msg import PointCloud2, PointField
from std_msgs.msg import Header, String


class HesaiSyntheticPublisherNode(LifecycleNode):
    """Lifecycle node publishing synthetic 32-ring Hesai XT32 PointClouds at 10 Hz."""

    def __init__(self, node_name: str = "hesai_synthetic_publisher") -> None:
        super().__init__(node_name)
        self.declare_parameter("output_topic", "/sensing/lidar/top/pointcloud_raw_ex")
        self.declare_parameter("frame_id", "lidar_link")
        self.declare_parameter("publish_rate_hz", 10.0)
        self.declare_parameter("ground_rings", 16)

        self._pub_points: Optional[LifecyclePublisher] = None
        self._sub_poses: Optional[Any] = None
        self._timer: Optional[Any] = None

        self._latest_target_positions: List[Tuple[float, float, float]] = []
        self._last_target_time: float = 0.0

        # Hesai XT32 vertical beam angles (32 beams from -16 deg to +15 deg)
        self._beam_elevations: np.ndarray = np.linspace(
            math.radians(-16.0), math.radians(15.0), 32, dtype=np.float32
        )
        self._azimuths: np.ndarray = np.linspace(
            0.0, 2.0 * math.pi, 180, endpoint=False, dtype=np.float32
        )

    def on_configure(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Configuring HesaiSyntheticPublisherNode...")

        qos_pub = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1,
        )

        output_topic = str(self.get_parameter("output_topic").value)
        self._pub_points = self.create_lifecycle_publisher(
            PointCloud2,
            output_topic,
            qos_pub,
        )

        qos_sub = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1,
        )

        self._sub_poses = self.create_subscription(
            String,
            "/bench_perception/human_poses",
            self._on_human_poses,
            qos_sub,
        )

        self.get_logger().info(f"Synthetic LiDAR publisher configured for {output_topic}")
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Activating HesaiSyntheticPublisherNode...")
        if self._pub_points:
            self._pub_points.on_activate(state)

        rate = float(self.get_parameter("publish_rate_hz").value)
        self._timer = self.create_timer(1.0 / max(1.0, rate), self._publish_scan)
        return TransitionCallbackReturn.SUCCESS

    def on_deactivate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Deactivating HesaiSyntheticPublisherNode...")
        if self._timer:
            self._timer.cancel()
            self._timer = None
        if self._pub_points:
            self._pub_points.on_deactivate(state)
        return TransitionCallbackReturn.SUCCESS

    def on_cleanup(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Cleaning up HesaiSyntheticPublisherNode...")
        self._pub_points = None
        self._sub_poses = None
        return TransitionCallbackReturn.SUCCESS

    def on_shutdown(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Shutting down HesaiSyntheticPublisherNode...")
        return TransitionCallbackReturn.SUCCESS

    def _on_human_poses(self, msg: String) -> None:
        """Receive live human poses to project synthetic point clusters onto detected subjects."""
        try:
            data = json.loads(msg.data)
            poses = data.get("poses", [])
            positions: List[Tuple[float, float, float]] = []
            for p in poses:
                xb = float(p.get("x_base", 0.0))
                yb = float(p.get("y_base", 0.0))
                zb = float(p.get("z_base", 0.0))
                if 0.5 <= xb <= 12.0:
                    positions.append((xb, yb, zb))
            self._latest_target_positions = positions
            self._last_target_time = time.time()
        except Exception:
            pass

    def _publish_scan(self) -> None:
        """Generate and publish 32-ring LiDAR scan."""
        if not self._pub_points or not self._pub_points.is_activated:
            return

        now = time.time()
        frame_id = str(self.get_parameter("frame_id").value)

        points_list: List[np.ndarray] = []

        # 1. Ground and room ambient returns
        # Hesai mounted on roof at z=1.58m above ground
        lidar_z_offset = 1.58
        for elev in self._beam_elevations[:16]:
            if elev < -0.05:  # pointing down towards ground
                ground_dist = -lidar_z_offset / math.sin(elev)
                if 1.0 <= ground_dist <= 25.0:
                    az = self._azimuths[::3]  # sparse ground rings
                    gx = ground_dist * math.cos(elev) * np.cos(az)
                    gy = ground_dist * math.cos(elev) * np.sin(az)
                    gz = np.full_like(gx, -lidar_z_offset, dtype=np.float32)
                    intensities = np.full_like(gx, 40.0, dtype=np.float32)
                    pts = np.column_stack([gx, gy, gz, intensities])
                    points_list.append(pts)

        # 2. Add realistic pedestrian returns if person is detected or at default test position
        targets = list(self._latest_target_positions) if (now - self._last_target_time < 1.0) else []
        if not targets:
            # Default test subject at x=3.2m, y=0.0m
            targets = [(3.2, 0.0, 0.9)]

        for tx, ty, tz in targets:
            # Transform from base_link to lidar_link:
            # lidar is at x=0.963, y=0.0, z=1.58 in base_link
            lx = tx - 0.963
            ly = ty - 0.0
            lz = tz - 1.58

            # Sample 60 points in a vertical cylinder representing human torso/legs
            n_pts = 60
            h_samples = np.linspace(-0.6, 0.6, 12, dtype=np.float32)
            ang_samples = np.linspace(0, 2 * math.pi, 5, endpoint=False, dtype=np.float32)
            grid_h, grid_ang = np.meshgrid(h_samples, ang_samples)
            cx = lx + 0.22 * np.cos(grid_ang.flatten())
            cy = ly + 0.22 * np.sin(grid_ang.flatten())
            cz = lz + grid_h.flatten()
            c_intensities = np.full_like(cx, 180.0, dtype=np.float32)

            pts_ped = np.column_stack([cx, cy, cz, c_intensities])
            points_list.append(pts_ped)

        if not points_list:
            return

        all_points = np.vstack(points_list).astype(np.float32)

        # Build PointCloud2 message
        header = Header()
        header.stamp = self.get_clock().now().to_msg()
        header.frame_id = frame_id

        msg = PointCloud2()
        msg.header = header
        msg.height = 1
        msg.width = len(all_points)
        msg.is_dense = True
        msg.is_bigendian = False
        msg.point_step = 16
        msg.row_step = msg.point_step * msg.width
        msg.fields = [
            PointField(name="x", offset=0, datatype=PointField.FLOAT32, count=1),
            PointField(name="y", offset=4, datatype=PointField.FLOAT32, count=1),
            PointField(name="z", offset=8, datatype=PointField.FLOAT32, count=1),
            PointField(name="intensity", offset=12, datatype=PointField.FLOAT32, count=1),
        ]
        msg.data = all_points.tobytes()

        self._pub_points.publish(msg)


def main(args: Optional[List[str]] = None) -> None:
    rclpy.init(args=args)
    node = HesaiSyntheticPublisherNode()
    try:
        # Auto-configure and activate for standalone bench testing
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
