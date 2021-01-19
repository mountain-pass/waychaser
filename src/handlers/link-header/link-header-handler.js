import LinkHeader from 'http-link-header'

/**
 * @param response
 * @param next
 */
export async function linkHeaderHandler (response, next) {
  const linkHeader = response.headers.get('link')
  if (linkHeader) {
    const links = LinkHeader.parse(linkHeader)
    return links.refs
  }
}
