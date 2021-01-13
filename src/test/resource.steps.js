import { Given } from '@cucumber/cucumber'
import LinkHeader from 'http-link-header'
import { API_ACCESS_HOST, API_ACCESS_PORT } from './config'

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals
} from 'unique-names-generator'
import logger from '../util/logger'

let pathCount = 0

const randomApiPath = () => {
  return `/api/${pathCount++}-${uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals]
  })}`
}

function createLinks (relationship, uri) {
  const links = new LinkHeader()
  links.set({
    rel: relationship,
    uri: uri
  })
  return links
}

function sendResponse (response, status, links, linkTemplates, mode) {
  if (links && mode === undefined) {
    response.header('link', links.toString())
  }
  if (linkTemplates && mode === undefined) {
    response.header('link-template', linkTemplates.toString())
  }
  let halLinks
  if (mode === 'application/hal+json') {
    halLinks = {}
    links.refs.forEach(link => {
      halLinks[link.rel] = { href: link.uri }
    })
    response.header('content-type', mode)
  }
  response.status(status).send({
    status,
    ...(mode === 'application/hal+json' && { _links: halLinks })
  })
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
  rootRouter,
  route,
  relationship,
  method,
  parameters,
  contentTypes
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
  const dynamicRoute = await rootRouter.route(dynamicRoutePath)
  await dynamicRoute[method.toLowerCase()](async (request, response) => {
    // logger.debug('SENDING', method, route, { ...request.query })
    logger.debug('RECEIVED BODY', method, route, { ...request.body })
    const responseBody = Object.assign(
      {},
      request.body,
      request.query,
      request.params
    )
    if (contentTypes !== undefined) {
      if (request.headers['content-type'].startsWith('multipart/form-data')) {
        responseBody['content-type'] = 'multipart/form-data'
      } else {
        responseBody['content-type'] = request.headers['content-type']
      }
    }
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
  await createOkRouteWithLinks(
    rootRouter,
    currentResourceRoute,
    undefined,
    links
  )
  return currentResourceRoute
}

async function createRouteWithLinks (
  rootRouter,
  route,
  status,
  links,
  linkTemplates,
  mode
) {
  const router = await rootRouter.route(route)
  await router.get(async (request, response) => {
    sendResponse(response, status, links, linkTemplates, mode)
  })
  return router
}

async function createOkRouteWithLinks (
  rootRouter,
  route,
  links,
  linkTemplates,
  mode
) {
  return createRouteWithLinks(
    rootRouter,
    route,
    200,
    links,
    linkTemplates,
    mode
  )
}

async function createRandomDynamicResourceRoute (
  rootRouter,
  relationship,
  method,
  parameters,
  contentTypes
) {
  return createDynamicResourceRoute(
    rootRouter,
    randomApiPath(),
    relationship,
    method,
    parameters,
    contentTypes
  )
}

Given('a resource returning status code {int}', async function (status) {
  this.currentResourceRoute = randomApiPath()
  await createRouteWithLinks(this.router, this.currentResourceRoute, status)
  this.firstResourceRoute = `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}${this.currentResourceRoute}`
})

Given('a resource with no operations', async function () {
  this.currentResourceRoute = randomApiPath()
  await createOkRouteWithLinks(this.router, this.currentResourceRoute)
})

Given('a resource with a {string} operation', async function (relationship) {
  this.currentResourceRoute = randomApiPath()
  await createOkRouteWithLinks(
    this.router,
    this.currentResourceRoute,
    createLinks(relationship)
  )
})

Given(
  'a resource with a {string} operation that returns itself',
  async function (relationship) {
    this.currentResourceRoute = randomApiPath()
    const to = this.currentResourceRoute
    await createOkRouteWithLinks(
      this.router,
      this.currentResourceRoute,
      createLinks(relationship, to)
    )
  }
)

Given(
  'a HAL resource returning the following with a {string} link that returns itself',
  async function (relationship, responseBody) {
    this.currentResourceRoute = randomApiPath()
    const to = this.currentResourceRoute
    const router = await this.router.route(this.currentResourceRoute)
    await router.get(async (request, response) => {
      response.header('content-type', 'application/hal+json')
      response.status(200).send(
        Object.assign(JSON.parse(responseBody), {
          _links: { self: { href: to } }
        })
      )
    })
  }
)

Given(
  'a resource with a {string} operation that returns an error',
  async function (relationship) {
    this.currentResourceRoute = randomApiPath()
    const to = `http://${API_ACCESS_HOST}:33556/api`
    await createOkRouteWithLinks(
      this.router,
      this.currentResourceRoute,
      createLinks(relationship, to)
    )
  }
)

Given(
  'a HAL resource with a {string} operation that returns an error',
  async function (relationship) {
    this.currentResourceRoute = randomApiPath()
    const to = `http://${API_ACCESS_HOST}:33556/api`
    const router = await this.router.route(this.currentResourceRoute)
    await router.get(async (request, response) => {
      response.header('content-type', 'application/hal+json')
      response.status(200).send({
        _links: { [relationship]: { href: to } }
      })
    })
  }
)

Given(
  'a resource with a {string} operation that returns that resource',
  async function (relationship) {
    const links = createLinks(relationship, this.currentResourceRoute)
    this.currentResourceRoute = randomApiPath()
    await createOkRouteWithLinks(this.router, this.currentResourceRoute, links)
  }
)

Given(
  'a HAL resource with a {string} operation that returns that resource',
  async function (relationship) {
    const links = createLinks(relationship, this.currentResourceRoute)
    this.currentResourceRoute = randomApiPath()
    await createOkRouteWithLinks(
      this.router,
      this.currentResourceRoute,
      links,
      undefined,
      'application/hal+json'
    )
  }
)

Given(
  'a list of {int} resources linked with {string} operations',
  async function (count, relationship) {
    // we add the last one first
    this.currentResourceRoute = randomApiPath()
    await createOkRouteWithLinks(this.router, this.currentResourceRoute)
    this.lastOnList = `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}${this.currentResourceRoute}`
    for (let index = 1; index < count; index++) {
      // and then point each on to the previously created resource
      const previousResourceRoute = this.currentResourceRoute
      this.currentResourceRoute = randomApiPath()
      await createOkRouteWithLinks(
        this.router,
        this.currentResourceRoute,
        createLinks(relationship, previousResourceRoute)
      )
    }
    // POST: this.currentResourceRoute points to the first resource in the list
  }
)

Given(
  'a resource with a {string} operation that returns the provided {string} {string} parameter',
  async function (relationship, parameter, parameterType) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute(
      this.router,
      relationship,
      'GET',
      [{ NAME: parameter, TYPE: parameterType }]
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
    await createOkRouteWithLinks(
      this.router,
      this.currentResourceRoute,
      undefined,
      links
    ).then(route => {
      route[method.toLowerCase()](async (request, response) => {
        sendResponse(response, statusCode)
      })
    })
  }
)

Given(
  'a resource with a {string} operation with the {string} method that returns the provided {string} {string} parameter',
  async function (relationship, method, parameter, parameterType) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute(
      this.router,
      relationship,
      method,
      [{ NAME: parameter, TYPE: parameterType }]
    )
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
    this.currentResourceRoute = await createRandomDynamicResourceRoute(
      this.router,
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
    this.currentResourceRoute = await createRandomDynamicResourceRoute(
      this.router,
      relationship,
      method,
      dataTable.hashes()
    )
  }
)

Given(
  'a resource with a {string} operation with the {string} method that returns the following {string} provided parameters and the content type',
  async function (relationship, method, contentType, dataTable) {
    this.currentResourceRoute = await createRandomDynamicResourceRoute(
      this.router,
      relationship,
      method,
      dataTable.hashes(),
      contentType
    )
  }
)
