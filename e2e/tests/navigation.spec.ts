import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test('navigates to home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });

  test('shows 404 page for unknown routes', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.getByText(/not found|404/i)).toBeVisible();
  });

  test('header is present on all pages', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page.getByRole('banner')).toBeVisible();

    // 404 page
    await page.goto('/unknown');
    await expect(page.getByRole('banner')).toBeVisible();
  });
});
