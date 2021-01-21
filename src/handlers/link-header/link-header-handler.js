import LinkHeader from 'http-link-header'
import { Operation } from '../../operation'

/**
 * @param response
 * @param next
 */
export async function linkHeaderHandler (response, next) {
  const linkHeader = response.headers.get('link')
  if (linkHeader) {
    const links = LinkHeader.parse(linkHeader)
    return links.refs.map(reference => {
      const { rel, uri, method, ...otherProperties } = reference
      return Operation.builder(rel)
        .uri(uri)
        .method(method)
        .other(otherProperties)
        .build()
    })
  }
}
