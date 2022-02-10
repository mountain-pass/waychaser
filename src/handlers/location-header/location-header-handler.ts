import { Operation } from '../../operation'
import { WayChaserResponse } from '../../WayChaserResponse'

/**
 * @param response
 */
export function locationHeaderHandler (
  response: WayChaserResponse
): Array<Operation> {
  const locationHeader = response.headers.get('location')
  if (locationHeader) {
    return [{ rel: 'related', uri: locationHeader }]
  }
  return []
}
