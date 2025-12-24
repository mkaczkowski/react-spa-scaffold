import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays welcome heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });

  test('has correct page structure', async ({ page }) => {
    // Header present
    await expect(page.getByRole('banner')).toBeVisible();

    // Main content area
    await expect(page.getByRole('main')).toBeVisible();

    // App title in header
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('skip link navigates to main content', async ({ page }) => {
    // Focus skip link (first focusable element)
    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();

    // Click skip link
    await skipLink.click();

    // Main should receive focus or be scrolled to
    await expect(page.locator('#main')).toBeInViewport();
  });
});
