import type { PatternMap } from './types.js';

export const contextPatterns: PatternMap = {
  'context-provider': {
    file: 'src/contexts/mobileContext.tsx',
    description: 'React Context with provider and hook',
    keyPoints: [
      'Separate Context and Provider',
      'useMemo for context value',
      'Custom hook with error if outside provider',
      'useEffect with resize listener',
      'requestAnimationFrame for debouncing',
    ],
  },
  'query-provider': {
    file: 'src/contexts/queryContext.tsx',
    description: 'TanStack Query provider setup',
    keyPoints: [
      'QueryClient with default options',
      'staleTime, gcTime, retry configuration',
      'QueryClientProvider wrapper',
    ],
  },
  'performance-context': {
    file: 'src/contexts/performanceContext.tsx',
    description: 'Performance monitoring context',
    keyPoints: [
      'Lazy loading for zero prod overhead',
      'usePerformance hook never throws',
      'React Profiler integration',
    ],
  },
};
