# E2E Testing Guidelines

## Overview

- **Framework**: Playwright
- **Test location**: `e2e/tests/`
- **Utilities**: `e2e/fixtures/`

## File Structure

```
e2e/
├── auth/
│   └── auth.setup.ts      # Clerk authentication setup
├── fixtures/
│   └── index.ts           # setupPage, setupCleanPage, test, expect
├── tests/                  # Functional E2E tests
│   ├── home.spec.ts       # Page structure, accessibility
│   ├── theme.spec.ts      # Theme toggle, persistence
│   ├── language.spec.ts   # Language switcher
│   ├── navigation.spec.ts # Routing, 404
│   ├── profile.spec.ts    # Unauthenticated profile tests
│   └── profile.auth.spec.ts # Authenticated profile tests
├── performance/            # Performance regression tests
│   ├── setup.ts           # Performance test fixture
│   └── home.spec.ts       # Home page performance tests
└── .clerk/                 # Auth state storage (gitignored)
    └── user.json          # Saved auth state for tests
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

# Authenticated tests (requires credentials)
npx playwright test --project=authenticated
```

## Authenticated Testing

Tests requiring authentication use `@clerk/testing` with Playwright. These tests run with a real authenticated user session.

### Setup

1. Install the testing package (already included):

   ```bash
   npm install -D @clerk/testing
   ```

2. Set environment variables in `.env`:

   ```bash
   CLERK_SECRET_KEY=sk_test_xxxxx
   E2E_CLERK_USER_USERNAME=test@example.com
   E2E_CLERK_USER_PASSWORD=your-test-password
   ```

3. Create a test user in your Clerk dashboard with the above credentials.

### File Naming Convention

- `*.spec.ts` - Regular tests (run in `desktop`/`mobile` projects)
- `*.auth.spec.ts` - Authenticated tests (run in `authenticated` project only)

### Writing Authenticated Tests

```typescript
// e2e/tests/my-feature.auth.spec.ts
import { expect, test } from '@playwright/test';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const authFile = join(__dirname, '../.clerk/user.json');
const hasAuthState = existsSync(authFile);

test.describe('My Authenticated Feature', () => {
  // Skip if auth state doesn't exist
  test.skip(!hasAuthState, 'Authentication required');

  test.beforeEach(async ({ page }) => {
    // User is already authenticated via storageState
    await page.goto('/protected-page');
  });

  test('can access protected content', async ({ page }) => {
    await expect(page.getByText('Protected Content')).toBeVisible();
  });
});
```

### How It Works

1. **Setup project** runs `auth.setup.ts` which:
   - Calls `clerkSetup()` to get a testing token
   - Signs in with test credentials
   - Saves auth state to `e2e/.clerk/user.json`

2. **Authenticated project** uses the saved state:
   - Loads `storageState` from `user.json`
   - Tests run with pre-authenticated session

3. **Tests skip gracefully** when credentials aren't configured

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
