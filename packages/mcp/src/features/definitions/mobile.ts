import type { Feature } from '../types.js';

export const mobile: Feature = {
  name: 'Mobile Support',
  description: 'Responsive design utilities with viewport detection, breakpoints, and touch-aware sizing',
  required: false,
  includes: [
    'MobileProvider context for viewport detection',
    'useMobileContext hook (isMobile, isTablet, isDesktop, width)',
    'useMediaQuery hook with BREAKPOINTS constants (sm, md, lg, xl)',
    'useIsMobile and useIsDesktop convenience hooks',
    'useTouchSizes hook for touch-aware component sizing',
    'requestAnimationFrame-debounced resize handling',
    'SSR-safe viewport detection with fallbacks',
  ],
  files: ['src/contexts/mobileContext.tsx', 'src/hooks/useMediaQuery.ts', 'src/hooks/useTouchSizes.ts'],
  testFiles: ['src/contexts/mobileContext.test.tsx', 'src/hooks/useMediaQuery.test.ts'],
  patterns: ['mobile-context', 'use-media-query', 'use-touch-sizes'],
  scripts: {},
};
