#!/usr/bin/env bash
# Refuse a change that rewrites icons/ in bulk unless a commit says it meant to.
#
# A 1,300-file diff is technically visible in review and practically invisible:
# nobody reads it line by line. Since the source SVGs are not in this repo, a bad
# bulk write cannot be regenerated — only restored from git, and only if someone
# notices. So the block lives here, at a gate that actually stops the merge.
set -euo pipefail

THRESHOLD="${ICON_CHANGE_THRESHOLD:-20}"
TOKEN='[bulk-icons]'

if [ $# -ne 1 ]; then
  echo "usage: $0 <base-ref>" >&2
  exit 2
fi
base="$1"

changed=$(git diff --name-only "$base...HEAD" -- 'icons/*.tsx' | wc -l | tr -d ' ')

if [ "$changed" -le "$THRESHOLD" ]; then
  echo "icons/*.tsx changed: $changed (threshold $THRESHOLD) — ok"
  exit 0
fi

# Read the log into a variable rather than piping it. A matcher that stops at
# the first hit (`grep -q`) leaves git writing into a closed pipe: git dies with
# SIGPIPE, and `pipefail` then fails the pipeline even though the token matched.
# Past the 64 KB pipe buffer that turns the escape hatch into a refusal.
log=$(git log "$base..HEAD" --format=%B)

case "$log" in
  *"$TOKEN"*)
    echo "icons/*.tsx changed: $changed — acknowledged via $TOKEN"
    exit 0
    ;;
esac

cat >&2 <<MSG
Refusing: $changed icons/*.tsx files changed (threshold $THRESHOLD).

The SVGs these components were converted from are not in this repo, so a bulk
rewrite has no regeneration path — it can only be restored from git.

If this is intended (a converter change, a set-wide fix), put $TOKEN in one of
the commit messages. Check first that test/icons-geometry.test.tsx still passes:
it is what proves the shapes survived.
MSG
exit 1
