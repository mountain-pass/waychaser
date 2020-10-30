#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"

rm -rf coverage
npm-run-all \
    --sequential \
    "${npm_lifecycle_event}:*"
    
scripts/merge-coverage.js 

nyc \
    report \
    --clean \
    --check-coverage \
    --report-dir coverage/full