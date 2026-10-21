---
layout: module-title
module: 5
heading: Confirmation and the full journey
thai: หน้ายืนยันและ flow ตั้งแต่ต้นจนจบ
time: 1:40 - 1:55 · 15 min
problem: Assert the outcome a traveller cares about, then glue all six steps into one test.
---

<!--
SAY: Module 5. The finish line: what proves the booking worked? Then we assemble everything we wrote into one end-to-end test.
TIME: 30 s.
NEXT: The screen.
-->

---
layout: default
module: 5
stepId: m5-screen
class: compact
---

# Step 1: what proves the booking worked?

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

The traveller checks: **heading**, **reference**, **flight**, **name**.

```ts [qoomlee/app/web/e2e/tests/04-full-journey.spec.ts] {1-2|3|4|5|all}
await expect(page.getByRole('heading', { name: 'Booking Confirmed!' }))
  .toBeVisible({ timeout: 30_000 });
await expect(page.getByText(/BOOKING REFERENCE/i)).toBeVisible();
await expect(page.getByText('BKK → SIN').first()).toBeVisible();
await expect(page.getByText('Jane Doe')).toBeVisible();
```

<div class="small" style="margin-top:0.8rem">Assert the <b>outcome</b>, not the implementation. <code>.first()</code> on the route: <code>BKK → SIN</code> appears twice, and strict mode made us choose.</div>
</div>
<PhoneShot src="12-confirmation" caption="/bookings/confirmation" :height="420" :marks="[
  { k: 'heading', at: 0, line: 1 },
  { k: 'ref', at: 1, line: 3 },
  { k: 'flight', at: 2, line: 4 },
  { k: 'name', at: 3, line: 5 },
]" />
</div>

<!--
SAY: Assert the outcome, not the implementation. A heading alone could appear for a broken booking; the reference and the passenger name prove the right data came through. Do not assert every pixel.
`.first()` on the route: `BKK → SIN` appears twice on this page. Strict mode told us, and we chose consciously.
TIME: 3 min.
NEXT: The whole journey.
-->

---
layout: default
module: 5
stepId: m5-journey
class: compact
---

# Step 2: the full journey (1/2): reach payment

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-4 items-center">
<div>

```ts [qoomlee/app/web/e2e/tests/04-full-journey.spec.ts] {1|2-7|10-13|14|all}
test('full journey: search results to confirmation @smoke', async ({ page, request }) => {
  // 1-2. results (skip the search form: it is already covered by step 1)
  const day = await firstDepartureDate(request);
  await page.goto(
    `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`,
  );
  await page.getByRole('button', { name: /select/i }).first().click();

  // 3. passenger
  await page.getByPlaceholder('e.g. John').fill('Jane');
  await page.getByPlaceholder('e.g. Doe').fill('Doe');
  await page.getByPlaceholder('john.doe@example.com').fill(`jane+${Date.now()}@test.com`);
  await page.getByPlaceholder('000 000 000').fill('0800000000');
  await page.getByRole('button', { name: /continue to payment/i }).click();
  // ... continues on the next slide
```

<div class="small">We skip the search form: test 1 already covers it. Repeating it adds time, not confidence.</div>
</div>
<PhoneShot src="06-results" caption="results" :height="300" :marks="[
  { k: 'select', at: 1, line: 7 },
]" />
<PhoneShot src="09-booking-filled" caption="passenger" :height="300" :marks="[
  { k: 'first', at: 2, line: 10 },
  { k: 'last', at: 2, line: 11 },
  { k: 'email', at: 2, line: 12 },
  { k: 'phone', at: 2, line: 13 },
  { k: 'cont', at: 3, line: 14 },
]" />
</div>

<!--
SAY: First half: teleport to results, pick the flight, fill the passenger. Tag @smoke: this is the one test we would run on every push.
DEMO: `bun run test:e2e 04-full --headed` and let them watch the phone fly through six screens.
TIME: 2 min.
NEXT: Second half.
-->

---
layout: default
module: 5
stepId: m5-journey2
class: compact
---

# Step 2: the full journey (2/2): pay and confirm

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-4 items-center">
<div>

