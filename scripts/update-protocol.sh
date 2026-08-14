# Update etrike_protocol from the etrike repo
#
# This script fetches the YAML contract files from
# https://github.com/shakilapr/etrike and generates the C++ headers.
#
# The YAML contracts are the source of truth. The generated C++ header
# is derived from them by protocol/tools/protocol.py.
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

echo "Fetching protocol contracts from etrike repo ($ETRIKE_BRANCH)..."

# Create temp directory
TMPDIR=$(mktemp -d)
trap "rm -rf $TMPDIR" EXIT

# Clone only the protocol directory
git clone --depth 1 --branch "$ETRIKE_BRANCH" --filter=blob:none --sparse "$ETRIKE_REPO" "$TMPDIR/etrike"
cd "$TMPDIR/etrike"
git sparse-checkout set protocol/contracts protocol/tools protocol/vectors protocol/core protocol/codecs/python

# Get the commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)

# Generate C++ header from YAML contracts
echo "Generating C++ header from YAML contracts..."
cd "$TMPDIR/etrike/protocol"
python -m tools.protocol generate

# Copy generated C++ header
echo "Updating generated C++ header..."
mkdir -p "$PROTO_DIR/generated/cpp"
cp "$TMPDIR/etrike/protocol/generated/cpp/etrike_protocol.hpp" "$PROTO_DIR/generated/cpp/etrike_protocol.hpp"

# Update vectors (for golden-vector tests)
if [ -d "$TMPDIR/etrike/protocol/vectors" ]; then
    echo "Updating vectors..."
    rm -rf "$PROTO_DIR/vectors"
    cp -r "$TMPDIR/etrike/protocol/vectors" "$PROTO_DIR/vectors"
fi

echo ""
echo "Updated etrike_protocol from etrike@$COMMIT_HASH"
echo ""
echo "Source: protocol/contracts/*.yaml (YAML is the source of truth)"
echo "Output: generated/cpp/etrike_protocol.hpp"
echo ""
echo "Commit this change:"
echo "  git add autoware/src/our_packages/etrike_protocol/"
echo "  git commit -m \"sync(etrike_protocol): regenerate from etrike@$COMMIT_HASH\""
