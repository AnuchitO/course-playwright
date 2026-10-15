import type { Page } from '@playwright/test';

export class SearchPage {
  constructor(private readonly page: Page) {}

  readonly searchButton = this.page.getByRole('button', { name: 'Search Flights' });

  async open() {
    await this.page.goto('/flights');
  }

  async searchOneWay(from: RegExp, to: RegExp) {
    await this.page.getByRole('button', { name: 'One way' }).click();
    await this.pickAirport(from);
    await this.pickAirport(to);
    await this.page.getByText('Select date').locator('visible=true').click();
    await this.page.getByText('Today', { exact: true }).click();
    await this.searchButton.click();
  }

  // the first "Select city..." button is always the next empty field
  private async pickAirport(airport: RegExp) {
    await this.page.getByRole('button', { name: /select city or airport/i }).first().click();
    await this.page.getByRole('button', { name: airport }).click();
  }
}
