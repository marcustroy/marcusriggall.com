#!/usr/bin/env bash
# Prints the /resume page to public/resume.pdf using headless Google Chrome.
# Run it with the dev server (pnpm dev) or a production server (pnpm start) up,
# then commit the updated PDF. Re-run whenever src/app/resume/page.tsx changes.
set -euo pipefail

URL="${1:-http://localhost:3000/resume}"
CHROME="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/resume.pdf"

if ! curl -sf -o /dev/null "$URL"; then
  echo "Can't reach $URL. Start the app first (pnpm dev)." >&2
  exit 1
fi

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT" "$URL" 2>/dev/null

echo "Wrote $OUT"
