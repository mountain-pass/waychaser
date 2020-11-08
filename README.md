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
- [ ] add CONTRIBUTING.md
- [ ] automatically update version number in README.md
- [ ] badges
- [ ] create docs site
  - [ ] integrate Code coverage and code quality reporting 
  - [ ] integrate API docs
- [ ] have pull requests from fork run node-api and chrome local (nto sure how to tell if PR from fork)
- [ ] lots more 😂

