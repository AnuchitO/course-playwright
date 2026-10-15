<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
const { $frontmatter: fm } = useSlideContext()
</script>

<template>
  <div class="slidev-layout module-title">
    <div class="num">{{ fm.module }}</div>
    <div class="body">
      <div class="tag">{{ fm.time }}</div>
      <h1>{{ fm.heading }}</h1>
      <div class="thai">{{ fm.thai }}</div>
      <p class="problem">{{ fm.problem }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.module-title { display: flex; align-items: center; gap: 3rem; height: 100%; }
.num { font-size: 15rem; font-weight: 900; line-height: 1; color: var(--m); opacity: 0.9; min-width: 14rem; text-align: center; }
.module-title :deep(.tag) { margin-bottom: 0.7rem; }
.thai { font-size: 1.6rem; color: var(--muted); margin: -0.2rem 0 1rem 1.2rem; }
.problem { font-size: 1.25rem; padding-left: 1.2rem; max-width: 34rem; }
:deep(h1) { font-size: 3rem; }
</style>
