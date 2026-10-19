import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

test('search BKK to SIN, one way', async ({ page }) => {
  const search = new SearchPage(page);
  await search.open();
  await search.searchOneWay(/Suvarnabhumi/, /Singapore Changi/);
  await expect(page).toHaveURL(/\/flights\/results\/?\?.*origin=BKK.*destination=SIN/);
});
