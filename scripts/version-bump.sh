#!/bin/sh

PUBLISHED_VERSION=$(node -p "require('./package.json').version")
git tag "v${PUBLISHED_VERSION}"
# now increment again so we are ready for next time
npm --unsafe-perm --no-git-tag-version version patch -m "Version minor to %s."
git add package.json
NEXT_VERSION=$(node -p "require('./package.json').version")
git commit -m "Version bump to $NEXT_VERSION. [skip ci]"
git push origin HEAD:master
git push --tags