/* eslint-disable security/detect-non-literal-fs-filename */
// eslint-disable-next-line unicorn/prefer-module
const fs = require('fs')

/* istanbul ignore next: Second branch only happens when not running a CI job */
const FAIL_FAST = process.env.CI ? '' : '--fail-fast'
const NO_STRICT = process.env.NO_STRICT || ''

const PUBLISH = '--publish-quiet'

/* istanbul ignore next: branch only taken when remote */
const RETRY =
  process.env.npm_lifecycle_event.includes(':remote') || process.env.RETRY
    ? `--retry ${process.env.RETRY || 5}`
    : ''

const outputDirectory = 'test-results'
fs.mkdirSync(outputDirectory, { recursive: true })

const lastPart = process.env.npm_lifecycle_event.slice(
  process.env.npm_lifecycle_event.lastIndexOf(':') + 1
)

/* istanbul ignore next: branching on @ only happens on special test runs */
const profileWithoutSuffix = lastPart.includes('@')
  ? process.env.npm_lifecycle_event.slice(
    0,
    process.env.npm_lifecycle_event.lastIndexOf(':')
  )
  : process.env.npm_lifecycle_event

function getFeatureGlob(RERUN, profile) {
  /* istanbul ignore next: RERUN is not set for full test runs */
  if (
    !process.env.CI &&
    !process.env.COVERAGE &&
    !lastPart.includes('@') &&
    fs.existsSync(RERUN) &&
    fs.statSync(RERUN).size !== 0
  ) {
    return RERUN
  } else {
    let rval = "src/test/**/*.feature --tags '"
    rval += `not(@not-${profile})`
    const splitProfile = profile.split('-')
    if (splitProfile[0] === 'browser') {
      rval += ` and not(@not-${splitProfile[2]})`
      rval += ` and not(@not-${splitProfile[3]})`
      if (!process.env.CI) {
        rval += ' and not(@not-head)'
      }
    }
    /* istanbul ignore next: branching on @ only happens on special test runs */
    if (lastPart.includes('@')) {
      rval += ` and ${lastPart.replace('{', '(').replace('}', ')')}`
    }

    rval += "'"
    return rval
  }
}

function generateConfig() {
  const profile = profileWithoutSuffix.replace('test:', '').replace(/:/g, '-')

  const resultsDirectory = `${outputDirectory}/${profile}`
  fs.mkdirSync(resultsDirectory, { recursive: true })

  const RERUN = `${outputDirectory}/@cucumber-${profile}.rerun`
  const FEATURE_GLOB = getFeatureGlob(RERUN, profile)
  const FORMAT_OPTIONS = {
    snippetInterface: 'async-await',
    snippetSyntax:
      './src/test/custom-snippet-syntax.ts'
  }
  const MODULES =
    '--require-module ts-node/register'
  const CONFIG = `${FEATURE_GLOB} --format-options '${JSON.stringify(
    FORMAT_OPTIONS
  )}' ${MODULES} --require 'src/test/**/*.js' --require 'src/test/**/*.ts' ${NO_STRICT} --format rerun:${RERUN} ${RETRY} ${PUBLISH} ${FAIL_FAST}`

  console.log(CONFIG)
  return CONFIG
}

module.exports = {
  default: generateConfig()
}
