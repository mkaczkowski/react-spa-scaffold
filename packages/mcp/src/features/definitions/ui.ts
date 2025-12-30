import type { Feature } from '../types.js';

export const ui: Feature = {
  name: 'UI Components',
  description: 'Shadcn/UI + icons + animations + toasts',
  required: false,
  dependencies: [
    '@radix-ui/react-slot',
    'class-variance-authority',
    'lucide-react',
    'radix-ui',
    'sonner',
    'tw-animate-css',
  ],
  devDependencies: ['shadcn'],
  files: [
    'src/components/ui/button.tsx',
    'src/components/ui/dropdown-menu.tsx',
    'src/components/ui/loading.tsx',
    'src/components/ui/skeleton.tsx',
    'src/components/ui/spinner.tsx',
    'src/components/ui/sonner.tsx',
    'src/components/ui/visually-hidden.tsx',
    'src/components/layout/Header.tsx',
    'src/components/layout/index.ts',
    'components.json',
  ],
  testFiles: ['src/components/ui/loading.test.tsx', 'src/components/layout/Header.test.tsx'],
  scripts: {},
  configFiles: ['components.json'],
};
