import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run build && node tests/server.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000
  },
  projects: [
    {
      name: 'chromium',
      testMatch: [/portfolio\.spec\.mjs/, /cross-browser\.spec\.mjs/],
      use: {
        browserName: 'chromium',
        ...(process.env.CI ? {} : { channel: 'chrome' })
      }
    },
    {
      name: 'firefox-smoke',
      testMatch: /cross-browser\.spec\.mjs/,
      use: { browserName: 'firefox' }
    },
    {
      name: 'webkit-smoke',
      testMatch: /cross-browser\.spec\.mjs/,
      use: { browserName: 'webkit' }
    },
    ...(process.platform === 'win32' && !process.env.CI ? [{
      name: 'edge-smoke',
      testMatch: /cross-browser\.spec\.mjs/,
      use: { browserName: 'chromium', channel: 'msedge' }
    }] : [])
  ]
});
