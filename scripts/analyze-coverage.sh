#!/bin/bash
COVERAGE_FILE=$1

if [[ -z "$OPENAI_API_KEY" ]]; then
  echo "❌ Set your OPENAI_API_KEY environment variable first."
  exit 1
fi

if [[ ! -f "$COVERAGE_FILE" ]]; then
  echo "❌ File not found: $COVERAGE_FILE"
  exit 1
fi

COVERAGE_DATA=$(cat "$COVERAGE_FILE")
PROMPT="Please provide a QA test coverage summary based on this coverage report:\n\n$COVERAGE_DATA"

curl https://api.openai.com/v1/chat/completions \
  -s \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "'"$PROMPT"'"}],
    "temperature": 0.3
  }' | jq -r '.choices[0].message.content'