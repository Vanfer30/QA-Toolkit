#!/bin/bash
COVERAGE_FILE=$1

if [ ! -f "$COVERAGE_FILE" ]; then
  echo "❌ Error: File not found - $COVERAGE_FILE"
  exit 1
fi

# Pipe JSON data to GPT for analysis
jq . "$COVERAGE_FILE" | ./scripts/prompt-runner.sh prompts/coverage-analyzer.txt
