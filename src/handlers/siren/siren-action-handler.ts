import { Operation } from '../../operation'
import { mapSirenActionToOperation } from './map-siren-action-to-operation'

/**
 * @param content
 */
export function sirenActionHandler(content?: unknown): Array<Operation> {
  const operations: Array<Operation> = []
  if (
    content &&
    typeof content === 'object' &&
    'actions' in content
  ) {
    const body = content as {
      actions: Array<Record<string, unknown>>
    }
    if (body.actions) {
      for (const action of body.actions) {
        const operation = mapSirenActionToOperation(action)
        operations.push(operation)
      }
    }
  }
  return operations
}
