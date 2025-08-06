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

# Combine prompt + data
PROMPT=$(cat "$PROMPT_FILE")
INPUT_DATA=$(cat "$INPUT_FILE")
FULL_PROMPT="$PROMPT\n\n$INPUT_DATA"

echo "::group::🛠️ GPT Prompt Debug"
echo -e "$FULL_PROMPT"
echo "::endgroup::"


# Properly escape the content using jq
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

echo "::group::🛠️ GPT Raw API Response"
echo "$RESPONSE" | jq .
echo "::endgroup::"

COMMENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

# Output PR comment
echo -e "::group::AI Coverage Summary"
echo "$COMMENT"
echo -e "::endgroup::"

if [[ "$COMMENT" == "null" || -z "$COMMENT" ]]; then
  echo "❌ GPT response was null or empty."
  exit 1
fi

# Save for GH PR comment
echo "$COMMENT" > .gpt-comment.md

