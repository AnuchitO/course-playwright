---
layout: module-title
module: 3
heading: Booking and passenger info
thai: การจองและข้อมูลผู้โดยสาร
time: 1:05 - 1:25 · 20 min
problem: A form with validation. Test the sad path before the happy path.
---

<!--
SAY: Module 3. Forms are where most bugs live: required fields, formats, error messages. We test the unhappy case first because it is cheaper, then the happy path that moves us to payment.
TIME: 30 s.
NEXT: The empty form.
-->

---
layout: default
module: 3
stepId: m3-before
class: compact
---

# Step 1: share the setup with `beforeEach`

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

```ts [qoomlee/app/web/e2e/tests/03-passenger.spec.ts] {1|2|3-5|6|7|all}
test.beforeEach(async ({ page, request }) => {
  const day = await firstDepartureDate(request);
  await page.goto(
    `/flights/results?origin=BKK&destination=SIN&departure=${day}&passengers=1&cabin=economy`,
  );
  await page.getByRole('button', { name: /select/i }).first().click();
  await expect(page.getByRole('heading', { name: 'Book Your Flight' })).toBeVisible();
});
```

<div class="small" style="margin-top:0.8rem">Every test in this file starts on the passenger form. Each test still gets a <b>fresh browser context</b>: no shared state.</div>
</div>
<PhoneShot src="07-booking-empty" caption="/bookings/new" :height="400" :marks="[
  { k: 'heading', at: 4, line: 8 },
]" />
</div>

<!--
SAY: Same teleport trick as module 2 plus a click. beforeEach runs before each test in the file. Each test gets its own clean browser, so tests cannot affect each other, and they can run in parallel.
TIME: 3 min.
NEXT: The sad path.
-->

---
layout: default
module: 3
stepId: m3-errors
class: compact
---

# Step 2: the sad paths

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

```ts [qoomlee/app/web/e2e/tests/03-passenger.spec.ts] {1|2|3|4|7-12|13-14|all}
test('empty form shows required errors', async ({ page }) => {
  await page.getByRole('button', { name: /continue to payment/i }).click();
  await expect(page.getByText('Required', { exact: true })).toHaveCount(3);
  await expect(page.getByText('Valid email required')).toBeVisible();
});

test('email without @ is rejected', async ({ page }) => {
  await page.getByPlaceholder('e.g. John').fill('Jane');
  await page.getByPlaceholder('e.g. Doe').fill('Doe');
  await page.getByPlaceholder('john.doe@example.com').fill('not-an-email');
  await page.getByPlaceholder('000 000 000').fill('0800000000');
  await page.getByRole('button', { name: /continue to payment/i }).click();
  await expect(page.getByText('Valid email required')).toBeVisible();
  await expect(page).toHaveURL(/\/bookings\/new/);
});
```

<div class="small" style="margin-top:0.8rem"><code>toHaveCount(3)</code>: first name, last name, phone. <code>exact: true</code> stops "Required" matching longer texts.<br>Second test: everything valid <b>except</b> the email, so it has exactly one reason to fail.</div>
</div>
<PhoneShot src="08-booking-errors" caption="submit with nothing typed" :height="400" :marks="[
  { k: 'cont', at: 1, line: 2 },
  { k: 'req', at: 2, line: 3 },
  { k: 'req2', at: 2, line: 3 },
  { k: 'req3', at: 2, line: 3 },
  { k: 'emailErr', at: 3, line: 4 },
]" />
</div>

<!--
SAY: No typing at all: press continue, expect the errors. Three "Required" plus an email format message. Counting is a stable way to check "on every field" without ten locators.
Why sad path first: it is 3 lines and no data. Free coverage.
Then the bad email: fill the other fields validly and put the bad value only in email. It must show the error AND stay on /bookings/new.
TIME: 3 min.
NEXT: The happy path.
-->

---
layout: default
module: 3
stepId: m3-happy
class: compact
---

# Step 3: fill the form (happy path)

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 items-center">
<div>

