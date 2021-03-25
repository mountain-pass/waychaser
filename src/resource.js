import { OperationArray } from './operation-array'
import logger from './util/logger'
import pointer from 'jsonpointer'

export class Resource {
  static async create (response, waychaserContext) {
    logger.waychaser('creating resource')
    const operations = []
    let stop = false
    for (const handler of waychaserContext.handlers) {
      const handledOperations = await handler(
        response,
        () => response.json(),
        () => {
          stop = true
        }
      )
      if (handledOperations?.length > 0) {
        operations.push(...handledOperations)
      }
      if (stop) {
        break
      }
    }
    return new Resource(response, undefined, operations, waychaserContext)
  }

  static createFromFragment (response, jsonPointer, waychaserContext) {
    const operations = []
    return new Resource(response, jsonPointer, operations, waychaserContext)
  }

  constructor (response, jsonPointer, links, waychaserContext) {
    this.response = response
    this.jsonPointer = jsonPointer
    this.operations = new OperationArray()
    links.forEach(operation => {
      operation.baseUrl = response.url
      operation.waychaserContext = waychaserContext
      operation.response = response
    })
    this.operations.push(...links)
    logger.waychaser('resource created')
  }

  get ops () {
    return this.operations
  }

  invoke (relationship, context, options) {
    logger.waychaser(`resource.invoke: ${relationship}`)
    return this.operations.invoke(relationship, context, options)
  }

  async body () {
    const fullBody = await this.response.json()
    return this.jsonPointer ? pointer.get(fullBody, this.jsonPointer) : fullBody
  }
}
