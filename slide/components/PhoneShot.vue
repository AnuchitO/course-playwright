<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'
import marksData from './marks.json'

/**
 * Phone screenshot with optional animated callouts.
 * marks: [{ k: 'oneway', at: 0, line: 6 }]
 *   k     key in marks.json for this screenshot (box in % of the screen)
 *   at    click step that reveals it (matches the code block range index: {a|b|c} -> 0,1,2)
 *   line  1-based line of the code block on this slide the arrow starts from
 *   block which code block on the slide (default 0)
 *   from  or any CSS selector (e.g. a list item) to start the arrow from
 */
type Mark = { k: string; at?: number; line?: number; block?: number; from?: string }
const props = withDefaults(defineProps<{ src: string; caption?: string; height?: number; marks?: Mark[] }>(), { height: 440, marks: () => [] })

const ctx = useSlideContext() as any
const clicks = computed<number>(() => Number(ctx.$clicks?.value ?? ctx.$clicks ?? 0))
const boxes = (marksData as Record<string, Record<string, number[]>>)[props.src] ?? {}

const items = computed(() =>
  props.marks
    .map((m, i) => ({ ...m, i, box: boxes[m.k] }))
    .filter((m) => m.box && clicks.value >= (m.at ?? 0)),
)
// the arrow is drawn only for marks of the current click step; earlier ones stay as dimmed highlights

const root = ref<HTMLElement | null>(null)
const frame = ref<HTMLElement | null>(null)
type Arrow = { id: number; d: string; ax: number; ay: number }
const arrows = ref<Arrow[]>([])

function scaleOf(el: HTMLElement) {
  return el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth : 1
}
function anchorOf(layout: Element, m: Mark): DOMRect | null {
  let el: Element | null = null
  if (m.from) el = layout.querySelector(m.from)
  else if (m.line) {
    const blocks = layout.querySelectorAll('.slidev-code')
    const lines = blocks[m.block ?? 0]?.querySelectorAll('.line')
    el = lines?.[m.line - 1] ?? null
  }
  if (!el) return null
  const r = document.createRange()
  r.selectNodeContents(el)
  const rects = [...r.getClientRects()].filter((x) => x.width > 0)
  return rects.length ? rects[rects.length - 1] : el.getBoundingClientRect()
}
function layoutArrows() {
  const rootEl = root.value, frameEl = frame.value
  if (!rootEl || !frameEl) return
  const layout = rootEl.closest('.slidev-layout')
  if (!layout) return
  const s = scaleOf(rootEl)
  const rr = rootEl.getBoundingClientRect()
  const fr = frameEl.getBoundingClientRect()
  const out: Arrow[] = []
  for (const m of items.value) {
    if ((m.at ?? 0) !== clicks.value || (!m.line && !m.from)) continue
    const a = anchorOf(layout, m)
    if (!a) continue
    const sx = (a.right - rr.left) / s + 8
    const sy = (a.top + a.height / 2 - rr.top) / s
    const [bx, by, bw, bh] = m.box!
    const tx = (fr.left - rr.left) / s + (fr.width / s) * (bx / 100) - 4
    const ty = (fr.top - rr.top) / s + (fr.height / s) * ((by + bh / 2) / 100)
    const dx = Math.max(40, tx - sx)
    out.push({ id: m.i, d: `M ${sx} ${sy} C ${sx + dx * 0.55} ${sy}, ${tx - dx * 0.55} ${ty}, ${tx - 9} ${ty}`, ax: tx, ay: ty })
  }
  arrows.value = out
}
let t: number | undefined
function schedule() {
  nextTick(layoutArrows)
  window.clearTimeout(t)
  t = window.setTimeout(layoutArrows, 350) // after code highlight transitions settle
}
let ro: ResizeObserver | undefined
onMounted(() => {
  schedule()
  ro = new ResizeObserver(schedule)
  if (root.value) ro.observe(root.value)
})
onBeforeUnmount(() => { ro?.disconnect(); window.clearTimeout(t) })
watch(items, schedule, { deep: false })
</script>

<template>
  <figure ref="root" class="phone-shot">
    <div ref="frame" class="frame" :style="{ height: height + 'px' }">
      <img :src="`/img/${src}.png`" :alt="caption ?? src" />
      <div
        v-for="m in items" :key="m.i" class="mark" :class="{ old: (m.at ?? 0) < clicks }"
        :style="{ left: m.box![0] + '%', top: m.box![1] + '%', width: m.box![2] + '%', height: m.box![3] + '%' }"
      >
      </div>
    </div>
    <figcaption v-if="caption">{{ caption }}</figcaption>
    <svg class="arrows" width="1" height="1">
      <g v-for="a in arrows" :key="a.id">
        <path :d="a.d" pathLength="1" class="line" />
        <polygon :points="`${a.ax - 11},${a.ay - 6} ${a.ax - 1},${a.ay} ${a.ax - 11},${a.ay + 6}`" class="head" />
      </g>
    </svg>
  </figure>
</template>

<style scoped>
.phone-shot { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; position: relative; }
.frame {
  position: relative; aspect-ratio: 1170 / 2532; border-radius: 18px; background: #0f172a; margin: 6px;
  overflow: hidden; box-shadow: 0 0 0 6px #0f172a, 0 8px 24px rgba(15, 23, 42, 0.28);
}
.frame img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; margin: 0; }
figcaption { font-size: 0.8rem; color: var(--muted); font-weight: 600; text-align: center; max-width: 14rem; }

.mark {
  position: absolute; box-sizing: border-box; border: 2.5px solid var(--m); border-radius: 6px;
  background: color-mix(in srgb, var(--m) 14%, transparent);
  animation: pop 0.35s ease-out both, pulse 1.8s ease-in-out 0.4s 2;
}
.mark.old { opacity: 0.45; animation: none; }
@keyframes pop { from { opacity: 0; transform: scale(1.25); } to { opacity: 1; transform: scale(1); } }
@keyframes pulse { 50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--m) 35%, transparent); } }

.arrows { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; z-index: 30; }
.line {
  fill: none; stroke: var(--m); stroke-width: 3; stroke-linecap: round;
  stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 0.6s ease-out forwards;
  filter: drop-shadow(0 1px 1.5px rgba(15, 23, 42, 0.4));
}
.head { fill: var(--m); opacity: 0; animation: fade 0.2s ease-out 0.5s forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes fade { to { opacity: 1; } }
</style>
