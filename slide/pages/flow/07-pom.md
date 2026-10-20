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
- **one method per user action** (`enterEmail`, `pay`)
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
stepId: m7-menu
class: compact
---

# A page class is a menu of what the user can do

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

```ts [qoomlee/app/web/e2e/pages/PassengerPage.ts] {4-6|7-9|10-12|13-15|16-18|all}
export class PassengerPage {
  constructor(private readonly page: Page) {}

  async enterFirstName(name: string) {
    await this.page.getByPlaceholder('e.g. John').fill(name);
  }
  async enterLastName(name: string) {
    await this.page.getByPlaceholder('e.g. Doe').fill(name);
  }
  async enterEmail(email: string) {
    await this.page.getByPlaceholder('john.doe@example.com').fill(email);
  }
  async enterPhone(phone: string) {
    await this.page.getByPlaceholder('000 000 000').fill(phone);
  }
  async continueToPayment() {
    await this.page.getByRole('button', { name: /continue to payment/i }).click();
  }
}
```

<div class="small" style="margin-top:0.6rem"><b>One public method = one thing a traveller can do on this screen.</b> Read the class and you know the screen, without starting the app.</div>
</div>
<PhoneShot src="09-booking-filled" caption="PassengerPage" :height="400" :marks="[
  { k: 'first', at: 0, line: 4, edge: true },
  { k: 'last', at: 1, line: 7, edge: true },
  { k: 'email', at: 2, line: 10, edge: true },
  { k: 'phone', at: 3, line: 13, edge: true },
  { k: 'cont', at: 4, line: 16, edge: true },
]" />
</div>

<!--
SAY: Here is the shape I want you to aim for. Left: the class. Right: the screen. Every method on the left is a verb a user can do on the right: type the first name, type the last name, the email, the phone, press continue. If the user cannot do it on this screen, the method does not belong in this class.
Click through: each method lights up the element it drives.
Q: "Why one method per field instead of one big fill()?" Small verbs compose into bigger ones (fill = four small calls), but you cannot split a big one back apart. Next slide shows why this pays off.
TIME: 3 min.
NEXT: What this buys you when you write a test.
-->

---
layout: default
module: 7
stepId: m7-autocomplete
class: compact
---

# Type the dot, see the screen

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

<div class="ide">
  <div class="ide-code"><span class="kw">await</span> passengerPage.<span class="caret"></span></div>
  <ul class="ide-list">
    <li class="sel"><span><b>continueToPayment</b>()</span><i>Promise&lt;void&gt;</i></li>
    <li><span><b>enterEmail</b>(email: string)</span><i>Promise&lt;void&gt;</i></li>
    <li><span><b>enterFirstName</b>(name: string)</span><i>Promise&lt;void&gt;</i></li>
    <li><span><b>enterLastName</b>(name: string)</span><i>Promise&lt;void&gt;</i></li>
    <li><span><b>enterPhone</b>(phone: string)</span><i>Promise&lt;void&gt;</i></li>
    <li><span><b>expectEmailError</b>()</span><i>Promise&lt;void&gt;</i></li>
    <li><span><b>expectRequiredErrors</b>(count: number)</span><i>Promise&lt;void&gt;</i></li>
    <li><span><b>fill</b>(p: Passenger)</span><i>Promise&lt;void&gt;</i></li>
  </ul>
</div>

- **No need to start the app** to learn what the screen offers
- **No guessing** selectors: the list is the screen's capabilities
- `private page` hides raw Playwright, so tests can only do real user actions
- Rename a method: the compiler finds every caller
</div>
<PhoneShot src="09-booking-filled" caption="the same screen" :height="400" :marks="[
  { k: 'first', at: 0 },
  { k: 'last', at: 0 },
  { k: 'email', at: 0 },
  { k: 'phone', at: 0 },
  { k: 'cont', at: 0 },
]" />
</div>

<!--
SAY: This is the real payoff. In the test you type `passengerPage.` and your editor shows the menu of that screen: five things to do, two checks, one shortcut. A new teammate, or an AI assistant, does not need to open the browser or read selectors to know what can be done here. The list on the left is the picture on the right, written as code.
Because `page` is private, a test cannot reach around the page object with a raw selector. The only way in is a user action.
DEMO: in the editor open a spec, type `passengerPage.` and show the list.
TIME: 3 min.
NEXT: Checks about the screen.
-->

---
layout: default
module: 7
stepId: m7-verify
class: compact
---

# Optional: a few verifies about this screen

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

```ts [qoomlee/app/web/e2e/pages/PassengerPage.ts] {2-5|6-9|all}
// a few verifies about THIS screen, named by intent
async expectRequiredErrors(count: number) {
  await expect(this.page.getByText('Required', { exact: true }))
    .toHaveCount(count);
}
async expectEmailError() {
  await expect(this.page.getByText('Valid email required'))
    .toBeVisible();
}
```

