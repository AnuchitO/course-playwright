import { test, expect } from '@playwright/test';

test('search BKK to SIN, one way', async ({ page }) => {
  await page.goto('/flights');
});
