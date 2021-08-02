# waychaser

Client library for HATEOAS level 3 RESTful APIs that provide hypermedia controls using:
  - Link ([RFC8288](https://tools.ietf.org/html/rfc8288)) and [Link-Template](https://mnot.github.io/I-D/link-template/) headers.
  - [HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08) 
  - [Siren](https://github.com/kevinswiber/siren)

This [isomorphic](https://en.wikipedia.org/wiki/Isomorphic_JavaScript) library is compatible with Node.js 10.x, 12.x and 14.x, Chrome, Firefox, Safari, Edge and even IE.
<img alt="aw yeah!" src="./docs/images/aw_yeah.gif" width="20" height="20" />

[![License](https://img.shields.io/github/license/mountain-pass/waychaser?logo=apache)](https://github.com/mountain-pass/waychaser/blob/master/LICENSE) [![npm](https://img.shields.io/npm/v/@mountainpass/waychaser?logo=npm)](https://www.npmjs.com/package/@mountainpass/waychaser) [![npm downloads](https://img.shields.io/npm/dm/@mountainpass/waychaser?logo=npm)](https://www.npmjs.com/package/@mountainpass/waychaser)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmountain-pass%2Fwaychaser.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmountain-pass%2Fwaychaser?ref=badge_shield)

[![Build Status](https://img.shields.io/github/workflow/status/mountain-pass/waychaser/Build?logo=github)](https://github.com/mountain-pass/waychaser/actions?query=workflow%3ABuild) [![BrowserStack Status](https://img.shields.io/badge/dynamic/json?label=BrowserStack&query=%24.status&url=https%3A%2F%2Fautomate.browserstack.com%2Fapi%2Fv1%2Fpublic-builds%2FM2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ%3D%3D--8a61c301655735baed333d4f305980a13ef32c25&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAACfFBMVEX////ocDTobzToVzroOzznQT3lSj7mUkLud072ql3ocDTnbDbhdkbzllf5wmLobzTnbzT0oFn3wGHnbzTocTP5t2DnbzT4vmHobzT6vWLobzT7u2HocDT7vGLpejr5vWHtjkT3vmH0rlf3vGD3wWPulUj3v2H3vGD3v2H3vGD3vWD3wGL3vGD3vGD3vGD3wGL3vWD3vmH3vGD3vWD3v2L3wWL3wWL3wGL3vmHnPjvkUUDTmlm8vGi2xWXAwknRpDroPTngaFWvybZlyeE3ut8jt9xQvMyFyIC2zjnZlEbnVjfiU1Gyz9NSwu4Ss9xEnLZFl68AqM8Asttyu3Kx0DrgnkvnbzTnPTrOqaF/0/NArdBOYGcjHyAkISJoc3kjosYjsrB/wEbGxELyrlroaDPkTUi70NRvxuZefo14enzFxshNXmgAscBntlGnykPrvFXoZjPiV0631t59yeVWZG1EREZKSkw4PkMbsL1ltVCTxUbnx1PoaTPeVkSvz82b1utogI1MX2tJuK9qtkmRxEjpw1LobDLiUzektY+t4faYx9hXX2Q/RkxrrcV3vXlktkmjxEXxt1TmazLsXjW1iEiKzq+x3fGr1+uas8GTrb2Yyt+KxZlptklsvk7MtkH5slrpbTPjYziSpEp2xIaYzrSbz7+Uyq2Bv3hmtkphvE+ut0LumUb5vmLmaDLqazPjazihnUJptUleukxbukpeukp4uk26qD/qgzr4tFztkUXpaTLqaDTXfjnAkD+6lUDHkD3ffDTudzj1rlj3wGHxo1DqfzvnbjTqZzLsYzHtZDLtbjbwjUT2uF33wGLzrVfxoU/wn07yp1P1tlz3wWLShVqMAAAAOXRSTlMBE3XD5+3r05k5Rd39lwtB97sLEd+ZbzXBm+PT6efl583Tj5kt+/0zi5MHr7UJBYv5+5Exj83l5c0M9lQxAAABD0lEQVQY02NgYGBgZGJmYWVj5+BkgAAubksraxtbO3seXj4Qn1/AwdHJ2cXVzd3DU1CIgUFYxMvbx9fPPyAwKDgkVJSBQSwsPCIyKjomNi4+ITEpWZxBIiU1LT0jJiYzKzsnNy9fkkGqoLCouCQmprSsvKKyqlqaQaamtq6+IQYIGpuaW1plGeTa2js6u7pjYnp6+/onTJRnUJg0ecrUadNnzJw1e87cefMVGZTCFixctHjJ0mXLV6xctXqNMoOK6tp16zds3LR5y9Zt23eoqTMwaOyctGv3nr379h84eOiwJtDpWtpHjh47fuLkqdNnzurogjyjp29w7vyFi5cuGxrpQv1rbGJqZm6hqQ5iAwBfVVxc6RHpXAAAAABJRU5ErkJggg==)](https://automate.browserstack.com/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25)

[![GitHub issues](https://img.shields.io/github/issues/mountain-pass/waychaser?logo=github)](https://github.com/mountain-pass/waychaser/issues) [![GitHub pull requests](https://img.shields.io/github/issues-pr/mountain-pass/waychaser?logo=github)](https://github.com/mountain-pass/waychaser/pulls)

[![Quality](https://img.shields.io/codacy/grade/940768d54f7545f7b42f89b26c23c751?logo=codacy)](https://www.codacy.com/gh/mountain-pass/waychaser/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mountain-pass/waychaser&amp;utm_campaign=Badge_Grade) [![Coverage](https://img.shields.io/codacy/coverage/940768d54f7545f7b42f89b26c23c751?logo=codacy)](https://www.codacy.com/gh/mountain-pass/waychaser/dashboard?utm_source=github.com&utm_medium=referral&utm_content=mountain-pass/waychaser&utm_campaign=Badge_Coverage)

[![source code vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/mountain-pass/waychaser?label=source%20code%20vulnerabilities&logo=snyk)](https://snyk.io/test/github/mountain-pass/waychaser) [![npm package vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@mountainpass/waychaser@4.0.32?label=npm%20package%20vulnerabilties&logo=snyk)](https://snyk.io/test/npm/@mountainpass/waychaser/4.0.32)


[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

![I love badges](https://img.shields.io/badge/%E2%99%A5%20i%20love-%20badges-green?logo=heart)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

| <img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg" alt="Node.js" width="24px" height="24px" /><br/>Node.js | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br/>Chrome](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22chrome%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br/>Firefox](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22firefox%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br/>Safari](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22safari%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /><br/>Edge](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22edge%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS" width="24px" height="24px" /><br/>iOS](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?oses=[{%22os%22:%22ios%22}]) | [<img src="https://source.android.com/setup/images/Android_symbol_green_RGB.svg" alt="Android" width="24px" height="24px" /><br/>Android](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?oses=[{%22os%22:%22android%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png" alt="IE" width="24px" height="24px" /><br/>IE](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22ie%22}]) |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10.x, 12.x, 14.x                                                                                                                       | latest version                                                                                                                                                                                                                                                                                                                                                                                              | latest version                                                                                                                                                                                                                                                                                                                                                                                                   | latest version                                                                                                                                                                                                                                                                                                                                                                                              | latest version                                                                                                                                                                                                                                                                                                                                                                                    | latest version                                                                                                                                                                                                                                                                                                                                                                                    | latest version                                                                                                                                                                                                                                                                                                                                                                    | 11                                                                                                                                                                                                                                                                                                                                                                                                                                      |

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmountain-pass%2Fwaychaser.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmountain-pass%2Fwaychaser?ref=badge_large)

# ToC

- [waychaser](#waychaser)
- [ToC](#toc)
- [Usage](#usage)
  - [Node.js](#nodejs)
  - [Browser](#browser)
  - [Getting the response](#getting-the-response)
    - [Getting the response body](#getting-the-response-body)
  - [Requesting linked resources](#requesting-linked-resources)
    - [Multiple links with the same relationship](#multiple-links-with-the-same-relationship)
  - [Forms](#forms)
    - [Query forms](#query-forms)
    - [Path parameter forms](#path-parameter-forms)
    - [Request body forms](#request-body-forms)
    - [DELETE, POST, PUT, PATCH](#delete-post-put-patch)
- [Examples](#examples)
  - [HAL](#hal)
  - [Siren](#siren)
- [Upgrading from 1.x to 2.x](#upgrading-from-1x-to-2x)
  - [Removal of Loki](#removal-of-loki)
    - [Operation count](#operation-count)
    - [Finding operations](#finding-operations)
- [Upgrading from 2.x to 3.x](#upgrading-from-2x-to-3x)
  - [Accept Header](#accept-header)
    - [Handlers](#handlers)
  - [Error responses](#error-responses)
  - [Invoking missing operations](#invoking-missing-operations)
  - [Handling location headers](#handling-location-headers)
- [Upgrading from 3.x to 4.x](#upgrading-from-3x-to-4x)

# Usage

## Node.js

```bash
npm install @mountainpass/waychaser
```

```js
import { WayChaser } from '@mountainpass/waychaser'

//...
const waychaser = new WayChaser()
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
  src="https://unpkg.com/@mountainpass/waychaser@4.0.32"
></script>

...
<script type="text/javascript">
  var waychaser = new window.waychaser.WayChaser()
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

## Getting the response

WayChaser makes it's http requests using `fetch` and the `Fetch.Response` is available via the `response` property.

For example
```js
const responseUrl = apiResource.response.url
```

### Getting the response body

WayChaser makes the response body available via the `body()` async method.

For example
```js
const responseUrl = await apiResource.body()
```
## Requesting linked resources

Level 3 REST APIs are expected to return links to related resources. WayChaser expects to find these links via [RFC 8288](https://tools.ietf.org/html/rfc8288) `link` headers, [`link-template`](https://mnot.github.io/I-D/link-template/) headers, [HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08)  `_link` elements or [Siren](https://github.com/kevinswiber/siren) `link` elements.

WayChaser provides methods to simplify requesting these linked resources.

For instance, if the `apiResource` we loaded above has a `next`  `link` like any of the following:

**Link header:**
```
Link: <https://api.waychaser.io/example?p=2>; rel="next";
```
**HAL**
```json
{
  "_links": {
    "next": { "href": "https://api.waychaser.io/example?p=2" }
  }
}
```
**Siren**
```json
{
  "links": [
    { "rel": [ "next" ], "href": "https://api.waychaser.io/example?p=2" },
  ]
}
```

then that `next` page can be retrieved using the following code

```js
const nextResource = await apiResource.invoke('next')
```

You don't need to tell waychaser whether to use Link headers, HAL `_links` or Siren `links`; it will figure it out 
based on the resource's media-type. If the media-type is `application/hal+json` if will try to parse the links in the 
`_link` property of the body.  If the media-type is `application/vnd.siren+json` if will try to parse the links in the 
`link` property of the body.

Regardless of the resource's media-type, it will always try to parse the links in the `Link` and `Link-Template` 
headers.

### Multiple links with the same relationship

Resources can have multiple links with the same `rel`ationship, such as

**HAL**
```json
{
  "_links": {
    "item": [{
      "href": "/first_item",
      "name": "first"
    },{
      "href": "/second_item",
      "name": "second"
    }]
  }
}
```

If you know the `name` of the resource, then waychaser can load it using the following code

```js
const firstResource = await apiResource.invoke({ rel: 'item', name: 'first' })
```

## Forms

### Query forms

Support for query forms is provided via:
- [RFC6570](https://tools.ietf.org/html/rfc6570) URI Templates in:
  - [`link-template`](https://mnot.github.io/I-D/link-template/) headers, and
  - [HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08) `_link`s.
 
For instance if our resource has either of the following

**Link-Template header:**
```
Link-Template: <https://api.waychaser.io/search{?q}>; rel="search";
```
**HAL**
```json
{
  "_links": {
    "search": { "href": "https://api.waychaser.io/search{?q}" }
  }
}
```

Then waychaser can execute a search for "waychaser" with the following code

```js
const searchResultsResource = await apiResource.invoke('search', {
  q: 'waychaser'
})
```

### Path parameter forms

Support for query forms is provided via:
- [RFC6570](https://tools.ietf.org/html/rfc6570) URI Templates in:
  - [`link-template`](https://mnot.github.io/I-D/link-template/) headers, and
  - [HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08) `_link`s.
 
For instance if our resource has either of the following

**Link-Template header**
```
Link-Template: <https://api.waychaser.io/users{/username}>; rel="item";
```
**HAL**
```json
{
  "_links": {
    "item": { "href": "https://api.waychaser.io/users{/username}" }
  }
}
```

Then waychaser can retrieve the user with the `username` "waychaser" with the following code

```js
const userResource = await apiResource.invoke('item', {
  username: 'waychaser'
})
```

### Request body forms

Support for request body forms is provided via:
- An extended form of [`link-template`](https://mnot.github.io/I-D/link-template/) headers, and
- Siren `actions`.

To support request body forms with [`link-template`](https://mnot.github.io/I-D/link-template/) headers, waychaser
supports three additional parameters in the `link-template` header:
- `method` - used to specify the HTTP method to use
- `params*` - used to specify the fields the form expects
- `accept*` - used to specify the media-types that can be used to send the body as per,
[RFC7231](https://tools.ietf.org/html/rfc7231) and defaulting to `application/x-www-form-urlencoded`

If our resource has either of the following:

**Link-Template header:**
```
Link-Template: <https://api.waychaser.io/users>; 
  rel="https://waychaser.io/rels/create-user"; 
  method="POST";
  params*=UTF-8'en'%7B%22username%22%3A%7B%7D%7D'
```

If your wondering what the `UTF-8'en'%7B%22username%22%3A%7B%7D%7D'` part is, it's just the JSON `{"username":{}}`
encoded as an [Extension Attribute](https://tools.ietf.org/html/rfc8288#section-3.4.2) as per
 ([RFC8288](https://tools.ietf.org/html/rfc8288)) Link Headers. Don't worry, libraries like 
 [http-link-header](https://www.npmjs.com/package/http-link-header) can do this encoding for you.

**Siren**
```json
{
  "actions": [
    {
      "name": "https://waychaser.io/rels/create-user",
      "href": "https://api.waychaser.io/users",
      "method": "POST",
      "fields": [
        { "name": "username" }
      ]
    }
  ]
}
```
Then waychaser can create a new user with the `username` "waychaser" with the following code

```js
const createUserResultsResource = await apiResource.invoke('https://waychaser.io/rels/create-user', {
  username: 'waychaser'
})
```

**NOTE:** The URL `https://waychaser.io/rels/create-user` in the above code is **NOT** the end-point the form is 
posted to. That URL is a custom [Extension Relation](https://tools.ietf.org/html/rfc8288#section-2.1.2) that identifies
the semantics of the operation. In the example above, the form will be posted to `https://api.waychaser.io/users`

### DELETE, POST, PUT, PATCH

As mentioned above, waychaser supports `Link` and `Link-Template` headers that include `method` properties, 
to specify the HTTP method the client must use to execute the relationship.

For instance if our resource has the following link

**Link header:**
```
Link: <https://api.waychaser.io/example/some-resource>; rel="https://api.waychaser.io/rel/delete"; method="DELETE";
```

Then the following code

```js
const deletedResource = await apiResource.invoke('https://waychaser.io/rel/delete')
```

will send a HTTP `DELETE` to `https://api.waychaser.io/example/some-resource`.

**NOTE**: The `method` property is not part of the specification for Link

([RFC8288](https://tools.ietf.org/html/rfc8288)) or [Link-Template](https://mnot.github.io/I-D/link-template/) headers.
This means that if you use waychaser with a server that provides this headers and it uses the `method` property
for something else, then you're going to need a custom handler.

# Examples

## HAL

The following code demonstrates using waychaser with the REST API for AWS API Gateway to download the 'Error' 
schema from 'test-waychaser' gateway 

```js
import { waychaser, halHandler, MediaTypes } from '@mountainpass/waychaser'
import fetch from 'isomorphic-fetch'
import aws4 from 'aws4'


// AWS makes us sign each request. This is a fetcher that does that automagically for us.
/**
 * @param url
 * @param options
 */
function awsFetch (url, options) {
  const parsedUrl = new URL(url)
  const signedOptions = aws4.sign(
    Object.assign(
      {
        host: parsedUrl.host,
        path: `${parsedUrl.pathname}?${parsedUrl.searchParams}`,
        method: 'GET'
      },
      options
    )
  )
  return fetch(url, signedOptions)
}

// Now we tell waychaser, to only accept HAL and to use our fetcher.
const awsWayChaser = waychaser.use(halHandler, MediaTypes.HAL).withFetch(awsFetch)

// now we can load the API
const api = await waychaser.load(
  'https://apigateway.ap-southeast-2.amazonaws.com/restapis'
)

// then we can find the gateway we're after
const gateway = await api.ops
  .filter('item')
  .findInRelated({ name: 'test-waychaser' })

// then we can get the models
const models = await gateway.invoke(
  'http://docs.aws.amazon.com/apigateway/latest/developerguide/restapi-restapi-models.html'
)

// then we can find the schema we're after 
const model = await models.ops
  .filter('item')
  .findInRelated({ name: 'Error' })

// and now we get the schema
const schema = JSON.parse((await model.body()).schema)
```


**NOTE:** While the above is a legit, and it works ([here's the test](./src/test/hal-example.feature)), for full
use of the AWS API Gateway REST API, you're going to need a custom handler.

This is because HAL links are supposed retrieved using a HTTP GET, but many of the AWS API Gateway REST API links
require using [POST](https://docs.aws.amazon.com/apigateway/api-reference/link-relation/restapi-create/), 
[PATCH](https://docs.aws.amazon.com/apigateway/api-reference/link-relation/restapi-update/) or 
[DELETE](https://docs.aws.amazon.com/apigateway/api-reference/link-relation/restapi-delete/) HTTP methods. 

But there's nothing in AWS API Gateway links to tell you when to use a different HTTP method. Instead it's 
communicated out-of-band in AWS API Gateway documentation. If you write a custom handler, please let me know 👍


## Siren

While admittedly this is a toy example, the following code demonstrates using waychaser to complete the 
[*Hypermedia in the Wizard's Tower* text-based adventure game](https://github.com/einarwh/hyperwizard).

But even though it's a game, it shows how waychaser can easily navigate a complex process, including `POST`ing data and
`DELETE`ing resources.

```js
  return waychaser
    .load('http://hyperwizard.azurewebsites.net/hywit/void')
    .then(current =>
      current.invoke('start-adventure', {
        name: 'waychaser',
        class: 'Burglar',
        race: 'waychaser',
        gender: 'Male'
      })
    )
    .then(current => {
      if (current.response.status <= 500) return current.invoke('related')
      else throw new Error('Server Error')
    })
    .then(current => current.invoke('north'))
    .then(current => current.invoke('pull-lever'))
    .then(current =>
      current.invoke({ rel: 'move', title: 'Cross the bridge.' })
    )
    .then(current => current.invoke('move'))
    .then(current => current.invoke('look'))
    .then(current => current.invoke('eat-snacks'))
    .then(current => current.invoke('related'))
    .then(current => current.invoke('north'))
    .then(current => current.invoke('pull-lever'))
    .then(current => current.invoke('look'))
    .then(current => current.invoke('eat-snacks'))
    .then(current => current.invoke('enter'))
    .then(current => current.invoke('answer-skull', { master: 'Edsger' }))
    .then(current => current.invoke('east'))
    .then(current => current.invoke('smash-mirror-1') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-2') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-3') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-4') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-5') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-6') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('smash-mirror-7') || current)
    .then(current => current.invoke('related') || current)
    .then(current => current.invoke('look'))
    .then(current => current.invoke('enter-mirror'))
    .then(current => current.invoke('north'))
    .then(current => current.invoke('down'))
    .then(current => current.invoke('take-book-3'))
```

# Upgrading from 1.x to 2.x

## Removal of Loki

Loki is no longer use for storing operations and has been replaced with an subclass of `Array`. We originally 
introduced Loki it's querying capability, but it turned out to be far to large a dependency.

### Operation count

Previously you could get the number of operations on a resource by calling

```js
apiResource.count()
```

For 2.x, replace this with 

```js
apiResource.length
```

### Finding operations

To find an operation, instead of using

```js
apiResource.operations.findOne(relationship)
// or
apiResource.operations.findOne({ rel: relationship })
// or
apiResource.ops.findOne(relationship)
// or
apiResource.ops.findOne({ rel: relationship })
```

use 

```js
apiResource.operations.find(relationship)
// or
apiResource.operations.find({ rel: relationship })
// or
apiResource.operations.find(operation => {
  return operation.rel === relationship
})
// or
apiResource.ops.find(relationship)
// or
apiResource.ops.find({ rel: relationship })
// or
apiResource.ops.find(operation => {
  return operation.rel === relationship
})
```

Additionally when invoking an operation, you can use an array finder function as well. e.g. the following are all
equivalent

```js
await apiResource.invoke(relationship)
await apiResource.invoke({ rel: relationship })
await apiResource.invoke(operation => {
  return operation.rel === relationship
})
await apiResource.operations.invoke(relationship)
await apiResource.operations.invoke({ rel: relationship })
await apiResource.operations.invoke(operation => {
  return operation.rel === relationship
})
await apiResource.ops.invoke(relationship)
await apiResource.ops.invoke({ rel: relationship })
await apiResource.ops.invoke(operation => {
  return operation.rel === relationship
})
await apiResource.operations.find(relationship).invoke()
await apiResource.operations.find({ rel: relationship }).invoke()
await apiResource.operations.find(operation => {
  return operation.rel === relationship
}).invoke()
await apiResource.ops.find(relationship).invoke()
await apiResource.ops.find({ rel: relationship }).invoke()
await apiResource.ops.find(operation => {
  return operation.rel === relationship
}).invoke()
```

**NOTE**: When `findOne` could not find an operation, `null` was returned, whereas when `find` cannot find an operation
it returns `undefined`

# Upgrading from 2.x to 3.x

## Accept Header

waychaser now automatically provides an `accept` header in requests.

The accept header can be overridden for individual requests, by including an alternate `header.accept` value in the
 `options` parameter when calling the `invoke` method.

### Handlers

The `use` method now expects both a `handler` and the `mediaType` it can handle. WayChaser uses the provided 
mediaTypes to automatically generate the `accept` request header. 

**NOTE:** Currently waychaser does use the corresponding `content-type` header to filter the responses passed to
handlers. **THIS MAY CHANGE IN THE FUTURE.** Handlers should only process responses that match the mediaType provided
when they are registered using the `use` method.

## Error responses

In 2.x waychaser would throw an `Error` if `response.ok` was false. This is no longer the case as some APIs provide
hypermedia responses for 4xx and 5xx responses.

Code like the following

```js
try {
  return apiResource.invoke(relationship)
} catch(error) {
  if( error.response ) {
    // handle error response...
  }
  else {
    // handle fetch error
  }
}
```

should be replaced with

```js
try {
  const resource = await apiResource.invoke(relationship)
  if( resource.response.ok ) {
    return resource
  }
  else {
    // handle error response...
  }
} catch(error) {
  // handle fetch error
}
```

or if there is no special processing needed for error responses

```js
try {
  return apiResource.invoke(relationship)
} catch(error) {
  // handle fetch error
}
```

## Invoking missing operations

In 2.x invoking an operation that didn't exist would throw an error, leading to code like

```js
const found = apiResource.ops.find(relationship)
if( found ) {
  return found.invoke()
}
else {
  // handle op missing
}
```

In 3.x invoking an operation that doesn't exist returns `undefined`, allowing for simpler code, as follows

```js
const resource = await apiResource.invoke(relationship)
if( resource === undefined ) {
  // handle operation missing 
}
```

or

<!-- eslint-skip -->
```js
return apiResource.invoke(relationship) || //... return a default
```

**NOTE:** When we say it returns `undefined` we actually mean `undefined`, **NOT** a promise the resolves
to `undefined`. This is what makes the `...invoke(rel) || default` code possible.

## Handling location headers

WayChaser 3.x now includes a `location` header hander, which will create an operation with the `related` relationship.
This allows support for APIs that, when creating a resource (ie using POST), provide a `location` to the created 
resource in the response, or APIs that, when updating a resource (ie using PUT or PATCH),  provide a `location` to the
updated resource in the response.

# Upgrading from 3.x to 4.x

Previously WayChaser provided a default instance via the `waychaser` export. This is no longer the case and you will
need to create your own instance using `new WayChaser()`