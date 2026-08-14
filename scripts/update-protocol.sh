# Update etrike_protocol from the etrike repo
#
# This script fetches the latest generated protocol files from
# https://github.com/shakilapr/etrike and updates the local copy.
#
# Usage:
#   scripts/update-protocol.sh          # fetches latest from main branch
#   scripts/update-protocol.sh <branch> # fetches from specific branch

set -euo pipefail

ETRIKE_REPO="https://github.com/shakilapr/etrike.git"
ETRIKE_BRANCH="${1:-main}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROTO_DIR="$PROJECT_ROOT/autoware/src/our_packages/etrike_protocol"

echo "Fetching protocol files from etrike repo ($ETRIKE_BRANCH)..."

# Create temp directory
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# Clone only the protocol directory
git clone --depth 1 --branch "$ETRIKE_BRANCH" --filter=blob:none --sparse "$ETRIKE_REPO" "$TMPDIR/etrike"
cd "$TMPDIR/etrike"
git sparse-checkout set protocol/generated

# Copy generated files
echo "Updating generated files..."
rm -rf "$PROTO_DIR/generated"
cp -r "$TMPDIR/etrike/protocol/generated" "$PROTO_DIR/generated"

# Remove non-ROS files from generated
rm -rf "$PROTO_DIR/generated/python"
rm -rf "$PROTO_DIR/generated/typescript"
rm -rf "$PROTO_DIR/generated/csv"
rm -rf "$PROTO_DIR/generated/dbc"
rm -f "$PROTO_DIR/generated/__init__.py"
rm -f "$PROTO_DIR/generated/capabilities.json"
rm -f "$PROTO_DIR/generated/contract-schema.json"
rm -f "$PROTO_DIR/generated/discovery.json"
rm -f "$PROTO_DIR/generated/errors.json"

# Also update vectors if they exist (for golden-vector tests)
if [ -d "$TMPDIR/etrike/protocol/vectors" ]; then
    echo "Updating vectors..."
    rm -rf "$PROTO_DIR/vectors"
    cp -r "$TMPDIR/etrike/protocol/vectors" "$PROTO_DIR/vectors"
fi

# Get the commit hash for the update note
COMMIT_HASH=$(cd "$TMPDIR/etrike" && git rev-parse --short HEAD)
echo ""
echo "Updated etrike_protocol from etrike@$COMMIT_HASH"
echo ""
echo "Files updated:"
echo "  generated/cpp/etrike_protocol.hpp"
echo "  vectors/"
echo ""
echo "Commit this change:"
echo "  git add autoware/src/our_packages/etrike_protocol/"
echo "  git commit -m \"sync(etrike_protocol): update from etrike@$COMMIT_HASH\""
