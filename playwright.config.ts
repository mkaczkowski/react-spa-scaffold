import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : [['list'], ['html']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: {
    timeout: 10000,
  },
  projects: [
    {
      name: 'functional',
      testDir: './e2e/tests',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'performance',
      testDir: './e2e/performance',
      use: {
        ...devices['Desktop Chrome'],
        // CI containers require --no-sandbox; --disable-dev-shm-usage prevents memory issues
        launchOptions: {
          args: process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : [],
        },
      },
    },
  ],
  webServer: {
    command: process.env.PERF_TEST ? 'VITE_PERF_TEST=true npm run dev' : 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
