import logger from './util/logger'
import { halHandler } from './handlers/hal/hal-handler'
import { linkHeaderHandler } from './handlers/link-header/link-header-handler'
import { linkTemplateHeaderHandler } from './handlers/link-template-header/link-template-header-handler'
import { sirenHandler } from './handlers/siren/siren-handler'
import { loadResource } from './util/load-resource'
import { Operation } from './operation'
import { parseAccept } from './util/parse-accept'
import MediaTypes from './util/media-types'
import fetch from 'isomorphic-fetch'
import { locationHeaderHandler } from './handlers/location-header/location-header-handler'

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
    return loadResource(
      url,
      options,
      this.defaultHandlers,
      this.defaultMediaRanges,
      this.defaultFetcher
    )
  },

  defaultHandlers: [
    locationHeaderHandler,
    linkHeaderHandler,
    linkTemplateHeaderHandler,
    halHandler,
    sirenHandler
  ],

  defaultMediaRanges: [
    'application/json',
    '*/*;q=0.8',
    MediaTypes.HAL,
    MediaTypes.SIREN
  ],

  use: function (handler, mediaRange) {
    return new waychaser.Loader(handler, mediaRange, this.defaultFetcher)
  },

  defaultFetcher: fetch,

  // withFetcher (fetcher) {
  //   return new waychaser.Loader(this.defaultHandlers, fetcher)
  // },

  Loader: class {
    constructor (handler, mediaRange, fetcher) {
      this.handlers = [handler]
      this.mediaRanges = Array.isArray(mediaRange) ? mediaRange : [mediaRange]
      this.logger = waychaser.logger
      this.fetcher = fetcher
    }

    useDefaultHandlers () {
      this.handlers.push(...waychaser.defaultHandlers)
      this.mediaRanges.push(...waychaser.defaultMediaRanges)
      return this
    }

    use (handler, mediaRange) {
      this.handlers.push(handler)
      if (Array.isArray(mediaRange)) {
        this.mediaRanges.push(...mediaRange)
      } else {
        this.mediaRanges.push(mediaRange)
      }
      return this
    }

    // withFetcher (fetcher) {
    //   this.fetcher = fetcher
    //   return this
    // }

    async load (url, options) {
      return loadResource(
        url,
        options,
        this.handlers,
        this.mediaRanges,
        this.fetcher
      )
    }
  },

  logger: logger.waychaser
}

export { waychaser, Operation, parseAccept }
