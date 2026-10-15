import { test, expect } from '../../starter/helpers/fixtures';

test('Qoomlee search page loads', async ({ page }) => {
  await page.goto('/flights');
  await expect(page.getByRole('heading', { name: 'Flight Search' })).toBeVisible();
});
