#!/usr/bin/env python3
import sys
import os
import time
import ctypes
import numpy as np
import cv2
import tensorrt as trt

# Load CUDA Runtime via ctypes
cudart = ctypes.CDLL("libcudart.so")

# CUDA runtime bindings
cudaMalloc = cudart.cudaMalloc
cudaMalloc.argtypes = [ctypes.POINTER(ctypes.c_void_p), ctypes.c_size_t]
cudaMalloc.restype = ctypes.c_int

cudaFree = cudart.cudaFree
cudaFree.argtypes = [ctypes.c_void_p]
cudaFree.restype = ctypes.c_int

cudaMemcpyAsync = cudart.cudaMemcpyAsync
cudaMemcpyAsync.argtypes = [ctypes.c_void_p, ctypes.c_void_p, ctypes.c_size_t, ctypes.c_int, ctypes.c_void_p]
cudaMemcpyAsync.restype = ctypes.c_int

cudaStreamCreate = cudart.cudaStreamCreate
cudaStreamCreate.argtypes = [ctypes.POINTER(ctypes.c_void_p)]
cudaStreamCreate.restype = ctypes.c_int

cudaStreamDestroy = cudart.cudaStreamDestroy
cudaStreamDestroy.argtypes = [ctypes.c_void_p]
cudaStreamDestroy.restype = ctypes.c_int

cudaStreamSynchronize = cudart.cudaStreamSynchronize
cudaStreamSynchronize.argtypes = [ctypes.c_void_p]
cudaStreamSynchronize.restype = ctypes.c_int

cudaMemcpyHostToDevice = 1
cudaMemcpyDeviceToHost = 2

# COCO 80 classes mapping
COCO_CLASSES = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat",
    "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
    "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack",
    "umbrella", "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball",
    "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", "tennis racket",
    "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
    "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair",
    "couch", "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse",
    "remote", "keyboard", "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator",
    "book", "clock", "vase", "scissors", "teddy bear", "hair drier", "toothbrush"
]

def letterbox(img, new_shape=(640, 640), color=(114, 114, 114)):
    shape = img.shape[:2]  # [h, w]
    r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
    new_unpad = (int(round(shape[1] * r)), int(round(shape[0] * r)))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]
    dw /= 2
    dh /= 2

    if shape[::-1] != new_unpad:
        img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    img = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
    return img, r, (dw, dh)

