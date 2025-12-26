#!/bin/bash
# Bundle webapp-base template files into the MCP server package
# Run this before publishing to npm

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MCP_DIR="$(dirname "$SCRIPT_DIR")"
WEBAPP_BASE_DIR="$(dirname "$MCP_DIR")"
TEMPLATES_DIR="$MCP_DIR/templates"

echo "Bundling webapp-base templates..."

# Clean previous bundle
rm -rf "$TEMPLATES_DIR"
mkdir -p "$TEMPLATES_DIR"

# Copy documentation
mkdir -p "$TEMPLATES_DIR/docs"
cp "$WEBAPP_BASE_DIR/docs/"*.md "$TEMPLATES_DIR/docs/"
cp "$WEBAPP_BASE_DIR/CLAUDE.md" "$TEMPLATES_DIR/"
cp "$WEBAPP_BASE_DIR/README.md" "$TEMPLATES_DIR/PROJECT_README.md"

# Copy source examples (only files needed for patterns)
mkdir -p "$TEMPLATES_DIR/src/components/ui"
mkdir -p "$TEMPLATES_DIR/src/components/shared/ThemeToggle"
mkdir -p "$TEMPLATES_DIR/src/components/shared/LanguageSwitcher"
mkdir -p "$TEMPLATES_DIR/src/components/shared/SEO"
mkdir -p "$TEMPLATES_DIR/src/components/layout"
mkdir -p "$TEMPLATES_DIR/src/hooks"
mkdir -p "$TEMPLATES_DIR/src/stores"
mkdir -p "$TEMPLATES_DIR/src/contexts"
mkdir -p "$TEMPLATES_DIR/src/lib"
mkdir -p "$TEMPLATES_DIR/src/pages"
mkdir -p "$TEMPLATES_DIR/src/mocks/handlers"
mkdir -p "$TEMPLATES_DIR/tests/unit/components"
mkdir -p "$TEMPLATES_DIR/tests/unit/hooks"
mkdir -p "$TEMPLATES_DIR/tests/unit/stores"

# Copy component examples
cp "$WEBAPP_BASE_DIR/src/components/ui/button.tsx" "$TEMPLATES_DIR/src/components/ui/"
cp "$WEBAPP_BASE_DIR/src/components/shared/ThemeToggle/ThemeToggle.tsx" "$TEMPLATES_DIR/src/components/shared/ThemeToggle/"
cp "$WEBAPP_BASE_DIR/src/components/shared/LanguageSwitcher/LanguageSwitcher.tsx" "$TEMPLATES_DIR/src/components/shared/LanguageSwitcher/"
cp "$WEBAPP_BASE_DIR/src/components/shared/SEO/SEO.tsx" "$TEMPLATES_DIR/src/components/shared/SEO/"
cp "$WEBAPP_BASE_DIR/src/components/layout/Header.tsx" "$TEMPLATES_DIR/src/components/layout/"

# Copy hook examples
cp "$WEBAPP_BASE_DIR/src/hooks/useMediaQuery.ts" "$TEMPLATES_DIR/src/hooks/"
cp "$WEBAPP_BASE_DIR/src/hooks/useExampleQuery.ts" "$TEMPLATES_DIR/src/hooks/"
cp "$WEBAPP_BASE_DIR/src/hooks/useContactForm.ts" "$TEMPLATES_DIR/src/hooks/"
cp "$WEBAPP_BASE_DIR/src/hooks/useThemeEffect.ts" "$TEMPLATES_DIR/src/hooks/"
cp "$WEBAPP_BASE_DIR/src/hooks/useLanguage.ts" "$TEMPLATES_DIR/src/hooks/"

# Copy store examples
cp "$WEBAPP_BASE_DIR/src/stores/preferencesStore.ts" "$TEMPLATES_DIR/src/stores/"

# Copy context examples
cp "$WEBAPP_BASE_DIR/src/contexts/mobileContext.tsx" "$TEMPLATES_DIR/src/contexts/"
cp "$WEBAPP_BASE_DIR/src/contexts/queryContext.tsx" "$TEMPLATES_DIR/src/contexts/"

# Copy lib examples
cp "$WEBAPP_BASE_DIR/src/lib/api.ts" "$TEMPLATES_DIR/src/lib/"
cp "$WEBAPP_BASE_DIR/src/lib/validations.ts" "$TEMPLATES_DIR/src/lib/"
cp "$WEBAPP_BASE_DIR/src/lib/storage.ts" "$TEMPLATES_DIR/src/lib/"
cp "$WEBAPP_BASE_DIR/src/lib/format.ts" "$TEMPLATES_DIR/src/lib/"

# Copy page examples
cp "$WEBAPP_BASE_DIR/src/pages/Home.tsx" "$TEMPLATES_DIR/src/pages/"
cp "$WEBAPP_BASE_DIR/src/App.tsx" "$TEMPLATES_DIR/src/"

# Copy mock examples
cp "$WEBAPP_BASE_DIR/src/mocks/handlers/todos.ts" "$TEMPLATES_DIR/src/mocks/handlers/"

# Copy test examples
cp "$WEBAPP_BASE_DIR/tests/unit/components/Header.test.tsx" "$TEMPLATES_DIR/tests/unit/components/"
cp "$WEBAPP_BASE_DIR/tests/unit/hooks/useMediaQuery.test.ts" "$TEMPLATES_DIR/tests/unit/hooks/"
cp "$WEBAPP_BASE_DIR/tests/unit/stores/preferencesStore.test.ts" "$TEMPLATES_DIR/tests/unit/stores/"

echo "Templates bundled to: $TEMPLATES_DIR"
echo ""
echo "Files included:"
find "$TEMPLATES_DIR" -type f | wc -l
