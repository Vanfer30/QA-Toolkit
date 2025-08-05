#!/bin/bash

MESSAGE_FILE=".gpt-comment.md"

if [ ! -f "$MESSAGE_FILE" ]; then
  echo "❌ No GPT comment file to send to Slack."
  exit 1
fi

if [ -z "$SLACK_WEBHOOK_URL" ]; then
  echo "❌ SLACK_WEBHOOK_URL is not set."
  exit 1
fi

TEXT=$(cat "$MESSAGE_FILE")

PAYLOAD=$(jq -n --arg text "$TEXT" '{text: $text}')

curl -X POST -H 'Content-type: application/json'      --data "$PAYLOAD" "$SLACK_WEBHOOK_URL"
