import type { Page } from '@playwright/test';
import { test as base, expect } from '@playwright/test';

export { expect };

/**
 * Common selectors used across tests
 */
export const selectors = {
  header: {
    root: 'header',
    title: 'heading[level=1]',
    themeToggle: 'button[name=/switch to (dark|light) mode/i]',
    languageSwitcher: 'button[name=/change language/i]',
  },
  main: {
    root: 'main',
    skipLink: 'a[href="#main"]',
  },
} as const;

/**
 * Wait for theme to be applied
 */
export async function waitForTheme(page: Page, isDark: boolean) {
  const html = page.locator('html');
  if (isDark) {
    await expect(html).toHaveClass(/dark/);
  } else {
    await expect(html).not.toHaveClass(/dark/);
  }
}

/**
 * Get current theme state
 */
export async function getThemeState(page: Page): Promise<'light' | 'dark'> {
  const html = page.locator('html');
  const classList = await html.getAttribute('class');
  return classList?.includes('dark') ? 'dark' : 'light';
}

/**
 * Extended test with custom fixtures
 */
export const test = base.extend<{
  homePage: void;
}>({
  homePage: async ({ page }, runTest) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await runTest();
  },
});
