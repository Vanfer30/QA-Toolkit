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

# Combine prompt + data into one raw input and pass through jq for escaping
FULL_PROMPT=$(cat "$PROMPT_FILE" "$INPUT_FILE")

# Debug raw prompt input
echo "::group::🛠️ GPT Prompt Debug"
echo "$FULL_PROMPT"
echo "::endgroup::"

# Safely encode the message content using jq -Rs (raw string, escaped JSON)
ESCAPED_CONTENT=$(printf "%s" "$FULL_PROMPT" | jq -Rs .)

# Build final JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": $ESCAPED_CONTENT
    }
  ],
  "temperature": 0.3
}
EOF
)

# Debug final JSON payload
echo "::group::🧪 Final JSON Payload"
echo "$JSON_PAYLOAD" | jq . || echo "❌ INVALID JSON!"
echo "::endgroup::"
echo "::endgroup::"

# Send request to OpenAI API
RESPONSE=$(curl -s https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD"
)

# Debug raw API response
echo "::group::🛠️ GPT Raw API Response"
echo "$RESPONSE" | jq .
echo "::endgroup::"

# Extract final comment
COMMENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

echo "::group::AI Coverage Summary"
echo "$COMMENT"
echo "::endgroup::"

# Save to file
echo "$COMMENT" > .gpt-comment.md

# Fail if comment was null or empty
if [[ "$COMMENT" == "null" || -z "$COMMENT" ]]; then
  echo "❌ GPT response was null or empty."
  exit 1
fi
