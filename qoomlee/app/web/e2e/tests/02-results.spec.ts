import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';

test('results list QM101', async ({ page, request }) => {
  const day = await firstDepartureDate(request); // a day that really has a flight
  await page.goto(
    `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`,
  );
});
