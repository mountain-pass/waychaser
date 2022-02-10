import logger from '../../util/logger'
import { waychaser } from '../../waychaser'
import { WaychaserProxy } from './waychaser-proxy'
import { parseAccept } from '../../util/parse-accept'
import { SkippedError } from '@windyroad/cucumber-js-throwables'
import { getAwsApiGatewaySchema } from '../examples/get-aws-api-gateway-schema'

function handleResponse (promise) {
  return promise
    ? promise
        .then(resource => {
          return { success: resource?.ok, resource }
        })
        .catch(error => {
          /* istanbul ignore next: only gets executed when there are test failures */
          logger.error('error loading %s', error)
          /* istanbul ignore next: only gets executed when there are test failures */
          logger.error(error)
          /* istanbul ignore next: only gets executed when there are test failures */
          return { success: false, error }
        })
    : undefined
}
class WaychaserDirect extends WaychaserProxy {
  constructor () {
    super()
    this.waychaser = waychaser
  }

  async load (url) {
    return handleResponse(this.waychaser(url))
  }

  async getOperationsCounts (results, filter) {
    const counts = {}
    for (const key in results) {
      counts[`${key}-operations`] = filter
        ? results[key].resource.operations.filter(filter).length
        : results[key].resource.operations.length
      counts[`${key}-ops`] = filter
        ? results[key].resource.ops.filter(filter).length
        : results[key].resource.ops.length
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

  async invokeAll (result, relationship, parameters, options) {
    logger.debug('invoke CONTEXT', parameters, relationship)
    return Promise.all([
      handleResponse(result.resource.invoke(relationship, parameters, options)),
      handleResponse(
        result.resource.invoke({ rel: relationship }, parameters, options)
      ),
      handleResponse(
        result.resource.invoke(
          element => {
            return element.rel === relationship
          },
          parameters,
          options
        )
      ),
      handleResponse(
        result.resource.operations.invoke(relationship, parameters, options)
      ),
      handleResponse(
        result.resource.operations.invoke(
          { rel: relationship },
          parameters,
          options
        )
      ),
      handleResponse(
        result.resource.operations.invoke(
          element => {
            return element.rel === relationship
          },
          parameters,
          options
        )
      ),
      handleResponse(
        result.resource.ops.invoke(relationship, parameters, options)
      ),
      handleResponse(
        result.resource.ops.invoke({ rel: relationship }, parameters, options)
      ),
      handleResponse(
        result.resource.ops.invoke(
          element => {
            return element.rel === relationship
          },
          parameters,
          options
        )
      ),
      handleResponse(
        // eslint-disable-next-line unicorn/no-array-callback-reference -- relationship is not a function
        result.resource.operations
          .find(relationship)
          ?.invoke(parameters, options)
      ),
      handleResponse(
        result.resource.operations
          .find({ rel: relationship })
          ?.invoke(parameters, options)
      ),
      handleResponse(
        result.resource.operations
          .find(element => {
            return element.rel === relationship
          })
          ?.invoke(parameters, options)
      ),
      handleResponse(
        // eslint-disable-next-line unicorn/no-array-callback-reference -- relationship is not a function
        result.resource.ops.find(relationship)?.invoke(parameters, options)
      ),
      handleResponse(
        result.resource.ops
          .find({ rel: relationship })
          ?.invoke(parameters, options)
      ),
      handleResponse(
        result.resource.ops
          .find(element => {
            return element.rel === relationship
          })
          ?.invoke(parameters, options)
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

  async invokeNth (result, relationship, nth) {
    const operation = result.resource.operations.filter(relationship)[nth]
    const op = result.resource.ops.filter(relationship)[nth]
    return Promise.all([
      handleResponse(operation?.invoke()),
      handleResponse(op?.invoke())
    ])
  }

  async getUrls (results) {
    return results.map(result => {
      return result.resource.url
    })
  }

  async getBodies (results) {
    return results.map(result => result.resource.content)
  }

  async getStatusCodes (results) {
    const codes = {}
    for (const key in results) {
      codes[key] = results[key].resource.status
    }
    return codes
  }

  async use (handler, mediaRange) {
    this.waychaser = this.waychaser.defaults({
      handlers: [{ handler, mediaRanges: [mediaRange] }]
    })
  }

  async reset () {
    this.waychaser = waychaser
  }

  async useDefaultHandlers () {
    // this.waychaser = waychaser
  }

  async parseAccept (accept) {
    return parseAccept(accept)
  }

  async executeCode (code, baseUrl) {
    const stringFunction = `function (waychaser, baseUrl) {
      ${code}
    }`
    // eslint-disable-next-line security/detect-eval-with-expression -- we trust the feature file
    const parsedFunction = eval(`(${stringFunction})`) // eslint-disable-line no-eval -- we trust the feature file
    logger.debug(parsedFunction.toString())
    try {
      const resource = await parsedFunction(this.waychaser, baseUrl)
      /* istanbul ignore else: only gets executed when there are test failures */
      if (resource.ok) {
        return { success: true, resource }
      } else {
        if (resource?.status >= 500) {
          throw new SkippedError(
            `Server is having issues. Status code ${resource.response.status}`
          )
        } else {
          return { success: false, resource }
        }
      }
    } catch (error) {
      /* istanbul ignore next: only gets executed when there are test failures */
      const error_ =
        error.message === 'Server Error'
          ? new SkippedError('Server is having issues.')
          : error
      /* istanbul ignore next: only gets executed when there are test failures */
      throw error_
    }
  }

  async withFetch (fetch) {
    this.waychaser = this.waychaser.defaults({ fetch })
  }

  async getAwsApiGatewaySchema (gatewayName, schemaName) {
    return getAwsApiGatewaySchema(this.waychaser, gatewayName, schemaName)
  }
}

export { WaychaserDirect }
