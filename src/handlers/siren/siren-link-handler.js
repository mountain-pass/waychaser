import { mapSirenLinkToOperation } from './map-siren-link-to-operation'

/**
 * @param content
 */
export async function sirenLinkHandler (content) {
  const operations = []
  const body = content
  if (body.links) {
    for (const link of body.links) {
      for (const relationship of link.rel) {
        const mappedLink = mapSirenLinkToOperation(relationship, link)
        operations.push(mappedLink)
      }
    }
  }
  return operations
}
