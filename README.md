# waychaser

Client library for HATEOAS level 3 RESTful APIs that provide hypermedia controls using:
  - Link ([RFC8288](https://tools.ietf.org/html/rfc8288)) and [Link-Template](https://mnot.github.io/I-D/link-template/) headers.
  - [HAL](http://stateless.co/hal_specification.html) 

This [isomorphic](https://en.wikipedia.org/wiki/Isomorphic_JavaScript) library is compatible with Node.js 10.x, 12.x and 14.x, Chrome, Firefox, Safari, Edge and even IE.
<img alt="aw yeah!" src="./docs/images/aw_yeah.gif" width="20" height="20" />

[![GitHub license](https://img.shields.io/github/license/mountain-pass/waychaser)](https://github.com/mountain-pass/waychaser/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/@mountainpass/waychaser)](https://www.npmjs.com/package/@mountainpass/waychaser) [![npm downloads](https://img.shields.io/npm/dm/@mountainpass/waychaser)](https://www.npmjs.com/package/@mountainpass/waychaser)

[![Build Status](https://github.com/mountain-pass/waychaser/workflows/Build/badge.svg)](https://github.com/mountain-pass/waychaser/actions?query=workflow%3ABuild) [![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25)](https://automate.browserstack.com/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25)

[![GitHub issues](https://img.shields.io/github/issues/mountain-pass/waychaser)](https://github.com/mountain-pass/waychaser/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/mountain-pass/waychaser)](https://github.com/mountain-pass/waychaser/pulls)

[![source code vulnerabilties](https://img.shields.io/snyk/vulnerabilities/github/mountain-pass/waychaser?label=source%20code%20vulnerabilities)](https://snyk.io/test/github/mountain-pass/waychaser) [![npm package vulnerabilties](https://img.shields.io/snyk/vulnerabilities/npm/@mountainpass/waychaser@1.54.0?label=npm%20package%20vulnerabilties)](https://snyk.io/test/npm/@mountainpass/waychaser/1.54.0)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/940768d54f7545f7b42f89b26c23c751)](https://www.codacy.com/gh/mountain-pass/waychaser/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mountain-pass/waychaser&amp;utm_campaign=Badge_Grade)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

| <img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg" alt="Node.js" width="24px" height="24px" /><br/>Node.js | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br/>Chrome](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22chrome%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br/>Firefox](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22firefox%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br/>Safari](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22safari%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /><br/>Edge](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22edge%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS" width="24px" height="24px" /><br/>iOS](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?oses=[{%22os%22:%22ios%22}]) | [<img src="https://source.android.com/setup/images/Android_symbol_green_RGB.svg" alt="Android" width="24px" height="24px" /><br/>Android](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?oses=[{%22os%22:%22android%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px" /><br/>IE](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22ie%22}]) |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10.x, 12.x, 14.x                                                                                                                       | latest version                                                                                                                                                                                                                                                                                                                                                                                              | latest version                                                                                                                                                                                                                                                                                                                                                                                                   | latest version                                                                                                                                                                                                                                                                                                                                                                                              | latest version                                                                                                                                                                                                                                                                                                                                                                                    | latest version                                                                                                                                                                                                                                                                                                                                                                                    | latest version                                                                                                                                                                                                                                                                                                                                                                    | 11                                                                                                                                                                                                                                                                                                                                                                                                                                      |

# ToC

- [waychaser](#waychaser)
- [ToC](#toc)
- [Usage](#usage)
  - [Node.js](#nodejs)
  - [Browser](#browser)
  - [Requesting linked resources](#requesting-linked-resources)
    - [Requesting parameterised linked resources](#requesting-parameterised-linked-resources)
- [TO DO](#to-do)

# Usage

## Node.js

`npm install @mountainpass/waychaser`

```js
import { waychaser } from '@mountainpass/waychaser'

//...

try {
  const apiResource = await waychaser.load(apiUrl)
  // do something with `apiResource`
} catch (error) {
  // do something with `error`
}
```

## Browser

```html
<script
  type="text/javascript"
  src="https://unpkg.com/@mountainpass/waychaser@1.54.0"
></script>

...
<script type="text/javascript">
  waychaser
    .load(apiUrl)
    .then((apiResource) => {
      // do something with `apiResource`
    })
    .catch((error) => {
      // do something with `error`
    });
</script>
```

## Requesting linked resources

Level 3 REST APIs are expected to return links to related resources. Waychaser expects to find these links via [RFC 8288](https://tools.ietf.org/html/rfc8288) `link` headers. Waychaser provides methods to simplify requesting these linked resources.

For instance, if the `apiResource` loaded above has a `link` with a relationship (`rel`) of `describedby`, then that resource can be retrieve using the following code

```js
const describedByResource = await apiResource.invoke('describedby')
```

### Requesting parameterised linked resources

```js
const searchResultsResource = await apiResource.invoke('search', {
  q: 'waychaser'
})
```

# TO DO

- [x] CI/CD pipeline
- [x] dependabot
- [x] Firefox testing
- [x] Safari testing
- [x] fix matrix testing for UI (don't nodejs need matrix for browser tests)
- [x] dependency caching in CI pipeline
- [x] Edge browser testing
- [x] IE browser testing lol
- [x] automatically update version number in README.md
- [x] badges
- [x] archive test results
- [x] have pull requests from fork run node-api and chrome local
- [x] iOS Safari testing
- [x] Andriod Chrome testing
- [x] npm audit
- [x] snky security scanning
- [x] api docs
- [x] tags in npm
- [x] markdown lint
- [x] switched to JS Standard format
- [x] split webdriver from waychaser-via
- [x] split browser stack tunnel into seperate class
- [x] reduce webpacking of node_modules
- [x] clean up lining problems
- [x] add code duplication checks
- [x] clean up logging
- [x] add tests for follow to different resource
- [x] fix linting
- [x] fix husky & lint-staged
- [x] add tests for multiple follows
- [x] switch to github's builtin dependabot
- [x] add tests for parameterised links
- [x] add tests for DELETE
- [x] add tests for POST
- [x] add tests for PUT
- [x] add tests for PATCH
- [x] add tests for query parameterised DELETE, POST, PUT, PATCH
- [x] add tests for path parameterised DELETE, POST, PUT, PATCH
- [x] add tests for POST forms
- [x] fix badges
- [x] add js standard liniting to make sure our eslint confirm is conforming
- [x] add tests for PUT forms
- [x] add tests for PATCH forms
- [x] add tests for multipart
- [x] swtich to single session per browser test
- [x] add tests for multiple parameters
- [x] add automate CHANGELOG.md 
- [ ] add support for HAL
  - [x] add support for simple self `_links`
  - [ ] add methods for getting consumed body
  - [ ] add support for more general `_links`
  - [ ] add support for curies and curied `_links`
  - [ ] add support for `_links` in `_embedded` resources
- [ ] add support for Siren
- [ ] add tests for authenticated requests
- [ ] upgrade webpack
  - [ ] or investigate using https://rollupjs.org/guide/en/ instead
- [ ] fix struture of package so we get better jsdoc linting
- [ ] refactor browserstack test run to use single tunnel when running locally
- [ ] add tests for abort
- [ ] add tests for different types of error responses (maybe use https://hapi.dev/module/boom/api/?v=9.1.1)
- [ ] add tests for validation
- [ ] add method for running single scenario
- [ ] expand codacy analysis
- [ ] create docs site
  - [ ] integrate Code coverage and code quality reporting
  - [ ] integrate API docs
- [ ] lots more 😂
- [ ] help [
      eslint-plugin-security](https://github.com/nodesecurity/eslint-plugin-security) and get better version of `security/detect-object-injectionn` that doesn't flag `for (const index in object) { object[index] = 0; }`
- [ ] have a look at using https://github.com/gkouziik/eslint-plugin-security-node
- [ ] try to use umd for both node and browser. https://github.com/webpack/webpack/pull/8625
  - [ ] investigate using https://rollupjs.org/guide/en/

