<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watchEffect } from 'vue'
import { useNav } from '@slidev/client'
import setupShiki from '@slidev/client/setup/shiki.ts'

// Workshop agenda: module number -> [label, start min, length min, color]
const MODULES: Record<number, [string, number, number, string]> = {
  0: ['0 Setup & the app', 0, 10, '#64748b'],
  1: ['1 Flight search', 10, 25, '#2563eb'],
  2: ['2 Flight results', 35, 20, '#d97706'],
  3: ['3 Booking & passenger', 65, 20, '#059669'],
  4: ['4 Payment', 85, 15, '#db2777'],
  5: ['5 Confirmation & journey', 100, 15, '#0891b2'],
  6: ['6 Debug it', 115, 10, '#dc2626'],
  7: ['7 Page Object refactor', 125, 30, '#7c3aed'],
  8: ['8 Code structure', 155, 15, '#0d9488'],
  9: ['9 Wrap-up', 170, 10, '#334155'],
}
const BREAK = { start: 55, length: 10 }

const { currentSlideRoute, currentSlideNo, total } = useNav()
const fm = computed<any>(() => (currentSlideRoute.value as any)?.meta?.slide?.frontmatter ?? {})
const mod = computed<number | null>(() => (typeof fm.value.module === 'number' ? fm.value.module : null))
const info = computed(() => (mod.value === null ? null : MODULES[mod.value]))

watchEffect(() => {
  document.documentElement.style.setProperty('--m', info.value?.[3] ?? '#64748b')
})

const fmt = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`
const hh = computed(() => (info.value ? `${fmt(info.value[1])} - ${fmt(info.value[1] + info.value[2])}` : ''))

const segments = computed(() => {
  const segs = Object.entries(MODULES).map(([k, v]) => ({ k: Number(k), start: v[1], len: v[2], color: v[3] }))
  segs.push({ k: -1, start: BREAK.start, len: BREAK.length, color: '#cbd5e1' })
  return segs.sort((a, b) => a.start - b.start)
})
const pct = computed(() => Math.round((currentSlideNo.value / total.value) * 100))

// Syntax-highlight inline `code` that looks like a command or Playwright code,
// using the deck's own Shiki themes (follows light/dark like fenced blocks).
const SHELL = /^(npx|npm|pnpm|yarn|bun|cd|git|node|docker|curl|brew|lsof|kill|open|export|[A-Z_]+=)\b/
const TS = /(\bawait\b|\bexpect\(|\bpage\.|\blocator\.|\w\.\w+\(|\w\(.*\))/
let observer: MutationObserver | undefined
let timer: ReturnType<typeof setTimeout> | undefined

async function highlightInline() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.slidev-layout code:not([data-hl])'))
    .filter(el => !el.closest('pre'))
  if (!els.length) return
  const { shorthands, defaultHighlightOptions } = await setupShiki()
  for (const el of els) {
    el.dataset.hl = '1'
    const src = el.textContent ?? ''
    const lang = SHELL.test(src) ? 'bash' : TS.test(src) ? 'ts' : null
    if (!lang) continue
    try {
      const html = await shorthands.codeToHtml(src, { ...defaultHighlightOptions, lang })
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const pre = doc.querySelector('pre')
      const code = doc.querySelector('pre code')
      if (!pre || !code) continue
      el.className = `${el.className} shiki ${pre.className}`.trim()
      el.innerHTML = code.innerHTML
      el.classList.add('hl-inline')
    }
    catch (e) {
      console.error('[inline-hl]', e)
    }
  }
}
onMounted(() => {
  highlightInline()
  observer = new MutationObserver(() => {
    clearTimeout(timer)
    timer = setTimeout(highlightInline, 60)
  })
  observer.observe(document.body, { childList: true, subtree: true })
})
onBeforeUnmount(() => { observer?.disconnect() })
</script>

<template>
  <div v-if="info" class="tracker">
    <div class="bar">
      <div
        v-for="s in segments" :key="s.start" class="seg"
        :style="{ flex: s.len, background: s.color, opacity: s.k === mod ? 1 : 0.28 }"
      />
    </div>
    <div class="row">
      <span class="name" :style="{ color: info[3] }">Module {{ info[0] }}</span>
      <span class="time">{{ hh }} &middot; {{ info[2] }} min</span>
      <span class="count">{{ currentSlideNo }} / {{ total }} &middot; {{ pct }}%</span>
    </div>
  </div>
</template>

<style scoped>
.tracker { position: absolute; top: 0; left: 0; right: 0; z-index: 20; padding: 0.35rem 1.2rem 0; }
.bar { display: flex; gap: 3px; height: 8px; }
.seg { border-radius: 4px; }
.row { display: flex; gap: 1rem; font-size: 0.78rem; margin-top: 0.2rem; font-weight: 700; }
.time { color: var(--muted); }
.count { margin-left: auto; color: var(--muted); }
</style>
