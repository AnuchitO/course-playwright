import type { Page } from '@playwright/test';
import type { Passenger } from '../data/passenger';

export class PassengerPage {
  constructor(private readonly page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: 'Book Your Flight' });
  readonly continueButton = this.page.getByRole('button', { name: /continue to payment/i });
  readonly requiredErrors = this.page.getByText('Required', { exact: true });
  readonly emailError = this.page.getByText('Valid email required');

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