def main():
    image_path = sys.argv[1] if len(sys.argv) > 1 else "/workspace/av_project/camera_snap.jpg"
    engine_path = sys.argv[2] if len(sys.argv) > 2 else "/workspace/data/ml_models/yolov8x_fp16.engine"
    out_path = sys.argv[3] if len(sys.argv) > 3 else "/workspace/av_project/yolo_detected_snap.jpg"

    print(f"[TRT] Loading TensorRT Engine: {engine_path}")
    logger = trt.Logger(trt.Logger.WARNING)
    runtime = trt.Runtime(logger)

    with open(engine_path, "rb") as f:
        engine = runtime.deserialize_cuda_engine(f.read())

    context = engine.create_execution_context()

    # Load and preprocess image
    orig_img = cv2.imread(image_path)
    if orig_img is None:
        print(f"[ERROR] Could not load image from {image_path}")
        return

    h_orig, w_orig = orig_img.shape[:2]
    padded_img, ratio, (pad_w, pad_h) = letterbox(orig_img, (640, 640))
    rgb_img = cv2.cvtColor(padded_img, cv2.COLOR_BGR2RGB)
    blob = rgb_img.astype(np.float32) / 255.0
    blob = np.transpose(blob, (2, 0, 1))  # HWC to CHW
    blob = np.expand_dims(blob, axis=0)   # 1, 3, 640, 640
    blob = np.ascontiguousarray(blob)

    # Allocate CUDA device memory
    input_size = blob.nbytes
    output_shape = (1, 84, 8400)
    output_dtype = np.float32
    output_size = int(np.prod(output_shape) * np.dtype(output_dtype).itemsize)

    d_input = ctypes.c_void_p()
    d_output = ctypes.c_void_p()
    cudaMalloc(ctypes.byref(d_input), input_size)
    cudaMalloc(ctypes.byref(d_output), output_size)

    stream = ctypes.c_void_p()
    cudaStreamCreate(ctypes.byref(stream))

    # Copy H2D
    cudaMemcpyAsync(d_input, blob.ctypes.data_as(ctypes.c_void_p), input_size, cudaMemcpyHostToDevice, stream)

    # Bind buffers
    context.set_input_shape("images", (1, 3, 640, 640))
    context.set_tensor_address("images", d_input.value)
    context.set_tensor_address("output0", d_output.value)

    # Inference execution
    t0 = time.time()
    context.execute_async_v3(stream.value)
    
    # Copy D2H
    h_output = np.empty(output_shape, dtype=output_dtype)
    cudaMemcpyAsync(h_output.ctypes.data_as(ctypes.c_void_p), d_output, output_size, cudaMemcpyDeviceToHost, stream)
    cudaStreamSynchronize(stream)
    infer_ms = (time.time() - t0) * 1000.0

    print(f"[TRT] GPU Inference completed in {infer_ms:.2f} ms")

    # Postprocess: output shape (1, 84, 8400) -> transpose to (8400, 84)
    preds = np.transpose(h_output[0], (1, 0))  # 8400 x 84
    boxes = preds[:, :4]  # cx, cy, w, h
    scores = preds[:, 4:] # 80 class scores

    class_ids = np.argmax(scores, axis=1)
    confidences = np.max(scores, axis=1)

    # Filter confidence >= 0.35
    conf_mask = confidences >= 0.35
    boxes = boxes[conf_mask]
    class_ids = class_ids[conf_mask]
    confidences = confidences[conf_mask]

    # Convert cx, cy, w, h in 640x640 to x1, y1, x2, y2 in original image
    det_boxes = []
    for i in range(len(boxes)):
        cx, cy, bw, bh = boxes[i]
        x1 = cx - bw / 2.0
        y1 = cy - bh / 2.0
        x2 = cx + bw / 2.0
        y2 = cy + bh / 2.0

        # Unpad and scale back
        x1 = (x1 - pad_w) / ratio
        y1 = (y1 - pad_h) / ratio
        x2 = (x2 - pad_w) / ratio
        y2 = (y2 - pad_h) / ratio

        x1 = max(0, min(w_orig, x1))
        y1 = max(0, min(h_orig, y1))
        x2 = max(0, min(w_orig, x2))
        y2 = max(0, min(h_orig, y2))
        det_boxes.append([int(x1), int(y1), int(x2 - x1), int(y2 - y1)])

    # OpenCV NMS
    indices = cv2.dnn.NMSBoxes(det_boxes, confidences.tolist(), 0.35, 0.45)
    
    print(f"\n================ DETECTION RESULTS ================")
    annotated = orig_img.copy()
    detected_count = 0
    if len(indices) > 0:
        for idx in indices.flatten():
            bx, by, bw, bh = det_boxes[idx]
            cls_id = int(class_ids[idx])
            conf = float(confidences[idx])
            label = COCO_CLASSES[cls_id] if cls_id < len(COCO_CLASSES) else f"class_{cls_id}"
            detected_count += 1
            print(f" • [{detected_count}] {label.upper()}: {conf*100:.1f}% confidence at [{bx}, {by}, {bx+bw}, {by+bh}]")

            # Draw bounding box
            color = (0, 255, 0) if label == "person" else (255, 165, 0)
            cv2.rectangle(annotated, (bx, by), (bx + bw, by + bh), color, 3)
            caption = f"{label} {conf*100:.1f}%"
            cv2.putText(annotated, caption, (bx, max(25, by - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

    cv2.imwrite(out_path, annotated)
    print(f"\n[OK] Saved annotated verification image to: {out_path}")

    # Clean up CUDA
    cudaFree(d_input)
    cudaFree(d_output)
    cudaStreamDestroy(stream)

if __name__ == '__main__':
    main()
