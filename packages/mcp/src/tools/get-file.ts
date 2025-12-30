/**
 * get_file tool
 *
 * Fetches content of ANY file from react-spa-scaffold templates.
 * Used for lazy loading after get_scaffold returns paths.
 */

import { readFile } from 'fs/promises';
import { z } from 'zod';

import { createCache } from '../utils/cache.js';
import { isPathWithinRoot, resolveTemplatePath } from '../utils/paths.js';

import type { ToolDefinition } from './types.js';

const fileCache = createCache<{ path: string; content: string }>();

/** Zod schema for get_file input - single source of truth. */
export const getFileSchema = z.object({
  path: z.string().describe('File path from get_scaffold (configFiles or docs array)'),
});

export type GetFileInput = z.infer<typeof getFileSchema>;

export async function getFile(input: GetFileInput) {
  const { path: filePath } = input;

  // Security: prevent path traversal
  if (!isPathWithinRoot(filePath)) {
    return {
      error: 'Invalid path: must be within template directory',
      hint: 'Use paths from get_scaffold configFiles or docs arrays',
    };
  }

  try {
    return await fileCache.getOrSet(filePath, async () => {
      const fullPath = resolveTemplatePath(filePath);
      const content = await readFile(fullPath, 'utf-8');
      return { path: filePath, content };
    });
  } catch {
    return {
      error: `File not found: ${filePath}`,
      hint: 'Ensure MCP server runs from react-spa-scaffold directory',
    };
  }
}

/** Tool definition derived from Zod schema (Zod v4 native). */
export const getFileToolDefinition: ToolDefinition = {
  name: 'get_file',
  description: `Fetch file content from react-spa-scaffold templates.

Use with paths from \`get_scaffold\` response:
- \`configFiles\`: config file paths
- \`docs\`: documentation paths
- \`fileStructure\`: ALL source file paths

IMPORTANT: Fetch content for EVERY file in fileStructure, then strip code for unselected features.

Examples:
- \`{ path: "vite.config.ts" }\`
- \`{ path: "docs/TESTING.md" }\`
- \`{ path: "src/App.tsx" }\``,
  inputSchema: z.toJSONSchema(getFileSchema) as ToolDefinition['inputSchema'],
};
