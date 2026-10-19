import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';

test.beforeEach(async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(
    `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`,
  );
  await page.getByRole('button', { name: /select/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Book Your Flight' })).toBeVisible();
});

test('empty form shows required errors', async ({ page }) => {
  await page.getByRole('button', { name: /continue to payment/i }).click();
  await expect(page.getByText('Required', { exact: true })).toHaveCount(3);
  await expect(page.getByText('Valid email required')).toBeVisible();
});

test('email without @ is rejected', async ({ page }) => {
  await page.getByPlaceholder('e.g. John').fill('Jane');
  await page.getByPlaceholder('e.g. Doe').fill('Doe');
  await page.getByPlaceholder('john.doe@example.com').fill('not-an-email');
  await page.getByPlaceholder('000 000 000').fill('0800000000');
  await page.getByRole('button', { name: /continue to payment/i }).click();
  await expect(page.getByText('Valid email required')).toBeVisible();
  await expect(page).toHaveURL(/\/bookings\/new/);
});

test('valid passenger details move on to payment', async ({ page }) => {
  await page.getByPlaceholder('e.g. John').fill('Jane');
  await page.getByPlaceholder('e.g. Doe').fill('Doe');
  await page.getByPlaceholder('john.doe@example.com').fill(`jane+${Date.now()}@test.com`);
  await page.getByPlaceholder('000 000 000').fill('0800000000');
  await page.getByRole('button', { name: /continue to payment/i }).click();
});
