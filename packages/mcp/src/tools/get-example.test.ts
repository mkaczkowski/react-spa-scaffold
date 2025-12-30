/**
 * Tests for get_example tool
 */

import { describe, it, expect } from 'vitest';

import { getExample, getExampleSchema } from './get-example.js';

describe('get_example tool', () => {
  it('rejects unknown pattern via schema', () => {
    const result = getExampleSchema.safeParse({ pattern: 'unknown-pattern' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain('Invalid pattern');
    }
  });

  it('returns code for valid pattern', async () => {
    const result = await getExample({ pattern: 'zustand-store' });

    expect(result).not.toHaveProperty('error');
    expect(result).toHaveProperty('code');
    expect(result).toHaveProperty('filePath');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('keyPoints');
  });

  it('returns usage hint', async () => {
    const result = await getExample({ pattern: 'zustand-store' });

    expect(result).toHaveProperty('usage');
    expect(typeof result.usage).toBe('string');
  });

  it('returns actual code content', async () => {
    const result = await getExample({ pattern: 'hook-state' });

    expect(result.code).toBeTruthy();
    expect(result.code?.length).toBeGreaterThan(50);
  });

  it('works for component patterns', async () => {
    const result = await getExample({ pattern: 'component-ui' });

    expect(result).not.toHaveProperty('error');
    expect(result.code).toContain('export');
  });

  it('works for test patterns', async () => {
    const result = await getExample({ pattern: 'test-component' });

    expect(result).not.toHaveProperty('error');
    expect(result.code).toContain('describe');
  });

  it('works for mobile-context pattern', async () => {
    const result = await getExample({ pattern: 'mobile-context' });

    expect(result).not.toHaveProperty('error');
    expect(result.code).toContain('MobileProvider');
    expect(result.code).toContain('useMobileContext');
    expect(result.filePath).toBe('src/contexts/mobileContext.tsx');
  });

  it('works for use-media-query pattern', async () => {
    const result = await getExample({ pattern: 'use-media-query' });

    expect(result).not.toHaveProperty('error');
    expect(result.code).toContain('BREAKPOINTS');
    expect(result.code).toContain('useMediaQuery');
    expect(result.filePath).toBe('src/hooks/useMediaQuery.ts');
  });

  it('works for use-touch-sizes pattern', async () => {
    const result = await getExample({ pattern: 'use-touch-sizes' });

    expect(result).not.toHaveProperty('error');
    expect(result.code).toContain('useTouchSizes');
    expect(result.filePath).toBe('src/hooks/useTouchSizes.ts');
  });
});
