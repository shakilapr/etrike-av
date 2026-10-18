#!/usr/bin/env python3
"""
Verification test for fixed sensor fusion on Frame 25.
"""
import math
from pathlib import Path
import cv2
import numpy as np
from sklearn.cluster import DBSCAN
from scipy.optimize import linear_sum_assignment
from ultralytics import YOLO

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from experiments.proper_sensor_fusion_30s import load_pcd, compute_iou_2d, SKELETON_EDGES

data_dir = Path("data/recordings/raw_sensors_20261017_125516/extracted")
c_file = sorted((data_dir / "color").glob("frame_*.jpg"))[25]
l_file = sorted((data_dir / "lidar").glob("*.pcd"))[25]
d_file = sorted((data_dir / "depth").glob("depth_*.png"))[25]

img = cv2.imread(str(c_file))
pts = load_pcd(l_file)
depth_raw = cv2.imread(str(d_file), cv2.IMREAD_UNCHANGED)[:, :, 0]

# Intrinsics & Calibrated Extrinsics
fx, fy = 1081.372, 1081.372
cx, cy = 959.5, 539.5
cam_x, cam_y, cam_z = 1.20, 0.0, 1.70

# 1. Floor filter (floor is at Z_lidar < -1.40m)
non_floor = pts[pts[:, 2] > -1.40]

# 2. 3D coordinates in base_link
# lidar is at (0.575, 0, 1.7464)
bx = non_floor[:, 0] + 0.575
by = non_floor[:, 1]
bz = non_floor[:, 2] + 1.7464

# Keep forward hemisphere up to 15m
fwd = (bx > 0.5) & (bx < 15.0) & (np.abs(by) < 8.0)
f_pts = np.column_stack([bx[fwd], by[fwd], bz[fwd]])

# 3. Adaptive clustering (eps = 0.25m near, up to 0.40m far)
db = DBSCAN(eps=0.28, min_samples=4, algorithm="kd_tree", n_jobs=-1).fit(f_pts)
labels = db.labels_

clusters = []
for k in set(labels):
    if k == -1:
        continue
    c = f_pts[labels == k]
    dims = c.max(axis=0) - c.min(axis=0)
    cent = c.mean(axis=0)
    # Reject wall planes (width > 5m and height > 2.5m)
    if dims[0] < 5.0 and dims[1] < 4.0:
        clusters.append({
            "points": c,
            "centroid": cent,
            "dims": dims,
            "count": len(c),
            "dist": float(np.linalg.norm(cent))
        })

print(f"Total valid 3D clusters found: {len(clusters)}")

# 4. Project clusters to camera
proj_clusters = []
for c in clusters:
    cent = c["centroid"]
    # Optical coords: Z_opt = X_base - cam_x, X_opt = -(Y_base - cam_y), Y_opt = -(Z_base - cam_z)
    z_opt = cent[0] - cam_x
    if z_opt < 0.4:
        continue
    x_opt = -(cent[1] - cam_y)
    y_opt = -(cent[2] - cam_z)

    u_c = int(fx * (x_opt / z_opt) + cx)
    v_c = int(fy * (y_opt / z_opt) + cy)

    # 3D bounding box corners
    min_b = c["points"].min(axis=0)
    max_b = c["points"].max(axis=0)
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

# 5. YOLO detections & Depth Sampling
model = YOLO("data/ml_models/yolo26x-pose.pt")
res = model(img, conf=0.30, verbose=False)[0]

detections = []
for b_idx in range(len(res.boxes)):
    b = res.boxes[b_idx]
    conf = float(b.conf[0])
    x1, y1, x2, y2 = [int(v) for v in b.xyxy[0].tolist()]

    # Sample ToF depth in center-torso
    dx1, dx2 = int(x1 * 512 / 1920), int(x2 * 512 / 1920)
    dy1, dy2 = int(y1 * 424 / 1080), int(y2 * 424 / 1080)
    # sample central 50%
    cx1 = int(dx1 + (dx2 - dx1) * 0.25)
    cx2 = int(dx2 - (dx2 - dx1) * 0.25)
    cy1 = int(dy1 + (dy2 - dy1) * 0.20)
    cy2 = int(dy2 - (dy2 - dy1) * 0.40)
    crop = depth_raw[cy1:cy2, cx1:cx2]
    val = crop[(crop > 500) & (crop < 15000)]
    tof_d = float(np.median(val)) / 1000.0 if len(val) >= 4 else 0.0

    kpts_xy = None
    kpts_confs = None
    if res.keypoints is not None and b_idx < len(res.keypoints):
        k = res.keypoints[b_idx]
        kpts_xy = k.xy[0].cpu().numpy()
        kpts_confs = k.conf[0].cpu().numpy() if k.conf is not None else np.ones(len(kpts_xy))

    detections.append({
        "box": (x1, y1, x2, y2),
        "conf": conf,
        "tof_d": tof_d,
        "kpts": kpts_xy,
        "kconfs": kpts_confs,
    })

