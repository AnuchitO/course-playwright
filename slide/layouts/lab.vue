<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
</script>

<template>
  <div class="slidev-layout lab">
    <div class="head">
      <span class="tag">5 · HANDS-ON LAB {{ fm.lab }}</span>
      <span class="timebox">&#9201; {{ fm.minutes }} min time box</span>
    </div>
    <div class="grid">
      <div><h3>Task</h3><slot /></div>
      <div><h3>Done when</h3><slot name="criteria" /></div>
    </div>
    <div class="hint"><b>Hint:</b> <slot name="hint" /></div>
    <div v-click class="recap"><span class="tag">6 · RECAP</span><slot name="recap" /></div>
    <div v-if="fm.solution" class="stuck">Stuck? The solution is in <code>{{ fm.solution }}</code> &middot; add it to your folder: <code>git checkout lab-{{ fm.lab }}-solution -- qoomlee/app/web/e2e</code></div>
    <div v-else class="stuck">Stuck? The solution is on branch <code>lab-{{ fm.lab }}-solution</code> &middot; <code>workshop/solutions/lab-{{ fm.lab }}</code> &middot; instructions: <code>workshop/labs/lab-{{ fm.lab }}.md</code></div>
  </div>
</template>

<style scoped>
.lab { display: flex; flex-direction: column; height: 100%; gap: 0.7rem; }
.head { display: flex; align-items: center; gap: 1rem; }
.timebox { margin-left: auto; font-size: 1.4rem; font-weight: 800; color: var(--m); }
.grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; }
h3 { color: var(--m); font-weight: 800; margin: 0 0 0.2rem; }
.hint { background: var(--hint-bg); border-left: 6px solid var(--m); padding: 0.5rem 0.9rem; border-radius: 6px; }
.recap { border-top: 3px solid var(--m); padding-top: 0.4rem; font-size: 1.05rem; }
.recap :deep(ul) { margin: 0.2rem 0 0; }
.stuck { margin-top: auto; font-size: 0.85rem; color: var(--muted); }
.lab .tag { align-self: center; }
.lab :deep(li), .lab :deep(p) { line-height: 1.4; }
.hint :deep(p) { display: inline; margin: 0; }
.lab :deep(ul) { list-style: none; padding-left: 0; }
</style>
