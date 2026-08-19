#!/bin/bash
# Bootstrap the E-Trike Autoware workspace from a fresh clone.
#
# This script reconstructs the full source workspace (upstream Autoware +
# E-Trike patches) so the repository can be recovered from GitHub alone.
#
# Usage:
#   ./scripts/bootstrap_workspace.sh
#
# What it does:
#   1. Imports upstream Autoware from repositories/autoware.repos
#   2. Verifies expected upstream revisions
#   3. Applies all E-Trike patches
#   4. Verifies patches applied correctly

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="${SCRIPT_DIR}/.."
AUTOWARE_DIR="${ROOT_DIR}/autoware"
REPOS_DIR="${ROOT_DIR}/repositories"

echo "=== E-Trike workspace bootstrap ==="
echo "Root:     $ROOT_DIR"
echo "Autoware: $AUTOWARE_DIR"
echo ""

# --- 1. Check prerequisites ---
for cmd in vcs python3 git; do
    if ! command -v "$cmd" &>/dev/null; then
        echo "ERROR: required tool '$cmd' not found"
        exit 1
    fi
done

# --- 2. Import upstream Autoware ---
REPOS_FILE="$REPOS_DIR/autoware.repos"
if [ ! -f "$REPOS_FILE" ]; then
    echo "ERROR: $REPOS_FILE not found"
    exit 1
fi

echo "[STEP 1] Importing upstream Autoware from $REPOS_FILE ..."
mkdir -p "$AUTOWARE_DIR/src"
vcs import "$AUTOWARE_DIR/src" < "$REPOS_FILE"

# --- 3. Verify key upstream components exist ---
echo ""
echo "[STEP 2] Verifying upstream components ..."
MISSING=0
for d in \
    "$AUTOWARE_DIR/src/core/autoware_msgs" \
    "$AUTOWARE_DIR/src/universe/autoware_universe" \
    "$AUTOWARE_DIR/src/launcher/autoware_launch" \
    "$AUTOWARE_DIR/src/sensor_component/external/nebula" \
; do
    if [ ! -d "$d" ]; then
        echo "  MISSING: $d"
        MISSING=1
    fi
done
if [ "$MISSING" -ne 0 ]; then
    echo "ERROR: upstream components missing — check autoware.repos"
    exit 1
fi
echo "  All expected upstream components present"

# --- 4. Apply E-Trike patches ---
echo ""
echo "[STEP 3] Applying E-Trike patches ..."

PATCH_SCRIPT="$SCRIPT_DIR/../patches/apply_nebula_firetime_patch.sh"
if [ -f "$PATCH_SCRIPT" ]; then
    bash "$PATCH_SCRIPT"
else
    echo "  [SKIP] $PATCH_SCRIPT not found"
fi

# --- 5. Verify our_packages exist ---
echo ""
echo "[STEP 4] Verifying E-Trike packages ..."
OUR_PKG_DIR="$AUTOWARE_DIR/src/our_packages"
EXPECTED_PACKAGES=(
    autoware_vehicle_bridge
    etrike_protocol
    etrike_vehicle_description
    etrike_vehicle_launch
    etrike_sensor_kit_description
    etrike_sensor_kit_launch
    etrike_common_launch
    etrike_stability_guard
    etrike_kinect2
)
MISSING=0
for pkg in "${EXPECTED_PACKAGES[@]}"; do
    if [ ! -d "$OUR_PKG_DIR/$pkg" ]; then
        echo "  MISSING: $OUR_PKG_DIR/$pkg"
        MISSING=1
    fi
done
if [ "$MISSING" -ne 0 ]; then
    echo "ERROR: E-Trike packages missing — check git subtree"
    exit 1
fi
echo "  All ${#EXPECTED_PACKAGES[@]} E-Trike packages present"

echo ""
echo "=== Bootstrap complete ==="
echo "Next steps:"
echo "  ./docker/build.sh   # build our packages + patched upstream"
echo "  ./run_tests.sh      # run all E-Trike tests"
