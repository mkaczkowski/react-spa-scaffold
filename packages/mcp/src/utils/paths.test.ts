import { describe, it, expect } from 'vitest';
import { isPublishedMode, CONTENT_ROOT, resolveTemplatePath, isPathWithinRoot } from './paths.js';

describe('paths', () => {
  it('isPublishedMode is boolean', () => {
    expect(typeof isPublishedMode).toBe('boolean');
  });

  it('CONTENT_ROOT is non-empty string', () => {
    expect(typeof CONTENT_ROOT).toBe('string');
    expect(CONTENT_ROOT.length).toBeGreaterThan(0);
  });

  it('resolveTemplatePath returns full path', () => {
    const result = resolveTemplatePath('package.json');
    expect(result).toContain('package.json');
    expect(result).toContain(CONTENT_ROOT);
  });
});

describe('isPathWithinRoot', () => {
  it('returns true for valid paths', () => {
    expect(isPathWithinRoot('vite.config.ts')).toBe(true);
    expect(isPathWithinRoot('docs/ARCHITECTURE.md')).toBe(true);
    expect(isPathWithinRoot('src/main.tsx')).toBe(true);
    expect(isPathWithinRoot('.gitignore')).toBe(true);
  });

  it('returns false for path traversal attempts', () => {
    expect(isPathWithinRoot('../../../etc/passwd')).toBe(false);
    expect(isPathWithinRoot('../../secret')).toBe(false);
    expect(isPathWithinRoot('/etc/passwd')).toBe(false);
  });

  it('returns false for paths with embedded traversal', () => {
    expect(isPathWithinRoot('docs/../../../etc/passwd')).toBe(false);
    expect(isPathWithinRoot('src/../../outside')).toBe(false);
  });

  it('returns true for paths with internal traversal that stay within root', () => {
    expect(isPathWithinRoot('src/../package.json')).toBe(true);
    expect(isPathWithinRoot('docs/../vite.config.ts')).toBe(true);
  });
});
