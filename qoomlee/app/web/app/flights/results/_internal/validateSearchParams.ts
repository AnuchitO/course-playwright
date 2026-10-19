interface SearchParams {
  origin: string;
  destination: string;
  departure: string; // YYYY-MM-DD
  passengers: string;
}

export type SearchValidation = { ok: true } | { ok: false; reason: string };

const AIRPORT_CODE = /^[A-Z]{3}$/;
const MAX_PASSENGERS = 9;

function isRealDate(value: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  // Date.UTC rolls 2026-02-30 over to Mar 2 — reject anything that doesn't round-trip.
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

/** Search links are user-editable URLs, so check them before calling the API. */
export function validateSearchParams(p: SearchParams): SearchValidation {
  if (!AIRPORT_CODE.test(p.origin) || !AIRPORT_CODE.test(p.destination)) {
    return { ok: false, reason: "Airport codes must be 3 letters." };
  }
  if (p.origin === p.destination) {
    return { ok: false, reason: "Origin and destination must differ." };
  }
  if (!isRealDate(p.departure)) {
    return { ok: false, reason: "The departure date isn't valid." };
  }
  if (
    !/^\d+$/.test(p.passengers) ||
    Number(p.passengers) < 1 ||
    Number(p.passengers) > MAX_PASSENGERS
  ) {
    return { ok: false, reason: `Passengers must be between 1 and ${MAX_PASSENGERS}.` };
  }
  return { ok: true };
}
