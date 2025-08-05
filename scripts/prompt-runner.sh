#!/bin/bash
PROMPT_FILE=$1
INPUT_DATA=$(cat "$2")

if [[ -z "$OPENAI_API_KEY" ]]; then
  echo "Set your OPENAI_API_KEY environment variable first."
  exit 1
fi

PROMPT=$(cat "$PROMPT_FILE")
FULL_PROMPT="$PROMPT\n\n$INPUT_DATA"

curl https://api.openai.com/v1/chat/completions \
  -s \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "'"$FULL_PROMPT"'"}],
    "temperature": 0.3
  }' | jq -r '.choices[0].message.content'



  