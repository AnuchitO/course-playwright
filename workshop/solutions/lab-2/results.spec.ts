import { test, expect } from '../../starter/helpers/fixtures';
import { firstDepartureDate } from '../../starter/helpers/flights';

// Run it slow:  SLOW_API=3000 npx playwright test -c solutions lab-2
test('results show the QM101 flight', async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(`/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`);

  // web-first assertion: retries until QM101 is visible (or 5s pass)
  await expect(page.getByText('QM101').first()).toBeVisible({ timeout: 10_000 });
});

test('selecting a flight opens the booking form', async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(`/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`);

  await page.getByRole('button', { name: /select/i }).first().click(); // auto-waits until clickable
  await expect(page).toHaveURL(/\/bookings\/new/);
  await expect(page.getByRole('heading', { name: 'Book Your Flight' })).toBeVisible();
});
