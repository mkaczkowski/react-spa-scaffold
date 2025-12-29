import { test as base } from '@playwright/test';
import { createPerformanceTest } from 'react-performance-tracking/playwright';

/**
 * Playwright test extended with performance fixture.
 * @see https://github.com/mkaczkowski/react-performance-tracking
 */
export const test = createPerformanceTest(base);
export { expect } from '@playwright/test';
