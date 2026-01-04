import { expect, test } from '@playwright/test';

import { ASYNC_CONTENT_TIMEOUT } from '../fixtures';

// Check if auth credentials are configured
const hasAuthCredentials = !!(
  process.env.CLERK_SECRET_KEY &&
  process.env.E2E_CLERK_USER_USERNAME &&
  process.env.E2E_CLERK_USER_PASSWORD
);

/**
 * Authenticated Profile Page E2E Tests
 *
 * These tests run with an authenticated user (from auth.setup.ts).
 * They test the full profile CRUD flow with Supabase integration.
 *
 * Required environment variables:
 * - E2E_CLERK_USER_USERNAME: Test user email
 * - E2E_CLERK_USER_PASSWORD: Test user password
 * - CLERK_SECRET_KEY: Clerk secret key for testing
 *
 * @see https://clerk.com/docs/testing/playwright
 */
test.describe('Authenticated Profile Tests', () => {
  // Skip all tests if auth credentials aren't configured
  test.skip(
    !hasAuthCredentials,
    'Auth credentials required (CLERK_SECRET_KEY, E2E_CLERK_USER_USERNAME, E2E_CLERK_USER_PASSWORD)',
  );

  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
    // Wait for profile content to load (semantic selector instead of CSS class)
    await expect(page.getByText('Full Name')).toBeVisible({ timeout: ASYNC_CONTENT_TIMEOUT });
  });

  test('displays profile card with user info', async ({ page }) => {
    await expect(page.getByText('Your Profile')).toBeVisible();
    await expect(page.getByText('Manage your profile information stored in Supabase')).toBeVisible();
  });

  test('shows user email in profile', async ({ page }) => {
    const email = process.env.E2E_CLERK_USER_USERNAME;
    if (email) {
      await expect(page.getByText(email)).toBeVisible();
    }
  });

  test('can enter edit mode for name', async ({ page }) => {
    await page.getByRole('button', { name: /edit/i }).click();

    // Input field should appear
    await expect(page.getByRole('textbox')).toBeVisible();

    // Save and Cancel buttons should be visible
    await expect(page.getByRole('button', { name: /save/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
  });

  test('can cancel edit without saving', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: /edit/i }).click();

    // Type a new name
    const input = page.getByRole('textbox');
    await input.clear();
    await input.fill('Temporary Name');

    // Cancel
    await page.getByRole('button', { name: /cancel/i }).click();

    // Should exit edit mode (input gone, edit button back)
    await expect(input).not.toBeVisible();
    await expect(page.getByRole('button', { name: /edit/i })).toBeVisible();
  });

  test('can update profile name', async ({ page }) => {
    // Enter edit mode
    await page.getByRole('button', { name: /edit/i }).click();

    // Generate unique name with timestamp
    const newName = `E2E Test User ${Date.now()}`;

    // Update name
    const input = page.getByRole('textbox');
    await input.clear();
    await input.fill(newName);

    // Save
    await page.getByRole('button', { name: /save/i }).click();

    // Wait for save to complete (exit edit mode)
    await expect(page.getByRole('button', { name: /edit/i })).toBeVisible({ timeout: ASYNC_CONTENT_TIMEOUT });

    // Verify name is displayed
    await expect(page.getByText(newName)).toBeVisible();
  });

  test('Full Name label is present', async ({ page }) => {
    await expect(page.getByText('Full Name')).toBeVisible();
  });
});
