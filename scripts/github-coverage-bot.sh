#!/bin/bash
COVERAGE_FILE=$1
OUTPUT=$(./scripts/analyze-coverage.sh "$COVERAGE_FILE")

echo "::group::AI Coverage Summary"
echo "$OUTPUT"
echo "::endgroup::"

echo "### 🤖 AI QA Coverage Summary" > .gpt-comment.md
echo "$OUTPUT" >> .gpt-comment.md

if [ -f .gpt-log-summary.txt ]; then
  echo -e "\n---\n" >> .gpt-comment.md
  cat .gpt-log-summary.txt >> .gpt-comment.md
fi
