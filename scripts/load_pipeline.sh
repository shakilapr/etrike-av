#!/usr/bin/env bash
# Wrapper that delegates to the canonical autoware/scripts/loading/load_pipeline.sh
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/../autoware/scripts/loading/load_pipeline.sh" "$@"
