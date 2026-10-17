#!/usr/bin/env python3
"""
Sensor Fusion Experiment (sensor_fusion_experiment.py)
======================================================
Fuses synchronized raw sensor data from the 30-second capture:
  - 1080p Color Camera (Kinect v2 RGB)
  - 32-beam 3D LiDAR (Hesai XT32M2X)
  - 16-bit Depth Maps (Kinect v2 ToF)
  - Extrinsic & Intrinsic Transforms

Performs:
  1. Temporal matching via timestamp alignment.
  2. 3D LiDAR to Camera 2D projection & depth color-mapping.
  3. YOLO 2D object detection (person, car, truck, bicycle, etc.).
  4. Multi-modal 3D spatial fusion: associates 3D LiDAR point clusters to 2D frustums.
  5. Computes ground-truth 3D position (X, Y, Z) in base_link and metric distance.
  6. Renders a unified side-by-side dashboard with Bird's-Eye View (BEV) radar.
  7. Outputs metrics JSON and annotated video.

Usage:
    python experiments/sensor_fusion_experiment.py                      # Run default experiment (50 frames)
    python experiments/sensor_fusion_experiment.py --all-frames        # Process all 382 frames
    python experiments/sensor_fusion_experiment.py --save-video        # Generate MP4 video
"""

import os
import sys
import argparse
import json
import time
import math
from pathlib import Path
import numpy as np
import cv2
from ultralytics import YOLO


def parse_args():
    parser = argparse.ArgumentParser(description="Multi-Modal Camera + LiDAR Sensor Fusion Experiment")
    parser.add_argument("--data-dir", type=str, default="data/recordings/raw_sensors_20261017_125516/extracted",
                        help="Path to extracted dataset folder")
    parser.add_argument("--max-frames", type=int, default=60, help="Maximum number of frames to process (0 = all)")
    parser.add_argument("--all-frames", action="store_true", help="Process all frames in dataset")
    parser.add_argument("--save-video", action="store_true", default=True, help="Generate MP4 video output")
    parser.add_argument("--fps", type=int, default=15, help="Video output FPS")
    parser.add_argument("--conf", type=float, default=0.40, help="YOLO confidence threshold")
    parser.add_argument("--model", type=str, default="yolov8n.pt", help="YOLO model path")
    return parser.parse_args()


def load_pcd(pcd_path):
    """Load binary PCD file into (N, 4) float32 array [x, y, z, intensity]."""
    with open(pcd_path, "rb") as f:
        while True:
            line = f.readline().decode("ascii", errors="ignore")
            if "DATA binary" in line:
                break
        return np.fromfile(f, dtype=np.float32).reshape((-1, 4))


def get_aligned_pairs(data_dir):
    """Align camera frames with their temporally closest LiDAR scan and depth map."""
    color_dir = data_dir / "color"
    lidar_dir = data_dir / "lidar"
    depth_dir = data_dir / "depth"

    color_files = sorted(color_dir.glob("frame_*.jpg"))
    lidar_files = sorted(lidar_dir.glob("lidar_*.pcd"))
    depth_files = sorted(depth_dir.glob("depth_*.png"))

    if not color_files or not lidar_files:
        raise FileNotFoundError(f"Missing color or LiDAR files in {data_dir}")

    # Extract timestamps from filenames: frame_00000_<ts_ns>.jpg
    def extract_ts(path):
        parts = path.stem.split("_")
        return int(parts[-1])

    color_items = [(f, extract_ts(f)) for f in color_files]
    lidar_items = [(f, extract_ts(f)) for f in lidar_files]
    depth_items = [(f, extract_ts(f)) for f in depth_files] if depth_files else []

    lidar_ts = np.array([item[1] for item in lidar_items])
    depth_ts = np.array([item[1] for item in depth_items]) if depth_items else np.array([])

    aligned = []
    for c_file, c_ts in color_items:
        # Find closest LiDAR scan
        l_idx = int(np.argmin(np.abs(lidar_ts - c_ts)))
        l_file, l_match_ts = lidar_items[l_idx]
        delta_lidar_ms = (l_match_ts - c_ts) / 1e6

        # Find closest Depth map if available
        d_file = None
        delta_depth_ms = 0.0
        if len(depth_ts) > 0:
            d_idx = int(np.argmin(np.abs(depth_ts - c_ts)))
            d_file, d_match_ts = depth_items[d_idx]
            delta_depth_ms = (d_match_ts - c_ts) / 1e6

        aligned.append({
            "color": c_file,
            "lidar": l_file,
            "depth": d_file,
            "timestamp_ns": c_ts,
            "delta_lidar_ms": delta_lidar_ms,
            "delta_depth_ms": delta_depth_ms
        })

    return aligned


