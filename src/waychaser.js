import fetch from 'isomorphic-fetch'
import { polyfill } from 'es6-promise'
import Loki from 'lokijs'
import logger from './util/logger'
import { URI } from 'uri-template-lite'
import qsStringify from 'qs-stringify'
import Accept from '@hapi/accept'
import FormData from 'form-data'
import { halHandler } from './handlers/hal/hal-handler'
import { linkHeaderHandler } from './handlers/link-header/link-header-handler'
import { linkTemplateHeaderHandler } from './handlers/link-template-header/link-template-header-handler'
import { sirenLinkHandler } from './handlers/siren/siren-link-handler'
import { sirenActionHandler } from './handlers/siren/siren-action-handler'
polyfill()

/**
 * Loads the resource at the provided url using fetch
 *
 * @param {URL} url url of the resource to load
 * @param {object} options options to pass to fetch
 *
 * @param handlers
 * @returns {waychaser.ApiResourceObject} a ApiResourceObject representing the loaded resource
 *
 * @throws {Error} If the server returns with a status >= 400
 */
async function loadResource (url, options, handlers) {
  logger.waychaser(`loading ${url} with:`)
  logger.waychaser(JSON.stringify(options, undefined, 2))
  const response = await fetch(url, options)
  if (!response.ok) {
    logger.waychaser(`Bad response from server ${JSON.stringify(response)}`)
    throw new Error('Bad response from server', response)
  }
  logger.waychaser(
    `Good response from server ${JSON.stringify(
      response
    )}, ${response.headers.get('content-type')}`
  )
  /* istanbul ignore next: IE fails without this, but IE doesn't report coverage */
  if (response.url === undefined || response.url === '') {
    // in ie url is not being populated 🤷‍♂️
    response.url = url.toString()
  }
  const links = []
  let body
  for (const handler of handlers) {
    const handledLinks = await handler(response, async () => {
      if (!body) {
        body = await response.json()
      }
      return body
    })
    if (handledLinks) {
      links.push(...handledLinks)
    }
  }
  return new waychaser.ApiResourceObject(response, body, links, handlers)
}

/**
 * @param {Loki.Collection} operations the target loki collection to load the operations into
 * @param {LinkHeader} links the links to load
 * @param {fetch.Response} baseUrl the response object that the {@param links} are relative to.
 * @param handlers
 */
function addLinksToOperations (operations, links, baseUrl, handlers) {
  operations.insert(
    links.map(link => {
      const operation = new InvokableOperation(baseUrl, handlers)
      // we want the link properties in the root of the Operation, so
      // we can search loki for them using those properties
      Object.assign(operation, link)
      return operation
    })
  )
}

class InvokableOperation {
  constructor (baseUrl, handlers) {
    logger.waychaser(`Operation callingContext ${JSON.stringify(this.baseUrl)}`)
    this.baseUrl = baseUrl
    this.handlers = handlers
  }

  async invoke (context, options) {
    const parameters = this['params*']?.value
      ? JSON.parse(this['params*']?.value)
      : {}
    logger.waychaser(parameters)
    const contextUrl = this.baseUrl
    const expandedUri = URI.expand(this.uri, context || {})
    logger.waychaser(`loading ${expandedUri}`)

    const invokeUrl = new URL(expandedUri, contextUrl)
    const body = {}
    Object.keys(parameters).forEach(key => {
      body[key] = context[key]
    })
    logger.waychaser(
      `invoking ${invokeUrl} with body ${
        this['params*']?.value ? JSON.stringify(body) : undefined
      }`
    )
    const contentType = Accept.mediaType(
      this['accept*']?.value || 'application/x-www-form-urlencoded',
      [
        'application/x-www-form-urlencoded',
        'application/json',
        'multipart/form-data'
      ]
    )
    let encodedContent
    switch (contentType) {
      case 'application/x-www-form-urlencoded':
        encodedContent = qsStringify(body)
        break
      case 'application/json':
        encodedContent = JSON.stringify(body)
        break
      case 'multipart/form-data':
        encodedContent = new FormData()
        for (const name in body) {
          encodedContent.append(name, body[name])
        }
        break
    }
    let headers
    if (this['params*']?.value && contentType !== 'multipart/form-data') {
      headers = {
        'Content-Type': contentType
      }
    }

    return loadResource(
      invokeUrl,
      Object.assign(
        {
          method: this.method,
          headers,
          ...(this['params*']?.value && {
            body: encodedContent
          })
        },
        options
      ),
      this.handlers
    )
  }
}

Loki.Collection.prototype.findOne_ = Loki.Collection.prototype.findOne

Loki.Collection.prototype.findOne = function (...arguments_) {
  return arguments_.length === 1 && typeof arguments_[0] === 'string'
    ? this.findOne_({ rel: arguments_[0] })
    : this.findOne_(...arguments_)
}

Loki.Collection.prototype.invoke = async function (
  relationship,
  context,
  options
) {
  const operation = this.findOne(relationship)
  logger.waychaser(
    `operation ${JSON.stringify(relationship)}:`,
    JSON.stringify(operation, undefined, 2)
  )
  logger.waychaser('context:', JSON.stringify(context, undefined, 2))
  return operation.invoke(context, options)
}

/** @namespace */
const waychaser = {
  /**
   * Loads an API
   *
   * @param {URL} url - the URL of the API to load
   * @param {object} options - options to pass to fetch
   *
   * @returns {waychaser.ApiResourceObject} a ApiResourceObject representing the loaded resource
   *
   * @throws {Error} If the server returns with a status >= 400
   */
  load: async function (url, options) {
    return loadResource(url, options, this.defaultHandlers)
  },

  defaultHandlers: [
    linkHeaderHandler,
    linkTemplateHeaderHandler,
    halHandler,
    sirenLinkHandler,
    sirenActionHandler
  ],

  use: function (handler) {
    return new waychaser.Loader(handler)
  },

  useDefaultHanders () {
    return new waychaser.Loader(waychaser.defaultHandlers)
  },

  Loader: class {
    constructor (handler) {
      this.handlers = [handler]
      this.logger = waychaser.logger
    }

    useDefaultHanders () {
      this.use(waychaser.defaultHandlers)
      return this
    }

    use (handler) {
      if (Array.isArray(handler)) {
        this.handlers.push(...handler)
      } else {
        this.handlers.push(handler)
      }
      return this
    }

    async load (url, options) {
      return loadResource(url, options, this.handlers)
    }
  },

  logger: logger.waychaser,

  ApiResourceObject: class {
    constructor (response, body, links, handlers) {
      this.response = response
      this._body = body
      const linkDatabase = new Loki()
      this.operations = linkDatabase.addCollection()
      addLinksToOperations(this.operations, links, response.url, handlers)
    }

    get ops () {
      return this.operations
    }

    async invoke (relationship, context) {
      return this.operations.invoke(relationship, context)
    }

    async body () {
      if (!this.response.bodyUsed) {
        this._body = await this.response.json()
      }
      return this._body
    }
  }
}

export { waychaser }
