#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"
: "${npm_package_config_TEST_API_PORT?This script should be run from npm}"

NODE_ENV=test \
    API_PORT=${npm_package_config_TEST_API_PORT} \
    cucumber-js