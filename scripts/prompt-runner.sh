#!/bin/bash
PROMPT_FILE=$1
INPUT_FILE=$2

if [[ -z "$OPENAI_API_KEY" ]]; then
  echo "❌ Set your OPENAI_API_KEY environment variable first."
  exit 1
fi

if [[ ! -f "$PROMPT_FILE" ]] || [[ ! -f "$INPUT_FILE" ]]; then
  echo "❌ Missing input: prompt or data file not found."
  exit 1
fi

# Load prompt and data
PROMPT=$(cat "$PROMPT_FILE")
INPUT_DATA=$(cat "$INPUT_FILE")

# Combine into a single ChatGPT message
FULL_PROMPT="$PROMPT\n\n$INPUT_DATA"

# Call OpenAI API and extract markdown content
RESPONSE=$(curl https://api.openai.com/v1/chat/completions \
  -s \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"gpt-4o\",
    \"messages\": [{\"role\": \"user\", \"content\": \"$FULL_PROMPT\"}],
    \"temperature\": 0.3
  }")

COMMENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

# Output to GitHub PR comment file
echo -e "::group::AI Coverage Summary"
echo "$COMMENT"
echo -e "::endgroup::"

echo "$COMMENT" > .gpt-comment.md
