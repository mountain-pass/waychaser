import LinkHeader from 'http-link-header'
import { Operation } from '../../operation'
import { WayChaserResponse } from '../../WayChaserResponse'

/**
 * @param response
 */
export function linkHeaderHandler (
  response: WayChaserResponse
): Array<Operation> {
  return [
    ...parseHeader(response.headers.get('link')),
    ...parseHeader(response.headers.get('link-template'))
  ]
}

/**
 * @param linkHeader
 */
function parseHeader (linkHeader: string): Array<Operation> {
  if (linkHeader) {
    const links = LinkHeader.parse(linkHeader)
    return links.refs.map(reference => {
      const {
        rel,
        uri,
        method,
        'accept*': accept,
        'params*': parameters,
        ...otherProperties
      } = reference
      const parsedParameters = parameters?.value
        ? JSON.parse(parameters?.value)
        : undefined
      return {
        rel,
        uri,
        method,
        parameters: parsedParameters,
        accept: accept?.value,
        ...otherProperties
      }
    })
  } else {
    return []
  }
}
