#!/usr/bin/env python3
"""
extract_mcap.py - Extract raw camera images and LiDAR pointclouds from MCAP bags.

Usage:
    python scripts/extract_mcap.py                                  # Extract latest recording
    python scripts/extract_mcap.py --bag path/to/bag.mcap           # Specify MCAP file
    python scripts/extract_mcap.py --max-frames 50                  # Extract first 50 frames
    python scripts/extract_mcap.py --types color,lidar              # Extract specific modalities
"""

import os
import sys
import argparse
import csv
import struct
import numpy as np
import cv2
from pathlib import Path
from mcap.reader import make_reader
from mcap_ros2.decoder import DecoderFactory


def parse_args():
    parser = argparse.ArgumentParser(description="Extract camera frames and LiDAR pointclouds from ROS 2 MCAP bags.")
    parser.add_argument("--bag", type=str, default="", help="Path to .mcap file (default: latest in data/recordings/)")
    parser.add_argument("--out-dir", type=str, default="", help="Output directory (default: <bag_dir>/extracted)")
    parser.add_argument("--max-frames", type=int, default=0, help="Maximum number of frames to extract (0 = all)")
    parser.add_argument("--save-pcd", action="store_true", default=True, help="Save LiDAR scans as ASCII/binary PCD files")
    parser.add_argument("--save-npy", action="store_true", default=False, help="Save LiDAR scans as .npy NumPy arrays")
    return parser.parse_args()


def find_latest_mcap():
    recordings_dir = Path("data/recordings")
    if not recordings_dir.exists():
        recordings_dir = Path("e:/work/av_project/data/recordings")
    
    mcap_files = list(recordings_dir.glob("*/*.mcap"))
    if not mcap_files:
        raise FileNotFoundError(f"No .mcap files found in {recordings_dir}")
    
    # Sort by modification time
    mcap_files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    return str(mcap_files[0])


def write_pcd(filename, points):
    """Write (N, 3 or 4) array to binary PCD format."""
    num_points = points.shape[0]
    has_intensity = points.shape[1] >= 4
    fields = "x y z intensity" if has_intensity else "x y z"
    sizes = "4 4 4 4" if has_intensity else "4 4 4"
    types = "F F F F" if has_intensity else "F F F"
    counts = "1 1 1 1" if has_intensity else "1 1 1"

    header = (
        f"# .PCD v0.7 - Point Cloud Data\n"
        f"VERSION 0.7\n"
        f"FIELDS {fields}\n"
        f"SIZE {sizes}\n"
        f"TYPE {types}\n"
        f"COUNT {counts}\n"
        f"WIDTH {num_points}\n"
        f"HEIGHT 1\n"
        f"VIEWPOINT 0 0 0 1 0 0 0\n"
        f"POINTS {num_points}\n"
        f"DATA binary\n"
    )
    with open(filename, "wb") as f:
        f.write(header.encode("ascii"))
        points[:, :4 if has_intensity else 3].astype(np.float32).tofile(f)


def unpack_pointcloud2(msg):
    """Extract XYZ and intensity from Hesai XT32 PointCloud2."""
    point_step = msg.point_step
    raw_data = np.frombuffer(msg.data, dtype=np.uint8)
    num_points = len(raw_data) // point_step
    if num_points == 0:
        return None

    reshaped = raw_data[:num_points * point_step].reshape((num_points, point_step))
    x = np.frombuffer(reshaped[:, 0:4].copy(), dtype=np.float32)
    y = np.frombuffer(reshaped[:, 4:8].copy(), dtype=np.float32)
    z = np.frombuffer(reshaped[:, 8:12].copy(), dtype=np.float32)
    intensity = reshaped[:, 12].astype(np.float32)

    points = np.stack([x, y, z, intensity], axis=1)
    valid_mask = np.isfinite(points[:, 0]) & np.isfinite(points[:, 1]) & np.isfinite(points[:, 2])
    return points[valid_mask]


