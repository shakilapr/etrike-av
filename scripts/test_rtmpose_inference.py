import ctypes
import os
import sys
import time
import cv2
import numpy as np
import tensorrt as trt

# Load CUDA Runtime via ctypes
_CUDART = ctypes.CDLL("libcudart.so")
_cudaMalloc = _CUDART.cudaMalloc
_cudaMalloc.argtypes = [ctypes.POINTER(ctypes.c_void_p), ctypes.c_size_t]
_cudaMalloc.restype = ctypes.c_int

_cudaFree = _CUDART.cudaFree
_cudaFree.argtypes = [ctypes.c_void_p]
_cudaFree.restype = ctypes.c_int

_cudaMemcpyAsync = _CUDART.cudaMemcpyAsync
_cudaMemcpyAsync.argtypes = [ctypes.c_void_p, ctypes.c_void_p, ctypes.c_size_t, ctypes.c_int, ctypes.c_void_p]
_cudaMemcpyAsync.restype = ctypes.c_int

_cudaStreamCreate = _CUDART.cudaStreamCreate
_cudaStreamCreate.argtypes = [ctypes.POINTER(ctypes.c_void_p)]
_cudaStreamCreate.restype = ctypes.c_int

_cudaStreamSynchronize = _CUDART.cudaStreamSynchronize
_cudaStreamSynchronize.argtypes = [ctypes.c_void_p]
_cudaStreamSynchronize.restype = ctypes.c_int

CUDA_MEMCPY_H2D = 1
CUDA_MEMCPY_D2H = 2

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
    (12, 14), (14, 16)                        # Right leg
]

def crop_and_pad(img, bbox, target_size=(192, 256)):
    """Crop person bbox with aspect ratio preservation (target: W=192, H=256)."""
    x1, y1, x2, y2 = bbox
    w = max(10, x2 - x1)
    h = max(10, y2 - y1)
    
    # Expand box slightly (15% padding)
    cx, cy = x1 + w / 2.0, y1 + h / 2.0
    w_pad = w * 1.25
    h_pad = h * 1.25
    
    # Keep 192:256 aspect ratio
    target_ar = target_size[0] / target_size[1]
    if (w_pad / h_pad) > target_ar:
        h_pad = w_pad / target_ar
    else:
        w_pad = h_pad * target_ar
        
    src_pts = np.float32([
        [cx - w_pad / 2.0, cy - h_pad / 2.0],
        [cx + w_pad / 2.0, cy - h_pad / 2.0],
        [cx + w_pad / 2.0, cy + h_pad / 2.0]
    ])
    dst_pts = np.float32([
        [0, 0],
        [target_size[0], 0],
        [target_size[0], target_size[1]]
    ])
    trans = cv2.getAffineTransform(src_pts, dst_pts)
    inv_trans = cv2.getAffineTransform(dst_pts, src_pts)
    cropped = cv2.warpAffine(img, trans, target_size, flags=cv2.INTER_LINEAR)
    return cropped, inv_trans

