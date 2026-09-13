#!/usr/bin/env bash
# PreToolUse hook (matcher: Edit|Write): blocks edits to test files.
#
# The golden rule (M3e): an agent must never modify the tests that verify
# its own work. If the agent believes a test is wrong, that's a message for
# a human, not a same-session edit.
set -euo pipefail

input=$(cat)
tool_name=$(jq -r '.tool_name' <<<"$input")
file_path=$(jq -r '.tool_input.file_path // empty' <<<"$input")

if [[ "$tool_name" != "Edit" && "$tool_name" != "Write" ]]; then
  exit 0
fi

if [[ "$file_path" =~ \.test\.ts$ ]]; then
  jq -n --arg reason "Agents may not edit test files ($file_path). Ask a human to change the test, or change the implementation instead." '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 2
fi

exit 0
