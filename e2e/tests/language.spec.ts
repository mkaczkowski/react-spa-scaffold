import { expect, test } from '@playwright/test';

import { setupPage } from '../fixtures';

test.describe('Language Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test('displays language switcher button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /change language/i })).toBeVisible();
  });

  test('opens dropdown with language options', async ({ page }) => {
    await page.getByRole('button', { name: /change language/i }).click();

    await expect(page.getByText('English')).toBeVisible();
    await expect(page.getByText('Español')).toBeVisible();
    await expect(page.getByText('Deutsch')).toBeVisible();
  });

  test('closes dropdown after selection', async ({ page }) => {
    await page.getByRole('button', { name: /change language/i }).click();
    await page.getByRole('menuitem', { name: 'Español' }).click();

    // Dropdown should close - other options not visible
    await expect(page.getByRole('menuitem', { name: 'Deutsch' })).not.toBeVisible();
  });

  test('persists language preference across reload', async ({ page }) => {
    // Change to Spanish
    await page.getByRole('button', { name: /change language/i }).click();
    await page.getByRole('menuitem', { name: 'Español' }).click();

    // Wait for language change to apply
    await expect(page.getByRole('heading', { name: /bienvenido/i })).toBeVisible();

    // Reload and verify Spanish persisted
    await page.reload();
    await expect(page.getByRole('heading', { name: /bienvenido/i })).toBeVisible();
  });
});
