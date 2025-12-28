/**
 * Code example utilities
 *
 * Maps pattern types to actual files in the webapp-base repository.
 * When the MCP server runs, it reads these files to provide real,
 * working examples to AI agents.
 */

import { readFile } from "fs/promises";

import { resolveTemplatePath } from "./paths.js";

export interface CodeExample {
  pattern: string;
  description: string;
  filePath: string;
  code: string;
  keyPoints: string[];
}

/**
 * Pattern to file mapping
 */
const PATTERN_MAP: Record<
  string,
  {
    file: string;
    description: string;
    keyPoints: string[];
  }
> = {
  // Component patterns
  "component-ui": {
    file: "src/components/ui/button.tsx",
    description: "Shadcn/UI component with CVA variants and forwardRef",
    keyPoints: [
      "Uses forwardRef for ref forwarding",
      "CVA (class-variance-authority) for style variants",
      "cn() utility for class merging",
      "Named export (not default)",
      "Props interface extends HTML attributes + VariantProps",
      'Radix Slot for polymorphic "asChild" prop',
    ],
  },
  "component-shared": {
    file: "src/components/shared/ThemeToggle/ThemeToggle.tsx",
    description: "Shared feature component with store integration",
    keyPoints: [
      "Named function export",
      "Located in subdirectory with index.ts barrel",
      "Uses Zustand store with selectors",
      "Integrates with Lingui i18n (t() function)",
      "Composes UI components (Button, icons)",
    ],
  },
  "component-layout": {
    file: "src/components/layout/Header.tsx",
    description: "Layout component for page structure",
    keyPoints: [
      "Named function export",
      "Uses Tailwind container pattern",
      "Composes shared components",
      "Trans component for i18n text",
      "No props (stateless layout)",
    ],
  },

  // Hook patterns
  "hook-state": {
    file: "src/hooks/useMediaQuery.ts",
    description: "State hook with browser API and cleanup",
    keyPoints: [
      "useRef for persistent MediaQueryList",
      "useState with SSR-safe initialization",
      "useEffect with cleanup function",
      "Exports constants alongside hook (BREAKPOINTS)",
      "Convenience wrapper hooks (useIsMobile, useIsDesktop)",
    ],
  },
  "hook-query": {
    file: "src/hooks/useExampleQuery.ts",
    description: "TanStack Query hook for data fetching",
    keyPoints: [
      "Separate async fetchFn outside hook",
      "Typed with generics (useQuery<Todo[]>)",
      "Namespaced queryKey array",
      "Uses centralized API client",
    ],
  },
  "hook-form": {
    file: "src/hooks/useContactForm.ts",
    description: "React Hook Form + Zod validation hook",
    keyPoints: [
      "zodResolver for Zod integration",
      "Type-safe with inferred ContactFormData",
      "Returns form object + handlers",
      "Extracts commonly used state (isSubmitting, errors)",
    ],
  },
  "hook-effect": {
    file: "src/hooks/useThemeEffect.ts",
    description: "Effect-only hook with no return value",
    keyPoints: [
      "useEffect with conditional listener",
      "Zustand store subscription",
      "Cleanup function for event listener",
      "DOM manipulation (classList)",
    ],
  },
  "use-language-hook": {
    file: "src/hooks/useLanguage.ts",
    description: "Hook for language/locale management",
    keyPoints: [
      "Integrates with Lingui i18n",
      "useCallback for memoized async function",
      "Persists to localStorage",
      "Returns object with state + action",
    ],
  },

  // Mobile patterns
  "mobile-context": {
    file: "src/contexts/mobileContext.tsx",
    description:
      "Mobile viewport detection context with optimized resize handling",
    keyPoints: [
      "MobileProvider tracks viewport width via window.innerWidth",
      "useMobileContext hook returns isMobile, isTablet, isDesktop, width",
      "requestAnimationFrame debouncing for performance",
      "Only re-renders when width actually changes",
      "SSR-safe with BREAKPOINTS.lg fallback",
      "Throws error when used outside provider",
    ],
  },
  "use-media-query": {
    file: "src/hooks/useMediaQuery.ts",
    description: "Media query hook with breakpoint constants",
    keyPoints: [
      "BREAKPOINTS: sm (640), md (768), lg (1024), xl (1280)",
      "useMediaQuery(query) for custom media queries",
      "useIsMobile() returns true if width < md breakpoint",
      "useIsDesktop() returns true if width >= lg breakpoint",
      "Uses useRef to persist MediaQueryList object",
      "SSR-safe initialization",
    ],
  },
  "use-touch-sizes": {
    file: "src/hooks/useTouchSizes.ts",
    description: "Touch-aware component sizing hook",
    keyPoints: [
      "Returns size variants based on device type (mobile vs desktop)",
      "Integrates with MobileProvider via useMobileContext",
      "Provides: button, buttonSm, iconButton, iconButtonLg, input, select, toggle, textarea",
      'Mobile uses "touch" variants for larger tap targets',
      'Desktop uses "default" or smaller variants',
    ],
  },

  // Store patterns
  "zustand-store": {
    file: "src/stores/preferencesStore.ts",
    description: "Zustand store with persistence and devtools",
    keyPoints: [
      "Separate type and interface definitions",
      "Middleware stack: devtools(persist(...))",
      "partialize for selective persistence",
      "Computed getter (getResolvedTheme)",
      "reset() action for initial state",
      "Multi-tab sync function export",
    ],
  },

  // Page patterns
  "page-component": {
    file: "src/pages/Home.tsx",
    description: "Page component with i18n",
    keyPoints: [
      "Named export (PageNamePage convention)",
      "Trans component for all user text",
      "Container layout classes",
      "Minimal logic (pages are thin)",
    ],
  },
  "lazy-page": {
    file: "src/App.tsx",
    description: "Lazy loading pattern for pages",
    keyPoints: [
      "React.lazy() with dynamic import",
      "Transform named to default: .then(m => ({ default: m.PageName }))",
      "Suspense boundary with fallback",
      "Route constants from lib/routes.ts",
    ],
  },

  // Context patterns
  "context-provider": {
    file: "src/contexts/mobileContext.tsx",
    description: "React Context with provider and hook",
    keyPoints: [
      "Separate Context and Provider",
      "useMemo for context value",
      "Custom hook with error if outside provider",
      "useEffect with resize listener",
      "requestAnimationFrame for debouncing",
    ],
  },
  "query-provider": {
    file: "src/contexts/queryContext.tsx",
    description: "TanStack Query provider setup",
    keyPoints: [
      "QueryClient with default options",
      "staleTime, gcTime, retry configuration",
      "QueryClientProvider wrapper",
    ],
  },

  // API patterns
  "api-client": {
    file: "src/lib/api.ts",
    description: "Typed API client with error handling",
    keyPoints: [
      "Custom ApiClientError class",
      "Generic request function",
      "AbortController for timeout",
      "Error parsing from response JSON",
      "Methods object (get, post, put, patch, delete)",
    ],
  },

  // Test patterns
  "test-component": {
    file: "tests/unit/components/Header.test.tsx",
    description: "Component test with Testing Library",
    keyPoints: [
      "Import from vitest (describe, it, expect)",
      "Custom render from @/test",
      "screen queries (getByRole, getByText)",
      "Semantic role assertions",
    ],
  },
  "test-hook": {
    file: "tests/unit/hooks/useMediaQuery.test.ts",
    description: "Hook test with renderHook",
    keyPoints: [
      "renderHook from Testing Library",
      "mockMatchMedia utility",
      "beforeEach for setup",
      "it.each for parameterized tests",
      "act() for state updates",
    ],
  },
  "test-store": {
    file: "tests/unit/stores/preferencesStore.test.ts",
    description: "Zustand store test",
    keyPoints: [
      "Direct store access: useStore.getState()",
      "act() wrapper for state changes",
      "Reset state in beforeEach",
      "Test actions and computed values",
    ],
  },
  "msw-handler": {
    file: "src/mocks/handlers/todos.ts",
    description: "MSW request handler",
    keyPoints: [
      "http.get/post from msw",
      "HttpResponse.json() for responses",
      "URL parameter extraction",
      "delay() for realistic timing",
      "Error responses with status codes",
    ],
  },

  // Validation patterns
  "zod-schema": {
    file: "src/lib/validations.ts",
    description: "Zod validation schemas with type inference",
    keyPoints: [
      "z.object() for form schemas",
      "Chained validations (min, max, email)",
      "Custom error messages",
      "Type inference with z.infer<>",
      "refine() for cross-field validation",
    ],
  },

  // i18n patterns
  "trans-component": {
    file: "src/components/layout/Header.tsx",
    description: "Trans component usage for JSX text",
    keyPoints: [
      "Import from @lingui/react/macro",
      "comment prop is REQUIRED (ESLint enforced)",
      "Wraps user-visible text",
      "Can contain JSX children",
    ],
  },
  "t-function": {
    file: "src/components/shared/ThemeToggle/ThemeToggle.tsx",
    description: "t() function for programmatic text",
    keyPoints: [
      "useLingui() hook for t function",
      "Object syntax: t({ message, comment })",
      "comment is REQUIRED",
      "Use for dynamic text, attributes",
    ],
  },
  "language-switcher": {
    file: "src/components/shared/LanguageSwitcher/LanguageSwitcher.tsx",
    description: "Language selection component",
    keyPoints: [
      "useLanguage() hook",
      "DropdownMenu for selection",
      "supportedLocales array",
      "changeLanguage async function",
    ],
  },

  // Utility patterns
  "storage-utility": {
    file: "src/lib/storage.ts",
    description: "Type-safe localStorage utilities",
    keyPoints: [
      "SSR-safe (typeof window check)",
      "JSON serialization",
      "Generic type parameter",
      "Error handling with fallback",
      "clearAppStorage for all prefixed keys",
    ],
  },
  "format-utility": {
    file: "src/lib/format.ts",
    description: "Locale-aware formatting utilities",
    keyPoints: [
      "Intl.DateTimeFormat for dates",
      "Intl.NumberFormat for numbers/currency",
      "Intl.RelativeTimeFormat for relative time",
      "formatBytes for file sizes",
      "Accepts locale parameter",
    ],
  },

  // Form error patterns
  "form-error-component": {
    file: "src/components/ui/form-error.tsx",
    description: "Form error display components",
    keyPoints: [
      "FieldErrorMessage for single field",
      "FormErrorSummary for all errors",
      "RootFormError for form-level errors",
      "Integrates with react-hook-form types",
    ],
  },

  // Theme patterns
  "theme-toggle": {
    file: "src/components/shared/ThemeToggle/ThemeToggle.tsx",
    description: "Theme toggle with system preference",
    keyPoints: [
      "Three modes: light, dark, system",
      "Zustand store for persistence",
      "getResolvedTheme() for actual value",
      "Icon changes based on resolved theme",
    ],
  },

  // SEO patterns
  "seo-component": {
    file: "src/components/shared/SEO/SEO.tsx",
    description: "SEO meta tags component (React 19)",
    keyPoints: [
      "React 19 native head hoisting",
      "title, meta, link in JSX",
      "Open Graph tags",
      "Twitter Card tags",
      "Conditional rendering for optional tags",
    ],
  },
};

/**
 * Get available pattern types
 */
export function getAvailablePatterns(): string[] {
  return Object.keys(PATTERN_MAP).sort();
}

/**
 * Get code example for a pattern
 */
export async function getCodeExample(
  pattern: string,
): Promise<CodeExample | null> {
  const mapping = PATTERN_MAP[pattern];
  if (!mapping) {
    return null;
  }

  const fullPath = resolveTemplatePath(mapping.file);

  try {
    const code = await readFile(fullPath, "utf-8");

    return {
      pattern,
      description: mapping.description,
      filePath: mapping.file,
      code,
      keyPoints: mapping.keyPoints,
    };
  } catch {
    // File might not exist if running outside webapp-base
    return {
      pattern,
      description: mapping.description,
      filePath: mapping.file,
      code: `// File not found: ${mapping.file}\n// Run MCP server from within webapp-base repository`,
      keyPoints: mapping.keyPoints,
    };
  }
}

/**
 * Get all examples for a feature's patterns
 */
export async function getFeatureExamples(
  patterns: string[],
): Promise<CodeExample[]> {
  const examples: CodeExample[] = [];

  for (const pattern of patterns) {
    const example = await getCodeExample(pattern);
    if (example) {
      examples.push(example);
    }
  }

  return examples;
}
