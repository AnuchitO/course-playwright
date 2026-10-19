import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';

test('full journey: search results to confirmation @smoke', async ({ page, request }) => {
  // 1-2. results (skip the search form: it is already covered by step 1)
  const day = await firstDepartureDate(request);
  await page.goto(
    `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`,
  );
  await page.getByRole('button', { name: /select/i }).first().click();

  // 3. passenger
  await page.getByPlaceholder('e.g. John').fill('Jane');
  await page.getByPlaceholder('e.g. Doe').fill('Doe');
  await page.getByPlaceholder('john.doe@example.com').fill(`jane+${Date.now()}@test.com`);
  await page.getByPlaceholder('000 000 000').fill('0800000000');
  await page.getByRole('button', { name: /continue to payment/i }).click();

  // 4. payment (Omise TEST card, never a real one)
  await page.getByPlaceholder('e.g. Johnathan Doe').fill('Jane Doe');
  await page.getByPlaceholder('0000 0000 0000 0000').fill('4242 4242 4242 4242');
  await page.getByPlaceholder('MM/YY').fill('12/29');
  await page.getByPlaceholder('•••').fill('123');
  await page.getByLabel(/agree to the terms/i).check();
  await page.getByRole('button', { name: /pay .* securely/i }).click();

  // 5. confirmation
  await expect(page.getByRole('heading', { name: 'Booking Confirmed!' })).toBeVisible({ timeout: 30_000 });
});
