---
theme: default
title: Playwright E2E for Qoomlee (mobile flow)
info: |
  3-hour hands-on Playwright workshop. We test the whole Qoomlee booking flow on a
  phone viewport, step by step, then refactor it to Page Objects.
# addons:
#   - slidev-addon-muan-companion
colorSchema: auto
aspectRatio: 16/9
canvasWidth: 1100
fonts:
  provider: none
  sans: Inter, -apple-system, Segoe UI, Sarabun, Noto Sans Thai, sans-serif
  mono: Fira Code, JetBrains Mono, Menlo, monospace
highlighter: shiki
lineNumbers: false
codeCopy: true
drawings:
  persist: false
transition: none
---

<PlaywrightLogo />

# Playwright for Qoomlee
<div class="big-line" style="margin-top:2rem">Test the whole booking flow on a phone,<br>one screen at a time. Then make it clean.</div>

<div class="small" style="margin-top:2rem">3 hours · hands-on · TypeScript + <code>@playwright/test</code> · เวิร์กชอปเขียนเทสต์ E2E ด้วย Playwright (มุมมองมือถือ)</div>

<!--
SAY: Welcome. Today's single outcome: by 3 hours from now you can write a full end-to-end test of a real booking flow, and then structure it so a team can maintain it.
We build ONE journey, one screen at a time: Search, Results, Booking, Passenger info, Payment, Confirmation. Every screen you see is a real screenshot from a phone viewport, taken with Playwright itself.
TIME: 1 min.
NEXT: How the day works.
-->

---
src: ./pages/flow/00-intro.md
---

---
src: ./pages/flow/01-search.md
---

---
src: ./pages/flow/02-results.md
---

---
src: ./pages/flow/03-passenger.md
---

---
src: ./pages/flow/04-payment.md
---

---
src: ./pages/flow/05-confirmation.md
---

---
src: ./pages/flow/06-debug.md
---

---
src: ./pages/flow/07-pom.md
---

---
src: ./pages/flow/08-structure.md
---

---
src: ./pages/flow/09-wrap.md
---
