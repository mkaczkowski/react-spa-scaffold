/**
 * Tests for get_scaffold tool
 */

import { describe, it, expect } from 'vitest';

import { getScaffold, getScaffoldSchema } from './get-scaffold.js';

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

  it('only includes explicitly selected features (plus core)', async () => {
    const result = await getScaffold({ features: ['ui'] });

    expect(result.resolvedFeatures).not.toContain('state');
    expect(result.resolvedFeatures).not.toContain('mobile');
    expect(result.resolvedFeatures).toContain('ui');
    expect(result.resolvedFeatures).toContain('core');
  });

  it('theming feature auto-includes state feature', async () => {
    const result = await getScaffold({ features: ['theming'] });

    expect(result.resolvedFeatures).toContain('theming');
    expect(result.resolvedFeatures).toContain('state');
    expect(result.resolvedFeatures).toContain('core');
  });

  it('marks auto-included features correctly', async () => {
    const result = await getScaffold({ features: ['theming'] });

    const themingDetail = result.featureDetails.find((f) => f.id === 'theming');
    const stateDetail = result.featureDetails.find((f) => f.id === 'state');
    const coreDetail = result.featureDetails.find((f) => f.id === 'core');

    // Theming was explicitly selected
    expect(themingDetail?.wasExplicitlySelected).toBe(true);
    expect(themingDetail?.wasAutoIncluded).toBe(false);

    // State was auto-included (dependency of theming)
    expect(stateDetail?.wasExplicitlySelected).toBe(false);
    expect(stateDetail?.wasAutoIncluded).toBe(true);

    // Core is always auto-included
    expect(coreDetail?.wasExplicitlySelected).toBe(false);
    expect(coreDetail?.wasAutoIncluded).toBe(true);
  });

  it('includes theming files when theming feature is selected', async () => {
    const result = await getScaffold({ features: ['theming'] });

    expect(result.fileStructure).toContain('src/hooks/useThemeEffect.ts');
    expect(result.fileStructure).toContain('src/components/shared/ThemeToggle/ThemeToggle.tsx');
  });

  it('excludes theming files when only ui is selected', async () => {
    const result = await getScaffold({ features: ['ui'] });

    expect(result.fileStructure).not.toContain('src/hooks/useThemeEffect.ts');
    expect(result.fileStructure).not.toContain('src/components/shared/ThemeToggle/ThemeToggle.tsx');
  });

  it('includes mobile files when mobile feature is selected', async () => {
    const result = await getScaffold({ features: ['mobile'] });

    expect(result.fileStructure).toContain('src/contexts/mobileContext.tsx');
    expect(result.fileStructure).toContain('src/hooks/useMediaQuery.ts');
    expect(result.fileStructure).toContain('src/hooks/useTouchSizes.ts');
  });

  it('excludes mobile files when only core is selected', async () => {
    const result = await getScaffold({ features: [] });

    expect(result.fileStructure).not.toContain('src/contexts/mobileContext.tsx');
    expect(result.fileStructure).not.toContain('src/hooks/useMediaQuery.ts');
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

  it('marks explicitly selected features correctly', async () => {
    const result = await getScaffold({ features: ['ui', 'state'] });

    const stateDetail = result.featureDetails.find((f) => f.id === 'state');
    const uiDetail = result.featureDetails.find((f) => f.id === 'ui');

    expect(stateDetail?.wasExplicitlySelected).toBe(true);
    expect(stateDetail?.wasAutoIncluded).toBe(false);
    expect(uiDetail?.wasExplicitlySelected).toBe(true);
    expect(uiDetail?.wasAutoIncluded).toBe(false);
  });

  it('does NOT include CLAUDE.md in file structure (generated content)', async () => {
    const result = await getScaffold({ features: [] });

    // CLAUDE.md content is in claudeMd field, not fetched via get_file
    expect(result.fileStructure).not.toContain('CLAUDE.md');
    expect(result.claudeMd).toContain('# CLAUDE.md');
  });

  it('returns claudeMd content', async () => {
    const result = await getScaffold({ features: [], projectName: 'test-project' });

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
    expect(withoutMobile.claudeMd).not.toContain('## Mobile & Responsive Design');
  });

  it('claudeMd includes theming section only when theming feature selected', async () => {
    const withTheming = await getScaffold({ features: ['theming'] });
    const withoutTheming = await getScaffold({ features: [] });

    expect(withTheming.claudeMd).toContain('## Theming');
    expect(withTheming.claudeMd).toContain('usePreferencesStore');
    expect(withoutTheming.claudeMd).not.toContain('## Theming');
  });

  it('claudeMd project structure shows contexts when mobile is selected', async () => {
    const withMobile = await getScaffold({ features: ['mobile'] });
    const withoutMobile = await getScaffold({ features: [] });

    expect(withMobile.claudeMd).toContain('contexts/');
    expect(withoutMobile.claudeMd).not.toContain('contexts/');
  });

  it('returns config files as paths array (lazy loading)', async () => {
    const result = await getScaffold({ features: ['ui'] });

    expect(Array.isArray(result.configFiles)).toBe(true);
    expect(result.configFiles).toContain('components.json');
  });

  it('always includes .gitignore in fileStructure (core feature)', async () => {
    const result = await getScaffold({ features: [] });

    expect(result.fileStructure).toContain('.gitignore');
  });

  it('always includes .gitignore in configFiles array', async () => {
    const result = await getScaffold({ features: [] });

    expect(result.configFiles).toContain('.gitignore');
  });

  it('returns docs as paths array (lazy loading)', async () => {
    const result = await getScaffold({ features: [] });

    expect(Array.isArray(result.docs)).toBe(true);
    expect(result.docs).toContain('docs/ARCHITECTURE.md');
    expect(result.docs).not.toContain('docs/TESTING.md');
  });

  it('does NOT include docs in fileStructure (separate docs array)', async () => {
    const result = await getScaffold({ features: [] });

    // Docs are in separate docs array, not in fileStructure
    expect(result.fileStructure).not.toContain('docs/ARCHITECTURE.md');
    expect(result.docs).toContain('docs/ARCHITECTURE.md');
  });

  it('adds feature-specific docs to docs array when feature selected', async () => {
    const result = await getScaffold({ features: ['testing'] });

    // Testing docs in docs array, not fileStructure
    expect(result.docs).toContain('docs/TESTING.md');
    expect(result.fileStructure).not.toContain('docs/TESTING.md');
  });

  it('instructions reference get_file for lazy loading', async () => {
    const result = await getScaffold({ features: [] });

    expect(result.instructions).toContain('get_file');
    expect(result.instructions).toContain('configFiles');
    expect(result.instructions).toContain('docs');
  });
});
