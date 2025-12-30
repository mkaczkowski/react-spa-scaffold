/**
 * Feature Registry - Defines all available features for react-spa-scaffold scaffolding
 *
 * Dependencies are specified as names only. Versions are resolved from the
 * webapp-base package.json at runtime to ensure scaffolded projects always
 * get up-to-date dependency versions.
 */

import type { Feature, FeatureRegistry, FeatureId } from './types.js';

// ═══════════════════════════════════════════════════════════════════════════
// CORE FEATURE (Always included)
// ═══════════════════════════════════════════════════════════════════════════

const core: Feature = {
  name: 'Core',
  description: 'React 19 + TypeScript + Vite 7 + Tailwind CSS v4',
  required: true,
  includes: [
    'React 19 with TypeScript (~5.9.0)',
    'Vite 7 build system',
    'Tailwind CSS v4 with Vite plugin',
    'Inter variable font (@fontsource-variable/inter)',
    'Environment validation with Zod (src/lib/env.ts)',
    'cn() class merge utility (clsx + tailwind-merge)',
    'Basic SEO component (React 19 native head hoisting)',
    'App configuration (src/lib/config.ts)',
    'Type definitions',
    'ErrorBoundary component with reset functionality',
  ],
  dependencyNames: ['@fontsource-variable/inter', 'clsx', 'react', 'react-dom', 'tailwind-merge', 'zod'],
  devDependencyNames: [
    '@tailwindcss/vite',
    '@types/node',
    '@types/react',
    '@types/react-dom',
    '@vitejs/plugin-react',
    '@react-spa-scaffold/tsconfig',
    'tailwindcss',
    'typescript',
    'vite',
  ],
  files: [
    'src/main.tsx',
    'src/App.tsx',
    'src/index.css',
    'src/vite-env.d.ts',
    'src/lib/config.ts',
    'src/lib/env.ts',
    'src/lib/utils.ts',
    'src/lib/index.ts',
    'src/types/index.ts',
    'src/hooks/index.ts',
    'src/components/shared/SEO/SEO.tsx',
    'src/components/shared/SEO/index.ts',
    'src/components/shared/ErrorBoundary/ErrorBoundary.tsx',
    'src/components/shared/ErrorBoundary/index.ts',
    'src/components/shared/index.ts',
    'index.html',
    'vite.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    '.env.example',
    '.gitignore',
    'public/favicon.svg',
  ],
  testFiles: [
    'src/lib/utils.test.ts',
    'src/components/shared/SEO/SEO.test.tsx',
    'src/components/shared/ErrorBoundary/ErrorBoundary.test.tsx',
    'e2e/tests/home.spec.ts',
  ],
  patterns: ['component-shared', 'hook-effect', 'error-boundary', 'seo-component'],
  scripts: {
    dev: 'vite',
    build: 'tsc -b && vite build',
    preview: 'vite preview',
    typecheck: 'tsc --noEmit',
  },
  configFiles: [
    'vite.config.ts',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    '.gitignore',
    'src/index.css',
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const mobile: Feature = {
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
  // No additional dependencies - pure React implementation
  files: ['src/contexts/mobileContext.tsx', 'src/hooks/useMediaQuery.ts', 'src/hooks/useTouchSizes.ts'],
  testFiles: ['src/contexts/mobileContext.test.tsx', 'src/hooks/useMediaQuery.test.ts'],
  patterns: ['mobile-context', 'use-media-query', 'use-touch-sizes'],
  scripts: {},
};

// ═══════════════════════════════════════════════════════════════════════════
// ROUTING FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const routing: Feature = {
  name: 'Routing',
  description: 'React Router 7 with lazy loading and route constants',
  required: false,
  includes: [
    'React Router 7',
    'Lazy-loaded pages with React.lazy()',
    'Route constants with TypeScript types (generated based on features)',
    '404 Not Found page',
    'App.tsx with Suspense fallback',
    'PageLoading component for transitions',
  ],
  dependencyNames: ['react-router'],
  files: [
    // routes.ts is generated dynamically (see routesTs in scaffold output)
    'src/pages/Home.tsx',
    'src/pages/NotFound.tsx',
    'src/pages/index.ts',
    'src/components/ui/loading.tsx',
    'src/components/ui/visually-hidden.tsx',
  ],
  testFiles: ['e2e/tests/navigation.spec.ts'],
  patterns: ['lazy-page', 'route-constants', 'page-component'],
  scripts: {},
};

// ═══════════════════════════════════════════════════════════════════════════
// UI COMPONENTS FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const ui: Feature = {
  name: 'UI Components',
  description: 'Shadcn/UI + icons + animations + toasts',
  required: false,
  includes: [
    'Shadcn/UI component system (radix-nova style)',
    'Radix UI primitives',
    'CVA (class-variance-authority) for variants',
    'Lucide React icons',
    'tw-animate-css for animations',
    'Sonner toast notifications',
    'Button with variants (default, destructive, outline, etc.)',
    'DropdownMenu component',
    'Loading, Skeleton, Spinner components',
    'VisuallyHidden and SkipLink (accessibility)',
    'components.json for shadcn CLI',
  ],
  dependencyNames: [
    '@radix-ui/react-slot',
    'class-variance-authority',
    'lucide-react',
    'radix-ui',
    'sonner',
    'tw-animate-css',
  ],
  devDependencyNames: ['shadcn'],
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
  patterns: ['component-ui', 'button-variants', 'forward-ref-component'],
  scripts: {},
  configFiles: ['components.json'],
};

