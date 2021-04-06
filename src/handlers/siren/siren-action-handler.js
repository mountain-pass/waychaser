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
    body.actions?.forEach(action => {
      const operation = mapSirenActionToOperation(action)
      operations.push(operation)
    })
  }
  return operations
}