```ts [qoomlee/app/web/e2e/tests/04-full-journey.spec.ts] {2-8|10-12|13|15|all}
  // 4. payment (Omise TEST card, never a real one)
  await page.getByPlaceholder('e.g. Johnathan Doe').fill('Jane Doe');
  await page.getByPlaceholder('0000 0000 0000 0000')
    .fill('4242 4242 4242 4242');
  await page.getByPlaceholder('MM/YY').fill('12/29');
  await page.getByPlaceholder('•••').fill('123');
  await page.getByLabel(/agree to the terms/i).check();
  await page.getByRole('button', { name: /pay .* securely/i }).click();

  // 5. confirmation
  await expect(page.getByRole('heading', { name: 'Booking Confirmed!' }))
    .toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/BOOKING REFERENCE/i)).toBeVisible();
  await expect(page.getByText('BKK → SIN').first()).toBeVisible();
  await expect(page.getByText('Jane Doe')).toBeVisible();
});
```

<div class="small">About 30 lines, six screens, one test. It passes. It is mostly <b>how</b>, very little <b>what</b>.</div>
</div>
<PhoneShot src="11-payment-card" caption="payment" :height="300" :marks="[
  { k: 'name', at: 0, line: 2 },
  { k: 'number', at: 0, line: 4 },
  { k: 'expiry', at: 0, line: 5 },
  { k: 'cvv', at: 0, line: 6 },
]" />
<PhoneShot src="12-confirmation" caption="confirmation" :height="300" :marks="[
  { k: 'heading', at: 1, line: 12 },
  { k: 'ref', at: 2, line: 13 },
  { k: 'name', at: 3, line: 15 },
]" />
</div>

<!--
SAY: Read it section by section as it highlights. It works, and it is long. Keep that feeling for module 7.
TIME: 2 min.
NEXT: Run it.
-->

---
layout: default
module: 5
stepId: m5-run
---

# Run the whole flow

<StepCommand command="cd qoomlee/app/web && bun run test:e2e" />

```txt
  ✓  [mobile] › tests/02-results.spec.ts   results list QM101, selecting it opens the booking form (1.0s)
  ✓  [mobile] › tests/03-passenger.spec.ts empty form shows required errors (1.6s)
  ✓  [mobile] › tests/03-passenger.spec.ts email without @ is rejected (1.7s)
  ✓  [mobile] › tests/03-passenger.spec.ts valid passenger details move on to payment and pay (4.2s)
  ✓  [mobile] › tests/01-search.spec.ts    search BKK to SIN, one way (3.1s)
  ✓  [mobile] › tests/04-full-journey.spec.ts  full journey: search results to confirmation @smoke (5.0s)
  6 passed (6.0s)
```

<div class="small">6 tests, 6 s, 4 workers. A manual run of the same flow takes a person about 3 minutes, every time.</div>

<!--
SAY: Celebrate for ten seconds. We built a real E2E suite: search, results, validation, and the full purchase. About 6 seconds.
TIME: 2 min.
NEXT: Lab 5.
-->

---
layout: lab
module: 5
lab: 5
minutes: 8
solution: qoomlee/app/web/e2e/tests/04-full-journey.spec.ts
---

Assemble your full journey in `qoomlee/app/web/e2e/tests/my/04-journey.spec.ts`.

1. Results → select → passenger → payment → confirmation
2. Tag it `@smoke` in the title
3. Assert the heading, the reference and the passenger name
4. Run only smoke tests: `--grep @smoke`

::criteria::
- [ ] One test, passes on `mobile`
- [ ] Runs in under 15 s
- [ ] Bonus: find the line you would hate to change in 10 files

::hint::
Copy the steps from labs 2 to 4 in order. Do not refactor yet; we feel the pain first. <br>**Run it:** `cd qoomlee/app/web && bun run test:e2e my/04-journey` <br>`cd qoomlee/app/web && bun run test:e2e --grep @smoke`

::recap::
- Assert the **outcome**: heading + reference + passenger
- `@smoke` tag + `--grep` = fast subset
- Copy-paste works today, hurts on the next UI change

<!--
SAY: 8 minutes. Do NOT let them refactor early. The goal is the pain in the last bonus bullet.
RECAP (click): SAY: ask for hands: who found a line they would hate to change. That is our module 7 agenda. TIME: 1 min.
NEXT: A new challenge.
-->

