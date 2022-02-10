import { Operation } from '../../operation'

/**
 * @param response
 */
export function locationHeaderHandler(
  response: Response,
): Array<Operation> {
  const locationHeader = response?.headers.get('location')
  if (locationHeader) {
    return [new Operation({ rel: 'related', uri: locationHeader })]
  }
  return []
}
