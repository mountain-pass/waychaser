// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');

const FAIL_FAST = process.env.FAIL_FAST || '--fail-fast';
const NO_STRICT = process.env.NO_STRICT || '';

const outputDirectory = 'test-results';

function getFeatureGlob(RERUN, profile) {
  /* istanbul ignore next: RERUN is not set for full test runs */
  return fs.existsSync(RERUN) && fs.statSync(RERUN).size !== 0
    ? RERUN
    : `src/test/**/*.feature --tags 'not(@not-${profile})'`;
}

function generateConfig() {
  const profile = process.env.npm_lifecycle_event
    .replace('test:', '')
    .replace(/:/g, '-');

  const resultsDirectory = `${outputDirectory}/${profile}`;
  fs.mkdirSync(resultsDirectory, { recursive: true });

  const RERUN = `@cucumber-${profile}.rerun`;
  const FEATURE_GLOB = getFeatureGlob(RERUN, profile);
  const FORMAT_OPTIONS = {
    snippetInterface: 'async-await',
    snippetSyntax:
      './node_modules/@windyroad/cucumber-js-throwables/lib/custom-cucumber-syntax.js',
  };
  const MODULES =
    '--require-module @babel/register  --require-module @babel/polyfill';
  const REQUIRE_GLOB = 'src/test/**/*.js';
  const BASE_CONFIG = `${FEATURE_GLOB} --format-options '${JSON.stringify(
    FORMAT_OPTIONS
  )}' ${MODULES} --require ${REQUIRE_GLOB} ${NO_STRICT} --format rerun:${RERUN} --format json:${resultsDirectory}/results.cucumber -f node_modules/cucumber-junit-formatter:${resultsDirectory}/results.xml ${FAIL_FAST}`;

  return `${BASE_CONFIG} --world-parameters '${JSON.stringify({
    profile,
  })}'`;
}

module.exports = {
  default: generateConfig(),
  // 'browser-api-chrome-local': generateConfig('browser-api-chrome-local'),
  // 'browser-api-chrome-remote': generateConfig(
  //   'browser-api-chrome-remote',
  //   'browser-api-remote',
  //   'chrome'
  // ),
  // 'browser-api-firefox-local': generateConfig('browser-api-firefox-local'),
  // 'browser-api-firefox-remote': generateConfig(
  //   'browser-api-firefox-remote',
  //   'browser-api-remote',
  //   'firefox'
  // ),
  // 'browser-api-safari-local': generateConfig('browser-api-safari-local'),
  // 'browser-api-safari-remote': generateConfig(
  //   'browser-api-safari-remote',
  //   'browser-api-remote',
  //   'safari'
  // ),
  // 'browser-api-edge-remote': generateConfig(
  //   'browser-api-edge-remote',
  //   'browser-api-remote',
  //   'MicrosoftEdge'
  // ),
  // 'browser-api-ie-remote': generateConfig(
  //   'browser-api-ie-remote',
  //   'browser-api-remote',
  //   'internet explorer'
  // ),
};
