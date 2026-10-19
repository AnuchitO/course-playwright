import { test, expect } from '@playwright/test';

test('search BKK to SIN, one way', async ({ page }) => {
  await page.goto('/flights');
  await expect(page.getByRole('heading', { name: 'Flight Search' })).toBeVisible();
  await page.getByRole('button', { name: 'One way' }).click();
});
