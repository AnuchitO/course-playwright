# Lab 0: Setup and your first test (3 min)

**Goal:** a green test and an HTML report on your machine.

## Steps
1. `cd workshop && npm install && npx playwright install chromium`
2. Make sure the app is up: <http://localhost:3000/flights> loads, and `docker compose ps` (in `qoomlee-challenge`) shows both services healthy.
3. Open `starter/tests/example.spec.ts`. Add one assertion: the heading **Flight Search** is visible.
4. `npm test` then `npm run report`.

## Acceptance criteria
- [ ] `npm test` shows 1 passed (example.spec.ts)
- [ ] The HTML report opened in your browser

## Hint
`await expect(page.getByRole('heading', { name: '...' })).toBeVisible();`

## Stuck?
Solution: `solutions/lab-0/example.spec.ts` (branch `lab-0-solution`).
