import logger from './logger'
// import { SkippedError } from '@windyroad/cucumber-js-throwables'

/* istanbul ignore next: only gets executed when the external API is not available */
export function handleResponseError(response, url) {
  if (!response.ok) {
    logger.error(`URL not available: ${url}`)
    logger.error(`status code: ${response.statusText} ${response.status}`)
    throw new Error(
      `API not available: ${response.statusText} ${response.status}`
    )
  }
}
