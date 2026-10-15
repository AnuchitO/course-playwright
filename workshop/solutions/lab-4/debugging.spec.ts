import { test, expect } from '../../starter/helpers/fixtures';
import { firstDepartureDate } from '../../starter/helpers/flights';

// Bug 1: placeholder is "e.g. John", not "e.g. Jon"  (Trace Viewer: locator never resolved).
test('booking form accepts a passenger name', async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(`/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`);
  await page.getByRole('button', { name: /select/i }).first().click();

  await page.getByPlaceholder('e.g. John').fill('Jane');
  await expect(page.getByPlaceholder('e.g. John')).toHaveValue('Jane');
});

// Bug 2: on a 600px-high screen Playwright scrolls the button into view, and the
// app closes the calendar on scroll (Trace Viewer: the panel flashes then vanishes).
// Fix: a taller viewport (or scroll first, then click).
test.describe('laptop screen', () => {
  test.use({ viewport: { width: 1280, height: 1000 } });

  test('date picker opens', async ({ page }) => {
    await page.goto('/flights');
    await page.getByRole('button', { name: /select date/i }).click();
    await expect(page.getByTestId('calendar-panel')).toBeVisible();
  });
});
