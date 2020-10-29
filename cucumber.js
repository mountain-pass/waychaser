// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');

const FAIL_FAST = process.env.FAIL_FAST || '--fail-fast';
const NO_STRICT = process.env.NO_STRICT || '';

const outputDirectory = 'test-results';

function getFeatureGlob(RERUN, profile) {
  // ignore, because RERUN is not set for full test runs
  /* istanbul ignore next */
  return fs.existsSync(RERUN) && fs.statSync(RERUN).size !== 0
    ? RERUN
    : `src/test/**/*.feature --tags 'not(@not-${profile})'`;
}

function generateConfig(profile) {
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

  return `${BASE_CONFIG} --world-parameters '${JSON.stringify({ profile })}'`;
}

module.exports = {
  'node-api': generateConfig('node-api'),
  'browser-api-chrome': generateConfig('browser-api-chrome'),
  'browser-api-firefox': generateConfig('browser-api-firefox'),
};