```ts
await form.continueToPayment();
await form.expectRequiredErrors(3);   // reads like the requirement
await form.expectEmailError();
```

<div class="small" style="margin-top:0.6rem">Use them only when it helps. <b>Screen state</b> (errors shown, button disabled) can live in the page. The <b>business outcome</b> (booking confirmed, price correct) stays in the test.</div>
</div>
<PhoneShot src="08-booking-errors" caption="validation errors" :height="400" :marks="[
  { k: 'req', at: 0, line: 2 },
  { k: 'req2', at: 0, line: 2 },
  { k: 'req3', at: 0, line: 2 },
  { k: 'emailErr', at: 1, line: 6 },
]" />
</div>

<!--
SAY: Page objects can also carry a few verify methods, `expectSomething`, when the same check about the screen repeats in many tests. Name them by intent so the test reads like the requirement: expect required errors, count three.
Keep them few and small. A test that proves the booking worked still asserts the confirmation itself; do not hide the point of the test inside a page object.
Q: "Is this against the rule 'assertions stay in tests'?" The rule is about the goal of the test. Reusable checks of a screen's own state are fine; the test still decides which ones to call and when.
TIME: 3 min.
NEXT: Same idea on the payment screen.
-->

---
layout: default
module: 7
stepId: m7-payment-menu
class: compact
---

# Same recipe: the payment screen's menu

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 items-center">
<div>

```ts [qoomlee/app/web/e2e/pages/PaymentPage.ts] {4-6|7-9|10-12|13-15|16-18|19-22|all}
export class PaymentPage {
  constructor(private readonly page: Page) {}

  async enterCardName(name: string) {
    await this.page.getByPlaceholder('e.g. Johnathan Doe').fill(name);
  }
  async enterCardNumber(number: string) {
    await this.page.getByPlaceholder('0000 0000 0000 0000').fill(number);
  }
  async enterExpiry(expiry: string) {
    await this.page.getByPlaceholder('MM/YY').fill(expiry);
  }
  async enterCvv(cvv: string) {
    await this.page.getByPlaceholder('•••').fill(cvv);
  }
  async acceptTerms() {
    await this.page.getByLabel(/agree to the terms/i).check();
  }
  async pay() {
    await this.page.getByRole('button', { name: /pay .* securely/i })
      .click();
  }
}
```
</div>
<PhoneShot src="11-payment-card" caption="card" :height="300" :marks="[
  { k: 'name', at: 0, line: 4, edge: true },
  { k: 'number', at: 1, line: 7, edge: true },
  { k: 'expiry', at: 2, line: 10, edge: true },
  { k: 'cvv', at: 3, line: 13, edge: true },
]" />
<PhoneShot src="11b-payment-pay" caption="terms + pay" :height="300" :marks="[
  { k: 'terms', at: 4, line: 16, edge: true },
  { k: 'pay', at: 5, line: 19, edge: true },
]" />
</div>

<!--
SAY: Six verbs, six things on the screen. Notice what is NOT here: no `goToHomePage()`, no `login()`, nothing the payment screen cannot do. Next slide: grouping them.
TIME: 3 min.
NEXT: Group the boxes that always go together.
-->

---
layout: default
module: 7
stepId: m7-group
class: compact
---

# Optional: group by business intent, not by input box

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 items-center">
<div>

```ts [qoomlee/app/web/e2e/pages/PaymentPage.ts] {2-7|9|10|0}
// a business step: the whole card form, not one box
async fillCreditCard(card: Card) {
  await this.enterCardName(card.name);
  await this.enterCardNumber(card.number);
  await this.enterExpiry(card.expiry);
  await this.enterCvv(card.cvv);
}

async acceptTerms() { /* tick the box */ }
async pay() { /* press Pay securely */ }
```

<div class="dimmable" :class="{ dim: $clicks !== 3 }">

```ts
await paymentPage.fillCreditCard(TEST_CARD);
await paymentPage.acceptTerms();
await paymentPage.pay();
```

</div>

<div class="dimmable" :class="{ dim: $clicks !== 4 }">

```ts [qoomlee/app/web/e2e/data/card.ts]
// Omise TEST-mode card. Never a real card.
export const TEST_CARD: Card = {
  name: 'Jane Doe', number: '4242 4242 4242 4242',
  expiry: '12/29',  cvv: '123',
};
```

</div>

<v-click at="4"><span></span></v-click>

