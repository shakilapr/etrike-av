"""Standalone self-test for the MHR cockpit sidecar.

Run on the machine that hosts the dashboard once the MHR assets are installed:

    set MHR_MODEL_PATH=C:\\path\\to\\mhr_model.pt
    python -m tools.av_dashboard.backend.mhr_selftest

It validates the engine (load, topology, rest + posed evaluation) and the
keypoint -> parameter mapper without starting the web server. Exits non-zero if
the engine is unavailable so it can be used in CI/ops checks.
"""

from __future__ import annotations

import sys

import numpy as np

from tools.av_dashboard.backend.mhr_engine import MhrEngine
from tools.av_dashboard.backend.mhr_pose_mapper import MhrPoseMapper

STANDING = {
    "is_seated": False,
    "is_truncated": False,
    "keypoints": {
        "nose": {"x": 320, "y": 120},
        "left_shoulder": {"x": 285, "y": 160},
        "right_shoulder": {"x": 355, "y": 160},
        "left_elbow": {"x": 283, "y": 210},
        "left_wrist": {"x": 281, "y": 260},
        "right_elbow": {"x": 357, "y": 210},
        "right_wrist": {"x": 359, "y": 260},
        "left_hip": {"x": 300, "y": 260},
        "right_hip": {"x": 340, "y": 260},
        "left_knee": {"x": 299, "y": 340},
        "right_knee": {"x": 341, "y": 340},
        "left_ankle": {"x": 298, "y": 420},
        "right_ankle": {"x": 342, "y": 420},
    },
}


def main() -> int:
    engine = MhrEngine()
    info = engine.describe()
    print(f"[MHR] available={info['available']} reason={info['reason']}")
    if not engine.available:
        print("[MHR] Self-test SKIPPED: install torch + assets (see requirements-mhr.txt).")
        return 1

    topo = engine.topology()
    print(f"[MHR] joints={len(topo.joint_names)} faces={topo.faces.shape[0]} "
          f"params={engine.num_model_params}")

    rest = engine.evaluate(np.zeros(engine.num_model_params, dtype=np.float32))
    assert rest is not None
    rest_height = float(rest.vertices[:, 1].max() - rest.vertices[:, 1].min())
    print(f"[MHR] rest bbox height={rest_height:.3f} m (expect ~1.4-2.1)")

    mapper = MhrPoseMapper(engine.pose_parameter_names, topo.joint_names)
    print(f"[MHR] mapper calibrated={mapper.is_calibrated()} channels={sorted(mapper.channels())}")

    params = mapper.map_pose(STANDING)
    posed = engine.evaluate(params)
    assert posed is not None
    posed_height = float(posed.vertices[:, 1].max() - posed.vertices[:, 1].min())
    print(f"[MHR] posed bbox height={posed_height:.3f} m, {posed.inference_ms:.1f} ms")

    ok = 1.0 < rest_height < 2.5 and rest.vertices.shape[1] == 3
    print("[MHR] Self-test PASS" if ok else "[MHR] Self-test FAIL")
    return 0 if ok else 2


if __name__ == "__main__":
    sys.exit(main())
