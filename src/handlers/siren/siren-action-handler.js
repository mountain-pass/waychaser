import { mapSirenActionToOperation } from './map-siren-action-to-operation'

/**
 * @param bodyGetter
 */

/**
 * @param response
 * @param bodyGetter
 * @param next
 */
export async function sirenActionHandler (bodyGetter) {
  const operations = []
  const body = await bodyGetter()
  if (body.actions) {
    for (const action of body.actions) {
      const operation = mapSirenActionToOperation(action)
      operations.push(operation)
    }
  }
  return operations
}
