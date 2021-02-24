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

class WayChaser {
  constructor (
    handler = WayChaser.defaultHandlers,
    mediaRange = WayChaser.defaultMediaRanges,
    fetcher = WayChaser.defaultFetcher,
    logger = WayChaser.logger
  ) {
    this.handlers = Array.isArray(handler) ? handler : [handler]
    this.mediaRanges = Array.isArray(mediaRange) ? mediaRange : [mediaRange]
    this.logger = logger
    this.fetcher = fetcher
  }

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
  async load (url, options) {
    return loadResource(
      url,
      options,
      this.handlers,
      this.mediaRanges,
      this.fetcher
    )
  }

  static defaultHandlers = [
    locationHeaderHandler,
    linkHeaderHandler,
    linkTemplateHeaderHandler,
    halHandler,
    sirenHandler
  ]

  static defaultFetcher = fetch

  static logger = logger.waychaser

  static defaultMediaRanges = [
    'application/json',
    '*/*;q=0.8',
    MediaTypes.HAL,
    MediaTypes.SIREN
  ]

  static defaultWaychaser = new WayChaser()

  use (handler, mediaRange) {
    if (this === WayChaser.defaultWaychaser) {
      return new WayChaser(handler, mediaRange)
    } else {
      this.handlers.push(handler)
      if (Array.isArray(mediaRange)) {
        this.mediaRanges.push(...mediaRange)
      } else {
        this.mediaRanges.push(mediaRange)
      }
      return this
    }
  }

  withFetch (fetcher) {
    this.fetcher = fetcher
    return this
  }

  useDefaultHandlers () {
    this.handlers.push(...WayChaser.defaultHandlers)
    this.mediaRanges.push(...WayChaser.defaultMediaRanges)
    return this
  }
}

const waychaser = WayChaser.defaultWaychaser

export { WayChaser, waychaser, Operation, parseAccept }
