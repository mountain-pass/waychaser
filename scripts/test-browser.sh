#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"
: "${npm_package_config_TEST_API_PORT?This script should be run from npm}"
: "${npm_package_config_TEST_BROWSER_PORT?This script should be run from npm}"

TESTING="${npm_lifecycle_event#test:}" 
TEST_PROFILE="${TESTING//:/-}" 

NODE_ENV=test \
    PORT=${npm_package_config_TEST_API_PORT} \
    UI_PORT=${npm_package_config_TEST_BROWSER_PORT} \
    start-server-and-test \
    browser:test \
    "http://localhost:${npm_package_config_TEST_BROWSER_PORT}" \
    "cucumber-js -p ${TEST_PROFILE}"