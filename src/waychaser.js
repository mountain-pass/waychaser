import fetch from 'isomorphic-fetch'
import { polyfill } from 'es6-promise'
import LinkHeader from 'http-link-header'
import Loki from 'lokijs'
import logger from './util/logger'
polyfill()

/**
 * Loads the resouce at the provided url using fetch
 *
 * @param {URL} url url of the resource to load
 * @param {object} options options to pass to fetch
 *
 * @returns {waychaser.ApiResourceObject} a ApiResourceObject representing the loaded resource
 *
 * @throws {Error} If the server returns with a status >= 400
 */
function loadResource (url, options) {
  logger.waychaser(`loading ${url}`)
  return fetch(url, options).then(response => {
    if (!response.ok) {
      logger.waychaser(`Bad response from server ${JSON.stringify(response)}`)
      throw new Error('Bad response from server', response)
    }
    logger.waychaser(`Good response from server ${JSON.stringify(response)}`)
    /* istanbul ignore next: IE fails without this, but IE doesn't report coverage */
    if (response.url === undefined || response.url === '') {
      // in ie url is not being populated 🤷‍♂️
      response.url = url.toString()
    }
    return new waychaser.ApiResourceObject(response)
  })
}

class Operation {
  constructor (callingContext) {
    logger.waychaser(
      `Operation callingContext ${JSON.stringify(this.callingContext)}`
    )
    this.callingContext = callingContext
  }

  async invoke (context, options) {
    const contextUrl = this.callingContext.url
    const invokeUrl = new URL(this.uri, contextUrl)
    logger.waychaser(`invoking ${invokeUrl}`)
    return loadResource(invokeUrl, options)
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
  logger.waychaser(JSON.stringify(operation, undefined, 2))
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
    return loadResource(url, options)
  },

  logger: logger.waychaser,

  ApiResourceObject: class {
    constructor (response) {
      logger.waychaser('creating ARO', response)
      this.response = response
      const linkHeader = response.headers.get('link')
      const linkDatabase = new Loki()
      this.operations = linkDatabase.addCollection()
      if (linkHeader) {
        const links = LinkHeader.parse(linkHeader)

        this.operations.insert(
          links.refs.map(reference => {
            const operation = new Operation(response)
            Object.assign(operation, reference)
            return operation
          })
        )
      }
    }

    get ops () {
      return this.operations
    }

    async invoke (relationship) {
      return this.operations.invoke(relationship)
    }
  }
}

export { waychaser }