```ts [qoomlee/app/web/e2e/tests/03-passenger.spec.ts] {1|2-5|6|8|all}
test('valid passenger details move on to payment', async ({ page }) => {
  await page.getByPlaceholder('e.g. John').fill('Jane');
  await page.getByPlaceholder('e.g. Doe').fill('Doe');
  await page.getByPlaceholder('john.doe@example.com').fill(`jane+${Date.now()}@test.com`);
  await page.getByPlaceholder('000 000 000').fill('0800000000');
  await page.getByRole('button', { name: /continue to payment/i }).click();

  await expect(page).toHaveURL(/\/payment\/?\?ref=[A-Z0-9]{6}/);
});
```

<div class="small" style="margin-top:0.8rem">Unique email per run (<code>Date.now()</code>). The new URL carries a 6-character booking <b>reference</b>.</div>
</div>
<PhoneShot src="09-booking-filled" caption="filled" :height="330" :marks="[
  { k: 'first', at: 1, line: 2 },
  { k: 'last', at: 1, line: 3, side: 'top' },
  { k: 'email', at: 1, line: 4 },
  { k: 'phone', at: 1, line: 5 },
  { k: 'cont', at: 2, line: 6 },
]" />
<PhoneShot src="10-payment-empty" caption="next: payment" :height="330" :marks="[
  { k: 'heading', at: 3, line: 8 },
]" />
</div>

<!--
SAY: Locator by placeholder, because these inputs have no accessible label. That is itself a finding: a real app would add labels, which would also help screen readers. Say this to the developers in the room.
Data rule: never reuse a fixed email; the backend may reject duplicates.
Assertion: the URL now has ?ref=XXXXXX. A real booking reference was created by the backend. That is a real integration, which is exactly why this is an E2E test.
TIME: 4 min.
NEXT: Run and lab.
-->

---
layout: default
module: 3
stepId: m3-run
---

# Run it

Run from the app folder; the filter `03-passenger` picks the spec file:

<StepCommand command="cd qoomlee/app/web && bun run test:e2e 03-passenger" />

```txt
Running 3 tests using 3 workers
  ✓  1 [mobile] › tests/03-passenger.spec.ts:13:1 › empty form shows required errors (1.8s)
  ✓  2 [mobile] › tests/03-passenger.spec.ts:19:1 › email without @ is rejected (1.9s)
  ✓  3 [mobile] › tests/03-passenger.spec.ts:29:1 › valid passenger details move on to payment (1.9s)
  3 passed
```

<div class="small" style="margin-top:1rem">All three tests ran in <b>parallel</b>, each in its own browser context, each starting from <code>beforeEach</code>.</div>

<!--
SAY: Point at the two workers. Independent tests are what make parallelism possible.
TIME: 2 min.
NEXT: Lab 3.
-->

---
layout: lab
module: 3
lab: 3
minutes: 8
solution: qoomlee/app/web/e2e/tests/03-passenger.spec.ts
---

Create `qoomlee/app/web/e2e/tests/my/03-passenger.spec.ts`.

1. `beforeEach`: reach the **Book Your Flight** form
2. Test: empty form, expect 3 × **Required** and the email error
3. Test: email `not-an-email` stays on `/bookings/new`
4. Test: valid data reaches `/payment?ref=...`

::criteria::
- [ ] 3 tests, all green, run in parallel
- [ ] Email is unique per run
- [ ] Bonus: test a phone number with letters

::hint::
For test 3, fill the other fields validly and put the bad value only in email. One reason to fail per test. <br>**Run it:** `cd qoomlee/app/web && bun run test:e2e my/03-passenger`

::recap::
- `beforeEach` shares **setup**, not state: each test has a fresh context
- Test the **sad path first**: cheap and valuable
- One reason to fail per test

<!--
SAY: 8 minutes. Solution: qoomlee/app/web/e2e/tests/03-passenger.spec.ts.
COMMON ISSUES: forgot exact:true so toHaveCount is off; reused the same email.
RECAP (click): SAY: three bullets. TIME: 1 min.
NEXT: Payment.
-->
