---
layout: module-title
module: 4
heading: Payment
thai: การชำระเงิน
time: 1:25 - 1:40 · 15 min
problem: Fill a card form safely, with a test card, and wait for a slow backend.
---

<!--
SAY: Module 4. Payment. Rule number one: TEST mode only, never a real card. Rule two: this is the slowest step, so we learn how to wait correctly.
TIME: 30 s.
NEXT: The screen.
-->

---
layout: default
module: 4
stepId: m4-screen
class: compact
---

# Step 1: the payment screen

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 items-center">
<div>

| Field | Locator |
|---|---|
| Name on card | `getByPlaceholder('e.g. Johnathan Doe')` |
| Card number | `getByPlaceholder('0000 0000 0000 0000')` |
| Expiry | `getByPlaceholder('MM/YY')` |
| CVV | `getByPlaceholder('•••')` |
| Terms | `getByLabel(/agree to the terms/i)` |
| Pay | `getByRole('button', { name: /pay .* securely/i })` |
</div>
<PhoneShot src="11-payment-card" caption="card fields" :height="340" :marks="[
  { k: 'name', at: 0 },
  { k: 'number', at: 0 },
  { k: 'expiry', at: 0 },
  { k: 'cvv', at: 0 },
]" />
<PhoneShot src="11b-payment-pay" caption="terms and pay" :height="340" :marks="[
  { k: 'terms', at: 0 },
  { k: 'pay', at: 0 },
]" />
</div>

<!--
SAY: Same locator rules: label for the checkbox because it has one, placeholders for inputs that do not. The pay button name contains the amount, so we use a regex: `/pay .* securely/i` survives a price change.
Test card: 4242 4242 4242 4242 is the standard test number for Omise in test mode. It is never charged. Never put a real card number in a repo.
TIME: 3 min.
NEXT: The code.
-->

---
layout: default
module: 4
stepId: m4-code
class: compact
---

# Step 2: fill the card and pay

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 items-center">
<div>

```ts [qoomlee/app/web/e2e/tests/03-passenger.spec.ts] {2|3-4|5|6|7|8|all}
// Omise TEST card. Never a real one.
await page.getByPlaceholder('e.g. Johnathan Doe').fill('Jane Doe');
await page.getByPlaceholder('0000 0000 0000 0000')
  .fill('4242 4242 4242 4242');
await page.getByPlaceholder('MM/YY').fill('12/29');
await page.getByPlaceholder('•••').fill('123');
await page.getByLabel(/agree to the terms/i).check();
await page.getByRole('button', { name: /pay .* securely/i }).click();
```

<div class="small" style="margin-top:0.8rem"><code>.check()</code> is idempotent (and asserts the box ended up checked). <code>.fill()</code> clears then types; masked inputs show what the user sees.</div>
</div>
<PhoneShot src="11-payment-card" caption="card" :height="340" :marks="[
  { k: 'name', at: 0, line: 2 },
  { k: 'number', at: 1, line: 4 },
  { k: 'expiry', at: 2, line: 5 },
  { k: 'cvv', at: 3, line: 6 },
]" />
<PhoneShot src="11b-payment-pay" caption="terms + pay" :height="340" :marks="[
  { k: 'terms', at: 4, line: 7 },
  { k: 'pay', at: 5, line: 8 },
]" />
</div>

<!--
SAY: check() is better than click() for a checkbox: it is idempotent. If it were already checked, click would uncheck it.
This needs the test to come from step 3's happy path, so we are continuing the same test, not starting a new one.
TIME: 3 min.
NEXT: The wait.
-->

---
layout: default
module: 4
stepId: m4-wait
class: compact
---

# Step 3: the slow step

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 items-center">
<div>

```ts [qoomlee/app/web/e2e/tests/03-passenger.spec.ts] {1|2-4|all}
await page.getByRole('button', { name: /pay .* securely/i }).click();
// the gateway can take seconds: give THIS assertion more time
await expect(page.getByRole('heading', { name: 'Booking Confirmed!' }))
  .toBeVisible({ timeout: 30_000 });
```

| Timeout | Default | Change it |
|---|---|---|
| each `expect` | 5 s | per call, or `expect.timeout` |
| whole test | 30 s | `timeout` in config |

<div class="small">Raise the timeout <b>on the one slow assertion</b>, not globally.</div>
</div>
<PhoneShot src="11b-payment-pay" caption="press Pay..." :height="340" :marks="[
  { k: 'pay', at: 0, line: 1 },
]" />
<PhoneShot src="12-confirmation" caption="...wait up to 30 s" :height="340" :marks="[
  { k: 'heading', at: 1, line: 3 },
]" />
</div>

<!--
SAY: Real gateways are slow. The honest fix is a longer timeout on that one assertion, with a comment saying why. Do not raise it for the whole suite, and do not add a sleep.
TIME: 3 min.
NEXT: Lab 4.
-->

---
layout: default
module: 4
stepId: m4-run
---

# Run it

Same spec file as module 3; the happy-path test now pays too:

<StepCommand command="cd qoomlee/app/web && bun run test:e2e 03-passenger" />

```txt
Running 3 tests using 3 workers
  ✓  1 [mobile] › tests/03-passenger.spec.ts:13:1 › empty form shows required errors (1.8s)
  ✓  2 [mobile] › tests/03-passenger.spec.ts:19:1 › email without @ is rejected (1.9s)
  ✓  3 [mobile] › tests/03-passenger.spec.ts:29:1 › valid passenger details move on to payment and pay (4.2s)
  3 passed
```

<div class="small" style="margin-top:1rem">Want to see the card being typed? Add <code>--headed</code>:</div>

<StepCommand command="cd qoomlee/app/web && bun run test:e2e 03-passenger --headed" />

<!--
SAY: Run it now. The third test is the slow one, it waits for the gateway. The first two are still instant.
TIME: 2 min.
NEXT: Lab 4.
-->

---
layout: lab
module: 4
lab: 4
minutes: 7
solution: qoomlee/app/web/e2e/tests/03-passenger.spec.ts (payment section)
---

Extend your Lab 3 happy-path test.

1. Fill the card with the **test card**
2. Tick the terms and press **Pay securely**
3. Wait for **Booking Confirmed!** (30 s)

::criteria::
- [ ] Test reaches the confirmation heading
- [ ] Longer timeout only on that assertion
- [ ] Bonus: pay **without** ticking the terms; what happens?

::hint::
The pay button text includes the amount: use the regex `/pay .* securely/i`.

::recap::
- Test cards only; never real data in a repo
- `check()` is idempotent, `click()` on a checkbox is not
- Slow step? Longer timeout on that **one** `expect`

<!--
SAY: 7 minutes. Only the bonus is "explore": the terms checkbox blocks payment; look at what the UI shows.
RECAP (click): SAY: three bullets. TIME: 1 min.
NEXT: Confirmation.
-->
