/* global Response */
import { InvocableOperation, Operation } from './operation'
import { OperationArray } from './operation-array'
import { parseOperations } from './resource'
import { WayChaserOptions } from './waychaser'
import pointer from 'jsonpointer'

export class WayChaserResponse {
  allOperations: Array<Operation>
  operations: OperationArray
  content: any
  anchor?: string
  response: Response
  fullContent: any

  private constructor (
    // allOperations: Array<Operation>,
    response: Response,
    // baseUrl: string | URL,
    // content: any,
    anchor?: string
  ) {
    this.response = response
    //   this.allOperations = allOperations
    //   this.operations = OperationArray.create()
    this.anchor = anchor
    //   this.content = this.anchor
    //     ? pointer.get(content, this.anchor.substring(1))
    //     : content
    //   for (const operationParameters of this.allOperations.filter(operation => {
    //     return operation.anchor === this.anchor
    //   })) {
    //     this.operations.push(
    //       new InvocableOperation(
    //         operationParameters,
    //         response,
    //         baseUrl,
    //         content, // this is the full content
    //         allOperations,
    //         anchor,
    //         options
    //       )
    //     )
    //   }
  }

  static async create (baseResponse: Response, options: WayChaserOptions) {
    const response = new WayChaserResponse(baseResponse)
    // TODO parse based on content type
    // TODO allow lazy loading
    response.headers.get('content-length') &&
      response.headers.get('content-length') !== '0' &&
      (await response.json())
    response.allOperations = await parseOperations({
      response,
      handlers: options.defaultHandlers
    })

    response.operations = OperationArray.create()
    for (const operationParameters of response.allOperations.filter(
      operation => {
        return operation.anchor === undefined
      }
    )) {
      response.operations.push(
        new InvocableOperation(operationParameters, response, options)
      )
    }
    return response
  }

  static createFragment (
    parentResponse: WayChaserResponse,
    options: WayChaserOptions,
    anchor: string
  ) {
    const response = new WayChaserResponse(parentResponse.response, anchor)
    response.allOperations = parentResponse.allOperations
    response.operations = OperationArray.create()
    response.fullContent = parentResponse.fullContent
    response.content = pointer.get(response.fullContent, anchor.substring(1))
    for (const operationParameters of response.allOperations.filter(
      operation => {
        return operation.anchor === anchor
      }
    )) {
      response.operations.push(
        new InvocableOperation(operationParameters, response, options)
      )
    }
    return response
  }

  get ops () {
    return this.operations
  }

  invoke (
    relationship: string,
    parameters: Record<string, any>,
    options: WayChaserOptions
  ): Promise<WayChaserResponse> {
    return this.operations.invoke(relationship, parameters, options)
  }

  get body () {
    throw Error('Not Implemented')
  }

  get bodyUsed () {
    throw Error('Not Implemented')
  }

  get headers () {
    return this.response.headers
  }

  get ok () {
    return this.response.ok
  }

  get redirected () {
    return this.response.redirected
  }

  get status () {
    return this.response.status
  }

  get statusText () {
    return this.response.statusText
  }

  get type () {
    return this.response.type
  }

  get url () {
    return this.response.url
  }

  arrayBuffer () {
    throw Error('Not Implemented')
  }

  blob () {
    throw Error('Not Implemented')
  }

  clone () {
    throw Error('Not Implemented')
  }

  formData () {
    throw Error('Not Implemented')
  }

  async json () {
    if (this.content === undefined) {
      this.fullContent = await this.response.json()
      this.content = this.anchor
        ? pointer.get(this.fullContent, this.anchor.substring(1))
        : this.fullContent
    }
    return this.content
  }

  text () {
    throw Error('Not Implemented')
  }
}
