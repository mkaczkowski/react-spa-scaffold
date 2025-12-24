import { expect, test } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start with default theme
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('starts with light theme by default', async ({ page }) => {
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
  });

  test('toggles to dark theme on click', async ({ page }) => {
    const themeButton = page.getByRole('button', { name: /switch to dark mode/i });
    await themeButton.click();

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('toggles back to light theme', async ({ page }) => {
    const html = page.locator('html');

    // First toggle to dark
    await page.getByRole('button', { name: /switch to dark mode/i }).click();
    await expect(html).toHaveClass(/dark/);

    // Then toggle back to light
    await page.getByRole('button', { name: /switch to light mode/i }).click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('persists theme preference across page reload', async ({ page }) => {
    // Set dark theme
    await page.getByRole('button', { name: /switch to dark mode/i }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Reload page
    await page.reload();

    // Should still be dark
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('button label updates after toggle', async ({ page }) => {
    // Initially shows "Switch to dark mode"
    await expect(page.getByRole('button', { name: /switch to dark mode/i })).toBeVisible();

    // Click to toggle
    await page.getByRole('button', { name: /switch to dark mode/i }).click();

    // Now shows "Switch to light mode"
    await expect(page.getByRole('button', { name: /switch to light mode/i })).toBeVisible();
  });
});
