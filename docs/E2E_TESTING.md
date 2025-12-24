# E2E Testing Guidelines

## Overview

- **Framework**: Playwright
- **Test location**: `e2e/tests/`
- **Fixtures**: `e2e/fixtures/`

## File Structure

```
e2e/
├── fixtures/
│   └── index.ts      # Shared fixtures and utilities
└── tests/
    ├── home.spec.ts       # Home page tests
    ├── theme.spec.ts      # Theme toggle tests
    ├── language.spec.ts   # Language switcher tests
    └── navigation.spec.ts # Navigation tests
```

## Naming Conventions

```typescript
// File: [feature].spec.ts
// Describe blocks: feature or page name
// Test names: describe user action and expected outcome

test.describe('Theme Toggle', () => {
  test('toggles to dark theme on click', async ({ page }) => {});
  test('persists theme preference across reload', async ({ page }) => {});
});
```

## Imports

```typescript
// Playwright test framework
import { expect, test } from '@playwright/test';

// Custom fixtures (when needed)
import { test, expect, waitForTheme } from '../fixtures';
```

## Core Patterns

### Page Setup with beforeEach

```typescript
test.describe('Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear state if needed
    await page.evaluate(() => localStorage.clear());
  });

  test('does something', async ({ page }) => {
    // Test implementation
  });
});
```

### Selecting Elements

```typescript
// ✅ Good - use accessible selectors
page.getByRole('button', { name: /submit/i });
page.getByRole('heading', { name: /welcome/i });
page.getByText('English');
page.getByLabel('Email');

// ❌ Avoid - brittle selectors
page.locator('.btn-primary');
page.locator('#submit-button');
page.locator('div > span.title');
```

### Assertions

```typescript
// Visibility
await expect(page.getByRole('heading')).toBeVisible();
await expect(page.getByText('Error')).not.toBeVisible();

// Text content
await expect(page.getByRole('button')).toHaveText('Submit');

// Attributes
await expect(page.locator('html')).toHaveClass(/dark/);
await expect(page.locator('html')).not.toHaveClass(/dark/);

// State
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByRole('textbox')).toBeFocused();
```

### Waiting for State

```typescript
// Wait for network idle
await page.waitForLoadState('networkidle');

// Wait for element
await page.waitForSelector('[data-loaded="true"]');

// Wait for specific condition
await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 5000 });
```

### Testing User Interactions

```typescript
// Clicks
await page.getByRole('button', { name: /toggle/i }).click();

// Keyboard
await page.keyboard.press('Tab');
await page.keyboard.press('Enter');

// Form input
await page.getByLabel('Email').fill('user@example.com');
await page.getByRole('textbox').clear();
```

### Testing Persistence

```typescript
test('persists state across reload', async ({ page }) => {
  // Change state
  await page.getByRole('button', { name: /dark mode/i }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);

  // Reload
  await page.reload();

  // Verify persistence
  await expect(page.locator('html')).toHaveClass(/dark/);
});
```

## Test Organization

### Group by Feature

```
e2e/tests/
├── auth.spec.ts         # Login, logout, registration
├── navigation.spec.ts   # Routing, 404, redirects
├── theme.spec.ts        # Theme toggle, persistence
└── settings.spec.ts     # User preferences
```

### Structure Within Test Files

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup
  });

  test('happy path scenario', async ({ page }) => {});
  test('handles edge case', async ({ page }) => {});
  test('handles error state', async ({ page }) => {});
});
```

## What to Test

| Type           | Test Focus                                      |
| -------------- | ----------------------------------------------- |
| Navigation     | Routes work, 404 handling, redirects            |
| User flows     | Complete workflows (login → dashboard → action) |
| Persistence    | localStorage, cookies, URL state                |
| Accessibility  | Skip links, keyboard navigation, focus          |
| Responsiveness | Mobile/desktop layouts (if critical)            |

## What NOT to Test

- Unit-level logic (use unit tests)
- API responses (use unit tests with MSW)
- CSS styling details
- Third-party widget internals

## Running Tests

```bash
npm run e2e           # Run all tests
npm run e2e:ui        # Interactive UI mode
npx playwright test --headed  # See browser
npx playwright test --debug   # Step through
```

## Debugging

```typescript
// Pause execution
await page.pause();

// Take screenshot
await page.screenshot({ path: 'debug.png' });

// Print page content
console.log(await page.content());
```

## Checklist for New E2E Tests

- [ ] Uses accessible selectors (getByRole, getByText)
- [ ] Clears state in beforeEach when needed
- [ ] Tests user flows, not implementation
- [ ] Waits for state properly (no arbitrary timeouts)
- [ ] Has meaningful test descriptions
- [ ] Covers happy path and error states
