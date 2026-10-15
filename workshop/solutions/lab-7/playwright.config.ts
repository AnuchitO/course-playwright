import { defineConfig, devices } from '@playwright/test';

const viewport = { width: 1280, height: 1000 };

export default defineConfig({
  testDir: '..',                       // all lab solutions
  fullyParallel: true,
  forbidOnly: !!process.env.CI,        // fail CI if someone commits test.only
  retries: process.env.CI ? 2 : 0,     // retry only on CI; a retry that passes = "flaky" in the report
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],
  expect: { timeout: 5_000 },
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    actionTimeout: 5_000,
    viewport,
    trace: 'retain-on-failure',        // open with: npx playwright show-trace
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], viewport, storageState: '.auth/traveller.json' },
    },
    {
      name: 'firefox',
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Desktop Firefox'], viewport, storageState: '.auth/traveller.json' },
    },
    {
      name: 'webkit',
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Desktop Safari'], viewport, storageState: '.auth/traveller.json' },
    },
    {
      name: 'mobile-chrome',
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
      use: { ...devices['Pixel 5'], storageState: '.auth/traveller.json' },
    },
  ],
});
