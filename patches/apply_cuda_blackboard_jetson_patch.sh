#!/bin/bash
# Wrapper to apply cuda_blackboard JetPack 6 CUDA 12.6 compatibility patch
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
python3 "${SCRIPT_DIR}/apply_cuda_blackboard_jetson_patch.py" "$@"
