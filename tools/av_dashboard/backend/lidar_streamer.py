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
        target_points: int = 6000,
        min_range_m: float = 0.35,
        max_range_m: float = 60.0,
        lidar_z_offset_m: float = 1.7464,
        decimation_stride: int = 2,
    ) -> None:
        self.target_points = target_points
        self.min_range_m = min_range_m
        self.max_range_m = max_range_m
        self.lidar_z_offset_m = lidar_z_offset_m
        self.decimation_stride = max(1, decimation_stride)

        self._lock = threading.Lock()
        self._latest_bytes: Optional[bytes] = None
        self._latest_point_count: int = 0
        self._latest_raw_count: int = 0
        self._latest_timestamp: float = 0.0
        self._total_frames_received: int = 0
        self._filter_mode: str = "filtered"  # "filtered", "raw", or "inspection"
        self._last_frame_time: float = 0.0
        self._measured_hz: float = 0.0

    @property
    def filter_mode(self) -> str:
        with self._lock:
            return self._filter_mode

    @filter_mode.setter
    def filter_mode(self, mode: str) -> None:
        with self._lock:
            if mode in ("filtered", "raw", "inspection"):
                self._filter_mode = mode

    def process_pointcloud(self, msg: Any) -> None:
        """Decode and process an incoming PointCloud2 message.
        
        Extracts exact 32-byte Hesai XT32 fields from Nebula, applies calibrated
        base_link coordinate transform, filters vehicle body self-reflections while
        preserving legitimate rear and lateral obstacles, and packs into binary bytes.
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
            # 1. Structured array extraction using exact Hesai XT32 layout
            if point_step == 32:
                dtype = np.dtype([
                    ('x', np.float32),          # 0..4
                    ('y', np.float32),          # 4..8
                    ('z', np.float32),          # 8..12
                    ('intensity', np.uint8),    # 12..13
                    ('return_type', np.uint8),  # 13..14
                    ('channel', np.uint16),     # 14..16
                    ('azimuth', np.float32),    # 16..20
                    ('elevation', np.float32),  # 20..24
                    ('distance', np.float32),   # 24..28
                    ('time_stamp', np.uint32),  # 28..32
                ])
                structured = np.frombuffer(raw_data, dtype=dtype)
                ros_x = structured['x']
                ros_y = structured['y']
                ros_z = structured['z']
                raw_i = structured['intensity'].astype(np.float32)
            elif point_step == 16:
                arr = np.frombuffer(raw_data, dtype=np.float32).reshape(-1, 4)
                ros_x = arr[:, 0]
                ros_y = arr[:, 1]
                ros_z = arr[:, 2]
                raw_i = arr[:, 3]
            else:
                dtype = np.dtype([
                    ('xyz', np.float32, 3),
                    ('intensity', np.uint8),
                    ('rest', np.uint8, point_step - 13)
                ])
                structured = np.frombuffer(raw_data, dtype=dtype)
                ros_x = structured['xyz'][:, 0]
                ros_y = structured['xyz'][:, 1]
                ros_z = structured['xyz'][:, 2]
                raw_i = structured['intensity'].astype(np.float32)

            # 2. Filter NaNs, Infs, and sensor range boundaries
            valid_mask = np.isfinite(ros_x) & np.isfinite(ros_y) & np.isfinite(ros_z)
            dist_sq = ros_x * ros_x + ros_y * ros_y + ros_z * ros_z
            range_mask = (dist_sq >= (self.min_range_m ** 2)) & (dist_sq <= (self.max_range_m ** 2))
            mask = valid_mask & range_mask

            valid_x = ros_x[mask]
            valid_y = ros_y[mask]
            valid_z = ros_z[mask]
            valid_i = raw_i[mask]

            n_valid = len(valid_x)
            if n_valid == 0:
                return

            # 3. Transform from sensor frame (lidar_link) to vehicle frame (base_link):
            # In vehicle.xacro: lidar is mounted at X=+0.575m forward of rear axle, Y=0.0m, Z=+1.7464m
            base_x = valid_x + 0.575
            base_y = valid_y + 0.000
            base_z = valid_z + self.lidar_z_offset_m

            # 4. Transform from base_link (REP-103) to Three.js world coordinates:
            # base_link: +X forward from rear axle, +Y left, +Z up from ground
            # Three.js: +X right, +Y up, -Z forward (wheelbase center at Z=0.0, rear axle at Z=+1.0m)
            # Basis matrix: X_three = Y_base (corrected Left-Right mirroring), Y_three = Z_base, Z_three = 1.0 - X_base
            three_x = base_y
            three_y = base_z
            three_z = 1.0 - base_x

            # 5. Calibrated Tuk-Tuk vehicle body self-reflection crop box:
            # Physical envelope in base_link coordinates:
            #   Longitudinal: from rear bumper (-0.45m) to front cowl/mudguard (+2.15m)
            #   Lateral: half-width +/-0.68m
            #   Vertical: ground clearance (0.05m) to canopy roof top (1.85m)
            # CRITICAL: Points outside this box (including rear road obstacles at base_x < -0.45m)
            # are completely preserved!
            is_self_reflection = (
                (base_x >= -0.45)
                & (base_x <= 2.15)
                & (np.abs(base_y) <= 0.68)
                & (base_z >= 0.05)
                & (base_z <= 1.85)
            )

            with self._lock:
                current_mode = self._filter_mode

            if current_mode == "raw":
                clean_x = three_x
                clean_y = three_y
                clean_z = three_z
                clean_i = np.clip(valid_i / 255.0, 0.0, 1.0)
            elif current_mode == "inspection":
                # In inspection mode, render self-reflection points with a negative intensity marker
                clean_x = three_x
                clean_y = three_y
                clean_z = three_z
                norm_i = np.clip(valid_i / 255.0, 0.0, 1.0)
                clean_i = np.where(is_self_reflection, -1.0, norm_i)
            else:
                # "filtered" (Default production mode): remove only self-reflections
                surround_mask = ~is_self_reflection
                clean_x = three_x[surround_mask]
                clean_y = three_y[surround_mask]
                clean_z = three_z[surround_mask]
                clean_i = np.clip(valid_i[surround_mask] / 255.0, 0.0, 1.0)

            n_clean = len(clean_x)
            if n_clean == 0:
                return

            # 6. Decimate point cloud density: apply initial stride for clean spacing
            if self.decimation_stride > 1 and n_clean > 0:
                clean_x = clean_x[::self.decimation_stride]
                clean_y = clean_y[::self.decimation_stride]
                clean_z = clean_z[::self.decimation_stride]
                clean_i = clean_i[::self.decimation_stride]
                n_clean = len(clean_x)

            # Cap to target_points if needed
            if n_clean > self.target_points:
                stride = int(np.ceil(n_clean / self.target_points))
                clean_x = clean_x[::stride]
                clean_y = clean_y[::stride]
                clean_z = clean_z[::stride]
                clean_i = clean_i[::stride]
                n_clean = len(clean_x)

            # 7. Pack into contiguous Float32 array: [x0, y0, z0, i0, x1, y1, z1, i1, ...]
            packed = np.empty((n_clean, 4), dtype=np.float32)
            packed[:, 0] = clean_x
            packed[:, 1] = clean_y
            packed[:, 2] = clean_z
            packed[:, 3] = clean_i

            buffer_bytes = packed.tobytes()

            with self._lock:
                if self._last_frame_time > 0:
                    dt = now - self._last_frame_time
                    if dt > 0:
                        instant_hz = 1.0 / dt
                        self._measured_hz = 0.8 * self._measured_hz + 0.2 * instant_hz
                else:
                    self._measured_hz = 10.0
                self._last_frame_time = now
                self._latest_bytes = buffer_bytes
                self._latest_point_count = n_clean
                self._latest_raw_count = n_valid
                self._latest_timestamp = now
                self._total_frames_received += 1

        except Exception as err:
            pass

    def set_density(self, stride: int, target_points: Optional[int] = None) -> None:
        """Set decimation stride and target points thread-safely."""
        with self._lock:
            self.decimation_stride = max(1, stride)
            if target_points is not None:
                self.target_points = max(500, target_points)

    def get_latest_frame(self) -> Tuple[Optional[bytes], int, float]:
        """Return (packed_bytes, point_count, timestamp) thread-safely."""
        with self._lock:
            return self._latest_bytes, self._latest_point_count, self._latest_timestamp

    def get_diagnostics(self) -> dict:
        """Return comprehensive diagnostics dictionary."""
        now = time.time()
        with self._lock:
            age_ms = (now - self._latest_timestamp) * 1000.0 if self._latest_timestamp > 0 else 999999.0
            is_online = (age_ms < 600.0)
            return {
                "online": is_online,
                "sensor_hz": round(self._measured_hz, 1) if is_online else 0.0,
                "point_count": self._latest_point_count,
                "raw_count": self._latest_raw_count,
                "filter_mode": self._filter_mode,
                "decimation_stride": self.decimation_stride,
                "target_points": self.target_points,
                "scan_age_ms": round(age_ms, 1),
                "total_frames": self._total_frames_received,
                "timestamp": self._latest_timestamp,
            }

    @property
    def total_frames(self) -> int:
        with self._lock:
            return self._total_frames_received

