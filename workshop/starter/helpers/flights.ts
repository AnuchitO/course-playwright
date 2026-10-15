import type { APIRequestContext } from '@playwright/test';

export const QOOMLEE_API = process.env.QOOMLEE_API ?? 'http://localhost:9988';

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** First day (from tomorrow, next 60 days) that has a flight on the route. */
export async function firstDepartureDate(
  request: APIRequestContext,
  origin = 'BKK',
  destination = 'SIN',
): Promise<string> {
  for (let i = 1; i <= 60; i++) {
    const day = isoDay(new Date(Date.now() + i * 86_400_000));
    const res = await request.get(`${QOOMLEE_API}/api/flights/search`, {
      params: { origin, destination, date: day },
    });
    const { flights } = await res.json();
    if (flights?.length) return day;
  }
  throw new Error(`No ${origin}->${destination} flights in next 60 days. Reseed: docker compose down -v && docker compose up -d --wait`);
}

export type Flight = { id: number; flightNumber: string; basePriceMinor: number; departureTime: string };

/** Cheapest-id flight on the route for a given day, straight from the API. */
export async function firstFlight(request: APIRequestContext, day: string, origin = 'BKK', destination = 'SIN'): Promise<Flight> {
  const res = await request.get(`${QOOMLEE_API}/api/flights/search`, { params: { origin, destination, date: day } });
  const { flights } = await res.json();
  return flights[0];
}

/** Create a PENDING booking through the API (no UI clicks). Returns its PNR. */
export async function createBookingViaApi(
  request: APIRequestContext,
  token: string,
  flight: Flight,
  passenger = { firstName: 'Anna', lastName: 'Tester', email: 'anna@test.com', phone: '0800000000' },
): Promise<string> {
  const total = Math.round(flight.basePriceMinor * 1.15);
  const res = await request.post(`${QOOMLEE_API}/api/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { flightId: flight.id, passenger, totalAmountMinor: total, currency: 'THB', totalAmount: (total / 100).toFixed(2) },
  });
  if (!res.ok()) throw new Error(`create booking failed: ${res.status()} ${await res.text()}`);
  return (await res.json()).bookingRef;
}
