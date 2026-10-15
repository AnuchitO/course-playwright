import { test, expect } from './fixtures';
import { PASSENGER, CARD } from '../../starter/helpers/data';

const passenger = () => ({ ...PASSENGER, email: PASSENGER.email() });

test('empty form shows validation errors', async ({ page, onBookingForm }) => {
  await onBookingForm.continueToPayment();
  await expect(page.getByText('Required', { exact: true })).toHaveCount(3);
});

test('book and pay: three lines of intent @smoke', async ({ onBookingForm, paymentPage }) => {
  await onBookingForm.fill(passenger());
  await onBookingForm.continueToPayment();
  await paymentPage.pay(CARD);
  await expect(paymentPage.confirmedHeading).toBeVisible({ timeout: 30_000 });
});
