<!--
Public-site stand-in for the muan-companion addon's <StepCommand>: shows the
command with a Copy button, no sync server needed. scripts/build-pages.sh copies
it into components/ for the GitHub Pages build only; local decks keep using the
addon's version.
-->
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ command?: string }>()
const copied = ref(false)

async function onCopy() {
  if (!props.command) return
  try {
    await navigator.clipboard.writeText(props.command)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* clipboard blocked: the text can still be selected by hand */
  }
}
</script>

<template>
  <div class="step-command">
    <code>{{ command }}</code>
    <button v-if="command" @click="onCopy">{{ copied ? 'Copied' : 'Copy' }}</button>
  </div>
</template>

<style scoped>
.step-command {
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  border: 1px solid var(--rule); border-radius: 8px; padding: 0.5rem 0.8rem; margin: 0.6rem 0;
}
.step-command code { font-size: 1rem; word-break: break-all; }
.step-command button {
  border: 1px solid var(--rule); border-radius: 6px; padding: 0.15rem 0.7rem; font-size: 0.85rem; cursor: pointer;
}
</style>
