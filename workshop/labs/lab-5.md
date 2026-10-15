# Lab 5: Stop repeating yourself (20 min)

**Goal:** the booking test reads like intent, and a "returning traveller" needs no setup steps.

## Task
1. **Page Object (light):** finish `starter/pages/BookingPage.ts` and add a `PaymentPage`. Locators plus one method per intent, no assertions inside.
2. **Fixture:** extend `test` with `bookingPage`, `paymentPage`, and `onBookingForm` (already on the form when the test starts).
3. **Rewrite** the lab 3 journey as about 4 lines.
4. **storageState:** Qoomlee has no login. A traveller is a UUID in `localStorage["qoomlee:session:token"]`. Write a `setup` project that creates a token, books a flight **through the API** under that token, saves `storageState`, and a test that opens `/bookings` and sees that booking with no setup steps.

## Acceptance criteria
- [ ] The journey test body is 6 lines or fewer
- [ ] Page objects contain no `expect`
- [ ] The returning-traveller test has no clicks before its assertion

## Hints
- Helpers: `createBookingViaApi`, `firstFlight` in `helpers/flights.ts`.
- `await page.context().storageState({ path: '.auth/traveller.json' })`
- In config: `dependencies: ['setup']` and `use: { storageState: '.auth/traveller.json' }`.

## Stuck?
`solutions/lab-5/` (branch `lab-5-solution`).
