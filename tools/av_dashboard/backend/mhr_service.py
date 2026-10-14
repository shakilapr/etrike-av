"""MHR service: bridges cockpit human poses to streamed MHR mesh buffers.

Owns the MHR engine + keypoint mapper, evaluates at a bounded rate, and produces
a compact JSON/Base64 payload consumed by the Three.js cockpit. Everything is
optional: when MHR assets are unavailable the payload reports ``available: False``
and the cockpit keeps its procedural pedestrian mesh.
"""

from __future__ import annotations

import base64
import threading
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np

from tools.av_dashboard.backend.mhr_engine import MhrEngine
from tools.av_dashboard.backend.mhr_pose_mapper import MhrPoseMapper

DEFAULT_MAX_ACTORS = 2
DEFAULT_MIN_INTERVAL_SEC = 1.0 / 12.0  # ~12 Hz evaluation cap


def _encode_f32(array: np.ndarray) -> str:
    return base64.b64encode(np.ascontiguousarray(array, dtype="<f4").tobytes()).decode("ascii")


class MhrService:
    """Thread-safe MHR evaluation + payload builder."""

    def __init__(
        self,
        model_path: Optional[Path] = None,
        max_actors: int = DEFAULT_MAX_ACTORS,
        min_interval_sec: float = DEFAULT_MIN_INTERVAL_SEC,
    ) -> None:
        self._lock = threading.RLock()
        self._engine = MhrEngine(model_path)
        self._mapper: Optional[MhrPoseMapper] = None
        self._max_actors = max(0, int(max_actors))
        self._min_interval = max(0.0, float(min_interval_sec))
        self._last_eval = 0.0
        self._hz = 0.0
        self._last_payload: Dict[str, Any] = self._unavailable_payload()

        if self._engine.available:
            self._mapper = MhrPoseMapper(
                pose_parameter_names=self._engine.pose_parameter_names,
                joint_names=self._engine.topology().joint_names,
            )

    # ------------------------------------------------------------------ state

    @property
    def available(self) -> bool:
        return self._engine.available and self._mapper is not None

    @property
    def reason(self) -> str:
        if not self._engine.available:
            return self._engine.reason
        if self._mapper is None or not self._mapper.is_calibrated():
            return "MHR loaded but no joint channels matched the parameter layout"
        return "ok"

    def describe(self) -> Dict[str, Any]:
        info = self._engine.describe()
        info["reason"] = self.reason
        info["mapper_calibrated"] = bool(self._mapper and self._mapper.is_calibrated())
        info["max_actors"] = self._max_actors
        return info

    # --------------------------------------------------------------- topology

    def topology_payload(self) -> bytes:
        """Packed little-endian uint32 triangle indices (M, 3)."""

        faces = self._engine.topology().faces
        return np.ascontiguousarray(faces, dtype="<u4").tobytes()

    def topology_meta(self) -> Dict[str, Any]:
        topo = self._engine.topology()
        return {
            "available": self._engine.available,
            "face_count": int(topo.faces.shape[0]),
            "joint_names": topo.joint_names,
            "joint_parents": topo.joint_parents,
            "rest_joints": topo.rest_joints.tolist(),
        }

    # --------------------------------------------------------------- evaluate

    def _unavailable_payload(self) -> Dict[str, Any]:
        return {
            "available": False,
            "reason": self._engine.reason,
            "hz": 0.0,
            "vertex_count": 0,
            "revision": 0,
            "actors": [],
        }

    def current_payload(self) -> Dict[str, Any]:
        with self._lock:
            if not self.available:
                return self._unavailable_payload()
            return self._last_payload

    def update(self, poses: List[Dict[str, Any]], now: Optional[float] = None) -> Dict[str, Any]:
        """Evaluate MHR for the nearest pedestrians and return the WS payload.

        ``poses`` is the cockpit ``human_poses`` list. Returns the cached payload
        when unavailable or when the evaluation interval has not elapsed.
        """

        now = now if now is not None else time.time()
        with self._lock:
            if not self.available or self._mapper is None:
                return self._unavailable_payload()
            if (now - self._last_eval) < self._min_interval:
                return self._last_payload
            self._last_eval = now

            engine = self._engine
            selected = self._select_actors(poses)
            actors: List[Dict[str, Any]] = []
            revision = 0
            vertex_count = 0
            started = time.perf_counter()
            for pose in selected:
                params = self._mapper.map_pose(pose)
                snapshot = engine.evaluate(params)
                if snapshot is None:
                    continue
                vertex_count = int(snapshot.vertices.shape[0])
                actors.append(
                    {
                        "id": str(pose.get("id", "")),
                        "vertices": _encode_f32(snapshot.vertices),
                        "joints": _encode_f32(snapshot.joints),
                    }
                )
                revision = snapshot.revision

            elapsed = max(1e-6, time.perf_counter() - started)
            self._hz = len(actors) / elapsed if actors else 0.0
            payload: Dict[str, Any] = {
                "available": True,
                "reason": "ok",
                "hz": round(self._hz, 1),
                "vertex_count": vertex_count,
                "revision": revision,
                "actors": actors,
            }
            self._last_payload = payload
            return payload

    def _select_actors(self, poses: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Pick the nearest pedestrians (smallest ``est_z``) up to the actor cap."""

        if self._max_actors <= 0 or not poses:
            return []

        def depth(pose: Dict[str, Any]) -> float:
            try:
                return float(pose.get("est_z", 1e9))
            except (TypeError, ValueError):
                return 1e9

        ordered = sorted(poses, key=depth)
        return ordered[: self._max_actors]
