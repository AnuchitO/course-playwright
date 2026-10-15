---
layout: default
---

# The one outcome, and the day

<div class="big-line">By 3:00 you can <b>write, run, debug and understand</b> a basic end-to-end test.</div>

| | | |
|---|---|---|
| 0:00 | **0** Why & Setup | 10 |
| 0:10 | **1** First test: search flights | 25 |
| 0:35 | **2** Flaky tests & auto-wait | 20 |
| 0:55 | break | 10 |
| 1:05 | **3** Booking flow & forms | 25 |
| 1:30 | **4** Debugging | 20 |
| 1:50 | **5** Duplication & slow setup | 25 |
| 2:15 | **6** Don't depend on the real world | 20 |
| 2:35 | **7** CI & scale | 15 |
| 2:50 | **8** Wrap-up | 10 |

<!--
SAY: Every module is a story: a problem you will feel, the naive way we cope, the smallest Playwright answer, then the next problem it exposes. Then you do a timed lab. Features only appear after the pain that needs them.
Point at the bar on top: it is the agenda tracker, colored per module, and it shows time and slide progress.
Q: "Do we get the slides?" Yes, plus workshop/ folder with labs, solutions, handout.
TIME: 2 min (total for the three front slides: 5, taken out of Module 0).
NEXT: Quick check that everybody is ready.
-->

---
layout: default
stepId: checklist
---

# Pre-workshop checklist

- **Node.js 20+** &nbsp; `node -v`
- **Repo cloned**, then `cd workshop && npm install`
- **Browsers**: `npx playwright install chromium` (all browsers for Module 7)
- **Backend**: `docker compose up -d --wait` in `qoomlee-challenge`
- **App** on <http://localhost:3000/flights> (`bun run dev`)

<StepCommand command="cd workshop && npm install && npx playwright install chromium" />

<div class="small" style="margin-top:1rem">Your own project later: <code>npm init playwright@latest</code> does the same setup for you.</div>

<!--
SAY: Raise a hand if any of these is not green. Fix it now with a neighbour; we start the labs in 10 minutes. The Done button in the companion tells me who is ready.
DEMO: run `curl -I localhost:3000/flights` and `docker compose ps` on the projector as the reference "green".
LIKELY QUESTIONS: Yarn/pnpm? Fine, same commands. Windows? Same commands in PowerShell. Why pinned 1.60.0? The cached browsers and the app's own tests use it.
IF IT FAILS: stale seed -> `docker compose down -v && docker compose up -d --wait`.
TIME: 2 min.
NEXT: Here is the app we will test.
-->

---
layout: default
stepId: app
---

# The challenge application: Qoomlee

<div class="grid grid-cols-2 gap-8">
<div>

Hybrid airline, Kalasin. **Next.js** UI, **Go** services, **PostgreSQL**, payments via **Omise** (test mode).

Journeys we automate:

1. Search flights
2. Select a flight
3. Passenger details (validation)
4. Pay with a test card
5. Confirmation and PNR
6. View bookings

</div>
<div>

```txt {all}
workshop/
  starter/     <- you work here
    tests/  pages/  helpers/
    playwright.config.ts
  solutions/lab-0 ... lab-7
  labs/lab-0.md ... lab-7.md
  handout.md
```

<div class="small">Selectors and URLs here are real for this repo's running app. On your own instance, adjust them.</div>
</div>
</div>

<!--
SAY: This is a real app running on your laptop: frontend on :3000, two Go services behind it, Omise in test mode. The starter folder is yours. Solutions per lab are in solutions/, and branches lab-N-solution mirror them.
Be upfront: the UI is English only and there is no login. A traveller is an anonymous id stored in the browser; we will use that in Module 5. Check-in and seat selection exist in the app but are out of scope for 3 hours.
Instructor note: the backends send no CORS headers, so the starter has a small `corsBridge` fixture that forwards to the real backend. It is plumbing, not a lesson.
Q: "Is it mocked?" No, real backend, real database. We mock on purpose in Module 6.
TIME: 1 min.
NEXT: Module 0: why are we here?
-->
