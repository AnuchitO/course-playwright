import { defineConfig } from 'vite'

export default defineConfig({
  // Slidev 53 + Vite 8: lightningcss rejects one of Slidev's own generated rules
  // during `slidev build`. Skipping CSS minification works around it.
  build: { cssMinify: false },
  // slidev-addon-muan-companion pulls in socket.io-client -> debug (CommonJS).
  // Without pre-bundling, the browser fails with "does not provide an export named 'default'".
  optimizeDeps: { include: ['debug'] },
  // `slidev ... --remote --tunnel` already sets allowedHosts: ['.trycloudflare.com']
  // itself (packages/slidev/node/cli.ts), but that wildcard match has been
  // observed to intermittently still reject a real *.trycloudflare.com host
  // ("Blocked request... add to server.allowedHosts") - a Vite/Slidev-side
  // flake, not anything specific to this deck. Disabling the host check
  // outright is the reliable fix: every URL this dev server is reachable at
  // (the quick-tunnel hostname) is already ephemeral and random per run, so
  // there's no real DNS-rebinding exposure here to protect against.
  server: { allowedHosts: true },
})
