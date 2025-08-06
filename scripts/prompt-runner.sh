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

# Load and combine prompt + input
PROMPT=$(cat "$PROMPT_FILE")
INPUT=$(cat "$INPUT_FILE")
FULL_PROMPT="$PROMPT"$'\n\n'"$INPUT"

# Debug full prompt
echo "::group::🛠️ GPT Prompt Debug"
echo "$FULL_PROMPT"
echo "::endgroup::"

# Prepare JSON payload safely
JSON_PAYLOAD=$(jq -n \
  --arg model "gpt-4o" \
  --argjson messages "$(jq -n --arg content "$FULL_PROMPT" '[{ "role": "user", "content": $content }]')" \
  '{
    model: $model,
    messages: $messages,
    temperature: 0.3
  }'
)

# Debug final JSON payload
echo "::group::🧪 Final JSON Payload"
echo "$JSON_PAYLOAD" | jq .
echo "::endgroup::"

# Call OpenAI API
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

# Extract markdown content
COMMENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

# Print comment and save to file
echo "::group::AI Coverage Summary"
echo "$COMMENT"
echo "::endgroup::"

echo "$COMMENT" > .gpt-comment.md

# Fail if response was empty
if [[ "$COMMENT" == "null" || -z "$COMMENT" ]]; then
  echo "❌ GPT response was null or empty."
  exit 1
fi