---
layout: challenge
module: 5
stepId: m5-challenge
solution: the next three slides, and qoomlee/app/web/e2e/pages/PassengerPage.ts in module 7
---

The product team changes the first-name placeholder from `e.g. John` to `First name`. Does our suite notice? Does it tell us **where**?

<!--
SAY: The suite is green and we are proud. Then a designer changes one word in the app. Let's see what happens. Next three demo steps: it goes RED on purpose, we fix it the quick way, then the proper way.
TIME: 1 min.
NEXT: Watch it break.
-->

---
layout: default
module: 5
stepId: m5-red
class: compact
---

# Step 1: the app changes, the tests go red

<div class="grid grid-cols-2 gap-5">
<div>

```tsx [qoomlee/app/web/app/bookings/new/BookingClient.tsx] {3}
<input
  type="text"
  placeholder="First name"
  value={firstName}
/>
```

<StepCommand command="cd qoomlee/app/web && bun run test:e2e" />

</div>
<div>

```txt
  1) 03-passenger.spec.ts:29 › valid passenger details...
     Error: locator.fill: Test timeout of 30000ms exceeded.
     - waiting for getByPlaceholder('e.g. John')

  3 failed
    03-passenger.spec.ts:19  email without @ is rejected
    03-passenger.spec.ts:29  valid passenger details...
    04-full-journey.spec.ts:4  full journey @smoke
  3 passed
```

</div>
</div>

<div class="small">Red <b>on purpose</b>: the commit changes only the app. The tests still look for <code>e.g. John</code>, a text that no longer exists. Note it took 30 s per test to find out.</div>

<!--
SAY: The behaviour did not change, only a word. But three tests are red, and each one waited 30 s before giving up. Read the call log: "waiting for getByPlaceholder('e.g. John')". The message tells us exactly what to fix.
Git: the demo commit "Challenge 1/3" is intentionally red.
TIME: 3 min.
NEXT: The quick fix.
-->

---
layout: default
module: 5
stepId: m5-quick
---

# Step 2: the quick fix, edit every place

```diff [qoomlee/app/web/e2e/tests/03-passenger.spec.ts] {1|2|all}
- await page.getByPlaceholder('e.g. John').fill('Jane');
+ await page.getByPlaceholder('First name').fill('Jane');
```

<div class="small">Same change in <code>03-passenger.spec.ts</code> (2 places) and <code>04-full-journey.spec.ts</code> (1 place). Green again:</div>

<StepCommand command="cd qoomlee/app/web && bun run test:e2e" />

<div class="small" style="margin-top:0.8rem">It works, but we touched 3 lines in 2 files for one word. And the next copy change breaks them again.</div>

<!--
SAY: Easy fix: find, replace, green. But we are still tied to the wording. The next time marketing changes the placeholder we are back here. A placeholder is decoration, not identity.
TIME: 2 min.
NEXT: The proper fix.
-->

---
layout: default
module: 5
stepId: m5-proper
class: compact
---

# Step 3: the proper fix, find it by its label

<div class="grid grid-cols-2 gap-5">
<div>

```tsx [qoomlee/app/web/app/bookings/new/BookingClient.tsx] {1|3|all}
<label htmlFor="first-name">First Name</label>
<input
  id="first-name"
  placeholder="First name"
/>
```

</div>
<div>

```ts [qoomlee/app/web/e2e/tests/03-passenger.spec.ts] {all}
await page
  .getByLabel('First Name')
  .fill('Jane');
```

</div>
</div>

<div class="small" style="margin-top:0.8rem">The label is what the user reads and what a screen reader announces, so it survives placeholder rewrites. No label in your app? Add a <code>data-testid</code> and use <code>getByTestId</code>.</div>

<StepCommand command="cd qoomlee/app/web && bun run test:e2e" />

<!--
SAY: The label was never connected to the input: no htmlFor, no id. That is an accessibility bug as well as a testing problem. Fixing the app makes it better for users and for tests. This is why role > label > text > test id.
Next module we make sure only ONE file knows this locator.
TIME: 3 min.
NEXT: What to do when a test goes red: debugging.
-->
