import type { Page } from '@playwright/test';

/** Everything a traveller can do on the passenger form, and nothing else. */
export class PassengerPage {
  constructor(private readonly page: Page) {}
}
