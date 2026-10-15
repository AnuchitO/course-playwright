import type { Page } from '@playwright/test';

export type Passenger = { firstName: string; lastName: string; email: string; phone: string };

export class BookingPage {
  constructor(private readonly page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: 'Book Your Flight' });
  readonly continueButton = this.page.getByRole('button', { name: /continue to payment/i });

  async fill(p: Passenger) {
    await this.page.getByPlaceholder('e.g. John').fill(p.firstName);
    await this.page.getByPlaceholder('e.g. Doe').fill(p.lastName);
    await this.page.getByPlaceholder('john.doe@example.com').fill(p.email);
    await this.page.getByPlaceholder('000 000 000').fill(p.phone);
  }

  async continueToPayment() {
    await this.continueButton.click();
  }
}
