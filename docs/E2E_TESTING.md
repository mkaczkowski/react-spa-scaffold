# E2E Testing Guidelines

## Overview

- **Framework**: Playwright
- **Test location**: `e2e/tests/`
- **Utilities**: `e2e/fixtures/`

## File Structure

```
e2e/
├── fixtures/
│   └── index.ts           # setupPage, clearAppState
└── tests/
    ├── home.spec.ts       # Page structure, accessibility
    ├── theme.spec.ts      # Theme toggle, persistence
    ├── language.spec.ts   # Language switcher
    └── navigation.spec.ts # Routing, 404
```

## Imports

```typescript
import { expect, test } from '@playwright/test';

// For tests that need state clearing
import { setupPage } from '../fixtures';
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
npm run e2e        # Run all
npm run e2e:ui     # Interactive UI
```

## Checklist

- [ ] Uses accessible selectors
- [ ] No arbitrary timeouts
- [ ] Tests behavior, not implementation
- [ ] Uses `setupPage` when testing persistence
