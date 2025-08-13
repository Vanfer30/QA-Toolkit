#!/bin/bash
TITLE=$1
MESSAGE=$2

# SLACK_WEBHOOK_URL removed for security - add this secret in GitHub if needed
# if [[ -z "$SLACK_WEBHOOK_URL" ]]; then
#   echo "Set your SLACK_WEBHOOK_URL environment variable first."
#   exit 1
# fi

payload="{
  \"text\": \":robot_face: *$TITLE*\\n$MESSAGE\"
}"

# curl -X POST -H 'Content-type: application/json' --data "$payload" "$SLACK_WEBHOOK_URL"
echo "Slack notification disabled - add SLACK_WEBHOOK_URL secret in GitHub if needed"