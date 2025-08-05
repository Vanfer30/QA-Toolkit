#!/bin/bash
COVERAGE_FILE=$1

OUTPUT=$(./scripts/analyze-coverage.sh "$COVERAGE_FILE")
echo "::group::AI Coverage Summary"
echo "$OUTPUT"
echo "::endgroup::"