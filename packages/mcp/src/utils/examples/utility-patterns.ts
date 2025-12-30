import type { PatternMap } from './types.js';

export const utilityPatterns: PatternMap = {
  'zod-schema': {
    file: 'src/lib/validations.ts',
    description: 'Zod validation schemas with type inference',
    keyPoints: [
      'z.object() for form schemas',
      'Chained validations (min, max, email, regex)',
      'Custom error messages',
      'Type inference with z.infer<>',
      'refine() for cross-field validation (password confirmation)',
    ],
  },
  'form-error-component': {
    file: 'src/components/ui/form-error.tsx',
    description: 'Form error display components',
    keyPoints: [
      'FieldErrorMessage for single field',
      'FormErrorSummary for all errors',
      'RootFormError for form-level errors',
      'Integrates with react-hook-form types',
    ],
  },
  'register-form': {
    file: 'src/components/shared/RegisterForm/RegisterForm.tsx',
    description: 'Complete form component with validation',
    keyPoints: [
      'Uses useRegisterForm custom hook',
      'Inline error display with FieldErrorMessage',
      'form.register() for input binding',
      'Disabled submit during isSubmitting',
      'Lingui Trans for i18n labels',
      'Demonstrates cross-field validation UX',
    ],
  },
  'theme-toggle': {
    file: 'src/components/shared/ThemeToggle/ThemeToggle.tsx',
    description: 'Theme toggle with system preference',
    keyPoints: [
      'Three modes: light, dark, system',
      'Zustand store for persistence',
      'getResolvedTheme() for actual value',
      'Icon changes based on resolved theme',
    ],
  },
  'main-entry': {
    file: 'src/main.tsx',
    description: 'Application entry point with Sentry initialization',
    keyPoints: [
      'Lazy Sentry initialization with requestIdleCallback for web vitals',
      'Global error handlers (window.onerror, onunhandledrejection)',
      'i18n initialization before render',
      'Provider hierarchy: Query → I18n → Router → Mobile → ErrorBoundary',
      'Multi-tab preferences sync with HMR cleanup',
    ],
  },
  'lib-config': {
    file: 'src/lib/config.ts',
    description: 'Centralized application configuration',
    keyPoints: [
      'APP_CONFIG for app name and URL',
      'SENTRY_CONFIG with enabled flag, DSN, and tracesSampleRate',
      'Environment variables with fallback defaults',
      'as const for type inference',
    ],
  },
  'profiler-wrapper': {
    file: 'src/contexts/performanceContext.tsx',
    description: 'React Profiler wrapper component',
    keyPoints: ['Wraps children with React.Profiler', 'Captures render timing', 'Only active in development'],
  },
  'performance-e2e': {
    file: 'e2e/performance/setup.ts',
    description: 'Performance E2E test setup',
    keyPoints: ['Lighthouse integration', 'Chrome launcher setup', 'Web Vitals assertions'],
  },
};