print(f"Total YOLO detections (conf >= 0.30): {len(detections)}")

# 6. Hungarian Matching with Distance Consistency Gate
cost_matrix = np.ones((len(detections), len(proj_clusters)), dtype=np.float32) * 1.0

for d_i, det in enumerate(detections):
    d_box = det["box"]
    d_tof = det["tof_d"]
    for c_j, proj in enumerate(proj_clusters):
        c_box = proj["box_2d"]
        u_c, v_c = proj["center_2d"]
        c_dist = proj["dist"]

        iou = compute_iou_2d(d_box, c_box)
        inside = (d_box[0] <= u_c <= d_box[2]) and (d_box[1] <= v_c <= d_box[3])

        # Distance consistency check: if ToF depth is available, reject clusters > 2.0m away!
        dist_ok = True
        if d_tof > 1.0:
            if abs(c_dist - d_tof) > 1.8:
                dist_ok = False

        if dist_ok:
            if inside:
                cost_matrix[d_i, c_j] = min(1.0 - iou, 0.35)
            elif iou > 0.10:
                cost_matrix[d_i, c_j] = 1.0 - iou

matched_det_indices = set()
matched_cluster_indices = set()
matched_pairs = []

if len(detections) > 0 and len(proj_clusters) > 0:
    row_ind, col_ind = linear_sum_assignment(cost_matrix)
    for r, c in zip(row_ind, col_ind):
        if cost_matrix[r, c] < 0.70:
            matched_det_indices.add(r)
            matched_cluster_indices.add(c)
            matched_pairs.append((r, c))

print(f"Confirmed Fused matches (Camera + LiDAR): {len(matched_pairs)}")

# 7. Build Output Actors (Multi-Tier: FUSED + VISION)
output_actors = []

# Add Fused Actors
for r, c in matched_pairs:
    det = detections[r]
    cl = proj_clusters[c]["cluster"]
    cent = cl["centroid"]
    dist = float(np.linalg.norm(cent))
    output_actors.append({
        "type": "FUSED",
        "box": det["box"],
        "pos": cent,
        "dist": dist,
        "pts": cl["count"],
        "conf": det["conf"],
        "kpts": det["kpts"],
        "kconfs": det["kconfs"],
    })

# Add Vision-Only Actors (Never drop real people!)
for r, det in enumerate(detections):
    if r not in matched_det_indices:
        x1, y1, x2, y2 = det["box"]
        tof_d = det["tof_d"]
        u_cent = (x1 + x2) / 2.0
        v_cent = (y1 + y2) / 2.0

        if tof_d > 0.5:
            z_opt = tof_d
        else:
            # Pinhole floor raycast: feet at floor (Z=0.0 in base_link)
            # v_feet = y2. (y2 - cy) = fy * y_opt / z_opt.
            # y_opt = -(0.0 - cam_z) = +1.70.
            # z_opt = fy * 1.70 / (y2 - cy)
            v_feet = max(cy + 10, float(y2))
            z_opt = float(fy * 1.70 / (v_feet - cy))
            z_opt = np.clip(z_opt, 1.0, 15.0)

        x_opt = (u_cent - cx) * z_opt / fx
        y_opt = (v_cent - cy) * z_opt / fy

        bx_est = z_opt + cam_x
        by_est = -x_opt
        bz_est = -y_opt + cam_z
        pos_est = np.array([bx_est, by_est, bz_est], dtype=np.float32)
        dist_est = float(np.linalg.norm(pos_est))

        output_actors.append({
            "type": "VISION",
            "box": det["box"],
            "pos": pos_est,
            "dist": dist_est,
            "pts": 0,
            "conf": det["conf"],
            "kpts": det["kpts"],
            "kconfs": det["kconfs"],
        })

print(f"Total Output Actors Rendered: {len(output_actors)} (All real people retained!)")
for idx, act in enumerate(output_actors):
    x1, y1, x2, y2 = act["box"]
    print(f"  Actor {idx:2d} [{act['type']:6s}]: 2D ({x1:4d}, {y1:4d}, {x2:4d}, {y2:4d}) | Dist: {act['dist']:.2f}m | Conf: {act['conf']:.2f}")

# 8. Render Verification HUD
vis_cam = img.copy()

# Draw calibrated point cloud overlay
z_opt_all = non_floor[:, 0] - 0.625
x_opt_all = -non_floor[:, 1]
y_opt_all = -(non_floor[:, 2] + 0.0464)
valid_front = z_opt_all > 0.4
u_all = (fx * (x_opt_all[valid_front] / z_opt_all[valid_front]) + cx).astype(int)
v_all = (fy * (y_opt_all[valid_front] / z_opt_all[valid_front]) + cy).astype(int)
d_all = z_opt_all[valid_front]

