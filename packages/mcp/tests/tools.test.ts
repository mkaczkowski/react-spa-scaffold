/**
 * Integration tests for MCP tools
 */

import { describe, it, expect } from 'vitest';
import { getFeatures } from '../src/tools/get-features.js';
import { getScaffold, getScaffoldSchema } from '../src/tools/get-scaffold.js';
import { getExample, getExampleSchema } from '../src/tools/get-example.js';
import { FEATURE_IDS } from '../src/features/index.js';
import { computeDocsForFeatures, computeDocsContent } from '../src/utils/docs.js';

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
      expect(feature).toHaveProperty('usesFeatures');
      expect(Array.isArray(feature.includes)).toBe(true);
      expect(Array.isArray(feature.usesFeatures)).toBe(true);
    }
  });

  it('ui feature uses state (informational, not auto-included)', () => {
    const features = getFeatures();
    const ui = features.find((f) => f.id === 'ui');

    expect(ui?.usesFeatures).toContain('state');
  });

  it('ci feature uses devtools and testing (informational, not auto-included)', () => {
    const features = getFeatures();
    const ci = features.find((f) => f.id === 'ci');

    expect(ci?.usesFeatures).toContain('devtools');
    expect(ci?.usesFeatures).toContain('testing');
  });

  it('mobile feature exists and is not required', () => {
    const features = getFeatures();
    const mobile = features.find((f) => f.id === 'mobile');

    expect(mobile).toBeDefined();
    expect(mobile?.required).toBe(false);
    expect(mobile?.name).toBe('Mobile Support');
  });

  it('ui feature uses mobile and state (informational)', () => {
    const features = getFeatures();
    const ui = features.find((f) => f.id === 'ui');

    expect(ui?.usesFeatures).toContain('mobile');
    expect(ui?.usesFeatures).toContain('state');
  });
});

