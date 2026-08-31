#!/usr/bin/env bash
# Regenerate the vendored C++ protocol header from the trimmed YAML contracts.
#
# The generated header is committed to the repository and must stay in sync
# with the contracts under protocol/contracts/. Run this script after any
# contract change, review the diff, and commit the result.
#
#   ./scripts/regenerate.sh          # write generated output
#   ./scripts/regenerate.sh --check  # read-only; fail if output differs
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${PACKAGE_DIR}"

MODE="generate"
if [[ "${1:-}" == "--check" ]]; then
  MODE="generate --check"
fi

python3 tools/protocol.py ${MODE} cpp --no-baseline
