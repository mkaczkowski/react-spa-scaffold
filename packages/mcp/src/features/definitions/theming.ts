import type { Feature } from '../types.js';

export const theming: Feature = {
  name: 'Theming',
  description: 'Light/dark/system theme toggle with CSS variables',
  required: false,
  requires: ['state'], // Needs Zustand for persistence
  includes: [
    'Light/dark/system theme modes',
    'useThemeEffect hook (applies .dark class to document)',
    'ThemeToggle component',
    'System preference detection (prefers-color-scheme)',
    'Zustand persistence via preferencesStore',
    'Multi-tab sync via storage events',
  ],
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
  patterns: ['theme-toggle', 'hook-effect'],
  scripts: {},
};
