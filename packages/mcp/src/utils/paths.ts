/**
 * Centralized path resolution for MCP server
 *
 * Handles detection of development vs published (npx) mode.
 * Uses a marker file (.bundled) to reliably detect npx mode,
 * avoiding issues where running `npm run bundle` during development
 * would cause the server to read from stale bundled files.
 */

import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to bundled templates (for npx distribution)
const BUNDLED_TEMPLATES = join(__dirname, '..', '..', 'templates');

// Marker file created by bundle script to indicate npx mode
const BUNDLE_MARKER = join(BUNDLED_TEMPLATES, '.bundled');

// Monorepo root (react-spa-scaffold app lives at root alongside packages/)
const MONOREPO_ROOT = join(__dirname, '..', '..', '..', '..');

/**
 * Check if running in npx/published mode
 *
 * We check for a .bundled marker file instead of just checking if
 * templates/ exists. This prevents issues where a developer runs
 * `npm run bundle` during development and then gets stale files.
 */
export const isNpxMode = existsSync(BUNDLE_MARKER);

/**
 * Root directory for reading template files
 *
 * - In development: reads from monorepo root (live files)
 * - In npx mode: reads from bundled templates directory
 */
export const TEMPLATES_ROOT = isNpxMode ? BUNDLED_TEMPLATES : MONOREPO_ROOT;

/**
 * Resolve a path relative to templates root
 */
export function resolveTemplatePath(relativePath: string): string {
  return join(TEMPLATES_ROOT, relativePath);
}
