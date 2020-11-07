#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"

npm-run-all \
    --sequential \
    "${npm_lifecycle_event}:*:$([ -z ${CI+x} ] && echo "local" || echo "remote")"