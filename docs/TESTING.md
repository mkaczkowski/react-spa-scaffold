# Testing Guidelines

## Overview

- **Framework**: Vitest + React Testing Library
- **Coverage threshold**: 80% (lines, branches, functions, statements)
- **Test location**: Co-located with source files (e.g., `Button.tsx` + `Button.test.tsx`)

## Naming Conventions

```typescript
// File: [name].test.ts or [name].test.tsx (for JSX)
// Describe blocks: match the module/function name
// Test names: describe behavior, not implementation

describe('formatDate', () => {
  it('returns "Invalid date" for invalid input', () => {});
  it('formats date with custom options', () => {});
});
```

## Imports

```typescript
// Vitest - test framework
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Testing Library - DOM utilities
import { screen, renderHook, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom utilities from @/test
import { render, mockMatchMedia, createTestQueryClient, server } from '@/test';
```

## Core Patterns

### Use `it.each` for Similar Tests

```typescript
// ✅ Good - parameterized tests
it.each([
  { input: 0, expected: '0 Bytes' },
  { input: 1024, expected: '1 KB' },
  { input: 1024 * 1024, expected: '1 MB' },
])('formats $input bytes', ({ input, expected }) => {
  expect(formatBytes(input)).toBe(expected);
});

// ❌ Avoid - repetitive individual tests
it('formats 0 bytes', () => expect(formatBytes(0)).toBe('0 Bytes'));
it('formats 1024 bytes', () => expect(formatBytes(1024)).toBe('1 KB'));
it('formats 1MB', () => expect(formatBytes(1024 * 1024)).toBe('1 MB'));
```

### Use Shared Mocks

```typescript
import { mockMatchMedia } from '@/test';

describe('useMediaQuery', () => {
  beforeEach(() => {
    window.matchMedia = mockMatchMedia(false);
  });

  it('detects desktop viewport', () => {
    window.matchMedia = mockMatchMedia(true); // matches min-width query
    const { result } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);
  });
});
```

### Component Testing

```tsx
import { screen } from '@testing-library/react';
import { render } from '@/test';

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('increments value', () => {
    const { result } = renderHook(() => useCounter());

    act(() => result.current.increment());

    expect(result.current.count).toBe(1);
  });
});
```

### Async Testing

```typescript
// For promises
it('fetches data', async () => {
  const result = await fetchData();
  expect(result).toBeDefined();
});

// For state updates
it('updates after async action', async () => {
  const { result } = renderHook(() => useAsync());

  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  });
});
```

### Mocking

```typescript
import { mockMatchMedia } from '@/test';

// Mock modules at top of file
vi.mock('@/lib/storage', () => ({
  setStorageItem: vi.fn(() => true),
}));

// Mock browser APIs using shared utilities
beforeEach(() => {
  window.matchMedia = mockMatchMedia(false);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Mock fetch for API tests
const mockFetch = vi.fn();
beforeEach(() => {
  global.fetch = mockFetch;
});
mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
```

### MSW (Mock Service Worker)

MSW handlers are organized in `src/mocks/`:

```
src/mocks/
├── handlers/
│   ├── index.ts     # Combines all handlers
│   └── todos.ts     # Example domain handlers
├── fixtures/
│   └── todos.ts     # Response data
├── browser.ts       # Browser worker setup
└── node.ts          # Node server for tests
```

Override handlers per-test:

```typescript
import { http, HttpResponse, server } from '@/test';

it('handles API error', async () => {
  server.use(http.get('/api/todos', () => new HttpResponse(null, { status: 500 })));
  // Test error handling...
});
```

MSW handlers auto-reset after each test via `src/test-setup.ts`.

### Store Testing (Zustand)

```typescript
import { act } from '@testing-library/react';

describe('preferencesStore', () => {
  beforeEach(() => {
    usePreferencesStore.setState({ theme: 'light' });
  });

  it.each(['light', 'dark', 'system'] as const)('sets theme to %s', (theme) => {
    act(() => usePreferencesStore.getState().setTheme(theme));
    expect(usePreferencesStore.getState().theme).toBe(theme);
  });
});
```

## Test Organization

### Structure Within Test Files

```typescript
describe('ModuleName', () => {
  // Setup/teardown at top
  beforeEach(() => {});
  afterEach(() => {});

  // Group related tests
  describe('methodName', () => {
    it('handles normal case', () => {});
    it('handles edge case', () => {});
    it('handles error case', () => {});
  });
});
```

### What to Test

| Type       | Test Focus                                    |
| ---------- | --------------------------------------------- |
| Components | Rendering, user interactions, accessibility   |
| Hooks      | Return values, state changes, side effects    |
| Utils      | Input/output, edge cases, error handling      |
| Stores     | State mutations, computed values, persistence |

### What NOT to Test

- Implementation details (internal state, private methods)
- Third-party library internals
- Static content without logic
- TypeScript types (compiler handles this)

## Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
npm run test:ui       # Visual UI
```

## Checklist for New Tests

- [ ] File follows `[name].test.ts(x)` naming
- [ ] Uses `it.each` for parameterized cases
- [ ] Mocks are cleared in `beforeEach`/`afterEach`
- [ ] No duplicate helper functions
- [ ] Tests behavior, not implementation
- [ ] Async tests use `await`/`waitFor` properly
- [ ] Coverage threshold maintained (80%)