def project_lidar_to_camera(lidar_pts, img_w=1920, img_h=1080):
    """
    Project LiDAR 3D points into Camera Optical Frame and Image Pixel Coordinates.
    
    Transforms:
      base_link -> lidar_link:        [0.5750, 0.0, 1.7464]
      base_link -> kinect_front_link: [1.2000, 0.0, 1.0000]
      kinect_front_link -> optical:   roll=-90 deg, yaw=-90 deg
    """
    fx, fy = 1081.372, 1081.372
    cx, cy = 959.5, 539.5

    x_l = lidar_pts[:, 0]
    y_l = lidar_pts[:, 1]
    z_l = lidar_pts[:, 2]

    # Optical Frame: X_opt = -Y_kinect, Y_opt = -Z_kinect, Z_opt = X_kinect
    z_opt = x_l - 0.6250
    x_opt = -y_l
    y_opt = -(z_l + 0.7464)

    # Filter points in front of camera
    front_mask = z_opt > 0.4
    pts_valid = lidar_pts[front_mask]
    z_opt = z_opt[front_mask]
    x_opt = x_opt[front_mask]
    y_opt = y_opt[front_mask]

    # Project to pixel coords
    u = fx * (x_opt / z_opt) + cx
    v = fy * (y_opt / z_opt) + cy

    # Bounds filter
    img_mask = (u >= 0) & (u < img_w) & (v >= 0) & (v < img_h)

    u_proj = u[img_mask].astype(int)
    v_proj = v[img_mask].astype(int)
    depth_proj = z_opt[img_mask]
    intensity_proj = pts_valid[img_mask, 3] if pts_valid.shape[1] >= 4 else np.zeros_like(depth_proj)

    # Base link coordinates for metric spatial mapping
    base_x = pts_valid[img_mask, 0] + 0.5750
    base_y = pts_valid[img_mask, 1]
    base_z = pts_valid[img_mask, 2] + 1.7464

    return {
        "u": u_proj,
        "v": v_proj,
        "depth": depth_proj,
        "intensity": intensity_proj,
        "base_x": base_x,
        "base_y": base_y,
        "base_z": base_z,
    }


