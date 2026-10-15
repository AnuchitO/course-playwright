# Lab 2: Fix the flaky test (15 min)

**Goal:** make a test that is correct on every machine, fast or slow.

## Task
1. Run the fragile test the way a slow CI machine would:
   `SLOW_API=3000 npx playwright test -c starter lab2` -> it fails.
2. Fix `starter/tests/lab2-flaky.spec.ts` **without** increasing the sleep. Delete the `waitForTimeout`.
3. Re-run with `SLOW_API=3000` and with no delay. Both must pass.
4. Add a second test: click the first **Select** button and assert you land on the booking form (URL and heading).

## Acceptance criteria
- [ ] No `waitForTimeout` and no `isVisible()` inside an `expect`
- [ ] Passes with `SLOW_API=0` and `SLOW_API=3000`
- [ ] Uses `toBeVisible` / `toHaveURL` (web-first assertions)

## Hints
- `await expect(locator).toBeVisible()` retries until it is true.
- `expect(await locator.isVisible()).toBe(true)` checks once. That is the bug.

## Stuck?
`solutions/lab-2/results.spec.ts` (branch `lab-2-solution`).
