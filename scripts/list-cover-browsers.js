#!/usr/bin/env babel-node
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable security/detect-non-literal-fs-filename */

import { scripts } from '../package.json';

console.log(
  JSON.stringify({
    include: Object.keys(scripts)
      // filter the scritps to just the remote ones
      .filter((script) => {
        return script.match(/cover:browser-api:.*:remote/);
      })
      // extract the browser name
      .map((script) => {
        return {
          browser: script.replace(/cover:browser-api:(.*):remote/, '$1'),
        };
      }),
  })
);
