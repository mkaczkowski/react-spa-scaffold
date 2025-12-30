/**
 * Code examples - provides real code patterns from the react-spa-scaffold repository.
 */

import { readFile } from 'fs/promises';

import { resolveTemplatePath } from '../paths.js';
import type { CodeExample, PatternMap } from './types.js';
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

export type { CodeExample } from './types.js';

/** All pattern definitions merged. */
const PATTERN_MAP: PatternMap = {
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

/** Get all available pattern names. */
export function getAvailablePatterns(): string[] {
  return Object.keys(PATTERN_MAP).sort();
}

/** Get code example for a pattern. */
export async function getCodeExample(pattern: string): Promise<CodeExample | null> {
  const mapping = PATTERN_MAP[pattern];
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

/** Get all examples for a list of patterns. */
export async function getFeatureExamples(patterns: string[]): Promise<CodeExample[]> {
  const examples: CodeExample[] = [];
  for (const pattern of patterns) {
    const example = await getCodeExample(pattern);
    if (example) examples.push(example);
  }
  return examples;
}
