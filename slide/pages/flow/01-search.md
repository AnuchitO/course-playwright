---
layout: module-title
module: 1
heading: Flight search
thai: ค้นหาเที่ยวบิน
time: 0:10 - 0:35 · 25 min
problem: Teach the browser to fill the search form on a phone, then assert where we land.
---

<!--
SAY: Module 1. Our first screen: the flight search form. By the end you have your first passing test on a phone viewport.
TIME: 30 s.
NEXT: First, tell Playwright it is a phone.
-->

---
layout: default
module: 1
stepId: m1-config
---

# Step 0: run as a phone

```ts [workshop/flow/playwright.config.ts] {1,3|5-9|all}
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    // Chromium engine + iPhone 13 viewport, touch, user agent
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
```

<div class="small"><code>devices['iPhone 13']</code> = viewport 390 × 664, touch, mobile user agent. This is <b>emulation</b> in Chromium: fast, no simulator.</div>

<!--
SAY: One config line makes every test a phone test. Emulation is not a real device but it catches the layout and DOM differences, which is 90% of mobile bugs for a web app.
We override defaultBrowserType so we do not need to install WebKit today. WebKit emulation of iPhone is one flag away later.
DEMO: show workshop/flow/playwright.config.ts.
Q: "Real devices?" BrowserStack/real devices are a CI concern, not today.
TIME: 3 min.
NEXT: What we are looking at.
-->

---
layout: default
module: 1
stepId: m1-screen
class: compact
---

# Step 1: read the screen like a user

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

What a traveller does, click by click:

<v-clicks>

1. Choose **One way**
2. Tap **From**, pick Bangkok
3. Tap **To**, pick Singapore
4. Tap **Departure date**, pick today
5. Tap **Search Flights**
6. Land on the results page

</v-clicks>

<div class="small" style="margin-top:1rem">Every line becomes one line of test code. Write the steps in words first.</div>
</div>
<PhoneShot src="01-search-home" caption="/flights on a phone" :height="420" :marks="[
  { k: 'oneway', at: 1, from: 'ol li:nth-child(1)' },
  { k: 'from', at: 2, from: 'ol li:nth-child(2)' },
  { k: 'to', at: 3, from: 'ol li:nth-child(3)' },
  { k: 'date', at: 4, from: 'ol li:nth-child(4)' },
  { k: 'search', at: 5, from: 'ol li:nth-child(5)' },
]" />
</div>

<!--
SAY: Before code, write the user story in six lines. A good test is a transcript of what a human does. Each line below becomes one or two lines of code.
Gotcha to mention: on the phone the field says "Select city or airport", on desktop the same field is labelled "Select origin". The desktop DOM is hidden on mobile. This is why we test the viewport we ship.
TIME: 2 min.
NEXT: Line one.
-->

---
layout: default
module: 1
stepId: m1-skeleton
class: compact
---

# Step 2: the first lines

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

```ts [workshop/flow/steps/01-search.spec.ts] {1-3|4|5|6|all}
import { test, expect } from '../../starter/helpers/fixtures';

test('search BKK to SIN, one way', async ({ page }) => {
  await page.goto('/flights');
  await expect(page.getByRole('heading', { name: 'Flight Search' })).toBeVisible();
  await page.getByRole('button', { name: 'One way' }).click();
});
```

<StepCommand command="cd workshop && npx playwright test -c flow 01-search" />

<div class="small"><code>fixtures</code> is workshop plumbing (lets the browser call our local API). Just import it.</div>
</div>
<PhoneShot src="01-search-home" caption="what goto('/flights') opens" :height="400" :marks="[
  { k: 'heading', at: 2, line: 5 },
  { k: 'oneway', at: 3, line: 6 },
]" />
</div>

<!--
SAY: A test is a function that receives `page`. goto, then assert the page is what we think, then the first tap. Run it now; it is already a real test, and it is green.
Rule: always assert something right after navigation, so a failure points at the right step.
TIME: 3 min.
NEXT: The airports.
-->

---
layout: default
module: 1
stepId: m1-airports
class: compact
---

# Step 3: pick From and To

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 items-center">

```ts {1-5|6-7|9-11|12-13|all}
// the first "Select city..." button is
// always the next empty field
await page
  .getByRole('button', { name: /select city or airport/i })
  .first().click();
await page.getByRole('button', { name: /Suvarnabhumi/ })
  .click();

await page
  .getByRole('button', { name: /select city or airport/i })
  .first().click();
await page.getByRole('button', { name: /Singapore Changi/ })
  .click();
```

<PhoneShot src="02-origin-picker" caption="tap From: bottom sheet" :height="330" :marks="[
  { k: 'sheet', at: 0, line: 4 },
  { k: 'bkk', at: 1, line: 6 },
]" />
<PhoneShot src="03-destination-picker" caption="tap To" :height="330" :marks="[
  { k: 'sheet', at: 2, line: 10 },
  { k: 'sin', at: 3, line: 12 },
]" />
</div>