describe('get_scaffold tool', () => {
  it('always includes core feature', async () => {
    const result = await getScaffold({ features: ['routing'] });

    expect(result.resolvedFeatures).toContain('core');
  });

  it('rejects invalid features via schema', () => {
    const result = getScaffoldSchema.safeParse({
      features: ['invalid-feature'],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain('Invalid features');
    }
  });

  it('does NOT auto-include usesFeatures (state, mobile) when ui is selected', async () => {
    const result = await getScaffold({ features: ['ui'] });

    // usesFeatures are informational only, not auto-included
    expect(result.resolvedFeatures).not.toContain('state');
    expect(result.resolvedFeatures).not.toContain('mobile');
    expect(result.resolvedFeatures).toContain('ui');
    expect(result.resolvedFeatures).toContain('core');
  });

  it('includes mobile files when mobile feature is selected', async () => {
    const result = await getScaffold({ features: ['mobile'] });

    expect(result.fileStructure).toContain('src/contexts/mobileContext.tsx');
    expect(result.fileStructure).toContain('src/hooks/useMediaQuery.ts');
    expect(result.fileStructure).toContain('src/hooks/useTouchSizes.ts');
  });

  it('does not include mobile files when only core is selected', async () => {
    const result = await getScaffold({ features: [] });

    expect(result.fileStructure).not.toContain('src/contexts/mobileContext.tsx');
    expect(result.fileStructure).not.toContain('src/hooks/useMediaQuery.ts');
    expect(result.fileStructure).not.toContain('src/hooks/useTouchSizes.ts');
  });

  it('returns valid package.json structure', async () => {
    const result = await getScaffold({
      features: ['routing'],
      projectName: 'test-app',
    });

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

  it('marks explicitly selected features correctly (no auto-inclusion)', async () => {
    const result = await getScaffold({ features: ['ui', 'state'] });

    const stateDetail = result.featureDetails.find((f) => f.id === 'state');
    const uiDetail = result.featureDetails.find((f) => f.id === 'ui');

    // Both are explicitly selected, none auto-included
    expect(stateDetail?.wasExplicitlySelected).toBe(true);
    expect(stateDetail?.wasAutoIncluded).toBe(false);
    expect(uiDetail?.wasExplicitlySelected).toBe(true);
    expect(uiDetail?.wasAutoIncluded).toBe(false);
  });

  it('includes CLAUDE.md in file structure', async () => {
    const result = await getScaffold({ features: [] });

    expect(result.fileStructure).toContain('CLAUDE.md');
  });

  it('returns claudeMd content', async () => {
    const result = await getScaffold({
      features: [],
      projectName: 'test-project',
    });

    expect(result.claudeMd).toBeDefined();
    expect(typeof result.claudeMd).toBe('string');
    expect(result.claudeMd).toContain('# CLAUDE.md');
    expect(result.claudeMd).toContain('test-project');
  });

  it('claudeMd includes testing section when testing feature selected', async () => {
    const result = await getScaffold({ features: ['testing'] });

    expect(result.claudeMd).toContain('## Testing');
    expect(result.claudeMd).toContain('Vitest');
  });

  it('claudeMd excludes testing section when testing feature not selected', async () => {
    const result = await getScaffold({ features: [] });

    expect(result.claudeMd).not.toContain('## Testing');
  });

  it('claudeMd includes UI section only when ui feature selected', async () => {
    const withUi = await getScaffold({ features: ['ui'] });
    const withoutUi = await getScaffold({ features: [] });

    expect(withUi.claudeMd).toContain('## UI Components');
    expect(withoutUi.claudeMd).not.toContain('## UI Components');
  });

  it('claudeMd includes i18n section only when i18n feature selected', async () => {
    const withI18n = await getScaffold({ features: ['i18n'] });
    const withoutI18n = await getScaffold({ features: [] });

    expect(withI18n.claudeMd).toContain('## Translations');
    expect(withoutI18n.claudeMd).not.toContain('## Translations');
  });

  it('claudeMd includes mobile section only when mobile feature selected', async () => {
    const withMobile = await getScaffold({ features: ['mobile'] });
    const withoutMobile = await getScaffold({ features: [] });

    expect(withMobile.claudeMd).toContain('## Mobile & Responsive Design');
    expect(withMobile.claudeMd).toContain('MobileProvider');
    expect(withMobile.claudeMd).toContain('useMobileContext');
    expect(withMobile.claudeMd).toContain('useTouchSizes');
    expect(withoutMobile.claudeMd).not.toContain('## Mobile & Responsive Design');
  });

  it('claudeMd project structure shows contexts when mobile is selected', async () => {
    const withMobile = await getScaffold({ features: ['mobile'] });
    const withoutMobile = await getScaffold({ features: [] });

    expect(withMobile.claudeMd).toContain('contexts/');
    expect(withoutMobile.claudeMd).not.toContain('contexts/');
  });

  it('returns config files with content', async () => {
    const result = await getScaffold({ features: ['ui'] });

    expect(typeof result.configFiles).toBe('object');
    expect(result.configFiles).toHaveProperty('components.json');
  });

  it('includes radix-nova style in components.json', async () => {
    const result = await getScaffold({ features: ['ui'] });

    const componentsJson = JSON.parse(result.configFiles['components.json']);
    expect(componentsJson.style).toBe('radix-nova');
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

describe('docs utilities', () => {
  it('includes universal docs and excludes WORKFLOW.md', () => {
    const docs = computeDocsForFeatures(['core']);

    // Universal docs always included
    expect(docs).toContain('docs/ARCHITECTURE.md');
    expect(docs).toContain('docs/CODING_STANDARDS.md');
    expect(docs).toContain('docs/COMPONENT_GUIDELINES.md');
    expect(docs).toContain('docs/API_REFERENCE.md');
    // WORKFLOW.md never included
    expect(docs).not.toContain('docs/WORKFLOW.md');
    expect(docs).toHaveLength(4);
  });

  it('includes feature-specific docs only when feature selected', () => {
    const coreOnly = computeDocsForFeatures(['core']);
    const withTesting = computeDocsForFeatures(['core', 'testing']);
    const withI18n = computeDocsForFeatures(['core', 'i18n']);

    // Testing docs
    expect(coreOnly).not.toContain('docs/TESTING.md');
    expect(withTesting).toContain('docs/TESTING.md');
    expect(withTesting).toContain('docs/E2E_TESTING.md');

    // i18n docs
    expect(coreOnly).not.toContain('docs/INTERNATIONALIZATION.md');
    expect(withI18n).toContain('docs/INTERNATIONALIZATION.md');
  });

  it('returns doc content with key sections preserved', async () => {
    const docs = await computeDocsContent(['core']);

    expect(Object.keys(docs)).toHaveLength(4);
    expect(docs['docs/ARCHITECTURE.md']).toContain('# Architecture Guide');
    expect(docs['docs/ARCHITECTURE.md']).toContain('Provider Hierarchy');
  });
});

describe('get_scaffold docs integration', () => {
  it('includes docs in structure and content', async () => {
    const result = await getScaffold({ features: [] });

    // Structure includes docs
    expect(result.fileStructure).toContain('docs/ARCHITECTURE.md');
    expect(result.fileStructure).not.toContain('docs/TESTING.md');

    // Content returned
    expect(result.docs['docs/ARCHITECTURE.md']).toBeDefined();
    expect(result.docs['docs/TESTING.md']).toBeUndefined();
  });

  it('adds feature-specific docs when feature selected', async () => {
    const result = await getScaffold({ features: ['testing'] });

    expect(result.fileStructure).toContain('docs/TESTING.md');
    expect(result.docs['docs/TESTING.md']).toContain('# Testing Guidelines');
  });
});
