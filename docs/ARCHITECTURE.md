# Architecture Guide

## Tech Stack

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| Framework      | React 19 + TypeScript                    |
| Build          | Vite 7                                   |
| Routing        | React Router 7 (lazy-loaded pages)       |
| Styling        | Tailwind CSS 4                           |
| State          | Zustand (persisted) + TanStack Query (server) |
| Forms          | React Hook Form + Zod                    |
| i18n           | Lingui                                   |
| Testing        | Vitest (unit) + Playwright (e2e)         |
| Error Tracking | Sentry (lazy-loaded in production)       |

## Project Structure

```
src/
├── components/
│   ├── layout/     # Page structure (Header)
│   ├── shared/     # Feature components (ThemeToggle, LanguageSwitcher)
│   └── ui/         # Primitives (Button, Spinner, Skeleton)
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

tests/unit/         # Vitest tests (mirrors src/ structure)
e2e/                # Playwright end-to-end tests
docs/               # Project documentation
```

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

## Provider Hierarchy

Providers wrap the app in this order (outermost to innermost):

```tsx
<StrictMode>
  <QueryProvider>        {/* TanStack Query client */}
    <I18nProvider>       {/* Lingui translations */}
      <BrowserRouter>    {/* React Router */}
        <MobileProvider> {/* Viewport detection */}
          <ErrorBoundary>
            <App />
            <Toaster />
          </ErrorBoundary>
        </MobileProvider>
      </BrowserRouter>
    </I18nProvider>
  </QueryProvider>
</StrictMode>
```

## State Management

| Use Case              | Solution               | Location           |
| --------------------- | ---------------------- | ------------------ |
| User preferences      | Zustand + persist      | `stores/`          |
| Server/async data     | TanStack Query         | `hooks/use*Query`  |
| Shared UI state       | React Context          | `contexts/`        |
| Component-local state | useState/useReducer    | Component file     |

See [Coding Standards](./CODING_STANDARDS.md#state-management) for implementation patterns.

## API Layer

Located in `lib/api.ts`. Provides typed HTTP methods with automatic error handling.

```tsx
import { api } from '@/lib/api';

// Usage
const data = await api.get<User[]>('/users');
await api.post('/users', { name: 'John' });
await api.put('/users/1', { name: 'Jane' });
await api.delete('/users/1');
```

Features:
- Automatic JSON serialization
- Timeout handling (default: 30s)
- Custom `ApiClientError` class with status codes

## Routing

Routes defined in `lib/routes.ts` as typed constants:

```tsx
export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '*',
} as const;

// Usage in components
<Link to={ROUTES.HOME}>Home</Link>
```

Pages are lazy-loaded for code splitting:

```tsx
const HomePage = lazy(() => import('@/pages/Home'));
```

## Configuration

Environment-based config in `lib/config.ts`:

```tsx
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL,
  timeout: 30000,
};

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME,
  url: import.meta.env.VITE_APP_URL,
};
```

## Path Aliases

Configured in `tsconfig.json`:

```tsx
import { api } from '@/lib/api';           // src/lib/api.ts
import { Button } from '@/components/ui';  // src/components/ui/index.ts
import { render } from '@/test';           // src/test/index.ts
```

## Error Handling

1. **ErrorBoundary** - Catches React component errors
2. **ApiClientError** - Typed API errors with status codes
3. **Sentry** - Production error tracking (lazy-loaded)
4. **Global handlers** - `window.onerror`, `onunhandledrejection`

## Key Conventions

1. **Named exports** - Use named exports, not default (except pages for lazy loading)
2. **Barrel exports** - Each directory has `index.ts` for clean imports
3. **Type inference** - Let TypeScript infer when obvious, explicit for APIs
4. **Translations** - All user-facing text wrapped with `<Trans>` or `t()`
5. **Test location** - Unit tests in `tests/unit/` mirroring `src/` structure

## Related Docs

- [Coding Standards](./CODING_STANDARDS.md) - TypeScript, components, state patterns
- [Testing](./TESTING.md) - Unit testing guidelines
- [E2E Testing](./E2E_TESTING.md) - Playwright patterns
- [Internationalization](./INTERNATIONALIZATION.md) - Lingui i18n setup
