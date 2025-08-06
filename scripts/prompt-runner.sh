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

# Read prompt and input data
PROMPT=$(cat "$PROMPT_FILE")
INPUT_DATA=$(cat "$INPUT_FILE")
FULL_PROMPT="$PROMPT\n\n$INPUT_DATA"

echo "::group::🛠️ GPT Prompt Debug"
echo -e "$FULL_PROMPT"
echo "::endgroup::"

# ✅ Build safe JSON using jq to avoid breaking quotes
JSON_PAYLOAD=$(jq -n \
  --arg model "gpt-4o" \
  --arg content "$FULL_PROMPT" \
  '{
    model: $model,
    messages: [{ "role": "user", "content": $content }],
    temperature: 0.3
  }')

# 🔁 Call OpenAI API
RESPONSE=$(curl https://api.openai.com/v1/chat/completions \
  -s \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

echo "::group::🛠️ GPT Raw API Response"
echo "$RESPONSE" | jq .
echo "::endgroup::"

# Extract comment from response
COMMENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

echo "::group::AI Coverage Summary"
echo "$COMMENT"
echo "::endgroup::"

# Save to file
echo "$COMMENT" > .gpt-comment.md

# Fail if GPT failed
if [[ "$COMMENT" == "null" || -z "$COMMENT" ]]; then
  echo "❌ GPT response was null or empty."
  exit 1
fi
