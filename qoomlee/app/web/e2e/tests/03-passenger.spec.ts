import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';

test.beforeEach(async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(
    `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`,
  );
  await page.getByRole('button', { name: /select/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Book Your Flight' })).toBeVisible();
});

test('empty form shows required errors', async ({ page }) => {
  await page.getByRole('button', { name: /continue to payment/i }).click();
});
