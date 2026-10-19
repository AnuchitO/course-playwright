---
layout: module-title
module: 8
heading: Code structure best practices
thai: โครงสร้างโค้ดที่ดี
time: 2:35 - 2:50 · 15 min
problem: Five page objects today. Fifty next year. Where does everything live?
---

<!--
SAY: Module 8. We have the pieces. Now: where do they live so a team of ten can find, change and trust them?
TIME: 30 s.
NEXT: The folder layout.
-->

---
layout: default
module: 8
stepId: m8-tree
---

# A structure that scales

<div class="grid grid-cols-[1fr_1.1fr] gap-6">

```txt
workshop/flow/
├── playwright.config.ts   # projects, timeouts, trace
├── pages/                 # one class per screen
│   ├── SearchPage.ts
│   ├── ResultsPage.ts
│   ├── PassengerPage.ts
│   ├── PaymentPage.ts
│   └── ConfirmationPage.ts
├── fixtures/
│   └── index.ts           # test.extend(...)
├── data/                  # builders, test card
│   ├── passenger.ts
│   └── card.ts
└── tests/                 # specs by feature
    ├── search.spec.ts
    ├── passenger-validation.spec.ts
    └── journey.spec.ts    # @smoke
```

<div>

| Folder | Holds | Rule |
|---|---|---|
| `pages/` | locators + intent | no `expect` for test goals |
| `fixtures/` | wiring | one `test` export |
| `data/` | builders | unique per run |
| `tests/` | specs | read like a story |

<div class="small" style="margin-top:0.8rem">Tests import <b>only</b> from <code>fixtures</code> and <code>data</code>, never from <code>pages</code> directly. One import to change, one place to extend.</div>
</div>
</div>

<!--
SAY: Four folders, four jobs. The direction of imports is the key rule: tests depend on fixtures and data; fixtures depend on pages; pages depend on nothing but Playwright. No arrows going back.
Q: "Where do shared components like the bottom navigation go?" `pages/components/BottomNav.ts`, a small class composed into pages. Compose, don't inherit.
TIME: 3 min.
NEXT: The rules that keep it clean.
-->

---
layout: default
module: 8
stepId: m8-rules
---

# Ten rules that keep it healthy

<div class="grid grid-cols-2 gap-8">
<div>

1. **Name tests by behaviour**: "empty form shows required errors"
2. **One reason to fail** per test
3. **Independent**: any order, in parallel
4. **Locators**: role > label > text > test id
5. **Pages: no base-class junk drawer**; compose small objects
</div>
<div>

6. **Assertions live in tests**
7. **Unique data** per run, test cards only
8. **No sleeps**; web-first `expect`
9. **Few smoke journeys** (`@smoke`), many fast focused tests
10. **Evidence on failure**: trace, screenshot, report
</div>
</div>

<div class="small" style="margin-top:1rem">Use it as your PR checklist. A test that breaks two rules is a future flaky test.</div>

<!--
SAY: Read it as a review checklist, not a lecture. Pick the two the team is most likely to break, usually 5 and 6.
TIME: 3 min.
NEXT: What goes wrong when teams overdo it.
-->

---
layout: default
module: 8
stepId: m8-pitfalls
---

# Pitfalls: when POM goes wrong

| Smell | Why it hurts | Instead |
|---|---|---|
| `BasePage` with 40 helpers | junk drawer, everything depends on it | compose small component objects |
| `expect` inside page methods | hides what the test checks | page exposes locators, test asserts |
| Page object per *component* of every page | abstraction with no reuse | extract only what repeats |
| `loginAndBookAndPay()` mega-method | one failure, no idea which step | small intent methods, test sequences them |
| Pages call other pages | tangled graph | tests orchestrate pages |
| Selectors in tests *and* pages | two sources of truth | locators only in pages |

<!--
SAY: POM is a tool, not a religion. Start light (as we did), extract when something repeats, stop when it stops paying back. If a page object has more methods than the page has buttons, it is doing too much.
TIME: 3 min.
NEXT: Running it in the real world: tags and projects.
-->

---
layout: default
module: 8
stepId: m8-config
---

# Config and tags: one suite, many uses

```ts [workshop/flow/playwright.config.ts] {1-3|5-9|all}
projects: [
  { name: 'mobile',  use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  { name: 'desktop', use: { ...devices['Desktop Chrome'] } }, // needs desktop locators
],
retries: process.env.CI ? 2 : 0,
use: { trace: 'on-first-retry', screenshot: 'only-on-failure' },
```

| Command | Use |
|---|---|
| `npx playwright test --grep @smoke` | every push |
| `npx playwright test --project=mobile` | one viewport |
| `npx playwright test` | nightly, everything |

<div class="small">Careful: locators differ per viewport (<code>Select city or airport</code> vs <code>Select origin</code>). When a page differs a lot between mobile and desktop, give the Page Object an <code>isMobile</code> branch or split the class.</div>

<!--
SAY: Same code, more projects: that is the payoff of structure. Tag the journey @smoke and run it on every push; run everything nightly. Retries only in CI so local failures stay loud.
Honest note: our search form locators are mobile-specific; running them on desktop would fail. That's real life: decide per page.
TIME: 3 min.
NEXT: Wrap up.
-->
