import LinkHeader from 'http-link-header'
import { Operation } from '../../operation'

/**
 * @param response
 * @param next
 */
export async function linkTemplateHeaderHandler (response) {
  const linkTemplateHeader = response.headers.get('link-template')
  if (linkTemplateHeader) {
    const linkTemplates = LinkHeader.parse(linkTemplateHeader)
    return linkTemplates.refs.map(reference => {
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
        .other(
          Object.assign({ handler: 'link-template-header' }, otherProperties)
        )
        .build()
    })
  }
}
