"""LiDAR PointCloud2 Streamer for AV Dashboard.

Processes real sensor_msgs/msg/PointCloud2 streams from Hesai PandarXT32M (XT32M2X),
transforms points from lidar_link into vehicle-relative Three.js coordinates,
applies fast vectorized range filtering and downsampling via NumPy, and packs
the resulting (x, y, z, intensity) array into contiguous binary Float32 bytes
for high-performance WebSocket streaming to the WebGL cockpit.
"""

from __future__ import annotations

import struct
import threading
import time
from typing import Any, Optional, Tuple
import numpy as np


class LidarStreamer:
    """Thread-safe point cloud decoder and binary packer."""

    def __init__(
        self,
        target_points: int = 15000,
        min_range_m: float = 0.35,
        max_range_m: float = 60.0,
        lidar_z_offset_m: float = 1.7464,
    ) -> None:
        self.target_points = target_points
        self.min_range_m = min_range_m
        self.max_range_m = max_range_m
        self.lidar_z_offset_m = lidar_z_offset_m

        self._lock = threading.Lock()
        self._latest_bytes: Optional[bytes] = None
        self._latest_point_count: int = 0
        self._latest_timestamp: float = 0.0
        self._total_frames_received: int = 0

    def process_pointcloud(self, msg: Any) -> None:
        """Decode and process an incoming PointCloud2 message.
        
        Expected fields:
            x (float32, offset 0)
            y (float32, offset 4)
            z (float32, offset 8)
            intensity (float32, offset 12)
        Total point_step: 16 (or higher if ring/timestamp present).
        """
        now = time.time()
        point_step = getattr(msg, "point_step", 16)
        width = getattr(msg, "width", 0)
        height = getattr(msg, "height", 1)
        total_pts = width * height
        if total_pts == 0 or not msg.data:
            return

        raw_data = msg.data
        if not isinstance(raw_data, (bytes, bytearray, memoryview)):
            try:
                raw_data = bytes(raw_data)
            except Exception:
                return

        try:
            # 1. Fast structured array extraction using NumPy
            if point_step == 16:
                # Direct reshape if point_step is exactly 16 bytes (x, y, z, intensity as float32)
                arr = np.frombuffer(raw_data, dtype=np.float32).reshape(-1, 4)
            else:
                # Custom point step (e.g. 32/48 bytes with ring, timestamp, etc.)
                # Inspect fields or default to first 16 bytes
                dtype = np.dtype([
                    ('xyz_i', np.float32, 4),
                    ('rest', np.uint8, point_step - 16)
                ])
                structured = np.frombuffer(raw_data, dtype=dtype)
                arr = structured['xyz_i']

            # 2. Extract channels
            ros_x = arr[:, 0]
            ros_y = arr[:, 1]
            ros_z = arr[:, 2]
            intensity = arr[:, 3]

            # 3. Filter NaNs, Infs, and range
            valid_mask = np.isfinite(ros_x) & np.isfinite(ros_y) & np.isfinite(ros_z)
            dist_sq = ros_x * ros_x + ros_y * ros_y + ros_z * ros_z
            range_mask = (dist_sq >= (self.min_range_m ** 2)) & (dist_sq <= (self.max_range_m ** 2))
            mask = valid_mask & range_mask

            valid_x = ros_x[mask]
            valid_y = ros_y[mask]
            valid_z = ros_z[mask]
            valid_i = intensity[mask]

            n_valid = len(valid_x)
            if n_valid == 0:
                return

            # 4. Decimate / stride if point count exceeds target budget
            if n_valid > self.target_points:
                stride = int(np.ceil(n_valid / self.target_points))
                valid_x = valid_x[::stride]
                valid_y = valid_y[::stride]
                valid_z = valid_z[::stride]
                valid_i = valid_i[::stride]
                n_valid = len(valid_x)

            # 5. Coordinate transform from ROS lidar_link to Three.js base_link:
            # ROS: +X forward, +Y left, +Z up
            # Three.js: +X right, +Y up, -Z forward
            # lidar_link is mounted 1.7464m above ground base_link on the E-Trike
            three_x = -valid_y
            three_y = valid_z + self.lidar_z_offset_m
            three_z = -valid_x

            # 6. Normalize intensity if needed (Hesai XT32 intensity is typically 0 - 255)
            # Clip between 0 and 255 and normalize to 0.0 - 1.0
            norm_intensity = np.clip(valid_i / 255.0, 0.0, 1.0)

            # 7. Pack into contiguous Float32 array: [x0, y0, z0, i0, x1, y1, z1, i1, ...]
            packed = np.empty((n_valid, 4), dtype=np.float32)
            packed[:, 0] = three_x
            packed[:, 1] = three_y
            packed[:, 2] = three_z
            packed[:, 3] = norm_intensity

            buffer_bytes = packed.tobytes()

            with self._lock:
                self._latest_bytes = buffer_bytes
                self._latest_point_count = n_valid
                self._latest_timestamp = now
                self._total_frames_received += 1

        except Exception as err:
            # Safeguard against malformed frames
            pass

    def get_latest_frame(self) -> Tuple[Optional[bytes], int, float]:
        """Return (packed_bytes, point_count, timestamp) thread-safely."""
        with self._lock:
            return self._latest_bytes, self._latest_point_count, self._latest_timestamp

    @property
    def total_frames(self) -> int:
        with self._lock:
            return self._total_frames_received
