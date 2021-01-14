# waychaser

Client library for HATEOAS level 3 RESTful APIs that provide hypermedia controls using:
  - Link ([RFC8288](https://tools.ietf.org/html/rfc8288)) and [Link-Template](https://mnot.github.io/I-D/link-template/) headers.
  - [HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08) 

This [isomorphic](https://en.wikipedia.org/wiki/Isomorphic_JavaScript) library is compatible with Node.js 10.x, 12.x and 14.x, Chrome, Firefox, Safari, Edge and even IE.
<img alt="aw yeah!" src="./docs/images/aw_yeah.gif" width="20" height="20" />

[![License](https://img.shields.io/github/license/mountain-pass/waychaser?logo=apache)](https://github.com/mountain-pass/waychaser/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/@mountainpass/waychaser?logo=npm)](https://www.npmjs.com/package/@mountainpass/waychaser) [![npm downloads](https://img.shields.io/npm/dm/@mountainpass/waychaser?logo=npm)](https://www.npmjs.com/package/@mountainpass/waychaser)

[![Build Status](https://img.shields.io/github/workflow/status/mountain-pass/waychaser/Build?logo=github)](https://github.com/mountain-pass/waychaser/actions?query=workflow%3ABuild) [![BrowserStack Status](https://img.shields.io/badge/dynamic/json?label=BrowserStack&query=%24.status&url=https%3A%2F%2Fautomate.browserstack.com%2Fapi%2Fv1%2Fpublic-builds%2FM2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ%3D%3D--8a61c301655735baed333d4f305980a13ef32c25&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAACfFBMVEX////ocDTobzToVzroOzznQT3lSj7mUkLud072ql3ocDTnbDbhdkbzllf5wmLobzTnbzT0oFn3wGHnbzTocTP5t2DnbzT4vmHobzT6vWLobzT7u2HocDT7vGLpejr5vWHtjkT3vmH0rlf3vGD3wWPulUj3v2H3vGD3v2H3vGD3vWD3wGL3vGD3vGD3vGD3wGL3vWD3vmH3vGD3vWD3v2L3wWL3wWL3wGL3vmHnPjvkUUDTmlm8vGi2xWXAwknRpDroPTngaFWvybZlyeE3ut8jt9xQvMyFyIC2zjnZlEbnVjfiU1Gyz9NSwu4Ss9xEnLZFl68AqM8Asttyu3Kx0DrgnkvnbzTnPTrOqaF/0/NArdBOYGcjHyAkISJoc3kjosYjsrB/wEbGxELyrlroaDPkTUi70NRvxuZefo14enzFxshNXmgAscBntlGnykPrvFXoZjPiV0631t59yeVWZG1EREZKSkw4PkMbsL1ltVCTxUbnx1PoaTPeVkSvz82b1utogI1MX2tJuK9qtkmRxEjpw1LobDLiUzektY+t4faYx9hXX2Q/RkxrrcV3vXlktkmjxEXxt1TmazLsXjW1iEiKzq+x3fGr1+uas8GTrb2Yyt+KxZlptklsvk7MtkH5slrpbTPjYziSpEp2xIaYzrSbz7+Uyq2Bv3hmtkphvE+ut0LumUb5vmLmaDLqazPjazihnUJptUleukxbukpeukp4uk26qD/qgzr4tFztkUXpaTLqaDTXfjnAkD+6lUDHkD3ffDTudzj1rlj3wGHxo1DqfzvnbjTqZzLsYzHtZDLtbjbwjUT2uF33wGLzrVfxoU/wn07yp1P1tlz3wWLShVqMAAAAOXRSTlMBE3XD5+3r05k5Rd39lwtB97sLEd+ZbzXBm+PT6efl583Tj5kt+/0zi5MHr7UJBYv5+5Exj83l5c0M9lQxAAABD0lEQVQY02NgYGBgZGJmYWVj5+BkgAAubksraxtbO3seXj4Qn1/AwdHJ2cXVzd3DU1CIgUFYxMvbx9fPPyAwKDgkVJSBQSwsPCIyKjomNi4+ITEpWZxBIiU1LT0jJiYzKzsnNy9fkkGqoLCouCQmprSsvKKyqlqaQaamtq6+IQYIGpuaW1plGeTa2js6u7pjYnp6+/onTJRnUJg0ecrUadNnzJw1e87cefMVGZTCFixctHjJ0mXLV6xctXqNMoOK6tp16zds3LR5y9Zt23eoqTMwaOyctGv3nr379h84eOiwJtDpWtpHjh47fuLkqdNnzurogjyjp29w7vyFi5cuGxrpQv1rbGJqZm6hqQ5iAwBfVVxc6RHpXAAAAABJRU5ErkJggg==)](https://automate.browserstack.com/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25)

[![GitHub issues](https://img.shields.io/github/issues/mountain-pass/waychaser?logo=github)](https://github.com/mountain-pass/waychaser/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/mountain-pass/waychaser?logo=github)](https://github.com/mountain-pass/waychaser/pulls)

[![Quality](https://img.shields.io/codacy/grade/940768d54f7545f7b42f89b26c23c751?logo=codacy)](https://www.codacy.com/gh/mountain-pass/waychaser/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mountain-pass/waychaser&amp;utm_campaign=Badge_Grade) [![Coverage](https://img.shields.io/codacy/coverage/940768d54f7545f7b42f89b26c23c751?logo=codacy)](https://www.codacy.com/gh/mountain-pass/waychaser/dashboard?utm_source=github.com&utm_medium=referral&utm_content=mountain-pass/waychaser&utm_campaign=Badge_Coverage)

[![source code vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/mountain-pass/waychaser?label=source%20code%20vulnerabilities&logo=snyk)](https://snyk.io/test/github/mountain-pass/waychaser) [![npm package vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@mountainpass/waychaser@1.62.7?label=npm%20package%20vulnerabilties&logo=snyk)](https://snyk.io/test/npm/@mountainpass/waychaser/1.62.7)


[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) 

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
  - [Getting the response body](#getting-the-response-body)
- [TO DO](#to-do)

# Usage

## Node.js

```bash
npm install @mountainpass/waychaser
```

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
  src="https://unpkg.com/@mountainpass/waychaser@1.62.7"
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

## Getting the response body

```js
const json = await apiResource.body()
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
- [x] Android Chrome testing
- [x] npm audit
- [x] snyk security scanning
- [x] api docs
- [x] tags in npm
- [x] markdown lint
- [x] switched to JS Standard format
- [x] split webdriver from waychaser-via
- [x] split browser stack tunnel into separate class
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
- [x] add js standard linting to make sure our eslint confirm is conforming
- [x] add tests for PUT forms
- [x] add tests for PATCH forms
- [x] add tests for multipart
- [x] switch to single session per browser test
- [x] add tests for multiple parameters
- [x] add automate CHANGELOG.md 
- [ ] add support for HAL
  - [x] add support for simple self `_links`
  - [x] add methods for getting consumed body
  - [x] add support for more general `_links`
  - [x] add support for templated `_links`
  - [ ] add support for `rels` with an array of links
  - [ ] add support for curies and curied `_links`
  - [ ] add support for `_links` in `_embedded` resources
  - [ ] add support for warning about deprecated `_links`
- [ ] add 404 equivalent for when trying to invoke a relationship that doesn't exist
- [ ] add support for Siren
- [ ] add tests for authenticated requests
- [ ] upgrade webpack
  - [ ] or investigate using https://rollupjs.org/guide/en/ instead
  - [ ] or https://github.com/parcel-bundler/parcel
- [ ] fix structure of package so we get better jsdoc linting
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
      eslint-plugin-security](https://github.com/nodesecurity/eslint-plugin-security) and get better version of `security/detect-object-injection` that doesn't flag `for (const index in object) { object[index] = 0; }`
- [ ] have a look at using https://github.com/gkouziik/eslint-plugin-security-node
- [ ] try to use umd for both node and browser. https://github.com/webpack/webpack/pull/8625
  - [ ] investigate using https://rollupjs.org/guide/en/

