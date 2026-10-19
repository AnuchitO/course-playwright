import { test, expect } from '../fixtures';
import { aPassenger } from '../data/passenger';
import { TEST_CARD } from '../data/card';

test('empty form shows required errors', async ({ onPassengerForm: form }) => {
  await form.continueToPayment();
  await form.expectRequiredErrors(3);
  await form.expectEmailError();
});

test('email without @ is rejected', async ({ page, onPassengerForm: form }) => {
  await form.fill(aPassenger({ email: 'not-an-email' }));
  await form.continueToPayment();
  await form.expectEmailError();
  await expect(page).toHaveURL(/\/bookings\/new/);
});

test('valid passenger details move on to payment and pay', async ({ page, onPassengerForm: form, paymentPage, confirmationPage }) => {
  await form.fill(aPassenger());
  await form.continueToPayment();

  await expect(page).toHaveURL(/\/payment\/?\?ref=[A-Z0-9]{6}/);

  await paymentPage.payWith(TEST_CARD);
  // the gateway can take seconds: give THIS assertion more time
  await expect(confirmationPage.heading).toBeVisible({ timeout: 30_000 });
});
