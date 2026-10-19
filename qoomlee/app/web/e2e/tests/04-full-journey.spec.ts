import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';
import { PassengerPage } from '../pages/PassengerPage';
import { ResultsPage } from '../pages/ResultsPage';

test('full journey: search results to confirmation @smoke', async ({ page, request }) => {
  // 1-2. results (skip the search form: it is already covered by step 1)
  const results = new ResultsPage(page);
  await results.open(await firstDepartureDate(request));
  await results.selectFirstFlight();

  // 3. passenger
  const form = new PassengerPage(page);
  await form.enterFirstName('Jane');
  await form.enterLastName('Doe');
  await form.enterEmail(`jane+${Date.now()}@test.com`);
  await form.enterPhone('0800000000');
  await form.continueToPayment();

  // 4. payment (Omise TEST card, never a real one)
  await page.getByPlaceholder('e.g. Johnathan Doe').fill('Jane Doe');
  await page.getByPlaceholder('0000 0000 0000 0000').fill('4242 4242 4242 4242');
  await page.getByPlaceholder('MM/YY').fill('12/29');
  await page.getByPlaceholder('•••').fill('123');
  await page.getByLabel(/agree to the terms/i).check();
  await page.getByRole('button', { name: /pay .* securely/i }).click();

  // 5. confirmation
  await expect(page.getByRole('heading', { name: 'Booking Confirmed!' })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/BOOKING REFERENCE/i)).toBeVisible();
  await expect(page.getByText('BKK → SIN').first()).toBeVisible();
  await expect(page.getByText('Jane Doe')).toBeVisible();
});
