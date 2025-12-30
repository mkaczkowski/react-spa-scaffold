import type { Feature } from '../types.js';

export const routing: Feature = {
  name: 'Routing',
  description: 'React Router 7 with lazy loading and route constants',
  required: false,
  includes: [
    'React Router 7',
    'Lazy-loaded pages with React.lazy()',
    'Route constants with TypeScript types (generated based on features)',
    '404 Not Found page',
    'App.tsx with Suspense fallback',
    'PageLoading component for transitions',
  ],
  dependencyNames: ['react-router'],
  files: [
    'src/pages/Home.tsx',
    'src/pages/NotFound.tsx',
    'src/pages/index.ts',
    'src/components/ui/loading.tsx',
    'src/components/ui/visually-hidden.tsx',
  ],
  testFiles: ['e2e/tests/navigation.spec.ts'],
  scripts: {},
};
