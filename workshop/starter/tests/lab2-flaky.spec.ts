import { test, expect } from '../helpers/fixtures';
import { firstDepartureDate } from '../helpers/flights';

// Lab 2: this test passes on a fast machine and fails on a slow one.
//   SLOW_API=3000 npx playwright test -c starter lab2
// Fix it WITHOUT making the sleep longer.
test('results show the QM101 flight', async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(`/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`);

  await page.waitForTimeout(500);
  const visible = await page.getByText('QM101').first().isVisible();
  expect(visible).toBe(true);
});
