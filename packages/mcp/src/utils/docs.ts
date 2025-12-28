/**
 * Documentation utilities for scaffolding
 *
 * Handles doc selection based on selected features.
 */

import { readFile } from 'fs/promises';

import { resolveTemplatePath } from './paths.js';

/**
 * Documentation configuration
 *
 * - If requiredFeatures is set: only included when one of those features is selected
 * - If requiredFeatures is not set: always included (universal reference material)
 *
 * WORKFLOW.md is intentionally excluded - not relevant to scaffolded projects
 */
const DOCS_CONFIG: Record<string, { requiredFeatures?: string[] }> = {
  // Universal - always included
  'docs/ARCHITECTURE.md': {},
  'docs/CODING_STANDARDS.md': {},
  'docs/COMPONENT_GUIDELINES.md': {},
  'docs/API_REFERENCE.md': {},

  // Feature-specific
  'docs/TESTING.md': { requiredFeatures: ['testing'] },
  'docs/E2E_TESTING.md': { requiredFeatures: ['testing'] },
  'docs/INTERNATIONALIZATION.md': { requiredFeatures: ['i18n'] },
};

/**
 * Determine which docs to include based on selected features
 */
export function computeDocsForFeatures(featureIds: readonly string[]): string[] {
  const featureSet = new Set(featureIds);

  return Object.entries(DOCS_CONFIG)
    .filter(([, config]) => {
      if (!config.requiredFeatures) return true; // Universal
      return config.requiredFeatures.some((f) => featureSet.has(f));
    })
    .map(([path]) => path)
    .sort();
}

/**
 * Read a documentation file for scaffolding
 */
async function readDoc(docPath: string): Promise<string> {
  const fullPath = resolveTemplatePath(docPath);

  try {
    return await readFile(fullPath, 'utf-8');
  } catch {
    return `<!-- File not found: ${docPath} -->\n<!-- Run MCP server from within webapp-base repository -->`;
  }
}

/**
 * Read all docs for scaffolding based on selected features
 */
export async function computeDocsContent(featureIds: readonly string[]): Promise<Record<string, string>> {
  const docPaths = computeDocsForFeatures(featureIds);
  const docs: Record<string, string> = {};

  for (const docPath of docPaths) {
    docs[docPath] = await readDoc(docPath);
  }

  return docs;
}
