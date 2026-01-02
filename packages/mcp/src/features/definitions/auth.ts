import type { Feature } from '../types.js';

export const auth: Feature = {
  name: 'Authentication',
  description: 'Clerk authentication with modal-based sign-in and shadcn theme integration',
  required: false,
  requires: ['routing'], // Uses @clerk/react-router which requires React Router
  dependencies: ['@clerk/react-router', '@clerk/themes'],
  files: [
    'src/contexts/clerkContext.tsx',
    'src/components/shared/AccountButton/AccountButton.tsx',
    'src/components/shared/AccountButton/index.ts',
    'src/components/shared/ProtectedRoute/ProtectedRoute.tsx',
    'src/components/shared/ProtectedRoute/index.ts',
  ],
  testFiles: ['src/test/clerkMock.tsx'],
  scripts: {},
};
