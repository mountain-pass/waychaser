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

  async getOperationsCounts (results) {
    const counts = {}
    for (const key in results) {
      counts[`${key}-operations`] = results[key].resource.operations.length
      counts[`${key}-ops`] = results[key].resource.ops.length
    }
    return counts
  }

  async find (results, relationship) {
    const found = [
      // eslint-disable-next-line unicorn/no-array-callback-reference -- relationship is not a function
      results[0].resource.operations.find(relationship),
      results[0].resource.operations.find({
        rel: relationship
      }),
      results[0].resource.operations.find(element => {
        return element.rel === relationship
      }),
      // eslint-disable-next-line unicorn/no-array-callback-reference -- relationship is not a function
      results[0].resource.ops.find(relationship),
      results[0].resource.ops.find({ rel: relationship }),
      results[0].resource.ops.find(element => {
        return element.rel === relationship
      })
    ]
    return found
  }

  async invokeAll (result, relationship, context) {
    logger.debug('invoke CONTEXT', context)
    return Promise.all([
      handleResponse(result.resource.invoke(relationship, context)),
      handleResponse(result.resource.invoke({ rel: relationship }, context)),
      handleResponse(
        result.resource.invoke(element => {
          return element.rel === relationship
        }, context)
      ),
      handleResponse(result.resource.operations.invoke(relationship, context)),
      handleResponse(
        result.resource.operations.invoke({ rel: relationship }, context)
      ),
      handleResponse(
        result.resource.operations.invoke(element => {
          return element.rel === relationship
        }, context)
      ),
      handleResponse(result.resource.ops.invoke(relationship, context)),
      handleResponse(
        result.resource.ops.invoke({ rel: relationship }, context)
      ),
      handleResponse(
        result.resource.ops.invoke(element => {
          return element.rel === relationship
        }, context)
      ),
      handleResponse(
        // eslint-disable-next-line unicorn/no-array-callback-reference -- relationship is not a function
        result.resource.operations.find(relationship).invoke(context)
      ),
      handleResponse(
        result.resource.operations.find({ rel: relationship }).invoke(context)
      ),
      handleResponse(
        result.resource.operations
          .find(element => {
            return element.rel === relationship
          })
          .invoke(context)
      ),
      handleResponse(
        // eslint-disable-next-line unicorn/no-array-callback-reference -- relationship is not a function
        result.resource.ops.find(relationship).invoke(context)
      ),
      handleResponse(
        result.resource.ops.find({ rel: relationship }).invoke(context)
      ),
      handleResponse(
        result.resource.ops
          .find(element => {
            return element.rel === relationship
          })
          .invoke(context)
      )
    ])
  }

  async invokeWithObjectQuery (result, query, context) {
    return Promise.all([
      handleResponse(result.resource.invoke(query, context)),
      handleResponse(result.resource.operations.invoke(query, context)),
      handleResponse(result.resource.ops.invoke(query, context)),
      handleResponse(
        // eslint-disable-next-line unicorn/no-array-callback-reference -- query is not a function
        result.resource.operations.find(query).invoke(context)
      ),
      handleResponse(
        // eslint-disable-next-line unicorn/no-array-callback-reference -- query is not a function
        result.resource.ops.find(query).invoke(context)
      )
    ])
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

  async getStatusCodes (results) {
    const codes = {}
    for (const key in results) {
      codes[key] = results[key].resource.response.status
    }
    return codes
  }

  async use (handler) {
    this.waychaser = this.waychaser.use(handler)
  }

  async reset () {
    this.waychaser = waychaser
  }

  async useDefaultHandlers () {
    this.waychaser.useDefaultHandlers()
  }
}

export { WaychaserDirect }
