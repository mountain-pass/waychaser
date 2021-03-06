import logger from './util/logger'

// ideally we'd just subclass Array, and that works most of the time, BUT sometimes in firefox, instead of it
// giving us an ObjectArray, we get a plain old Array, without our invoke method or customised find method.
// FU JavaScript, FU.

/**
 *
 */
export function OperationArray () {
  const array = []
  array.push.apply(array, arguments)
  Object.setPrototypeOf(array, OperationArray.prototype)
  return array
}
OperationArray.prototype = []

OperationArray.prototype.find = function (query, thisArgument) {
  const finder = Array.prototype.find.bind(this)
  if (typeof query === 'string') {
    return finder(objectFinder({ rel: query }), thisArgument)
  } else if (typeof query === 'object') {
    return finder(objectFinder(query), thisArgument)
  } else {
    return finder(query, thisArgument)
  }
}

OperationArray.prototype.invoke = function (relationship, context, options) {
  logger.waychaser(`OperationArray.invoke: ${relationship}`)

  //  logger.waychaser('OPERATIONS', JSON.stringify(this, undefined, 2))
  const operation = this.find(relationship)
  // logger.waychaser(
  //   `operation ${JSON.stringify(relationship)}:`,
  //   JSON.stringify(operation, undefined, 2)
  // )
  logger.waychaser('context:', JSON.stringify(context, undefined, 2))
  if (operation === undefined) {
    logger.waychaser('operation not found', relationship)
    logger.waychaser(this)
  }
  return operation ? operation.invoke(context, options) : undefined
}

OperationArray.prototype.filter = function (query) {
  if (typeof query === 'string') {
    return this.filter({ rel: query })
  } else if (typeof query === 'object') {
    return this.filter(objectFinder(query))
  } else {
    const filtered = Array.prototype.filter.bind(this)(query)
    Object.setPrototypeOf(filtered, OperationArray.prototype)
    return filtered
  }
}

OperationArray.prototype.findInRelated = async function (predicate) {
  if (typeof predicate === 'object') {
    return this.findInRelated(objectFinder(predicate))
  } else {
    for (const getter of this) {
      const resource = await getter.invoke()
      if (predicate(await resource.body())) {
        return resource
      }
    }
  }
}

/**
 * @param query
 */
function objectFinder (query) {
  return o => {
    for (const key in query) {
      if (query[key] !== o[key]) {
        logger.waychaser(
          `query[${key}] (${query[key]}) !== operation[${key}] (${o[key]})`
        )
        return false
      }
    }
    return true
  }
}
