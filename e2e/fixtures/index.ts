import type { Page } from '@playwright/test';

/**
 * Navigate to page with clean state (clears localStorage)
 */
export async function setupPage(page: Page, path = '/') {
  await page.goto(path);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}
