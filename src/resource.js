import { OperationArray } from './operation-array'

export class Resource {
  static async create (response, handlers) {
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
    return new Resource(response, body, operations, handlers)
  }

  constructor (response, body, links, handlers) {
    this.response = response
    this._body = body
    this.operations = new OperationArray()
    links.forEach(operation => {
      operation.baseUrl = response.url
      operation.handlers = handlers
    })
    this.operations.push(...links)
  }

  get ops () {
    return this.operations
  }

  async invoke (relationship, context) {
    return this.operations.invoke(relationship, context)
  }

  async body () {
    if (!this.response.bodyUsed) {
      this._body = await this.response.json()
    }
    return this._body
  }
}
