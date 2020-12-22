import { Given, Before } from 'cucumber'
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
  return (
    `/api/${pathCount++}-${
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals]
    })}`
  )
}

Before(async function () {
  this.createRoute = async function (route, status, relationship, linkPath) {
    if (relationship) {
      const links = this.createLinks(relationship, linkPath)
      await this.router.route(route).get(async (request, response) => {
        this.sendResponse(response, status, links)
      })
    } else {
      await this.router.route(route).get(async (request, response) => {
        this.sendResponse(response, status)
      })
    }
    return route
  }

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
      response
        .header('link', links.toString())
    }
    if (linkTemplates) {
      response
        .header('link-template', linkTemplates.toString())
    }
    response.status(status)
      .send({ status })
  }
})

Given('a resource returning status code {int}', async function (status) {
  this.currentResourceRoute = await this.createRoute(randomApiPath(), status)
  this.firstResourceRoute = `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}${this.currentResourceRoute}`
})

Given('a resource with no operations', async function () {
  this.currentResourceRoute = randomApiPath()
  await this.router
    .route(this.currentResourceRoute)
    .get(async (request, response) => {
      response.status(200).send({ status: 200 })
    })
})

Given('a resource with a {string} operation', async function (relationship) {
  this.currentResourceRoute = await this.createRoute(
    randomApiPath(),
    200,
    relationship
  )
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
    this.currentResourceRoute = await this.createRoute(
      randomApiPath(),
      200,
      relationship,
      `http://${API_ACCESS_HOST}:33556/api`
    )
  }
)

Given(
  'a resource with a {string} operation that returns that resource',
  async function (relationship) {
    this.currentResourceRoute = await this.createRoute(
      randomApiPath(),
      200,
      relationship,
      this.currentResourceRoute
    )
  }
)

Given('a list of {int} resources linked with {string} operations', async function (count, relationship) {
  // we add the last one first
  this.currentResourceRoute = await this.createRoute(
    randomApiPath(),
    200
  )
  this.lastOnList = `http://${API_ACCESS_HOST}:${API_ACCESS_PORT}${this.currentResourceRoute}`
  for (let index = 1; index < count; index++) {
    // and then point each on to the previously created resource
    this.currentResourceRoute = await this.createRoute(
      randomApiPath(),
      200,
      relationship,
      this.currentResourceRoute
    )
  }
  // POST: this.currentResourceRoute points to the first resource in the list
})

Given('a resource with a {string} operation that returns the provided {string} parameter', async function (relationship, parameter) {
  const dynamicResourceRoute = randomApiPath()
  await this.router.route(dynamicResourceRoute).get(async (request, response) => {
    logger.debug('SENDING', dynamicResourceRoute, { ...request.query })
    response
      .status(200)
      .send({ ...request.query })
  })
  const links = new LinkHeader()
  links.set({
    rel: relationship,
    uri: `${dynamicResourceRoute}{?${parameter}}`
  })

  this.currentResourceRoute = randomApiPath()
  await this.router.route(this.currentResourceRoute).get(async (request, response) => {
    this.sendResponse(response, 200, undefined, links)
  })
})
