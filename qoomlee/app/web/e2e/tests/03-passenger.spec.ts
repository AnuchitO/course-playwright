import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';

test.beforeEach(async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(
    `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`,
  );
});
