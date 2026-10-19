import { test, expect } from '../fixtures';
import { firstDepartureDate } from '../helpers/flights';

test('results list QM101, selecting it opens the booking form', async ({ page, request, resultsPage }) => {
  const day = await firstDepartureDate(request); // a day that really has a flight
  await resultsPage.open(day);

  await expect(resultsPage.flight('QM101')).toBeVisible();
  await expect(page.getByText('BKK → SIN')).toBeVisible();

  await resultsPage.selectFirstFlight();
  await expect(page).toHaveURL(/\/bookings\/new/);
  await expect(page.getByRole('heading', { name: 'Book Your Flight' })).toBeVisible();
});
