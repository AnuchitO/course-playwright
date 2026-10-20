---
layout: module-title
module: 6
heading: Debug it
thai: ดีบักเมื่อเทสต์ล้ม
time: 1:55 - 2:05 · 10 min
problem: A red test is only useful if you can see why it failed.
---

<!--
SAY: Module 6, ten minutes, all demo. You will break tests while refactoring in a moment; this is how you find out why quickly.
TIME: 30 s.
NEXT: Three tools.
-->

---
layout: default
module: 6
stepId: m6-tools
---

# Three tools, in the order you reach for them

<div class="grid grid-cols-3 gap-4" style="margin-top:0.8rem">
<div>

### 1. The error
Read the **first** line and the code frame. It names the locator and the step.

```txt
Error: expect(locator).toBeVisible()
Locator: getByText('QM101')
Expected: visible
Received: <element(s) not found>
```
</div>
<div>

### 2. UI mode
Time travel: click a step, see the DOM and screenshot at that moment.

<StepCommand command="cd qoomlee/app/web && bun run test:e2e:ui" />
</div>
<div>

### 3. Trace
A recording of a failed CI run. Open it locally.

<StepCommand command="npx playwright show-trace trace.zip" />
</div>
</div>

<div class="small" style="margin-top:1rem">Config (<code>e2e/playwright.config.ts</code>): <code>use: { trace: 'on-first-retry' }</code> records a trace when a failed test is retried (set <code>retries</code> in CI). Cheap, and exactly when you need it.</div>

<!--
SAY: Order matters. 80% of failures are solved by reading the error: a locator that matched nothing or two things. Then UI mode when you need to see it. Then traces for failures you cannot reproduce, like CI.
DEMO (5 min): break a locator in 04-full-journey (change 'Pay' regex), run `bun run test:e2e:ui`, click the failed step, show the DOM snapshot and the highlighted locator. Then run `bun run test:e2e --debug` to open the Inspector and step with F10.
Q: "Where do screenshots go?" test-results/ and the HTML report, `screenshot: 'only-on-failure'` in config.
TIME: 5 min.
NEXT: Debug the locators.
-->

---
layout: default
module: 6
stepId: m6-locators
class: compact
---

# Find a locator on the phone screen

<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
<div>

<StepCommand command="npx playwright codegen --device='iPhone 13' http://localhost:3000/flights" />

<v-clicks>

- **Pick locator** in the Inspector: hover the element, it proposes the best locator
- Copy it into your test; then **read it**: role and name, not `nth`
- Stuck mid-test? `await page.pause()` opens the Inspector at that line

</v-clicks>

```ts
await page.getByRole('button', { name: /select/i }).first().click();
await page.pause(); // remove before commit
```
</div>
<PhoneShot src="01-search-home" caption="hover → getByRole('button', { name: 'One way' })" :height="400" :marks="[
  { k: 'oneway', at: 1, from: 'ul li:nth-child(1)' },
  { k: 'search', at: 2, from: 'ul li:nth-child(2)' },
]" />
</div>

<!--
SAY: Codegen is a locator finder, not a test author. The phone emulation matters: it shows the mobile DOM, so you get "Select city or airport" and not the hidden desktop label.
Remind: remove page.pause() before committing; it hangs CI forever.
TIME: 3 min.
NEXT: Now the refactor.
-->
