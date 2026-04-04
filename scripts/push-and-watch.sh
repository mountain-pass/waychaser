#!/usr/bin/env bash
set -euo pipefail

echo "Pushing to origin main..."
git push origin HEAD:main

echo ""
echo "Waiting for Build workflow..."

# Wait for a new workflow run triggered by our push
for i in $(seq 1 20); do
  sleep 3
  RUN_ID=$(gh run list --workflow=build-and-publish.yml --branch=main --limit=1 --json databaseId,status --jq '.[] | select(.status != "completed") | .databaseId')
  if [ -n "$RUN_ID" ]; then
    break
  fi
  # If no in-progress run after 15s, grab the latest (may have completed fast)
  if [ "$i" -ge 5 ]; then
    RUN_ID=$(gh run list --workflow=build-and-publish.yml --branch=main --limit=1 --json databaseId --jq '.[0].databaseId')
    break
  fi
done

if [ -z "$RUN_ID" ]; then
  echo "Could not find workflow run. Check https://github.com/mountain-pass/waychaser/actions"
  exit 1
fi

echo "Build workflow: https://github.com/mountain-pass/waychaser/actions/runs/$RUN_ID"
echo ""

if gh run watch "$RUN_ID" --exit-status; then
  echo ""
  echo "Pipeline passed."
else
  echo ""
  echo "Pipeline failed. Check: https://github.com/mountain-pass/waychaser/actions/runs/$RUN_ID"
  exit 1
fi

# Check if publish job ran
PUBLISH_CONCLUSION=$(gh run view "$RUN_ID" --json jobs --jq '.jobs[] | select(.name == "publish") | .conclusion' 2>/dev/null)
if [ "$PUBLISH_CONCLUSION" = "success" ]; then
  NEW_VERSION=$(gh run view "$RUN_ID" --log 2>/dev/null | grep "PACKAGE_VERSION=" | grep -v "^$" | tail -1 | sed 's/.*PACKAGE_VERSION=//')
  echo ""
  echo "Published to npm. New version: ${NEW_VERSION:-check npm}"
fi
