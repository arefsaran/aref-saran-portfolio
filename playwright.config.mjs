import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/portfolio.spec.mjs', '**/cms.spec.mjs'],
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'node tests/e2e-server.mjs',
    url: 'http://127.0.0.1:4173/health',
    reuseExistingServer: false,
    timeout: 120000
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium', ...(process.env.CI ? {} : { channel: 'chrome' }) } }]
});
