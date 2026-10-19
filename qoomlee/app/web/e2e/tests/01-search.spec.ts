import { test, expect } from '@playwright/test';

test('search BKK to SIN, one way', async ({ page }) => {
  await page.goto('/flights');
  await expect(page.getByRole('heading', { name: 'Flight Search' })).toBeVisible();
  await page.getByRole('button', { name: 'One way' }).click();

  // after the origin is chosen its button text changes, so .first() is the destination next
  await page.getByRole('button', { name: /select city or airport/i }).first().click();
  await page.getByRole('button', { name: /Suvarnabhumi/ }).click();
  await page.getByRole('button', { name: /select city or airport/i }).first().click();
});
