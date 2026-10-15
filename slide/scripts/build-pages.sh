#!/usr/bin/env bash
# Build the public (GitHub Pages) version of the deck.
#   scripts/build-pages.sh /course-playwright/
# The public build leaves out the private muan-companion addon (it needs a local
# path and a sync server) and uses fallback/StepCommand.vue instead.
set -euo pipefail
cd "$(dirname "$0")/.."
BASE="${1:-/}"

trap 'rm -f slides-public.md components/StepCommand.vue' EXIT

# same deck, minus the `addons:` list in the headmatter
awk '/^addons:/{skip=1; next} skip && /^  - /{next} {skip=0; print}' slides.md > slides-public.md
cp fallback/StepCommand.vue components/StepCommand.vue

npx slidev build slides-public.md --base "$BASE" --out dist
cp dist/index.html dist/404.html   # SPA deep links (/course-playwright/12) on Pages
