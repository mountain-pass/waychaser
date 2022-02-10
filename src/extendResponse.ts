import { fetch } from 'cross-fetch'
import { OperationArray } from './operation-array'
import { HandlerSpec, WayChaserOptions } from './waychaser'
import { WayChaserResponse } from './WayChaserResponse'
import pointer from 'jsonpointer'
import { Operation } from './operation'

const RESPONSE_PROPERTIES = [
  'body',
  'bodyUsed',
  'headers',
  'ok',
  'redirected',
  'size',
  'status',
  'statusText',
  'timeout',
  'url',
  'Symbol(Body internals)',
  'Symbol(Response internals)'
]

/**
 * @param bareResponse
 * @param responseExtras
 */
export async function extendResponse (
  bareResponse: Response,
  responseExtras: WayChaserResponseExtras,
  options: WayChaserOptions
): Promise<WayChaserResponse> {
  const proxy = new Proxy(bareResponse, {
    get (target, property, receiver) {
      if (property === 'json') {
        return async () => {
          if (
            !Object.prototype.hasOwnProperty.call(responseExtras, 'content')
          ) {
            const content = await target.json()
            responseExtras.content = responseExtras.anchor
              ? pointer.get(content, this.anchor.substring(1))
              : content
          }
          return responseExtras.content
        }
      }
      RESPONSE_PROPERTIES.includes(property.toString())
        ? Reflect.get(target, property, receiver)
        : Reflect.get(responseExtras, property, receiver)
    },
    set (target, property, value, receiver) {
      return RESPONSE_PROPERTIES.includes(property.toString())
        ? Reflect.set(target, property, receiver)
        : Reflect.set(responseExtras, property, receiver)
    }
  }) as WayChaserResponse

  await responseExtras.parseOperations(proxy, options)

  /*
  get ops () {
    return this.operations
  }
  async invoke (
    relationship: string,
    clientContext: Record<string, any>,
    options: WayChaserOptions
  ): Promise<WayChaserResponse> {
    return this.operations.invoke(relationship, clientContext, options)
  }
*/

  //   proxy.invoke = function (
  //     relationship: string,
  //     clientContext: Record<string, any>,
  //     options: WayChaserOptions
  //   ): Promise<WayChaserResponse> {
  //     return this.operations.invoke(relationship, clientContext, options)
  //   }
  //   Object.defineProperty(proxy, 'ops', {
  //     get: function () {
  //       return this.operations
  //     }
  //   })
  //   proxy.content = await bareResponse.json()
  return proxy
}
