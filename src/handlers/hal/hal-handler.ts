import { Operation } from '../../operation'
import MediaTypes from '../../util/media-types'
import { mapHalLinkToOperation } from './map-hal-link-to-operation'

type HalLink = {
  href: string
  type?: string
  templated?: boolean
  title?: string
  hreflang?: string
}

/**
 * @param response
 * @param content
 */
export function halHandler(
  response: Response,
  content?: unknown
): Array<Operation> {
  const operations: Array<Operation> = []
  const contentType = response.headers.get('content-type')?.split(';')
  if (
    contentType?.[0] === MediaTypes.HAL &&
    content &&
    typeof content === 'object' &&
    '_links' in content
  ) {
    const body = content as {
      _links: {
        curies:
        | Array<{ name: string; href: string }>
        | { name: string; href: string }
        [key: string]: HalLink | HalLink[]
      }
    }

    // if there are curies in the Hal Links, we need to load them first, so we can expand them wherever they are used
    // we also want to convert them to a map, for easy lookup
    const curies = {}
    if (body._links.curies) {
      if (Array.isArray(body._links.curies)) {
        for (const curie of body._links.curies) {
          curies[curie.name] = curie.href
        }
      } else {
        curies[body._links.curies.name] = body._links.curies.href
      }
    }
    for (const key of Object.keys(body._links).filter(relationship => relationship !== 'curies')) {
      if (Array.isArray(body._links[key])) {
        for (const link of body._links[key] as Array<HalLink>) {
          operations.push(mapHalLinkToOperation(key, link, curies))
        }
      } else {
        operations.push(mapHalLinkToOperation(key, body._links[key], curies))
      }
    }
  }
  return operations
}
