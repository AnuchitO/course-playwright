import { test as base, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';
import { SearchPage } from '../pages/SearchPage';
import { ResultsPage } from '../pages/ResultsPage';
import { PassengerPage } from '../pages/PassengerPage';
import { PaymentPage } from '../pages/PaymentPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';

type Fixtures = {
  searchPage: SearchPage;
  resultsPage: ResultsPage;
  passengerPage: PassengerPage;
  paymentPage: PaymentPage;
  confirmationPage: ConfirmationPage;
  /** Already on the passenger form for the first BKK->SIN flight. */
  onPassengerForm: PassengerPage;
};

export const test = base.extend<Fixtures>({
  searchPage: async ({ page }, use) => use(new SearchPage(page)),
  resultsPage: async ({ page }, use) => use(new ResultsPage(page)),
  passengerPage: async ({ page }, use) => use(new PassengerPage(page)),
  paymentPage: async ({ page }, use) => use(new PaymentPage(page)),
  confirmationPage: async ({ page }, use) => use(new ConfirmationPage(page)),

  onPassengerForm: async ({ request, resultsPage, passengerPage }, use) => {
    await resultsPage.open(await firstDepartureDate(request));
    await resultsPage.selectFirstFlight();
    await expect(passengerPage.heading).toBeVisible();
    await use(passengerPage);
  },
});

export { expect };
