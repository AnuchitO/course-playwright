import { readFileSync } from 'node:fs';
import { test, expect } from './fixtures';

// Runs already "logged in" thanks to storageState - no setup steps in the test.
test('returning traveller sees their booking @smoke', async ({ page }) => {
  const { bookingRef } = JSON.parse(readFileSync('.auth/booking.json', 'utf8'));
  await page.goto('/bookings');
  await expect(page.getByText(bookingRef)).toBeVisible();
});
