#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"

rm -rf coverage
npm-run-all \
    --sequential \
    "${npm_lifecycle_event}:*"

scripts/report-cover.sh