def draw_bev_radar(lidar_pts, fused_objects, bev_size=640, max_range=15.0):
    """
    Render top-down Bird's-Eye View (BEV) radar map in vehicle base_link coordinates.
    Range: X in [0, max_range] meters (forward), Y in [-max_range/2, +max_range/2] (lateral).
    """
    bev = np.zeros((bev_size, bev_size, 3), dtype=np.uint8)
    bev[:] = (20, 22, 28)  # Dark theme

    # Coordinate mapping: base_link X -> up (-Y_img), base_link Y -> right (-X_img because ROS +Y is left)
    cx = bev_size // 2
    cy = int(bev_size * 0.90)  # Vehicle positioned near bottom
    scale = (bev_size * 0.82) / max_range

    def world_to_bev(x, y):
        px = int(cx - y * scale)  # ROS +Y is Left -> BEV Left
        py = int(cy - x * scale)  # ROS +X is Forward -> BEV Up
        return px, py

    # Draw range rings
    ring_dists = [2.5, 5.0, 7.5, 10.0, 12.5, 15.0]
    for d in ring_dists:
        if d <= max_range:
            r_px = int(d * scale)
            cv2.circle(bev, (cx, cy), r_px, (45, 50, 60), 1, cv2.LINE_AA)
            cv2.putText(bev, f"{d:.1f}m", (cx + 5, cy - r_px + 12),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.35, (90, 100, 120), 1, cv2.LINE_AA)

    # Draw radial guidelines
    for angle_deg in [-45, -30, -15, 0, 15, 30, 45]:
        rad = math.radians(angle_deg)
        rx = int(cx - math.sin(rad) * max_range * scale)
        ry = int(cy - math.cos(rad) * max_range * scale)
        cv2.line(bev, (cx, cy), (rx, ry), (35, 40, 50), 1, cv2.LINE_AA)

    # Draw vehicle footprint (Bajaj RE E-Trike: ~2.6m L x 1.3m W, base_link centered)
    v_len_px = int(2.6 * scale)
    v_wid_px = int(1.3 * scale)
    v_top = cy - int(1.8 * scale)
    v_bot = cy + int(0.8 * scale)
    v_l = cx - v_wid_px // 2
    v_r = cx + v_wid_px // 2
    cv2.rectangle(bev, (v_l, v_top), (v_r, v_bot), (0, 165, 255), 2, cv2.LINE_AA)
    cv2.circle(bev, (cx, cy), 3, (0, 255, 255), -1)  # base_link origin
    cv2.putText(bev, "E-TRIKE", (cx - 20, cy + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 165, 255), 1)

    # Draw background LiDAR points
    x_b = lidar_pts[:, 0] + 0.5750
    y_b = lidar_pts[:, 1]
    in_range = (x_b > 0.1) & (x_b < max_range) & (np.abs(y_b) < max_range * 0.55)
    x_in = x_b[in_range]
    y_in = y_b[in_range]

    px_pts = (cx - y_in * scale).astype(int)
    py_pts = (cy - x_in * scale).astype(int)
    valid_px = (px_pts >= 0) & (px_pts < bev_size) & (py_pts >= 0) & (py_pts < bev_size)
    for p_x, p_y in zip(px_pts[valid_px], py_pts[valid_px]):
        bev[p_y, p_x] = (90, 140, 160)

    # Draw fused 3D objects on BEV
    for obj in fused_objects:
        ox, oy, oz = obj["pos_base"]
        od = obj["lidar_dist"]
        label = obj["name"].upper()
        conf = obj["conf"]

        px, py = world_to_bev(ox, oy)
        if 0 <= px < bev_size and 0 <= py < bev_size:
            # Color coding: Green = far, Yellow = medium, Red = near (< 2.5m)
            if od < 2.5:
                color = (0, 50, 255)  # Red alert
            elif od < 5.0:
                color = (0, 215, 255)  # Yellow
            else:
                color = (0, 255, 120)  # Green

            # Draw obstacle cluster circle & centroid
            cv2.circle(bev, (px, py), 12, color, 2, cv2.LINE_AA)
            cv2.circle(bev, (px, py), 3, color, -1)

            # Draw line to vehicle
            cv2.line(bev, (cx, cy), (px, py), color, 1, cv2.LINE_AA)

            # Text label
            tag = f"{label} {od:.1f}m"
            cv2.putText(bev, tag, (px - 24, py - 16), cv2.FONT_HERSHEY_SIMPLEX, 0.38, color, 1, cv2.LINE_AA)

    # Header title
    cv2.putText(bev, "TOP-DOWN BEV RADAR (15m)", (14, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (220, 220, 220), 1, cv2.LINE_AA)
    cv2.putText(bev, f"Tracked: {len(fused_objects)} objects", (14, 46), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (0, 255, 255), 1, cv2.LINE_AA)

    return bev


def main():
    args = parse_args()
    data_dir = Path(args.data_dir).resolve()
    if not data_dir.exists():
        print(f"[ERROR] Extracted data folder not found: {data_dir}")
        sys.exit(1)

    out_dir = data_dir.parent / "fusion_output"
    out_dir.mkdir(parents=True, exist_ok=True)

    print("======================================================================")
    print(" Multi-Modal Sensor Fusion Experiment")
    print("======================================================================")
    print(f" Dataset:      {data_dir}")
    print(f" YOLO Model:   {args.model} (conf={args.conf})")
    print(f" Output Dir:   {out_dir}")
    print("======================================================================")

    # 1. Align frames
    print("--> Aligning sensor streams by timestamp...")
    pairs = get_aligned_pairs(data_dir)
    total_available = len(pairs)
    print(f"    Found {total_available} synchronized frames.")

    if not args.all_frames and args.max_frames > 0:
        pairs = pairs[:args.max_frames]
    print(f"    Processing {len(pairs)} frames for experiment.")

    # 2. Load YOLO model
    print(f"--> Loading YOLO model: {args.model}...")
    model = YOLO(args.model)

    # 3. Setup Video Writer
    video_writer = None
    output_video_path = out_dir / "sensor_fusion_experiment.mp4"
    frame_width = 1280 + 640  # 1280 Camera View + 640 BEV Radar = 1920
    frame_height = 720

    if args.save_video:
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        video_writer = cv2.VideoWriter(str(output_video_path), fourcc, args.fps, (frame_width, frame_height))
        print(f"--> Video output initialized: {output_video_path} ({frame_width}x{frame_height} @ {args.fps} FPS)")

    metrics_log = []
    start_time = time.time()

    for idx, item in enumerate(pairs):
        t0 = time.time()
        c_path = item["color"]
        l_path = item["lidar"]
        d_path = item["depth"]

        # Load Color Image
        img_raw = cv2.imread(str(c_path))
        h_orig, w_orig = img_raw.shape[:2]

        # Load Depth Map
        depth_img = cv2.imread(str(d_path), cv2.IMREAD_UNCHANGED) if d_path else None

        # Load LiDAR PCD
        lidar_pts = load_pcd(str(l_path))

        # Project LiDAR points
        proj = project_lidar_to_camera(lidar_pts, w_orig, h_orig)

        # Run YOLO Object Detection
        results = model(str(c_path), conf=args.conf, verbose=False)

        # Multi-modal fusion
        fused_objects = []
        u_p = proj["u"]
        v_p = proj["v"]
        d_p = proj["depth"]
        bx_p = proj["base_x"]
        by_p = proj["base_y"]
        bz_p = proj["base_z"]

        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls[0])
                name = model.names[cls_id]
                conf = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                # Filter LiDAR points in 2D bounding box
                bw = x2 - x1
                bh = y2 - y1
                # 8% inner margin to avoid foreground/background boundary leakage
                in_box = (u_p >= x1 + 0.08 * bw) & (u_p <= x2 - 0.08 * bw) & \
                         (v_p >= y1 + 0.08 * bh) & (v_p <= y2 - 0.08 * bh)

                box_d = d_p[in_box]
                box_x = bx_p[in_box]
                box_y = by_p[in_box]
                box_z = bz_p[in_box]

                if len(box_d) >= 3:
                    med_d = float(np.median(box_d))
                    cluster = np.abs(box_d - med_d) < 0.75  # 75cm cluster radius
                    cluster_count = int(np.sum(cluster))
                    if cluster_count >= 2:
                        obj_dist = float(np.median(box_d[cluster]))
                        pos_base = (
                            float(np.median(box_x[cluster])),
                            float(np.median(box_y[cluster])),
                            float(np.median(box_z[cluster]))
                        )

                        # Validate with Kinect Depth map
                        cam_depth = None
                        if depth_img is not None:
                            kx = int((x1 + x2) * 0.5 * (512.0 / w_orig))
                            ky = int((y1 + y2) * 0.5 * (424.0 / h_orig))
                            if 0 <= kx < 512 and 0 <= ky < 424:
                                patch = depth_img[max(0, ky-4):min(424, ky+4), max(0, kx-4):min(512, kx+4)]
                                valids = patch[patch > 0]
                                if len(valids) > 0:
                                    cam_depth = float(np.median(valids)) / 1000.0

                        fused_objects.append({
                            "name": name,
                            "conf": conf,
                            "bbox": (int(x1), int(y1), int(x2), int(y2)),
                            "lidar_dist": obj_dist,
                            "cam_dist": cam_depth,
                            "pts_count": cluster_count,
                            "pos_base": pos_base,
                        })

        # Render Camera View with Overlay
        # 1. Overlay Depth-colored LiDAR points on image
        # Color colormap: Distance 1.0m to 12.0m mapped to HSV colormap
        overlay_img = img_raw.copy()
        norm_depth = np.clip((d_p - 1.0) / 11.0, 0.0, 1.0)
        colors_rgb = (cv2.applyColorMap((norm_depth * 255).astype(np.uint8), cv2.COLORMAP_TURBO)[:, 0, :]).tolist()

        # Draw projected LiDAR points (radius 2)
        for (px, py), c in zip(zip(u_p, v_p), colors_rgb):
            cv2.circle(overlay_img, (px, py), 2, c, -1)

        # Blend LiDAR overlay onto camera
        cam_blend = cv2.addWeighted(overlay_img, 0.55, img_raw, 0.45, 0)

        # 2. Draw 2D + 3D Fused Bounding Boxes
        for obj in fused_objects:
            x1, y1, x2, y2 = obj["bbox"]
            dist_m = obj["lidar_dist"]
            label = obj["name"].upper()
            conf = obj["conf"]
            ox, oy, oz = obj["pos_base"]

            # Color coding: Red = near (< 2.5m), Yellow = medium, Green = safe
            if dist_m < 2.5:
                box_color = (0, 40, 255)
            elif dist_m < 5.0:
                box_color = (0, 215, 255)
            else:
                box_color = (0, 255, 120)

            # Draw bounding box
            cv2.rectangle(cam_blend, (x1, y1), (x2, y2), box_color, 3, cv2.LINE_AA)

            # Header tag: LABEL + 3D DISTANCE
            header_text = f"{label} {dist_m:.2f}m ({obj['pts_count']} pts)"
            (tw, th), _ = cv2.getTextSize(header_text, cv2.FONT_HERSHEY_SIMPLEX, 0.60, 2)
            cv2.rectangle(cam_blend, (x1, y1 - th - 12), (x1 + tw + 12, y1), box_color, -1)
            cv2.putText(cam_blend, header_text, (x1 + 6, y1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.60, (0, 0, 0), 2, cv2.LINE_AA)

            # Sub-badge: Real-world base_link coordinates
            coord_text = f"base_link: [{ox:.2f}, {oy:.2f}, {oz:.2f}]m"
            cv2.rectangle(cam_blend, (x1, y2), (x1 + 270, y2 + 22), (20, 20, 20), -1)
            cv2.putText(cam_blend, coord_text, (x1 + 5, y2 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1, cv2.LINE_AA)

        # Resize Camera View to 1280x720
        cam_view_resized = cv2.resize(cam_blend, (1280, 720), interpolation=cv2.INTER_AREA)

        # Overlay HUD on Camera View
        cv2.rectangle(cam_view_resized, (15, 15), (460, 105), (15, 18, 25), -1)
        cv2.rectangle(cam_view_resized, (15, 15), (460, 105), (60, 70, 85), 1)
        cv2.putText(cam_view_resized, "MULTI-MODAL CAMERA + LIDAR FUSION", (25, 42),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 2, cv2.LINE_AA)
        nearest = f"{min([o['lidar_dist'] for o in fused_objects]):.2f}m" if fused_objects else "Clear"
        cv2.putText(cam_view_resized, f"Frame: {idx+1}/{len(pairs)} | Sync Delta: {item['delta_lidar_ms']:.1f}ms", (25, 68),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 200, 200), 1, cv2.LINE_AA)
        cv2.putText(cam_view_resized, f"Fused 3D Objects: {len(fused_objects)} | Nearest: {nearest}", (25, 92),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 120), 1, cv2.LINE_AA)

        # 3. Render BEV Radar View (640x720)
        bev_radar = draw_bev_radar(lidar_pts, fused_objects, bev_size=640, max_range=15.0)
        # Pad BEV from 640x640 to 640x720 with telemetry info
        bev_panel = np.zeros((720, 640, 3), dtype=np.uint8)
        bev_panel[:640, :] = bev_radar

        # BEV Bottom Telemetry HUD
        cv2.rectangle(bev_panel, (0, 640), (640, 720), (12, 14, 18), -1)
        cv2.line(bev_panel, (0, 640), (640, 640), (45, 50, 60), 1)
        fps_curr = 1.0 / max(1e-4, time.time() - t0)
        cv2.putText(bev_panel, f"Processing: {fps_curr:.1f} FPS | Hesai XT32 (32-ch) + Kinect v2", (16, 672),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.42, (180, 180, 180), 1, cv2.LINE_AA)
        cv2.putText(bev_panel, f"Color: 1080p | LiDAR points projected: {len(u_p):,}", (16, 698),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 200, 255), 1, cv2.LINE_AA)

        # 4. Combine into Split-Screen Canvas (1920x720)
        dashboard = np.hstack([cam_view_resized, bev_panel])

        # Write to video
        if video_writer is not None:
            video_writer.write(dashboard)

        # Save snapshot samples (first frame, middle frame, end frame)
        if idx in (0, len(pairs) // 2, len(pairs) - 1):
            snap_path = out_dir / f"fusion_snapshot_{idx:03d}.jpg"
            cv2.imwrite(str(snap_path), dashboard, [cv2.IMWRITE_JPEG_QUALITY, 95])
            print(f"  • Saved snapshot: {snap_path}")

        # Metrics entry
        metrics_log.append({
            "frame_idx": idx,
            "timestamp_ns": item["timestamp_ns"],
            "sync_delta_ms": item["delta_lidar_ms"],
            "projected_lidar_pts": len(u_p),
            "detected_objects_count": len(fused_objects),
            "objects": [
                {
                    "class": o["name"],
                    "confidence": round(o["conf"], 3),
                    "distance_m": round(o["lidar_dist"], 3),
                    "cam_depth_m": round(o["cam_dist"], 3) if o["cam_dist"] else None,
                    "pts_in_cluster": o["pts_count"],
                    "pos_base_link": [round(v, 3) for v in o["pos_base"]]
                }
                for o in fused_objects
            ]
        })

        if (idx + 1) % 15 == 0 or idx == len(pairs) - 1:
            print(f"  --> Processed {idx + 1}/{len(pairs)} frames (Current FPS: {fps_curr:.1f})")

    if video_writer is not None:
        video_writer.release()

    # Save metrics JSON
    metrics_path = out_dir / "fusion_metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump({
            "total_frames_processed": len(pairs),
            "average_fps": round(len(pairs) / max(1e-4, time.time() - start_time), 2),
            "frames": metrics_log
        }, f, indent=2)

    total_time = time.time() - start_time
    print("\n======================================================================")
    print(" SENSOR FUSION EXPERIMENT COMPLETE!")
    print("======================================================================")
    print(f"  Processed Frames: {len(pairs)} in {total_time:.1f}s ({len(pairs)/total_time:.1f} FPS)")
    if args.save_video:
        print(f"  Output Video:     {output_video_path}")
    print(f"  Metrics Report:   {metrics_path}")
    print(f"  Snapshots Folder: {out_dir}")
    print("======================================================================")


if __name__ == "__main__":
    main()
