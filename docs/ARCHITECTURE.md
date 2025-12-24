# Architecture Guide

## Tech Stack

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Framework      | React 19 + TypeScript         |
| Build          | Vite 7                        |
| Routing        | React Router 7                |
| Styling        | Tailwind CSS 4                |
| State          | Zustand (local), TanStack Query (server) |
| Forms          | React Hook Form + Zod         |
| i18n           | Lingui                        |
| Testing        | Vitest + Playwright           |
| Error Tracking | Sentry                        |

## Project Structure

```
src/
├── components/
│   ├── layout/     # Page structure (Header, Footer)
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

tests/
├── unit/           # Vitest unit tests (mirrors src/)
└── e2e/            # Playwright end-to-end tests

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

### Zustand Store Pattern

```tsx
// stores/exampleStore.ts
export const useExampleStore = create<ExampleState>()(
  devtools(
    persist(
      (set, get) => ({
        value: initialValue,
        setValue: (v) => set({ value: v }),
      }),
      { name: 'storage-key' }
    )
  )
);
```

### Query Hook Pattern

```tsx
// hooks/useExampleQuery.ts
async function fetchExample(): Promise<Example> {
  return api.get<Example>('/example');
}

export function useExampleQuery() {
  return useQuery({
    queryKey: ['example'],
    queryFn: fetchExample,
  });
}
```

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

## Component Patterns

### Barrel Exports

Each directory has an `index.ts` for clean imports:

```tsx
// components/shared/index.ts
export { ErrorBoundary } from './ErrorBoundary';
export { ThemeToggle } from './ThemeToggle';

// Usage
import { ErrorBoundary, ThemeToggle } from '@/components/shared';
```

### Component Structure

```tsx
export interface ComponentProps {
  title: string;
  count?: number;
}

export function Component({ title, count = 0 }: ComponentProps) {
  return <div>{title}: {count}</div>;
}
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
2. **Colocation** - Keep related files together (component + test + styles)
3. **Type inference** - Let TypeScript infer when obvious, explicit for APIs
4. **Translations** - All user-facing text wrapped with `<Trans>` or `t()`
5. **Testing** - Unit tests in `tests/unit/`, E2E in `tests/e2e/`

## Related Docs

- [Coding Standards](./CODING_STANDARDS.md) - TypeScript, components, state patterns
- [Testing](./TESTING.md) - Unit testing guidelines
- [E2E Testing](./E2E_TESTING.md) - Playwright patterns
- [Internationalization](./INTERNATIONALIZATION.md) - Lingui i18n setup
