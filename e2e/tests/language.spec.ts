import { expect, test } from '@playwright/test';

test.describe('Language Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('displays language switcher button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /change language/i })).toBeVisible();
  });

  test('opens dropdown with language options', async ({ page }) => {
    await page.getByRole('button', { name: /change language/i }).click();

    // Should show all supported languages
    await expect(page.getByText('English')).toBeVisible();
    await expect(page.getByText('Español')).toBeVisible();
    await expect(page.getByText('Deutsch')).toBeVisible();
  });

  test('highlights current language in dropdown', async ({ page }) => {
    await page.getByRole('button', { name: /change language/i }).click();

    // English should be highlighted by default
    const englishOption = page.getByText('English');
    await expect(englishOption.locator('..')).toHaveClass(/bg-accent/);
  });

  test('closes dropdown after language selection', async ({ page }) => {
    await page.getByRole('button', { name: /change language/i }).click();
    await page.getByText('Español').click();

    // Dropdown should close
    await expect(page.getByText('Deutsch')).not.toBeVisible();
  });

  test('persists language preference across reload', async ({ page }) => {
    // Change to Spanish
    await page.getByRole('button', { name: /change language/i }).click();
    await page.getByText('Español').click();

    // Wait for language change
    await page.waitForTimeout(500);

    // Reload
    await page.reload();

    // Open dropdown and check Spanish is highlighted
    await page.getByRole('button', { name: /change language/i }).click();
    const spanishOption = page.getByText('Español');
    await expect(spanishOption.locator('..')).toHaveClass(/bg-accent/);
  });
});
