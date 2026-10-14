#!/usr/bin/env python3
# Copyright 2026 E-Trike Dev. All rights reserved.
"""Idempotent patch to replace cudaStreamGetDevice with cudaGetDevice for CUDA <= 12.6 on Jetson."""

import re
import sys
from pathlib import Path


def apply_patch(file_path: Path) -> bool:
    """Replaces cudaStreamGetDevice with cudaGetDevice for JetPack 6 / CUDA 12.6 compatibility."""
    if not file_path.is_file():
        print(f"ERROR: Target source file not found: {file_path}", file=sys.stderr)
        return False

    content: str = file_path.read_text(encoding="utf-8")

    override_tag = "/* {OVERRIDE: JetPack 6 CUDA 12.6 device query compatibility} */"
    if override_tag in content:
        print(f"[SKIP] {file_path.name} already patched with {override_tag}")
        return True

    target_pattern = r"CUDA_BLACKBOARD_CHECK_CUDA_ERROR\(cudaStreamGetDevice\(stream_,\s*&device_id\)\);"
    replacement = f"CUDA_BLACKBOARD_CHECK_CUDA_ERROR(cudaGetDevice(&device_id)); {override_tag}"

    if not re.search(target_pattern, content):
        print(f"ERROR: Target pattern not found in {file_path}", file=sys.stderr)
        return False

    updated_content = re.sub(target_pattern, replacement, content, count=1)
    file_path.write_text(updated_content, encoding="utf-8")

    # Verify
    verify_content = file_path.read_text(encoding="utf-8")
    if override_tag not in verify_content:
        print(f"ERROR: Verification failed after patching {file_path}", file=sys.stderr)
        return False

    print(f"[PATCH] Successfully patched cudaStreamGetDevice in {file_path.name}")
    return True


def main() -> int:
    script_dir = Path(__file__).resolve().parent
    default_target = (
        script_dir.parent
        / "autoware"
        / "src"
        / "universe"
        / "external"
        / "cuda_blackboard"
        / "src"
        / "cuda_mem_pool_context.cpp"
    )
    target_path = Path(sys.argv[1]) if len(sys.argv) > 1 else default_target
    success = apply_patch(target_path)
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
