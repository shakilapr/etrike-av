"""Map RTMPose-s (17 COCO) keypoints onto Meta Momentum Human Rig parameters.

The cockpit's YOLO26x perception node publishes, per pedestrian, 17 COCO
keypoints in image pixels plus a base_link position/yaw and a posture flag. MHR
expects a flat vector of model parameters (rotations about named joints, plus a
root translation/scale) rather than joint positions, so a keypoint -> joint-angle
solve is required.

This module provides a geometry-driven heuristic mapper. It extracts
scale-invariant joint angles from the keypoints (in the image plane) and writes
them into the MHR parameter vector at the indices discovered from the model's own
parameter names. The mapping is deliberately conservative and fail-soft:

* Unknown parameter layouts leave the rest pose untouched.
* Truncated lower bodies only drive the upper body.
* Seated actors get a fixed hip/knee flexion regardless of noisy ankle data.

The per-joint axis assignment and gain are exposed as constants so they can be
calibrated against the real model without touching the solver logic.
"""

from __future__ import annotations

import math
from typing import Dict, List, Optional, Sequence

import numpy as np

# MHR rotation parameters are radians. A small gain keeps reconstructions stable
# when keypoints are noisy; tune per joint against the real model.
DEFAULT_GAIN = 1.0
SEATED_HIP_FLEXION = math.radians(85.0)
SEATED_KNEE_FLEXION = math.radians(80.0)

# COCO indices (must match etrike_yolo_perception COCO_KEYPOINTS order).
NOSE = 0
L_EYE, R_EYE = 1, 2
L_EAR, R_EAR = 3, 4
L_SHOULDER, R_SHOULDER = 5, 6
L_ELBOW, R_ELBOW = 7, 8
L_WRIST, R_WRIST = 9, 10
L_HIP, R_HIP = 11, 12
L_KNEE, R_KNEE = 13, 14
L_ANKLE, R_ANKLE = 15, 16

COCO_ORDER: List[str] = [
    "nose", "left_eye", "right_eye", "left_ear", "right_ear",
    "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
    "left_wrist", "right_wrist", "left_hip", "right_hip",
    "left_knee", "right_knee", "left_ankle", "right_ankle",
]

# Parameter-name substrings -> joint channels we can drive. Ordered longest
# first so "l_lowarm" is matched before "l_arm"-style prefixes.
_JOINT_PREFIXES: Dict[str, str] = {
    "l_clavicle": "l_clavicle",
    "r_clavicle": "r_clavicle",
    "l_uparm": "l_shoulder",
    "r_uparm": "r_shoulder",
    "l_elbow": "l_elbow",
    "r_elbow": "r_elbow",
    "l_wrist": "l_wrist",
    "r_wrist": "r_wrist",
    "l_upleg": "l_hip",
    "r_upleg": "r_hip",
    "l_knee": "l_knee",
    "r_knee": "r_knee",
    "l_foot": "l_ankle",
    "r_foot": "r_ankle",
    "spine": "spine",
    "neck": "neck",
    "head": "head",
}


def keypoints_to_array(keypoints: Dict[str, Dict[str, float]]) -> np.ndarray:
    """Convert the node's ``{name: {x, y}}`` dict to a (17, 2) float array.

    Missing keypoints are filled with NaN so downstream angle extraction can
    reject them.
    """

    out = np.full((len(COCO_ORDER), 2), np.nan, dtype=np.float64)
    for idx, name in enumerate(COCO_ORDER):
        entry = keypoints.get(name)
        if not entry:
            continue
        x = entry.get("x")
        y = entry.get("y")
        if x is None or y is None:
            continue
        out[idx, 0] = float(x)
        out[idx, 1] = float(y)
    return out


def _angle_at(a: np.ndarray, b: np.ndarray, c: np.ndarray) -> Optional[float]:
    """Interior angle ABC in radians, or None if any point is missing."""

    if not (np.isfinite(a).all() and np.isfinite(b).all() and np.isfinite(c).all()):
        return None
    v1 = a - b
    v2 = c - b
    n1 = float(np.linalg.norm(v1))
    n2 = float(np.linalg.norm(v2))
    if n1 < 1e-6 or n2 < 1e-6:
        return None
    cosang = float(np.dot(v1, v2) / (n1 * n2))
    cosang = max(-1.0, min(1.0, cosang))
    return math.acos(cosang)


def _torso_scale(kpts: np.ndarray) -> float:
    """Robust torso length in pixels used to normalise angles/offsets."""

    candidates = [
        (L_SHOULDER, L_HIP),
        (R_SHOULDER, R_HIP),
        (NOSE, (L_HIP + R_HIP) / 2.0),
    ]
    lengths: List[float] = []
    for a, b in candidates:
        if np.isfinite(kpts[a]).all() and np.isfinite(kpts[b]).all():
            lengths.append(float(np.linalg.norm(kpts[a] - kpts[b])))
    if not lengths:
        return 1.0
    return float(np.median(lengths)) or 1.0


