import { test, expect } from '../fixtures';
import { firstDepartureDate } from '../helpers/flights';
import { aPassenger } from '../data/passenger';
import { TEST_CARD } from '../data/card';

test('full journey: search results to confirmation @smoke', async ({ request, resultsPage, passengerPage: form, paymentPage, confirmationPage, page }) => {
  // 1-2. results (skip the search form: it is already covered by step 1)
  await resultsPage.open(await firstDepartureDate(request));
  await resultsPage.selectFirstFlight();

  // 3. passenger
  await form.fill(aPassenger());
  await form.continueToPayment();

  // 4. payment
  await paymentPage.payWith(TEST_CARD);

  // 5. confirmation
  await expect(confirmationPage.heading).toBeVisible({ timeout: 30_000 });
  await expect(confirmationPage.reference).toBeVisible();
  await expect(page.getByText('BKK → SIN').first()).toBeVisible();
  await expect(page.getByText('Jane Doe')).toBeVisible();
});
