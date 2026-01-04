/**
 * Documentation resources - reads docs from react-spa-scaffold repository.
 */

import { readFile } from 'fs/promises';

import { DOCS_URI } from '../constants.js';
import { createCache } from '../utils/cache.js';
import { resolveTemplatePath } from '../utils/paths.js';

const docsCache = createCache<string>();

interface DocConfig {
  files: string[];
  name: string;
  description: string;
}

/** Documentation file mapping - maps URIs to repository files. */
const DOCS_MAP: Record<string, DocConfig> = {
  [DOCS_URI.CONVENTIONS]: {
    files: ['docs/CODING_STANDARDS.md', 'docs/COMPONENT_GUIDELINES.md'],
    name: 'Coding Conventions',
    description: 'Coding standards, naming conventions, and component patterns',
  },
  [DOCS_URI.ARCHITECTURE]: {
    files: ['docs/ARCHITECTURE.md'],
    name: 'Architecture Overview',
    description: 'Technology stack, data flow, and architectural decisions',
  },
  [DOCS_URI.TESTING]: {
    files: ['docs/TESTING.md', 'docs/E2E_TESTING.md'],
    name: 'Testing Guide',
    description: 'Unit testing with Vitest and E2E testing with Playwright',
  },
  [DOCS_URI.I18N]: {
    files: ['docs/INTERNATIONALIZATION.md'],
    name: 'Internationalization',
    description: 'LinguiJS setup, Trans component usage, and translation workflow',
  },
  [DOCS_URI.API]: {
    files: ['docs/API_REFERENCE.md'],
    name: 'API Reference',
    description: 'API client utilities, hooks, and data fetching patterns',
  },
  [DOCS_URI.DATABASE]: {
    files: ['docs/SUPABASE_INTEGRATION.md'],
    name: 'Database Integration',
    description: 'Supabase database with Clerk auth, TanStack Query hooks, and Row Level Security',
  },
  [DOCS_URI.CLAUDE]: {
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

/** Read documentation content for a resource URI (cached, parallel). */
export async function readDocumentation(uri: string): Promise<string | null> {
  const doc = DOCS_MAP[uri];
  if (!doc) return null;

  return docsCache.getOrSet(uri, async () => {
    const contents = await Promise.all(
      doc.files.map(async (file) => {
        const fullPath = resolveTemplatePath(file);
        try {
          return await readFile(fullPath, 'utf-8');
        } catch {
          return `<!-- File not found: ${file} -->\n`;
        }
      }),
    );
    return contents.length > 1 ? contents.join('\n\n---\n\n') : (contents[0] ?? '');
  });
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
