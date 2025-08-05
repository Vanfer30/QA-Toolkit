#!/bin/bash
LOG_FILE=$1
if [[ -f "$LOG_FILE" ]]; then
  LOG_OUTPUT=$(./scripts/prompt-runner.sh prompts/flaky-debugger.txt "$(cat "$LOG_FILE")")
  echo "### 🐛 AI Test Log Analysis" > .gpt-log-summary.txt
  echo "$LOG_OUTPUT" >> .gpt-log-summary.txt
fi
