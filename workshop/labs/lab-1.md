# Lab 1: Search flights (15 min)

**Goal:** a test that drives the search form like a traveller and checks where it lands.

## Task
Create `starter/tests/search-flights.spec.ts`:
1. Open `/flights`, choose **One way**.
2. Pick origin **Suvarnabhumi (BKK)** and destination **Singapore Changi (SIN)**.
3. Open the date picker, choose **Today**, click **Search Flights**.
4. Assert the URL is the results page for BKK to SIN.
5. Second test: open the results page for a real departure date (use `firstDepartureDate(request)` from `helpers/flights.ts`) and assert flight **QM101** is listed.

## Rules
Locator priority: `getByRole` > `getByLabel` > `getByText` > `getByTestId`. No CSS, no XPath.

## Acceptance criteria
- [ ] Both tests pass
- [ ] Zero CSS/XPath selectors
- [ ] You can explain why each locator was chosen

## Hints
- Buttons: `page.getByRole('button', { name: /select origin/i })`
- URL: `await expect(page).toHaveURL(/origin=BKK/)`
- Don't know a locator? `npx playwright codegen http://localhost:3000/flights`

## Stuck?
`solutions/lab-1/search-flights.spec.ts` (branch `lab-1-solution`).
