import { defineConfig, devices } from '@playwright/test';

import { AUTH_STATE_FILE } from './e2e/fixtures';

// CI performance tests use preview server (serves pre-built dist) for faster startup
// Local dev uses dev server with VITE_PERF_TEST for hot reload
const isPerfCI = process.env.PERF_CI === 'true';
const baseURL = isPerfCI ? 'http://localhost:4173' : 'http://localhost:5173';

function getWebServerCommand(): string {
  if (isPerfCI) return 'npm run preview';
  if (process.env.PERF_TEST) return 'VITE_PERF_TEST=true npm run dev';
  return 'npm run dev';
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : [['list'], ['html']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: {
    timeout: 10000,
  },
  projects: [
    // Auth setup - runs first to create authenticated state
    {
      name: 'setup',
      testDir: './e2e/auth',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'desktop',
      testDir: './e2e/tests',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      testDir: './e2e/tests',
      use: { ...devices['Pixel 5'] },
    },
    // Authenticated tests - depend on setup project
    {
      name: 'authenticated',
      testDir: './e2e/tests',
      testMatch: /.*\.auth\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_STATE_FILE,
      },
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
    command: getWebServerCommand(),
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
