<template>
  <div class="slidev-layout story">
    <div class="tag">1 · THE PROBLEM</div>
    <div class="scenario"><slot /></div>
    <div class="naive">
      <div class="tag" style="background:#64748b">2 · THE NAIVE WAY</div>
      <div class="naive-body"><slot name="naive" /></div>
    </div>
  </div>
</template>

<style scoped>
.story { display: flex; flex-direction: column; height: 100%; gap: 0.8rem; }
.scenario { font-size: 1.9rem; font-weight: 700; line-height: 1.3; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.naive { border-top: 2px dashed var(--rule); padding-top: 0.6rem; }
.naive-body { font-size: 1.1rem; }
.story .tag { align-self: flex-start; }
.scenario :deep(p), .naive-body :deep(p), .naive-body :deep(li) { line-height: 1.4 !important; margin: 0.3rem 0; }
</style>
