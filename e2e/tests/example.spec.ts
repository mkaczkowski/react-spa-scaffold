import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole('button', { name: /switch to dark mode/i }).click();
    await expect(html).toHaveClass(/dark/);
  });
});
