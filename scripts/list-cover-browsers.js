#!/usr/bin/env babel-node
/* eslint-disable security/detect-non-literal-fs-filename */

import { scripts } from '../package.json'

const BATCH_SIZE = 20

const start =
  (process.env.npm_lifecycle_event.replace(/.*:/, '') - 1) * BATCH_SIZE
const end = start + BATCH_SIZE

console.log(
  JSON.stringify({
    include: Object.keys(scripts)
      // filter the scritps to just the remote ones
      .filter(script => {
        return script.match(/cover:browser-api:.*:remote/)
      })
      // limit the number of items returned because browser stack queue limits
      .slice(start, end)
      // extract the browser name
      .map(script => {
        return {
          browser: script.replace(/cover:browser-api:(.*):remote/, '$1')
        }
      })
  })
)
