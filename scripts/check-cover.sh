#!/bin/bash

: "${npm_lifecycle_event?This script should be run from npm}"
    
MODE="${npm_lifecycle_event#check:cover:local}"

npm run clean:cover
npm run "cover:node-api${MODE}"
npm run "cover:browser-api:chrome:local${MODE}"
npm run report:cover
