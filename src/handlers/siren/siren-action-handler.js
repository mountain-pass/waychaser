import { mapSirenActionToOperation } from './map-siren-action-to-operation'

/**
 * @param content
 */
export async function sirenActionHandler (content) {
  const operations = []
  const body = content
  if (body.actions) {
    for (const action of body.actions) {
      const operation = mapSirenActionToOperation(action)
      operations.push(operation)
    }
  }
  return operations
}
