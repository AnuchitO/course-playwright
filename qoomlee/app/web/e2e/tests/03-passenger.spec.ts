import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';
import { PassengerPage } from '../pages/PassengerPage';
import { ResultsPage } from '../pages/ResultsPage';
import { PaymentPage } from '../pages/PaymentPage';
import { TEST_CARD } from '../data/card';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { aPassenger } from '../data/passenger';

test.beforeEach(async ({ page, request }) => {
  const results = new ResultsPage(page);
  await results.open(await firstDepartureDate(request));
  await results.selectFirstFlight();
  await expect(new PassengerPage(page).heading).toBeVisible();
});

test('empty form shows required errors', async ({ page }) => {
  const form = new PassengerPage(page);
  await form.continueToPayment();
  await form.expectRequiredErrors(3);
  await form.expectEmailError();
});

test('email without @ is rejected', async ({ page }) => {
  const form = new PassengerPage(page);
  await form.fill(aPassenger({ email: 'not-an-email' }));
  await form.continueToPayment();
  await form.expectEmailError();
  await expect(page).toHaveURL(/\/bookings\/new/);
});

test('valid passenger details move on to payment and pay', async ({ page }) => {
  const form = new PassengerPage(page);
  await form.fill(aPassenger());
  await form.continueToPayment();

  await expect(page).toHaveURL(/\/payment\/?\?ref=[A-Z0-9]{6}/);

  await new PaymentPage(page).payWith(TEST_CARD);

  // the gateway can take seconds: give THIS assertion more time
  const confirmation = new ConfirmationPage(page);
  await expect(confirmation.heading).toBeVisible({ timeout: 30_000 });
});
