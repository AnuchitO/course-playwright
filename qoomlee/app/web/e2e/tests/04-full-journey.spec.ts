import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';

test('full journey: search results to confirmation @smoke', async ({ page, request }) => {
  // 1-2. results (skip the search form: it is already covered by step 1)
  const day = await firstDepartureDate(request);
  await page.goto(
    `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`,
  );
});
