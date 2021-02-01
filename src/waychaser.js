import logger from './util/logger'
import { halHandler } from './handlers/hal/hal-handler'
import { linkHeaderHandler } from './handlers/link-header/link-header-handler'
import { linkTemplateHeaderHandler } from './handlers/link-template-header/link-template-header-handler'
import { sirenHandler } from './handlers/siren/siren-handler'
import { loadResource } from './util/load-resource'
import { Operation } from './operation'
import { parseAccept } from './util/parse-accept'

/** @namespace */
const waychaser = {
  /* eslint-disable jsdoc/no-undefined-types -- Resource is the return type of loadResource.
     js/doc linting should be smarter */
  /**
   * Loads an API
   *
   * @param {URL} url - the URL of the API to load
   * @param {object} options - options to pass to fetch
   * @returns {Resource} a Resource object representing the loaded resource
   *
   * @throws {Error} If the server returns with a status >= 400
   */
  /* eslint-enable jsdoc/no-undefined-types */
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

  Loader: class {
    constructor (handler) {
      this.handlers = [handler]
      this.logger = waychaser.logger
    }

    useDefaultHandlers () {
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

export { waychaser, Operation, parseAccept }
