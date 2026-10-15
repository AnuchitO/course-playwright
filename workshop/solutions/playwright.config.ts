import { defineConfig, devices } from '@playwright/test';

const viewport = { width: 1280, height: 1000 };

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: { timeout: 5_000 },
  use: { baseURL: 'http://localhost:3000', actionTimeout: 5_000, viewport },
  projects: [
    // 1) runs once: creates the traveller identity -> .auth/traveller.json
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    // 2) everything else starts with that identity already in localStorage
    {
      name: 'chromium',
      testIgnore: /auth\.setup\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], viewport, storageState: '.auth/traveller.json' },
    },
  ],
});
