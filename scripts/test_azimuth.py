#!/usr/bin/env python3
import rosbag2_py
from rclpy.serialization import deserialize_message
from sensor_msgs.msg import PointCloud2
import numpy as np

storage_options = rosbag2_py.StorageOptions(uri="/tmp/xt32m2x_golden_packets/xt32m2x_golden_packets_0.mcap", storage_id="mcap")
converter_options = rosbag2_py.ConverterOptions("", "")
reader = rosbag2_py.SequentialReader()
reader.open(storage_options, converter_options)

while reader.has_next():
    topic, data, _ = reader.read_next()
    if topic == "/sensing/lidar/top/pointcloud_raw_ex":
        msg = deserialize_message(data, PointCloud2)
        dt = np.dtype([
            ('x', '<f4'), ('y', '<f4'), ('z', '<f4'),
            ('intensity', 'u1'), ('return_type', 'u1'),
            ('channel', '<u2'), ('azimuth', '<f4'),
            ('elevation', '<f4'), ('distance', '<f4'),
            ('time_stamp', '<u4')
        ])
        arr = np.frombuffer(msg.data[:msg.width * 32], dtype=dt)
        print(f"Total: {len(arr)}")
        print(f"X: [{np.min(arr['x']):.2f}, {np.max(arr['x']):.2f}]")
        print(f"Y: [{np.min(arr['y']):.2f}, {np.max(arr['y']):.2f}]")
        print(f"Z: [{np.min(arr['z']):.2f}, {np.max(arr['z']):.2f}]")
        az_deg = np.degrees(arr['azimuth'])
        print(f"Azimuth deg: [{np.min(az_deg):.1f}, {np.max(az_deg):.1f}]")
        for deg_target in [0, 90, 180, 270]:
            idx = np.argmin(np.abs(az_deg - deg_target))
            p = arr[idx]
            print(f"Azimuth {az_deg[idx]:.1f} deg: x={p['x']:.2f}, y={p['y']:.2f}, z={p['z']:.2f}, dist={p['distance']:.2f}")
        break
