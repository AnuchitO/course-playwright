import { test, expect } from '../../starter/helpers/fixtures';
import { firstDepartureDate } from '../../starter/helpers/flights';

test('traveller searches a one-way flight BKK to SIN', async ({ page }) => {
  await page.goto('/flights');
  await page.getByRole('button', { name: 'One way' }).click();

  await page.getByRole('button', { name: /select origin/i }).click();
  await page.getByRole('button', { name: /Suvarnabhumi/ }).click();
  await page.getByRole('button', { name: /select destination/i }).click();
  await page.getByRole('button', { name: /Singapore Changi/ }).click();

  await page.getByRole('button', { name: /select date/i }).click();
  await page.getByTestId('calendar-panel').getByRole('button', { name: /today/i }).click();

  await page.getByRole('button', { name: 'Search Flights' }).click();
  await expect(page).toHaveURL(/\/flights\/results\/?\?.*origin=BKK.*destination=SIN/);
});

test('results page lists flights for the route', async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(`/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`);
  await expect(page.getByText('QM101').first()).toBeVisible();
});
