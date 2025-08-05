#!/bin/bash
COVERAGE_FILE=$1

if [ ! -f "$COVERAGE_FILE" ]; then
  echo "❌ Error: File not found - $COVERAGE_FILE"
  exit 1
fi

# Top-level summary
SUMMARY=$(jq -r '
  .total | 
  to_entries[] | 
  "\(.key | ascii_upcase): \(.value.pct)% covered"
' "$COVERAGE_FILE")

# Under-threshold metrics (e.g. branches under 80%)
LOW_COVERAGE=$(jq -r '
  .total | 
  to_entries[] | 
  select(.value.pct < 80) | 
  "\(.key | ascii_upcase) is below threshold at \(.value.pct)%"
' "$COVERAGE_FILE")

# Top 3 files with lowest line coverage
WORST_FILES=$(jq -r '
  to_entries 
  | map(select(.key != "total"))
  | sort_by(.value.lines.pct)
  | .[:3]
  | map("\(.key): \(.value.lines.pct)% line coverage")
  | .[]
' "$COVERAGE_FILE")

# Final prompt
PROMPT="📊 **Test Coverage Summary**\n\n$SUMMARY"

if [ -n "$LOW_COVERAGE" ]; then
  PROMPT+="\n\n⚠️ **Areas Below Target Coverage (80%)**\n$LOW_COVERAGE"
fi

if [ -n "$WORST_FILES" ]; then
  PROMPT+="\n\n📉 **Files with Lowest Line Coverage**\n$WORST_FILES"
fi

PROMPT+="\n\nPlease suggest areas that may require additional unit or integration tests."

echo -e "$PROMPT"
