#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"

COVERING=${npm_lifecycle_event#cover:}
COVER_NAME=${COVERING//:/-}
COVER_NAME_ALL=${COVER_NAME//browser-api-*-/browser-api-}

COVERAGE=1 nyc \
    --nycrc-path \
    ".nycrc-${COVER_NAME_ALL}.yml" \
    --clean \
    --temp-dir "coverage/${COVER_NAME}/.nyc_output" \
    --report-dir "coverage/${COVER_NAME}" \
    npm run "test:${COVERING}"