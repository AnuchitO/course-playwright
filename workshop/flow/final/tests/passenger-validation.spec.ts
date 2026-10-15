import { test, expect } from '../fixtures';
import { aPassenger } from '../data/passenger';

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
