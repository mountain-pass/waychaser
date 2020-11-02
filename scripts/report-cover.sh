#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"
    
scripts/merge-coverage.js 

nyc \
    report \
    --clean \
    --check-coverage \
    --report-dir coverage/full