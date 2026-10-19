import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';
import { PassengerPage } from '../pages/PassengerPage';
import { ResultsPage } from '../pages/ResultsPage';
import { PaymentPage } from '../pages/PaymentPage';
import { TEST_CARD } from '../data/card';
import { ConfirmationPage } from '../pages/ConfirmationPage';

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

  // 4. payment
  await new PaymentPage(page).payWith(TEST_CARD);

  // 5. confirmation
  const confirmation = new ConfirmationPage(page);
  await expect(confirmation.heading).toBeVisible({ timeout: 30_000 });
  await expect(confirmation.reference).toBeVisible();
  await expect(page.getByText('BKK → SIN').first()).toBeVisible();
  await expect(page.getByText('Jane Doe')).toBeVisible();
});
