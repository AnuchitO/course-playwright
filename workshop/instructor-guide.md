# Instructor guide: Playwright for the Qoomlee app (180 min)

## Before the day (do this 24 h ahead)
1. **Backend up and freshly seeded** (seed dates are relative to when the DB volume was created, so they go stale):
   `cd qoomlee-challenge && docker compose down -v && docker compose up -d --wait`
2. **Web app up:** `cd qoomlee-challenge/app/web && bun run dev` -> <http://localhost:3000/flights>
3. **Workshop repo:** `cd workshop && npm install && npx playwright install` (about 500 MB: do it on the venue wifi never).
4. Run the whole solution set once: `npm run solutions` -> everything green.
5. Run lab 7's all-browser smoke once: `npx playwright test -c solutions/lab-7/playwright.config.ts --grep @smoke`.
6. Start the sync server for the deck (`slidev-addon-muan-companion`), set room and presenter codes.

### Facts about this environment (verified)
- The Qoomlee UI is **English only**. There is no Thai/English switch and no login. Identity is an anonymous UUID in `localStorage["qoomlee:session:token"]`, which is why Lab 5 uses it for `storageState`.
- The backends send **no CORS headers**, so `starter/helpers/fixtures.ts` has an auto `corsBridge` fixture that forwards to the real backend and adds the headers. Nothing is mocked. Never present it as a Playwright feature.
- `SLOW_API=3000` delays backend calls (used in Lab 2).
- The date picker **closes itself on scroll**. A short viewport makes Playwright's scroll-into-view close it. This is the Lab 4 bug 2; the starter config uses a 1280x1000 viewport to avoid it elsewhere.
- Payment uses Omise **test mode** (card `4242 4242 4242 4242`, `12/29`, `123`). Real charges never happen.
- Playwright is pinned to **1.60.0** to match the cached browsers and the app's own tests.

## Timeline
| Time | Module | Demo | Lab |
|---|---|---|---|
| 0:00 | M0 Why and setup | `npm test`, HTML report | Lab 0 (3 min, inside the 10) |
| 0:10 | M1 Search flights | write the search test live | Lab 1 (15) |
| 0:35 | M2 Flaky and auto-wait | `SLOW_API=3000` red then green | Lab 2 (15) |
| 0:55 | **Break 10** | | |
| 1:05 | M3 Booking flow and forms | empty submit, `{exact:true}` | Lab 3 (20) |
| 1:30 | M4 Debugging | `--ui`, trace, codegen | Lab 4 (15) |
| 1:50 | M5 Duplication | POM then fixture then storageState | Lab 5 (20) |
| 2:15 | M6 Real world | `page.route`, API data | Lab 6 (20) |
| 2:35 | M7 Run everywhere | 4 projects, `--grep @smoke`, CI file | Lab 7 (12) |
| 2:50 | M8 Wrap-up | checklist | none |

## Demo scripts (exact steps and fallbacks)
**M0:** `cd workshop && npm test` -> `npm run report`. *If the app is down:* `curl -I localhost:3000/flights`; restart `bun run dev`. *If browsers are missing:* `npx playwright install chromium`.

**M1:** write the test in 3 passes (goto + heading; open origin + pick BKK; whole form + URL). Show `codegen` once for locator discovery. *If the picker fails to open:* viewport is too short, see M4.

**M2:** run `SLOW_API=3000 npx playwright test -c starter lab2` (red), then the solution (green). *If it passes anyway:* the machine is too slow already, raise to 6000.

**M3:** run the empty-submit test with `getByText('Required')` (fails, 4 matches) then add `{ exact: true }`. *If payment hangs:* Omise tokenization needs internet. Fall back to the mocked decline test from Lab 6.

**M4:** `npx playwright test -c starter lab4 --ui`; then `--trace on` and `show-trace`. *If the UI mode is blank:* `npx playwright install` again.

**M5:** diff the Lab 3 journey (25 lines) against Lab 5 (4 lines). Show `.auth/traveller.json`. *If `/bookings` is empty:* the setup project did not run; use `npm run solutions`, not a single file path.

**M6:** run mocking tests while stopping the backend (`docker compose stop qoomlee-service`): mock tests still pass, API tests fail. Restart with `docker compose start qoomlee-service`.

**M7:** `npx playwright test -c solutions/lab-7/playwright.config.ts --grep @smoke`.

## Common failure points
| Symptom | Cause | Fix |
|---|---|---|
| `No BKK->SIN flights in next 60 days` | seed is stale | `docker compose down -v && docker compose up -d --wait` |
| Calendar never opens | viewport too short (scroll closes it) | 1280x1000 viewport |
| `browserType.launch: Executable doesn't exist` | wrong Playwright version or browsers missing | stay on 1.60.0; `npx playwright install` |
| Network error, `net::ERR_FAILED` to :9988 | `corsBridge` fixture not used | import `test` from `helpers/fixtures`, not `@playwright/test` |
| `getByText('Required')` count 4 | substring match | `{ exact: true }` |
| Payment step times out | no internet to Omise | use the mocked decline path |

## If you are running late (cut content, never the lab)
1. **Cut the codegen bonus in Lab 4 and the "faster pairs" extras** in every lab.
2. M1: show the finished test, let them type it in the lab. (saves 5)
3. M3: skip "Valid details" test, keep empty submit + full journey. (saves 5)
4. M5: skip fixtures, teach POM + storageState only. (saves 5)
5. M6: drop the API contract tests, keep mock + decline + data via API. (saves 5)
6. M7: do not run all 4 browsers live; show the config and the CI file. (saves 5)
Never cut: Lab 2 (the aha moment) and Lab 4 (the skill they will use daily).

## What NOT to E2E test (say this in the wrap-up)
Validation rules for every field combination, price math, date formatting: unit/component tests. Cross-service contracts: contract tests. Keep E2E for the 3 to 5 journeys that must never break.
