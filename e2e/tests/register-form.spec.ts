import { expect, test } from '@playwright/test';

test.describe('Registration Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays registration form with all fields', async ({ page }) => {
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('shows validation errors for empty submission', async ({ page }) => {
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText(/username must be at least/i)).toBeVisible();
    await expect(page.getByText(/valid email address/i)).toBeVisible();
    await expect(page.getByText(/password must be at least/i)).toBeVisible();
  });

  test('validates password requirements', async ({ page }) => {
    await page.getByLabel('Password', { exact: true }).fill('weak');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible();
  });

  test('validates password confirmation match', async ({ page }) => {
    await page.getByLabel('Password', { exact: true }).fill('StrongPass1');
    await page.getByLabel(/confirm password/i).fill('DifferentPass1');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText(/passwords don't match/i)).toBeVisible();
  });
});
