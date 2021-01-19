import LinkHeader from 'http-link-header'

/**
 * @param response
 * @param next
 */
export async function linkTemplateHeaderHandler (response, next) {
  const linkTemplateHeader = response.headers.get('link-template')
  if (linkTemplateHeader) {
    const linkTemplates = LinkHeader.parse(linkTemplateHeader)
    return linkTemplates.refs
  }
}
