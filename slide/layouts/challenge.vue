<template>
  <div class="slidev-layout challenge">
    <div class="tag">4 · THE NEXT CHALLENGE</div>
    <div class="kicker">But now we have a new problem...</div>
    <div class="body"><slot /></div>
    <div v-if="$frontmatter.solution" class="stuck">Stuck? The way out is in <code>{{ $frontmatter.solution }}</code></div>
  </div>
</template>

<style scoped>
.challenge { display: flex; flex-direction: column; justify-content: center; height: 100%; gap: 1rem; background: #0f172a; color: #f8fafc; }
.kicker { font-size: 1.2rem; color: #94a3b8; }
.body { font-size: 2.2rem; font-weight: 800; line-height: 1.25; }
.body :deep(code) { color: #fbbf24 !important; }
.challenge .tag { align-self: flex-start; background: #475569; }
.stuck { margin-top: auto; font-size: 0.85rem; color: #94a3b8; }
.stuck :deep(code) { color: #fbbf24 !important; }
.body :deep(p) { line-height: 1.35 !important; margin: 0; }
</style>
