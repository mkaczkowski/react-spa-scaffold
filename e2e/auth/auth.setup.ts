import { clerk, clerkSetup } from '@clerk/testing/playwright';
import { expect, test as setup } from '@playwright/test';

import { ASYNC_CONTENT_TIMEOUT, AUTH_STATE_FILE } from '../fixtures';

// Setup must be run serially for Clerk initialization
setup.describe.configure({ mode: 'serial' });

/**
 * Configure Playwright with Clerk testing token.
 * This obtains a Testing Token when the test suite starts.
 *
 * Required: CLERK_SECRET_KEY environment variable
 */
setup('global setup', async () => {
  // Skip if CLERK_SECRET_KEY is not set
  if (!process.env.CLERK_SECRET_KEY) {
    setup.skip(true, 'CLERK_SECRET_KEY required for authenticated tests');
    return;
  }
  await clerkSetup();
});

/**
 * Authenticate and save state to storage.
 * This creates a reusable auth state for authenticated tests.
 *
 * Required environment variables:
 * - E2E_CLERK_USER_USERNAME: Test user email
 * - E2E_CLERK_USER_PASSWORD: Test user password
 */
setup('authenticate and save state', async ({ page }) => {
  const username = process.env.E2E_CLERK_USER_USERNAME;
  const password = process.env.E2E_CLERK_USER_PASSWORD;

  // Skip auth setup if credentials are not provided
  if (!username || !password) {
    setup.skip(true, 'E2E_CLERK_USER_USERNAME and E2E_CLERK_USER_PASSWORD required for authenticated tests');
    return;
  }

  // Navigate to app and sign in
  await page.goto('/');

  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: username,
      password: password,
    },
  });

  // Verify authentication succeeded by checking for authenticated UI
  await page.goto('/profile');
  await expect(page.getByText('Your Profile')).toBeVisible({ timeout: ASYNC_CONTENT_TIMEOUT });

  // Save authentication state for reuse in other tests
  await page.context().storageState({ path: AUTH_STATE_FILE });
});