// ═══════════════════════════════════════════════════════════════════════════
// FORMS FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const forms: Feature = {
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
  dependencyNames: [
    '@hookform/resolvers',
    'react-hook-form',
    // zod already in core
  ],
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
  patterns: ['zod-schema', 'hook-form', 'form-error-component', 'register-form'],
  scripts: {},
};

// ═══════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const state: Feature = {
  name: 'State Management',
  description: 'Zustand with persistence, devtools, and multi-tab sync',
  required: false,
  includes: [
    'Zustand store',
    'Persist middleware (localStorage)',
    'Devtools middleware',
    'Multi-tab sync utility (initPreferencesSync)',
    'Storage utilities (get/set/remove/clear)',
    'Prefixed storage keys',
    'Example preferences store (theme)',
    'Type-safe store selectors',
  ],
  dependencyNames: ['zustand'],
  files: [
    'src/stores/preferencesStore.ts',
    'src/stores/index.ts',
    'src/lib/storage.ts',
    'src/lib/storageKeys.ts',
    'src/types/preferences.ts',
  ],
  testFiles: ['src/lib/storage.test.ts', 'src/stores/preferencesStore.test.ts'],
  patterns: ['zustand-store', 'store-persistence', 'multi-tab-sync', 'storage-utility'],
  scripts: {},
};

