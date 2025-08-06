#!/bin/bash
COVERAGE_FILE=$1

if [[ -z "$COVERAGE_FILE" ]]; then
  echo "❌ No coverage file specified."
  exit 1
fi

# Run analyzer
OUTPUT=$(./scripts/analyze-coverage.sh "$COVERAGE_FILE")

# Save formatted markdown to file
echo "::group::AI Coverage Summary"
echo "$OUTPUT"
echo "::endgroup::"

echo "$OUTPUT" > .gpt-comment.md  # ✅ GitHub PR comment body
