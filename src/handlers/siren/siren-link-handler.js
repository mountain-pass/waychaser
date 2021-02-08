import { mapSirenLinkToOperation } from './map-siren-link-to-operation'

/**
 * @param bodyGetter
 */
export async function sirenLinkHandler (bodyGetter) {
  const operations = []
  const body = await bodyGetter()
  if (body.links) {
    body.links?.forEach(link => {
      link.rel.forEach(relationship => {
        const mappedLink = mapSirenLinkToOperation(relationship, link)
        operations.push(mappedLink)
      })
    })
  }
  return operations
}
