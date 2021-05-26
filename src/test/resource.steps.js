import { Given } from '@cucumber/cucumber'
import LinkHeader from 'http-link-header'

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals
} from 'unique-names-generator'
import logger from '../util/logger'
import MediaTypes from '../util/media-types'
import { API_ACCESS_PORT } from './config'

let pathCount = 0

const CUSTOM_HEADER_MEDIA_TYPE = 'application/custom+json'
const CUSTOM_LINK_HEADER_MEDIA_TYPE = 'application/custom-link+json'
const CUSTOM_BODY_MEDIA_TYPE = 'application/custom-body+json'
const CUSTOM_LINKS_BODY_MEDIA_TYPE = 'application/custom-body-links+json'
const LOCATION_LINK_MEDIA_TYPE = 'application/location+json'

export const randomApiPath = () => {
  return `/api/${pathCount++}-${uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals]
  })}`
}

export function createLinks (relationship, uri, method) {
  const links = new LinkHeader()
  links.set({
    rel: relationship,
    uri: uri,
    ...(method && { method })
  })
  return links
}

function sendResponse (
  response,
  status,
  links,
  linkTemplates,
  mediaType = 'application/json',
  curies,
  body
) {
  const bodyOperations = {}

  switch (mediaType) {
    case 'application/json':
      if (links) {
        response.header('link', links.toString())
      }
      if (linkTemplates) {
        response.header('link-template', linkTemplates.toString())
      }
      break
    case CUSTOM_HEADER_MEDIA_TYPE:
      response.header('custom-link', JSON.stringify(links.refs))
      break
    case CUSTOM_LINK_HEADER_MEDIA_TYPE:
      response.header('link', JSON.stringify(links.refs))
      break
    case LOCATION_LINK_MEDIA_TYPE:
      response.header('location', links.refs[0].uri)
      break
    case CUSTOM_BODY_MEDIA_TYPE:
      bodyOperations.customLinks = {}
      links.refs.forEach(reference => {
        bodyOperations.customLinks[reference.rel] = {
          href: reference.uri
        }
      })
      break
    case CUSTOM_LINKS_BODY_MEDIA_TYPE:
      bodyOperations._links = {}
      links.refs.forEach(reference => {
        bodyOperations._links[reference.rel] = {
          href: reference.uri
        }
      })
      break
    case MediaTypes.HAL:
      bodyOperations._links = {}
      if (links) {
        links.refs.forEach(link => {
          bodyOperations._links[link.rel] = { href: link.uri }
        })
      }
      if (linkTemplates) {
        linkTemplates.refs.forEach(link => {
          bodyOperations._links[link.rel] = { href: link.uri, templated: true }
        })
      }
      if (curies) {
        bodyOperations._links.curies = curies.map(curie => {
          return {
            name: curie.NAME,
            href: curie.HREF,
            templated: true
          }
        })
      }
      break
    case MediaTypes.SIREN:
      /*
      "links": [
        { "rel": [ "self" ], "href": "http://api.x.io/orders/42" },
        { "rel": [ "previous" ], "href": "http://api.x.io/orders/41" },
        { "rel": [ "next" ], "href": "http://api.x.io/orders/43" }
      ]
      */
      if (links) {
        bodyOperations.links = []
        links.refs.forEach(link => {
          bodyOperations.links.push({ rel: [link.rel], href: link.uri })
        })
      }

      if (linkTemplates) {
        bodyOperations.actions = []
        linkTemplates.refs.forEach(link => {
          const bodyParameters = JSON.parse(link['params*'].value)

          const sirenBodyParameters = Object.keys(bodyParameters).map(key => {
            return { name: key }
          })
          bodyOperations.actions.push({
            name: link.rel,
            href: link.uri,
            method: link.method,
            ...(link['accept*']?.value && { type: link['accept*'].value }),
            ...(link['params*']?.value && { fields: sirenBodyParameters })
          })
        })
      }
      break
  }
  if (mediaType !== LOCATION_LINK_MEDIA_TYPE) {
    response.header('content-type', mediaType)
  }

  response.status(status).send(
    Object.assign(
      body || {
        status
      },
      bodyOperations
    )
  )
}

