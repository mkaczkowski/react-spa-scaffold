# Architecture Guide

High-level architecture and key decisions. For API details, see [API Reference](./API_REFERENCE.md).

## Tech Stack

| Layer          | Technology               | Why                                         |
| -------------- | ------------------------ | ------------------------------------------- |
| Framework      | React 19 + TypeScript    | Largest ecosystem, concurrent features      |
| Build          | Vite 7                   | 10-100x faster than Webpack, native ESM     |
| Routing        | React Router 7           | De facto standard, lazy loading support     |
| Styling        | Tailwind CSS 4           | No runtime cost, scales with team size      |
| State          | Zustand + TanStack Query | Minimal boilerplate, separation of concerns |
| Forms          | React Hook Form + Zod    | Minimal re-renders, type-safe validation    |
| Authentication | Clerk                    | Modal-based auth, shadcn theme integration  |
| i18n           | Lingui                   | Smaller runtime, compile-time extraction    |
| Testing        | Vitest + Playwright      | Fast, Vite-native, true cross-browser       |
| Error Tracking | Sentry                   | Industry standard, lazy-loaded              |

## Project Structure

```
src/
├── components/
│   ├── layout/     # Page structure (Header)
│   ├── shared/     # Feature components (ThemeToggle, LanguageSwitcher)
│   └── ui/         # Primitives (Button, Spinner) - shadcn/ui
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── i18n/           # Internationalization setup
├── lib/            # Utilities, API client, config, routes
├── locales/        # Translation files (.po)
├── mocks/          # MSW handlers and fixtures
├── pages/          # Route page components
├── stores/         # Zustand stores
├── test/           # Test utilities and providers
└── types/          # Shared TypeScript definitions

e2e/                # Playwright end-to-end tests
```

### Why This Structure?

- **components/ui/**: Primitives from shadcn/ui. Direct imports (`@/components/ui/button`) because shadcn recommends against barrel exports for tree-shaking.
- **components/shared/**: Feature components with barrel exports. Each feature folder contains component + index.ts.
- **lib/**: Pure utilities with no React dependencies. Can be tested without rendering.
- **pages/**: One component per route. Default exports enable lazy loading.

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        App Entry                            │
│  main.tsx → Providers → App.tsx → Routes → Pages            │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   ┌──────────┐        ┌──────────┐        ┌──────────┐
   │  Zustand │        │ TanStack │        │  Context │
   │  Stores  │        │  Query   │        │ Providers│
   └──────────┘        └──────────┘        └──────────┘
         │                    │                    │
   Persisted           Server State          UI State
   Preferences         (API Cache)          (Mobile, etc)
```

## Key Architectural Decisions

### 1. Provider Hierarchy

Providers wrap the app in this specific order:

```tsx
<StrictMode>
  <QueryProvider>
    {/* TanStack Query - outermost for global cache */}
    <I18nProvider>
      {/* Lingui - translations available everywhere */}
      <BrowserRouter>
        {/* React Router - routing context */}
        <ClerkThemeProvider>
          {/* Clerk - auth inside Router for @clerk/react-router */}
          <MobileProvider>
            {/* Viewport - depends on router for SSR */}
            <ErrorBoundary>
              <App />
              <Toaster />
            </ErrorBoundary>
          </MobileProvider>
        </ClerkThemeProvider>
      </BrowserRouter>
    </I18nProvider>
  </QueryProvider>
</StrictMode>
```

**Why this order?**

- QueryProvider outermost so cache persists across route changes
- I18nProvider before Router so route components can use translations
- ClerkThemeProvider inside Router (required by @clerk/react-router declarative mode)
- MobileProvider inside Clerk for potential SSR viewport detection
- ErrorBoundary innermost to catch errors in App without breaking providers

### 2. State Management Separation

| Use Case              | Solution            | Location          | Why                           |
| --------------------- | ------------------- | ----------------- | ----------------------------- |
| User preferences      | Zustand + persist   | `stores/`         | Survives refresh, syncs tabs  |
| Server/async data     | TanStack Query      | `hooks/use*Query` | Automatic caching, refetching |
| Shared UI state       | React Context       | `contexts/`       | Prop drilling avoidance       |
| Component-local state | useState/useReducer | Component file    | Simplest solution             |

**Key invariant**: Server state (TanStack Query) and client state (Zustand) never overlap. If data comes from an API, use Query. If it's user preference, use Zustand.

### 3. Lazy Loading Strategy

Pages are lazy-loaded to reduce initial bundle size:

```tsx
// App.tsx
const HomePage = lazy(() => import('@/pages/Home').then((m) => ({ default: m.HomePage })));

// Routes
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path={ROUTES.HOME} element={<HomePage />} />
  </Routes>
</Suspense>;
```

**Why pages only?**

- Pages are the largest units and least likely to be needed immediately
- UI components are small and frequently reused—overhead of lazy loading outweighs benefit
- Shared components may be needed before Suspense resolves

### 4. Error Handling Layers

| Layer      | Mechanism      | Catches                 |
| ---------- | -------------- | ----------------------- |
| Component  | ErrorBoundary  | React render errors     |
| API        | ApiClientError | Network/HTTP errors     |
| Global     | window.onerror | Uncaught exceptions     |
| Production | Sentry         | All errors with context |

**Key invariant**: Errors should never silently fail. Every error either:

- Shows user feedback (toast, error UI)
- Logs to console (development)
- Reports to Sentry (production)

### 5. Translation Enforcement

All user-facing text must have translator comments. This is enforced by ESLint.

**Why mandatory comments?**

- Translators lack code context—"Close" could be adjective or verb
- Comments appear in PO files, reducing translation errors
- ESLint catches missing comments before merge

## Import Conventions

```tsx
// UI primitives: direct import (no barrel)
import { Button } from '@/components/ui/button';

// Shared components: barrel export
import { ThemeToggle } from '@/components/shared';

// Utilities
import { api } from '@/lib/api';
import { render } from '@/test';
```

## Related Docs

- [API Reference](./API_REFERENCE.md) - Utilities, hooks, and common patterns
- [Component Guidelines](./COMPONENT_GUIDELINES.md) - React component blueprint
- [Coding Standards](./CODING_STANDARDS.md) - TypeScript and state patterns
- [Testing](./TESTING.md) - Unit testing guidelines
- [E2E Testing](./E2E_TESTING.md) - Playwright patterns
- [Internationalization](./INTERNATIONALIZATION.md) - Lingui i18n setup