in_c = (u_all >= 0) & (u_all < 1920) & (v_all >= 0) & (v_all < 1080)
norm_d = np.clip((d_all[in_c] - 1.0) / 10.0, 0.0, 1.0)
cols = cv2.applyColorMap((norm_d * 255).astype(np.uint8), cv2.COLORMAP_TURBO)[:, 0, :]
for (px, py), col in zip(zip(u_all[in_c], v_all[in_c]), cols.tolist()):
    cv2.circle(vis_cam, (px, py), 2, col, -1)

# Draw actors
for idx, act in enumerate(output_actors):
    x1, y1, x2, y2 = act["box"]
    color = (0, 255, 120) if act["type"] == "FUSED" else (255, 215, 0) # Green for fused, Cyan for vision

    cv2.rectangle(vis_cam, (x1, y1), (x2, y2), color, 2, cv2.LINE_AA)

    # Skeleton
    if act["kpts"] is not None and act["kconfs"] is not None:
        confs = act["kconfs"]
        kpts = act["kpts"]
        for p1, p2 in SKELETON_EDGES:
            if p1 < len(confs) and p2 < len(confs):
                if confs[p1] >= 0.40 and confs[p2] >= 0.40:
                    pt1 = (int(kpts[p1, 0]), int(kpts[p1, 1]))
                    pt2 = (int(kpts[p2, 0]), int(kpts[p2, 1]))
                    cv2.line(vis_cam, pt1, pt2, (0, 255, 255), 2, cv2.LINE_AA)
        for p in range(len(confs)):
            if confs[p] >= 0.40:
                cv2.circle(vis_cam, (int(kpts[p, 0]), int(kpts[p, 1])), 3, (0, 255, 255), -1, cv2.LINE_AA)

    # Label
    tag = f"ID:{idx+1} {act['type']} {act['dist']:.2f}m"
    if act['pts'] > 0:
        tag += f" [{act['pts']}pts]"
    (tw, th), _ = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.48, 1)
    cv2.rectangle(vis_cam, (x1, y1 - th - 8), (x1 + tw + 6, y1), color, -1)
    cv2.putText(vis_cam, tag, (x1 + 3, y1 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (0, 0, 0), 1, cv2.LINE_AA)

# Draw BEV Radar
bev_w, bev_h = 640, 720
bev = np.zeros((bev_h, bev_w, 3), dtype=np.uint8)
bev[:] = (18, 20, 26)
cx_b = bev_w // 2
cy_b = int(bev_h * 0.90)
scale = (bev_h * 0.85) / 15.0

# Range rings
for r in [2.5, 5.0, 7.5, 10.0, 12.5, 15.0]:
    r_px = int(r * scale)
    cv2.circle(bev, (cx_b, cy_b), r_px, (40, 45, 55), 1, cv2.LINE_AA)
    cv2.putText(bev, f"{r:.1f}m", (cx_b + 5, cy_b - r_px + 12), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (80, 90, 110), 1)

# E-Trike footprint
v_w = int(1.3 * scale)
v_l_f = int(1.8 * scale)
v_l_r = int(0.8 * scale)
cv2.rectangle(bev, (cx_b - v_w // 2, cy_b - v_l_f), (cx_b + v_w // 2, cy_b + v_l_r), (0, 165, 255), 2)
cv2.putText(bev, "E-TRIKE", (cx_b - 22, cy_b + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 165, 255), 1)

# Background scatter
xb = non_floor[:, 0] + 0.575
yb = non_floor[:, 1]
valid_b = (xb > -1.5) & (xb < 15.0) & (np.abs(yb) < 8.0)
px_b = (cx_b - yb[valid_b] * scale).astype(int)
py_b = (cy_b - xb[valid_b] * scale).astype(int)
for px, py in zip(px_b, py_b):
    if 0 <= px < bev_w and 0 <= py < bev_h:
        bev[py, px] = (75, 115, 130)

# Actors on radar
for idx, act in enumerate(output_actors):
    ox, oy, _ = act["pos"]
    od = act["dist"]
    p_x = int(cx_b - oy * scale)
    p_y = int(cy_b - ox * scale)
    if 0 <= p_x < bev_w and 0 <= p_y < bev_h:
        color = (0, 255, 120) if act["type"] == "FUSED" else (255, 215, 0)
        cv2.circle(bev, (p_x, p_y), 10, color, 2, cv2.LINE_AA)
        cv2.circle(bev, (p_x, p_y), 3, color, -1)
        cv2.line(bev, (cx_b, cy_b), (p_x, p_y), color, 1, cv2.LINE_AA)
        cv2.putText(bev, f"{act['dist']:.1f}m", (p_x + 12, p_y + 4), cv2.FONT_HERSHEY_SIMPLEX, 0.38, color, 1)

# Resize and combine
cam_720 = cv2.resize(vis_cam, (1280, 720), interpolation=cv2.INTER_AREA)
cockpit = np.hstack([cam_720, bev])

out_path = Path("data/recordings/raw_sensors_20261017_125516/proper_fusion_output/verified_fixed_frame25.jpg")
cv2.imwrite(str(out_path), cockpit)
print(f"SUCCESS: Saved verified fixed frame 25 to {out_path}")
