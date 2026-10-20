---
layout: default
module: 9
---

# Wrap-up: what you can do now

<div class="grid grid-cols-2 gap-8">
<div>

### Written today
1. Search form on a phone
2. Results, selecting a flight
3. Passenger form: sad and happy path
4. Payment with a test card
5. Confirmation and the full journey

</div>
<div>

### Skills
- **Locate, act, assert** with auto-wait
- Teleport with URLs, data from the API
- Debug with error, UI mode, trace
- **Page Object + fixtures + builders**
- A folder structure with clear import direction

</div>
</div>

<!--
SAY: Walk the left column as a story: we started from a form and ended with a smoke journey and a clean structure. Ask: which screen was hardest, which rule will you apply on Monday?
TIME: 3 min.
NEXT: Cheat sheet.
-->

---
layout: default
module: 9
---

# Cheat sheet

| | |
|---|---|
| Locator | `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId` |
| Act | `goto` `click` `fill` `check` `selectOption` |
| Assert | `toBeVisible` `toHaveText` `toHaveURL` `toHaveCount` (all retry) |
| Never | `waitForTimeout`, CSS chains, XPath, `expect(await x.isVisible())` |
| Mobile | `devices['iPhone 13']` in a project; mind hidden desktop duplicates |
| Debug | `--ui`, `--debug`, `codegen --device`, `show-trace` |
| Structure | `pages/` `fixtures/` `data/` `tests/`: tests import fixtures and data only |

<div class="small">Handout: <code>workshop/handout.md</code> · Code: <code>make replay</code> (every step, commit by commit) and <code>qoomlee/app/web/e2e</code> (refactored)</div>

<!--
SAY: Photograph this slide. The handout has the long version.
TIME: 2 min.
NEXT: Where to go next.
-->

---
layout: default
module: 9
---

# Where to go next

- **API mocking** with `page.route` for payment and flaky third parties
- **Login once**: `storageState` and setup projects
- **Visual checks**: `toHaveScreenshot()` on mobile screens
- **CI**: GitHub/GitLab pipeline, upload the HTML report and traces
- **Real devices / WebKit**: add a `webkit` project with `devices['iPhone 13']`
- **Accessibility**: `@axe-core/playwright` on each screen

<div class="big-line" style="margin-top:1.5rem">Thank you. Questions?</div>

<!--
SAY: Park everything we did not cover here, pick the one that matches your project's pain. The classic deck (slides-classic.md) covers mocking and CI in depth.
TIME: 3 min. Leave 2 min for questions.
-->
