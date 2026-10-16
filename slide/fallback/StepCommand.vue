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
}
</script>

<template>
  <div class="step-command">
    <div v-if="command && highlighted" class="step-command-code" v-html="highlighted" />
    <code v-else-if="command" class="step-command-code">{{ command }}</code>
    <div class="step-command-actions">
      <button v-if="command" type="button" class="step-command-button" @click="onCopy">
        {{ copied ? 'Copied' : 'Copy' }}
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
  padding: 0.25em 0.75em; border-radius: 6px; border: 1px solid rgba(128, 128, 128, 0.4);
  background: transparent; color: inherit; cursor: pointer; font-size: 0.85em;
}
</style>
