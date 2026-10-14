#!/usr/bin/env python3
# Copyright 2026 E-Trike Dev. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Real-time TensorRT YOLO Perception LifecycleNode for E-Trike Autonomous Vehicle.

Performs hardware-accelerated 2D/3D object detection on camera streams using TensorRT 10.3
on NVIDIA Jetson AGX Orin. Adheres strictly to the Dual-System Bench Isolation Architecture
(BENCH_SENSOR_SIMULATION_ISOLATION.md) and AGENTS.md rules.
"""

from __future__ import annotations

import ctypes
import json
import os
import sys
import time
from typing import Any, Dict, List, Optional, Tuple

import cv2
import numpy as np

import rclpy
from rclpy.lifecycle import LifecycleNode, LifecyclePublisher
from rclpy.lifecycle import LifecycleState, TransitionCallbackReturn
from rclpy.qos import QoSDurabilityPolicy, QoSHistoryPolicy, QoSProfile, QoSReliabilityPolicy

from autoware_perception_msgs.msg import (
    DetectedObject,
    DetectedObjectKinematics,
    DetectedObjects,
    ObjectClassification,
    Shape,
)
from cv_bridge import CvBridge
from geometry_msgs.msg import Point, Quaternion, Vector3
from sensor_msgs.msg import Image
from std_msgs.msg import Header, String
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

_cudaStreamDestroy = _CUDART.cudaStreamDestroy
_cudaStreamDestroy.argtypes = [ctypes.c_void_p]
_cudaStreamDestroy.restype = ctypes.c_int

_cudaStreamSynchronize = _CUDART.cudaStreamSynchronize
_cudaStreamSynchronize.argtypes = [ctypes.c_void_p]
_cudaStreamSynchronize.restype = ctypes.c_int

CUDA_MEMCPY_H2D = 1
CUDA_MEMCPY_D2H = 2

# COCO 80 classes mapping
COCO_CLASSES: List[str] = [
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


# RTMPose-s 17 COCO Keypoints & Topology
COCO_KEYPOINTS: List[str] = [
    "nose", "left_eye", "right_eye", "left_ear", "right_ear",
    "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
    "left_wrist", "right_wrist", "left_hip", "right_hip",
    "left_knee", "right_knee", "left_ankle", "right_ankle",
]

SKELETON_EDGES: List[Tuple[int, int]] = [
    (0, 1), (0, 2), (1, 3), (2, 4),           # Head
    (5, 6),                                   # Shoulders
    (5, 7), (7, 9),                           # Left arm
    (6, 8), (8, 10),                          # Right arm
    (5, 11), (6, 12), (11, 12),               # Torso
    (11, 13), (13, 15),                       # Left leg
    (12, 14), (14, 16),                       # Right leg
]


def letterbox(img: np.ndarray, new_shape: Tuple[int, int] = (640, 640), color: Tuple[int, int, int] = (114, 114, 114)) -> Tuple[np.ndarray, float, Tuple[float, float]]:
    """Letterbox resize keeping aspect ratio with padding."""
    shape = img.shape[:2]
    r = min(new_shape[0] / shape[0], new_shape[1] / shape[1])
    new_unpad = (int(round(shape[1] * r)), int(round(shape[0] * r)))
    dw, dh = new_shape[1] - new_unpad[0], new_shape[0] - new_unpad[1]
    dw /= 2.0
    dh /= 2.0

    if shape[::-1] != new_unpad:
        img = cv2.resize(img, new_unpad, interpolation=cv2.INTER_LINEAR)
    top, bottom = int(round(dh - 0.1)), int(round(dh + 0.1))
    left, right = int(round(dw - 0.1)), int(round(dw + 0.1))
    padded = cv2.copyMakeBorder(img, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
    return padded, r, (dw, dh)


def crop_and_pad(img: np.ndarray, bbox: Tuple[int, int, int, int], target_size: Tuple[int, int] = (192, 256)) -> Tuple[np.ndarray, np.ndarray]:
    """Crop person bounding box with aspect ratio preservation (target: W=192, H=256)."""
    x1, y1, x2, y2 = bbox
    w = max(10, x2 - x1)
    h = max(10, y2 - y1)

    cx, cy = x1 + w / 2.0, y1 + h / 2.0
    w_pad = w * 1.25
    h_pad = h * 1.25

    target_ar = target_size[0] / target_size[1]
    if (w_pad / h_pad) > target_ar:
        h_pad = w_pad / target_ar
    else:
        w_pad = h_pad * target_ar

    src_pts = np.float32([
        [cx - w_pad / 2.0, cy - h_pad / 2.0],
        [cx + w_pad / 2.0, cy - h_pad / 2.0],
        [cx + w_pad / 2.0, cy + h_pad / 2.0],
    ])
    dst_pts = np.float32([
        [0, 0],
        [target_size[0], 0],
        [target_size[0], target_size[1]],
    ])
    trans = cv2.getAffineTransform(src_pts, dst_pts)
    inv_trans = cv2.getAffineTransform(dst_pts, src_pts)
    cropped = cv2.warpAffine(img, trans, target_size, flags=cv2.INTER_LINEAR)
    return cropped, inv_trans


class YoloPerceptionNode(LifecycleNode):
    """ROS 2 LifecycleNode running TensorRT YOLO on Jetson AGX Orin with strict Bench Isolation."""

    def __init__(self, node_name: str = "yolo_perception_node") -> None:
        super().__init__(node_name)

        # Declare parameters
        self.declare_parameter("engine_path", "/workspace/data/ml_models/yolov8x_fp16.engine")
        self.declare_parameter("publish_mode", "bench")  # 'bench' (isolated) or 'vehicle'
        self.declare_parameter("input_image_topic", "/kinect_front/color/image_raw")
        self.declare_parameter("input_depth_topic", "/kinect_front/depth/image_raw")
        self.declare_parameter("confidence_threshold", 0.35)
        self.declare_parameter("nms_threshold", 0.45)
        self.declare_parameter("sensor_timeout_sec", 1.2)
        self.declare_parameter("publish_debug_image", True)
        self.declare_parameter("auto_start", True)
        self.declare_parameter("enable_pose_estimation", True)
        self.declare_parameter("pose_engine_path", "/workspace/data/ml_models/rtmpose_s_fp16.engine")

        # State members
        self._bridge: CvBridge = CvBridge()
        self._engine: Optional[Any] = None
        self._trt_context: Optional[Any] = None
        self._stream: Optional[ctypes.c_void_p] = None
        self._d_input: Optional[ctypes.c_void_p] = None
        self._d_output: Optional[ctypes.c_void_p] = None

        self._input_size: int = 1 * 3 * 640 * 640 * 4
        self._output_shape: Tuple[int, int, int] = (1, 84, 8400)
        self._output_size: int = int(np.prod(self._output_shape) * 4)

        # RTMPose-s State members
        self._pose_engine: Optional[Any] = None
        self._pose_context: Optional[Any] = None
        self._d_pose_in: Optional[ctypes.c_void_p] = None
        self._d_pose_out_x: Optional[ctypes.c_void_p] = None
        self._d_pose_out_y: Optional[ctypes.c_void_p] = None
        self._pose_in_size: int = 1 * 3 * 256 * 192 * 4
        self._pose_out_x_size: int = 1 * 17 * 384 * 4
        self._pose_out_y_size: int = 1 * 17 * 512 * 4

        self._last_image_time: float = 0.0
        self._last_depth_frame: Optional[np.ndarray] = None
        self._last_depth_time: float = 0.0
        self._last_infer_ms: float = 0.0

        # Subscriptions & Publishers
        self._sub_color: Optional[Any] = None
        self._sub_depth: Optional[Any] = None
        self._pub_objects: Optional[LifecyclePublisher] = None
        self._pub_debug_img: Optional[LifecyclePublisher] = None
        self._pub_status: Optional[LifecyclePublisher] = None
        self._pub_human_poses: Optional[LifecyclePublisher] = None
        self._watchdog_timer: Optional[Any] = None

    def on_configure(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Configuring YoloPerceptionNode...")
        engine_path = str(self.get_parameter("engine_path").value)
        publish_mode = str(self.get_parameter("publish_mode").value).lower()

        if not os.path.exists(engine_path):
            fallback_engine = "/workspace/data/ml_models/yolov8x_fp16.engine"
            if os.path.exists(fallback_engine):
                self.get_logger().warn(
                    f"Specified engine '{engine_path}' not found on disk. "
                    f"Falling back to existing compiled engine: '{fallback_engine}'"
                )
                engine_path = fallback_engine
            else:
                self.get_logger().error(f"TensorRT engine not found at: {engine_path}")
                return TransitionCallbackReturn.FAILURE

        # Load TensorRT Engine
        self.get_logger().info(f"Deserializing TensorRT 10.3 Engine: {engine_path}")
        logger = trt.Logger(trt.Logger.WARNING)
        runtime = trt.Runtime(logger)
        with open(engine_path, "rb") as f:
            self._engine = runtime.deserialize_cuda_engine(f.read())

        if self._engine is None:
            self.get_logger().error("Failed to deserialize TensorRT engine!")
            return TransitionCallbackReturn.FAILURE

        self._trt_context = self._engine.create_execution_context()

        # Dynamically determine output tensor shape from deserialized engine
        try:
            detected_shape = tuple(self._engine.get_tensor_shape("output0"))
            if any(dim > 0 for dim in detected_shape):
                self._output_shape = detected_shape
                self._output_size = int(np.prod(self._output_shape) * 4)
                self.get_logger().info(f"Dynamically detected output tensor shape: {self._output_shape} ({self._output_size} bytes)")
        except Exception as e:
            self.get_logger().warn(f"Failed to query output tensor shape dynamically, using default {self._output_shape}: {e}")

        # Allocate CUDA device buffers
        d_in = ctypes.c_void_p()
        d_out = ctypes.c_void_p()
        stream = ctypes.c_void_p()

        _cudaMalloc(ctypes.byref(d_in), self._input_size)
        _cudaMalloc(ctypes.byref(d_out), self._output_size)
        _cudaStreamCreate(ctypes.byref(stream))

        self._d_input = d_in
        self._d_output = d_out
        self._stream = stream

        # Configure QoS
        qos_pub = QoSProfile(
            reliability=QoSReliabilityPolicy.RELIABLE,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=5,
        )
        qos_sensor = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            durability=QoSDurabilityPolicy.VOLATILE,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=1,
        )

        # Enforce BENCH_SENSOR_SIMULATION_ISOLATION.md routing
        if publish_mode == "bench":
            objects_topic = "/bench_perception/objects"
            debug_topic = "/bench_perception/camera/debug_image"
            status_topic = "/bench_perception/status"
            poses_topic = "/bench_perception/human_poses"
            self.get_logger().info("ISOLATION ACTIVE: Bench Mode -> Publishing to /bench_perception/*")
        else:
            objects_topic = "/perception/object_recognition/detection/objects"
            debug_topic = "/perception/camera/debug_image"
            status_topic = "/perception/status"
            poses_topic = "/perception/human_poses"
            self.get_logger().info("VEHICLE MODE: Publishing to Autoware autonomous stack")

        self._pub_objects = self.create_lifecycle_publisher(DetectedObjects, objects_topic, qos_pub)
        self._pub_debug_img = self.create_lifecycle_publisher(Image, debug_topic, qos_sensor)
        self._pub_status = self.create_lifecycle_publisher(String, status_topic, qos_pub)
        self._pub_human_poses = self.create_lifecycle_publisher(String, poses_topic, qos_pub)

        # Configure RTMPose-s engine if enabled
        enable_pose = bool(self.get_parameter("enable_pose_estimation").value)
        pose_engine_path = str(self.get_parameter("pose_engine_path").value)
        if enable_pose and os.path.exists(pose_engine_path):
            self.get_logger().info(f"Deserializing RTMPose-s FP16 Engine: {pose_engine_path}")
            try:
                with open(pose_engine_path, "rb") as f:
                    self._pose_engine = runtime.deserialize_cuda_engine(f.read())
                if self._pose_engine is not None:
                    self._pose_context = self._pose_engine.create_execution_context()
                    d_p_in = ctypes.c_void_p()
                    d_p_out_x = ctypes.c_void_p()
                    d_p_out_y = ctypes.c_void_p()
                    _cudaMalloc(ctypes.byref(d_p_in), self._pose_in_size)
                    _cudaMalloc(ctypes.byref(d_p_out_x), self._pose_out_x_size)
                    _cudaMalloc(ctypes.byref(d_p_out_y), self._pose_out_y_size)
                    self._d_pose_in = d_p_in
                    self._d_pose_out_x = d_p_out_x
                    self._d_pose_out_y = d_p_out_y
                    self.get_logger().info("RTMPose-s Engine & CUDA buffers ready (17 COCO joints, ~1.4 ms).")
            except Exception as e:
                self.get_logger().warn(f"Could not initialize RTMPose-s engine: {e}")

        # Subscriptions
        color_topic = str(self.get_parameter("input_image_topic").value)
        depth_topic = str(self.get_parameter("input_depth_topic").value)
        self._sub_color = self.create_subscription(Image, color_topic, self._on_color_image, qos_sensor)
        self._sub_depth = self.create_subscription(Image, depth_topic, self._on_depth_image, qos_sensor)

        self.get_logger().info("YoloPerceptionNode successfully configured.")
        return TransitionCallbackReturn.SUCCESS

    def on_activate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Activating YoloPerceptionNode...")
        try:
            if self._pub_objects:
                self._pub_objects.on_activate(state)
            if self._pub_debug_img:
                self._pub_debug_img.on_activate(state)
            if self._pub_status:
                self._pub_status.on_activate(state)
            if self._pub_human_poses:
                self._pub_human_poses.on_activate(state)
        except TypeError:
            if self._pub_objects:
                self._pub_objects.on_activate()
            if self._pub_debug_img:
                self._pub_debug_img.on_activate()
            if self._pub_status:
                self._pub_status.on_activate()
            if self._pub_human_poses:
                self._pub_human_poses.on_activate()

        # Watchdog timer to ensure fail-closed behavior on stream loss
        self._watchdog_timer = self.create_timer(0.2, self._check_watchdog)
        return super().on_activate(state)

    def on_deactivate(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Deactivating YoloPerceptionNode...")
        if self._watchdog_timer:
            self._watchdog_timer.cancel()
            self._watchdog_timer = None
        try:
            if self._pub_objects:
                self._pub_objects.on_deactivate(state)
            if self._pub_debug_img:
                self._pub_debug_img.on_deactivate(state)
            if self._pub_status:
                self._pub_status.on_deactivate(state)
            if self._pub_human_poses:
                self._pub_human_poses.on_deactivate(state)
        except TypeError:
            if self._pub_objects:
                self._pub_objects.on_deactivate()
            if self._pub_debug_img:
                self._pub_debug_img.on_deactivate()
            if self._pub_status:
                self._pub_status.on_deactivate()
            if self._pub_human_poses:
                self._pub_human_poses.on_deactivate()
        return super().on_deactivate(state)

    def on_cleanup(self, state: LifecycleState) -> TransitionCallbackReturn:
        self.get_logger().info("Cleaning up YoloPerceptionNode CUDA resources...")
        if self._d_input and self._d_input.value:
            _cudaFree(self._d_input)
            self._d_input = None
        if self._d_output and self._d_output.value:
            _cudaFree(self._d_output)
            self._d_output = None
        if self._d_pose_in and self._d_pose_in.value:
            _cudaFree(self._d_pose_in)
            self._d_pose_in = None
        if self._d_pose_out_x and self._d_pose_out_x.value:
            _cudaFree(self._d_pose_out_x)
            self._d_pose_out_x = None
        if self._d_pose_out_y and self._d_pose_out_y.value:
            _cudaFree(self._d_pose_out_y)
            self._d_pose_out_y = None
        if self._stream and self._stream.value:
            _cudaStreamDestroy(self._stream)
            self._stream = None
        self._trt_context = None
        self._engine = None
        self._pose_context = None
        self._pose_engine = None
        return super().on_cleanup(state)

    def _on_depth_image(self, msg: Image) -> None:
        """Cache incoming depth frame for metric distance estimation."""
        if msg.width == 0 or msg.height == 0:
            return
        try:
            self._last_depth_frame = np.frombuffer(msg.data, dtype=np.float32).reshape((msg.height, msg.width))
            self._last_depth_time = time.time()
        except Exception:
            self._last_depth_frame = None

    def _on_color_image(self, msg: Image) -> None:
        """Run YOLO inference and emit DetectedObjects in vehicle base_link."""
        if not self._pub_objects or not self._pub_objects.is_activated:
            return

        self._last_image_time = time.time()
        t_start = time.time()

        try:
            # Decode image
            raw = np.frombuffer(msg.data, dtype=np.uint8)
            channels = 4 if ("8UC4" in msg.encoding or "bgra" in msg.encoding or "rgba" in msg.encoding) else 3
            img = raw.reshape((msg.height, msg.width, channels))[:, :, :3]
            if "rgb" in msg.encoding.lower():
                bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            else:
                bgr = img

            # Preprocessing: Letterbox resize to 640x640
            h_orig, w_orig = bgr.shape[:2]
            padded, ratio, (pad_w, pad_h) = letterbox(bgr, (640, 640))
            rgb = cv2.cvtColor(padded, cv2.COLOR_BGR2RGB)
            blob = rgb.astype(np.float32) / 255.0
            blob = np.transpose(blob, (2, 0, 1))
            blob = np.expand_dims(blob, axis=0)
            blob = np.ascontiguousarray(blob)

            # Copy H2D
            _cudaMemcpyAsync(self._d_input, blob.ctypes.data_as(ctypes.c_void_p), self._input_size, CUDA_MEMCPY_H2D, self._stream)

            # Execute TRT
            self._trt_context.set_input_shape("images", (1, 3, 640, 640))
            self._trt_context.set_tensor_address("images", self._d_input.value)
            self._trt_context.set_tensor_address("output0", self._d_output.value)
            self._trt_context.execute_async_v3(self._stream.value)

            # Copy D2H
            h_output = np.empty(self._output_shape, dtype=np.float32)
            _cudaMemcpyAsync(h_output.ctypes.data_as(ctypes.c_void_p), self._d_output, self._output_size, CUDA_MEMCPY_D2H, self._stream)
            _cudaStreamSynchronize(self._stream)
            self._last_infer_ms = (time.time() - t_start) * 1000.0

            # Postprocess: dynamically handle YOLO26x (1, 300, 6) vs YOLOv8x (1, 84, 8400)
            det_boxes: List[List[int]] = []
            final_confidences: List[float] = []
            final_class_ids: List[int] = []

            conf_thresh = float(self.get_parameter("confidence_threshold").value)
            nms_thresh = float(self.get_parameter("nms_threshold").value)

            if len(self._output_shape) == 3 and self._output_shape[-1] == 6:
                # YOLO26x end-to-end NMS-free direct predictions: [x1, y1, x2, y2, score, class_id]
                preds = h_output[0]  # shape: (N, 6)
                for i in range(len(preds)):
                    score = float(preds[i, 4])
                    if score < conf_thresh or not np.isfinite(score):
                        continue
                    px1 = float(preds[i, 0])
                    py1 = float(preds[i, 1])
                    px2 = float(preds[i, 2])
                    py2 = float(preds[i, 3])
                    cid = int(preds[i, 5])

                    x1 = (px1 - pad_w) / ratio
                    y1 = (py1 - pad_h) / ratio
                    x2 = (px2 - pad_w) / ratio
                    y2 = (py2 - pad_h) / ratio
                    x1 = max(0.0, min(float(w_orig), x1))
                    y1 = max(0.0, min(float(h_orig), y1))
                    x2 = max(0.0, min(float(w_orig), x2))
                    y2 = max(0.0, min(float(h_orig), y2))
                    bw = max(0.0, x2 - x1)
                    bh = max(0.0, y2 - y1)

                    det_boxes.append([int(x1), int(y1), int(bw), int(bh)])
                    final_confidences.append(score)
                    final_class_ids.append(cid)
                indices = list(range(len(det_boxes)))
            else:
                # Standard YOLOv8x: output shape (1, 84, 8400)
                preds = np.transpose(h_output[0], (1, 0))
                boxes = preds[:, :4]
                scores = preds[:, 4:]

                raw_class_ids = np.argmax(scores, axis=1)
                raw_confidences = np.max(scores, axis=1)
                conf_mask = raw_confidences >= conf_thresh

                boxes = boxes[conf_mask]
                raw_class_ids = raw_class_ids[conf_mask]
                raw_confidences = raw_confidences[conf_mask]

                for i in range(len(boxes)):
                    cx, cy, bw, bh = boxes[i]
                    x1 = (cx - bw / 2.0 - pad_w) / ratio
                    y1 = (cy - bh / 2.0 - pad_h) / ratio
                    x2 = (cx + bw / 2.0 - pad_w) / ratio
                    y2 = (cy + bh / 2.0 - pad_h) / ratio
                    x1 = max(0.0, min(float(w_orig), x1))
                    y1 = max(0.0, min(float(h_orig), y1))
                    x2 = max(0.0, min(float(w_orig), x2))
                    y2 = max(0.0, min(float(h_orig), y2))
                    det_boxes.append([int(x1), int(y1), int(x2 - x1), int(y2 - y1)])
                    final_confidences.append(float(raw_confidences[i]))
                    final_class_ids.append(int(raw_class_ids[i]))

                indices_arr = cv2.dnn.NMSBoxes(det_boxes, final_confidences, conf_thresh, nms_thresh)
                indices = indices_arr.flatten().tolist() if len(indices_arr) > 0 else []

            # Construct Autoware DetectedObjects message
            out_msg = DetectedObjects()
            out_msg.header = Header()
            out_msg.header.stamp = msg.header.stamp if msg.header.stamp.sec != 0 else self.get_clock().now().to_msg()
            out_msg.header.frame_id = "base_link"

            annotated_bgr = bgr.copy() if self.get_parameter("publish_debug_image").value else None
            detected_classes_summary: Dict[str, int] = {}
            human_poses_list: List[Dict[str, Any]] = []

            if len(indices) > 0:
                for idx in indices:
                    bx, by, bw, bh = det_boxes[idx]
                    cls_id = int(final_class_ids[idx])
                    conf = float(final_confidences[idx])
                    coco_label = COCO_CLASSES[cls_id] if cls_id < len(COCO_CLASSES) else f"class_{cls_id}"
                    detected_classes_summary[coco_label] = detected_classes_summary.get(coco_label, 0) + 1

                    # Map COCO to Autoware ObjectClassification
                    autoware_class = ObjectClassification.UNKNOWN
                    if coco_label == "person":
                        autoware_class = ObjectClassification.PEDESTRIAN
                    elif coco_label == "bicycle":
                        autoware_class = ObjectClassification.BICYCLE
                    elif coco_label == "motorcycle":
                        autoware_class = ObjectClassification.MOTORCYCLE
                    elif coco_label == "car":
                        autoware_class = ObjectClassification.CAR
                    elif coco_label in ("truck", "bus"):
                        autoware_class = ObjectClassification.TRUCK

                    # Estimate 3D distance from depth map if available
                    est_z = 3.5  # default forward distance estimate
                    if self._last_depth_frame is not None:
                        # Sample center region of bounding box
                        cx_int = max(0, min(self._last_depth_frame.shape[1] - 1, int(bx + bw / 2.0)))
                        cy_int = max(0, min(self._last_depth_frame.shape[0] - 1, int(by + bh / 2.0)))
                        depth_val = float(self._last_depth_frame[cy_int, cx_int])
                        if 0.4 < depth_val < 8.0 and np.isfinite(depth_val):
                            est_z = depth_val

                    # Calculate metric base_link coordinates (camera mount: x=1.2m, y=0.0m, z=1.0m)
                    # base_link: +X fwd, +Y left, +Z up
                    x_norm = ((bx + bw / 2.0) - (w_orig / 2.0)) / (w_orig / 2.0)
                    y_base = -float(x_norm * est_z * 0.5)
                    x_base = float(est_z + 1.20)
                    z_base = 0.90

                    det_obj = DetectedObject()
                    det_obj.existence_probability = conf
                    classification = ObjectClassification()
                    classification.label = autoware_class
                    classification.probability = conf
                    det_obj.classification = [classification]

                    kinematics = DetectedObjectKinematics()
                    kinematics.pose_with_covariance.pose.position = Point(x=x_base, y=y_base, z=z_base)
                    kinematics.pose_with_covariance.pose.orientation = Quaternion(x=0.0, y=0.0, z=0.0, w=1.0)
                    det_obj.kinematics = kinematics

                    shape = Shape()
                    shape.type = Shape.BOUNDING_BOX
                    shape.dimensions = Vector3(x=0.8, y=0.8, z=1.7) if autoware_class == ObjectClassification.PEDESTRIAN else Vector3(x=1.8, y=1.5, z=1.5)
                    det_obj.shape = shape
                    out_msg.objects.append(det_obj)

                    # Top-Down RTMPose-s Pose Estimation Branch for Pedestrians
                    posture_str = "STANDING"
                    is_seated = False
                    keypoints_dict: Dict[str, Dict[str, float]] = {}

                    if autoware_class == ObjectClassification.PEDESTRIAN and self._pose_context is not None and bw > 15 and bh > 20:
                        try:
                            crop, inv_trans = crop_and_pad(bgr, (bx, by, bx + bw, by + bh), (192, 256))
                            crop_rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB).astype(np.float32)
                            crop_mean = np.array([123.675, 116.28, 103.53], dtype=np.float32)
                            crop_std = np.array([58.395, 57.12, 57.375], dtype=np.float32)
                            crop_norm = (crop_rgb - crop_mean) / crop_std
                            crop_chw = np.transpose(crop_norm, (2, 0, 1))[None, ...]
                            crop_blob = np.ascontiguousarray(crop_chw, dtype=np.float32)

                            _cudaMemcpyAsync(self._d_pose_in, crop_blob.ctypes.data_as(ctypes.c_void_p), self._pose_in_size, CUDA_MEMCPY_H2D, self._stream)
                            self._pose_context.set_tensor_address("input", self._d_pose_in.value)
                            self._pose_context.set_tensor_address("simcc_x", self._d_pose_out_x.value)
                            self._pose_context.set_tensor_address("simcc_y", self._d_pose_out_y.value)
                            self._pose_context.execute_async_v3(self._stream.value)

                            h_p_out_x = np.empty((1, 17, 384), dtype=np.float32)
                            h_p_out_y = np.empty((1, 17, 512), dtype=np.float32)
                            _cudaMemcpyAsync(h_p_out_x.ctypes.data_as(ctypes.c_void_p), self._d_pose_out_x, self._pose_out_x_size, CUDA_MEMCPY_D2H, self._stream)
                            _cudaMemcpyAsync(h_p_out_y.ctypes.data_as(ctypes.c_void_p), self._d_pose_out_y, self._pose_out_y_size, CUDA_MEMCPY_D2H, self._stream)
                            _cudaStreamSynchronize(self._stream)

                            kpts_list: List[Tuple[int, int]] = []
                            for k in range(17):
                                kx_sub = float(np.argmax(h_p_out_x[0, k, :]) / 2.0)
                                ky_sub = float(np.argmax(h_p_out_y[0, k, :]) / 2.0)
                                orig_pt = inv_trans @ np.array([kx_sub, ky_sub, 1.0])
                                px_orig = int(orig_pt[0])
                                py_orig = int(orig_pt[1])
                                kpts_list.append((px_orig, py_orig))
                                keypoints_dict[COCO_KEYPOINTS[k]] = {"x": round(float(px_orig), 1), "y": round(float(py_orig), 1)}

                            # Seated analysis (vertical thigh span relative to box height)
                            hip_y = (kpts_list[11][1] + kpts_list[12][1]) / 2.0
                            knee_y = (kpts_list[13][1] + kpts_list[14][1]) / 2.0
                            thigh_dy = abs(knee_y - hip_y)
                            is_seated = (thigh_dy / max(1.0, float(bh))) < 0.35
                            posture_str = "SEATED" if is_seated else "STANDING"

                            # Draw skeleton on debug frame
                            if annotated_bgr is not None:
                                for (p1, p2) in SKELETON_EDGES:
                                    cv2.line(annotated_bgr, kpts_list[p1], kpts_list[p2], (0, 220, 255), 2)
                                for pt in kpts_list:
                                    cv2.circle(annotated_bgr, pt, 3, (0, 255, 255), -1)
                        except Exception as pe:
                            self.get_logger().warn(f"RTMPose inference error: {pe}")

                        human_poses_list.append({
                            "id": f"ped_{len(out_msg.objects)-1}",
                            "x_base": round(x_base, 2),
                            "y_base": round(y_base, 2),
                            "z_base": round(z_base, 2),
                            "posture": posture_str,
                            "is_seated": is_seated,
                            "confidence": round(conf, 2),
                            "keypoints": keypoints_dict,
                        })

                    # Annotate debug visualization
                    if annotated_bgr is not None:
                        color = (0, 255, 0) if autoware_class == ObjectClassification.PEDESTRIAN else (255, 165, 0)
                        cv2.rectangle(annotated_bgr, (bx, by), (bx + bw, by + bh), color, 2)
                        tag = f"PERSON: {posture_str}" if autoware_class == ObjectClassification.PEDESTRIAN else coco_label.upper()
                        caption = f"{tag} {conf*100:.0f}% ({est_z:.1f}m)"
                        cv2.putText(annotated_bgr, caption, (bx, max(22, by - 8)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

            self._pub_objects.publish(out_msg)

            # Publish human skeletal poses if any pedestrians were tracked
            if self._pub_human_poses and self._pub_human_poses.is_activated and len(human_poses_list) > 0:
                poses_payload = {
                    "timestamp": time.time(),
                    "count": len(human_poses_list),
                    "poses": human_poses_list,
                }
                self._pub_human_poses.publish(String(data=json.dumps(poses_payload)))

            # Publish debug image
            if annotated_bgr is not None and self._pub_debug_img and self._pub_debug_img.is_activated:
                debug_msg = self._bridge.cv2_to_imgmsg(annotated_bgr, encoding="bgr8")
                debug_msg.header = out_msg.header
                self._pub_debug_img.publish(debug_msg)

            # Publish telemetry status
            if self._pub_status and self._pub_status.is_activated:
                status_dict = {
                    "node": "yolo_perception_node",
                    "mode": "CAMERA_YOLO_TENSORRT",
                    "infer_ms": round(self._last_infer_ms, 2),
                    "latency_ms": round(self._last_infer_ms, 2),
                    "fps": round(1000.0 / max(1.0, self._last_infer_ms), 1),
                    "object_count": len(out_msg.objects),
                    "objects_detected": len(out_msg.objects),
                    "camera_online": True,
                    "camera_connected": True,
                    "summary": detected_classes_summary,
                    "timestamp": time.time(),
                }
                status_msg = String(data=json.dumps(status_dict))
                self._pub_status.publish(status_msg)

        except Exception as e:
            self.get_logger().error(f"Error in YOLO inference loop: {e}")

    def _check_watchdog(self) -> None:
        """Fail-closed watchdog: emit empty objects if camera freezes."""
        if not self._pub_objects or not self._pub_objects.is_activated:
            return

        timeout = float(self.get_parameter("sensor_timeout_sec").value)
        if (time.time() - self._last_image_time) > timeout and self._last_image_time > 0.0:
            # Camera timed out -> publish clean 0-object message to clear stale detections
            empty_msg = DetectedObjects()
            empty_msg.header.stamp = self.get_clock().now().to_msg()
            empty_msg.header.frame_id = "base_link"
            self._pub_objects.publish(empty_msg)


def main(args: Optional[List[str]] = None) -> None:
    rclpy.init(args=args)
    node = YoloPerceptionNode()
    auto_start = node.get_parameter("auto_start").value
    if auto_start in (True, "true", "True", "1", 1):
        node.get_logger().info("auto_start enabled -> Transitioning to CONFIGURE and ACTIVATE...")
        node.trigger_configure()
        node.trigger_activate()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == "__main__":
    main()
