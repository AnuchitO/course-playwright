---
layout: module-title
module: 2
heading: Flight results
thai: ผลการค้นหาเที่ยวบิน
time: 0:35 - 0:55 · 20 min
problem: Test the next screen without redoing the search every time.
---

<!--
SAY: Module 2. The results page. A new problem shows up straight away: to test this screen we would have to run the whole search form first. Let's see the smart way.
TIME: 30 s.
NEXT: The screen.
-->

---
layout: story
module: 2
---

Every test that needs the results page re-types the search form: 12 lines, 3 seconds, 3 chances to fail. And "tomorrow" may have no flights at all.

::naive::
**Today:** copy the search steps into every test, and hard-code a date.
- Slow: the form is already covered by test 1
- Brittle: seeded flights exist only on certain days

<!--
SAY: Two separate problems. Repetition: we already proved the form works; we do not need to prove it in every test. Data: a hard-coded date will rot. Fix both with: go straight to the URL (the URL IS the search), with a date the API says has flights.
TIME: 2 min.
NEXT: The results screen.
-->

---
layout: default
module: 2
stepId: m2-screen
class: compact
---

# Step 1: the results screen

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

What we can assert, as a user:

<v-clicks>

- The route header: **BKK → SIN**
- A flight card: **QM101**
- Price and the **Select** button

</v-clicks>

<div class="small" style="margin-top:1rem">The URL is the whole search:</div>

```txt
/flights/results?origin=BKK&destination=SIN
  &departure=2026-10-16&passengers=1&cabin=economy
```
</div>
<PhoneShot src="06-results" caption="/flights/results" :height="410" :marks="[
  { k: 'route', at: 1, from: 'ul li:nth-child(1)' },
  { k: 'card', at: 2, from: 'ul li:nth-child(2)' },
  { k: 'select', at: 3, from: 'ul li:nth-child(3)' },
]" />
</div>

<!--
SAY: Because the search state lives in the query string, we can skip the form by opening the URL. This is a general trick: if a state is in the URL, teleport to it.
TIME: 2 min.
NEXT: Which date?
-->

---
layout: default
module: 2
stepId: m2-date
class: compact
---

# Step 2: ask the API for a real date

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

```ts [qoomlee/app/web/e2e/tests/02-results.spec.ts] {1-2|4-8|10|11|all}
import { test, expect } from '@playwright/test';
import { firstDepartureDate } from '../helpers/flights';

test('results list QM101', async ({ page, request }) => {
  const day = await firstDepartureDate(request); // a day that really has a flight
  await page.goto(
    `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`,
  );

  await expect(page.getByText('QM101').first()).toBeVisible();
  await expect(page.getByText('BKK → SIN')).toBeVisible();
});
```

<div class="small"><code>request</code> is a built-in fixture: an HTTP client, no browser. Test data from the API keeps the test valid next week.</div>
</div>
<PhoneShot src="06-results" caption="what the test sees" :height="400" :marks="[
  { k: 'card', at: 2, line: 10 },
  { k: 'route', at: 3, line: 11 },
]" />
</div>

<!--
SAY: `request` is Playwright's API client. firstDepartureDate asks the backend for the first day with BKK to SIN flights, so the test never goes stale. Never hard-code "2026-10-16": it is red in a month.
Notice what we assert: the flight number and the route. `QM101` is rendered twice on the page, so `getByText('QM101')` alone fails with a strict mode violation; `.first()` picks one on purpose. Two facts a user would check.
Q: "Is calling the API from a UI test cheating?" For setup and data, no. For the thing under test, yes. We only use it to pick a date.
TIME: 4 min.
NEXT: Auto-wait.
-->

---
layout: default
module: 2
stepId: m2-autowait
---

# Why there is no `sleep`

<div class="grid grid-cols-2 gap-6">
<div>

<div class="label-bad">Never</div>

```ts
await page.goto(url);
await page.waitForTimeout(3000); // hope
expect(await card.isVisible()).toBe(true);
```
</div>
<div>

<div class="label-good">Always</div>

```ts
await page.goto(url);
await expect(card).toBeVisible();
// retries up to 5 s, passes the moment it is true
```
</div>
</div>

<div class="small" style="margin-top:1rem">Before every click Playwright checks: attached, visible, stable, enabled, receives events. Assertions starting with <code>await expect(locator)</code> retry; <code>expect(await x.isVisible())</code> does not.</div>

<!--
SAY: This is the single most important habit. Results arrive from a network call; the page is empty for a moment. A sleep either wastes time or fails on a slow machine. A web-first assertion waits exactly as long as needed.
DEMO (optional): `SLOW_API=3000 bun run test:e2e 02-results` delays every backend call by 3 s and the test still passes.
TIME: 4 min.
NEXT: Select the flight.
-->

---
layout: default
module: 2
stepId: m2-select
class: compact
---

# Step 3: select the flight

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 items-center">
<div>

```ts [qoomlee/app/web/e2e/tests/02-results.spec.ts] {1|2|3-4|all}
await page.getByRole('button', { name: /select/i }).first().click();
await expect(page).toHaveURL(/\/bookings\/new/);
await expect(page.getByRole('heading', { name: 'Book Your Flight' }))
  .toBeVisible();
```

<StepCommand command="cd qoomlee/app/web && bun run test:e2e 02-results" />

<div class="small">Two assertions on arrival: <b>URL</b> (right route) and <b>heading</b> (page really rendered).</div>
</div>
<PhoneShot src="06-results" caption="results" :height="330" :marks="[
  { k: 'select', at: 0, line: 1 },
]" />
<PhoneShot src="07-booking-empty" caption="booking form" :height="330" :marks="[
  { k: 'heading', at: 2, line: 3 },
]" />
</div>

<!--
SAY: Select is a button inside the card. If there are many flights, `.first()` is the cheapest default; later we could filter by flight number: `card.filter({ hasText: 'QM101' })`.
TIME: 3 min.
NEXT: Lab 2.
-->

---
layout: lab
module: 2
lab: 2
minutes: 8
solution: qoomlee/app/web/e2e/tests/02-results.spec.ts
---

Create `qoomlee/app/web/e2e/tests/my/02-results.spec.ts`.

1. Get a real date with `firstDepartureDate(request)`
2. Open the results URL, assert **QM101** is visible
3. Select the first flight
4. Assert you are on `/bookings/new` with the **Book Your Flight** heading

::criteria::
- [ ] Passes, also with `SLOW_API=3000`
- [ ] No `waitForTimeout` anywhere
- [ ] Bonus: assert the price text `4,200`

::hint::
`getByText('QM101').first()` is enough: the flight number shows up twice on the card, so strict mode needs `.first()`. <br>**Run it:** `cd qoomlee/app/web && bun run test:e2e my/02-results` <br>`cd qoomlee/app/web && SLOW_API=3000 bun run test:e2e my/02-results`

::recap::
- The URL is state: **teleport** to a screen instead of clicking there
- Take dates from the **API**, never hard-code
- Assertions retry; sleeps are a bug

<!--
SAY: 8 minutes. Solution: qoomlee/app/web/e2e/tests/02-results.spec.ts.
RECAP (click): SAY: three bullets. Ask who tried SLOW_API and saw it still pass. TIME: 1 min.
NEXT: The booking form, where tests get long.
-->
