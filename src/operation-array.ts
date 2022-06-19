import { InvocableOperation, Operation } from './operation'
import { WayChaserOptions, WayChaserResponse } from './waychaser'

// const foo: Array<InvocableOperation> = []
// foo.filter())

export class OperationArray extends Array<InvocableOperation> {
  private constructor(items?: Array<InvocableOperation>) {
    super(...(items || []))
  }
  static create(): OperationArray {
    return Object.create(OperationArray.prototype)
  }

  find(
    query:
      | string
      | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    thisArgument?: unknown
  ): InvocableOperation | undefined {
    const finder = Array.prototype.find.bind(this)
    if (typeof query === 'string') {
      return finder(objectFinder({ rel: query }), thisArgument)
    } else if (typeof query === 'object') {
      return finder(objectFinder(query), thisArgument)
    } else {
      return finder(query, thisArgument)
    }
  }

  filter(
    query:
      | string
      | Record<string, unknown>
      | ((
        value: InvocableOperation,
        index: number,
        array: InvocableOperation[]
      ) => unknown),
    thisArgument?: unknown
  ): OperationArray {
    if (typeof query === 'string') {
      return this.filter({ rel: query }, thisArgument)
    } else if (typeof query === 'object') {
      return this.filter(objectFinder(query), thisArgument)
    } else {
      const filtered = Array.prototype.filter.bind(this)(query)
      Object.setPrototypeOf(filtered, OperationArray.prototype)
      return filtered
    }
  }

  invoke(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions>
  ): Promise<WayChaserResponse<unknown>> | undefined;

  invoke<Content>(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions<Content>>
  ): Promise<WayChaserResponse<Content>> | undefined;

  invoke<Content>(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions<Content>>
  ) {
    const operation = this.find(relationship)
    return operation ? operation.invoke(options) : undefined
  }

  invokeAll(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions>
  ): Promise<Array<WayChaserResponse<unknown>>>

  invokeAll<Content>(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions<Content>>
  ): Promise<Array<WayChaserResponse<Content>>>

  invokeAll<Content>(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions<Content>>
  ) {
    return Promise.all(this.filter(relationship).map(operation =>
      operation.invokeAll(options)
    )).then(arrayOfArrays => {
      const flat = arrayOfArrays.flat()
      return flat
    })
  }
}

// ideally we'd just subclass Array, and that works most of the time, BUT sometimes in firefox, instead of it
// giving us an ObjectArray, we get a plain old Array, without our invoke method or customised find method.
// FU JavaScript, FU.

/**
 * @param query
 */
function objectFinder(query: Partial<Operation>) {
  return (o: InvocableOperation) => {
    for (const key in query) {
      if (query[key] !== o[key]) {
        return false
      }
    }
    return true
  }
}
