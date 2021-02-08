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

OperationArray.prototype.find = function (...arguments_) {
  if (arguments_.length === 1 && typeof arguments_[0] === 'string') {
    return this.find({ rel: arguments_[0] })
  } else if (arguments_.length === 1 && typeof arguments_[0] === 'object') {
    const query = arguments_[0]
    return Array.prototype.find.bind(this)(objectFinder(query))
  } else {
    return Array.prototype.find.bind(this)(...arguments_)
  }
}

OperationArray.prototype.invoke = async function (
  relationship,
  context,
  options
) {
  logger.waychaser('OPERATIONS', JSON.stringify(this, undefined, 2))
  const operation = this.find(relationship)
  logger.waychaser(
    `operation ${JSON.stringify(relationship)}:`,
    JSON.stringify(operation, undefined, 2)
  )
  logger.waychaser('context:', JSON.stringify(context, undefined, 2))
  return operation ? operation.invoke(context, options) : undefined
}

// export class OperationArray extends Array {
//   find (...arguments_) {
//     if (arguments_.length === 1 && typeof arguments_[0] === 'string') {
//       return this.find({ rel: arguments_[0] })
//     } else if (arguments_.length === 1 && typeof arguments_[0] === 'object') {
//       const query = arguments_[0]
//       return super.find(objectFinder(query))
//     } else {
//       return super.find(...arguments_)
//     }
//   }

//   async invoke (relationship, context, options) {
//     logger.waychaser('OPERATIONS', JSON.stringify(this, undefined, 2))
//     const operation = this.find(relationship)
//     logger.waychaser(
//       `operation ${JSON.stringify(relationship)}:`,
//       JSON.stringify(operation, undefined, 2)
//     )
//     logger.waychaser('context:', JSON.stringify(context, undefined, 2))
//     return operation.invoke(context, options)
//   }
// }
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
