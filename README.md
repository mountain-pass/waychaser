# waychaser

Client library for HATEOAS level 3 RESTful APIs that provide hypermedia controls using:
  - Link ([RFC8288](https://tools.ietf.org/html/rfc8288)) and [Link-Template](https://mnot.github.io/I-D/link-template/) headers.
  - [HAL](https://tools.ietf.org/html/draft-kelly-json-hal-08) 
  - [Siren](https://github.com/kevinswiber/siren)

This [isomorphic](https://en.wikipedia.org/wiki/Isomorphic_JavaScript) library is compatible with Node.js 12.x, 14.x and 16.x, Chrome, Firefox, Safari and Edge.
 
| <img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg" alt="Node.js" width="24px" height="24px" /><br/>Node.js | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /><br/>Chrome](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22chrome%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /><br/>Firefox](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22firefox%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /><br/>Safari](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22safari%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /><br/>Edge](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?browsers=[{%22browser%22:%22edge%22}]) | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS" width="24px" height="24px" /><br/>iOS](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?oses=[{%22os%22:%22ios%22}]) | [<img src="https://source.android.com/setup/images/Android_symbol_green_RGB.svg" alt="Android" width="24px" height="24px" /><br/>Android](https://automate.browserstack.com/dashboard/v2/public-build/M2lUc2Q3VFJicFR2c0N6Y0JvZE5oSXAvYlpUQ1ZPMXgxalpUK2ZtNTdPcz0tLVR3QzU5TXllbEZnemhqK2Z5VEpVQ2c9PQ==--8a61c301655735baed333d4f305980a13ef32c25?oses=[{%22os%22:%22android%22}]) |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | 
| 12.x, 14.x, 16.x                                                                                                                       | latest version                                                                                                                                                                                                                                                                                                                                                                                              | latest version                                                                                                                                                                                                                                                                                                                                                                                                   | latest version                                                                                                                                                                                                                                                                                                                                                                                              | latest version                                                                                                                                                                                                                                                                                                                                                                                    | latest version                                                                                                                                                                                                                                                                                                                                                                                    | latest version                                                                                                                                                                                                                                                                                                                                                                    | 

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
  - [Problem vs WayChaserResponse](#problem-vs-waychaserresponse)

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
  src="https://unpkg.com/@mountainpass/waychaser@5.0.11"
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
import fetch from 'cross-fetch'
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


## Problem vs WayChaserResponse

Problems can be client side or server side

Client side
 - fetch throws exception - No Response 
 - can't parse response - Has Response
 - can parse response, but the type predicate fails - Has Response

Server side
 - server returns problem document - Has Response

Response may include links that tell the client how to resolve,
so we want it to be a WayChaserResponse

Options:
1. invoke returns WayChaserResponse with problem or content
   - client uses content !== undefined && problem === undefined to check if the were not problems
   - unclear if we got a problem or not
2. invoke returns a clean WayChaserResponse with content or a WayChaserProblem with a problem document
  - client would need to use instanceOf to differentiate
  - clean WayChaserResponse has a response and content (which could be expectedly undefined)
  - WayChaserProblem has a problem document and may or may not have a response
3. invoke returns a clean WayChaserResponse or a ProblemDocument with optional waychaser response as extention
  - client would need to use instanceOf to differentiate
  - if server returns PD, then do we wrap the PD? Feels ugly

