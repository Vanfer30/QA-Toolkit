#!/bin/bash
COVERAGE_FILE=$1

if [ ! -f "$COVERAGE_FILE" ]; then
  echo "❌ Error: File not found - $COVERAGE_FILE"
  exit 1
fi

# Extract top-level totals using jq
SUMMARY=$(jq -r '
  .total | 
  to_entries[] | 
  "\(.key | ascii_upcase): \(.value.pct)% covered"
' "$COVERAGE_FILE")

# Optional: Extract low-coverage thresholds
LOW_COVERAGE=$(jq -r '
  .total | 
  to_entries[] | 
  select(.value.pct < 80) | 
  "\(.key | ascii_upcase) is below threshold at \(.value.pct)%"
' "$COVERAGE_FILE")

# Combine into a GPT prompt
PROMPT="📊 **Test Coverage Summary**\n\n$SUMMARY"

if [ -n "$LOW_COVERAGE" ]; then
  PROMPT+="\n\n⚠️ **Areas Below Target Coverage (80%)**\n$LOW_COVERAGE"
fi

PROMPT+="\n\nPlease suggest areas that may require additional unit or integration tests."

echo -e "$PROMPT"
