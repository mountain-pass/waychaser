import { OperationArray } from './operation-array'
import logger from './util/logger'

export class Resource {
  static async create (response, handlers, mediaRanges, fetcher) {
    const operations = []
    let body
    let stop = false
    for (const handler of handlers) {
      const handledOperations = await handler(
        response,
        async () => {
          if (!body) {
            body = await response.json()
          }
          logger.waychaser('BODY', JSON.stringify(body, undefined, 2))
          return body
        },
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
    return new Resource(
      response,
      body,
      operations,
      handlers,
      mediaRanges,
      fetcher
    )
  }

  constructor (response, body, links, handlers, mediaRanges, fetcher) {
    this.response = response
    this._body = body
    this.operations = new OperationArray()
    links.forEach(operation => {
      operation.baseUrl = response.url
      operation.handlers = handlers
      operation.mediaRanges = mediaRanges
      operation.fetcher = fetcher
    })
    this.operations.push(...links)
  }

  get ops () {
    return this.operations
  }

  invoke (relationship, context, options) {
    logger.waychaser(`resource.invoke: ${relationship}`)
    return this.operations.invoke(relationship, context, options)
  }

  async body () {
    if (!this.response.bodyUsed) {
      // const contentType = this.response.headers.get('content-type')
      // switch (contentType) {
      //   case 'image/png':
      //     this._body = await this.response.blob()
      //     break
      //   default:
      this._body = await this.response.json()
      // }
    }
    return this._body
  }
}