def main():
    engine_path = "/workspace/data/ml_models/rtmpose_s_fp16.engine"
    image_path = "/workspace/data/camera_snap.jpg"
    if not os.path.exists(image_path):
        image_path = "/workspace/av_project/camera_snap.jpg"
        
    print(f"Loading engine: {engine_path}")
    logger = trt.Logger(trt.Logger.WARNING)
    runtime = trt.Runtime(logger)
    with open(engine_path, "rb") as f:
        engine = runtime.deserialize_cuda_engine(f.read())
    context = engine.create_execution_context()
    
    # Buffer sizes
    in_size = 1 * 3 * 256 * 192 * 4       # Float32 input
    out_x_size = 1 * 17 * 384 * 4         # SimCC X
    out_y_size = 1 * 17 * 512 * 4         # SimCC Y
    
    d_in = ctypes.c_void_p()
    d_out_x = ctypes.c_void_p()
    d_out_y = ctypes.c_void_p()
    stream = ctypes.c_void_p()
    
    _cudaMalloc(ctypes.byref(d_in), in_size)
    _cudaMalloc(ctypes.byref(d_out_x), out_x_size)
    _cudaMalloc(ctypes.byref(d_out_y), out_y_size)
    _cudaStreamCreate(ctypes.byref(stream))
    
    # Load image
    img = cv2.imread(image_path)
    if img is None:
        print(f"Failed to read image from {image_path}")
        return
        
    # Person bbox detected by YOLOv8x earlier: [912, 462, 1140, 755]
    person_bbox = [912, 462, 1140, 755]
    crop, inv_trans = crop_and_pad(img, person_bbox)
    
    # Preprocess: BGR -> RGB, ImageNet normalization
    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB).astype(np.float32)
    mean = np.array([123.675, 116.28, 103.53], dtype=np.float32)
    std = np.array([58.395, 57.12, 57.375], dtype=np.float32)
    rgb = (rgb - mean) / std
    chw = np.transpose(rgb, (2, 0, 1))[None, ...]
    blob = np.ascontiguousarray(chw, dtype=np.float32)
    
    # Execute inference
    _cudaMemcpyAsync(d_in, blob.ctypes.data, in_size, CUDA_MEMCPY_H2D, stream)
    
    context.set_tensor_address("input", d_in.value)
    context.set_tensor_address("simcc_x", d_out_x.value)
    context.set_tensor_address("simcc_y", d_out_y.value)
    
    t0 = time.time()
    context.execute_async_v3(stream.value)
    _cudaStreamSynchronize(stream.value)
    infer_ms = (time.time() - t0) * 1000.0
    print(f"RTMPose-s FP16 Inference Latency: {infer_ms:.2f} ms")
    
    # Read output
    h_out_x = np.empty((1, 17, 384), dtype=np.float32)
    h_out_y = np.empty((1, 17, 512), dtype=np.float32)
    _cudaMemcpyAsync(h_out_x.ctypes.data, d_out_x, out_x_size, CUDA_MEMCPY_D2H, stream)
    _cudaMemcpyAsync(h_out_y.ctypes.data, d_out_y, out_y_size, CUDA_MEMCPY_D2H, stream)
    _cudaStreamSynchronize(stream.value)
    
    # Decode SimCC to Keypoints
    keypoints = []
    annotated = img.copy()
    
    for k in range(17):
        kx_sub = np.argmax(h_out_x[0, k, :]) / 2.0
        ky_sub = np.argmax(h_out_y[0, k, :]) / 2.0
        
        # Transform back to original image space
        orig_pt = inv_trans @ np.array([kx_sub, ky_sub, 1.0])
        px, py = int(orig_pt[0]), int(orig_pt[1])
        keypoints.append((px, py))
        
        cv2.circle(annotated, (px, py), 4, (0, 255, 255), -1)
        cv2.putText(annotated, COCO_KEYPOINTS[k], (px + 6, py), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)

    for (p1, p2) in SKELETON_EDGES:
        pt1, pt2 = keypoints[p1], keypoints[p2]
        cv2.line(annotated, pt1, pt2, (255, 128, 0), 2)
        
    # Analyze posture: Hip to Knee vertical vs horizontal
    l_hip, r_hip = keypoints[11], keypoints[12]
    l_knee, r_knee = keypoints[13], keypoints[14]
    
    # Thigh angle vs vertical
    hip_y = (l_hip[1] + r_hip[1]) / 2.0
    knee_y = (l_knee[1] + r_knee[1]) / 2.0
    thigh_dy = abs(knee_y - hip_y)
    bbox_h = person_bbox[3] - person_bbox[1]
    
    # Seated check: thigh vertical span is much smaller than standing human
    is_seated = (thigh_dy / max(1.0, bbox_h)) < 0.35
    posture_str = "SEATED" if is_seated else "STANDING"
    print(f"Detected Posture: {posture_str} (thigh_ratio={thigh_dy/bbox_h:.2f})")
    
    cv2.rectangle(annotated, (person_bbox[0], person_bbox[1]), (person_bbox[2], person_bbox[3]), (0, 200, 255), 2)
    cv2.putText(annotated, f"PERSON: {posture_str}", (person_bbox[0], person_bbox[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 200, 255), 2)
    
    out_path = "/workspace/data/rtmpose_detected_person.jpg"
    cv2.imwrite(out_path, annotated)
    print(f"Saved visual skeleton overlay: {out_path}")

if __name__ == "__main__":
    main()
