import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';
import { ResultsPage } from '../pages/ResultsPage';

test('results list QM101, selecting it opens the booking form', async ({ page, request }) => {
  const results = new ResultsPage(page);
  const day = await firstDepartureDate(request); // a day that really has a flight
  await results.open(day);

  await expect(results.flight('QM101')).toBeVisible();
  await expect(page.getByText('BKK → SIN')).toBeVisible();

  await results.selectFirstFlight();
  await expect(page).toHaveURL(/\/bookings\/new/);
  await expect(page.getByRole('heading', { name: 'Book Your Flight' })).toBeVisible();
});
