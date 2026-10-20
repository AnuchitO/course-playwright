<!--
Public-site stand-in for the muan-companion addon's <StepCommand>: same look
(Shiki-highlighted command with a Copy button) but no sync server, so there
is no Done button. scripts/build-pages.sh copies it
into components/ for the GitHub Pages build only; local decks (npm run dev)
keep using the addon's version.
-->
<script setup lang="ts">
import setupShiki from '@slidev/client/setup/shiki.ts'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{ command?: string }>()

const copied = ref(false)

// highlight with the deck's own Shiki setup (same light/dark themes as code blocks)
const highlighted = ref('')
async function highlight() {
  if (!props.command) {
    highlighted.value = ''
    return
  }
  try {
    const { shorthands, defaultHighlightOptions } = await setupShiki()
    highlighted.value = await shorthands.codeToHtml(props.command, { ...defaultHighlightOptions, lang: 'bash' })
  } catch (error) {
    console.error('[step-command] shiki highlight failed', error)
    highlighted.value = ''
  }
}
onMounted(highlight)
watch(() => props.command, highlight)

async function onCopy() {
  if (!props.command) return
  try {
    await navigator.clipboard.writeText(props.command)
  } catch (error) {
    console.error('[step-command] clipboard write failed', error)
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 1200)
}
</script>

<template>
  <div class="step-command">
    <div v-if="command && highlighted" class="step-command-code" v-html="highlighted" />
    <code v-else-if="command" class="step-command-code">{{ command }}</code>
    <div class="step-command-actions">
      <button v-if="command" type="button" class="step-command-button" :title="copied ? 'Copied' : 'Copy'" @click="onCopy">
        <!-- Phosphor clipboard / check-circle: the same icons as the code-block copy button -->
        <svg viewBox="0 0 256 256" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path v-if="copied" d="M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88" />
          <path v-else d="M200 32h-36.26a47.92 47.92 0 0 0-71.48 0H56a16 16 0 0 0-16 16v168a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m-72 0a32 32 0 0 1 32 32H96a32 32 0 0 1 32-32m72 184H56V48h26.75A47.9 47.9 0 0 0 80 64v8a8 8 0 0 0 8 8h80a8 8 0 0 0 8-8v-8a47.9 47.9 0 0 0-2.75-16H200Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.step-command {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.75em;
  margin: 0.75em 0; padding: 0.5em 0.75em;
  border: 1px solid rgba(128, 128, 128, 0.3); border-radius: 8px;
}
.step-command-code { flex: 1 1 auto; min-width: 0; overflow-x: auto; white-space: pre; }
.step-command-code :deep(pre) { margin: 0; padding: 0; background: transparent !important; overflow-x: auto; }
.step-command-code :deep(code) { background: transparent; white-space: pre; }
.step-command-actions { display: flex; gap: 0.5em; flex: 0 0 auto; }
.step-command-button {
  display: grid; place-items: center; padding: 0.3em; border-radius: 6px; border: none;
  background: transparent; color: inherit; cursor: pointer; opacity: 0.6;
}
.step-command-button:hover { opacity: 1; }
</style>
