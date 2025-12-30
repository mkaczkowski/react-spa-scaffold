/**
 * Tests for add_features tool
 */

import { describe, it, expect } from 'vitest';

import { addFeatures, addFeaturesSchema } from './add-features.js';

describe('add_features tool', () => {
  describe('schema validation', () => {
    it('requires at least one feature', () => {
      const result = addFeaturesSchema.safeParse({ features: [] });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('At least one feature required');
      }
    });

    it('rejects invalid features via schema', () => {
      const result = addFeaturesSchema.safeParse({
        features: ['invalid-feature'],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Invalid features');
      }
    });

    it('accepts valid features', () => {
      const result = addFeaturesSchema.safeParse({
        features: ['state', 'routing'],
      });

      expect(result.success).toBe(true);
    });

    it('rejects more than 15 features', () => {
      const result = addFeaturesSchema.safeParse({
        features: Array(16).fill('state'),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain('Maximum 15 features');
      }
    });
  });

  describe('feature resolution', () => {
    it('does NOT auto-include core feature', async () => {
      const result = await addFeatures({ features: ['state'] });

      expect(result.resolvedFeatures).not.toContain('core');
      expect(result.resolvedFeatures).toContain('state');
    });

    it('auto-includes feature dependencies (theming → state)', async () => {
      const result = await addFeatures({ features: ['theming'] });

      expect(result.resolvedFeatures).toContain('theming');
      expect(result.resolvedFeatures).toContain('state');
      expect(result.resolvedFeatures).not.toContain('core');
    });

    it('marks auto-included features correctly', async () => {
      const result = await addFeatures({ features: ['theming'] });

      const themingDetail = result.featureDetails.find((f) => f.id === 'theming');
      const stateDetail = result.featureDetails.find((f) => f.id === 'state');

      // Theming was explicitly selected
      expect(themingDetail?.wasExplicitlySelected).toBe(true);
      expect(themingDetail?.wasAutoIncluded).toBe(false);

      // State was auto-included (dependency of theming)
      expect(stateDetail?.wasExplicitlySelected).toBe(false);
      expect(stateDetail?.wasAutoIncluded).toBe(true);
    });

    it('returns only selected features when no dependencies', async () => {
      const result = await addFeatures({ features: ['ui'] });

      expect(result.resolvedFeatures).toEqual(['ui']);
    });
  });

  describe('dependencies', () => {
    it('returns dependencies for selected features', async () => {
      const result = await addFeatures({ features: ['state'] });

      expect(result.dependencies).toHaveProperty('zustand');
    });

    it('returns routing dependencies when routing selected', async () => {
      const result = await addFeatures({ features: ['routing'] });

      expect(result.dependencies).toHaveProperty('react-router');
    });

    it('does NOT include core dependencies', async () => {
      const result = await addFeatures({ features: ['state'] });

      // Core deps like react/react-dom should not be included
      expect(result.dependencies).not.toHaveProperty('react');
      expect(result.dependencies).not.toHaveProperty('react-dom');
    });
  });

  describe('files', () => {
    it('returns files for selected features', async () => {
      const result = await addFeatures({ features: ['state'] });

      expect(result.files).toContain('src/stores/preferencesStore.ts');
      expect(result.files).toContain('src/stores/index.ts');
    });

    it('returns testFiles for selected features', async () => {
      const result = await addFeatures({ features: ['state'] });

      expect(result.testFiles).toContain('src/stores/preferencesStore.test.ts');
    });

    it('includes files from auto-included dependencies', async () => {
      const result = await addFeatures({ features: ['theming'] });

      // Theming files
      expect(result.files).toContain('src/hooks/useThemeEffect.ts');

      // State files (auto-included dependency)
      expect(result.files).toContain('src/stores/preferencesStore.ts');
    });

    it('returns configFiles that may need updates', async () => {
      // Use 'ui' feature which has configFiles defined (components.json)
      const result = await addFeatures({ features: ['ui'] });

      expect(Array.isArray(result.configFiles)).toBe(true);
      expect(result.configFiles).toContain('components.json');
    });

    it('returns empty configFiles when feature has none', async () => {
      // 'state' feature has no configFiles
      const result = await addFeatures({ features: ['state'] });

      expect(Array.isArray(result.configFiles)).toBe(true);
      expect(result.configFiles.length).toBe(0);
    });
  });

  describe('docs', () => {
    it('returns relevant documentation files', async () => {
      const result = await addFeatures({ features: ['testing'] });

      expect(result.docs).toContain('docs/TESTING.md');
    });

    it('includes universal docs', async () => {
      const result = await addFeatures({ features: ['state'] });

      expect(result.docs).toContain('docs/ARCHITECTURE.md');
    });
  });

  describe('regenerated content', () => {
    it('generates routesTs when routing is selected', async () => {
      const result = await addFeatures({ features: ['routing'] });

      expect(result.regenerated.routesTs).toBeDefined();
      expect(result.regenerated.routesTs).toContain('ROUTES');
    });

    it('does NOT generate routesTs when routing is not selected', async () => {
      const result = await addFeatures({ features: ['state'] });

      expect(result.regenerated.routesTs).toBeUndefined();
    });

    it('generates envTs when api is selected', async () => {
      const result = await addFeatures({ features: ['api'] });

      expect(result.regenerated.envTs).toBeDefined();
      expect(result.regenerated.viteEnvDts).toBeDefined();
    });
  });

  describe('instructions', () => {
    it('returns integration instructions', async () => {
      const result = await addFeatures({ features: ['state'] });

      expect(result.instructions).toContain('Integration Instructions');
      expect(result.instructions).toContain('npm install');
      expect(result.instructions).toContain('get_file');
    });
  });

  describe('difference from get_scaffold', () => {
    it('does NOT include core feature or its files', async () => {
      const result = await addFeatures({ features: ['ui'] });

      // Core files should NOT be included
      expect(result.files).not.toContain('src/App.tsx');
      expect(result.files).not.toContain('src/main.tsx');

      // Only UI files
      expect(result.resolvedFeatures).toEqual(['ui']);
    });

    it('does NOT include package.json template', async () => {
      const result = await addFeatures({ features: ['state'] });

      // Should NOT have full packageJson, just deps
      expect(result).not.toHaveProperty('packageJson');
      expect(result).toHaveProperty('dependencies');
      expect(result).toHaveProperty('devDependencies');
    });

    it('does NOT include claudeMd', async () => {
      const result = await addFeatures({ features: ['state'] });

      expect(result).not.toHaveProperty('claudeMd');
    });
  });
});
