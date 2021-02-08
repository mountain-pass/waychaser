import LinkHeader from 'http-link-header'
import { Operation } from '../../operation'

/**
 * @param response
 */
export async function linkHeaderHandler (response) {
  const linkHeader = response.headers.get('link')
  if (linkHeader) {
    const links = LinkHeader.parse(linkHeader)
    return links.refs.map(reference => {
      const { rel, uri, method, ...otherProperties } = reference
      return Operation.builder(rel)
        .uri(uri)
        .method(method)
        .other(Object.assign({ handler: 'link-header' }, otherProperties))
        .build()
    })
  }
}
