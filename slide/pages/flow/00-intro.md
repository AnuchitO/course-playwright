---
layout: default
module: 0
---

# What you will learn

<div class="outcome">
  <div class="card"><div class="k">1</div><div><b>Write</b> a full booking-flow test</div></div>
  <div class="card"><div class="k">2</div><div><b>Structure</b> it so a team can keep it</div></div>
</div>

<div class="path">
  <div class="half" v-click>
    <div class="label" style="--c:#2563eb">First: write it, screen by screen</div>
    <div class="steps">
      <div class="step" style="--c:#65a30d"><i>0</i>Setup</div>
      <div class="step" style="--c:#2563eb"><i>1</i>Search</div>
      <div class="step" style="--c:#d97706"><i>2</i>Results</div>
      <div class="step" style="--c:#059669"><i>3</i>Passenger</div>
      <div class="step" style="--c:#db2777"><i>4</i>Payment</div>
      <div class="step" style="--c:#0891b2"><i>5</i>Confirmation</div>
      <div class="step" style="--c:#dc2626"><i>6</i>Debug</div>
    </div>
  </div>
  <div class="half" v-click>
    <div class="label" style="--c:#7c3aed">Then: make it clean</div>
    <div class="steps">
      <div class="step" style="--c:#7c3aed"><i>7</i>Page Objects</div>
      <div class="step" style="--c:#0d9488"><i>8</i>Structure</div>
      <div class="step" style="--c:#334155"><i>9</i>Wrap-up</div>
    </div>
  </div>
</div>

<style scoped>
.outcome { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin: 1.6rem 0 2.6rem; }
.card { display: flex; align-items: center; gap: 1rem; font-size: 1.6rem; line-height: 1.25; padding: 1.1rem 1.3rem; border-radius: 14px; background: var(--hint-bg); border-left: 8px solid var(--m); }
.card .k { font-size: 3rem; font-weight: 900; color: var(--m); line-height: 1; }
.path { display: flex; flex-direction: column; gap: 2rem; }
.label { font-size: 1.1rem; font-weight: 800; color: var(--c); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.5rem; }
.steps { display: flex; flex-wrap: nowrap; gap: 0.5rem; }
.step { display: flex; align-items: center; gap: 0.5rem; font-size: 1.05rem; font-weight: 700; padding: 0.3rem 0.8rem 0.3rem 0.3rem; white-space: nowrap; border-radius: 999px; border: 2px solid var(--c); }
.step i { display: grid; place-items: center; width: 1.8rem; height: 1.8rem; border-radius: 50%; background: var(--c); color: #fff; font-style: normal; font-size: 0.95rem; }
</style>

<!--
SAY: One outcome: you can write a full booking-flow test, and then structure it so a team can keep it.
CLICK 1: First half. Setup, then one screen at a time: search, results, passenger, payment, confirmation, and debugging. It is allowed to be ugly.
CLICK 2: Second half. Page Objects, a structure that scales, wrap-up. You feel the pain first, then the pattern fixes it.
Point at the bar on top: coloured per module, shows where we are.
Q: "Do we get the slides and code?" Yes: `make replay` walks every step commit by commit, qoomlee/app/web/e2e = the refactored result.
NEXT: Quick readiness check.
-->

---
layout: default
module: 0
stepId: checklist
---

# Pre-workshop checklist

- **Node.js 20+** &nbsp; `node -v`
- **Repo cloned**, then `cd qoomlee/app/web && bun install`
- **Browsers**: `npx playwright install chromium`
- **Backend**: `docker compose up -d --wait` in `qoomlee-challenge`
- **App** on <http://localhost:3000/flights> (`bun run dev`)

<StepCommand command="cd qoomlee/app/web && bun install && bunx playwright install chromium" />

<div class="small" style="margin-top:1rem">Your own project later: <code>npm init playwright@latest</code> does this setup for you.</div>

<!--
SAY: Raise a hand if any line is not green. Fix it with a neighbour now; the first lab starts in 25 minutes.
DEMO: `curl -I localhost:3000/flights` and `docker compose ps` on the projector as the reference "green".
IF IT FAILS: stale seed -> `docker compose down -v && docker compose up -d --wait`.
TIME: 3 min.
NEXT: The app.
-->

---
layout: default
module: 0
---

# Qoomlee, the journey we will test

<div class="flex justify-between items-start" style="margin-top:0.5rem">
  <PhoneShot src="01-search-home" caption="1 Search" :height="300" />
  <PhoneShot src="06-results" caption="2 Results" :height="300" />
  <PhoneShot src="09-booking-filled" caption="3 Passenger info" :height="300" />
  <PhoneShot src="11-payment-card" caption="4 Payment" :height="300" />
  <PhoneShot src="12-confirmation" caption="5 Confirmation" :height="300" />
</div>

<div class="small" style="margin-top:1rem">Real screenshots, iPhone 13 emulation (390 px wide, 3× pixel density). Open it on your phone-sized browser: <code>http://localhost:3000/flights</code></div>

<!--
SAY: This is the app. A flight search, a results list, a passenger form, a payment form with a TEST card, and a confirmation with a booking reference. Five screens, six steps. By the end of module 5 one test walks all of it.
Why a phone viewport? Most travellers book on mobile, and the mobile layout is a different DOM from desktop. Our tests should run where the users are.
TIME: 2 min.
NEXT: Three Playwright ideas before we start.
-->

---
layout: default
module: 0
---

# Three ideas, then we write code

<div class="grid grid-cols-3 gap-5" style="margin-top:1rem">
<div>

### 1. Locate
Find the element **like a user**: by role, label, text.

`page.getByRole('button', { name: 'Search Flights' })`
</div>
<div>

### 2. Act
Do what a user does. Playwright **waits** until it is possible.

`await locator.click()`<br>`await locator.fill('Jane')`
</div>
<div>

### 3. Assert
Check what the user sees. Assertions **retry** until true.

`await expect(locator).toBeVisible()`
</div>
</div>

<!--
SAY: That is the whole library for today: locate, act, assert. No sleeps, no manual waiting; Playwright retries for us. Everything in the next two hours is these three verbs on six screens.
TIME: 2 min.
NEXT: Let's start with the first screen.
-->
