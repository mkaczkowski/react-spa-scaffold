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
npm run e2e              # Playwright functional E2E tests
npm run e2e:perf         # Performance regression tests
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

e2e/               # Playwright tests
```

**Tests**: Co-located with source files (e.g., `foo.tsx` + `foo.test.tsx`)

## Code Patterns

**Imports**: Always use `@/` path alias

**Components**: Named exports + `Props` interface. Pages use default exports for lazy loading.

**TypeScript**: `type` for unions, `interface` for objects

**State hierarchy**: Zustand (persisted) → TanStack Query (server) → Context (UI) → useState (local)

See [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) and [docs/COMPONENT_GUIDELINES.md](docs/COMPONENT_GUIDELINES.md).

## Custom Hooks

### State & Storage

```tsx
import { useLocalStorage } from '@/hooks';

// localStorage with tab sync and updater functions
const [value, setValue] = useLocalStorage('key', defaultValue);
setValue((prev) => newValue);
```

### Form State Sync

```tsx
import { useSyncedFormData, useSyncedState } from '@/hooks';

// Sync form data when trigger changes (dialog open, ID changes)
const [formData, setFormData] = useSyncedFormData(sourceData, syncTrigger);

// Sync state but block when actively editing
const [localValue, setLocalValue] = useSyncedState(externalValue, isEditing);
```

### Utilities

```tsx
import { useCopyFeedback, useDebouncedCallback, useKeyboardShortcut, useDocumentTitle } from '@/hooks';

// Copy feedback with auto-reset
const { isCopied, triggerCopied } = useCopyFeedback(2000);

// Debounced callbacks
const debouncedSearch = useDebouncedCallback(handleSearch, 300);

// Keyboard shortcuts
useKeyboardShortcut('mod+s', handleSave, { preventDefault: true });

// Dynamic page titles
useDocumentTitle('Dashboard');
```

### Mobile & iOS

```tsx
import { useIOSViewportReset, useMobileContext, useTouchSizes } from '@/hooks';

// iOS Safari keyboard viewport fix
const handleBlur = useIOSViewportReset();
<input onBlur={handleBlur} />;

// Responsive breakpoints
const { isMobile, isTablet, isDesktop } = useMobileContext();

// Touch-aware sizes (44px on mobile)
const sizes = useTouchSizes();
<Button size={sizes.button}>Click</Button>;
```

## TIMING Constants

Use centralized timing constants for consistent UX:

```tsx
import { TIMING } from '@/lib/constants';

// TIMING.DEBOUNCE_DELAY = 300ms
// TIMING.COPY_FEEDBACK_DURATION = 2000ms
```

## UI Components (Shadcn/UI)

This project uses **Shadcn/UI** with radix-nova style. Components live in `src/components/ui/`.

### Adding New Components

```bash
npx shadcn@latest add button           # Single component
npx shadcn@latest add dialog card input # Multiple components
```

**Pattern**: Import directly (no barrel exports for UI):

```tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

## MCP Servers (PREFER OVER WebSearch)

Use MCP servers for documentation lookup. They provide **structured, version-accurate data** directly from source—faster and more reliable than web scraping.

### Why MCP over WebSearch?

- **Accuracy**: MCP fetches from official sources, not potentially outdated blog posts
- **Version-aware**: Gets docs for the exact library version you're using
- **Structured**: Returns code snippets, types, and examples in consistent format
- **Faster**: Direct API calls vs parsing HTML from search results

### Shadcn MCP (UI Components)

| Need                | Tool                                             |
| ------------------- | ------------------------------------------------ |
| Find component      | `mcp__shadcn__search_items_in_registries`        |
| View component code | `mcp__shadcn__view_items_in_registries`          |
| Usage examples      | `mcp__shadcn__get_item_examples_from_registries` |
| CLI add command     | `mcp__shadcn__get_add_command_for_items`         |

### Context7 MCP (All 3rd Party Libraries)

Use for **any npm package** documentation—not just React libraries:

```
resolve-library-id → get-library-docs
```

**Examples**:

- `react-hook-form` - Form validation patterns
- `@tanstack/react-query` - Query/mutation usage
- `zustand` - Store patterns
- `zod` - Schema validation
- `date-fns` - Date formatting
- `msw` - Mock service worker setup

### Decision Flow

```
Need UI component?     → Shadcn MCP
Need library docs?     → Context7 MCP (any npm package)
Need general info?     → WebSearch (fallback only)
```

## Translations (CRITICAL)

All user-facing text MUST be wrapped and include translator comments. ESLint enforces this.

```tsx
<Trans comment="Dashboard heading">Welcome back</Trans>;
t({ message: 'Close', comment: 'Close button' });
```

Technical identifiers (`id`, `htmlFor`, `autoComplete`, `register()`) are auto-ignored.

See [docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md) for full details.

## Testing

See [docs/TESTING.md](docs/TESTING.md) and [docs/E2E_TESTING.md](docs/E2E_TESTING.md).

Tests are co-located with source files (e.g., `foo.tsx` + `foo.test.tsx`). 80% coverage required.

```typescript
import { describe, it, expect, vi } from 'vitest';
import { screen, renderHook } from '@testing-library/react';
import { render, mockMatchMedia, server } from '@/test';
```

MSW handlers auto-reset after each test.

## Common Gotchas

1. **Node.js >= 22.0.0** required (check `.nvmrc`)
2. **Conventional commits** enforced by commitlint
3. **Context hooks throw** outside provider (e.g., `useMobileContext()`)
4. **Barrel exports** in each directory via `index.ts`
5. **UI components** import directly: `@/components/ui/button` (no barrel)
