import fetch from 'isomorphic-fetch'
import logger from './logger'
import { Resource } from '../resource'

/**
 * Loads the resource at the provided url using fetch
 *
 * @param {URL} url url of the resource to load
 * @param {object} options options to pass to fetch
 * @param {Function} handlers an array of functions that can parse operations from the HTTP response
 *
 * @returns {Resource} a ApiResourceObject representing the loaded resource
 *
 * @throws {Error} If the server returns with a status >= 400
 */
export async function loadResource (url, options, handlers) {
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
    // this will probably be an issue for redirects
    response.url = url.toString()
  }
  return Resource.create(response, handlers)
}
