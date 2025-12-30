import type { PatternMap } from './types.js';

export const mobilePatterns: PatternMap = {
  'mobile-context': {
    file: 'src/contexts/mobileContext.tsx',
    description: 'Mobile viewport detection context with optimized resize handling',
    keyPoints: [
      'MobileProvider tracks viewport width via window.innerWidth',
      'useMobileContext hook returns isMobile, isTablet, isDesktop, width',
      'requestAnimationFrame debouncing for performance',
      'Only re-renders when width actually changes',
      'SSR-safe with BREAKPOINTS.lg fallback',
      'Throws error when used outside provider',
    ],
  },
  'use-media-query': {
    file: 'src/hooks/useMediaQuery.ts',
    description: 'Media query hook with breakpoint constants',
    keyPoints: [
      'BREAKPOINTS: sm (640), md (768), lg (1024), xl (1280)',
      'useMediaQuery(query) for custom media queries',
      'useIsMobile() returns true if width < md breakpoint',
      'useIsDesktop() returns true if width >= lg breakpoint',
      'Uses useRef to persist MediaQueryList object',
      'SSR-safe initialization',
    ],
  },
  'use-touch-sizes': {
    file: 'src/hooks/useTouchSizes.ts',
    description: 'Touch-aware component sizing hook',
    keyPoints: [
      'Returns size variants based on device type (mobile vs desktop)',
      'Integrates with MobileProvider via useMobileContext',
      'Provides: button, buttonSm, iconButton, iconButtonLg, input, select, toggle, textarea',
      'Mobile uses "touch" variants for larger tap targets',
      'Desktop uses "default" or smaller variants',
    ],
  },
};
