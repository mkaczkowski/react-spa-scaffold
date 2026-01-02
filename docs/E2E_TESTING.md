# E2E Testing Guidelines

## Overview

- **Framework**: Playwright
- **Test location**: `e2e/tests/`
- **Utilities**: `e2e/fixtures/`

## File Structure

```
e2e/
├── fixtures/
│   └── index.ts           # setupPage, setupCleanPage, test, expect
├── tests/                  # Functional E2E tests
│   ├── home.spec.ts       # Page structure, accessibility
│   ├── theme.spec.ts      # Theme toggle, persistence
│   ├── language.spec.ts   # Language switcher
│   └── navigation.spec.ts # Routing, 404
└── performance/            # Performance regression tests
    ├── setup.ts           # Performance test fixture
    └── home.spec.ts       # Home page performance tests
```

## Imports

```typescript
import { expect, test } from '@playwright/test';
import { setupPage, setupCleanPage } from '../fixtures';
```

## Core Patterns

### Simple Page Tests

```typescript
test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays welcome heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });
});
```

### Tests Requiring Clean State

```typescript
import { setupPage } from '../fixtures';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page); // Clears localStorage, reloads
  });

  test('persists preference across reload', async ({ page }) => {
    await page.getByRole('button', { name: /dark mode/i }).click();
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
```

### Selecting Elements

```typescript
// ✅ Good - accessible selectors
page.getByRole('button', { name: /submit/i });
page.getByRole('heading', { name: /welcome/i });
page.getByText('English');

// ❌ Avoid
page.locator('.btn-primary');
page.locator('div > span.title');
```

### Waiting for State

```typescript
// ✅ Good - wait for visible state change
await expect(page.getByText('Success')).toBeVisible();
await expect(page.locator('html')).toHaveClass(/dark/);

// ❌ Avoid - arbitrary timeouts
await page.waitForTimeout(500);
```

## What to Test

| Type        | Examples                          |
| ----------- | --------------------------------- |
| Navigation  | Routes work, 404 handling         |
| User flows  | Toggle theme, change language     |
| Persistence | Settings survive reload           |
| Structure   | Header present, main content area |

## What NOT to Test

- CSS class names (implementation detail)
- Internal component state
- API response content (use unit tests)

## Running Tests

```bash
npm run e2e           # Run desktop tests
npm run e2e:mobile    # Run mobile tests (Pixel 5 emulation)
npm run e2e:all       # Run both desktop and mobile
npm run e2e:ui        # Interactive UI mode
npm run e2e:perf      # Run performance tests
npm run e2e:perf:ui   # Performance tests with interactive UI
```

## Mobile Testing

Tests run on both desktop (Chrome) and mobile (Pixel 5) viewports. Use the `isMobile` fixture for device-specific behavior.

### Using isMobile Fixture

```typescript
import { expect, test } from '@playwright/test';

test('theme toggle works on all devices', async ({ page, isMobile }) => {
  await page.goto('/');

  // Same test logic works on both platforms
  await page.getByRole('button', { name: /dark mode/i }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);

  // Add mobile-specific assertions if needed
  if (isMobile) {
    // Verify touch-friendly button size, etc.
  }
});
```

### Skip Tests by Platform

```typescript
test('hover tooltip shows', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Hover not available on touch devices');
  // Desktop-only test
});

test('touch gesture works', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Touch gesture only on mobile');
  // Mobile-only test
});
```

### Common Patterns

| Pattern        | Desktop   | Mobile          |
| -------------- | --------- | --------------- |
| Viewport width | 1280px    | 393px (Pixel 5) |
| Touch events   | Click     | Tap             |
| Hover states   | Supported | Not applicable  |

## Performance Testing

Performance tests use [react-performance-tracking](https://github.com/mkaczkowski/react-performance-tracking) to measure:

- React Profiler metrics (render duration, re-renders)
- Lighthouse audits (performance, accessibility)
- Core Web Vitals (LCP, INP, CLS)
- FPS monitoring (Chromium only)

## Checklist

- [ ] Uses accessible selectors
- [ ] No arbitrary timeouts
- [ ] Tests behavior, not implementation
- [ ] Uses `setupPage` when testing persistence
- [ ] Considers mobile viewport when relevant