// ═══════════════════════════════════════════════════════════════════════════
// API FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const api: Feature = {
  name: 'API',
  description: 'TanStack Query + typed API client',
  required: false,
  includes: [
    'TanStack Query v5',
    'QueryProvider with optimized defaults (staleTime, gcTime, retry)',
    'Typed API client with methods (get/post/put/patch/delete)',
    'ApiClientError class with status and code',
    'Request timeout handling',
    'Example useExampleQuery hook',
    'API types (Todo, PaginatedResponse, etc.)',
  ],
  dependencyNames: ['@tanstack/react-query'],
  files: ['src/lib/api.ts', 'src/contexts/queryContext.tsx', 'src/hooks/useExampleQuery.ts', 'src/types/api.ts'],
  testFiles: ['src/lib/api.test.ts', 'src/hooks/useExampleQuery.test.tsx'],
  patterns: ['query-provider', 'use-query-hook', 'api-client'],
  scripts: {},
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERNATIONALIZATION FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const i18n: Feature = {
  name: 'Internationalization',
  description: 'LinguiJS with dynamic loading and language detection',
  required: false,
  includes: [
    'LinguiJS (core + react + macro)',
    'Trans component for JSX text',
    't() function for programmatic text',
    'Dynamic catalog loading (code splitting per locale)',
    'Browser language detection',
    'Language switcher component',
    'ESLint rule for translator comments (enforced)',
    'Locale files (.po format) for en, es, de',
    'Vite plugin for compilation',
    'useLanguage hook',
  ],
  dependencyNames: ['@lingui/core', '@lingui/react'],
  devDependencyNames: [
    '@lingui/babel-plugin-lingui-macro',
    '@lingui/cli',
    '@lingui/vite-plugin',
    'babel-plugin-macros',
    'eslint-plugin-lingui',
  ],
  files: [
    'src/i18n/config.ts',
    'src/i18n/detectLanguage.ts',
    'src/i18n/loadCatalog.ts',
    'src/i18n/index.ts',
    'src/locales/en.po',
    'src/locales/es.po',
    'src/locales/de.po',
    'src/hooks/useLanguage.ts',
    'src/components/shared/LanguageSwitcher/LanguageSwitcher.tsx',
    'src/components/shared/LanguageSwitcher/index.ts',
    'lingui.config.js',
  ],
  testFiles: [
    'src/i18n/detectLanguage.test.ts',
    'src/i18n/loadCatalog.test.ts',
    'src/hooks/useLanguage.test.tsx',
    'src/components/shared/LanguageSwitcher/LanguageSwitcher.test.tsx',
    'e2e/tests/language.spec.ts',
  ],
  patterns: ['i18n-index', 'trans-component', 't-function', 'language-switcher', 'use-language-hook'],
  scripts: {
    'i18n:extract': 'lingui extract',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TESTING FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const testing: Feature = {
  name: 'Testing',
  description: 'Vitest + Testing Library + Playwright + MSW',
  required: false,
  includes: [
    'Vitest for unit testing',
    'React Testing Library',
    '@testing-library/user-event for interactions',
    'Playwright for E2E testing (Chromium)',
    'MSW (Mock Service Worker) for API mocking',
    'Test utilities (render, providers, mocks)',
    '80% coverage threshold (lines, functions, statements, branches)',
    'jsdom environment',
    'Example tests for components, hooks, stores, utilities',
    'MSW handlers for API endpoints',
    'Test fixtures for mock data',
  ],
  devDependencyNames: [
    '@playwright/test',
    '@testing-library/jest-dom',
    '@testing-library/react',
    '@testing-library/user-event',
    '@vitest/coverage-v8',
    'jsdom',
    'msw',
    'vitest',
  ],
  files: [
    'src/test-setup.ts',
    'src/test/mocks.ts',
    'src/test/providers.tsx',
    'src/test/index.ts',
    'src/mocks/handlers/todos.ts',
    'src/mocks/handlers/index.ts',
    'src/mocks/fixtures/todos.ts',
    'src/mocks/fixtures/index.ts',
    'src/mocks/node.ts',
    'src/mocks/index.ts',
    'e2e/fixtures/',
    'e2e/tests/',
    'vitest.config.ts',
    'playwright.config.ts',
    'docs/TESTING.md',
    'docs/E2E_TESTING.md',
  ],
  patterns: ['test-component', 'test-hook', 'test-store', 'test-utility', 'msw-handler', 'test-fixture'],
  scripts: {
    test: 'vitest run',
    'test:watch': 'vitest',
    'test:coverage': 'vitest run --coverage',
    e2e: 'playwright test --project=functional',
    'e2e:ui': 'playwright test --project=functional --ui',
  },
  configFiles: ['vitest.config.ts', 'playwright.config.ts', 'src/test-setup.ts'],
};

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTING FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const performance: Feature = {
  name: 'Performance Testing',
  description: 'React Profiler + Lighthouse + Web Vitals via react-performance-tracking',
  required: false,
  includes: [
    'react-performance-tracking for unified performance testing',
    'React Profiler metrics (render duration, re-renders)',
    'Lighthouse audits (performance, accessibility, best practices)',
    'Core Web Vitals (LCP, INP, CLS)',
    'FPS monitoring (Chromium only)',
    'PerformanceProviderWrapper with lazy loading (zero prod overhead)',
    'Safe usePerformance hook (never throws)',
    'Separate Playwright project for performance tests',
    'CI-optimized Chrome flags (--no-sandbox)',
  ],
  dependencyNames: ['react-performance-tracking'],
  devDependencyNames: ['chrome-launcher', 'lighthouse'],
  files: ['src/contexts/performanceContext.tsx', 'e2e/performance/setup.ts'],
  testFiles: ['e2e/performance/home.spec.ts', 'src/contexts/performanceContext.test.tsx'],
  patterns: ['performance-context', 'performance-e2e', 'profiler-wrapper'],
  scripts: {
    'e2e:perf': 'PERF_TEST=true playwright test --project=performance',
    'e2e:perf:ui': 'PERF_TEST=true playwright test --project=performance --ui',
    'e2e:all': 'PERF_TEST=true playwright test',
  },
  configFiles: [],
};

// ═══════════════════════════════════════════════════════════════════════════
// DEVELOPER TOOLING FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const devtools: Feature = {
  name: 'Developer Tooling',
  description: 'ESLint + Prettier + Husky + Commitlint (using @react-spa-scaffold shared configs)',
  required: false,
  includes: [
    '@react-spa-scaffold/eslint-config (React + TypeScript + LinguiJS)',
    '@react-spa-scaffold/prettier-config (with Tailwind plugin)',
    'ESLint with TypeScript and React Hooks plugins',
    'eslint-plugin-react-refresh for HMR',
    'Prettier with Tailwind CSS plugin',
    'Husky for git hooks',
    'lint-staged for pre-commit linting',
    'Commitlint for conventional commits',
    '.nvmrc for Node.js version (22)',
    'Pre-commit hook: typecheck + lint-staged',
    'Commit-msg hook: commitlint',
  ],
  devDependencyNames: [
    '@commitlint/config-conventional',
    '@eslint/js',
    '@react-spa-scaffold/eslint-config',
    '@react-spa-scaffold/prettier-config',
    'commitlint',
    'eslint',
    'eslint-config-prettier',
    'eslint-plugin-lingui',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
    'husky',
    'lint-staged',
    'prettier',
    'prettier-plugin-tailwindcss',
    'typescript-eslint',
  ],
  files: [
    'eslint.config.js',
    'prettier.config.js',
    'commitlint.config.js',
    '.husky/pre-commit',
    '.husky/commit-msg',
    '.nvmrc',
  ],
  patterns: [],
  scripts: {
    lint: 'eslint .',
    'lint:fix': 'eslint . --fix',
    format: 'prettier --write .',
    'format:check': 'prettier --check .',
    prepare: 'husky',
  },
  configFiles: ['eslint.config.js', 'prettier.config.js', 'commitlint.config.js'],
};

// ═══════════════════════════════════════════════════════════════════════════
// CI/CD FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const ci: Feature = {
  name: 'CI/CD',
  description: 'GitHub Actions + Performance Testing + Dependabot',
  required: false,
  includes: [
    'GitHub Actions CI workflow',
    'Parallel jobs: lint, typecheck, security audit, build, unit tests, e2e tests, performance tests',
    'Performance testing with react-performance-tracking (React Profiler, Lighthouse, Web Vitals)',
    'Dependabot with grouped updates by category',
    'PR template',
    'Artifact uploads (dist, coverage, performance reports)',
    'Dependency caching for faster builds',
    'Custom setup-node-deps action',
  ],
  // No additional dependencies - CI configuration only
  files: [
    '.github/workflows/ci.yml',
    '.github/actions/setup-node-deps/action.yml',
    '.github/dependabot.yml',
    '.github/PULL_REQUEST_TEMPLATE.md',
  ],
  patterns: [],
  scripts: {},
  configFiles: [],
};

