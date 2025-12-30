import type { Feature } from '../types.js';

export const api: Feature = {
  name: 'API',
  description: 'TanStack Query + typed API client',
  required: false,
  includes: [
    'TanStack Query v5',
    'QueryProvider with optimized defaults (staleTime, gcTime, retry)',
    'Typed API client with methods (get/post/put/patch/delete)',
    'ApiClientError class with status and code',
    'Request timeout handling',
    'Example useExampleQuery hook',
    'API types (Todo, PaginatedResponse, etc.)',
  ],
  dependencyNames: ['@tanstack/react-query'],
  files: ['src/lib/api.ts', 'src/contexts/queryContext.tsx', 'src/hooks/useExampleQuery.ts', 'src/types/api.ts'],
  testFiles: ['src/lib/api.test.ts', 'src/hooks/useExampleQuery.test.tsx'],
  scripts: {},
};
