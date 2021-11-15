import { mapSirenLinkToOperation } from './map-siren-link-to-operation'

/**
 * @param bodyGetter
 */
export async function sirenLinkHandler (bodyGetter) {
  const operations = []
  const body = await bodyGetter()
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
