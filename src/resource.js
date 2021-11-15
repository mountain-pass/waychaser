import { OperationArray } from './operation-array'
import logger from './util/logger'
import pointer from 'jsonpointer'
import { Operation } from './operation'

/**
 * @param operation
 */
function expandOperation (operation) {
  const expandedOperations = []
  const rangeRegex = /{\[(\d+)..(\d+)]}/
  const originalUrl = operation.uri
  const matches = originalUrl.match(rangeRegex)
  if (matches) {
    for (let index = matches[1]; index <= matches[2]; ++index) {
      operation.uri = originalUrl.replace(rangeRegex, index)
      const thisExpandedOperations = expandOperation(operation)
      for (const operation of thisExpandedOperations) {
        expandedOperations.push(new Operation(operation))
      }
    }
  } else {
    const originalAnchor = operation.anchor
    const anchorMatches = originalAnchor?.match(rangeRegex)
    if (anchorMatches) {
      for (let index = anchorMatches[1]; index <= anchorMatches[2]; ++index) {
        operation.anchor = originalAnchor.replace(rangeRegex, index)
        const thisExpandedOperations = expandOperation(operation)
        for (const operation of thisExpandedOperations) {
          expandedOperations.push(new Operation(operation))
        }
      }
    } else {
      expandedOperations.push(operation)
    }
  }
  return expandedOperations
}

/**
 * @param root0
 * @param root0.handlers
 * @param root0.response
 * @param root0.anchor
 */
async function parseOperations ({ handlers, response, anchor }) {
  const operations = []
  let stop = false
  for (const handler of handlers) {
    const handledOperations = await handler(
      response,
      () => response.json(),
      () => {
        stop = true
      }
    )
    if (handledOperations) {
      for (const operation of handledOperations) {
        operations.push(operation)
      }
    }
    if (stop) {
      break
    }
  }
  const expandedOperations = []
  for (const operation of operations) {
    const expanded = expandOperation(operation)
    for (const operation of expanded) {
      expandedOperations.push(operation)
    }
  }

  return expandedOperations.filter(operation => {
    return operation.anchor === anchor
  })
}

export class Resource {
  static async create (response, waychaserContext) {
    logger.waychaser('creating resource')
    const operations = await parseOperations({
      handlers: waychaserContext.handlers,
      response
    })

    return new Resource(response, undefined, operations, waychaserContext)
  }

  static async createFromFragment (response, jsonPointer, waychaserContext) {
    const operations = await parseOperations({
      handlers: waychaserContext.handlers,
      response,
      anchor: `#${jsonPointer}`
    })
    // OPTIONS
    // we can either
    // 1) pass the existing operations through the call stack
    // and filter them based on anchor
    // 2) pass the response to the handlers, along with the anchor
    // and let it figure out what the appropriate operations are
    // advantage of the former is that we only process bodies/headers once
    // advantage of the later is that the handler determines what the anchor format is
    // but we are already coupling anchors to json-pointer in the invoke
    // but the invoke for siren is going to need to know about embedded resources
    // so maybe the handler should be responsible for the invoking as well
    // in which case the handler can return the specific type of resource
    // and be completely responsible for parsing and invocation
    // BUT what would happen when switching media types
    // in that case waychaser would still need to route parsing to the right handler
    // ok, so larger refactor makes sense, but not right now
    // lets' just filter the existing operations by anchor
    return new Resource(response, jsonPointer, operations, waychaserContext)
  }

  constructor (response, jsonPointer, operations, waychaserContext) {
    this.response = response
    this.jsonPointer = jsonPointer
    this.operations = new OperationArray()
    for (const operation of operations) {
      operation.baseUrl = response.url
      operation.waychaserContext = waychaserContext
      operation.response = response
      operation.jsonPointer = jsonPointer
      this.operations.push(operation)
    }
    this.contentAvailable = false
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
    if (this.contentAvailable) {
      return this.content
    } else {
      const fullBody = await this.response.json()
      this.content = this.jsonPointer
        ? pointer.get(fullBody, this.jsonPointer)
        : fullBody
      this.contentAvailable = true
      return this.content
    }
  }
}
