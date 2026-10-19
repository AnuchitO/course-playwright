import type { APIRequestContext } from "@playwright/test";

export const QOOMLEE_API = process.env.QOOMLEE_API ?? "http://localhost:9988";

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** First day (from tomorrow, next 60 days) that has a flight on the route. */
export async function firstDepartureDate(
  request: APIRequestContext,
  origin = "BKK",
  destination = "SIN",
): Promise<string> {
  for (let i = 1; i <= 60; i++) {
    const day = isoDay(new Date(Date.now() + i * 86_400_000));
    const res = await request.get(`${QOOMLEE_API}/api/flights/search`, {
      params: { origin, destination, date: day },
    });
    const { flights } = await res.json();
    if (flights?.length) return day;
  }
  throw new Error(`No ${origin}->${destination} flights in the next 60 days. Reseed: make reset`);
}
