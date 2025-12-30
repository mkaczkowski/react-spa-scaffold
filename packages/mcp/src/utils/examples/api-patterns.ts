import type { PatternMap } from './types.js';

export const apiPatterns: PatternMap = {
  'api-client': {
    file: 'src/lib/api.ts',
    description: 'Typed API client with error handling',
    keyPoints: [
      'Custom ApiClientError class',
      'Generic request function',
      'AbortController for timeout',
      'Error parsing from response JSON',
      'Methods object (get, post, put, patch, delete)',
    ],
  },
  'use-query-hook': {
    file: 'src/hooks/useExampleQuery.ts',
    description: 'TanStack Query data fetching hook',
    keyPoints: ['useQuery with typed response', 'queryKey for cache management', 'Separate fetch function'],
  },
};
