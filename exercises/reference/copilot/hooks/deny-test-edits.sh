#!/usr/bin/env bash
# preToolUse hook for GitHub Copilot (CLI + cloud agent): denies edits to
# test files. Same golden-rule policy as the Claude Code
# deny-test-edits.sh next door, translated to Copilot's hook schema
# (docs.github.com/en/copilot/reference/hooks-reference, checked 2026-09).
#
# Copilot's preToolUse decision is conveyed entirely through the JSON
# printed to stdout (permissionDecision: allow|deny|ask), NOT through the
# exit code the way Claude Code's hook uses exit 2 — this script always
# exits 0. Every failure mode below fails CLOSED (denies) rather than
# crashing open.
set -uo pipefail

deny() {
  jq -n --arg reason "$1" '{permissionDecision: "deny", permissionDecisionReason: $reason}'
  exit 0
}

allow() {
  echo '{"permissionDecision": "allow"}'
  exit 0
}

if ! command -v jq >/dev/null 2>&1; then
  deny "jq is required but not installed (brew install jq / apt install jq) — denying to be safe."
fi

input=$(cat)

if ! jq -e '.' >/dev/null 2>&1 <<<"$input"; then
  deny "could not parse hook input as JSON — denying to be safe."
fi

tool_name=$(jq -r '.toolName // empty' <<<"$input")
# File-operation tools per current docs: create, edit, view (read-only,
# not relevant here). toolArgs' shape isn't pinned down by that doc beyond
# "unknown" — try the field names actually used for the create/edit tools.
file_path=$(jq -r '.toolArgs.path // .toolArgs.file // .toolArgs.file_path // empty' <<<"$input")

case "$tool_name" in
  create | edit) ;;
  *) allow ;;
esac

if [[ "$file_path" =~ \.test\.ts$ ]]; then
  deny "Agents may not edit test files ($file_path). Ask a human to change the test, or change the implementation instead."
fi

allow
