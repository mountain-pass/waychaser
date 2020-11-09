#!/bin/bash



sed -i -e "s|\"https://unpkg.com/${npm_package_name}@.*\"|\"https://unpkg.com/${npm_package_name}@${npm_package_version}\"|" README.md