import { test, expect } from '../helpers/fixtures';
import { firstDepartureDate } from '../helpers/flights';

// Lab 4: BOTH tests below are broken. Don't read the code for the bug -
// run them, then let the Trace Viewer tell you what happened.
//   npx playwright test -c starter lab4 --trace on
//   npx playwright show-trace test-results/<folder>/trace.zip

test('booking form accepts a passenger name', async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(`/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`);
  await page.getByRole('button', { name: /select/i }).first().click();

  await page.getByPlaceholder('e.g. Jon').fill('Jane');
  await expect(page.getByPlaceholder('e.g. Jon')).toHaveValue('Jane');
});

test.describe('laptop screen', () => {
  test.use({ viewport: { width: 1280, height: 600 } });

  test('date picker opens', async ({ page }) => {
    await page.goto('/flights');
    await page.getByRole('button', { name: /select date/i }).click();
    await expect(page.getByTestId('calendar-panel')).toBeVisible();
  });
});
