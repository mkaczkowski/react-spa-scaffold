import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Clear app state before test
 */
export async function clearAppState(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Navigate to page and clear state
 */
export async function setupPage(page: Page, path = '/') {
  await page.goto(path);
  await clearAppState(page);
  await page.reload();
}

export { expect };