function filterParameters (parameters, type) {
  return parameters?.filter(parameter_ => {
    return parameter_.TYPE === type
  })
}

function joinParameters (parameters, separator) {
  return parameters
    .map(parameter_ => {
      return parameter_.NAME
    })
    .join(separator)
}

async function createDynamicResourceRoute (
  route,
  relationship,
  method = 'GET',
  parameters = [],
  contentTypes,
  mediaType = 'application/json',
  headerToReturn
) {
  let dynamicRoutePath = route
  let dynamicUri = route
  // {/who,dub}
  const pathParameters = filterParameters(parameters, 'path')
  if (pathParameters.length > 0) {
    dynamicUri += `{/${joinParameters(pathParameters)}}`
    dynamicRoutePath += `/:${joinParameters(pathParameters, '/:')}`
  }
  // {?x,y}
  const queryParameters = filterParameters(parameters, 'query')
  if (queryParameters.length > 0) {
    dynamicUri += `{?${joinParameters(queryParameters)}}`
  }
  const dynamicRoute = await this.router.route(dynamicRoutePath)
  await dynamicRoute[method.toLowerCase()](async (request, response) => {
    // logger.debug('SENDING', method, route, { ...request.query })
    logger.debug('RECEIVED BODY', method, route, { ...request.body })
    const responseBody = Object.assign(
      {},
      request.body,
      request.query,
      request.params
    )
    if (contentTypes) {
      if (request.headers['content-type']?.startsWith('multipart/form-data')) {
        responseBody['content-type'] = 'multipart/form-data'
      } else {
        responseBody['content-type'] = request.headers['content-type']
      }
    }
    if (headerToReturn) {
      responseBody[headerToReturn] = request.headers[headerToReturn]
    }
    response.header('content-type', mediaType)
    response.status(200).send(responseBody)
  })

  const bodyParameters = {}
  const filteredBodyParameters = filterParameters(parameters, 'body')
  filteredBodyParameters.forEach(parameter_ => {
    bodyParameters[parameter_.NAME] = {}
  })

  const acceptArray = Array.isArray(contentTypes)
    ? contentTypes
    : [contentTypes]
  const accept =
    acceptArray.length === 0 ||
    // the default is application/x-www-form-urlencoded, so don't send it if that's what it's set to
    (acceptArray.length === 1 && acceptArray[0]) ===
      'application/x-www-form-urlencoded'
      ? undefined
      : acceptArray.join()
  const links = new LinkHeader()
  links.set({
    rel: relationship,
    uri: dynamicUri,
    method: method,
    ...(Object.keys(bodyParameters).length > 0 && {
      'params*': { value: JSON.stringify(bodyParameters) }
    }),
    ...(accept && {
      'accept*': { value: accept }
    })
  })

  const currentResourceRoute = randomApiPath()
  await createOkRouteWithLinks.bind(this)(
    currentResourceRoute,
    undefined,
    links,
    mediaType
  )
  return currentResourceRoute
}

async function createRouteWithLinks (
  rootRouter,
  route,
  status,
  links,
  linkTemplates,
  mediaType,
  curies,
  body
) {
  const router = await rootRouter.route(route)
  await router.get(async (request, response) => {
    sendResponse(
      response,
      status,
      links,
      linkTemplates,
      mediaType,
      curies,
      body
    )
  })
  return router
}

export async function createOkRouteWithLinks (
  route,
  links,
  linkTemplates,
  mediaType,
  curies,
  body
) {
  return createRouteWithLinks(
    this.router,
    route,
    200,
    links,
    linkTemplates,
    mediaType,
    curies,
    body
  )
}

async function createErrorRoute (route) {
  return createRouteWithLinks(this.router, route, 500)
}

