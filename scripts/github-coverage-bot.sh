#!/bin/bash
COVERAGE_FILE=$1

  #if [[ -z "$COVERAGE_FILE" ]]; then
  #echo "❌ No coverage file specified."
  #exit 1
#fi

#chmod +x ./scripts/analyze-coverage.sh

OUTPUT=$(./scripts/analyze-coverage.sh "$COVERAGE_FILE")

echo "::group::AI Coverage Summary"
echo "$OUTPUT"
echo "::endgroup::"

#echo "$OUTPUT" > .gpt-comment.md  # ✅ Save the output



