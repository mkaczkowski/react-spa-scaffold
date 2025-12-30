/**
 * Tests for docs utilities
 */

import { describe, it, expect } from 'vitest';

import { computeDocsForFeatures, computeDocsContent } from './docs.js';

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
