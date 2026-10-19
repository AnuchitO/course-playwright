import { expect, type Page } from '@playwright/test';

/** Everything a traveller can do on the passenger form, and nothing else. */
export class PassengerPage {
  constructor(private readonly page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: 'Book Your Flight' });

  async enterFirstName(name: string) {
    await this.page.getByLabel('First Name').fill(name);
  }
  async enterLastName(name: string) {
    await this.page.getByPlaceholder('e.g. Doe').fill(name);
  }
  async enterEmail(email: string) {
    await this.page.getByPlaceholder('john.doe@example.com').fill(email);
  }
  async enterPhone(phone: string) {
    await this.page.getByPlaceholder('000 000 000').fill(phone);
  }
  async continueToPayment() {
    await this.page.getByRole('button', { name: /continue to payment/i }).click();
  }

  // a few verifies about THIS screen, named by intent
  async expectRequiredErrors(count: number) {
    await expect(this.page.getByText('Required', { exact: true })).toHaveCount(count);
  }
  async expectEmailError() {
    await expect(this.page.getByText('Valid email required')).toBeVisible();
  }
}
