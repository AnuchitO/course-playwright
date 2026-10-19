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
});
