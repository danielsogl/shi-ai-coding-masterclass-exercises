#!/usr/bin/env bash
# Stop hook: don't let a turn end until typecheck and the tests affected by
# the current change pass. Exit 2 blocks the stop; stderr goes back to
# Claude so it can act on the failure.
#
# Uses `test:affected` (vitest run --changed), not the full suite: this repo
# ships with one known-broken baseline test and one flaky test (see
# exercises/E6-real-world-constraints.md) that are not this hook's job to
# fix. A Stop hook that fails a turn on pre-existing, unrelated breakage
# trains you to silence the hook instead of trusting it.
set -euo pipefail
cd "$CLAUDE_PROJECT_DIR"

if ! npm run --silent typecheck; then
  echo "typecheck failed — fix the errors above before stopping." >&2
  exit 2
fi

if ! npm run --silent test:affected; then
  echo "affected tests failed — fix the failures above before stopping." >&2
  exit 2
fi

exit 0
