---
layout: default
module: 0
---

# The one outcome, and the day

<div class="big-line">By 3:00 you can <b>write a full booking-flow test</b> and <b>structure it for a team</b>.</div>

| | | |
|---|---|---|
| 0:00 | **0** Setup & the app | 10 |
| 0:10 | **1** Flight search | 25 |
| 0:35 | **2** Flight results | 20 |
| 0:55 | break | 10 |
| 1:05 | **3** Booking & passenger info | 20 |
| 1:25 | **4** Payment | 15 |
| 1:40 | **5** Confirmation & the full journey | 15 |
| 1:55 | **6** Debug it | 10 |
| 2:05 | **7** Refactor to Page Objects | 30 |
| 2:35 | **8** Code structure best practices | 15 |
| 2:50 | **9** Wrap-up | 10 |

<!--
SAY: Two halves. Until 2:05 we write ONE test, screen by screen, and it is allowed to be ugly. From 2:05 we refactor it into something a team can live with. You feel the pain first, then the pattern fixes it.
Point at the bar on top: coloured per module, shows the clock.
Q: "Do we get the slides and code?" Yes: `make replay` walks every step commit by commit, qoomlee/app/web/e2e = the refactored result.
TIME: 2 min.
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
