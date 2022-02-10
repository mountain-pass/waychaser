import { Operation } from './operation'

/**
 * @param operation
 */
export function expandOperation (operation: Operation) {
  const expandedOperations = []
  const rangeRegex = /{\[(\d+)..(\d+)]}/
  const originalUrl = operation.uri.toString()
  const matches = originalUrl.match(rangeRegex)
  if (matches) {
    for (
      let index = Number.parseInt(matches[1]);
      index <= Number.parseInt(matches[2]);
      ++index
    ) {
      const newOp = new Operation(
        Object.assign(operation, {
          uri: originalUrl.replace(rangeRegex, index.toFixed(0))
        })
      )
      const thisExpandedOperations = expandOperation(newOp)
      for (const operation of thisExpandedOperations) {
        expandedOperations.push(operation)
      }
    }
  } else {
    const originalAnchor = operation.anchor
    const anchorMatches = originalAnchor?.match(rangeRegex)
    if (anchorMatches) {
      for (
        let index = Number.parseInt(anchorMatches[1]);
        index <= Number.parseInt(anchorMatches[2]);
        ++index
      ) {
        const newOp = new Operation(
          Object.assign(operation, {
            anchor: originalAnchor.replace(rangeRegex, index.toFixed(0))
          })
        )
        const thisExpandedOperations = expandOperation(newOp)
        for (const operation of thisExpandedOperations) {
          expandedOperations.push(operation)
        }
      }
    } else {
      expandedOperations.push(operation)
    }
  }
  return expandedOperations
}
