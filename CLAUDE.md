# CLAUDE.md

This file provides guidance for Claude (and other AI assistants) when working with this codebase.

## Project Overview

Production-ready React starter template with React 19, TypeScript, and Vite 7. An opinionated foundation with optional features—customize freely.

## Essential Commands

```bash
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Production build (TypeScript check + Vite)
npm run typecheck        # TypeScript type checking only
npm run lint             # ESLint check
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier format all files
npm run test             # Run Vitest tests once
npm run test:watch       # Vitest in watch mode
npm run test:coverage    # Tests with coverage (80% threshold required)
npm run e2e              # Playwright E2E tests
npm run i18n:extract     # Extract translation strings to .po files
```

## Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Framework  | React 19 + TypeScript (strict mode)           |
| Build      | Vite 7                                        |
| Styling    | Tailwind CSS 4 + shadcn/ui components         |
| Routing    | React Router 7 (lazy-loaded pages)            |
| State      | Zustand (client) + TanStack Query (server)    |
| Forms      | React Hook Form + Zod validation              |
| i18n       | Lingui (with mandatory translator comments)   |
| Testing    | Vitest (unit) + Playwright (E2E) + MSW (mocks)|
| Quality    | ESLint + Prettier + Husky + Commitlint        |

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui primitives (Button, Dropdown, etc.)
│   ├── layout/      # Page structure (Header)
│   └── shared/      # Feature components (ThemeToggle, LanguageSwitcher, SEO)
├── contexts/        # React Context providers (QueryProvider, MobileProvider)
├── hooks/           # Custom hooks (useMediaQuery, useThemeEffect, etc.)
├── i18n/            # Internationalization setup
├── lib/             # Utilities
│   ├── api.ts       # Typed HTTP client with ApiClientError
│   ├── routes.ts    # Typed route constants
│   ├── validations.ts # Zod schemas
│   ├── config.ts    # Environment-based configuration
│   └── utils.ts     # cn() utility for class merging
├── locales/         # Translation files (.po format)
├── mocks/           # MSW handlers and fixtures
├── pages/           # Route page components (lazy-loaded)
├── stores/          # Zustand stores (preferencesStore)
├── test/            # Test utilities (render, mocks, providers)
└── types/           # Shared TypeScript definitions

tests/unit/          # Vitest tests (mirrors src/ structure)
e2e/                 # Playwright E2E tests
docs/                # Detailed documentation
```

## Code Patterns

### Path Aliases

Always use `@/` for imports:
```typescript
import { api } from '@/lib/api';
import { Button } from '@/components/ui';
import { render } from '@/test';
```

### Components

Use named exports with Props interface:
```tsx
export interface MyComponentProps {
  title: string;
  count?: number;
}

export function MyComponent({ title, count = 0 }: MyComponentProps) {
  // ...
}
```

Exception: Page components use default exports for lazy loading.

### TypeScript

- Use `type` for unions/literals: `type Theme = 'light' | 'dark' | 'system'`
- Use `interface` for object shapes: `interface User { id: string; name: string; }`
- Let TypeScript infer when obvious, be explicit for API boundaries

### State Management

| Use Case              | Solution           |
| --------------------- | ------------------ |
| User preferences      | Zustand + persist  |
| Server/async data     | TanStack Query     |
| Shared UI state       | React Context      |
| Component-local       | useState/useReducer|

### Translations (IMPORTANT)

All user-facing text MUST be wrapped with translations AND include a comment:

```tsx
import { Trans } from '@lingui/react/macro';
import { useLingui } from '@lingui/react/macro';

// JSX content
<Trans comment="Main heading on dashboard page">Welcome back</Trans>

// Strings (aria-labels, placeholders)
const { t } = useLingui();
<Button aria-label={t({ message: 'Close', comment: 'Close dialog button' })} />
```

ESLint will warn about untranslated strings. Tests, mocks, and UI primitives are excluded.

## Testing

### Test Files Location

Tests live in `tests/unit/` mirroring the `src/` structure:
- `src/hooks/useMediaQuery.ts` → `tests/unit/hooks/useMediaQuery.test.ts`
- `src/components/Header.tsx` → `tests/unit/components/Header.test.tsx`

### Writing Tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, renderHook, waitFor } from '@testing-library/react';
import { render, mockMatchMedia, server } from '@/test';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

Use `it.each` for parameterized tests:
```typescript
it.each([
  { input: 0, expected: '0 Bytes' },
  { input: 1024, expected: '1 KB' },
])('formats $input bytes', ({ input, expected }) => {
  expect(formatBytes(input)).toBe(expected);
});
```

### Coverage Requirement

80% threshold for lines, branches, functions, and statements. Tests will fail if below.

## Key Files Reference

| Purpose               | Location                    |
| --------------------- | --------------------------- |
| API client            | `src/lib/api.ts`            |
| App config            | `src/lib/config.ts`         |
| Route constants       | `src/lib/routes.ts`         |
| Zod schemas           | `src/lib/validations.ts`    |
| Preferences store     | `src/stores/preferencesStore.ts` |
| Test utilities        | `src/test/index.ts`         |
| MSW handlers          | `src/mocks/handlers/`       |
| Test setup            | `src/test-setup.ts`         |

## Documentation

Detailed guides in `/docs/`:
- `ARCHITECTURE.md` - System design, data flow, provider hierarchy
- `CODING_STANDARDS.md` - TypeScript, component, state patterns
- `TESTING.md` - Vitest patterns, mocking, coverage
- `E2E_TESTING.md` - Playwright patterns and fixtures
- `INTERNATIONALIZATION.md` - Lingui i18n usage

## Common Gotchas

1. **Node version**: Requires Node.js >= 22.0.0 (check `.nvmrc`)

2. **Translation comments are mandatory**: ESLint warns on `<Trans>` or `t()` without a `comment` prop

3. **Named exports only**: Use named exports everywhere except page components (which need default for lazy loading)

4. **Test coverage**: CI fails if coverage drops below 80%

5. **Conventional commits**: Commit messages must follow conventional commit format (enforced by commitlint)

6. **Barrel exports**: Each component directory has an `index.ts` for clean imports

7. **Context hooks throw**: Context hooks like `useMobile()` throw if used outside their provider

8. **MSW is pre-configured**: No manual setup needed in tests—handlers auto-reset after each test

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
VITE_APP_NAME=MyApp
VITE_APP_URL=http://localhost:5173
VITE_API_URL=https://jsonplaceholder.typicode.com
VITE_SENTRY_DSN=  # Optional: Sentry error tracking
```

## CI Pipeline

GitHub Actions runs on every PR:
1. Lint (ESLint + Prettier)
2. Type check (TypeScript)
3. Security audit (npm audit)
4. Build (Vite production build)
5. Unit tests (Vitest with 80% coverage)
6. E2E tests (Playwright)
7. Lighthouse CI (performance/accessibility audits)
