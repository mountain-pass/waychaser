import { Operation } from '../operation'
import { HandlerSpec } from '../waychaser'
import { BaseWayChaserResponse } from '../waychaser-response'
import { expandOperation } from '../expand-operation'
import { URI } from './uri-template-lite'
import pointer from 'jsonpointer'

/**
 * @param root0
 * @param root0.handlers
 * @param root0.response
 * @param root0.baseResponse
 * @param root0.content
 */
export function parseOperations({ handlers, baseResponse, content }: {
  handlers: HandlerSpec[],
  baseResponse: Response,
  content?: unknown,
}): Record<string, Array<Operation>> {
  const operations: Array<Operation> = []
  let stop = false
  for (const handler of handlers) {
    // TODO only call handers for the current media type
    const handledOperations = handler.handler(baseResponse, content, () => {
      stop = true
    })
    if (handledOperations) {
      for (const operation of handledOperations) {
        operations.push(operation)
      }
    }
    if (stop) {
      break
    }
  }

  const expandedOperations: Record<string, Array<Operation>> = {}
  for (const operation of operations) {
    const expanded = expandOperation(operation)
    for (const operation of expanded) {
      const anchor = operation.anchor || ''
      expandedOperations[anchor] || (expandedOperations[anchor] = [])
      expandedOperations[anchor].push(operation)
    }
  }


  return expandedOperations
}
