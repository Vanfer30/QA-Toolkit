#!/bin/bash

COVERAGE_FILE=$1

if [ ! -f "$COVERAGE_FILE" ]; then
  echo "❌ Error: File not found - $COVERAGE_FILE"
  exit 1
fi

# ✅ Top-level summary
SUMMARY=$(jq -r '
  .total 
  | to_entries[] 
  | select(.value.pct != null) 
  | "\(.key | ascii_upcase): \(.value.pct)% covered"
' "$COVERAGE_FILE")

# ✅ Metrics under threshold
LOW_COVERAGE=$(jq -r '
  .total 
  | to_entries[] 
  | select(.value.pct != null and .value.pct < 80) 
  | "\(.key | ascii_upcase) is below threshold at \(.value.pct)%"
' "$COVERAGE_FILE")

# ✅ 3 files with lowest line coverage (exclude total, require lines.pct)
WORST_FILES=$(jq -r '
  to_entries
  | map(select(.key != "total" and .value.lines.pct != null))
  | sort_by(.value.lines.pct)
  | .[:3]
  | map("\(.key): \(.value.lines.pct)% line coverage")
  | .[]
' "$COVERAGE_FILE")

# ✅ Build final report
PROMPT="📊 **Test Coverage Summary**\n\n$SUMMARY"

if [ -n "$LOW_COVERAGE" ]; then
  PROMPT+="\n\n⚠️ **Areas Below Target Coverage (80%)**\n$LOW_COVERAGE"
fi

if [ -n "$WORST_FILES" ]; then
  PROMPT+="\n\n📉 **Files with Lowest Line Coverage**\n$WORST_FILES"
fi

PROMPT+="\n\n💡 _Please suggest areas that may require additional unit or integration tests._"

# ✅ Output to terminal and markdown file
echo -e "::group::AI Coverage Summary"
echo -e "$PROMPT"
echo -e "::endgroup::"

echo -e "$PROMPT" > .gpt-comment.md
