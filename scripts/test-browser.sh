#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"
: "${npm_package_config_TEST_API_PORT?This script should be run from npm}"

BROWSER_AND_MODE=$(echo "${npm_lifecycle_event}" | sed -e 's/test:browser-api-min://' | sed -e 's/test:browser-api://')
MODE="${BROWSER_AND_MODE#*:}"
BROWSER="${BROWSER_AND_MODE%:*}"

npm run build

if [[ "$BROWSER" != "safari" || "$MODE" != "local" || "$OSTYPE" == "darwin"* ]]; then
NODE_ENV=test \
    API_PORT=${npm_package_config_TEST_API_PORT} \
    "cucumber-js"
else
    echo "Cannot execute local safari tests on $OSTYPE. Skipping..."
fi


