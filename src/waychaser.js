import { polyfill } from 'es6-promise'
import Loki from 'lokijs'
import logger from './util/logger'
import { halHandler } from './handlers/hal/hal-handler'
import { linkHeaderHandler } from './handlers/link-header/link-header-handler'
import { linkTemplateHeaderHandler } from './handlers/link-template-header/link-template-header-handler'
import { sirenHandler } from './handlers/siren/siren-handler'
import { loadResource } from './util/load-resource'
import { Operation } from './operation'

polyfill()

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
   * @returns {ApiResourceObject} a ApiResourceObject representing the loaded resource
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
    sirenHandler
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

  logger: logger.waychaser
}

export { waychaser, Operation }