async function createRandomDynamicResourceRoute (
  relationship,
  method,
  parameters,
  contentTypes,
  mediaType,
  headerToReturn
) {
  return createDynamicResourceRoute.bind(this)(
    randomApiPath(),
    relationship,
    method,
    parameters,
    contentTypes,
    mediaType,
    headerToReturn
  )
}

Given('a resource returning status code {int}', async function (status) {
  this.currentResourceRoute = randomApiPath()
  await createRouteWithLinks(this.router, this.currentResourceRoute, status)
  this.firstResourceRoute = `${this.baseUrl}${this.currentResourceRoute}`
})

Given('a resource with no operations', async function () {
  this.currentResourceRoute = randomApiPath()
  await createOkRouteWithLinks.bind(this)(this.currentResourceRoute)
})

Given('a resource with a {string} operation', async function (relationship) {
  this.currentResourceRoute = randomApiPath()
  await createOkRouteWithLinks.bind(this)(
    this.currentResourceRoute,
    createLinks(relationship, this.currentResourceRoute)
  )
})

Given(
  'a resource with a {string} operation that returns itself',
  async function (relationship) {
    await createResourceLinkingToSelf.bind(this)(relationship)
  }
)

Given(
  'a custom resource with a {string} header operation that returns itself',
  async function (relationship) {
    await createResourceLinkingToSelf.bind(this)(
      relationship,
      CUSTOM_HEADER_MEDIA_TYPE
    )
  }
)

Given(
  'a HAL resource returning the following with a {string} link that returns itself',
  async function (relationship, responseBody) {
    this.currentResourceRoute = randomApiPath()
    const links = {
      _links: { [relationship]: { href: this.currentResourceRoute } }
    }
    await createLinkingResource.bind(this)(responseBody, links, MediaTypes.HAL)
  }
)

Given(
  'a custom resource returning the following with a {string} body link that returns itself',
  async function (relationship, responseBody) {
    this.currentResourceRoute = randomApiPath()
    const links = {
      customLinks: { [relationship]: { href: this.currentResourceRoute } }
    }
    await createLinkingResource.bind(this)(
      responseBody,
      links,
      CUSTOM_BODY_MEDIA_TYPE
    )
  }
)

Given(
  'a Siren resource returning the following with a {string} link that returns itself',
  async function (relationship, responseBody) {
    this.currentResourceRoute = randomApiPath()
    const links = {
      links: [{ rel: ['self'], href: this.currentResourceRoute }]
    }
    await createLinkingResource.bind(this)(
      responseBody,
      links,
      MediaTypes.SIREN
    )
  }
)

Given('a resource returning', async function (responseBody) {
  this.previousResourceRoute = this.currentResourceRoute
  this.currentResourceRoute = randomApiPath()
  const router = await this.router.route(this.currentResourceRoute)
  await router.get(async (request, response) => {
    response.status(200).send(JSON.parse(responseBody))
  })
})

Given(
  'a HAL resource with {string} links to the two previous resources named {string} and {string}',
  async function (relationship, nameOne, nameTwo) {
    const _links = {
      [relationship]: [
        { href: this.previousResourceRoute, name: nameOne },
        { href: this.currentResourceRoute, name: nameTwo }
      ]
    }
    const halResourcePath = randomApiPath()
    const router = await this.router.route(halResourcePath)
    await router.get(async (request, response) => {
      response.header('content-type', MediaTypes.HAL)
      response.status(200).send({
        _links
      })
    })
    this.currentResourceRoute = halResourcePath
    logger.debug('THIS IS WHERE IT STARTS', halResourcePath)
  }
)

Given(
  'a resource with a {string} operation that returns an error',
  async function (relationship) {
    await createResourceLinkingToError.bind(this)(relationship)
  }
)

Given(
  'a custom resource with a {string} header operation that returns an error',
  async function (relationship) {
    await createResourceLinkingToError.bind(this)(
      relationship,
      CUSTOM_HEADER_MEDIA_TYPE
    )
  }
)

