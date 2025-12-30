/**
 * Code examples - provides real code patterns from the react-spa-scaffold repository.
 * Uses lazy loading to improve startup performance.
 */

import { readFile } from 'fs/promises';

import { createSingletonCache } from '../cache.js';
import { resolveTemplatePath } from '../paths.js';
import type { CodeExample, PatternMap } from './types.js';

export type { CodeExample } from './types.js';

// Lazy-loaded pattern map cache
const patternMapCache = createSingletonCache<PatternMap>();

/** Lazy-loads all pattern definitions. */
async function getPatternMap(): Promise<PatternMap> {
  return patternMapCache.getOrSet(async () => {
    const [
      { componentPatterns },
      { hookPatterns },
      { mobilePatterns },
      { storePatterns },
      { pagePatterns },
      { contextPatterns },
      { apiPatterns },
      { testPatterns },
      { i18nPatterns },
      { utilityPatterns },
    ] = await Promise.all([
      import('./component-patterns.js'),
      import('./hook-patterns.js'),
      import('./mobile-patterns.js'),
      import('./store-patterns.js'),
      import('./page-patterns.js'),
      import('./context-patterns.js'),
      import('./api-patterns.js'),
      import('./test-patterns.js'),
      import('./i18n-patterns.js'),
      import('./utility-patterns.js'),
    ]);

    return {
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
  });
}

// Pre-computed pattern names (sync for startup - just the keys, not content)
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

const ALL_PATTERN_NAMES = Object.keys({
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
}).sort();

/** Get all available pattern names (sync). */
export function getAvailablePatterns(): string[] {
  return ALL_PATTERN_NAMES;
}

/** Get code example for a pattern. */
export async function getCodeExample(pattern: string): Promise<CodeExample | null> {
  const patternMap = await getPatternMap();
  const mapping = patternMap[pattern];
  if (!mapping) return null;

  const fullPath = resolveTemplatePath(mapping.file);

  try {
    const code = await readFile(fullPath, 'utf-8');
    return {
      pattern,
      description: mapping.description,
      filePath: mapping.file,
      code,
      keyPoints: mapping.keyPoints,
    };
  } catch {
    return {
      pattern,
      description: mapping.description,
      filePath: mapping.file,
      code: `// File not found: ${mapping.file}\n// Run MCP server from within react-spa-scaffold repository`,
      keyPoints: mapping.keyPoints,
    };
  }
}

/** Get all examples for a list of patterns (parallel). */
export async function getFeatureExamples(patterns: string[]): Promise<CodeExample[]> {
  const examples = await Promise.all(patterns.map(getCodeExample));
  return examples.filter((e): e is CodeExample => e !== null);
}
