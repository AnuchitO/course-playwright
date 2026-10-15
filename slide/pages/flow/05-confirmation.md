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

```ts {1-2|3|4|5|all}
await expect(page.getByRole('heading', { name: 'Booking Confirmed!' }))
  .toBeVisible({ timeout: 30_000 });
await expect(page.getByText(/BOOKING REFERENCE/i)).toBeVisible();
await expect(page.getByText('QM101').first()).toBeVisible();
await expect(page.getByText('Jane Doe')).toBeVisible();
```

<div class="small" style="margin-top:0.8rem">Assert the <b>outcome</b>, not the implementation. <code>.first()</code> on QM101: it appears twice, and strict mode made us choose.</div>
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
`.first()` on QM101: it appears twice on this page (reference card and details). Strict mode told us, and we chose consciously.
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

```ts {1-3|4|7-11|12|all}
test('full journey @smoke', async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(`/flights/results?origin=BKK&destination=SIN&departure=${day}&…`);
  await page.getByRole('button', { name: /select/i }).first().click();

  // passenger
  await page.getByPlaceholder('e.g. John').fill('Jane');
  await page.getByPlaceholder('e.g. Doe').fill('Doe');
  await page.getByPlaceholder('john.doe@example.com')
    .fill(`jane+${Date.now()}@test.com`);
  await page.getByPlaceholder('000 000 000').fill('0800000000');
  await page.getByRole('button', { name: /continue to payment/i }).click();
  // ... continues on the next slide
```

<div class="small">We skip the search form: test 1 already covers it. Repeating it adds time, not confidence.</div>
</div>
<PhoneShot src="06-results" caption="results" :height="300" :marks="[
  { k: 'select', at: 1, line: 4 },
]" />
<PhoneShot src="09-booking-filled" caption="passenger" :height="300" :marks="[
  { k: 'first', at: 2, line: 7 },
  { k: 'last', at: 2, line: 8 },
  { k: 'email', at: 2, line: 10 },
  { k: 'phone', at: 2, line: 11 },
  { k: 'cont', at: 3, line: 12 },
]" />
</div>

<!--
SAY: First half: teleport to results, pick the flight, fill the passenger. Tag @smoke: this is the one test we would run on every push.
DEMO: `npx playwright test -c flow 04-full --headed` and let them watch the phone fly through six screens.
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

```ts {2-8|10-12|13|15|all}
  // payment (Omise TEST card, never a real one)
  await page.getByPlaceholder('e.g. Johnathan Doe').fill('Jane Doe');
  await page.getByPlaceholder('0000 0000 0000 0000')
    .fill('4242 4242 4242 4242');
  await page.getByPlaceholder('MM/YY').fill('12/29');
  await page.getByPlaceholder('•••').fill('123');
  await page.getByLabel(/agree to the terms/i).check();
  await page.getByRole('button', { name: /pay .* securely/i }).click();

  // confirmation
  await expect(page.getByRole('heading', { name: 'Booking Confirmed!' }))
    .toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/BOOKING REFERENCE/i)).toBeVisible();
  await expect(page.getByText('QM101').first()).toBeVisible();
  await expect(page.getByText('Jane Doe')).toBeVisible();
});
```

<div class="small">25 lines, six screens, one test. It passes. It is mostly <b>how</b>, very little <b>what</b>.</div>
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

<StepCommand command="cd workshop && npx playwright test -c flow steps" />

```txt
  ✓  [mobile] › 02-results.spec.ts   results list QM101, selecting it opens the booking form (1.0s)
  ✓  [mobile] › 03-passenger.spec.ts empty form shows required errors (1.6s)
  ✓  [mobile] › 03-passenger.spec.ts valid passenger details move on to payment (1.9s)
  ✓  [mobile] › 01-search.spec.ts    search BKK to SIN, one way (3.1s)
  ✓  [mobile] › 04-full-journey.spec.ts  full journey: search results to confirmation @smoke (5.0s)
  5 passed (5.6s)
```

<div class="small">5 tests, 5.6 s, 5 workers. A manual run of the same flow takes a person about 3 minutes, every time.</div>

<!--
SAY: Celebrate for ten seconds. We built a real E2E suite: search, results, validation, and the full purchase. 5.6 seconds.
TIME: 2 min.
NEXT: But look at the code.
-->

---
layout: challenge
module: 5
---

The placeholder `e.g. John` changes to `First name`. Now fix it in <code>03-passenger.spec.ts</code>, <code>04-full-journey.spec.ts</code> and the next five files you write. Miss one and CI is red.

<!--
SAY: Look at what we have: the same 4 lines to fill a passenger in two files, the same card lines in the journey, the same results URL in four files. Every UI change touches every file. That is the pain module 7 removes, but first: what do you do when a test goes red?
TIME: 1 min.
NEXT: Lab 5, then debugging.
-->

---
layout: lab
module: 5
lab: 5
minutes: 8
solution: workshop/flow/steps/04-full-journey.spec.ts
---

Assemble your full journey in `workshop/flow/my/04-journey.spec.ts`.

1. Results → select → passenger → payment → confirmation
2. Tag it `@smoke` in the title
3. Assert the heading, the reference and the passenger name
4. Run only smoke tests: `--grep @smoke`

::criteria::
- [ ] One test, passes on `mobile`
- [ ] Runs in under 15 s
- [ ] Bonus: find the line you would hate to change in 10 files

::hint::
Copy the steps from labs 2 to 4 in order. Do not refactor yet; we feel the pain first.

::recap::
- Assert the **outcome**: heading + reference + passenger
- `@smoke` tag + `--grep` = fast subset
- Copy-paste works today, hurts on the next UI change

<!--
SAY: 8 minutes. Do NOT let them refactor early. The goal is the pain in the last bonus bullet.
RECAP (click): SAY: ask for hands: who found a line they would hate to change. That is our module 7 agenda. TIME: 1 min.
NEXT: Debugging, then the refactor.
-->
