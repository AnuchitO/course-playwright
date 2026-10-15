import { test, expect } from '../fixtures';
import { aPassenger } from '../data/passenger';
import { TEST_CARD } from '../data/card';

test('book and pay, get a confirmation @smoke', async ({ onPassengerForm: form, paymentPage, confirmationPage }) => {
  await form.fill(aPassenger());
  await form.continueToPayment();
  await paymentPage.payWith(TEST_CARD);

  await expect(confirmationPage.heading).toBeVisible({ timeout: 30_000 });
  await expect(confirmationPage.reference).toBeVisible();
});
