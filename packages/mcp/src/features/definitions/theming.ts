import type { Feature } from '../types.js';

export const theming: Feature = {
  name: 'Theming',
  description: 'Light/dark/system theme toggle with CSS variables',
  required: false,
  requires: ['state'], // Needs Zustand for persistence
  files: [
    'src/hooks/useThemeEffect.ts',
    'src/components/shared/ThemeToggle/ThemeToggle.tsx',
    'src/components/shared/ThemeToggle/index.ts',
  ],
  testFiles: [
    'src/hooks/useThemeEffect.test.ts',
    'src/components/shared/ThemeToggle/ThemeToggle.test.tsx',
    'e2e/tests/theme.spec.ts',
  ],
  scripts: {},
};
