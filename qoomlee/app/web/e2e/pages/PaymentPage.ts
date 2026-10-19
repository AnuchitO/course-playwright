import type { Page } from '@playwright/test';

/** Everything a traveller can do on the payment screen. */
export class PaymentPage {
  constructor(private readonly page: Page) {}

  async enterCardName(name: string) {
    await this.page.getByPlaceholder('e.g. Johnathan Doe').fill(name);
  }
  async enterCardNumber(number: string) {
    await this.page.getByPlaceholder('0000 0000 0000 0000').fill(number);
  }
  async enterExpiry(expiry: string) {
    await this.page.getByPlaceholder('MM/YY').fill(expiry);
  }
  async enterCvv(cvv: string) {
    await this.page.getByPlaceholder('•••').fill(cvv);
  }
  async acceptTerms() {
    await this.page.getByLabel(/agree to the terms/i).check();
  }
  async pay() {
    await this.page.getByRole('button', { name: /pay .* securely/i }).click();
  }
}
