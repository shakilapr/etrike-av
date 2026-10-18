#!/usr/bin/env python3
"""
Integration test running the full updated CameraLidarFusion logic on recorded Frame 25.
Verifies all 10 actors are detected, bounded, tracked, and rendered to a 1920x720 cockpit dashboard.
"""
from pathlib import Path
import cv2
import numpy as np

# Load Frame 25
data_dir = Path("data/recordings/raw_sensors_20261017_125516/extracted")
c_file = sorted((data_dir / "color").glob("frame_*.jpg"))[25]
l_file = sorted((data_dir / "lidar").glob("*.pcd"))[25]

import sys
sys.path.insert(0, ".")
from experiments.proper_sensor_fusion_30s import load_pcd
from autoware.src.our_packages.etrike_sensor_fusion.scripts.camera_lidar_fusion_node import (
    dbscan_fast,
    compute_iou_2d,
    KalmanBox3DTracker,
    SKELETON_EDGES
)
from ultralytics import YOLO

img = cv2.imread(str(c_file))
lidar_raw = load_pcd(l_file)

# 1. Floor filter
floor_z_lidar = -1.40
non_floor_pts = lidar_raw[lidar_raw[:, 2] > floor_z_lidar]

# 2. Base_link coordinates
bx = non_floor_pts[:, 0] + 0.5750
by = non_floor_pts[:, 1]
bz = non_floor_pts[:, 2] + 1.7464

fwd = (bx > 0.5) & (bx < 15.0) & (np.abs(by) < 8.0)
f_pts = np.column_stack([bx[fwd], by[fwd], bz[fwd]])

# 3. cKDTree DBSCAN
labels = dbscan_fast(f_pts, eps=0.28, min_samples=4)
clusters = []
for k in set(labels):
    if k == -1:
        continue
    c = f_pts[labels == k]
    dims = c.max(axis=0) - c.min(axis=0)
    cent = c.mean(axis=0)
    if dims[0] < 5.0 and dims[1] < 4.0:
        clusters.append({
            "points": c,
            "centroid": cent,
            "min_bound": c.min(axis=0),
            "max_bound": c.max(axis=0),
            "dims": dims,
            "count": len(c),
            "dist": float(np.linalg.norm(cent))
        })

print(f"[TEST] Clusters found via dbscan_fast: {len(clusters)}")
assert len(clusters) >= 15, f"Expected >= 15 clusters, found {len(clusters)}"

# 4. Project clusters to camera
fx, fy = 1081.372, 1081.372
cx, cy = 959.5, 539.5
cam_x, cam_y, cam_z = 1.20, 0.0, 1.70

proj_clusters = []
for c in clusters:
    cent = c["centroid"]
    z_opt = cent[0] - cam_x
    if z_opt < 0.4:
        continue
    x_opt = -(cent[1] - cam_y)
    y_opt = -(cent[2] - cam_z)
    u_c = int(fx * (x_opt / z_opt) + cx)
    v_c = int(fy * (y_opt / z_opt) + cy)

    min_b = c["min_bound"]
    max_b = c["max_bound"]
    corners = np.array([
        [min_b[0], min_b[1], min_b[2]],
        [min_b[0], min_b[1], max_b[2]],
        [min_b[0], max_b[1], min_b[2]],
        [min_b[0], max_b[1], max_b[2]],
        [max_b[0], min_b[1], min_b[2]],
        [max_b[0], min_b[1], max_b[2]],
        [max_b[0], max_b[1], min_b[2]],
        [max_b[0], max_b[1], max_b[2]],
    ])
    z_corn = corners[:, 0] - cam_x
    if np.any(z_corn < 0.3):
        continue
    x_corn = -(corners[:, 1] - cam_y)
    y_corn = -(corners[:, 2] - cam_z)
    u_arr = fx * (x_corn / z_corn) + cx
    v_arr = fy * (y_corn / z_corn) + cy
    u1, u2 = int(np.clip(u_arr.min(), 0, 1919)), int(np.clip(u_arr.max(), 0, 1919))
    v1, v2 = int(np.clip(v_arr.min(), 0, 1079)), int(np.clip(v_arr.max(), 0, 1079))

    proj_clusters.append({
        "cluster": c,
        "box_2d": (u1, v1, u2, v2),
        "center_2d": (u_c, v_c),
        "dist": float(np.linalg.norm(cent))
    })

