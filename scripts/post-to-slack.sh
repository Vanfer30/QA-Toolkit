#!/bin/bash
TITLE=$1
MESSAGE=$2

if [[ -z "$SLACK_WEBHOOK_URL" ]]; then
  echo "Set your SLACK_WEBHOOK_URL environment variable first."
  exit 1
fi

payload="{
  \"text\": \":robot_face: *$TITLE*\\n$MESSAGE\"
}"

curl -X POST -H 'Content-type: application/json' --data "$payload" "$SLACK_WEBHOOK_URL"