// ═══════════════════════════════════════════════════════════════════════════
// OBSERVABILITY FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const observability: Feature = {
  name: 'Observability',
  description: 'Sentry error tracking with source maps (opt-out via VITE_SENTRY_ENABLED=false)',
  required: false,
  includes: [
    'Sentry React SDK (@sentry/react)',
    'Lazy-loaded Sentry initialization (non-blocking)',
    'Browser tracing integration',
    'Global error handlers (window.onerror, unhandledrejection)',
    'ErrorBoundary integration with Sentry reporting',
    'Source map upload via Vite plugin (CI/CD)',
    'VITE_SENTRY_ENABLED flag for opt-out',
    'SENTRY_CONFIG in lib/config.ts',
  ],
  dependencyNames: ['@sentry/react'],
  devDependencyNames: ['@sentry/vite-plugin'],
  files: ['src/lib/config.ts'],
  patterns: ['main-entry', 'lib-config'],
  scripts: {},
};

// ═══════════════════════════════════════════════════════════════════════════
// THEMING FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const theming: Feature = {
  name: 'Theming',
  description: 'Light/dark/system theme toggle with CSS variables (requires state feature)',
  required: false,
  includes: [
    'Light/dark/system theme modes',
    'useThemeEffect hook (applies .dark class to document)',
    'ThemeToggle component',
    'System preference detection (prefers-color-scheme)',
    'Zustand persistence via preferencesStore',
    'Multi-tab sync via storage events',
  ],
  // No additional dependencies - uses state feature's Zustand
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

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE REGISTRY EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const FEATURES: FeatureRegistry = {
  core,
  mobile,
  routing,
  ui,
  forms,
  state,
  api,
  i18n,
  testing,
  performance,
  devtools,
  ci,
  observability,
  theming,
};

// Re-export FeatureId from types for convenience
export type { FeatureId };
