#!/usr/bin/env babel-node
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable security/detect-non-literal-fs-filename */

import { scripts } from '../package.json';

console.log({
  browser: Object.keys(scripts)
    // filter the scritps to just the saucy ones
    .filter((script) => {
      return script.match(/cover:browser-api:.*:saucy/);
    })
    // extract the browser name
    .map((script) => {
      return script.replace(/cover:browser-api:(.*):saucy/, '$1');
    }),
});
