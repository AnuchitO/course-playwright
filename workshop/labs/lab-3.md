# Lab 3: The booking form (20 min)

**Goal:** cover the passenger form and the whole journey, one behavior per test.

## Task
Create `starter/tests/booking-form.spec.ts`. Use a `beforeEach` that reaches the booking form from the results page. Then write:
1. **Empty submit** shows a required error on all required fields.
2. **Email without @** shows "Valid email required" and stays on the page.
3. **Valid details** continue to the payment page (URL has `?ref=` and a 6-character PNR).
4. **Full journey:** book, pay with the Omise **test card**, see "Booking Confirmed!".

## Acceptance criteria
- [ ] 4 independent tests, each with a name that states the behavior
- [ ] Emails are unique per run (`PASSENGER.email()`)
- [ ] The journey test is tagged `@smoke`

## Hints
- `getByText('Required')` matches 4 elements here. Why? Fix it with `{ exact: true }`.
- Payment fields: placeholders `e.g. Johnathan Doe`, `0000 0000 0000 0000`, `MM/YY`, `•••`; the terms box is `getByLabel(/agree to the terms/i)`.
- Test card: `4242 4242 4242 4242`, `12/29`, `123`. Test mode only.

## Stuck?
`solutions/lab-3/booking-form.spec.ts` (branch `lab-3-solution`).
