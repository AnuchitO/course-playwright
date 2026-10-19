import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';

test('results list QM101, selecting it opens the booking form', async ({ page, request }) => {
  const day = await firstDepartureDate(request); // a day that really has a flight
  await page.goto(
    `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`,
  );

  await expect(page.getByText('QM101').first()).toBeVisible();
  await expect(page.getByText('BKK → SIN')).toBeVisible();

  await page.getByRole('button', { name: /select/i }).first().click();
  await expect(page).toHaveURL(/\/bookings\/new/);
});
