import { expect, test } from './setup';

test.describe('Home Page Performance', () => {
  // React Profiler + FPS metrics (Chromium only for FPS - uses Chrome DevTools Protocol)
  test.performance({
    warmup: true,
    iterations: 3,
    thresholds: {
      base: {
        profiler: {
          'home-page': { duration: 200, rerenders: 10 },
        },
        fps: 55,
      },
      ci: {
        profiler: {
          'home-page': { duration: 300 },
        },
        fps: 45,
      },
    },
  })('initial page load', async ({ page, performance }) => {
    await page.goto('/');
    await performance.init();

    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });

  test.performance({
    warmup: true,
    throttleRate: 4, // 4x CPU slowdown
    networkThrottling: 'fast-3g',
    thresholds: {
      base: {
        profiler: {
          'home-page': { duration: 1200, rerenders: 10 },
        },
      },
    },
  })('page load under throttled conditions', async ({ page, performance }) => {
    await page.goto('/');
    await performance.init();

    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });

  // Lighthouse audits (Chromium only - requires lighthouse peer dependency)
  test.performance({
    thresholds: {
      base: {
        lighthouse: {
          performance: 80,
          accessibility: 90,
          bestPractices: 80,
          seo: 90,
        },
      },
      ci: {
        lighthouse: {
          performance: 70, // Relaxed for CI
        },
      },
    },
  })('meets Lighthouse quality standards', async ({ page, performance }) => {
    await page.goto('/');
    await performance.init();

    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });

  // Web Vitals with comprehensive metrics
  test.performance({
    thresholds: {
      base: {
        profiler: {
          'home-page': { duration: 200, rerenders: 10 },
        },
        webVitals: {
          lcp: 2500, // Largest Contentful Paint (ms)
          inp: 200, // Interaction to Next Paint (ms)
          cls: 0.1, // Cumulative Layout Shift
        },
      },
    },
  })('meets Core Web Vitals standards', async ({ page, performance }) => {
    await page.goto('/');
    await performance.init();

    // Trigger interaction for INP measurement
    await page.getByRole('heading', { name: /welcome/i }).click();

    await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
  });
});
