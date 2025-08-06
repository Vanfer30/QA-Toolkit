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

# Read prompt and input safely
PROMPT=$(cat "$PROMPT_FILE")
INPUT=$(cat "$INPUT_FILE")
FULL_PROMPT="$PROMPT\n\n$INPUT"

echo "::group::🛠️ GPT Prompt Debug"
echo -e "$FULL_PROMPT"
echo "::endgroup::"

# ✅ Build JSON safely using jq
JSON_PAYLOAD=$(jq -n \
  --arg model "gpt-4o" \
  --arg content "$FULL_PROMPT" \
  '{
    model: $model,
    messages: [{ "role": "user", "content": $content }],
    temperature: 0.3
  }')

# 🧠 Send to OpenAI
RESPONSE=$(curl -s https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

echo "::group::🛠️ GPT Raw API Response"
echo "$RESPONSE" | jq .
echo "::endgroup::"

# 📦 Extract markdown content
COMMENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

echo "::group::AI Coverage Summary"
echo "$COMMENT"
echo "::endgroup::"

# 💬 Write to file for GitHub PR comment
echo "$COMMENT" > .gpt-comment.md

if [[ "$COMMENT" == "null" || -z "$COMMENT" ]]; then
  echo "❌ GPT response was null or empty."
  exit 1
fi
