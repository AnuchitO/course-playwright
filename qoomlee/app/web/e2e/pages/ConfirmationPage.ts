import type { Page } from '@playwright/test';

export class ConfirmationPage {
  constructor(private readonly page: Page) {}

  readonly heading = this.page.getByRole('heading', { name: 'Booking Confirmed!' });
  readonly reference = this.page.getByText(/booking reference/i);
}