<div class="small" style="margin-top:0.6rem"><b>Too small:</b> four <code>enter…</code> calls in every test. <b>Just right:</b> <code>fillCreditCard</code>, the way a person says it: "fill out the card form". <b>Too big:</b> <code>bookAndPayEverything()</code> crosses screens and hides the flow.</div>
</div>
<PhoneShot src="11-payment-card" caption="fillCreditCard" :height="300" :marks="[
  { k: 'name', at: 0, line: 2 },
  { k: 'number', at: 0, line: 2 },
  { k: 'expiry', at: 0, line: 2 },
  { k: 'cvv', at: 0, line: 2 },
]" />
<PhoneShot src="11b-payment-pay" caption="terms + pay" :height="300" :marks="[
  { k: 'terms', at: 1, line: 9 },
  { k: 'pay', at: 2, line: 10 },
]" />
</div>

<!--
SAY: One method per input box is a good start, but a test should not have to say "enter the card name, enter the card number, enter the expiry, enter the CVV" every time. A person says "fill out the credit card". So group the boxes that always go together into one business-level action: fillCreditCard(card). One arrow, four boxes.
The small methods can stay (or become private helpers); the test only needs the grouped one. Pick the grouping a user would name, not the one the DOM suggests.
Not too big: a method that spans screens (bookAndPayEverything) hides the flow and fails in ways you cannot localise. Keep one screen per page object.
Q: "Why is acceptTerms separate?" It is its own decision: some tests want to skip it to check the error. Group things that always go together; keep optional steps separate.
TIME: 3 min.
NEXT: Rules of thumb.
-->

---
layout: default
module: 7
stepId: m7-rules
---

# Rules of thumb for a page class

| Do | Avoid |
|---|---|
| **Verbs the user does here**: `enterEmail`, `pay` | Flows across screens: `bookAndPayEverything()` |
| **The user's words** for names | `clickBtn3`, `setField1` |
| **Private locators**: expose one only if a test must assert on it | Exposing every selector to tests |
| **Small actions**, then a shortcut built from them (`fill`, `payWith`) | `if / else`, loops, hidden waits |
| **A few `expect…` verifies** about this screen's state | The test's business assertion buried in a page |

<div class="big-line" style="margin-top:1rem">If a user can't do it on this screen, it doesn't belong in this class.</div>

<!--
SAY: Read the left column as the recipe, the right column as the smells. The single sentence at the bottom is the test you apply in code review.
TIME: 2 min.
NEXT: Now the mechanics: extract these classes from the test we already wrote.
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

```ts [qoomlee/app/web/e2e/pages/PassengerPage.ts] {1-2|4-6|7|8-11|all}
export class PassengerPage {
  constructor(private readonly page: Page) {}

  async enterFirstName(name: string) {
    await this.page.getByPlaceholder('e.g. John').fill(name);
  }
  // ... last name, email, phone
  async continueToPayment() {
    await this.page.getByRole('button',
      { name: /continue to payment/i }).click();
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

```ts {1-11|13-21|all}
// pages/PaymentPage.ts
export class PaymentPage {
  constructor(private readonly page: Page) {}

  async enterCardNumber(number: string) { /* ... */ }
  async acceptTerms() { /* ... */ }
  async pay() {
    await this.page.getByRole('button', { name: /pay .* securely/i }).click();
  }
  async payWith(card: Card) { /* fill the card, accept terms, pay */ }
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
NEXT: Test data.
-->

---
layout: default
module: 7
stepId: m7-data
---

# Step 3: test data in one place

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
NEXT: Fixtures.
-->

---
layout: default
module: 7
stepId: m7-fixtures
class: compact
---

# Step 4: hand the pages to tests with fixtures

```ts [qoomlee/app/web/e2e/fixtures/index.ts] {1-5|7-10|12-18|all}
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
<div class="label-bad">Before: 30 lines of how</div>
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

```ts [qoomlee/app/web/e2e/tests/04-full-journey.spec.ts] {all}
test('book and pay, get a confirmation @smoke', async ({
  onPassengerForm: form, paymentPage, confirmationPage,
}) => {
  await form.fill(aPassenger());
  await form.continueToPayment();
  await paymentPage.payWith(TEST_CARD);

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
solution: qoomlee/app/web/e2e/ (pages, fixtures, data, tests)
---

Refactor your `my/` tests into `qoomlee/app/web/e2e/tests/my-final/`.

1. `PassengerPage` and `PaymentPage` (locators + one method per intent)
2. `aPassenger()` and `TEST_CARD`
3. A `fixtures/index.ts` with `passengerPage`, `paymentPage` and `onPassengerForm`
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
SAY: 15 minutes. The rule is run the tests after EVERY move. Solution: qoomlee/app/web/e2e/. If a pair is fast: add SearchPage and ResultsPage.
COMMON ISSUES: imports from the wrong `test` (must import from your fixtures file); `this.page` used before constructor assignment (property initializers need `private readonly page` shorthand).
RECAP (click): SAY: three bullets. TIME: 1 min.
NEXT: How do we organise all of this?
-->
