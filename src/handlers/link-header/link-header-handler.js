import LinkHeader from 'http-link-header'
import { Operation } from '../../operation'

/**
 * @param response
 */
export async function linkHeaderHandler (response) {
  return [
    ...parseHeader(response.headers.get('link')),
    ...parseHeader(response.headers.get('link-template'))
  ]
}

/**
 * @param linkHeader
 */
function parseHeader (linkHeader) {
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
      return Operation.builder(rel)
        .uri(uri)
        .method(method)
        .parameters(parsedParameters)
        .accept(accept?.value)
        .other(Object.assign({ handler: 'link-header' }, otherProperties))
        .build()
    })
  } else {
    return []
  }
}
