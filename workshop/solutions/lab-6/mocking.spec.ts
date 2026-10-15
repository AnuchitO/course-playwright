import { test, expect } from '../lab-5/fixtures';
import { CARD, PASSENGER } from '../../starter/helpers/data';
import { firstDepartureDate, firstFlight, createBookingViaApi, QOOMLEE_API } from '../../starter/helpers/flights';

const RESULTS = (day: string) =>
  `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`;

test('mocked search: the UI shows exactly the flight we hand it', async ({ page }) => {
  await page.route('**/api/flights/search*', (route) =>
    route.fulfill({
      json: {
        flights: [
          {
            id: 999, flightNumber: 'QM999X', origin: 'BKK', destination: 'SIN',
            departureTime: '2026-12-01T08:00:00+07:00', arrivalTime: '2026-12-01T10:30:00+07:00',
            status: 'SCHEDULED', basePriceMinor: 123400, basePrice: '1234.00', currency: 'THB',
            availableSeats: 5, durationMinutes: 150,
          },
        ],
      },
    }),
  );
  await page.goto(RESULTS('2026-12-01'));
  await expect(page.getByText('QM999X').first()).toBeVisible();
});

test('mocked search: a route with no flights', async ({ page }) => {
  await page.route('**/api/flights/search*', (route) => route.fulfill({ json: { flights: [] } }));
  await page.goto(RESULTS('2026-12-01'));
  await expect(page.getByRole('button', { name: /select/i })).toHaveCount(0);
});

test('mocked search: backend down shows the error state', async ({ page }) => {
  await page.route('**/api/flights/search*', (route) => route.fulfill({ status: 500, json: { error: 'boom' } }));
  await page.goto(RESULTS('2026-12-01'));
  await expect(page.getByText('Something went wrong loading flights.')).toBeVisible();
});

test('payment gateway declines: user sees a clear message (no real charge)', async ({ page, onBookingForm, paymentPage }) => {
  await page.route('**/api/payments/charge', (route) =>
    route.fulfill({ status: 500, json: { error: 'gateway_unavailable' } }),
  );
  await onBookingForm.fill({ ...PASSENGER, email: PASSENGER.email() });
  await onBookingForm.continueToPayment();
  await paymentPage.pay(CARD);

  await expect(page.getByText("We couldn't process your payment. Please try again.")).toBeVisible();
});

test('API contract: search returns well-formed flights', async ({ request }) => {
  const day = await firstDepartureDate(request);
  const res = await request.get(`${QOOMLEE_API}/api/flights/search`, {
    params: { origin: 'BKK', destination: 'SIN', date: day },
  });
  expect(res.ok()).toBeTruthy();
  const { flights } = await res.json();
  expect(flights.length).toBeGreaterThan(0);
  expect(flights[0]).toMatchObject({
    origin: 'BKK',
    destination: 'SIN',
    currency: 'THB',
    flightNumber: expect.stringMatching(/^[A-Z]{2}\d{3}$/),
  });
});

test('API contract: missing search params are rejected', async ({ request }) => {
  const res = await request.get(`${QOOMLEE_API}/api/flights/search`, { params: { origin: 'BKK' } });
  expect(res.status()).toBe(400);
  expect(await res.json()).toMatchObject({ error: 'MISSING_REQUIRED_FIELD' });
});

test('test data via API: a booking created without a single click appears in the UI', async ({ page, request }) => {
  await page.goto('/flights');
  const token = await page.evaluate(() => localStorage.getItem('qoomlee:session:token'));
  const flight = await firstFlight(request, await firstDepartureDate(request));
  const ref = await createBookingViaApi(request, token!, flight);

  await page.goto('/bookings');
  await expect(page.getByText(ref)).toBeVisible();
});