Given(
  'a HAL resource with a {string} operation that returns an error',
  async function (relationship) {
    await createResourceLinkingToError.bind(this)(relationship, MediaTypes.HAL)
  }
)

Given(
  'a Siren resource with a {string} operation that returns an error',
  async function (relationship) {
    await createResourceLinkingToError.bind(this)(
      relationship,
      MediaTypes.SIREN
    )
  }
)

async function createResourceLinkingToError (relationship, mediaType) {
  const errorResourcePath = randomApiPath()
  createErrorRoute.bind(this)(errorResourcePath, 500)
  this.currentResourceRoute = randomApiPath()
  await createOkRouteWithLinks.bind(this)(
    this.currentResourceRoute,
    createLinks(relationship, errorResourcePath),
    undefined,
    mediaType
  )
}

async function createResourceLinkingToSelf (relationship, mediaType) {
  this.currentResourceRoute = randomApiPath()
  const to = this.currentResourceRoute
  await createOkRouteWithLinks.bind(this)(
    this.currentResourceRoute,
    createLinks(relationship, to),
    undefined,
    mediaType
  )
}

function createCustomBodyLink (relationship, to) {
  return {
    customLinks: {
      [relationship]: { href: to }
    }
  }
}

Given(
  'a custom resource with a {string} body operation that returns an error',
  async function (relationship) {
    this.currentResourceRoute = randomApiPath()
    const links = createCustomBodyLink(
      relationship,
      `${this.baseUrl.replace(
        // eslint-disable-next-line security/detect-non-literal-regexp -- not regex DoS vulnerable
        new RegExp(`(:${API_ACCESS_PORT})?$`),
        ':33556'
      )}/api`
    )
    createLinkingResource.bind(this)(undefined, links, CUSTOM_BODY_MEDIA_TYPE)
  }
)

async function createLinkingResource (responseBody, links, mediaType) {
  const router = await this.router.route(this.currentResourceRoute)
  await router.get(async (request, response) => {
    response.header('content-type', mediaType)
    const linkedBody = Object.assign(JSON.parse(responseBody || '{}'), links)
    logger.debug('sending linked body', JSON.stringify(linkedBody))
    response.status(200).send(linkedBody)
  })
}

async function createResourceToPrevious (relationship, mediaType, curies) {
  const links = createLinks(relationship, this.currentResourceRoute)
  this.currentResourceRoute = randomApiPath()
  await createOkRouteWithLinks.bind(this)(
    this.currentResourceRoute,
    links,
    undefined,
    mediaType,
    curies
  )
}

Given(
  'a resource with a {string} operation that returns that resource',
  async function (relationship) {
    await createResourceToPrevious.bind(this)(relationship)
  }
)

Given(
  'a HAL resource with a {string} operation that returns that resource',
  async function (relationship) {
    await createResourceToPrevious.bind(this)(relationship, MediaTypes.HAL)
  }
)

Given(
  'a Siren resource with a {string} operation that returns that resource',
  async function (relationship) {
    await createResourceToPrevious.bind(this)(relationship, MediaTypes.SIREN)
  }
)

Given(
  'a custom resource with a {string} body operation that returns that resource',
  async function (relationship) {
    await createResourceToPrevious.bind(this)(
      relationship,
      CUSTOM_BODY_MEDIA_TYPE
    )
  }
)

Given(
  'a custom resource with a {string} header link operation that returns that resource',
  async function (relationship) {
    await createResourceToPrevious.bind(this)(
      relationship,
      CUSTOM_LINK_HEADER_MEDIA_TYPE
    )
  }
)

Given(
  'a custom resource with a {string} body _links operation that returns that resource',
  async function (relationship) {
    await createResourceToPrevious.bind(this)(
      relationship,
      CUSTOM_LINKS_BODY_MEDIA_TYPE
    )
  }
)

Given(
  'a custom resource with a {string} header operation that returns that resource',
  async function (relationship) {
    await createResourceToPrevious.bind(this)(
      relationship,
      CUSTOM_HEADER_MEDIA_TYPE
    )
  }
)

