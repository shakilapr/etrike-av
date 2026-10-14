"""Meta Momentum Human Rig (MHR) inference engine for the AV cockpit.

Loads the official MHR TorchScript model (``mhr_model.pt``) and evaluates a posed
skinned mesh + skeleton from MHR model parameters. The engine is intentionally
fail-closed: if PyTorch or the model assets are unavailable, ``available`` stays
``False`` and every evaluation is a no-op, so the cockpit falls back to its
procedural pedestrian mesh.

MHR is Apache-2.0 licensed (https://github.com/facebookresearch/MHR).
The parameter/skinning API mirrors the official MHR ``web-viewer/server.py``.

Vertices are returned by the model in centimetres; this module converts to metres
before exposing them to the rest of the system.
"""

from __future__ import annotations

import os
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

try:  # PyTorch is an optional, heavy dependency.
    import torch
    from torch import Tensor

    _TORCH_IMPORT_ERROR: Optional[str] = None
except Exception as exc:  # pragma: no cover - exercised only without torch
    torch = None  # type: ignore[assignment]
    Tensor = Any  # type: ignore[assignment,misc]
    _TORCH_IMPORT_ERROR = str(exc)


CM_TO_M = 0.01
NUM_FACE_EXPRESSION_BLENDSHAPES = 72
DEFAULT_MODEL_ENV = "MHR_MODEL_PATH"


@dataclass
class MhrSnapshot:
    """One evaluated MHR frame in metres."""

    vertices: np.ndarray  # (N, 3) float32, metres, Y-up
    joints: np.ndarray  # (J, 3) float32, metres, Y-up
    revision: int
    inference_ms: float


@dataclass
class MhrTopology:
    """Static MHR mesh topology and rest skeleton metadata."""

    faces: np.ndarray  # (M, 3) uint32
    joint_names: List[str] = field(default_factory=list)
    joint_parents: List[int] = field(default_factory=list)
    rest_joints: np.ndarray = field(default_factory=lambda: np.zeros((0, 3), np.float32))


class MhrEngine:
    """Thread-safe MHR TorchScript wrapper with graceful degradation."""

    def __init__(self, model_path: Optional[Path] = None) -> None:
        self._lock = threading.RLock()
        self._model: Any = None
        self._available = False
        self._reason = "not initialised"

        self._pose_names: List[str] = []
        self._pose_limits: np.ndarray = np.zeros((0, 2), np.float32)
        self._identity_count = 0
        self._num_model_params = 0

        self._topology = MhrTopology(faces=np.zeros((0, 3), np.uint32))
        self._revision = 0
        self._rest_pose = np.zeros(0, np.float32)

        path = model_path or _default_model_path()
        if path is None:
            self._reason = "MHR_MODEL_PATH not set and no default asset found"
            return
        if not path.is_file():
            self._reason = f"MHR model not found at {path}"
            return
        if torch is None:
            self._reason = f"PyTorch unavailable: {_TORCH_IMPORT_ERROR}"
            return

        try:
            self._load(path)
            self._available = True
            self._reason = "ok"
        except Exception as exc:  # pragma: no cover - depends on real assets
            self._available = False
            self._reason = f"failed to load MHR model: {exc}"

    # ------------------------------------------------------------------ state

    @property
    def available(self) -> bool:
        return self._available

    @property
    def reason(self) -> str:
        return self._reason

    @property
    def num_model_params(self) -> int:
        return self._num_model_params

    @property
    def pose_parameter_names(self) -> List[str]:
        return list(self._pose_names)

    # ------------------------------------------------------------------- load

    def _load(self, path: Path) -> None:
        assert torch is not None
        model = torch.jit.load(str(path), map_location="cpu").eval()
        self._model = model

        self._identity_count = int(model.get_num_identity_blendshapes())
        all_names = list(model.get_parameter_names())
        self._pose_names = all_names[: -self._identity_count]
        self._num_model_params = len(self._pose_names)

        limits = model.get_parameter_limits().detach().cpu().numpy().astype(np.float32)
        self._pose_limits = limits[: self._num_model_params]

        faces = (
            model.character_torch.mesh.faces.detach().cpu().numpy().astype(np.uint32)
        )
        joint_names = list(model.get_joint_names())
        joint_parents = [
            int(v) for v in model.character_torch.skeleton.joint_parents
        ]
        self._topology = MhrTopology(
            faces=faces,
            joint_names=joint_names,
            joint_parents=joint_parents,
        )

        # Rest pose skeleton (zeros = rest parameters).
        self._rest_pose = np.zeros(self._num_model_params, dtype=np.float32)
        snapshot = self._evaluate_locked(self._rest_pose)
        self._topology.rest_joints = snapshot.joints

    # --------------------------------------------------------------- evaluate

    def evaluate(self, model_parameters: np.ndarray) -> Optional[MhrSnapshot]:
        """Evaluate ``model_parameters`` (length == num_model_params) -> snapshot."""

        if not self._available:
            return None
        with self._lock:
            return self._evaluate_locked(model_parameters)

    def _evaluate_locked(self, model_parameters: np.ndarray) -> MhrSnapshot:
        assert torch is not None and self._model is not None

        params = np.asarray(model_parameters, dtype=np.float32).reshape(1, -1)
        if params.shape[1] < self._num_model_params:
            padded = np.zeros((1, self._num_model_params), dtype=np.float32)
            padded[:, : params.shape[1]] = params
            params = padded
        elif params.shape[1] > self._num_model_params:
            params = params[:, : self._num_model_params]
        params = np.clip(params, self._pose_limits[:, 0], self._pose_limits[:, 1])

        identity = np.zeros((1, self._identity_count), dtype=np.float32)
        expression = np.zeros((1, NUM_FACE_EXPRESSION_BLENDSHAPES), dtype=np.float32)

        started = time.perf_counter()
        with torch.inference_mode():
            vertices, skeleton = self._model(
                identity_coeffs=torch.from_numpy(identity),
                model_parameters=torch.from_numpy(params),
                face_expr_coeffs=torch.from_numpy(expression),
                apply_correctives=True,
            )
        vertices_m = vertices[0].detach().cpu().numpy().astype(np.float32) * CM_TO_M
        joints_m = skeleton[0, :, :3].detach().cpu().numpy().astype(np.float32) * CM_TO_M
        elapsed_ms = (time.perf_counter() - started) * 1000.0

        self._revision += 1
        return MhrSnapshot(
            vertices=vertices_m,
            joints=joints_m,
            revision=self._revision,
            inference_ms=elapsed_ms,
        )

    # --------------------------------------------------------------- metadata

    def topology(self) -> MhrTopology:
        return self._topology

    def describe(self) -> Dict[str, Any]:
        """Small diagnostic payload for the WebSocket / health endpoint."""

        return {
            "available": self._available,
            "reason": self._reason,
            "num_model_params": self._num_model_params,
            "num_joints": len(self._topology.joint_names),
            "num_faces": int(self._topology.faces.shape[0]),
            "pose_parameter_names": self._pose_names,
        }


def _default_model_path() -> Optional[Path]:
    env = os.environ.get(DEFAULT_MODEL_ENV)
    if env:
        return Path(env)
    here = Path(__file__).resolve()
    for candidate in (
        here.parent / "data" / "mhr_assets" / "mhr_model.pt",
        here.parents[2] / "data" / "mhr_assets" / "mhr_model.pt",
    ):
        if candidate.is_file():
            return candidate
    return None
