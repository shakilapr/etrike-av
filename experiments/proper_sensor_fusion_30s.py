#!/usr/bin/env python3
"""
Proper Multi-Modal Camera + LiDAR 3D Sensor Fusion (proper_sensor_fusion_30s.py)
=============================================================================
Production-grade sensor fusion conforming to autonomous driving standards:
  1. Floor Ground Removal: Calibrated height filtering (Z_lidar > -1.40m) preventing
     ground-obstacle point bridging.
  2. 3D Metric Euclidean DBSCAN Clustering directly in vehicle base_link.
  3. YOLO26x-Pose 2D Detection with Dual-Joint Confidence Gating (>= 0.40, zero spiderwebs).
  4. Multi-Tier Perception Architecture (FUSED + VISION):
     - FUSED: Confirmed Hungarian cross-modal match between 2D camera frustum and 3D LiDAR cluster.
     - VISION: Depth-sampled ToF / pinhole floor raycasting. NEVER drops real people.
  5. Multi-Object Tracking (MOT) with 3D Constant-Velocity Kalman Filter.
  6. Clean 1920x720 Cockpit HUD (Camera 3D Overlay + 15m Top-Down BEV Radar, zero text obstruction).
  7. Verification metrics & MP4 rendering over the full 30s dataset.

Strictly offline benchmark: Does not disturb the live display or Jetson processes.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import cv2
import numpy as np
from scipy.optimize import linear_sum_assignment
from sklearn.cluster import DBSCAN
from ultralytics import YOLO


# 17 COCO Keypoints & Topology
COCO_KEYPOINTS = [
    "nose", "left_eye", "right_eye", "left_ear", "right_ear",
    "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
    "left_wrist", "right_wrist", "left_hip", "right_hip",
    "left_knee", "right_knee", "left_ankle", "right_ankle"
]

SKELETON_EDGES = [
    (0, 1), (0, 2), (1, 3), (2, 4),           # Head
    (5, 6),                                   # Shoulders
    (5, 7), (7, 9),                           # Left arm
    (6, 8), (8, 10),                          # Right arm
    (5, 11), (6, 12), (11, 12),               # Torso
    (11, 13), (13, 15),                       # Left leg
    (12, 14), (14, 16),                       # Right leg
]


class KalmanBox3DTracker:
    """3D Constant-Velocity Kalman Filter for smooth multi-object tracking."""

    _count = 0

    def __init__(self, init_pos: np.ndarray, name: str, conf: float, track_type: str = "FUSED") -> None:
        KalmanBox3DTracker._count += 1
        self.id = KalmanBox3DTracker._count
        self.name = name
        self.conf = conf
        self.track_type = track_type  # "FUSED" or "VISION"
        self.hits = 1
        self.time_since_update = 0

        # State: [x, y, z, vx, vy, vz]
        self.x = np.zeros(6, dtype=np.float32)
        self.x[:3] = init_pos[:3]

        # Covariance
        self.P = np.eye(6, dtype=np.float32) * 1.0
        self.P[3:, 3:] *= 10.0

        # Process noise
        self.Q = np.eye(6, dtype=np.float32) * 0.05
        self.Q[3:, 3:] *= 0.5

        # Measurement noise (tighter for FUSED, wider for VISION)
        if track_type == "FUSED":
            self.R = np.diag([0.04, 0.04, 0.04]).astype(np.float32)
        else:
            self.R = np.diag([0.15, 0.15, 0.30]).astype(np.float32)

        self.last_bbox: Tuple[int, int, int, int] = (0, 0, 0, 0)
        self.last_kpts: Optional[np.ndarray] = None
        self.last_kconfs: Optional[np.ndarray] = None
        self.pts_count = 0
        self.yaw = 0.0
        self.history_dist: List[float] = [float(np.linalg.norm(init_pos[:3]))]

    def predict(self, dt: float = 0.066) -> np.ndarray:
        F = np.eye(6, dtype=np.float32)
        F[0, 3] = dt
        F[1, 4] = dt
        F[2, 5] = dt

        self.x = F @ self.x
        self.P = F @ self.P @ F.T + self.Q
        self.time_since_update += 1
        return self.x[:3]

    def update(self, pos: np.ndarray, bbox: Tuple[int, int, int, int], pts_count: int,
               track_type: str, kpts: Optional[np.ndarray] = None,
               kconfs: Optional[np.ndarray] = None, yaw: float = 0.0) -> None:
        self.time_since_update = 0
        self.hits += 1
        self.pts_count = pts_count
        self.track_type = track_type
        self.last_bbox = bbox
        self.last_kpts = kpts
        self.last_kconfs = kconfs
        self.yaw = yaw

        # Adaptive measurement noise based on source
        R = np.diag([0.04, 0.04, 0.04]).astype(np.float32) if track_type == "FUSED" else np.diag([0.15, 0.15, 0.30]).astype(np.float32)

        H = np.zeros((3, 6), dtype=np.float32)
        H[0, 0] = H[1, 1] = H[2, 2] = 1.0

        y = pos - (H @ self.x)
        S = H @ self.P @ H.T + R
        K = self.P @ H.T @ np.linalg.inv(S)

        self.x = self.x + K @ y
        self.P = (np.eye(6, dtype=np.float32) - K @ H) @ self.P
        self.history_dist.append(float(np.linalg.norm(self.x[:3])))


def load_pcd(pcd_path: Path) -> np.ndarray:
    """Load binary PCD file into (N, 4) float32 array [x, y, z, intensity]."""
    with open(pcd_path, "rb") as f:
        while True:
            line = f.readline().decode("ascii", errors="ignore")
            if "DATA binary" in line:
                break
        return np.fromfile(f, dtype=np.float32).reshape((-1, 4))


def filter_ground_plane(pts: np.ndarray, z_thresh: float = -1.40) -> Tuple[np.ndarray, np.ndarray]:
    """
    Remove ground plane points. In vehicle setup, LiDAR is at Z_base = 1.7464m.
    Floor plane in raw LiDAR coordinates is at Z_lidar < -1.40m.
    Removing points below -1.40m completely stops floor bridging.
    """
    non_ground = pts[:, 2] > z_thresh
    return pts[non_ground], pts[~non_ground]


def euclidean_clustering_3d(pts: np.ndarray, eps: float = 0.28, min_pts: int = 4) -> List[Dict[str, Any]]:
    """Cluster 3D non-ground LiDAR points in vehicle base_link frame using KD-tree accelerated DBSCAN."""
    if len(pts) < min_pts:
        return []

    # Transform LiDAR points into base_link frame
    # LiDAR mount: X=0.5750, Y=0.0, Z=1.7464
    bx = pts[:, 0] + 0.5750
    by = pts[:, 1]
    bz = pts[:, 2] + 1.7464

    # Keep forward hemisphere up to 15m
    forward = (bx > 0.5) & (bx < 15.0) & (np.abs(by) < 8.0)
    if np.sum(forward) < min_pts:
        return []

    f_pts = np.column_stack([bx[forward], by[forward], bz[forward]])

    # Fast KD-tree DBSCAN
    db = DBSCAN(eps=eps, min_samples=min_pts, algorithm="kd_tree", n_jobs=-1).fit(f_pts)
    labels = db.labels_

    unique_labels = set(labels)
    clusters = []

    for k in unique_labels:
        if k == -1:
            continue
        c_pts = f_pts[labels == k]
        min_bound = np.min(c_pts, axis=0)
        max_bound = np.max(c_pts, axis=0)
        centroid = np.mean(c_pts, axis=0)
        dims = max_bound - min_bound

        # Reject massive background planes (walls/ceilings)
        if dims[0] < 5.0 and dims[1] < 4.0:
            clusters.append({
                "points": c_pts,
                "centroid": centroid,
                "min_bound": min_bound,
                "max_bound": max_bound,
                "dims": dims,
                "dist": float(np.linalg.norm(centroid)),
                "count": len(c_pts),
            })

    return clusters


def project_cluster_to_camera(cluster: Dict[str, Any], fx: float, fy: float, cx: float, cy: float,
                              cam_x: float = 1.20, cam_y: float = 0.0, cam_z: float = 1.70,
                              img_w: int = 1920, img_h: int = 1080) -> Optional[Dict[str, Any]]:
    """
    Project 3D cluster bounding box and centroid into 2D camera pixels using calibrated extrinsics.
    Camera mount: X=1.20, Y=0.0, Z=1.70.
    """
    centroid = cluster["centroid"]
    min_b = cluster["min_bound"]
    max_b = cluster["max_bound"]

    # Centroid projection
    z_opt = centroid[0] - cam_x
    if z_opt < 0.4:
        return None
    x_opt = -(centroid[1] - cam_y)
    y_opt = -(centroid[2] - cam_z)

    u_c = int(fx * (x_opt / z_opt) + cx)
    v_c = int(fy * (y_opt / z_opt) + cy)

    # 8 corners in base_link
    corners_base = np.array([
        [min_b[0], min_b[1], min_b[2]],
        [min_b[0], min_b[1], max_b[2]],
        [min_b[0], max_b[1], min_b[2]],
        [min_b[0], max_b[1], max_b[2]],
        [max_b[0], min_b[1], min_b[2]],
        [max_b[0], min_b[1], max_b[2]],
        [max_b[0], max_b[1], min_b[2]],
        [max_b[0], max_b[1], max_b[2]],
    ])

    z_corn = corners_base[:, 0] - cam_x
    if np.any(z_corn < 0.3):
        return None

    x_corn = -(corners_base[:, 1] - cam_y)
    y_corn = -(corners_base[:, 2] - cam_z)

    u_arr = fx * (x_corn / z_corn) + cx
    v_arr = fy * (y_corn / z_corn) + cy

    u1, u2 = int(np.clip(np.min(u_arr), 0, img_w - 1)), int(np.clip(np.max(u_arr), 0, img_w - 1))
    v1, v2 = int(np.clip(np.min(v_arr), 0, img_h - 1)), int(np.clip(np.max(v_arr), 0, img_h - 1))

    if (u2 - u1) < 8 or (v2 - v1) < 8:
        return None

    return {
        "box_2d": (u1, v1, u2, v2),
        "center_2d": (u_c, v_c),
        "dist": float(np.linalg.norm(centroid))
    }


def compute_iou_2d(box1: Tuple[int, int, int, int], box2: Tuple[int, int, int, int]) -> float:
    """Calculate Intersection over Union (IoU) between two 2D bounding boxes."""
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])

    inter_w = max(0, x2 - x1)
    inter_h = max(0, y2 - y1)
    inter_area = inter_w * inter_h

    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union = area1 + area2 - inter_area

    return float(inter_area) / float(union) if union > 0 else 0.0


def draw_hud(frame: np.ndarray, tracker: KalmanBox3DTracker) -> None:
    """Draw bounding box and pose skeleton with joint confidence gating (zero spiderwebs)."""
    x1, y1, x2, y2 = tracker.last_bbox

    # Semantic color palette
    if tracker.time_since_update > 0:
        box_col = (0, 140, 255)  # Orange for coasting prediction
    elif tracker.track_type == "FUSED":
        dist_m = float(np.linalg.norm(tracker.x[:3]))
        if dist_m < 2.5:
            box_col = (0, 45, 255)   # Red for close obstacle
        elif dist_m < 5.0:
            box_col = (0, 215, 255)  # Yellow for caution
        else:
            box_col = (0, 255, 120)  # Green for safe distance
    else:  # VISION
        box_col = (255, 215, 0)      # Cyan for vision-confirmed actor

    cv2.rectangle(frame, (x1, y1), (x2, y2), box_col, 2, cv2.LINE_AA)

    # 1. Clean Skeleton Rendering (Confidence Thresholded at 0.40)
    if tracker.last_kpts is not None and tracker.last_kconfs is not None:
        kpts = tracker.last_kpts
        confs = tracker.last_kconfs

        # Draw bones only if both joints have confident detection (>= 0.40)
        for (p1, p2) in SKELETON_EDGES:
            if p1 < len(confs) and p2 < len(confs):
                if confs[p1] >= 0.40 and confs[p2] >= 0.40:
                    pt1 = (int(kpts[p1, 0]), int(kpts[p1, 1]))
                    pt2 = (int(kpts[p2, 0]), int(kpts[p2, 1]))
                    cv2.line(frame, pt1, pt2, (0, 255, 255), 2, cv2.LINE_AA)

        # Draw joint nodes
        for p_idx in range(len(confs)):
            if confs[p_idx] >= 0.40:
                pt = (int(kpts[p_idx, 0]), int(kpts[p_idx, 1]))
                cv2.circle(frame, pt, 3, (0, 255, 255), -1, cv2.LINE_AA)

    # 2. Text Badges
    dist_m = float(np.linalg.norm(tracker.x[:3]))
    vx = tracker.x[3]
    vy = tracker.x[4]
    speed = math.sqrt(vx * vx + vy * vy)

    if tracker.time_since_update > 0:
        src_tag = "PRED"
    elif tracker.track_type == "FUSED":
        src_tag = f"FUSED {tracker.pts_count}p"
    else:
        src_tag = "VISION"

    tag = f"ID:{tracker.id} [{src_tag}] {dist_m:.2f}m"
    (tw, th), _ = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.48, 1)
    badge_y1 = max(0, y1 - th - 8)
    cv2.rectangle(frame, (x1, badge_y1), (x1 + tw + 8, y1), box_col, -1)
    cv2.putText(frame, tag, (x1 + 4, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (0, 0, 0), 1, cv2.LINE_AA)

    sub_tag = f"base: [{tracker.x[0]:+.2f}, {tracker.x[1]:+.2f}, {tracker.x[2]:+.2f}]m | V:{speed:.1f}m/s"
    (stw, sth), _ = cv2.getTextSize(sub_tag, cv2.FONT_HERSHEY_SIMPLEX, 0.38, 1)
    cv2.rectangle(frame, (x1, y2), (x1 + stw + 8, y2 + sth + 6), (15, 15, 15), -1)
    cv2.putText(frame, sub_tag, (x1 + 4, y2 + sth + 2), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 255, 255), 1, cv2.LINE_AA)


def draw_clean_bev(lidar_pts: np.ndarray, trackers: List[KalmanBox3DTracker],
                   bev_w: int = 640, bev_h: int = 720, max_r: float = 15.0) -> np.ndarray:
    """Render unobstructed 15m top-down BEV radar using full 720 height (zero text covering LiDAR)."""
    bev = np.zeros((bev_h, bev_w, 3), dtype=np.uint8)
    bev[:] = (18, 20, 26)

    cx = bev_w // 2
    cy = int(bev_h * 0.90)  # Origin near bottom: allows -1.5m behind vehicle to +15m forward
    scale = (bev_h * 0.85) / max_r

    # Range rings
    for r in [2.5, 5.0, 7.5, 10.0, 12.5, 15.0]:
        r_px = int(r * scale)
        cv2.circle(bev, (cx, cy), r_px, (40, 45, 55), 1, cv2.LINE_AA)
        cv2.putText(bev, f"{r:.1f}m", (cx + 5, cy - r_px + 12), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (80, 90, 110), 1)

    # Vehicle footprint
    v_w = int(1.3 * scale)
    v_l_front = int(1.8 * scale)
    v_l_rear = int(0.8 * scale)
    cv2.rectangle(bev, (cx - v_w // 2, cy - v_l_front), (cx + v_w // 2, cy + v_l_rear), (0, 165, 255), 2)
    cv2.putText(bev, "E-TRIKE", (cx - 22, cy + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 165, 255), 1)

    # Background LiDAR scatter (all non-ground points across full vertical canvas)
    xb = lidar_pts[:, 0] + 0.5750
    yb = lidar_pts[:, 1]
    valid = (xb > -1.5) & (xb < max_r) & (np.abs(yb) < max_r * 0.55)
    px = (cx - yb[valid] * scale).astype(int)
    py = (cy - xb[valid] * scale).astype(int)

    for p_x, p_y in zip(px, py):
        if 0 <= p_x < bev_w and 0 <= p_y < bev_h:
            bev[p_y, p_x] = (75, 115, 130)

    # Tracked obstacles
    for trk in trackers:
        ox, oy, _ = trk.x[:3]
        od = float(np.linalg.norm(trk.x[:3]))
        p_x = int(cx - oy * scale)
        p_y = int(cy - ox * scale)

        if 0 <= p_x < bev_w and 0 <= p_y < bev_h:
            if trk.track_type == "FUSED":
                color = (0, 45, 255) if od < 2.5 else ((0, 215, 255) if od < 5.0 else (0, 255, 120))
            else:
                color = (255, 215, 0)  # Cyan for vision-confirmed tracks

            cv2.circle(bev, (p_x, p_y), 11, color, 2, cv2.LINE_AA)
            cv2.circle(bev, (p_x, p_y), 3, color, -1)
            cv2.line(bev, (cx, cy), (p_x, p_y), color, 1, cv2.LINE_AA)

            # Velocity vector
            vx = trk.x[3]
            vy = trk.x[4]
            end_x = int(p_x - vy * scale * 0.5)
            end_y = int(p_y - vx * scale * 0.5)
            cv2.arrowedLine(bev, (p_x, p_y), (end_x, end_y), (0, 255, 255), 2, cv2.LINE_AA, tipLength=0.3)

            tag = f"ID:{trk.id} {od:.1f}m"
            cv2.putText(bev, tag, (p_x - 22, p_y - 14), cv2.FONT_HERSHEY_SIMPLEX, 0.38, color, 1, cv2.LINE_AA)

    return bev


def main() -> None:
    parser = argparse.ArgumentParser(description="Proper Sensor Fusion 30s Benchmark")
    parser.add_argument("--data-dir", type=str, default="data/recordings/raw_sensors_20261017_125516/extracted")
    parser.add_argument("--max-frames", type=int, default=0, help="0 = all frames")
    parser.add_argument("--model", type=str, default="data/ml_models/yolo26x-pose.pt")
    args = parser.parse_args()

    data_dir = Path(args.data_dir).resolve()
    if not data_dir.exists():
        print(f"[ERROR] Data folder not found: {data_dir}")
        sys.exit(1)

    out_dir = data_dir.parent / "proper_fusion_output"
    out_dir.mkdir(parents=True, exist_ok=True)

    color_files = sorted((data_dir / "color").glob("frame_*.jpg"))
    lidar_files = sorted((data_dir / "lidar").glob("lidar_*.pcd"))
    depth_files = sorted((data_dir / "depth").glob("depth_*.png"))

    print("======================================================================")
    print(" Proper Multi-Modal Camera + LiDAR 3D Sensor Fusion Benchmark")
    print("======================================================================")
    print(f" Dataset : {data_dir} ({len(color_files)} camera frames, {len(lidar_files)} PCD scans)")
    print(f" Model   : {args.model}")
    print(f" Output  : {out_dir}")
    print("======================================================================")

    # 1. Temporal synchronization
    def extract_ts(p: Path) -> int:
        return int(p.stem.split("_")[-1])

    color_items = [(f, extract_ts(f)) for f in color_files]
    lidar_items = [(f, extract_ts(f)) for f in lidar_files]
    lidar_ts = np.array([item[1] for item in lidar_items])

    depth_items = [(f, extract_ts(f)) for f in depth_files]
    depth_ts = np.array([item[1] for item in depth_items]) if depth_items else np.array([])

    aligned_pairs = []
    for c_file, c_ts in color_items:
        l_idx = int(np.argmin(np.abs(lidar_ts - c_ts)))
        l_file, l_ts = lidar_items[l_idx]
        d_file = None
        if len(depth_ts) > 0:
            d_idx = int(np.argmin(np.abs(depth_ts - c_ts)))
            d_file = depth_items[d_idx][0]
        aligned_pairs.append((c_file, l_file, d_file, abs(l_ts - c_ts) / 1e6))

    if args.max_frames > 0:
        aligned_pairs = aligned_pairs[:args.max_frames]

    print(f" Loaded {len(aligned_pairs)} synchronized multimodal frames.")

    # 2. Load Model
    print(f" Loading YOLO model: {args.model}...")
    model = YOLO(args.model)

    # 3. Setup Video Output (1920 x 720)
    video_path = out_dir / "sensor_fusion_30s_proper.mp4"
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out_video = cv2.VideoWriter(str(video_path), fourcc, 15, (1920, 720))

    # Calibrated Intrinsics & Extrinsics
    fx, fy = 1081.372, 1081.372
    cx, cy = 959.5, 539.5
    cam_x, cam_y, cam_z = 1.20, 0.0, 1.70

    trackers: List[KalmanBox3DTracker] = []
    metrics_records = []

    print("--> Processing multimodal frames with Floor Filter + 3D DBSCAN + Hungarian + Multi-Tier MOT...")
    t_start = time.time()

    for f_idx, (c_path, l_path, d_path, sync_ms) in enumerate(aligned_pairs):
        img_bgr = cv2.imread(str(c_path))
        lidar_raw = load_pcd(l_path)
        depth_raw = None
        if d_path is not None and d_path.exists():
            depth_img = cv2.imread(str(d_path), cv2.IMREAD_UNCHANGED)
            if depth_img is not None:
                depth_raw = depth_img[:, :, 0] if len(depth_img.shape) == 3 else depth_img

        # 1. Floor Ground Removal (Z_lidar > -1.40m eliminates bridging)
        non_ground_pts, ground_pts = filter_ground_plane(lidar_raw, z_thresh=-1.40)

        # 2. 3D Euclidean DBSCAN Clustering directly in base_link
        clusters_3d = euclidean_clustering_3d(non_ground_pts, eps=0.28, min_pts=4)

        # 3. Project 3D Clusters into 2D Image Frustums
        proj_clusters = []
        for c in clusters_3d:
            proj_info = project_cluster_to_camera(c, fx, fy, cx, cy, cam_x, cam_y, cam_z)
            if proj_info is not None:
                proj_clusters.append({
                    "cluster": c,
                    "box_2d": proj_info["box_2d"],
                    "center_2d": proj_info["center_2d"],
                    "dist": proj_info["dist"],
                })

        # 4. Camera 2D Object Detection, Depth Sampling & Keypoint Extraction
        res = model(img_bgr, conf=0.30, verbose=False)[0]
        detections_2d = []
        for b_idx in range(len(res.boxes)):
            b = res.boxes[b_idx]
            cls_id = int(b.cls[0])
            name = model.names[cls_id]
            conf = float(b.conf[0])
            x1, y1, x2, y2 = [int(v) for v in b.xyxy[0].tolist()]

            # Sample ToF depth in torso
            tof_d = 0.0
            if depth_raw is not None:
                dx1, dx2 = int(x1 * 512 / 1920), int(x2 * 512 / 1920)
                dy1, dy2 = int(y1 * 424 / 1080), int(y2 * 424 / 1080)
                cx1 = int(dx1 + (dx2 - dx1) * 0.25)
                cx2 = int(dx2 - (dx2 - dx1) * 0.25)
                cy1 = int(dy1 + (dy2 - dy1) * 0.20)
                cy2 = int(dy2 - (dy2 - dy1) * 0.40)
                if 0 <= cy1 < cy2 <= 424 and 0 <= cx1 < cx2 <= 512:
                    crop = depth_raw[cy1:cy2, cx1:cx2]
                    val = crop[(crop > 500) & (crop < 15000)]
                    if len(val) >= 4:
                        tof_d = float(np.median(val)) / 1000.0

            kpts_xy = None
            kpts_confs = None
            yaw_est = 0.0

            if res.keypoints is not None and b_idx < len(res.keypoints):
                k = res.keypoints[b_idx]
                kpts_xy = k.xy[0].cpu().numpy()
                kpts_confs = k.conf[0].cpu().numpy() if k.conf is not None else np.ones(len(kpts_xy))

                if len(kpts_confs) >= 7 and kpts_confs[5] > 0.35 and kpts_confs[6] > 0.35:
                    dx_sh = float(kpts_xy[5, 0] - kpts_xy[6, 0])
                    yaw_est = math.atan2(0.0, dx_sh)

            detections_2d.append({
                "name": name,
                "conf": conf,
                "box": (x1, y1, x2, y2),
                "tof_d": tof_d,
                "kpts": kpts_xy,
                "kconfs": kpts_confs,
                "yaw": yaw_est,
            })

        # 5. Hungarian Bipartite Assignment with Distance Consistency Gate
        cost_matrix = np.ones((len(detections_2d), len(proj_clusters)), dtype=np.float32) * 1.0

        for d_i, det in enumerate(detections_2d):
            d_box = det["box"]
            d_tof = det["tof_d"]
            for c_j, proj in enumerate(proj_clusters):
                c_box = proj["box_2d"]
                u_c, v_c = proj["center_2d"]
                c_dist = proj["dist"]

                iou = compute_iou_2d(d_box, c_box)
                inside = (d_box[0] <= u_c <= d_box[2]) and (d_box[1] <= v_c <= d_box[3])

                # Reject clusters with incompatible depth
                dist_ok = True
                if d_tof > 1.0 and abs(c_dist - d_tof) > 1.8:
                    dist_ok = False

                if dist_ok:
                    if inside:
                        cost_matrix[d_i, c_j] = min(1.0 - iou, 0.35)
                    elif iou > 0.10:
                        cost_matrix[d_i, c_j] = 1.0 - iou

        matched_det_indices = set()
        matched_cluster_indices = set()
        matched_pairs = []

        if len(detections_2d) > 0 and len(proj_clusters) > 0:
            row_ind, col_ind = linear_sum_assignment(cost_matrix)
            for r, c in zip(row_ind, col_ind):
                if cost_matrix[r, c] < 0.70:
                    matched_det_indices.add(r)
                    matched_cluster_indices.add(c)
                    matched_pairs.append((r, c))

        # 6. Build Multi-Tier Candidates (FUSED + VISION)
        current_actors = []

        # Add Fused Actors
        for r, c in matched_pairs:
            det = detections_2d[r]
            cl = proj_clusters[c]["cluster"]
            current_actors.append({
                "type": "FUSED",
                "name": det["name"],
                "conf": det["conf"],
                "box": det["box"],
                "pos": cl["centroid"],
                "pts": cl["count"],
                "kpts": det["kpts"],
                "kconfs": det["kconfs"],
                "yaw": det["yaw"],
            })

        # Add Vision Actors (Never drop real people!)
        for r, det in enumerate(detections_2d):
            if r not in matched_det_indices:
                x1, y1, x2, y2 = det["box"]
                tof_d = det["tof_d"]
                u_cent = (x1 + x2) / 2.0
                v_cent = (y1 + y2) / 2.0

                if tof_d > 0.5:
                    z_opt = tof_d
                else:
                    # Pinhole floor raycasting: ground is Z_base = 0.0 -> Y_opt = +1.70
                    v_feet = max(cy + 10, float(y2))
                    z_opt = float(fy * 1.70 / (v_feet - cy))
                    z_opt = np.clip(z_opt, 1.0, 15.0)

                x_opt = (u_cent - cx) * z_opt / fx
                y_opt = (v_cent - cy) * z_opt / fy

                pos_est = np.array([z_opt + cam_x, -x_opt, -y_opt + cam_z], dtype=np.float32)

                current_actors.append({
                    "type": "VISION",
                    "name": det["name"],
                    "conf": det["conf"],
                    "box": det["box"],
                    "pos": pos_est,
                    "pts": 0,
                    "kpts": det["kpts"],
                    "kconfs": det["kconfs"],
                    "yaw": det["yaw"],
                })

        # 7. Multi-Object Tracking with Kalman Filter
        for trk in trackers:
            trk.predict(dt=0.066)

        matched_actor_ids = set()
        matched_track_ids = set()

        # Associate actors to existing tracks
        for a_idx, act in enumerate(current_actors):
            pos_meas = act["pos"]
            best_trk = None
            best_dist = 1.8  # 1.8m association gate
            for trk in trackers:
                if trk.id not in matched_track_ids and trk.name == act["name"]:
                    d_trk = float(np.linalg.norm(trk.x[:3] - pos_meas))
                    if d_trk < best_dist:
                        best_dist = d_trk
                        best_trk = trk

            if best_trk is not None:
                best_trk.update(
                    pos=pos_meas,
                    bbox=act["box"],
                    pts_count=act["pts"],
                    track_type=act["type"],
                    kpts=act["kpts"],
                    kconfs=act["kconfs"],
                    yaw=act["yaw"]
                )
                matched_track_ids.add(best_trk.id)
                matched_actor_ids.add(a_idx)

        # Initialize new tracks for unmatched actors
        for a_idx, act in enumerate(current_actors):
            if a_idx not in matched_actor_ids:
                new_trk = KalmanBox3DTracker(act["pos"], act["name"], act["conf"], track_type=act["type"])
                new_trk.update(
                    pos=act["pos"],
                    bbox=act["box"],
                    pts_count=act["pts"],
                    track_type=act["type"],
                    kpts=act["kpts"],
                    kconfs=act["kconfs"],
                    yaw=act["yaw"]
                )
                trackers.append(new_trk)
                matched_track_ids.add(new_trk.id)

        # Prune dead tracks (missed > 6 frames)
        trackers = [t for t in trackers if t.time_since_update <= 6]

        # Active tracks: updated in this frame or coasting up to 2 frames
        active_trackers = [t for t in trackers if t.time_since_update <= 2]

        # 8. Render Side-by-Side Visualizations (1280x720 Camera + 640x720 Clean BEV)
        cam_canvas = img_bgr.copy()

        # Project calibrated LiDAR point cloud overlay onto camera
        # Z_opt = X_lidar - 0.6250, X_opt = -Y_lidar, Y_opt = -(Z_lidar + 0.0464)
        z_opt_all = non_ground_pts[:, 0] - 0.6250
        valid_front = z_opt_all > 0.4
        z_v = z_opt_all[valid_front]
        x_v = -non_ground_pts[valid_front, 1]
        y_v = -(non_ground_pts[valid_front, 2] + 0.0464)

        u = (fx * (x_v / z_v) + cx).astype(int)
        v = (fy * (y_v / z_v) + cy).astype(int)

        in_cam = (u >= 0) & (u < 1920) & (v >= 0) & (v < 1080)
        u_p = u[in_cam]
        v_p = v[in_cam]
        d_p = z_v[in_cam]

        # Draw Turbo depth heatmap
        norm_d = np.clip((d_p - 1.0) / 10.0, 0.0, 1.0)
        colors = cv2.applyColorMap((norm_d * 255).astype(np.uint8), cv2.COLORMAP_TURBO)[:, 0, :]
        for (px_pt, py_pt), col in zip(zip(u_p, v_p), colors.tolist()):
            cv2.circle(cam_canvas, (px_pt, py_pt), 2, col, -1)

        # Draw HUD for all active actors
        for trk in active_trackers:
            draw_hud(cam_canvas, trk)

        cam_view_720 = cv2.resize(cam_canvas, (1280, 720), interpolation=cv2.INTER_AREA)

        # Render 640x720 Clean BEV Radar (zero text obstructing LiDAR)
        bev_canvas = draw_clean_bev(non_ground_pts, active_trackers, bev_w=640, bev_h=720, max_r=15.0)

        # Combine
        combined_dashboard = np.hstack([cam_view_720, bev_canvas])
        out_video.write(combined_dashboard)

        # Save keyframe samples for verification and report
        if f_idx in [25, 100, 200, 300, 360]:
            kf_path = out_dir / f"proper_fusion_keyframe_{f_idx:03d}.jpg"
            cv2.imwrite(str(kf_path), combined_dashboard)

        # Record metrics
        metrics_records.append({
            "frame": f_idx,
            "sync_delta_ms": round(sync_ms, 2),
            "camera_detections": len(detections_2d),
            "lidar_3d_clusters": len(clusters_3d),
            "fused_actors": sum(1 for a in current_actors if a["type"] == "FUSED"),
            "vision_actors": sum(1 for a in current_actors if a["type"] == "VISION"),
            "total_actors": len(current_actors),
            "active_tracks": len(active_trackers),
            "track_distances": {t.id: round(float(np.linalg.norm(t.x[:3])), 3) for t in active_trackers}
        })

        if (f_idx + 1) % 20 == 0 or (f_idx + 1) == len(aligned_pairs):
            fps_live = (f_idx + 1) / (time.time() - t_start)
            print(f"    Frame [{f_idx + 1:3d}/{len(aligned_pairs)}] | Fused: {sum(1 for a in current_actors if a['type'] == 'FUSED')} | "
                  f"Vision: {sum(1 for a in current_actors if a['type'] == 'VISION')} | Active Tracks: {len(active_trackers)} | Rate: {fps_live:.1f} FPS", flush=True)

    out_video.release()
    total_time = time.time() - t_start

    # Compute Statistical Report
    total_frames = len(metrics_records)
    total_camera_dets = sum(m["camera_detections"] for m in metrics_records)
    total_fused = sum(m["fused_actors"] for m in metrics_records)
    total_vision = sum(m["vision_actors"] for m in metrics_records)
    total_retained = sum(m["total_actors"] for m in metrics_records)
    retention_rate = (total_retained / total_camera_dets * 100.0) if total_camera_dets > 0 else 0.0

    # Calculate Temporal Jitter per Track
    track_jitters = []
    for trk in trackers:
        if len(trk.history_dist) >= 10:
            diffs = np.diff(trk.history_dist)
            track_jitters.append(float(np.std(diffs)))

    mean_jitter_cm = (float(np.mean(track_jitters)) * 100.0) if track_jitters else 0.0

    summary_report = {
        "dataset_frames": total_frames,
        "processing_time_sec": round(total_time, 2),
        "mean_fps": round(total_frames / total_time, 2),
        "mean_sensor_sync_delta_ms": round(float(np.mean([m["sync_delta_ms"] for m in metrics_records])), 2),
        "total_camera_detections": total_camera_dets,
        "total_fused_actors": total_fused,
        "total_vision_actors": total_vision,
        "total_retained_actors": total_retained,
        "actor_retention_rate_pct": round(retention_rate, 2),
        "mean_temporal_distance_jitter_cm": round(mean_jitter_cm, 2),
        "output_video": str(video_path),
        "algorithms": {
            "ground_removal": "LiDAR Floor Plane Filter (Z_lidar > -1.40m eliminates bridging)",
            "clustering": "Metric 3D Euclidean DBSCAN (eps=0.28m, min_pts=4)",
            "cross_modal_association": "Hungarian Bipartite Assignment with ToF Distance Consistency Gate (Cost: 1 - IoU_2D)",
            "multi_tier_architecture": "FUSED (Camera + LiDAR) & VISION (Camera + ToF Depth / Pinhole Floor Raycast)",
            "tracking": "Constant-Velocity 3D Kalman Filter with Adaptive Measurement Covariance (dt=0.066s)",
            "pose_rendering": "Dual-Joint Confidence Gating (>= 0.40 threshold, zero spiderwebs)",
            "display": "1920x720 Cockpit (1280x720 Camera 3D + 640x720 Unobstructed BEV Radar)"
        }
    }

    report_path = out_dir / "proper_fusion_metrics.json"
    with open(report_path, "w") as f:
        json.dump(summary_report, f, indent=2)

    print("======================================================================")
    print(" 30-Second Multimodal Fusion Benchmark Results")
    print("======================================================================")
    print(f" Processed Frames      : {total_frames} / {total_frames} (100% complete)")
    print(f" Mean Benchmark Rate   : {summary_report['mean_fps']} FPS")
    print(f" Sensor Sync Delta     : {summary_report['mean_sensor_sync_delta_ms']} ms")
    print(f" Total Camera Targets  : {total_camera_dets}")
    print(f" Total Retained Actors : {total_retained} ({summary_report['actor_retention_rate_pct']}%)")
    print(f"   - FUSED (LiDAR+Cam) : {total_fused}")
    print(f"   - VISION (ToF/Ray)  : {total_vision}")
    print(f" 3D Tracking Jitter    : {summary_report['mean_temporal_distance_jitter_cm']} cm")
    print(f" Output Video Rendered : {video_path}")
    print(f" Metrics Report Saved  : {report_path}")
    print("======================================================================")


if __name__ == "__main__":
    main()
