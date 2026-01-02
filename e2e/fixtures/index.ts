import type { Page } from '@playwright/test';

/**
 * Navigate to page with clean state (clears localStorage).
 */
export async function setupPage(page: Page, path = '/'): Promise<void> {
  await page.goto(path);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

/**
 * Setup page with completely fresh state (cookies + localStorage).
 * Use when tests need isolation from previous test state.
 */
export async function setupCleanPage(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}
