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
import { render, server, mockMatchMedia, silenceConsoleError } from '@/test';
```

## Mock Infrastructure

The codebase uses a unified mocking approach with shared constants and reusable utilities.

### Directory Structure

```
src/test/                    # Test utilities
├── index.ts                 # Public API - import from '@/test'
├── clerkMock.tsx            # Clerk auth mocks
├── supabaseMock.ts          # Supabase mocks
├── mocks.ts                 # Browser API mocks
└── providers.tsx            # Test render wrapper

src/mocks/                   # MSW infrastructure
├── constants.ts             # Shared test values (MOCK_USER, etc.)
├── fixtures/                # Test data factories
│   ├── profiles.ts          # createProfile(), mockProfiles
│   └── todos.ts             # createTodo(), mockTodos
├── handlers/                # MSW request handlers
│   ├── supabase.ts          # Supabase API mocks
│   └── todos.ts             # JSONPlaceholder mocks
└── node.ts                  # MSW server setup
```

### Shared Constants

All mocks use shared constants from `@/mocks/constants.ts` to ensure consistency:

```typescript
import { MOCK_USER, MOCK_SESSION_ID } from '@/test';

// MOCK_USER.id = 'user_123'
// MOCK_USER.email = 'test@example.com'
// MOCK_USER.fullName = 'Test User'
```

### Clerk Mocks

Control authentication state in tests:

```typescript
import { setMockClerkSignedIn, setMockClerkLoaded, resetClerkMocks } from '@/test';

beforeEach(() => resetClerkMocks());

it('shows sign-in when not authenticated', () => {
  setMockClerkSignedIn(false);
  render(<ProtectedRoute />);
  expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
});
```

### Supabase Mocks

Control Supabase query responses:

```typescript
import { setMockSupabaseData, setMockSupabaseError, createProfile, resetSupabaseMocks } from '@/test';

beforeEach(() => resetSupabaseMocks());

it('displays profile data', async () => {
  setMockSupabaseData([createProfile({ full_name: 'John Doe' })]);
  render(<ProfileCard />);
  await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
});

it('handles database error', async () => {
  setMockSupabaseError({ message: 'Connection failed', code: 'NETWORK_ERROR' });
  render(<ProfileCard />);
  await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
});
```

### Browser API Mocks

Reusable mocks for common browser APIs:

```typescript
import { mockMatchMedia, mockScrollTo, mockAnimationFrame, silenceConsoleError, silenceConsoleWarn } from '@/test';

// Media queries
beforeEach(() => {
  window.matchMedia = mockMatchMedia(true); // matches
});

// Scroll behavior
it('scrolls to top', () => {
  const scrollSpy = mockScrollTo();
  triggerScroll();
  expect(scrollSpy).toHaveBeenCalledWith(0, 0);
});

// Animation frames
let getCallback: () => FrameRequestCallback | null;
beforeEach(() => {
  getCallback = mockAnimationFrame();
});

it('updates on animation frame', () => {
  const callback = getCallback();
  act(() => callback?.(0));
  // assert state change
});

// Silence console during error tests
it('handles error gracefully', () => {
  const spy = silenceConsoleError();
  triggerError();
  expect(handleError).toHaveBeenCalled();
  spy.mockRestore();
});
```

### Fetch Mocking

Use `vi.spyOn` for type-safe fetch mocking:

```typescript
beforeEach(() => {
  vi.spyOn(global, 'fetch');
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('handles API response', async () => {
  vi.mocked(global.fetch).mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data: 'test' }),
  } as Response);

  const result = await fetchData();
  expect(result.data).toBe('test');
});
```

### MSW (Mock Service Worker)

MSW handlers intercept HTTP requests. Override per-test:

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '@/test';

it('handles API error', async () => {
  server.use(http.get('/api/todos', () => new HttpResponse(null, { status: 500 })));
  // Test error handling...
});
```

MSW handlers auto-reset after each test via `src/test-setup.ts`.

### Test Data Factories

Use factories to create test data with sensible defaults:

```typescript
import { createProfile, createTodo } from '@/test';

// Override specific fields
const profile = createProfile({ full_name: 'Custom Name' });
const todo = createTodo({ completed: true });

// Create multiple
import { createProfiles, createTodos } from '@/mocks/fixtures';
const profiles = createProfiles(5);
const todos = createTodos(10, { userId: 1 });
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

## Mock Best Practices

### DO

- ✅ Use shared constants (`MOCK_USER`, etc.) for consistency
- ✅ Use `vi.spyOn()` for type-safe mocking
- ✅ Use `vi.mocked()` wrapper for TypeScript support
- ✅ Reset mocks in `beforeEach`/`afterEach`
- ✅ Restore mocks after silencing console
- ✅ Use factory functions for test data

### DON'T

- ❌ Hardcode user IDs or emails across files
- ❌ Use `global.fetch = mockFn` (use `vi.spyOn` instead)
- ❌ Create duplicate mock utilities in test files
- ❌ Forget to reset stateful mocks between tests

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
- [ ] Uses shared mocks from `@/test`
- [ ] Uses shared constants (`MOCK_USER`, etc.)
- [ ] Uses `it.each` for parameterized cases
- [ ] Mocks are reset in `beforeEach`/`afterEach`
- [ ] Tests behavior, not implementation
- [ ] Async tests use `await`/`waitFor` properly
- [ ] Coverage threshold maintained (80%)
