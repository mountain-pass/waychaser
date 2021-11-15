#!/usr/bin/env babel-node
/* eslint-disable security/detect-non-literal-fs-filename */

import fs from 'fs'
import fsExtra from 'fs-extra'

const RESULTS_DIR = 'coverage'
const FULL_DIRNAME = 'full'
const FULL_DIRPATH = '.nyc_output'

console.log(`cleaning ${FULL_DIRPATH} ...`)
fs.mkdirSync(FULL_DIRPATH, { recursive: true })
fsExtra.emptyDirSync(FULL_DIRPATH)

console.log(`copying files to ${FULL_DIRPATH} ...`)

for (const n of fs
  .readdirSync(RESULTS_DIR)
  .filter(n => n !== FULL_DIRNAME)
  .map(n => `${RESULTS_DIR}/${n}/.nyc_output/`)
  .filter(n => fs.existsSync(n))) {
  fsExtra.copySync(n, FULL_DIRPATH)
}

console.log('... done')