async function createListOfResources (count, relationship, mediaType) {
  // we add the last one first
  this.currentResourceRoute = randomApiPath()
  await createOkRouteWithLinks.bind(this)(this.currentResourceRoute)
  this.lastOnList = `${this.baseUrl}${this.currentResourceRoute}`
  for (let index = 1; index < count; index++) {
    // and then point each on to the previously created resource
    const previousResourceRoute = this.currentResourceRoute
    this.currentResourceRoute = randomApiPath()
    await createOkRouteWithLinks.bind(this)(
      this.currentResourceRoute,
      createLinks(relationship, previousResourceRoute),
      undefined,
      mediaType
    )
  }
  // POST: this.currentResourceRoute points to the first resource in the list
}

Given(
  'a list of {int} resources linked with {string} operations',
  async function (count, relationship) {
    createListOfResources.bind(this)(count, relationship)
  }
)

Given(
  'a list of {int} HAL resources linked with {string} operations',
  async function (count, relationship) {
    createListOfResources.bind(this)(count, relationship, MediaTypes.HAL)
  }
)

Given(
  'a list of {int} Siren resources linked with {string} operations',
  async function (count, relationship) {
    createListOfResources.bind(this)(count, relationship, MediaTypes.SIREN)
  }
)

Given(
  'a resource with a {string} operation that returns the provided {string} {string} parameter',
  async function (relationship, parameter, parameterType) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute.bind(
      this
    )(relationship, 'GET', [{ NAME: parameter, TYPE: parameterType }])
  }
)

Given(
  'a HAL resource with a {string} operation that returns the provided {string} {string} parameter',
  async function (relationship, parameter, parameterType) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute.bind(
      this
    )(
      relationship,
      'GET',
      [{ NAME: parameter, TYPE: parameterType }],
      undefined,
      MediaTypes.HAL
    )
  }
)

Given(
  'a resource with a {string} operation with the {string} method returning status code {int}',
  async function (relationship, method, statusCode) {
    this.currentResourceRoute = randomApiPath()
    const links = new LinkHeader()
    links.set({
      rel: relationship,
      uri: this.currentResourceRoute,
      method
    })
    await createOkRouteWithLinks
      .bind(this)(this.currentResourceRoute, undefined, links)
      .then(addRouteToStaticResource(method, statusCode))
  }
)

Given(
  'a resource with a {string} operation with the {string} method returning a location to that resource',
  async function (relationship, method) {
    // three routes here.
    // this.currentResourceRoute is the path of the resource that location should point too. It already exists
    // second route when invoked, returns location
    // third route, returns a resource with the operation

    const previousResourceRoute = this.currentResourceRoute
    this.currentResourceRoute = randomApiPath()
    const links = createLinks(relationship, this.currentResourceRoute, method)
    const locationLinks = new LinkHeader()
    locationLinks.set({
      uri: previousResourceRoute
    })

    await createOkRouteWithLinks
      .bind(this)(this.currentResourceRoute, undefined, links)
      .then(
        addRouteToStaticResource(
          method,
          200,
          locationLinks,
          LOCATION_LINK_MEDIA_TYPE
        )
      )
  }
)

Given(
  'a resource with a {string} operation with the {string} method that returns the provided {string} {string} parameter',
  async function (relationship, method, parameter, parameterType) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute.bind(
      this
    )(relationship, method, [{ NAME: parameter, TYPE: parameterType }])
  }
)

Given(
  'a resource with a {string} operation with the {string} method that returns the provided {string} {string} parameter and the content type, accepting:',
  async function (
    relationship,
    method,
    parameter,
    parameterType,
    contentTypes
  ) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute.bind(
      this
    )(
      relationship,
      method,
      [{ NAME: parameter, TYPE: parameterType }],
      contentTypes.rows()
    )
  }
)

Given(
  'a resource with a {string} operation with the {string} method that returns the following provided parameters',
  async function (relationship, method, dataTable) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute.bind(
      this
    )(relationship, method, dataTable.hashes())
  }
)

