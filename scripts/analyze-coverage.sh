#!/bin/bash
COVERAGE_FILE=$1
./scripts/prompt-runner.sh prompts/coverage-analyzer.txt "$COVERAGE_FILE"
