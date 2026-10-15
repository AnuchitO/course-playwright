# Lab 6: Don't depend on the real world (20 min)

**Goal:** control the things you don't own, and stop clicking for data.

## Task
Create `starter/tests/mocking.spec.ts`:
1. **Mock search:** `page.route('**/api/flights/search*', ...)` returns one fake flight `QM999X`. Assert it is shown.
2. **Mock errors:** an empty list (no Select buttons) and a 500 (text "Something went wrong loading flights.").
3. **Payment declined:** mock `**/api/payments/charge` with a 500, run the booking flow, assert "We couldn't process your payment. Please try again." (No real charge happens.)
4. **API assertions:** with `request`, check `GET /api/flights/search` returns well-formed flights, and that missing params give `400`.
5. **Data via API:** create a booking with `createBookingViaApi`, then assert it appears on `/bookings`.

## Acceptance criteria
- [ ] Mock tests pass with the real backend switched off for that call
- [ ] The decline test never reaches a real charge
- [ ] No test creates data by clicking when an API call can do it

## Hints
- `route.fulfill({ json: {...} })`, or `{ status: 500, json: {...} }`.
- Register the route **before** the action that triggers the request.

## Stuck?
`solutions/lab-6/mocking.spec.ts` (branch `lab-6-solution`).
