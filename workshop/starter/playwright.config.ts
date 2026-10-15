import { defineConfig, devices } from '@playwright/test';

// App:     qoomlee-challenge/app/web      ->  bun run dev      (http://localhost:3000)
// Backend: qoomlee-challenge              ->  docker compose up -d --wait
export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: { timeout: 5_000 },
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    actionTimeout: 5_000,
    // Tall viewport on purpose: the date picker closes itself on scroll (see Lab 4).
    viewport: { width: 1280, height: 1000 },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 1000 } } }],
});
