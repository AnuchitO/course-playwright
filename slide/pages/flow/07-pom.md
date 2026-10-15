---
layout: module-title
module: 7
heading: Refactor to Page Objects
thai: รีแฟกเตอร์เป็น Page Object
time: 2:05 - 2:35 · 30 min
problem: Same journey, one change per UI change, and tests that read like the spec.
---

<!--
SAY: Module 7, the second half. We keep every test green while we move code. Rule of refactoring: behaviour does not change; run the tests after every step.
TIME: 30 s.
NEXT: What exactly hurts.
-->

---
layout: story
module: 7
---

Count the duplication in the suite we just wrote: the passenger form is filled in <b>3</b> files, the results URL is built in <b>4</b>, the card in <b>2</b>. One placeholder rename = 5 edits.

::naive::
**Today:** copy-paste, and search-and-replace when the UI changes.
- Tests are **how** (locators), not **what** (intent)
- Every UI change fans out to many files
- A new teammate cannot read the test and see the booking flow

<!--
SAY: Name the three smells: repeated locators, repeated flows, repeated data. The Page Object pattern answers the first two; test data builders answer the third.
Q: "Is POM mandatory?" No. It is worth it when locators repeat across files. We have exactly that.
TIME: 2 min.
NEXT: The pattern.
-->

---
layout: default
module: 7
stepId: m7-idea
---

# The idea: one class per screen

<div class="grid grid-cols-5 gap-3 items-center" style="margin-top:0.5rem">
<PhoneShot src="01-search-home" caption="SearchPage" :height="250" />
<PhoneShot src="06-results" caption="ResultsPage" :height="250" />
<PhoneShot src="09-booking-filled" caption="PassengerPage" :height="250" />
<PhoneShot src="11-payment-card" caption="PaymentPage" :height="250" />
<PhoneShot src="12-confirmation" caption="ConfirmationPage" :height="250" />
</div>

<div class="grid grid-cols-2 gap-6" style="margin-top:1rem">
<div>

A **Page Object** owns:
- the **locators** of one screen
- **one method per user intent** (`fill`, `pay`)
</div>
<div>

It does **not** own:
- assertions about the test's goal
- other screens' details
- a giant base class
</div>
</div>

<!--
SAY: One screen, one class. It is plumbing; the test stays the specification. This slide is the whole concept. The rest is mechanics.
TIME: 2 min.
NEXT: Step by step, one page at a time, tests stay green.
-->

---
layout: default
module: 7
stepId: m7-passenger
class: compact
---

# Step 1: `PassengerPage` (extract, don't invent)

<div class="grid grid-cols-2 gap-4">
<div class="label-bad">Before: inside the test</div>
<div class="label-good">After: pages/PassengerPage.ts</div>

```ts
await page.getByPlaceholder('e.g. John')
  .fill('Jane');
await page.getByPlaceholder('e.g. Doe')
  .fill('Doe');
await page.getByPlaceholder('john.doe@example.com')
  .fill(`jane+${Date.now()}@test.com`);
await page.getByPlaceholder('000 000 000')
  .fill('0800000000');
await page.getByRole('button',
  { name: /continue to payment/i }).click();
```

```ts {1-2|4-6|8-12|all}
export class PassengerPage {
  constructor(private readonly page: Page) {}

  readonly continueButton = this.page
    .getByRole('button',
      { name: /continue to payment/i });

  async fill(p: Passenger) {
    await this.page.getByPlaceholder('e.g. John')
      .fill(p.firstName);
    // ... last name, email, phone
  }
  async continueToPayment() {
    await this.continueButton.click();
  }
}
```
</div>

<!--
SAY: Move, do not redesign. Cut the lines from the test, paste into a method, call the method. Run the test. Green? Next. Locators are properties (cheap, lazy: nothing is searched until used), actions are methods named by intent.
Note `private readonly page` in the constructor: TypeScript shorthand for a field.
DEMO: live-refactor 03-passenger.spec.ts, run after each move.
TIME: 5 min.
NEXT: The rest of the pages.
-->

---
layout: default
module: 7
stepId: m7-rest
class: compact
---

# Step 2: the other pages, same recipe

```ts {1-12|14-22|all}
// pages/PaymentPage.ts
export class PaymentPage {
  constructor(private readonly page: Page) {}
  readonly payButton = this.page.getByRole('button', { name: /pay .* securely/i });

  async pay(card: Card) {
    await this.page.getByPlaceholder('e.g. Johnathan Doe').fill(card.name);
    // ... number, expiry, cvv
    await this.page.getByLabel(/agree to the terms/i).check();
    await this.payButton.click();
  }
}

// pages/ResultsPage.ts
export class ResultsPage {
  constructor(private readonly page: Page) {}
  flight = (flightNumber: string) => this.page.getByText(flightNumber);
  async open(day: string) { /* build the results URL once */ }
  async selectFirstFlight() {
    await this.page.getByRole('button', { name: /select/i }).first().click();
  }
}
```

<div class="small"><code>SearchPage</code> is the same recipe. <code>ConfirmationPage</code> is just two locators (<code>heading</code>, <code>reference</code>): not every page needs actions.</div>

