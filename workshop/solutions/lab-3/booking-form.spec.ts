import { test, expect } from '../../starter/helpers/fixtures';
import { firstDepartureDate } from '../../starter/helpers/flights';
import { PASSENGER, CARD } from '../../starter/helpers/data';

test.beforeEach(async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(`/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`);
  await page.getByRole('button', { name: /select/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Book Your Flight' })).toBeVisible();
});

const continueButton = (page: import('@playwright/test').Page) =>
  page.getByRole('button', { name: /continue to payment/i });

test('empty form shows a required error on every field', async ({ page }) => {
  await continueButton(page).click();
  await expect(page.getByText('Required', { exact: true })).toHaveCount(3);
  await expect(page.getByText('Valid email required')).toBeVisible();
});

test('email without @ is rejected', async ({ page }) => {
  await page.getByPlaceholder('e.g. John').fill(PASSENGER.firstName);
  await page.getByPlaceholder('e.g. Doe').fill(PASSENGER.lastName);
  await page.getByPlaceholder('john.doe@example.com').fill('not-an-email');
  await page.getByPlaceholder('000 000 000').fill(PASSENGER.phone);
  await continueButton(page).click();

  await expect(page.getByText('Valid email required')).toBeVisible();
  await expect(page).toHaveURL(/\/bookings\/new/); // did not move on
});

test('valid passenger details move on to payment @smoke', async ({ page }) => {
  await page.getByPlaceholder('e.g. John').fill(PASSENGER.firstName);
  await page.getByPlaceholder('e.g. Doe').fill(PASSENGER.lastName);
  await page.getByPlaceholder('john.doe@example.com').fill(PASSENGER.email());
  await page.getByPlaceholder('000 000 000').fill(PASSENGER.phone);
  await continueButton(page).click();

  await expect(page).toHaveURL(/\/payment\/?\?ref=[A-Z0-9]{6}/);
});

test('full journey: book, pay with test card, get a PNR @smoke', async ({ page }) => {
  await page.getByPlaceholder('e.g. John').fill(PASSENGER.firstName);
  await page.getByPlaceholder('e.g. Doe').fill(PASSENGER.lastName);
  await page.getByPlaceholder('john.doe@example.com').fill(PASSENGER.email());
  await page.getByPlaceholder('000 000 000').fill(PASSENGER.phone);
  await continueButton(page).click();

  await page.getByPlaceholder('e.g. Johnathan Doe').fill(CARD.name);
  await page.getByPlaceholder('0000 0000 0000 0000').fill(CARD.number);
  await page.getByPlaceholder('MM/YY').fill(CARD.expiry);
  await page.getByPlaceholder('•••').fill(CARD.cvv);
  await page.getByLabel(/agree to the terms/i).check();
  await page.getByRole('button', { name: /pay .* securely/i }).click();

  await expect(page.getByRole('heading', { name: 'Booking Confirmed!' })).toBeVisible({ timeout: 30_000 });
});
