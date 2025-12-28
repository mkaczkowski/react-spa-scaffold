/**
 * Documentation utilities for scaffolding
 *
 * Handles doc selection based on selected features.
 */

import { readFile } from 'fs/promises';

import { resolveTemplatePath } from './paths.js';

// Document inclusion strategy
type DocType = 'universal' | 'feature-specific';

interface DocConfig {
  type: DocType;
  requiredFeatures?: string[]; // For feature-specific docs
}

/**
 * Documentation configuration
 *
 * Strategy: Keep docs intact to preserve coherent content.
 * - universal: Always included (reference material useful even without feature)
 * - feature-specific: Only when required feature is selected
 *
 * Conservative approach: No line-level filtering as it breaks
 * interconnected content (code examples, tables, diagrams).
 */
const DOCS_CONFIG: Record<string, DocConfig> = {
  // Universal - always included as reference material
  'docs/ARCHITECTURE.md': {
    type: 'universal',
  },
  'docs/CODING_STANDARDS.md': {
    type: 'universal',
  },
  'docs/COMPONENT_GUIDELINES.md': {
    type: 'universal',
  },
  'docs/API_REFERENCE.md': {
    type: 'universal',
  },

  // Feature-specific - only when feature is selected
  'docs/TESTING.md': {
    type: 'feature-specific',
    requiredFeatures: ['testing'],
  },
  'docs/E2E_TESTING.md': {
    type: 'feature-specific',
    requiredFeatures: ['testing'],
  },
  'docs/INTERNATIONALIZATION.md': {
    type: 'feature-specific',
    requiredFeatures: ['i18n'],
  },

  // WORKFLOW.md is intentionally excluded - not relevant to scaffolded projects
};

/**
 * Determine which docs to include based on selected features
 */
export function computeDocsForFeatures(featureIds: string[]): string[] {
  const docs: string[] = [];

  for (const [path, config] of Object.entries(DOCS_CONFIG)) {
    if (config.type === 'universal') {
      docs.push(path);
    } else if (config.type === 'feature-specific') {
      const hasRequiredFeature = config.requiredFeatures?.some((f) => featureIds.includes(f));
      if (hasRequiredFeature) {
        docs.push(path);
      }
    }
  }

  return docs.sort();
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
export async function computeDocsContent(featureIds: string[]): Promise<Record<string, string>> {
  const docPaths = computeDocsForFeatures(featureIds);
  const docs: Record<string, string> = {};

  for (const docPath of docPaths) {
    docs[docPath] = await readDoc(docPath);
  }

  return docs;
}
