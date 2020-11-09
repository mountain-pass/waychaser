#!/bin/bash

: "${npm_package_name?This script should be run from npm}"
: "${npm_package_version?This script should be run from npm}"

sed -i -e "s|\"https://unpkg.com/${npm_package_name}@.*\"|\"https://unpkg.com/${npm_package_name}@${npm_package_version}\"|" README.md