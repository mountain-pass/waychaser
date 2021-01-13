import logger from '../../util/logger'
import { waychaser } from '../../waychaser'
import { WaychaserProxy } from './waychaser-proxy'

async function handleResponse (promise) {
  try {
    const resource = await promise
    return { success: true, resource }
  } catch (error) {
    logger.error('error loading %s', error)
    logger.error(error)
    return { success: false, error }
  }
}
class WaychaserDirect extends WaychaserProxy {
  async load (url) {
    return handleResponse(waychaser.load(url))
  }

  async getOCount (property, result) {
    return result.resource[property].count()
  }

  async findOneO (property, result, relationship) {
    return result.resource[property].findOne(relationship)
  }

  async invokeO (property, result, relationship, context) {
    logger.debug('invokeO CONTEXT', context)
    return handleResponse(
      result.resource[property].invoke(relationship, context)
    )
  }

  async invoke (result, relationship, context) {
    logger.debug('invoke CONTEXT', context)
    return handleResponse(result.resource.invoke(relationship, context))
  }

  async getUrl (result) {
    return result.resource.response.url
  }

  // async getBody (result) {
  //   logger.debug(
  //     'response',
  //     typeof result.resource,
  //     result.resource.constructor.name
  //   )
  //   const body = await result.resource.body()
  //   logger.debug('response body', result.resource.response.url, body)
  //   return body
  // }

  async getBodies (results) {
    return Promise.all(
      results.map(result => {
        return result.resource.body()
      })
    )
  }

  async getStatusCode (result) {
    return result.resource.response.status
  }
}

export { WaychaserDirect }