def _limb_channel_angles(kpts: np.ndarray, is_seated: bool) -> Dict[str, float]:
    """Compute signed flexion angles per channel from image-plane keypoints."""

    channels: Dict[str, float] = {}

    def interior(a: int, b: int, c: int) -> Optional[float]:
        angle = _angle_at(kpts[a], kpts[b], kpts[c])
        return angle if angle is not None else None

    # Elbows: shoulder-elbow-wrist (0 = straight, pi/2 = right angle).
    for side, (sh, el, wr) in (("l", (L_SHOULDER, L_ELBOW, L_WRIST)),
                                ("r", (R_SHOULDER, R_ELBOW, R_WRIST))):
        angle = interior(sh, el, wr)
        if angle is not None:
            channels[f"{side}_elbow"] = math.pi - angle  # deviation from straight

    # Shoulders: deviation of the upper arm from the natural arms-down rest
    # direction (image +y). A relaxed hanging arm yields ~0.
    down = np.array([0.0, 1.0])
    for side, (sh, el) in (("l", (L_SHOULDER, L_ELBOW)),
                            ("r", (R_SHOULDER, R_ELBOW))):
        if np.isfinite(kpts[sh]).all() and np.isfinite(kpts[el]).all():
            arm = kpts[el] - kpts[sh]
            channels[f"{side}_shoulder"] = _signed_angle(down, arm)

    # Legs: hip-knee-ankle. Seated actors get a fixed flexion when ankles are noisy.
    for side, (hip, knee, ankle) in (("l", (L_HIP, L_KNEE, L_ANKLE)),
                                      ("r", (R_HIP, R_KNEE, R_ANKLE))):
        angle = interior(hip, knee, ankle)
        observed_knee = (math.pi - angle) if angle is not None else 0.0
        if is_seated:
            channels[f"{side}_knee"] = max(observed_knee, SEATED_KNEE_FLEXION)
            channels[f"{side}_hip"] = SEATED_HIP_FLEXION
        else:
            if angle is not None:
                channels[f"{side}_knee"] = observed_knee
            if np.isfinite(kpts[hip]).all() and np.isfinite(kpts[knee]).all():
                down = np.array([0.0, 1.0])
                thigh = kpts[knee] - kpts[hip]
                channels[f"{side}_hip"] = _signed_angle(down, thigh)

    # Spine lean from shoulder-midpoint over hip-midpoint.
    if all(np.isfinite(kpts[i]).all() for i in (L_SHOULDER, R_SHOULDER, L_HIP, R_HIP)):
        sh_mid = (kpts[L_SHOULDER] + kpts[R_SHOULDER]) / 2.0
        hip_mid = (kpts[L_HIP] + kpts[R_HIP]) / 2.0
        up = np.array([0.0, -1.0])
        axis = sh_mid - hip_mid
        channels["spine"] = _signed_angle(up, axis) * 0.5

    # Neck/head: nose vs shoulder midpoint.
    if all(np.isfinite(kpts[i]).all() for i in (NOSE, L_SHOULDER, R_SHOULDER)):
        sh_mid = (kpts[L_SHOULDER] + kpts[R_SHOULDER]) / 2.0
        up = np.array([0.0, -1.0])
        head_vec = kpts[NOSE] - sh_mid
        channels["neck"] = _signed_angle(up, head_vec) * 0.5

    return channels


def _signed_angle(reference: np.ndarray, vector: np.ndarray) -> float:
    """Signed angle (radians) from ``reference`` to ``vector`` in the image plane."""

    n_ref = float(np.linalg.norm(reference))
    n_vec = float(np.linalg.norm(vector))
    if n_ref < 1e-6 or n_vec < 1e-6:
        return 0.0
    ref = reference / n_ref
    vec = vector / n_vec
    dot = max(-1.0, min(1.0, float(np.dot(ref, vec))))
    cross = float(ref[0] * vec[1] - ref[1] * vec[0])
    return math.atan2(cross, dot)


class MhrPoseMapper:
    """Builds MHR model-parameter vectors from cockpit pedestrian poses."""

    def __init__(
        self,
        pose_parameter_names: Sequence[str],
        joint_names: Sequence[str],
        gain: float = DEFAULT_GAIN,
    ) -> None:
        self._gain = float(gain)
        self._param_index: Dict[str, List[int]] = {}
        self._parameter_names = list(pose_parameter_names)
        self._joints = list(joint_names)
        self._build_index()

    def _build_index(self) -> None:
        for index, name in enumerate(self._parameter_names):
            lowered = name.lower()
            for prefix, channel in _JOINT_PREFIXES.items():
                if lowered.startswith(prefix):
                    self._param_index.setdefault(channel, []).append(index)
                    break

    def is_calibrated(self) -> bool:
        """True when at least one known joint channel was discovered."""

        return bool(self._param_index)

    def channels(self) -> Dict[str, List[int]]:
        """Discovered joint-channel -> MHR parameter index mapping (for diagnostics)."""

        return {channel: list(indices) for channel, indices in self._param_index.items()}

    def map_pose(self, pose: Dict[str, object]) -> np.ndarray:
        """Return an MHR parameter vector for one ``human_poses`` entry."""

        vector = np.zeros(len(self._parameter_names), dtype=np.float32)
        if not self._param_index:
            return vector

        keypoints = pose.get("keypoints") or {}
        if not isinstance(keypoints, dict):
            return vector
        kpts = keypoints_to_array(keypoints)  # type: ignore[arg-type]
        is_seated = bool(pose.get("is_seated", False))
        is_truncated = bool(pose.get("is_truncated", False))

        channels = _limb_channel_angles(kpts, is_seated)

        # Reject unreliable lower-body channels when the person is truncated.
        if is_truncated and not is_seated:
            for name in ("l_hip", "r_hip", "l_knee", "r_knee", "l_ankle", "r_ankle"):
                channels.pop(name, None)

        for channel, angle in channels.items():
            for index in self._param_index.get(channel, []):
                vector[index] = float(np.clip(angle * self._gain, -math.pi, math.pi))

        return vector

    def rest_pose(self) -> np.ndarray:
        return np.zeros(len(self._parameter_names), dtype=np.float32)
