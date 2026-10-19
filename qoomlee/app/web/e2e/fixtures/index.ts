import { test as base } from '@playwright/test';
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
};

export const test = base.extend<Fixtures>({
  searchPage: async ({ page }, use) => use(new SearchPage(page)),
  resultsPage: async ({ page }, use) => use(new ResultsPage(page)),
  passengerPage: async ({ page }, use) => use(new PassengerPage(page)),
  paymentPage: async ({ page }, use) => use(new PaymentPage(page)),
  confirmationPage: async ({ page }, use) => use(new ConfirmationPage(page)),
});

export { expect } from '@playwright/test';
