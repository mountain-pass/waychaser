import logger from './util/logger'
import { halHandler } from './handlers/hal/hal-handler'
import { linkHeaderHandler } from './handlers/link-header/link-header-handler'
import { sirenHandler } from './handlers/siren/siren-handler'
import { loadResource } from './util/load-resource'
import { Operation } from './operation'
import { parseAccept } from './util/parse-accept'
import MediaTypes from './util/media-types'
import fetch from 'cross-fetch'
import { locationHeaderHandler } from './handlers/location-header/location-header-handler'

/**
 * @param fetch
 */
function bodyStoringFetch (fetch) {
  return function (url, options) {
    return fetch(url, options).then(response => {
      response.originalJson = response.json
      response.json = async function () {
        logger.waychaser('getting json')
        // WARNING when `await this.json()` is called multiple times, `this.bodyused` can be set to true
        // BEFORE the original `await this.json()` returns
        // TL;DR bodyUsed cannot be trusted
        // to prevent the above funkyness, instead of trying to cache the returned value
        // we cache the promise
        if (this.bodyReadPromise) {
          return await this.bodyReadPromise
        } else {
          this.bodyReadPromise = this.originalJson()
          return await this.bodyReadPromise
        }
      }
      return response
    })
  }
}

class WayChaser {
  constructor (
    handler = WayChaser.defaultHandlers,
    mediaRange = WayChaser.defaultMediaRanges,
    fetcher = WayChaser.defaultFetcher,
    logger = WayChaser.logger
  ) {
    this.waychaserContext = {
      handlers: Array.isArray(handler) ? handler : [handler],
      mediaRanges: Array.isArray(mediaRange) ? mediaRange : [mediaRange],
      fetcher: bodyStoringFetch(fetcher)
    }
  }

  /* eslint-disable jsdoc/no-undefined-types -- Resource is the return type of loadResource.
     js/doc linting should be smarter */
  /**
   * Loads an API
   *
   * @param {URL} url - the URL of the API to load
   * @param {object} options - options to pass to fetch
   * @returns {Resource} a Resource object representing the loaded resource
   * @throws {Error} If the server returns with a status >= 400
   */
  /* eslint-enable jsdoc/no-undefined-types */
  async load (url, options) {
    return loadResource(url, options, this.waychaserContext)
  }

  static defaultHandlers = [
    locationHeaderHandler,
    linkHeaderHandler,
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
      this.waychaserContext.handlers.push(handler)
      if (Array.isArray(mediaRange)) {
        this.waychaserContext.mediaRanges.push(...mediaRange)
      } else {
        this.waychaserContext.mediaRanges.push(mediaRange)
      }
      return this
    }
  }

  withFetch (fetcher) {
    this.waychaserContext.fetcher = bodyStoringFetch(fetcher)
    return this
  }

  useDefaultHandlers () {
    this.waychaserContext.handlers.push(...WayChaser.defaultHandlers)
    this.waychaserContext.mediaRanges.push(...WayChaser.defaultMediaRanges)
    return this
  }
}

const waychaser = WayChaser.defaultWaychaser

export { WayChaser, waychaser, Operation, parseAccept }
