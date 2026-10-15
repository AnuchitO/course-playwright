import type { Page } from '@playwright/test';

// Lab 5: turn the repeated booking-form steps into a light Page Object.
// Keep it small: locators + one method per user intent. No assertions inside.
export class BookingPage {
  constructor(private readonly page: Page) {}

  // TODO: readonly heading = this.page.getByRole('heading', { name: 'Book Your Flight' });
  // TODO: async fill(passenger) { ... }
  // TODO: async continueToPayment() { ... }
}
