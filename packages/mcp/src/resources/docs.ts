/**
 * Documentation resources
 *
 * Reads actual documentation files from the webapp-base repository
 * to ensure MCP resources stay in sync with the real docs.
 */

import { readFile } from 'fs/promises';

import { resolveTemplatePath } from '../utils/paths.js';

/**
 * Documentation file mapping
 *
 * Maps resource URIs to actual files in the repository.
 * Add new entries here to expose additional documentation.
 */
const DOCS_MAP: Record<
  string,
  {
    files: string[]; // Files to concatenate (in order)
    name: string;
    description: string;
  }
> = {
  'docs://conventions': {
    files: ['docs/CODING_STANDARDS.md', 'docs/COMPONENT_GUIDELINES.md'],
    name: 'Coding Conventions',
    description: 'Coding standards, naming conventions, and component patterns for webapp-base projects',
  },
  'docs://architecture': {
    files: ['docs/ARCHITECTURE.md'],
    name: 'Architecture Overview',
    description: 'Technology stack, data flow, and architectural decisions for webapp-base',
  },
  'docs://testing': {
    files: ['docs/TESTING.md', 'docs/E2E_TESTING.md'],
    name: 'Testing Guide',
    description: 'Unit testing with Vitest and E2E testing with Playwright',
  },
  'docs://i18n': {
    files: ['docs/INTERNATIONALIZATION.md'],
    name: 'Internationalization',
    description: 'LinguiJS setup, Trans component usage, and translation workflow',
  },
  'docs://api': {
    files: ['docs/API_REFERENCE.md'],
    name: 'API Reference',
    description: 'API client utilities, hooks, and data fetching patterns',
  },
  'docs://workflow': {
    files: ['docs/WORKFLOW.md'],
    name: 'Development Workflow',
    description: 'Development process, git workflow, and CI/CD pipeline',
  },
  'docs://claude': {
    files: ['CLAUDE.md'],
    name: 'Claude AI Guidance',
    description: 'AI assistant instructions and project-specific guidance',
  },
};

/**
 * Get list of all available documentation resources
 */
export function getDocumentationResources() {
  return Object.entries(DOCS_MAP).map(([uri, doc]) => ({
    uri,
    name: doc.name,
    description: doc.description,
    mimeType: 'text/markdown',
  }));
}

/**
 * Read documentation content for a resource URI
 */
export async function readDocumentation(uri: string): Promise<string | null> {
  const doc = DOCS_MAP[uri];
  if (!doc) {
    return null;
  }

  const contents: string[] = [];

  for (const file of doc.files) {
    const fullPath = resolveTemplatePath(file);
    try {
      const content = await readFile(fullPath, 'utf-8');
      contents.push(content);
    } catch {
      // File might not exist
      contents.push(`<!-- File not found: ${file} -->\n`);
    }
  }

  // Join multiple files with a separator
  if (contents.length > 1) {
    return contents.join('\n\n---\n\n');
  }

  return contents[0] || null;
}

/**
 * Check if a URI is a valid documentation resource
 */
export function isValidDocumentationUri(uri: string): boolean {
  return uri in DOCS_MAP;
}

/**
 * Get all available documentation URIs
 */
export function getDocumentationUris(): string[] {
  return Object.keys(DOCS_MAP);
}
