import { test as base, expect } from '../../starter/helpers/fixtures';
import { firstDepartureDate } from '../../starter/helpers/flights';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';

type Fixtures = {
  bookingPage: BookingPage;
  paymentPage: PaymentPage;
  /** A page already sitting on the booking form for the first BKK->SIN flight. */
  onBookingForm: BookingPage;
};

export const test = base.extend<Fixtures>({
  bookingPage: async ({ page }, use) => use(new BookingPage(page)),
  paymentPage: async ({ page }, use) => use(new PaymentPage(page)),
  onBookingForm: async ({ page, request, bookingPage }, use) => {
    const day = await firstDepartureDate(request);
    await page.goto(`/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`);
    await page.getByRole('button', { name: /select/i }).first().click();
    await expect(bookingPage.heading).toBeVisible();
    await use(bookingPage);
  },
});

export { expect };
