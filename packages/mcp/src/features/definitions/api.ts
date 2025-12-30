import type { Feature } from '../types.js';

export const api: Feature = {
  name: 'API',
  description: 'TanStack Query + typed API client',
  required: false,
  dependencies: ['@tanstack/react-query'],
  files: ['src/lib/api.ts', 'src/contexts/queryContext.tsx', 'src/hooks/useExampleQuery.ts', 'src/types/api.ts'],
  testFiles: ['src/lib/api.test.ts', 'src/hooks/useExampleQuery.test.tsx'],
  scripts: {},
};
