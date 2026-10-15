# Lab 7: Run it everywhere (12 min)

**Goal:** one config, several browsers, a fast smoke tier, and a CI job that keeps the evidence.

## Task
1. Copy `solutions/lab-7/playwright.config.ts` ideas into your config step by step: `retries`, `workers`, `trace: 'retain-on-failure'`, then projects for `chromium`, `firefox`, `webkit`, and `Pixel 5`.
2. `npx playwright install` (all browsers), then run only the smoke tier:
   `npx playwright test --grep @smoke`.
3. Run one project: `--project=mobile-chrome`.
4. Read `solutions/lab-7/.gitlab-ci.yml`. Which lines save the evidence when a test fails?

## Acceptance criteria
- [ ] `--grep @smoke` runs only tagged tests, on all 4 projects
- [ ] You can name what `retries: 2` hides, and how the report flags it
- [ ] You can point at the artifact lines in the CI file

## Hints
- Tag in the title: `test('... @smoke', ...)`.
- A test that passes on retry is reported **flaky**. Treat that as a bug to fix, not as green.

## Stuck?
`solutions/lab-7/` (branch `lab-7-solution`).