<!--
SAY: The airport list is a bottom sheet, a mobile pattern. We tap the field, then the airport by its visible name. Notice `.first()`: once the origin is chosen, its button no longer says "Select city or airport", so the first match is now the destination. A regex `/.../i` keeps us safe from casing.
Q: "Why not codegen?" Codegen would give getByRole too, but it records a fragile `nth(1)`. We reason about it instead.
TIME: 4 min.
NEXT: The date.
-->

---
layout: default
module: 1
stepId: m1-date
class: compact
---

# Step 4: pick the date

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 items-center">
<div>

```ts {1-3|4|all}
await page.getByText('Select date')
  .locator('visible=true')
  .click();
await page.getByText('Today', { exact: true }).click();
```

<div class="small" style="margin-top:0.8rem">Why <code>.locator('visible=true')</code>? The page keeps a hidden desktop copy of the date field. <code>getByText</code> would match both and Playwright refuses to guess (strict mode). Narrow to the visible one.</div>
</div>
<PhoneShot src="01-search-home" caption="the date field" :height="330" :marks="[
  { k: 'date', at: 0, line: 1 },
]" />
<PhoneShot src="04-date-picker" caption="calendar sheet" :height="330" :marks="[
  { k: 'today', at: 1, line: 4 },
]" />
</div>

<!--
SAY: Strict mode is a feature: if a locator matches two elements Playwright throws instead of clicking the wrong one. Here the culprit is the hidden desktop layout. Two fixes: narrow the locator (visible=true, or scope to a parent) or pick `.first()` when order is meaningful.
Common error to show live: "strict mode violation: getByText('Select date') resolved to 2 elements". Read the message, it lists both.
TIME: 4 min.
NEXT: Search and assert.
-->

---
layout: default
module: 1
stepId: m1-assert
class: compact
---

# Step 5: search, then assert the URL

<div class="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-5 items-center">
<div>

```ts {1|2-3|all}
await page.getByRole('button', { name: 'Search Flights' }).click();
await expect(page).toHaveURL(
  /\/flights\/results\/?\?.*origin=BKK.*destination=SIN/);
```

<div class="small" style="margin-top:0.8rem">The URL carries the search: <code>origin=BKK&amp;destination=SIN</code>. Asserting it proves the form sent the right data, in one line, with no flaky waiting.</div>
</div>
<PhoneShot src="05-search-filled" caption="form filled" :height="330" :marks="[
  { k: 'search', at: 0, line: 1 },
]" />
<PhoneShot src="06-results" caption="we land here" :height="330" :marks="[
  { k: 'route', at: 1, line: 3 },
]" />
</div>

<!--
SAY: What proves the search worked? The user lands on results for BKK to SIN. The URL encodes that. toHaveURL retries until the navigation finishes, so there is no sleep and no waitForNavigation.
Trailing slash note: `/?` because Next.js adds a slash.
TIME: 3 min.
NEXT: Run the whole thing.
-->

---
layout: default
module: 1
stepId: m1-run
---

# Run it, and watch it

<StepCommand command="cd workshop && npx playwright test -c flow 01-search --headed" />

```txt
Running 1 test using 1 worker
  ✓  1 [mobile] › flow/steps/01-search.spec.ts:3:1 › search BKK to SIN, one way (3.1s)
  1 passed
```

| Flag | What it does |
|---|---|
| `--headed` | show the (phone-sized) browser |
| `--ui` | UI mode: time-travel through steps |
| `npx playwright show-report` | HTML report of the last run |

<!--
SAY: Run headless first, then --headed so they see the phone-size window fill the form by itself. This is the moment it clicks for most people.
IF IT FAILS: "strict mode violation" -> locator too broad. Timeout on "Today" -> calendar sheet did not open, check the previous click. No flights is NOT an error here: step 1 only checks the URL.
TIME: 3 min.
NEXT: Your turn.
-->

---
layout: lab
module: 1
lab: 1
minutes: 10
solution: workshop/flow/steps/01-search.spec.ts
---

Create `workshop/flow/my/01-search.spec.ts`.

1. Open `/flights`, choose **One way**
2. From **BKK**, To **SIN**
3. Date **Today**, press **Search Flights**
4. Assert the results URL for BKK to SIN

::criteria::
- [ ] Test passes on the `mobile` project
- [ ] No CSS or XPath selectors
- [ ] Bonus: run it for **BKK to HKG**

::hint::
Stuck on a locator? `npx playwright codegen --device="iPhone 13" http://localhost:3000/flights` shows what Playwright suggests.

::recap::
- A test = user steps as code, ending with an `expect`
- Locator order: **role > label > text > test id**; never CSS/XPath
- Strict mode = Playwright refuses to guess between two matches

<!--
SAY: 10 minutes, pairs. Faster pairs do the bonus route. Solution is workshop/flow/steps/01-search.spec.ts.
LAB TIMING: 10 min. At 7 min show the hint on screen. Walk the room; the common block is the date picker.
COMMON ISSUES: forgot "One way"; copied desktop locator "Select origin"; strict mode on date.
RECAP (click): SAY: three bullets, one participant names the locator that surprised them. TIME: 1 min.
NEXT: Results.
-->
