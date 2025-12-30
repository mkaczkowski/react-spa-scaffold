import { describe, it, expect } from 'vitest';
import { isPublishedMode, CONTENT_ROOT, resolveTemplatePath } from './paths.js';

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
