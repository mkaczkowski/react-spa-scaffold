#!/bin/bash
# Bundle webapp-base template files into the MCP server package
# Run this before publishing to npm

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_DIR="$(dirname "$SCRIPT_DIR")"
# In monorepo: packages/mcp -> packages -> root
WEBAPP_BASE_DIR="$(dirname "$(dirname "$MCP_DIR")")"
TEMPLATES_DIR="$MCP_DIR/templates"

echo "Bundling webapp-base templates..."
echo "Source: $WEBAPP_BASE_DIR"
echo "Target: $TEMPLATES_DIR"

# Clean previous bundle
rm -rf "$TEMPLATES_DIR"
mkdir -p "$TEMPLATES_DIR"

# Copy entire directories (simpler, no maintenance needed when files change)
cp -r "$WEBAPP_BASE_DIR/docs" "$TEMPLATES_DIR/docs"
cp -r "$WEBAPP_BASE_DIR/src" "$TEMPLATES_DIR/src"
cp -r "$WEBAPP_BASE_DIR/tests" "$TEMPLATES_DIR/tests"
cp "$WEBAPP_BASE_DIR/CLAUDE.md" "$TEMPLATES_DIR/"

# Create marker file to indicate this is a bundled distribution
# The MCP server checks for this file to distinguish npx mode from development
touch "$TEMPLATES_DIR/.bundled"

echo ""
echo "Templates bundled to: $TEMPLATES_DIR"
echo "Files included:"
find "$TEMPLATES_DIR" -type f | wc -l
