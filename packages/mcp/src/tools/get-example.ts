/**
 * get_example tool
 *
 * Returns real code examples for specific pattern types.
 * AI agents use this to understand how to generate code
 * that matches react-spa-scaffold conventions.
 */

import { z } from 'zod';
import { getCodeExample, getAvailablePatterns } from '../utils/index.js';

const AVAILABLE_PATTERNS = getAvailablePatterns() as [string, ...string[]];

export const getExampleSchema = z.object({
  pattern: z.enum(AVAILABLE_PATTERNS, {
    error: `Invalid pattern. Available: ${AVAILABLE_PATTERNS.join(', ')}`,
  }),
});

export type GetExampleInput = z.infer<typeof getExampleSchema>;

export async function getExample(input: GetExampleInput) {
  const { pattern } = input;

  const example = await getCodeExample(pattern);

  if (!example) {
    return {
      error: `Could not load example for pattern: ${pattern}`,
      hint: 'Ensure MCP server is running from react-spa-scaffold directory',
    };
  }

  return {
    pattern: example.pattern,
    description: example.description,
    filePath: example.filePath,
    keyPoints: example.keyPoints,
    code: example.code,
    usage: generateUsageHint(pattern),
  };
}

function generateUsageHint(pattern: string): string {
  const hints: Record<string, string> = {
    'component-ui': 'Place in src/components/ui/ with kebab-case filename',
    'component-shared': 'Create subdirectory in src/components/shared/ with index.ts barrel',
    'component-layout': 'Place in src/components/layout/',
    'hook-state': 'Place in src/hooks/ with useXxx.ts naming',
    'hook-query': 'Place in src/hooks/ - define fetchFn outside hook',
    'hook-form': 'Place in src/hooks/ - import schema from lib/validations',
    'hook-effect': 'Place in src/hooks/ - no return value',
    'zustand-store': 'Place in src/stores/ with xxxStore.ts naming',
    'page-component': 'Place in src/pages/ with XxxPage named export',
    'context-provider': 'Place in src/contexts/ - export both Provider and hook',
    'test-component': 'Place in tests/unit/components/ mirroring src structure',
    'test-hook': 'Place in tests/unit/hooks/',
    'msw-handler': 'Place in src/mocks/handlers/',
    'zod-schema': 'Add to src/lib/validations.ts',
  };

  return hints[pattern] || 'Follow the file path shown in the example';
}

export const getExampleToolDefinition = {
  name: 'get_example',
  description: `Get real code example for a specific pattern type.

Returns actual code from the react-spa-scaffold repository, not templates.
Use this to understand exact patterns when generating new files.

Available patterns:
- Components: component-ui, component-shared, component-layout
- Hooks: hook-state, hook-query, hook-form, hook-effect, use-language-hook
- Store: zustand-store
- Pages: page-component, lazy-page
- Context: context-provider, query-provider
- API: api-client
- Tests: test-component, test-hook, test-store, msw-handler
- Validation: zod-schema, form-error-component
- i18n: trans-component, t-function, language-switcher
- Utils: storage-utility
- Theme: theme-toggle
- SEO: seo-component

Each example includes:
- Actual working code
- Key points explaining the pattern
- File path where it should be placed`,
  inputSchema: {
    type: 'object' as const,
    properties: {
      pattern: {
        type: 'string' as const,
        description: 'Pattern type to get example for',
        enum: AVAILABLE_PATTERNS,
      },
    },
    required: ['pattern'],
  },
};