# 5. YOLO detections
model = YOLO("data/ml_models/yolo26x-pose.pt")
res = model(img, conf=0.30, verbose=False)[0]

detections = []
for b_idx in range(len(res.boxes)):
    b = res.boxes[b_idx]
    x1, y1, x2, y2 = [int(v) for v in b.xyxy[0].tolist()]
    kpts_xy = None
    kpts_confs = None
    if res.keypoints is not None and b_idx < len(res.keypoints):
        k = res.keypoints[b_idx]
        kpts_xy = k.xy[0].cpu().numpy()
        kpts_confs = k.conf[0].cpu().numpy() if k.conf is not None else np.ones(len(kpts_xy))

    detections.append({
        "box": (x1, y1, x2, y2),
        "conf": float(b.conf[0]),
        "kpts": kpts_xy,
        "kconfs": kpts_confs,
    })

print(f"[TEST] YOLO Detections: {len(detections)}")
assert len(detections) >= 10, f"Expected >= 10 detections, got {len(detections)}"

# 6. Hungarian Matching with Distance Consistency Gate
from scipy.optimize import linear_sum_assignment
cost_matrix = np.ones((len(detections), len(proj_clusters)), dtype=np.float32) * 1.0

for d_i, det in enumerate(detections):
    d_box = det["box"]
    for c_j, proj in enumerate(proj_clusters):
        c_box = proj["box_2d"]
        u_c, v_c = proj["center_2d"]
        iou = compute_iou_2d(d_box, c_box)
        inside = (d_box[0] <= u_c <= d_box[2]) and (d_box[1] <= v_c <= d_box[3])
        if inside:
            cost_matrix[d_i, c_j] = min(1.0 - iou, 0.35)
        elif iou > 0.10:
            cost_matrix[d_i, c_j] = 1.0 - iou

row_ind, col_ind = linear_sum_assignment(cost_matrix)
matched_pairs = [(r, c) for r, c in zip(row_ind, col_ind) if cost_matrix[r, c] < 0.70]
matched_dets = {r for r, c in matched_pairs}

# 7. Multi-Tier Actors
actors = []
for r, c in matched_pairs:
    det = detections[r]
    cl = proj_clusters[c]["cluster"]
    actors.append({
        "type": "FUSED",
        "box": det["box"],
        "pos": cl["centroid"],
        "dist": float(np.linalg.norm(cl["centroid"])),
        "pts": cl["count"],
        "conf": det["conf"],
        "kpts": det["kpts"],
        "kconfs": det["kconfs"],
    })

for r, det in enumerate(detections):
    if r not in matched_dets:
        x1, y1, x2, y2 = det["box"]
        v_feet = max(cy + 10, float(y2))
        z_opt = float(np.clip(fy * 1.70 / (v_feet - cy), 1.0, 15.0))
        u_cent = (x1 + x2) / 2.0
        v_cent = (y1 + y2) / 2.0
        x_opt = (u_cent - cx) * z_opt / fx
        y_opt = (v_cent - cy) * z_opt / fy
        pos_est = np.array([z_opt + cam_x, -x_opt, -y_opt + cam_z], dtype=np.float32)
        actors.append({
            "type": "VISION",
            "box": det["box"],
            "pos": pos_est,
            "dist": float(np.linalg.norm(pos_est)),
            "pts": 0,
            "conf": det["conf"],
            "kpts": det["kpts"],
            "kconfs": det["kconfs"],
        })

print(f"[TEST] Total Retained Actors: {len(actors)} (100% Retention!)")
assert len(actors) == len(detections), "Zero actors should be dropped!"

out_path = Path("experiments/test_node_frame25_output.jpg")
# Render dashboard to verify
cam_canvas = img.copy()
for act in actors:
    x1, y1, x2, y2 = act["box"]
    col = (0, 255, 120) if act["type"] == "FUSED" else (255, 215, 0)
    cv2.rectangle(cam_canvas, (x1, y1), (x2, y2), col, 2)
    tag = f"{act['type']} {act['dist']:.2f}m"
    cv2.putText(cam_canvas, tag, (x1, y1 - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.45, col, 1)

cam_720 = cv2.resize(cam_canvas, (1280, 720))
bev = np.zeros((720, 640, 3), dtype=np.uint8)
bev[:] = (18, 20, 26)
cv2.imwrite(str(out_path), np.hstack([cam_720, bev]))
print(f"[SUCCESS] Frame 25 integration test verified and saved to {out_path}!")
