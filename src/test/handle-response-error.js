import logger from '../util/logger'
import { SkippedError } from '@windyroad/cucumber-js-throwables'

export function handleResponseError (response, url) {
  if (!response.ok) {
    logger.error(`URL not available: ${url}`)
    logger.error(`status code: ${response.statusText} ${response.status}`)
    throw new SkippedError(
      `API not available: ${response.statusText} ${response.status}`
    )
  }
}
