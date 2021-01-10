import { Given, Before } from '@cucumber/cucumber'
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

async function createDynamicResourceRoute (
  route,
  relationship,
  method,
  parameter,
  parameterType,
  contentTypes,
  parameters
) {
  let dynamicRoutePath = route
  if (parameterType === 'path') {
    dynamicRoutePath = `${route}/:${parameter}`
  }
  let dynamicUri = route
  if (parameterType === 'query') {
    dynamicUri = `${route}{?${parameter}}`
  } else if (parameterType === 'path') {
    dynamicUri = `${route}{/${parameter}}`
  } else if (parameters) {
    // {?x,y}
    dynamicUri = `${route}{?${parameters
      .filter(parameter_ => {
        return parameter_.TYPE === 'query'
      })
      .map(parameter_ => {
        return parameter_.NAME
      })
      .join()}}`
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
    if (contentTypes !== undefined) {
      if (request.headers['content-type'].startsWith('multipart/form-data')) {
        responseBody['content-type'] = 'multipart/form-data'
      } else {
        responseBody['content-type'] = request.headers['content-type']
      }
    }
    response.status(200).send(responseBody)
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
    ...(parameterType === 'body' && {
      'params*': { value: JSON.stringify({ [parameter]: {} }) }
    }),
    ...(accept && {
      'accept*': { value: accept }
    })
  })

  this.currentResourceRoute = randomApiPath()
  await this.createRouteWithLinks(
    this.currentResourceRoute,
    200,
    undefined,
    links
  )
}

Before(async function () {
  this.createRouteWithLinks = async function (
    route,
    status,
    links,
    linkTemplates
  ) {
    const router = await this.router.route(route)
    await router.get(async (request, response) => {
      this.sendResponse(response, status, links, linkTemplates)
    })
    return router
  }

  this.createRoute = async function (route, status, relationship, linkPath) {
    if (relationship) {
      const links = this.createLinks(relationship, linkPath)
      return this.createRouteWithLinks(route, status, links)
    } else {
      return this.createRouteWithLinks(route, status)
    }
  }

  this.createDynamicResourceRoute = createDynamicResourceRoute.bind(this)

  this.createLinks = function (relationship, uri) {
    const links = new LinkHeader()
    links.set({
      rel: relationship,
      uri: uri
    })
    return links
  }

  this.sendResponse = function (response, status, links, linkTemplates) {
    if (links) {
      response.header('link', links.toString())
    }
    if (linkTemplates) {
      response.header('link-template', linkTemplates.toString())
    }
    response.status(status).send({ status })
  }
})

Given('a resource returning status code {int}', async function (status) {
  this.currentResourceRoute = randomApiPath()
  await this.createRoute(this.currentResourceRoute, status)
  this.firstResourceRoute = `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}${this.currentResourceRoute}`
})

Given('a resource with no operations', async function () {
  this.currentResourceRoute = randomApiPath()
  await this.createRouteWithLinks(this.currentResourceRoute, 200)
})

Given('a resource with a {string} operation', async function (relationship) {
  this.currentResourceRoute = randomApiPath()
  await this.createRoute(this.currentResourceRoute, 200, relationship)
})

Given(
  'a resource with a {string} operation that returns itself',
  async function (relationship) {
    this.currentResourceRoute = randomApiPath()
    await this.createRoute(
      this.currentResourceRoute,
      200,
      relationship,
      this.currentResourceRoute
    )
  }
)

Given(
  'a resource with a {string} operation that returns an error',
  async function (relationship) {
    this.currentResourceRoute = randomApiPath()
    await this.createRoute(
      this.currentResourceRoute,
      200,
      relationship,
      `http://${API_ACCESS_HOST}:33556/api`
    )
  }
)

Given(
  'a resource with a {string} operation that returns that resource',
  async function (relationship) {
    const previousResourceRoute = this.currentResourceRoute
    this.currentResourceRoute = randomApiPath()
    await this.createRoute(
      this.currentResourceRoute,
      200,
      relationship,
      previousResourceRoute
    )
  }
)

Given(
  'a list of {int} resources linked with {string} operations',
  async function (count, relationship) {
    // we add the last one first
    this.currentResourceRoute = randomApiPath()
    await this.createRoute(this.currentResourceRoute, 200)
    this.lastOnList = `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}${this.currentResourceRoute}`
    for (let index = 1; index < count; index++) {
      // and then point each on to the previously created resource
      const previousResourceRoute = this.currentResourceRoute
      this.currentResourceRoute = randomApiPath()
      await this.createRoute(
        this.currentResourceRoute,
        200,
        relationship,
        previousResourceRoute
      )
    }
    // POST: this.currentResourceRoute points to the first resource in the list
  }
)

Given(
  'a resource with a {string} operation that returns the provided {string} {string} parameter',
  async function (relationship, parameter, parameterType) {
    await this.createDynamicResourceRoute(
      randomApiPath(),
      relationship,
      'GET',
      parameter,
      parameterType
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
    await this.createRouteWithLinks(
      this.currentResourceRoute,
      200,
      undefined,
      links
    ).then(route => {
      route[method.toLowerCase()](async (request, response) => {
        this.sendResponse(response, statusCode)
      })
    })
  }
)

Given(
  'a resource with a {string} operation with the {string} method that returns the provided {string} {string} parameter',
  async function (relationship, method, parameter, parameterType) {
    await this.createDynamicResourceRoute(
      randomApiPath(),
      relationship,
      method,
      parameter,
      parameterType
    )
  }
)

Given(
  'a resource with a {string} operation with the {string} method that returns the {string} provided {string} {string} parameter and the content type',
  async function (relationship, method, contentType, parameter, parameterType) {
    await this.createDynamicResourceRoute(
      randomApiPath(),
      relationship,
      method,
      parameter,
      parameterType,
      contentType
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
    await this.createDynamicResourceRoute(
      randomApiPath(),
      relationship,
      method,
      parameter,
      parameterType,
      contentTypes.rows()
    )
  }
)

Given(
  'a resource with a {string} operation with the {string} method that returns the following provided parameters',
  async function (relationship, method, dataTable) {
    const parameters = dataTable.hashes()
    await this.createDynamicResourceRoute(
      randomApiPath(),
      relationship,
      method,
      undefined,
      undefined,
      undefined,
      parameters
    )
  }
)
