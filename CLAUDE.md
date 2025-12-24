# CLAUDE.md

AI assistant guidance for this React 19 + TypeScript + Vite 7 codebase. See [README.md](README.md) for project overview and tech rationale.

## Commands

```bash
npm run dev              # Dev server at localhost:5173
npm run build            # Production build (typecheck + bundle)
npm run typecheck        # TypeScript only
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run format           # Prettier format
npm run test             # Vitest once
npm run test:watch       # Vitest watch mode
npm run test:coverage    # Coverage (80% threshold)
npm run e2e              # Playwright E2E
npm run i18n:extract     # Extract translations to .po
```

## Project Structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full structure and data flow.

```
src/
├── components/    # ui/ (primitives), layout/, shared/ (features)
├── contexts/      # React Context providers
├── hooks/         # Custom hooks
├── lib/           # api, routes, config, utils, format, storage
├── pages/         # Lazy-loaded route components
├── stores/        # Zustand stores
└── types/         # TypeScript definitions

tests/unit/        # Vitest (mirrors src/)
e2e/               # Playwright tests
```

## Code Patterns

**Imports**: Always use `@/` path alias

**Components**: Named exports + `Props` interface. Pages use default exports for lazy loading.

**TypeScript**: `type` for unions, `interface` for objects

**State hierarchy**: Zustand (persisted) → TanStack Query (server) → Context (UI) → useState (local)

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) and [docs/COMPONENT_GUIDELINES.md](docs/COMPONENT_GUIDELINES.md).

## Translations (CRITICAL)

All user-facing text MUST have translator comments. ESLint enforces this.

```tsx
<Trans comment="Dashboard heading">Welcome back</Trans>;
t({ message: 'Close', comment: 'Close button' });
```

See [docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md).

## Testing

Tests in `tests/unit/` mirror `src/` structure. 80% coverage required.

```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, renderHook } from '@testing-library/react';
import { render, mockMatchMedia, server } from '@/test';
```

MSW handlers auto-reset after each test. See [docs/TESTING.md](docs/TESTING.md) and [docs/E2E_TESTING.md](docs/E2E_TESTING.md).

## Common Gotchas

1. **Node.js >= 22.0.0** required (check `.nvmrc`)
2. **Conventional commits** enforced by commitlint
3. **Context hooks throw** outside provider (e.g., `useMobileContext()`)
4. **Barrel exports** in each directory via `index.ts`
5. **UI components** import directly: `@/components/ui/button` (no barrel)
