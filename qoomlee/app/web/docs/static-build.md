# Static build (`output: "export"`)

`next.config.ts` builds this app as a static export:

```ts
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};
```

## What `bun run build` produces

`output: "export"` compiles every route to plain static files in
`app/web/out/` — there is no Next.js server, no API routes, and no
middleware in this build. Concretely:

- One real `.html` file per route (`out/flights/index.html`,
  `out/bookings/detail/index.html`, …) — not a single-page-app shell that
  client-side-routes everything. `trailingSlash: true` is what makes a
  route folder resolve to `<route>/index.html`.
- A real `out/404.html`, generated from the app's not-found page — a
  missing/mistyped URL should be handled as an actual 404, not silently
  fall back to the homepage the way a typical SPA-fallback rewrite would.
- Content-hashed, cacheable-forever assets under `out/_next/static/`.
- `images.unoptimized: true` is required alongside `output: "export"` —
  `next/image`'s optimization pipeline needs a server, which doesn't exist
  in this build, so it's disabled and images are served as-is.

Because it's just files, `out/` can be served by any static file host or
web server with no server-side runtime — no Node process, no container
required for the app itself.

## Environment variables are baked in at build time

`output: "export"` has no server, so all `NEXT_PUBLIC_*` env vars are
inlined into the static JS bundle at `bun run build` time — there is **no
runtime override** the way a server deployment would have. This build
bakes in:

- `NEXT_PUBLIC_QOOMLEE_API_URL`
- `NEXT_PUBLIC_PAYMENT_API_URL`
- `NEXT_PUBLIC_ENABLE_TEST_SCENARIOS`
- `NEXT_PUBLIC_ENABLE_ALT_PAYMENT_METHODS`

Locally these come from `app/web/.env.local`; other environments should use
their own `.env.production` file or CI secrets. **A separate `bun run
build` is required per environment** (staging, prod, ...) with the correct
values in place — there's no way to point one build at a different backend
after the fact.

## Security headers

`next.config.ts` intentionally has no `headers()` function — Next.js warns
`Specified "headers" will not automatically work with "output: export"`
and never actually applies them to the exported files, since there's no
server to run them against. Equivalent headers (CSP, `X-Frame-Options`,
etc.) need to be applied wherever `out/` ends up being served from (a CDN,
a reverse proxy in front of a static file server, etc.) — that's a hosting
concern, not something this config file can express.