<!--
SAY: Same recipe five times: Search, Results, Passenger, Payment, Confirmation. Notice ConfirmationPage has only locators: not every page needs actions. The ResultsPage owns the URL building, so the query string lives in ONE place.
TIME: 5 min.
NEXT: Fixtures.
-->

---
layout: default
module: 7
stepId: m7-fixtures
class: compact
---

# Step 3: hand the pages to tests with fixtures

```ts {1-5|7-10|12-18|all}
type Fixtures = {
  passengerPage: PassengerPage;   // + search, results, payment, confirmation
  /** Already on the passenger form for the first BKK->SIN flight. */
  onPassengerForm: PassengerPage;
};

export const test = base.extend<Fixtures>({
  searchPage: async ({ page }, use) => use(new SearchPage(page)),
  passengerPage: async ({ page }, use) => use(new PassengerPage(page)),
  // ... one line per page

  onPassengerForm: async ({ request, resultsPage, passengerPage }, use) => {
    await resultsPage.open(await firstDepartureDate(request));
    await resultsPage.selectFirstFlight();
    await expect(passengerPage.heading).toBeVisible();
    await use(passengerPage);
  },
});
```

<div class="small"><code>use(x)</code> hands <code>x</code> to the test. Code after <code>use</code> is teardown. Only fixtures a test <b>asks for</b> are built.</div>

<!--
SAY: A fixture is dependency injection for tests: the test declares what it needs in its argument list and Playwright builds it. `onPassengerForm` replaces the whole beforeEach from module 3, and can be reused in every file. Before `use` = setup, after = teardown.
Q: "Why not `new PassengerPage(page)` in each test?" You can; fixtures remove the noise and make setup shareable.
TIME: 5 min.
NEXT: Data.
-->

---
layout: default
module: 7
stepId: m7-data
---

# Step 4: test data in one place

```ts
// data/passenger.ts
export const aPassenger = (over: Partial<Passenger> = {}): Passenger => ({
  firstName: 'Jane',
  lastName: 'Doe',
  email: `jane+${Date.now()}@test.com`, // unique per call
  phone: '0800000000',
  ...over,
});

// data/card.ts
export const TEST_CARD: Card = { name: 'Jane Doe', number: '4242 4242 4242 4242', expiry: '12/29', cvv: '123' };
```

```ts
await form.fill(aPassenger({ email: 'not-an-email' })); // only say what is special
```

<!--
SAY: A builder gives sane defaults and lets the test override just the interesting field. The test then says only what matters: "an invalid email". Magic strings leave the tests.
TIME: 3 min.
NEXT: The result.
-->

---
layout: default
module: 7
stepId: m7-after
class: compact
---

# The same journey, before and after

<div class="grid grid-cols-2 gap-5">
<div class="label-bad">Before: 25 lines of how</div>
<div class="label-good">After: 8 lines of what</div>

```ts
await page.goto(`/flights/results?...`);
await page.getByRole('button',
  { name: /select/i }).first().click();
await page.getByPlaceholder('e.g. John')
  .fill('Jane');
// ... 3 more passenger fields
await page.getByRole('button',
  { name: /continue to payment/i }).click();
// ... 5 more card lines
await page.getByRole('button',
  { name: /pay .* securely/i }).click();
await expect(page.getByRole('heading',
  { name: 'Booking Confirmed!' }))
  .toBeVisible({ timeout: 30_000 });
```

```ts {all}
test('book and pay @smoke', async ({
  onPassengerForm: form, paymentPage, confirmationPage,
}) => {
  await form.fill(aPassenger());
  await form.continueToPayment();
  await paymentPage.pay(TEST_CARD);

  await expect(confirmationPage.heading)
    .toBeVisible({ timeout: 30_000 });
  await expect(confirmationPage.reference)
    .toBeVisible();
});
```
</div>

<!--
SAY: Same behaviour, same coverage. Read the right side aloud: it is almost English. When the placeholder changes, one file changes.
Notice: assertions STAY in the test. The page exposes locators; the test decides what to check.
TIME: 3 min.
NEXT: Your turn.
-->

---
layout: lab
module: 7
lab: 7
minutes: 15
solution: workshop/flow/final/ (pages, fixtures, data, tests)
---

Refactor your `my/` tests into `workshop/flow/my-final/`.

1. `PassengerPage` and `PaymentPage` (locators + one method per intent)
2. A `fixtures/index.ts` with `passengerPage`, `paymentPage` and `onPassengerForm`
3. `aPassenger()` and `TEST_CARD`
4. Rewrite the journey in **8 lines or fewer**

::criteria::
- [ ] All tests still pass (run after **every** move)
- [ ] No `expect` inside a page object
- [ ] Journey test reads like a user story

::hint::
Move one block at a time: cut, paste into a method, call it, run. If red, undo that one move.

::recap::
- **Extract**, don't invent: move lines, keep behaviour
- Pages = locators + intent methods; **assertions stay in tests**
- Fixtures inject pages and shared setup; builders own data

<!--
SAY: 15 minutes. The rule is run the tests after EVERY move. Solution: workshop/flow/final/. If a pair is fast: add SearchPage and ResultsPage.
COMMON ISSUES: imports from the wrong `test` (must import from your fixtures file); `this.page` used before constructor assignment (property initializers need `private readonly page` shorthand).
RECAP (click): SAY: three bullets. TIME: 1 min.
NEXT: How do we organise all of this?
-->
