import { test, expect } from '../helpers/fixtures';

// Lab 0: your first test. Make it pass, then open the HTML report.
test('Qoomlee search page loads', async ({ page }) => {
  await page.goto('/flights');
  // TODO: assert the page heading "Flight Search" is visible
});
