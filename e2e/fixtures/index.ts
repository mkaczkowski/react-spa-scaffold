import type { Page } from '@playwright/test';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible path resolution
const __dirname = dirname(fileURLToPath(import.meta.url));

/** Path to Clerk auth state file for authenticated tests */
export const AUTH_STATE_FILE = join(__dirname, '../.clerk/user.json');

/** Default timeout for waiting on profile/async content to load */
export const ASYNC_CONTENT_TIMEOUT = 10000;

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
