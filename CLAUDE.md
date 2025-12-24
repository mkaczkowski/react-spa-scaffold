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

React 19 + TypeScript + Vite 7 with Tailwind CSS 4 and shadcn/ui. State via Zustand (client) and TanStack Query (server). Forms with React Hook Form + Zod. i18n via Lingui. Testing with Vitest + Playwright + MSW.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full tech stack and system design.

## Project Structure

```
src/
├── components/      # ui/ (primitives), layout/, shared/ (features)
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── lib/             # api.ts, routes.ts, validations.ts, config.ts, utils.ts
├── locales/         # Translation files (.po)
├── mocks/           # MSW handlers and fixtures
├── pages/           # Route components (lazy-loaded, use default exports)
├── stores/          # Zustand stores
├── test/            # Test utilities
└── types/           # TypeScript definitions

tests/unit/          # Vitest tests (mirrors src/ structure)
e2e/                 # Playwright E2E tests
```

## Code Patterns

**Imports**: Always use `@/` path alias (e.g., `import { api } from '@/lib/api'`)

**Components**: Named exports with `Props` interface. Exception: page components use default exports for lazy loading.

**TypeScript**: `type` for unions/literals, `interface` for object shapes.

**State**: Zustand (persisted preferences) → TanStack Query (server data) → Context (shared UI) → useState (local)

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) for detailed patterns.

### Translations (CRITICAL)

All user-facing text MUST include a translator comment:

```tsx
<Trans comment="Main heading on dashboard">Welcome back</Trans>

const { t } = useLingui();
t({ message: 'Close', comment: 'Close dialog button' })
```

ESLint enforces this. See [docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md) for full guide.

## Testing

**Location**: `tests/unit/` mirrors `src/` structure (e.g., `src/hooks/useX.ts` → `tests/unit/hooks/useX.test.ts`)

**Coverage**: 80% threshold required—CI fails below this.

**Key imports**:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, renderHook } from '@testing-library/react';
import { render, mockMatchMedia, server } from '@/test';
```

**MSW is pre-configured**—handlers auto-reset after each test, no manual setup needed.

See [docs/TESTING.md](docs/TESTING.md) for patterns and [docs/E2E_TESTING.md](docs/E2E_TESTING.md) for Playwright.

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

See `/docs/` for detailed guides: [ARCHITECTURE.md](docs/ARCHITECTURE.md), [CODING_STANDARDS.md](docs/CODING_STANDARDS.md), [TESTING.md](docs/TESTING.md), [E2E_TESTING.md](docs/E2E_TESTING.md), [INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md).

## Common Gotchas

1. **Node.js >= 22.0.0** required (check `.nvmrc`)
2. **Translation comments mandatory**—ESLint warns on `<Trans>` or `t()` without `comment`
3. **Named exports only**—except page components (default exports for lazy loading)
4. **Conventional commits**—enforced by commitlint
5. **Context hooks throw** if used outside their provider (e.g., `useMobile()`)
6. **Barrel exports**—each directory has `index.ts` for clean imports

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
