#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"
: "${npm_package_config_TEST_API_PORT?This script should be run from npm}"

# Enable require() of ESM modules on Node 20.x (unflagged in Node 22+)
# Needed for chai v5+ which is ESM-only
export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--experimental-require-module"

NODE_ENV=test \
    API_PORT=${npm_package_config_TEST_API_PORT} \
    cucumber-js