import { test, expect } from '../fixtures';

test('search BKK to SIN, one way', async ({ page, searchPage }) => {
  await searchPage.open();
  await searchPage.searchOneWay(/Suvarnabhumi/, /Singapore Changi/);
  await expect(page).toHaveURL(/\/flights\/results\/?\?.*origin=BKK.*destination=SIN/);
});
