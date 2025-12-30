/**
 * Pattern definition validation tests.
 * Ensures all pattern file paths exist and definitions are complete.
 */

import { existsSync } from 'fs';
import { describe, it, expect } from 'vitest';

import { resolveTemplatePath } from '../paths.js';
import { getAvailablePatterns, getCodeExample } from './index.js';

// Import all pattern maps to test
import { componentPatterns } from './component-patterns.js';
import { hookPatterns } from './hook-patterns.js';
import { mobilePatterns } from './mobile-patterns.js';
import { storePatterns } from './store-patterns.js';
import { pagePatterns } from './page-patterns.js';
import { contextPatterns } from './context-patterns.js';
import { apiPatterns } from './api-patterns.js';
import { testPatterns } from './test-patterns.js';
import { i18nPatterns } from './i18n-patterns.js';
import { utilityPatterns } from './utility-patterns.js';

const ALL_PATTERNS = {
  ...componentPatterns,
  ...hookPatterns,
  ...mobilePatterns,
  ...storePatterns,
  ...pagePatterns,
  ...contextPatterns,
  ...apiPatterns,
  ...testPatterns,
  ...i18nPatterns,
  ...utilityPatterns,
};

describe('pattern definitions', () => {
  const patterns = Object.entries(ALL_PATTERNS);

  it.each(patterns)('pattern "%s" points to existing file', (_, def) => {
    const fullPath = resolveTemplatePath(def.file);
    expect(existsSync(fullPath), `File not found: ${def.file}`).toBe(true);
  });

  it.each(patterns)('pattern "%s" has description', (_, def) => {
    expect(def.description).toBeTruthy();
    expect(def.description.length).toBeGreaterThan(10);
  });

  it.each(patterns)('pattern "%s" has keyPoints array', (_, def) => {
    expect(Array.isArray(def.keyPoints)).toBe(true);
    expect(def.keyPoints.length).toBeGreaterThan(0);
  });
});

describe('getAvailablePatterns', () => {
  it('returns sorted array of pattern names', () => {
    const patterns = getAvailablePatterns();
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns).toEqual([...patterns].sort());
  });

  it('includes all pattern categories', () => {
    const patterns = getAvailablePatterns();
    expect(patterns).toContain('component-ui');
    expect(patterns).toContain('hook-state');
    expect(patterns).toContain('zustand-store');
    expect(patterns).toContain('test-component');
  });
});

describe('getCodeExample', () => {
  it('returns null for unknown pattern', async () => {
    const result = await getCodeExample('non-existent-pattern');
    expect(result).toBeNull();
  });

  it('returns complete example for valid pattern', async () => {
    const result = await getCodeExample('component-ui');
    expect(result).not.toBeNull();
    expect(result?.pattern).toBe('component-ui');
    expect(result?.code).toBeTruthy();
    expect(result?.description).toBeTruthy();
    expect(result?.keyPoints.length).toBeGreaterThan(0);
  });
});
