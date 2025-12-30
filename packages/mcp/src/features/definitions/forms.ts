import type { Feature } from '../types.js';

export const forms: Feature = {
  name: 'Form Handling',
  description: 'React Hook Form + Zod validation + working demo form',
  required: false,
  includes: [
    'React Hook Form with Zod validation',
    '@hookform/resolvers for schema integration',
    'RegisterForm component with validation demo (displayed on HomePage)',
    'Form error components (FieldErrorMessage, FormErrorSummary, RootFormError)',
    'useRegisterForm custom hook pattern',
    'Zod schema with refine() for cross-field validation',
  ],
  dependencyNames: ['@hookform/resolvers', 'react-hook-form'],
  files: [
    'src/lib/validations.ts',
    'src/hooks/useRegisterForm.ts',
    'src/components/ui/form-error.tsx',
    'src/components/ui/input.tsx',
    'src/components/ui/label.tsx',
    'src/components/ui/card.tsx',
    'src/components/shared/RegisterForm/RegisterForm.tsx',
    'src/components/shared/RegisterForm/index.ts',
  ],
  testFiles: [
    'src/lib/validations.test.ts',
    'src/hooks/useRegisterForm.test.tsx',
    'src/components/shared/RegisterForm/RegisterForm.test.tsx',
  ],
  scripts: {},
};
