# waychaser

Client library for level 3 RESTful APIs.

This isomorphic library is compatible with Node.js 10.x, 12.x and 14.x, Chrome, Firefox, Safari, Edge and even IE. <img alt="aw yeah!" src="./docs/images/aw_yeah.gif" width="20" height="20" />

[![Build Status](https://github.com/mountain-pass/waychaser/workflows/Build/badge.svg)](https://github.com/mountain-pass/waychaser/actions?query=workflow%3ABuild)

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
- [Development](#development)
  - [Folder Structure](#folder-structure)
  - [Testing](#testing)
  - [🚫💩](#)
  - [CI/CD](#cicd)
    - [Skipping CI](#skipping-ci)
    - [Skipping releases](#skipping-releases)
  - [Babel](#babel)
    - [ESLint](#eslint)
    - [Webpack](#webpack)
    - [Webpack dev server](#webpack-dev-server)
  - [VSCode + ESLint + Prettier](#vscode--eslint--prettier)
      - [Installation guide](#installation-guide)

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
import { waychaser } from '@mountainpass/waychaser'

...
try {
  const api = await waychaser.load(apiUrl);
  // do something with `api`
}
catch(error) {
  // do something with `error`
}

```

## Browser

```html
<script type="text/javascript" src="https://unpkg.com/@mountainpass/waychaser@VERSION"></script>

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
- `ARO.op` ✅ (shorthand)
- `ARO.operations()`
- `ARO.getOperations()`

returns a map of API operation objects (AOO)

## Get specific operation

- `ARO.getOperation(rel)`
- `ARO[rel]`
- `ARO.operation(rel)`
- `ARO.operations[rel]` ✅
- `ARO.op[rel]` ✅

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
- [ ] automatically update version number in README.md
- [ ] badges
- [ ] create docs site
  - [ ] integrate Code coverage and code quality reporting 
  - [ ] integrate API docs
- [ ] have pull requests from fork run node-api and chrome local (nto sure how to tell if PR from fork)
- [ ] lots more 😂

# Development

## Folder Structure

All the source code is inside the `src` directory. All the test source code is in `src/test` directory

## Testing

This software uses cucumber with different clients for interacting with the API, either directly or via Web Driver (for making sure the library works in the browser), `node-api` and `browser-api`.

Each interface has the same behaviour as described by the [cucumber scenarios](./src/test). Different test clients are used to interact with each interface.

The tests for these clients can be run using the `test:node-api` and `test:browser-api` npm scripts respectivly.

To run all the tests, run `npm run test`

While developing, the `watch:test:*` npm scripts act as their `test:*` counterparts, but will automatically re-execute each time you change a relevant file.

The normal development cycle against a new backend API is:

1. Add scenario to feature file
2. run `npm run watch:test:node-api`
3. write code until the scenario passes
4. commit
5.  run `npm run watch:test:browser-api`
6.  write code until the scenario passes
7.  commit
8.  run `npm run test` to make you didn't break anything else along the way
9.  run `npm run cover` and remove dead code
10. commit and push

## 🚫💩

If committing fails, check your commit logs.

There is a pre-commit hook, that:

- lint's the code,
- runs the `test:node-api` npm script

Please don't force commit. Fix your 💩 and then try again. If you need help, ask.

If you force commit 💩 then you could get...

![the old fork in the eye](./docs/images/fork_in_the_eye.gif)

## CI/CD

GitHub actions are uses for [waychaser's CI/CD](https://github.com/mountain-pass/waychaser/actions). 

### Skipping CI

If you are making changes that you are CERTAIN have no impact on the code or the release (e.g. updates to README),
you can add `[skip-ci]` to your commit message and the pipeline will be skipped.

⚠️ USE WITH CAUTION ⚠️

### Skipping releases

If all the tests pass, the pipeline's default behaviour is to publish a new version to NPM.  If you are making changes that don't warrant a release (e.g. refactoring tests), you can skip the release by adding `[skip-release]` to your commit message.


## Babel

[Babel](https://babeljs.io/) helps us to write code in the latest version of JavaScript. If an environment does not support certain features natively, Babel will help us to compile those features down to a supported version.

[.babelrc file](https://babeljs.io/docs/usage/babelrc/) is used describe the configurations required for Babel.

Babel requires plugins to do the transformation. Presets are the set of plugins defined by Babel. Preset **env** allows to use babel-preset-es2015, babel-preset-es2016, and babel-preset-es2017 and it will transform them to ES5.

### ESLint

[ESLint](https://eslint.org/) is a pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.

[.eslintrc.json file](<(https://eslint.org/docs/user-guide/configuring)>) (alternatively configurations can we written in Javascript or YAML as well) is used describe the configurations required for ESLint.

### Webpack

[Webpack](https://webpack.js.org/) is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser.

[webpack.config.js](https://webpack.js.org/configuration/) file is used to describe the configurations required for webpack.

### Webpack dev server

[Webpack dev server](https://webpack.js.org/configuration/dev-server/) is used along with webpack. It provides a development server that provides live reloading for the client side code. This should be used for development only.

## VSCode + ESLint + Prettier

[VSCode](https://code.visualstudio.com/) is a lightweight but powerful source code editor. [ESLint](https://eslint.org/) takes care of the code-quality. [Prettier](https://prettier.io/) takes care of all the formatting.

#### Installation guide

1.  Install [VSCode](https://code.visualstudio.com/)
2.  Install [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
3.  Install [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
4.  Install [Cover extension](https://marketplace.visualstudio.com/items?itemName=hindlemail.cover)
