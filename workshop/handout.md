# Playwright cheat sheet (Qoomlee workshop)

## Locator priority
1. `getByRole('button', { name: /pay/i })`   2. `getByLabel('Email')`   3. `getByPlaceholder('e.g. John')`   4. `getByText('QM101')`   5. `getByTestId('calendar-panel')` (fallback)
Never: long CSS chains, XPath, `nth-child`.
Narrow: `.first()` `.filter({ hasText })` `.getByRole(...)` inside another locator.

## Actions (auto-wait for you)
`goto('/flights')` `click()` `fill('x')` `check()` `selectOption('v')` `press('Enter')`

## Assertions (web-first, they retry)
`toBeVisible()` `toHaveText()` `toHaveValue()` `toHaveURL()` `toHaveCount(n)` `toBeEnabled()` `not.toBeVisible()`
Options: `{ exact: true }` for text, `{ timeout: 10_000 }` for slow steps.

## Never
`waitForTimeout()`. `expect(await x.isVisible())`. One 80-line test that does everything.

## Network
```ts
await page.route('**/api/flights/search*', r => r.fulfill({ json: { flights: [] } }));
const res = await request.get(url);   // API test, no browser
```

## Structure
`beforeEach` (shared setup) - Page Object (locators + intent methods) - fixtures (`test.extend`) - `storageState` (reuse identity).

## CLI
| Command | Use |
|---|---|
| `npx playwright test` | run all |
| `--ui` | interactive UI mode |
| `--debug` | step with Inspector |
| `--headed` | see the browser |
| `--grep @smoke` | tagged subset |
| `--project=webkit` | one project |
| `-g "journey"` | by title |
| `--trace on` | record traces |
| `show-trace <zip>` | open trace |
| `show-report` | HTML report |
| `codegen <url>` | record, find locators |

## A good E2E test
Named for the behavior. Independent. Unique data. No sleeps. Few, high-value journeys. Evidence kept on failure.
