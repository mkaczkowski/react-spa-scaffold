import type { PatternMap } from './types.js';

export const hookPatterns: PatternMap = {
  'hook-state': {
    file: 'src/hooks/useMediaQuery.ts',
    description: 'State hook with browser API and cleanup',
    keyPoints: [
      'useRef for persistent MediaQueryList',
      'useState with SSR-safe initialization',
      'useEffect with cleanup function',
      'Exports constants alongside hook (BREAKPOINTS)',
      'Convenience wrapper hooks (useIsMobile, useIsDesktop)',
    ],
  },
  'hook-query': {
    file: 'src/hooks/useExampleQuery.ts',
    description: 'TanStack Query hook for data fetching',
    keyPoints: [
      'Separate async fetchFn outside hook',
      'Typed with generics (useQuery<Todo[]>)',
      'Namespaced queryKey array',
      'Uses centralized API client',
    ],
  },
  'hook-form': {
    file: 'src/hooks/useRegisterForm.ts',
    description: 'React Hook Form + Zod validation hook',
    keyPoints: [
      'zodResolver for Zod integration',
      'Type-safe with inferred RegisterFormData',
      'Returns form object + handlers + reset',
      'Extracts commonly used state (isSubmitting, errors)',
      'Uses schema with refine() for cross-field validation',
    ],
  },
  'hook-effect': {
    file: 'src/hooks/useThemeEffect.ts',
    description: 'Effect-only hook with no return value',
    keyPoints: [
      'useEffect with conditional listener',
      'Zustand store subscription',
      'Cleanup function for event listener',
      'DOM manipulation (classList)',
    ],
  },
  'use-language-hook': {
    file: 'src/hooks/useLanguage.ts',
    description: 'Hook for language/locale management',
    keyPoints: [
      'Integrates with Lingui i18n',
      'useCallback for memoized async function',
      'Persists to localStorage',
      'Returns object with state + action',
    ],
  },
};
