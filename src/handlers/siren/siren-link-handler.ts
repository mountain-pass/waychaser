import { Operation } from '../../operation'
import { mapSirenLinkToOperation } from './map-siren-link-to-operation'

/**
 * @param response
 * @param content
 */
export function sirenLinkHandler(
  content?: unknown): Array<Operation> {
  const operations: Array<Operation> = []
  if (
    content &&
    typeof content === 'object' &&
    'links' in content
  ) {
    const body = content as {
      links: Array<{ rel: string, href: string } & Record<string, unknown>>
    }
    if (body.links) {
      for (const link of body.links) {
        for (const relationship of link.rel) {
          const mappedLink = mapSirenLinkToOperation(relationship, link)
          operations.push(mappedLink)
        }
      }
    }
  }
  return operations
}