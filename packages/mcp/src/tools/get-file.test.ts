/**
 * Tests for get_file tool
 */

import { describe, it, expect } from 'vitest';

import { getFile, getFileSchema } from './get-file.js';

describe('get_file tool', () => {
  describe('schema validation', () => {
    it('accepts valid path', () => {
      const result = getFileSchema.safeParse({ path: 'vite.config.ts' });
      expect(result.success).toBe(true);
    });

    it('rejects missing path', () => {
      const result = getFileSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('file fetching', () => {
    it('fetches config file content', async () => {
      const result = await getFile({ path: 'vite.config.ts' });

      expect(result).not.toHaveProperty('error');
      expect(result).toHaveProperty('path', 'vite.config.ts');
      expect(result).toHaveProperty('content');
      expect((result as { content: string }).content).toContain('defineConfig');
    });

    it('fetches documentation file content', async () => {
      const result = await getFile({ path: 'docs/ARCHITECTURE.md' });

      expect(result).not.toHaveProperty('error');
      expect(result).toHaveProperty('path', 'docs/ARCHITECTURE.md');
      expect(result).toHaveProperty('content');
      expect((result as { content: string }).content).toContain('#');
    });

    it('fetches .gitignore content', async () => {
      const result = await getFile({ path: '.gitignore' });

      expect(result).not.toHaveProperty('error');
      expect(result).toHaveProperty('content');
      expect((result as { content: string }).content).toContain('node_modules');
    });
  });

  describe('security', () => {
    it('rejects path traversal attempts', async () => {
      const result = await getFile({ path: '../../../etc/passwd' });

      expect(result).toHaveProperty('error');
      expect((result as { error: string }).error).toContain('Invalid path');
    });

    it('rejects absolute paths outside root', async () => {
      const result = await getFile({ path: '/etc/passwd' });

      expect(result).toHaveProperty('error');
    });

    it('rejects embedded path traversal', async () => {
      const result = await getFile({ path: 'docs/../../../etc/passwd' });

      expect(result).toHaveProperty('error');
    });
  });

  describe('error handling', () => {
    it('returns error for non-existent file', async () => {
      const result = await getFile({ path: 'nonexistent-file.xyz' });

      expect(result).toHaveProperty('error');
      expect((result as { error: string }).error).toContain('File not found');
      expect(result).toHaveProperty('hint');
    });
  });
});
