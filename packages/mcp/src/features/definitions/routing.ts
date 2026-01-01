import type { Feature } from '../types.js';

export const routing: Feature = {
  name: 'Routing',
  description: 'React Router 7 with lazy loading and route constants',
  required: false,
  dependencies: ['react-router'],
  files: [
    'src/pages/Home.tsx',
    'src/pages/NotFound.tsx',
    'src/pages/index.ts',
    'src/components/ui/loading.tsx',
    'src/components/ui/visually-hidden.tsx',
    'src/hooks/useDocumentTitle.ts',
  ],
  testFiles: ['e2e/tests/navigation.spec.ts', 'src/hooks/useDocumentTitle.test.ts'],
  scripts: {},
};
