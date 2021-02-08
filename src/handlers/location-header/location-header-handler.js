import { Operation } from '../../operation'

/**
 * @param response
 */
export async function locationHeaderHandler (response) {
  const locationHeader = response.headers.get('location')
  if (locationHeader) {
    return [
      Operation.builder('related')
        .uri(locationHeader)
        .other({ handler: 'location-header' })
        .build()
    ]
  }
}
