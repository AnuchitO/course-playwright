import type { Page } from '@playwright/test';
import type { Card } from '../data/card';

export class PaymentPage {
  constructor(private readonly page: Page) {}

  readonly payButton = this.page.getByRole('button', { name: /pay .* securely/i });

  async pay(card: Card) {
    await this.page.getByPlaceholder('e.g. Johnathan Doe').fill(card.name);
    await this.page.getByPlaceholder('0000 0000 0000 0000').fill(card.number);
    await this.page.getByPlaceholder('MM/YY').fill(card.expiry);
    await this.page.getByPlaceholder('•••').fill(card.cvv);
    await this.page.getByLabel(/agree to the terms/i).check();
    await this.payButton.click();
  }
}
