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
  constructor () {
    super()
    this.waychaser = waychaser
  }

  async load (url) {
    return handleResponse(this.waychaser.load(url))
  }

  async getOCount (property, result) {
    return result.resource[property].count()
  }

  async findOne (result, relationship) {
    return {
      foundOperation: result.resource.operations.findOne(relationship),
      foundOperationLokiStyle: result.resource.operations.findOne({
        rel: relationship
      }),
      foundOp: result.resource.ops.findOne(relationship),
      foundOpLokiStyle: result.resource.ops.findOne({ rel: relationship })
    }
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

  async getUrls (results) {
    return results.map(result => {
      return result.resource.response.url
    })
  }

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

  async use (handler) {
    this.waychaser = waychaser.use(handler)
  }

  async reset () {
    this.waychaser = waychaser
  }
}

export { WaychaserDirect }
