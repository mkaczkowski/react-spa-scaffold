import type { Feature } from '../types.js';

export const mobile: Feature = {
  name: 'Mobile Support',
  description: 'Responsive design utilities with viewport detection, breakpoints, and touch-aware sizing',
  required: false,
  files: [
    'src/contexts/mobileContext.tsx',
    'src/hooks/useMediaQuery.ts',
    'src/hooks/useTouchSizes.ts',
    'src/hooks/useIOSViewportReset.ts',
  ],
  testFiles: [
    'src/contexts/mobileContext.test.tsx',
    'src/hooks/useMediaQuery.test.ts',
    'src/hooks/useIOSViewportReset.test.ts',
  ],
  scripts: {},
};
