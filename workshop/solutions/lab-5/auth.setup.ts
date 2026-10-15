import { test as setup } from '../../starter/helpers/fixtures';
import { createBookingViaApi, firstDepartureDate, firstFlight } from '../../starter/helpers/flights';
import { mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

export const AUTH_FILE = '.auth/traveller.json';
export const BOOKING_FILE = '.auth/booking.json';

// Qoomlee has no login: a traveller is a UUID in localStorage ("qoomlee:session:token").
// So "log in once, reuse everywhere" = create that identity once, save it as storageState.
setup('create a returning traveller who already has a booking', async ({ page, request }) => {
  const token = randomUUID();
  const flight = await firstFlight(request, await firstDepartureDate(request));
  const bookingRef = await createBookingViaApi(request, token, flight); // data via API, not UI

  await page.goto('/flights');
  await page.evaluate((t) => localStorage.setItem('qoomlee:session:token', t), token);

  mkdirSync('.auth', { recursive: true });
  writeFileSync(BOOKING_FILE, JSON.stringify({ bookingRef }));
  await page.context().storageState({ path: AUTH_FILE });
});
