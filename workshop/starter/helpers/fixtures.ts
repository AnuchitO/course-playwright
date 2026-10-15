import { test as base, expect } from '@playwright/test';

/**
 * CORS bridge (instructor plumbing - not a Playwright lesson).
 *
 * The qoomlee-challenge backends don't send CORS headers, so a browser on
 * :3000 can't call :9988 / :9984 directly. This forwards every call to the
 * REAL backend and adds the missing headers. Nothing is mocked.
 *
 * SLOW_API=3000 npx playwright test   -> delays every backend call by 3s,
 *                                        a stand-in for a slow CI machine.
 */
const slowMs = Number(process.env.SLOW_API ?? 0);

export const test = base.extend<{ corsBridge: void }>({
  corsBridge: [
    async ({ page }, use) => {
      await page.route(/^http:\/\/localhost:(9988|9984)\//, async (route) => {
        const cors = {
          'access-control-allow-origin': 'http://localhost:3000',
          'access-control-allow-headers': '*',
          'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
        };
        if (route.request().method() === 'OPTIONS') {
          return route.fulfill({ status: 204, headers: cors });
        }
        if (slowMs) await new Promise((r) => setTimeout(r, slowMs));
        const res = await route.fetch();
        await route.fulfill({ response: res, headers: { ...res.headers(), ...cors } });
      });
      await use();
    },
    { auto: true },
  ],
});

export { expect };
