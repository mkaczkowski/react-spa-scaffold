/**
 * Path resolution for MCP server - handles dev vs published mode.
 */

import { existsSync } from 'fs';
import { dirname, isAbsolute, join, normalize } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUNDLED_PATH = join(__dirname, '..', '..', 'templates');
const BUNDLE_MARKER = join(BUNDLED_PATH, '.bundled');
const MONOREPO_ROOT = join(__dirname, '..', '..', '..', '..');

/** True when running as published npm package (npx mode). */
export const isPublishedMode = existsSync(BUNDLE_MARKER);

/** Root directory for reading content files. */
export const CONTENT_ROOT = isPublishedMode ? BUNDLED_PATH : MONOREPO_ROOT;

/** Dotfiles renamed in bundled templates (npm strips .gitignore). */
const RENAMED_DOTFILES: Record<string, string> = {
  '.gitignore': 'gitignore',
};

/** Resolves path relative to content root, handling dotfile renames in published mode. */
export function resolveTemplatePath(relativePath: string): string {
  const resolvedPath =
    isPublishedMode && RENAMED_DOTFILES[relativePath] ? RENAMED_DOTFILES[relativePath] : relativePath;

  return join(CONTENT_ROOT, resolvedPath);
}

/**
 * Check if resolved path is within CONTENT_ROOT (prevent path traversal).
 *
 * @example
 * isPathWithinRoot('vite.config.ts')           // true
 * isPathWithinRoot('../../../etc/passwd')      // false
 * isPathWithinRoot('/etc/passwd')              // false
 */
export function isPathWithinRoot(relativePath: string): boolean {
  // Reject absolute paths - they bypass CONTENT_ROOT
  if (isAbsolute(relativePath)) {
    return false;
  }

  const fullPath = join(CONTENT_ROOT, relativePath);
  const normalizedPath = normalize(fullPath);
  const normalizedRoot = normalize(CONTENT_ROOT);

  return normalizedPath.startsWith(normalizedRoot + '/') || normalizedPath === normalizedRoot;
}
