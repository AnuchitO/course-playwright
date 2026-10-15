import { test, expect } from '../fixtures';
import { aPassenger } from '../data/passenger';

test('empty form shows required errors', async ({ onPassengerForm: form }) => {
  await form.continueToPayment();
  await expect(form.requiredErrors).toHaveCount(3);
  await expect(form.emailError).toBeVisible();
});

test('email without @ is rejected', async ({ page, onPassengerForm: form }) => {
  await form.fill(aPassenger({ email: 'not-an-email' }));
  await form.continueToPayment();
  await expect(form.emailError).toBeVisible();
  await expect(page).toHaveURL(/\/bookings\/new/);
});
