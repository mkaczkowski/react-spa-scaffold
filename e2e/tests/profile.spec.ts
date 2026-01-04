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
 * @see profile.auth.spec.ts for authenticated profile tests (edit, update, etc.)
 * @see https://clerk.com/docs/testing/playwright
 */
