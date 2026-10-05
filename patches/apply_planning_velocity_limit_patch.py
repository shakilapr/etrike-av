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

"""Idempotent patch to limit planning max_vel to 2.78 m/s (10.0 km/h) in common.param.yaml."""

import re
import sys
from pathlib import Path


def apply_velocity_limit(config_path: Path, target_speed: float = 2.78) -> bool:
    """Applies max_vel limit to common.param.yaml idempotently."""
    if not config_path.is_file():
        print(f"ERROR: Target config file not found: {config_path}", file=sys.stderr)
        return False

    content: str = config_path.read_text(encoding="utf-8")

    pattern: str = r"(max_vel:\s*)\d+(\.\d+)?"
    replacement: str = rf"\g<1>{target_speed:.2f}"

    match = re.search(pattern, content)
    if not match:
        print(f"ERROR: Could not find 'max_vel:' pattern in {config_path}", file=sys.stderr)
        return False

    current_val_str: str = match.group(0)
    expected_str: str = f"max_vel: {target_speed:.2f}"

    if expected_str in current_val_str:
        print(f"[SKIP] {config_path.name} already has {expected_str}")
        return True

    updated_content: str = re.sub(pattern, replacement, content, count=1)
    config_path.write_text(updated_content, encoding="utf-8")

    # Verify
    verify_content: str = config_path.read_text(encoding="utf-8")
    if expected_str not in verify_content:
        print(f"ERROR: Verification failed after patching {config_path}", file=sys.stderr)
        return False

    print(f"[PATCH] Successfully updated max_vel to {target_speed:.2f} m/s in {config_path.name}")
    return True


def main() -> int:
    """Entry point for patch script."""
    script_dir: Path = Path(__file__).resolve().parent
    default_config: Path = (
        script_dir.parent
        / "autoware"
        / "src"
        / "launcher"
        / "autoware_launch"
        / "autoware_launch"
        / "config"
        / "planning"
        / "scenario_planning"
        / "common"
        / "common.param.yaml"
    )

    target_path: Path = Path(sys.argv[1]) if len(sys.argv) > 1 else default_config
    success: bool = apply_velocity_limit(target_path, 2.78)
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
