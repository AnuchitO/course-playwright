import type { Page } from '@playwright/test';

export class ResultsPage {
  constructor(private readonly page: Page) {}

  flight = (flightNumber: string) => this.page.getByText(flightNumber).first();

  async open(day: string, route = { origin: 'BKK', destination: 'SIN' }) {
    const q = new URLSearchParams({ ...route, departure: day, passengers: '1', cabin: 'economy' });
    await this.page.goto(`/flights/results?${q}`);
  }

  async selectFirstFlight() {
    await this.page.getByRole('button', { name: /select/i }).first().click();
  }
}