Given(
  'a HAL resource with a {string} operation with the {string} method that returns the following provided parameters',
  async function (relationship, method, dataTable) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute.bind(
      this
    )(relationship, method, dataTable.hashes(), undefined, MediaTypes.HAL)
  }
)

Given(
  'a resource with a {string} operation with the {string} method that returns the following {string} provided parameters and the content type',
  async function (relationship, method, contentType, dataTable) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute.bind(
      this
    )(relationship, method, dataTable.hashes(), contentType)
  }
)

Given(
  'a Siren resource with a {string} operation with the {string} method that returns the following {string} provided parameters and the content type',
  async function (relationship, method, contentType, dataTable) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute.bind(
      this
    )(relationship, method, dataTable.hashes(), contentType, MediaTypes.SIREN)
  }
)

Given(
  'a HAL resource with a {string} operation that returns that resource and has the following curies',
  async function (relationship, curies) {
    await createResourceToPrevious.bind(this)(
      relationship,
      MediaTypes.HAL,
      curies.hashes()
    )
  }
)

Given(
  'a resource with a {string} operation returns the provided {string} header',
  async function (relationship, headerName) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute.bind(
      this
    )(relationship, undefined, undefined, undefined, undefined, headerName)
  }
)

function addRouteToStaticResource (method, statusCode, links, mediaType) {
  return route => {
    route[method.toLowerCase()](async (request, response) => {
      sendResponse(response, statusCode, links, undefined, mediaType)
    })
  }
}

Given(
  'a resource with a {string} operation with the URI {string}',
  async function (relationship, uri) {
    this.currentResourceRoute = randomApiPath()
    const links = new LinkHeader()
    links.set({
      rel: relationship,
      uri: uri
    })
    await createOkRouteWithLinks.bind(this)(this.currentResourceRoute, links)
  }
)

Given('a resource with the operations', async function (dataTable) {
  this.currentResourceRoute = randomApiPath()
  const links = new LinkHeader()
  for (const row of dataTable.hashes()) {
    const tidied = {}
    for (const key in row) {
      if (row[key]) {
        tidied[key] = row[key]
      }
    }
    links.set(tidied)
  }
  await createOkRouteWithLinks.bind(this)(this.currentResourceRoute, links)
})

Given('a resource at {string}', async function (path) {
  this.currentResourceRoute = path
  await createOkRouteWithLinks.bind(this)(this.currentResourceRoute)
  this.firstResourceRoute = `${this.baseUrl}${this.currentResourceRoute}`
})

Given(
  'a resource with a {string} operation with the URI {string} and the body',
  async function (relationship, path, body) {
    this.currentResourceRoute = randomApiPath()
    const links = new LinkHeader()
    links.set({
      rel: relationship,
      uri: path
    })

    await createOkRouteWithLinks.bind(this)(
      this.currentResourceRoute,
      links,
      undefined,
      undefined,
      undefined,
      JSON.parse(body)
    )
  }
)

Given('a resource  with the body {string} and the links', async function (
  body,
  dataTable
) {
  this.currentResourceRoute = randomApiPath()
  const links = createLinksFromDataTable(dataTable)

  const router = await this.router.route(this.currentResourceRoute)
  await router.get(async (request, response) => {
    response.header('link', links.toString())
    response.status(200).send(JSON.parse(body))
  })
})

Given('a resource  with no body and the links', async function (dataTable) {
  this.currentResourceRoute = randomApiPath()
  const links = createLinksFromDataTable(dataTable)

  const router = await this.router.route(this.currentResourceRoute)
  await router.get(async (request, response) => {
    response.header('link', links.toString())
    response.status(200).send()
  })
})

function createLinksFromDataTable (dataTable) {
  const links = new LinkHeader()
  for (const row of dataTable.hashes()) {
    links.set({
      rel: row.rel,
      uri: row.uri,
      ...(row.anchor && { anchor: row.anchor })
    })
  }
  return links
}
