import { expect, test } from '@playwright/test';

/**
 * Profile Page E2E Tests
 *
 * Note: These tests require a valid Clerk configuration to run.
 * Without VITE_CLERK_PUBLISHABLE_KEY, the app may show an error page.
 *
 * For authenticated testing, see @clerk/testing package documentation.
 * @see https://clerk.com/docs/testing/playwright
 */

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    // Check if the app loads (Clerk needs to be configured)
    await page.goto('/');

    // Wait for app to be ready (header should be visible if Clerk is configured)
    const header = page.getByRole('banner');
    const isAppReady = await header.isVisible({ timeout: 5000 }).catch(() => false);

    if (!isAppReady) {
      test.skip(true, 'App not ready - Clerk may not be configured');
    }
  });

  test('protected route blocks unauthenticated access', async ({ page }) => {
    await page.goto('/profile');

    // Wait for Clerk to process the route
    await page.waitForTimeout(3000);

    // Profile content should NOT be visible without authentication
    const profileCard = page.getByText('Your Profile');
    const isVisible = await profileCard.isVisible().catch(() => false);

    // Should either redirect or show sign-in UI, but NOT show profile
    expect(isVisible).toBe(false);
  });

  test('profile link only visible when authenticated', async ({ page }) => {
    await page.goto('/');

    // Wait for Clerk to initialize
    await page.waitForTimeout(2000);

    // Check for Profile link/button in header
    // This is wrapped in <SignedIn>, so it should only appear for authenticated users
    const profileButton = page.getByRole('button', { name: /profile/i });
    const profileLink = page.getByRole('link', { name: /profile/i });

    const buttonVisible = await profileButton.isVisible().catch(() => false);
    const linkVisible = await profileLink.isVisible().catch(() => false);

    // Without authentication, neither should be visible
    // (unless user happens to be authenticated, which is also valid)
    expect(buttonVisible || linkVisible).toBe(false);
  });
});

/**
 * Authenticated Profile Tests
 *
 * To test the full profile CRUD flow, set up Clerk E2E testing:
 *
 * 1. Install: npm install -D @clerk/testing
 *
 * 2. Create auth.setup.ts:
 *    ```typescript
 *    import { clerkSetup } from '@clerk/testing/playwright';
 *    import { test as setup } from '@playwright/test';
 *
 *    setup('global setup', async ({}) => {
 *      await clerkSetup();
 *    });
 *    ```
 *
 * 3. Add authenticated tests:
 *    ```typescript
 *    import { clerk } from '@clerk/testing/playwright';
 *
 *    test('view and edit profile', async ({ page }) => {
 *      // Sign in
 *      await clerk.signIn({
 *        page,
 *        signInParams: { strategy: 'password', identifier: 'test@example.com', password: '...' },
 *      });
 *
 *      // Mock Supabase response
 *      await page.route('** /supabase.co/rest/v1/profiles**', async (route) => {
 *        if (route.request().method() === 'GET') {
 *          return route.fulfill({
 *            status: 200,
 *            body: JSON.stringify([{
 *              id: 'user_123',
 *              email: 'test@example.com',
 *              full_name: 'Test User',
 *              avatar_url: null,
 *            }]),
 *          });
 *        }
 *        if (route.request().method() === 'PATCH') {
 *          return route.fulfill({ status: 200, body: JSON.stringify({}) });
 *        }
 *      });
 *
 *      // Navigate and test
 *      await page.goto('/profile');
 *      await expect(page.getByText('Your Profile')).toBeVisible();
 *      await page.getByRole('button', { name: /edit/i }).click();
 *      await page.getByRole('textbox').fill('New Name');
 *      await page.getByRole('button', { name: /save/i }).click();
 *    });
 *    ```
 *
 * @see https://clerk.com/docs/testing/playwright
 */
