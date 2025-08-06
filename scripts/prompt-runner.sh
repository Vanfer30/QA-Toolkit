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

# Combine into a single prompt
FULL_PROMPT="$PROMPT\n\n$INPUT_DATA"

# 🧪 DEBUG: Show prompt being sent
echo "::group::🛠️ GPT Prompt Debug"
echo "$FULL_PROMPT"
echo "::endgroup::"

# Call OpenAI API using a here-doc with safe escaping
RESPONSE=$(curl https://api.openai.com/v1/chat/completions \
  -s \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d @- <<EOF
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": $(jq -Rs <<< "$FULL_PROMPT")
    }
  ],
  "temperature": 0.3
}
EOF
)

# 🧪 DEBUG: Show raw API response
echo "::group::🛠️ GPT Raw API Response"
echo "$RESPONSE"
echo "::endgroup::"

# Extract response content
COMMENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

# Check if null
if [[ "$COMMENT" == "null" || -z "$COMMENT" ]]; then
  echo "❌ GPT response was null or empty."
  exit 1
fi

# Output to terminal and file for PR comment
echo "::group::AI Coverage Summary"
echo "$COMMENT"
echo "::endgroup::"

echo "$COMMENT" > .gpt-comment.md
