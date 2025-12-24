# Testing Guidelines

## Overview

- **Framework**: Vitest + React Testing Library
- **Coverage threshold**: 80% (lines, branches, functions, statements)
- **Test location**: `tests/unit/` mirroring `src/` structure

## File Structure

```
tests/unit/
├── components/     # Component tests
├── hooks/          # Hook tests
├── lib/            # Utility function tests
├── stores/         # Zustand store tests
├── contexts/       # Context provider tests
└── i18n/           # Internationalization tests
```

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

### Hoist Shared Helpers

```typescript
// ✅ Good - single helper at module scope
const createMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));

describe('useMediaQuery', () => {
  // uses createMatchMedia
});

describe('useIsMobile', () => {
  // reuses same createMatchMedia
});
```

### Component Testing

```typescript
import { render, screen } from '@/test'; // Custom render with providers

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
// Mock modules before imports
vi.mock('@/lib/storage', () => ({
  setStorageItem: vi.fn(() => true),
}));

// Mock browser APIs
beforeEach(() => {
  window.matchMedia = createMatchMedia(false);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;
mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
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
