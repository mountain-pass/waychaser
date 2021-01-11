/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs')

const FAIL_FAST = process.env.FAIL_FAST || '--fail-fast'
const NO_STRICT = process.env.NO_STRICT || ''

const PUBLISH = '--publish-quiet'

/* istanbul ignore next: branch only taken when remote */
const RETRY = process.env.npm_lifecycle_event.includes(':remote')
  ? '--retry 5'
  : ''

const outputDirectory = 'test-results'
fs.mkdirSync(outputDirectory, { recursive: true })

function getFeatureGlob (RERUN, profile) {
  /* istanbul ignore next: :wip is not used for full test runs */
  if (process.env.npm_lifecycle_event.endsWith(':wip')) {
    return "src/test/**/*.feature --tags '@wip'"
  }
  /* istanbul ignore next: RERUN is not set for full test runs */
  return !process.env.COVERAGE &&
    fs.existsSync(RERUN) &&
    fs.statSync(RERUN).size !== 0
    ? RERUN
    : `src/test/**/*.feature --tags 'not(@not-${profile})'`
}

function generateConfig () {
  const profile = process.env.npm_lifecycle_event
    .replace('test:', '')
    .replace(/:/g, '-')
    .replace(/-wip$/, '')

  const resultsDirectory = `${outputDirectory}/${profile}`
  fs.mkdirSync(resultsDirectory, { recursive: true })

  const RERUN = `${outputDirectory}/@cucumber-${profile}.rerun`
  const FEATURE_GLOB = getFeatureGlob(RERUN, profile)
  const FORMAT_OPTIONS = {
    snippetInterface: 'async-await',
    snippetSyntax:
      './node_modules/@windyroad/cucumber-js-throwables/lib/custom-cucumber-syntax.js'
  }
  const MODULES = '--require-module @babel/register '
  const REQUIRE_GLOB = 'src/test/**/*.js'
  const CONFIG = `${FEATURE_GLOB} --format-options '${JSON.stringify(
    FORMAT_OPTIONS
  )}' ${MODULES} --require ${REQUIRE_GLOB} ${NO_STRICT} --format rerun:${RERUN} ${RETRY} ${PUBLISH} ${FAIL_FAST}`

  console.log(CONFIG)
  return CONFIG
}

module.exports = {
  default: generateConfig()
}
