#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"
: "${npm_package_config_TEST_API_PORT?This script should be run from npm}"
: "${npm_package_config_TEST_BROWSER_PORT?This script should be run from npm}"

TESTING="${npm_lifecycle_event#test:}" 
TEST_PROFILE="${TESTING//:/-}" 

BROWSER_AND_MODE="${npm_lifecycle_event#test:browser-api:}"
MODE="${BROWSER_AND_MODE#*:}"
BROWSER="${BROWSER_AND_MODE%:*}"

if [[ "$BROWSER" != "safari" || "$MODE" != "local" || "$OSTYPE" == "darwin"* ]]; then
NODE_ENV=test \
    PORT=${npm_package_config_TEST_API_PORT} \
    UI_PORT=${npm_package_config_TEST_BROWSER_PORT} \
    start-server-and-test \
    browser:test \
    "http://localhost:${npm_package_config_TEST_BROWSER_PORT}" \
    "cucumber-js -p ${TEST_PROFILE}"
else
    echo "Cannot execute local safari tests on $OSTYPE. Skipping..."
fi

