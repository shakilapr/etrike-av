#!/usr/bin/env bash
# Forwarder to canonical loader in autoware/scripts/loading/load_pipeline.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$SCRIPT_DIR/../autoware/scripts/loading/load_pipeline.sh" "$@"
