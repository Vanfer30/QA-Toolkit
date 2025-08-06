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

# Read and combine prompt + input
PROMPT=$(cat "$PROMPT_FILE")
INPUT_DATA=$(cat "$INPUT_FILE")
FULL_PROMPT="$PROMPT"$'\n\n'"$INPUT_DATA"

# Show prompt debug
echo "::group::🛠️ GPT Prompt Debug"
echo "$FULL_PROMPT"
echo "::endgroup::"

# ✅ Build JSON safely
JSON_PAYLOAD=$(jq -n \
  --arg model "gpt-4o" \
  --arg content "$FULL_PROMPT" \
  '{
    model: $model,
    messages: [ { role: "user", content: $content } ],
    temperature: 0.3
  }'
)

# 👇 Debug the final JSON payload
echo "::group::🧪 Final JSON Payload"
echo "$JSON_PAYLOAD" | jq .
echo "::endgroup::"

# 🔁 Make API request
RESPONSE=$(curl https://api.openai.com/v1/chat/completions \
  -s \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD"
)

# Show raw response
echo "::group::🛠️ GPT Raw API Response"
echo "$RESPONSE" | jq .
echo "::endgroup::"

# Extract and print comment
COMMENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

echo "::group::AI Coverage Summary"
echo "$COMMENT"
echo "::endgroup::"

# Save to file
echo "$COMMENT" > .gpt-comment.md

# Fail if no comment
if [[ "$COMMENT" == "null" || -z "$COMMENT" ]]; then
  echo "❌ GPT response was null or empty."
  exit 1
fi
