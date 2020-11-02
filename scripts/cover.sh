#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"

COVERING=${npm_lifecycle_event#cover:}
COVER_NAME=${COVERING//:/-}
COVER_NAME_ALL_SAUCY=${COVER_NAME//browser-api-*-saucy/browser-api-saucy}

nyc \
    --nycrc-path \
    ".nycrc-${COVER_NAME_ALL_SAUCY}.yml" \
    --clean \
    --temp-dir "coverage/${COVER_NAME}/.nyc_output" \
    --report-dir "coverage/${COVER_NAME}" \
    npm run "test:${COVERING}"