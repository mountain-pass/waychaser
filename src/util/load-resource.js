import logger from './logger'
import { Resource } from '../resource'
/**
 * Loads the resource at the provided url using fetch
 *
 * @param {URL} url url of the resource to load
 * @param {object} options options to pass to fetch
 * @param {Function} handlers an array of functions that can parse operations from the HTTP response
 *
 * @param mediaRanges
 * @param fetcher
 * @returns {Resource} a ApiResourceObject representing the loaded resource
 *
 * @throws {Error} If the server returns with a status >= 400
 */
export async function loadResource (
  url,
  options,
  handlers,
  mediaRanges,
  fetcher
) {
  const updatedOptions = Object.assign({}, options)
  updatedOptions.headers = Object.assign(
    {
      accept: mediaRanges.join()
    },
    options?.headers
  )
  logger.waychaser(`${updatedOptions.method || 'GET'}ing ${url} with:`)
  logger.waychaser('options:', JSON.stringify(updatedOptions, undefined, 2))
  const response = await fetcher(url, updatedOptions)
  if (!response.ok) {
    logger.error(
      `Bad response from server ${response.status} ${response.statusText}`
    )
    for (const pair of response.headers.entries()) {
      logger.error(`\t${pair[0]}: ${pair[1]}`)
    }
  } else {
    logger.waychaser(
      `Good response from server ${JSON.stringify(
        response.status
      )} ${JSON.stringify(response.statusText)}`
    )
    for (const pair of response.headers.entries()) {
      logger.waychaser(`\t${pair[0]}: ${pair[1]}`)
    }
  }
  /* istanbul ignore next: IE fails without this, but IE doesn't report coverage */
  if (response.url === undefined || response.url === '') {
    // in ie url is not being populated 🤷‍♂️
    // this will probably be an issue for redirects
    response.url = url.toString()
  }

  return Resource.create(response, handlers, mediaRanges, fetcher)
}
