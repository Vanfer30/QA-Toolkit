#!/bin/bash
COVERAGE_FILE=$1

jq . "$COVERAGE_FILE" | ./scripts/prompt-runner.sh prompts/coverage-analyzer.txt