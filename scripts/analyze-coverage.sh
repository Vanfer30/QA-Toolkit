#!/bin/bash
COVERAGE_FILE=$1
THRESHOLD=80

if [ ! -f "$COVERAGE_FILE" ]; then
  echo "❌ Error: File not found - $COVERAGE_FILE"
  exit 1
fi

# Generate top-level summary, ignoring 'branchesTrue'
SUMMARY=$(jq -r '
  .total 
  | to_entries[] 
  | select(.key != "branchesTrue" and .value.pct != null) 
  | "\(.key | ascii_upcase): \(.value.pct)% covered"
' "$COVERAGE_FILE")

# Detect low coverage items below threshold (excluding 'branchesTrue')
LOW_COVERAGE=$(jq -r --argjson threshold "$THRESHOLD" '
  .total 
  | to_entries[] 
  | select(.key != "branchesTrue" and .value.pct < $threshold) 
  | "\(.key | ascii_upcase) is below threshold at \(.value.pct)%"
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

# Build final markdown message
PROMPT="📊 **Test Coverage Summary**\n\n$SUMMARY"

if [ -n "$LOW_COVERAGE" ]; then
  PROMPT+="\n\n⚠️ **Areas Below Target Coverage ($THRESHOLD%)**\n$LOW_COVERAGE"
fi

if [ -n "$WORST_FILES" ]; then
  PROMPT+="\n\n📉 **Files with Lowest Line Coverage**\n$WORST_FILES"
fi

PROMPT+="\n\n💡 _Please review these metrics and consider adding additional unit or integration tests where coverage is lacking._"

# Output for GitHub Actions UI
echo "::group::AI Coverage Summary"
echo -e "$PROMPT"
echo "::endgroup::"

# Output to markdown file for PR comment
echo -e "$PROMPT" > .gpt-comment.md
