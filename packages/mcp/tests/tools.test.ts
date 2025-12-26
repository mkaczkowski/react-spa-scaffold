/**
 * Integration tests for MCP tools
 */

import { describe, it, expect } from 'vitest';
import { getFeatures } from '../src/tools/get-features.js';
import { getScaffold, getScaffoldSchema } from '../src/tools/get-scaffold.js';
import { getExample, getExampleSchema } from '../src/tools/get-example.js';
import { FEATURE_IDS } from '../src/features/index.js';

describe('get_features tool', () => {
  it('returns all feature IDs', () => {
    const features = getFeatures();

    expect(features).toHaveLength(FEATURE_IDS.length);
    expect(features.map((f) => f.id)).toEqual(expect.arrayContaining(FEATURE_IDS));
  });

  it('returns core as required', () => {
    const features = getFeatures();
    const core = features.find((f) => f.id === 'core');

    expect(core).toBeDefined();
    expect(core?.required).toBe(true);
  });

  it('returns proper structure for each feature', () => {
    const features = getFeatures();

    for (const feature of features) {
      expect(feature).toHaveProperty('id');
      expect(feature).toHaveProperty('name');
      expect(feature).toHaveProperty('description');
      expect(feature).toHaveProperty('required');
      expect(feature).toHaveProperty('includes');
      expect(feature).toHaveProperty('requiresFeatures');
      expect(Array.isArray(feature.includes)).toBe(true);
      expect(Array.isArray(feature.requiresFeatures)).toBe(true);
    }
  });

  it('ui feature requires state', () => {
    const features = getFeatures();
    const ui = features.find((f) => f.id === 'ui');

    expect(ui?.requiresFeatures).toContain('state');
  });

  it('ci feature requires devtools and testing', () => {
    const features = getFeatures();
    const ci = features.find((f) => f.id === 'ci');

    expect(ci?.requiresFeatures).toContain('devtools');
    expect(ci?.requiresFeatures).toContain('testing');
  });
});

describe('get_scaffold tool', () => {
  it('always includes core feature', async () => {
    const result = await getScaffold({ features: ['routing'] });

    expect(result.resolvedFeatures).toContain('core');
  });

  it('rejects invalid features via schema', () => {
    const result = getScaffoldSchema.safeParse({ features: ['invalid-feature'] });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain('Invalid features');
    }
  });

  it('auto-includes state when ui is selected', async () => {
    const result = await getScaffold({ features: ['ui'] });

    expect(result.resolvedFeatures).toContain('state');
    expect(result.resolvedFeatures).toContain('ui');
    expect(result.resolvedFeatures).toContain('core');
  });

  it('returns valid package.json structure', async () => {
    const result = await getScaffold({ features: ['routing'], projectName: 'test-app' });

    expect(result.packageJson).toBeDefined();
    expect(result.packageJson.name).toBe('test-app');
    expect(result.packageJson.dependencies).toBeDefined();
    expect(result.packageJson.devDependencies).toBeDefined();
    expect(result.packageJson.scripts).toBeDefined();
  });

  it('includes react in core dependencies', async () => {
    const result = await getScaffold({ features: [] });

    expect(result.packageJson.dependencies).toHaveProperty('react');
    expect(result.packageJson.dependencies).toHaveProperty('react-dom');
  });

  it('includes routing dependencies when routing feature selected', async () => {
    const result = await getScaffold({ features: ['routing'] });

    expect(result.packageJson.dependencies).toHaveProperty('react-router');
  });

  it('returns file structure', async () => {
    const result = await getScaffold({ features: ['routing'] });

    expect(Array.isArray(result.fileStructure)).toBe(true);
    expect(result.fileStructure.length).toBeGreaterThan(0);
  });

  it('returns setup commands', async () => {
    const result = await getScaffold({ features: ['routing'] });

    expect(Array.isArray(result.setupCommands)).toBe(true);
    expect(result.setupCommands).toContain('npm install');
  });

  it('uses default project name when not provided', async () => {
    const result = await getScaffold({ features: [] });

    expect(result.projectName).toBe('my-app');
  });

  it('marks auto-included features correctly', async () => {
    const result = await getScaffold({ features: ['ui'] });

    const stateDetail = result.featureDetails.find((f) => f.id === 'state');
    const uiDetail = result.featureDetails.find((f) => f.id === 'ui');

    expect(stateDetail?.wasAutoIncluded).toBe(true);
    expect(stateDetail?.wasExplicitlySelected).toBe(false);
    expect(uiDetail?.wasExplicitlySelected).toBe(true);
    expect(uiDetail?.wasAutoIncluded).toBe(false);
  });
});

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

    // Should contain actual code, not be empty
    expect(result.code).toBeTruthy();
    expect(result.code.length).toBeGreaterThan(50);
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
});