def main():
    args = parse_args()
    bag_path = args.bag if args.bag else find_latest_mcap()
    bag_path = Path(bag_path).resolve()

    if not bag_path.exists():
        print(f"[ERROR] MCAP file not found: {bag_path}")
        sys.exit(1)

    out_dir = Path(args.out_dir) if args.out_dir else bag_path.parent / "extracted"
    color_dir = out_dir / "color"
    depth_dir = out_dir / "depth"
    lidar_dir = out_dir / "lidar"

    color_dir.mkdir(parents=True, exist_ok=True)
    depth_dir.mkdir(parents=True, exist_ok=True)
    lidar_dir.mkdir(parents=True, exist_ok=True)

    print("======================================================================")
    print(" MCAP Raw Sensor Stream Extractor")
    print("======================================================================")
    print(f" Source Bag:   {bag_path}")
    print(f" Output Dir:   {out_dir}")
    print(f" Max Frames:   {args.max_frames if args.max_frames > 0 else 'All'}")
    print("======================================================================")

    topics = [
        "/kinect_front/color/image_raw",
        "/kinect_front/depth/image_raw",
        "/sensing/lidar/top/pointcloud_raw_ex"
    ]

    decoder_factory = DecoderFactory()
    color_count = 0
    depth_count = 0
    lidar_count = 0

    manifest = []

    with open(bag_path, "rb") as f:
        reader = make_reader(f, decoder_factories=[decoder_factory])
        for schema, channel, message, ros_msg in reader.iter_decoded_messages(topics=topics):
            topic = channel.topic
            ts_ns = message.log_time
            ts_sec = ts_ns / 1e9

            # 1. Color Image
            if topic == "/kinect_front/color/image_raw":
                if args.max_frames > 0 and color_count >= args.max_frames:
                    continue
                w, h, enc = ros_msg.width, ros_msg.height, ros_msg.encoding
                raw = np.frombuffer(ros_msg.data, dtype=np.uint8)
                
                if enc == "bgra8":
                    img = raw.reshape((h, w, 4))[:, :, :3]  # Drop alpha, keep BGR
                elif enc == "bgr8":
                    img = raw.reshape((h, w, 3))
                elif enc == "rgb8":
                    img = cv2.cvtColor(raw.reshape((h, w, 3)), cv2.COLOR_RGB2BGR)
                else:
                    img = raw.reshape((h, w, -1))

                fname = f"frame_{color_count:05d}_{ts_ns}.jpg"
                cv2.imwrite(str(color_dir / fname), img, [cv2.IMWRITE_JPEG_QUALITY, 95])
                manifest.append({"topic": "color", "index": color_count, "timestamp_ns": ts_ns, "timestamp_sec": ts_sec, "file": fname})
                color_count += 1
                if color_count % 50 == 0:
                    print(f"  • Extracted {color_count} color frames...")

            # 2. Depth Map
            elif topic == "/kinect_front/depth/image_raw":
                if args.max_frames > 0 and depth_count >= args.max_frames:
                    continue
                w, h, enc = ros_msg.width, ros_msg.height, ros_msg.encoding
                if enc == "32FC1":
                    depth = np.frombuffer(ros_msg.data, dtype=np.float32).reshape((h, w))
                    # Convert meters to uint16 millimeters for 16-bit PNG storage (standard OpenCV depth format)
                    depth_mm = np.nan_to_num(depth * 1000.0, nan=0.0, posinf=0.0, neginf=0.0)
                    depth_uint16 = np.clip(depth_mm, 0, 65535).astype(np.uint16)
                    fname = f"depth_{depth_count:05d}_{ts_ns}.png"
                    cv2.imwrite(str(depth_dir / fname), depth_uint16)
                elif enc in ("16UC1", "mono16"):
                    depth_uint16 = np.frombuffer(ros_msg.data, dtype=np.uint16).reshape((h, w))
                    fname = f"depth_{depth_count:05d}_{ts_ns}.png"
                    cv2.imwrite(str(depth_dir / fname), depth_uint16)
                else:
                    fname = f"depth_{depth_count:05d}_{ts_ns}.npy"
                    np.save(str(depth_dir / fname), np.frombuffer(ros_msg.data, dtype=np.uint8))

                manifest.append({"topic": "depth", "index": depth_count, "timestamp_ns": ts_ns, "timestamp_sec": ts_sec, "file": fname})
                depth_count += 1
                if depth_count % 50 == 0:
                    print(f"  • Extracted {depth_count} depth frames...")

            # 3. Hesai LiDAR PointCloud
            elif topic == "/sensing/lidar/top/pointcloud_raw_ex":
                if args.max_frames > 0 and lidar_count >= args.max_frames:
                    continue
                points = unpack_pointcloud2(ros_msg)
                if points is not None:
                    if args.save_pcd:
                        fname = f"lidar_{lidar_count:05d}_{ts_ns}.pcd"
                        write_pcd(str(lidar_dir / fname), points)
                    if args.save_npy:
                        fname_npy = f"lidar_{lidar_count:05d}_{ts_ns}.npy"
                        np.save(str(lidar_dir / fname_npy), points)
                    manifest.append({"topic": "lidar", "index": lidar_count, "timestamp_ns": ts_ns, "timestamp_sec": ts_sec, "file": fname, "points": len(points)})
                    lidar_count += 1
                    if lidar_count % 50 == 0:
                        print(f"  • Extracted {lidar_count} LiDAR scans...")

    # Save manifest CSV
    manifest_csv = out_dir / "manifest.csv"
    if manifest:
        keys = manifest[0].keys()
        with open(manifest_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(manifest)

    print("\n======================================================================")
    print(" Extraction Complete!")
    print("======================================================================")
    print(f"  Color Frames:  {color_count} (saved to {color_dir})")
    print(f"  Depth Frames:  {depth_count} (saved to {depth_dir})")
    print(f"  LiDAR Scans:   {lidar_count} (saved to {lidar_dir})")
    print(f"  Manifest:      {manifest_csv}")
    print("======================================================================")


if __name__ == "__main__":
    main()
