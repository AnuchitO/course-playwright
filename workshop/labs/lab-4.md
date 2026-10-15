# Lab 4: It failed. Why? (15 min)

**Goal:** find two bugs using tools, not by reading the code.

## Task
`starter/tests/lab4-broken.spec.ts` has two failing tests.
1. `npx playwright test -c starter lab4 --ui`: watch each failure in UI mode.
2. `npx playwright test -c starter lab4 --trace on`, then `npx playwright show-trace test-results/<folder>/trace.zip`.
3. For each failure write one sentence: **what the browser actually did**.
4. Fix both tests.
5. Bonus: `npx playwright codegen http://localhost:3000/flights` and record the origin selection. Compare its locators to yours.

## Acceptance criteria
- [ ] Both tests pass
- [ ] You can show the trace step where each one went wrong
- [ ] You read the HTML report's failure screenshot

## Hints
- Bug 1: look at the **Locator** panel in the trace. Did it ever resolve?
- Bug 2: watch the calendar in the **Before/After** snapshots. What happened between the click and the assertion? Hint: the viewport is short.

## Stuck?
`solutions/lab-4/debugging.spec.ts` (branch `lab-4-solution`).
