# waychaser

Client library for level 3 RESTful APIs.

This isomorphic library is compatible with Node.js 10.x, 12.x and 14.x, Chrome, Firefox, Safari, Edge and even IE. <img alt="aw yeah!" src="./docs/images/aw_yeah.gif" width="20" height="20" />

[![GitHub license](https://img.shields.io/github/license/mountain-pass/waychaser)](https://github.com/mountain-pass/waychaser/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/@mountainpass/waychaser)](https://www.npmjs.com/package/@mountainpass/waychaser) [![npm downloads](https://img.shields.io/npm/dm/@mountainpass/waychaser)](https://www.npmjs.com/package/@mountainpass/waychaser)

[![Build Status](https://github.com/mountain-pass/waychaser/workflows/Build/badge.svg)](https://github.com/mountain-pass/waychaser/actions?query=workflow%3ABuild) [![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25)](https://automate.browserstack.com/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25)

[![Maintainability](https://api.codeclimate.com/v1/badges/532f3a287fbffed6f295/maintainability)](https://codeclimate.com/github/mountain-pass/waychaser/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/532f3a287fbffed6f295/test_coverage)](https://codeclimate.com/github/mountain-pass/waychaser/test_coverage)

[![GitHub issues](https://img.shields.io/github/issues/mountain-pass/waychaser)](https://github.com/mountain-pass/waychaser/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/mountain-pass/waychaser)](https://github.com/mountain-pass/waychaser/pulls)

[![source code vulnerabilties](https://img.shields.io/snyk/vulnerabilities/github/mountain-pass/waychaser?label=source%20code%20vulnerabilities)](https://snyk.io/test/github/mountain-pass/waychaser) [![source code dependencies](https://img.shields.io/librariesio/github/mountain-pass/waychaser?label=source%20code%20dependencies)](https://libraries.io/github/mountain-pass/waychaser#dependencies)

[![npm package vulnerabilties](https://img.shields.io/snyk/vulnerabilities/npm/@mountainpass/waychaser@1.34.0?label=npm%20package%20vulnerabilties)](https://snyk.io/test/npm/@mountainpass/waychaser/1.34.0) [![npm package dependencies](https://img.shields.io/librariesio/release/npm/@mountainpass/waychaser/1.34.0)](https://libraries.io/npm/@mountainpass/waychaser/1.34.0)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

 | <img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg" alt="Node.js" width="24px" height="24px" /><br/>Node.js | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br/>Chrome](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22chrome%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br/>Firefox](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22firefox%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br/>Safari](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22safari%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /><br/>Edge](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22edge%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS" width="24px" height="24px" /><br/>iOS](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?oses=[{%22os%22:%22ios%22}]) | [<img src="https://source.android.com/setup/images/Android_symbol_green_RGB.svg" alt="Android" width="24px" height="24px" /><br/>Android](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?oses=[{%22os%22:%22android%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px" /><br/>IE](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22ie%22}]) |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| 10.x, 12.x, 14.x | latest version | latest version| latest version| latest version | latest version | latest version | 11 |

# ToC

- [waychaser](#waychaser)
- [ToC](#toc)
- [Product](#product)
  - [Problem](#problem)
    - [Eureka moment](#eureka-moment)
  - [Customer](#customer)
  - [Solution](#solution)
  - [Assumptions](#assumptions)
    - [Unvalidated](#unvalidated)
    - [Validating](#validating)
    - [Validated](#validated)
    - [Invalidated](#invalidated)
- [Usage](#usage)
  - [Node.js](#nodejs)
  - [Browser](#browser)
- [API Design Notes](#api-design-notes)
  - [Get root API](#get-root-api)
  - [Get list of operations](#get-list-of-operations)
  - [Get specific operation](#get-specific-operation)
  - [Has operation](#has-operation)
  - [Get list of parameters](#get-list-of-parameters)
  - [Has parameter](#has-parameter)
  - [invoke operation](#invoke-operation)
  - [Draft Examples](#draft-examples)
- [TO DO](#to-do)

# Product

## Problem

REST APIs that use HATEOAS allow for extreamly loose coupling, which is awesome, but actualy using them can be quite hard when your starting out. This library makes it easier.

### Eureka moment

Whenever I get a good base client working, it's awesome, but getting to that first step is quite hard and get's in the way of getting the functionality your are trying to build working, which is why it's often easier to just tightly couple on the operation you need to use.

The biggest eureka moment for me, was when I was asked to create a simple demo using a HATEOAS API I had written, and rather
than "doing it right", it was just easier to tightly couple and call it done.

## Customer

Developers using REST APIs that use HATEOAS

## Solution

Simple interface that abstracted the details of navigating a REST APIs that uses HATEOAS

## Assumptions

### Unvalidated

- Developers still care about REST and HATEOAS

### Validating

_None_

### Validated

_None_

### Invalidated

_None_

# Usage

## Node.js

`npm install @mountainpass/waychaser`

```js
import { waychaser } from "@mountainpass/waychaser";

//...

try {
  const api = await waychaser.load(apiUrl);
  // do something with `api`
} catch (error) {
  // do something with `error`
}

```

## Browser

```html
<script type="text/javascript" src="https://unpkg.com/@mountainpass/waychaser@1.34.0"></script>

...
<script type="text/javascript">
waychaser.load(apiUrl).then(api => {
  // do something with `api`
}).catch(error => {
  // do something with `error`
});

</script>
```

Where `VERSION` is the version of waychaser you would like to use.

# API Design Notes

Some of the different API options that were considered and what we ended up picking.

NOTE: just because it's here, doesn't mean it's implemented. It's just what we're planning.

## Get root API

- `async library.getRoot(url)`
- `async library.root(url)`
- `async library.init(url)`
- `async library.load(url)` ✅
- `async library.loadApi(url)`
- `async library.getApi(url)`
- `async library.api(url)`
- `new API(url) - non async` ❌

returns an API Resource Object (ARO)

## Get list of operations

- `ARO.operations` ✅
- `ARO.ops` ✅ (shorthand)
- `ARO.operations()`
- `ARO.getOperations()`


so the plan was to return a map of API operation objects (AOO), with the key being the rel. However it's perfectly fine to have
multiple operations with the same rel. So, we either need to:
 - return a map of arrays,
 - return a map with each value either being a AOO or an Array of AOO.

The former sucks from a refencing point of view. e.g., `ARO.ops[rel][0]()`
The later sucks because we need to test if AOO or array. e.g. `Array.isArray(ARO.ops[rel]) ? ARO.ops[rel][0]() : ARO.ops[rel]()`
The later sucks even more because most of the time, users would just do `ARO.ops[rel]()`, which will be fine until the day that
resource returns multiple links with the same rel.

For instance if you have a ARO that is a list, you can have multiple links with  `rel=item` with different `anchor`s, which tells 
you where to get each item in the data.

You could also have and ARO that has links with the same rel, that take a different number of parameters.

It's worth noting that the `http-link-header` library's `link.get(attr, value)` method returns an array.

Maybe if the ARO is a list, we can treat each item as a ARO. e.g. `ARO.data[9].operations` will return the operations just for that item. For more complexe structures `ARO.data.foo.bar.operations` will do the same. Doesn't feel ideal, because the data structre is not just a JSON. Also, things got to crap if the JSON has a field called `operations`

Instead, mayb we can use the anchor structure for the operations. e.g. for a list, `ARO.operations[9][rel]` would get the link with the rel for the 9th item in the list. Whereas `ARO.operations.foo.bar[rel]` would get the link with the rel for the item at `foo.bar`. Again this will fail if the data has a field with the same name as a rel. 😭

We probably need to be explicit about the anchor. Something like `ARO.operations[anchor][rel]`.e.g., For root links it might look like `ARO.operations['#'][rel]`. 

What of `operations` returns a function? Then we could go `ARO.operations(rel)` for root and `ARO.operations(rel, {anchor="foo.bar})` or whatever other attribute we want to get it by.

If we do that, what should happen if `ARO.operations(rel, {anchor="foo.bar})` still finds multiple links? We'd still have the same problem that we started with, so we're going to have to always return an array, in order to not break clients when the server adds an extra link with the same rel. 

So let's go with `ARO.operations(rel)` and `ARO.operations(rel, {anchor="foo.bar})` and `ARO.operations({anchor="foo.bar})` as all valid options. And they all return a set of operations, so `ARO.operations(rel, {anchor="foo.bar})[0]` is the same as `ARO.operations(rel)({anchor="foo.bar})[0]`

## Get specific operation

- `ARO.getOperation(rel)`
- `ARO[rel]`
- `ARO.operation(rel)`
- `ARO.operations[rel]` ✅
- `ARO.ops[rel]` ✅

returns an API operation or an array of API operations

## Has operation

- `ARO.hasOperation(rel)`
- `ARO.hasOperation(rel, parameters)`
- `ARO.has(rel)` modeled on map.prototype.has()
- `ARO.op.has(reg)` ✅ actually map.prototype.has()

returns boolean

## Get list of parameters

- `AOO.parameters` ✅
- `AOO.param` ✅ (shorthand)
- `AOO.p` ✅ (shorthand)
- `AOO.parameters()`
- `AOO.getParameters()`

returns a map of API operation parameter objects (AOPO)

## Has parameter

- `AOO.p.has(varBase)` ✅ actually map.prototype.has()

returns boolean

## invoke operation

- `async AOO.invoke(context, options)`
- `async AOO(context, options)`

`context` is the data we have available to submit or are willing to submit
`options` are options for the underlying HTTP request

returns an API Resource Object (ARO)

## Draft Examples

```
ARO.op[rel](context)
```

```
const root = waychaser.load(“https://api-addressr.mountain-pass.com.au”);
const addresses = await root.op[“https://addressr.mountain-pass.com.au/rels/address-search”]({q: “8 Arthur St”});
const nextAddresses = await addresses.op.next();
const address = await nextAddresses.op.item[0]();
```

```
library.load(“https://api-addressr.mountain-pass.com.au”)
.then(root => root.op[“https://addressr.mountain-pass.com.au/rels/address-search”]({q: “8 Arthur St”}))
.then(addresses => addresses.op.next())
.then(nextAddresses => nextAddresses.op.item[0]())
.then(address => console.log(address.data));

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
- [ ] clean up logging
- [ ] investigate mega-lint
- [ ] fix struture of package so we get better jsdoc linting
- [ ] refactor browserstack test run to use single tunnel when running locally
- [ ] add tests for abort
- [ ] add tests for different types of error responses
- [ ] add tests for authenticated requests
- [ ] add tests for parameterised links
- [ ] add tests for non-get operations
- [ ] add tests for validation
- [ ] look at using standard instead of eslint
- [ ] add method for running single scenario
- [ ] expand code-climate analysis
- [ ] create docs site
  - [ ] integrate Code coverage and code quality reporting
  - [ ] integrate API docs
- [ ] lots more 😂
- [ ] help [
eslint-plugin-security](https://github.com/nodesecurity/eslint-plugin-security) and get better version of `security/detect-object-injectionn` that doesn't flag `for (const index in object) { object[index] = 0; }`
- [ ] have a look at using https://github.com/gkouziik/eslint-plugin-security-node
- [ ] try to use umd for both node and browser. https://github.com/webpack/webpack/pull/8625
  - [ ] investigate using https://rollupjs.org/guide/en/
