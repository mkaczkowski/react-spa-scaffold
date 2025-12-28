/**
 * Feature Registry - Defines all available features for webapp-base scaffolding
 */

import type { Feature, FeatureRegistry } from "./types.js";
import { CONFIG_VERSIONS } from "./versions.js";

// ═══════════════════════════════════════════════════════════════════════════
// CORE FEATURE (Always included)
// ═══════════════════════════════════════════════════════════════════════════

const core: Feature = {
  name: "Core",
  description: "React 19 + TypeScript + Vite 7 + Tailwind CSS v4",
  required: true,
  includes: [
    "React 19 with TypeScript (~5.9.0)",
    "Vite 7 build system",
    "Tailwind CSS v4 with Vite plugin",
    "Inter variable font (@fontsource-variable/inter)",
    "Environment validation with Zod (src/lib/env.ts)",
    "Format utilities - date, number, currency, bytes (src/lib/format.ts)",
    "cn() class merge utility (clsx + tailwind-merge)",
    "Basic SEO component (React 19 native head hoisting)",
    "Mobile/responsive context and hooks",
    "App configuration (src/lib/config.ts)",
    "Constants and type definitions",
  ],
  dependencies: {
    "@fontsource-variable/inter": "^5.2.5",
    clsx: "^2.1.1",
    react: "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwind-merge": "^3.3.0",
    zod: "^3.25.64",
  },
  devDependencies: {
    "@tailwindcss/vite": "^4.1.17",
    "@types/node": "^22.15.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^5.1.2",
    "@webapp-base/tsconfig": CONFIG_VERSIONS["@webapp-base/tsconfig"],
    tailwindcss: "^4.1.17",
    typescript: "~5.9.0",
    vite: "^7.0.0",
  },
  files: [
    "src/main.tsx",
    "src/App.tsx",
    "src/index.css",
    "src/vite-env.d.ts",
    "src/lib/config.ts",
    "src/lib/constants.ts",
    "src/lib/env.ts",
    "src/lib/format.ts",
    "src/lib/utils.ts",
    "src/lib/index.ts",
    "src/types/index.ts",
    "src/contexts/mobileContext.tsx",
    "src/hooks/useMediaQuery.ts",
    "src/hooks/useTouchSizes.ts",
    "src/hooks/index.ts",
    "src/components/shared/SEO/SEO.tsx",
    "src/components/shared/SEO/index.ts",
    "index.html",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    ".env.example",
    "public/favicon.svg",
    "CLAUDE.md",
  ],
  patterns: [
    "component-shared",
    "hook-state",
    "hook-effect",
    "context-provider",
  ],
  scripts: {
    dev: "vite",
    build: "tsc -b && vite build",
    preview: "vite preview",
    typecheck: "tsc --noEmit",
  },
  configFiles: [
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
  ],
  options: {
    errorTracking: {
      description: "Sentry integration (lazy-loaded)",
      default: false,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ROUTING FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const routing: Feature = {
  name: "Routing",
  description: "React Router 7 with lazy loading and route constants",
  required: false,
  includes: [
    "React Router 7",
    "Lazy-loaded pages with React.lazy()",
    "Route constants with TypeScript types (src/lib/routes.ts)",
    "404 Not Found page",
    "App.tsx with Suspense fallback",
    "PageLoading component for transitions",
  ],
  dependencies: {
    "react-router": "^7.11.0",
  },
  devDependencies: {},
  files: [
    "src/lib/routes.ts",
    "src/pages/Home.tsx",
    "src/pages/NotFound.tsx",
    "src/pages/index.ts",
    "src/components/ui/loading.tsx",
    "src/components/ui/visually-hidden.tsx",
  ],
  patterns: ["lazy-page", "route-constants", "page-component"],
  scripts: {},
};

// ═══════════════════════════════════════════════════════════════════════════
// UI COMPONENTS FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const ui: Feature = {
  name: "UI Components",
  description: "Shadcn/UI + icons + animations + toasts + theming",
  required: false,
  includes: [
    "Shadcn/UI component system (radix-nova style)",
    "Radix UI primitives",
    "CVA (class-variance-authority) for variants",
    "Lucide React icons",
    "tw-animate-css for animations",
    "Sonner toast notifications",
    "Button with variants (default, destructive, outline, etc.)",
    "DropdownMenu component",
    "Loading, Skeleton, Spinner components",
    "VisuallyHidden and SkipLink (accessibility)",
    "Theme toggle (light/dark/system)",
    "useThemeEffect hook",
    "components.json for shadcn CLI",
  ],
  dependencies: {
    "@radix-ui/react-slot": "^1.2.3",
    "class-variance-authority": "^0.7.1",
    "lucide-react": "^0.562.0",
    "radix-ui": "^1.4.3",
    sonner: "^2.0.7",
    "tw-animate-css": "^1.2.9",
  },
  devDependencies: {
    shadcn: "^3.6.2",
  },
  files: [
    "src/components/ui/button.tsx",
    "src/components/ui/dropdown-menu.tsx",
    "src/components/ui/loading.tsx",
    "src/components/ui/skeleton.tsx",
    "src/components/ui/spinner.tsx",
    "src/components/ui/sonner.tsx",
    "src/components/ui/visually-hidden.tsx",
    "src/components/shared/ThemeToggle/ThemeToggle.tsx",
    "src/components/shared/ThemeToggle/index.ts",
    "src/components/layout/Header.tsx",
    "src/components/layout/index.ts",
    "src/hooks/useThemeEffect.ts",
    "components.json",
  ],
  patterns: [
    "component-ui",
    "button-variants",
    "forward-ref-component",
    "theme-toggle",
  ],
  scripts: {},
  requiresFeatures: ["state"], // Theme toggle needs preferences store
};

// ═══════════════════════════════════════════════════════════════════════════
// FORMS FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const forms: Feature = {
  name: "Form Handling",
  description: "React Hook Form + Zod validation + error components",
  required: false,
  includes: [
    "React Hook Form",
    "Zod schema validation",
    "@hookform/resolvers for Zod integration",
    "Form error components (FieldErrorMessage, FormErrorSummary, RootFormError)",
    "Example useContactForm hook",
    "Example validation schemas (contact, register)",
    "Type-safe form data inference",
  ],
  dependencies: {
    "@hookform/resolvers": "^5.0.1",
    "react-hook-form": "^7.58.0",
    // zod already in core
  },
  devDependencies: {},
  files: [
    "src/lib/validations.ts",
    "src/hooks/useContactForm.ts",
    "src/components/ui/form-error.tsx",
  ],
  patterns: ["zod-schema", "use-form-hook", "form-error-component"],
  scripts: {},
};

// ═══════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const state: Feature = {
  name: "State Management",
  description: "Zustand with persistence, devtools, and multi-tab sync",
  required: false,
  includes: [
    "Zustand store",
    "Persist middleware (localStorage)",
    "Devtools middleware",
    "Multi-tab sync utility (initPreferencesSync)",
    "Storage utilities (get/set/remove/clear)",
    "Prefixed storage keys",
    "Example preferences store (theme)",
    "Type-safe store selectors",
  ],
  dependencies: {
    zustand: "^5.0.9",
  },
  devDependencies: {},
  files: [
    "src/stores/preferencesStore.ts",
    "src/stores/index.ts",
    "src/lib/storage.ts",
    "src/lib/storageKeys.ts",
    "src/types/preferences.ts",
  ],
  patterns: [
    "zustand-store",
    "store-persistence",
    "multi-tab-sync",
    "storage-utility",
  ],
  scripts: {},
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA FETCHING FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const data: Feature = {
  name: "Data Fetching",
  description: "TanStack Query + typed API client",
  required: false,
  includes: [
    "TanStack Query v5",
    "QueryProvider with optimized defaults (staleTime, gcTime, retry)",
    "Typed API client with methods (get/post/put/patch/delete)",
    "ApiClientError class with status and code",
    "Request timeout handling",
    "Example useExampleQuery hook",
    "API types (Todo, PaginatedResponse, etc.)",
  ],
  dependencies: {
    "@tanstack/react-query": "^5.81.5",
  },
  devDependencies: {},
  files: [
    "src/lib/api.ts",
    "src/contexts/queryContext.tsx",
    "src/hooks/useExampleQuery.ts",
    "src/types/api.ts",
  ],
  patterns: ["query-provider", "use-query-hook", "api-client"],
  scripts: {},
};

// ═══════════════════════════════════════════════════════════════════════════
// INTERNATIONALIZATION FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const i18n: Feature = {
  name: "Internationalization",
  description: "LinguiJS with dynamic loading and language detection",
  required: false,
  includes: [
    "LinguiJS (core + react + macro)",
    "Trans component for JSX text",
    "t() function for programmatic text",
    "Dynamic catalog loading (code splitting per locale)",
    "Browser language detection",
    "Language switcher component",
    "ESLint rule for translator comments (enforced)",
    "Locale files (.po format) for en, es, de",
    "Vite plugin for compilation",
    "useLanguage hook",
  ],
  dependencies: {
    "@lingui/core": "^5.7.0",
    "@lingui/react": "^5.7.0",
  },
  devDependencies: {
    "@lingui/babel-plugin-lingui-macro": "^5.7.0",
    "@lingui/cli": "^5.7.0",
    "@lingui/vite-plugin": "^5.7.0",
    "babel-plugin-macros": "^3.1.0",
    "eslint-plugin-lingui": "^0.11.0",
  },
  files: [
    "src/i18n/config.ts",
    "src/i18n/detectLanguage.ts",
    "src/i18n/loadCatalog.ts",
    "src/i18n/index.ts",
    "src/locales/en.po",
    "src/locales/es.po",
    "src/locales/de.po",
    "src/hooks/useLanguage.ts",
    "src/components/shared/LanguageSwitcher/LanguageSwitcher.tsx",
    "src/components/shared/LanguageSwitcher/index.ts",
    "lingui.config.js",
  ],
  patterns: [
    "trans-component",
    "t-function",
    "language-switcher",
    "use-language-hook",
  ],
  scripts: {
    "i18n:extract": "lingui extract",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// TESTING FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const testing: Feature = {
  name: "Testing",
  description: "Vitest + Testing Library + Playwright + MSW",
  required: false,
  includes: [
    "Vitest for unit testing",
    "React Testing Library",
    "@testing-library/user-event for interactions",
    "Playwright for E2E testing (Chromium)",
    "MSW (Mock Service Worker) for API mocking",
    "Test utilities (render, providers, mocks)",
    "80% coverage threshold (lines, functions, statements, branches)",
    "jsdom environment",
    "Example tests for components, hooks, stores, utilities",
    "MSW handlers for API endpoints",
    "Test fixtures for mock data",
  ],
  dependencies: {},
  devDependencies: {
    "@playwright/test": "^1.52.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@vitest/coverage-v8": "^4.0.16",
    jsdom: "^27.3.0",
    msw: "^2.12.4",
    vitest: "^4.0.16",
  },
  files: [
    "src/test-setup.ts",
    "src/test/mocks.ts",
    "src/test/providers.tsx",
    "src/test/index.ts",
    "src/mocks/handlers/todos.ts",
    "src/mocks/handlers/index.ts",
    "src/mocks/fixtures/todos.ts",
    "src/mocks/fixtures/index.ts",
    "src/mocks/node.ts",
    "src/mocks/index.ts",
    "tests/unit/",
    "e2e/tests/",
    "vitest.config.ts",
    "playwright.config.ts",
  ],
  patterns: [
    "test-component",
    "test-hook",
    "test-store",
    "test-utility",
    "msw-handler",
    "test-fixture",
  ],
  scripts: {
    test: "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    e2e: "playwright test",
    "e2e:ui": "playwright test --ui",
  },
  configFiles: ["vitest.config.ts", "playwright.config.ts"],
};

// ═══════════════════════════════════════════════════════════════════════════
// DEVELOPER TOOLING FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const devtools: Feature = {
  name: "Developer Tooling",
  description:
    "ESLint + Prettier + Husky + Commitlint (using @webapp-base shared configs)",
  required: false,
  includes: [
    "@webapp-base/eslint-config (React + TypeScript + LinguiJS)",
    "@webapp-base/prettier-config (with Tailwind plugin)",
    "ESLint with TypeScript and React Hooks plugins",
    "eslint-plugin-react-refresh for HMR",
    "Prettier with Tailwind CSS plugin",
    "Husky for git hooks",
    "lint-staged for pre-commit linting",
    "Commitlint for conventional commits",
    ".nvmrc for Node.js version (22)",
    "Pre-commit hook: typecheck + lint-staged",
    "Commit-msg hook: commitlint",
  ],
  dependencies: {},
  devDependencies: {
    "@commitlint/config-conventional": "^20.2.0",
    "@eslint/js": "^9.28.0",
    "@webapp-base/eslint-config": CONFIG_VERSIONS["@webapp-base/eslint-config"],
    "@webapp-base/prettier-config":
      CONFIG_VERSIONS["@webapp-base/prettier-config"],
    commitlint: "^20.2.0",
    eslint: "^9.28.0",
    "eslint-config-prettier": "^10.1.0",
    "eslint-plugin-lingui": "^0.11.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    husky: "^9.1.7",
    "lint-staged": "^16.1.0",
    prettier: "^3.5.3",
    "prettier-plugin-tailwindcss": "^0.7.2",
    "typescript-eslint": "^8.33.0",
  },
  files: [
    "eslint.config.js",
    "prettier.config.js",
    "commitlint.config.js",
    ".husky/pre-commit",
    ".husky/commit-msg",
    ".nvmrc",
  ],
  patterns: [],
  scripts: {
    lint: "eslint .",
    "lint:fix": "eslint . --fix",
    format: "prettier --write .",
    "format:check": "prettier --check .",
    prepare: "husky",
  },
  configFiles: [
    "eslint.config.js",
    "prettier.config.js",
    "commitlint.config.js",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// CI/CD FEATURE
// ═══════════════════════════════════════════════════════════════════════════

const ci: Feature = {
  name: "CI/CD",
  description: "GitHub Actions + Lighthouse + Dependabot",
  required: false,
  requiresFeatures: ["devtools", "testing"],
  includes: [
    "GitHub Actions CI workflow",
    "Parallel jobs: lint, typecheck, security audit, build, unit tests, e2e tests",
    "Lighthouse CI with performance budgets",
    "Dependabot with grouped updates by category",
    "PR template",
    "Artifact uploads (dist, coverage, lighthouse reports)",
    "Dependency caching for faster builds",
    "Custom setup-node-deps action",
  ],
  dependencies: {},
  devDependencies: {},
  files: [
    ".github/workflows/ci.yml",
    ".github/actions/setup-node-deps/action.yml",
    ".github/dependabot.yml",
    ".github/PULL_REQUEST_TEMPLATE.md",
    "lighthouserc.json",
    "lighthouse-budget.json",
  ],
  patterns: [],
  scripts: {},
  configFiles: ["lighthouserc.json", "lighthouse-budget.json"],
};

// ═══════════════════════════════════════════════════════════════════════════
// FEATURE REGISTRY EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const FEATURES: FeatureRegistry = {
  core,
  routing,
  ui,
  forms,
  state,
  data,
  i18n,
  testing,
  devtools,
  ci,
};

export const FEATURE_IDS = Object.keys(FEATURES) as (keyof typeof FEATURES)[];
