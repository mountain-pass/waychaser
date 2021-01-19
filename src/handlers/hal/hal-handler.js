import LinkHeader from 'http-link-header'
import MediaTypes from '../../util/media-types'
import { mapHalLinkToLinkHeader } from './map-hal-link-to-link-header'

/**
 * @param response
 * @param bodyGetter
 * @param next
 */
export async function halHandler (response, bodyGetter, next) {
  const links = new LinkHeader()
  const contentType = response.headers.get('content-type')?.split(';')
  if (contentType?.[0] === MediaTypes.HAL) {
    const body = await bodyGetter()
    if (body._links) {
      // if there are curies in the Hal Links, we need to load them first, so we can expand them wherever they are used
      // we also want to convert them to a map, for easy lookup
      const curies = {}
      if (body._links.curies) {
        body._links.curies.forEach(curie => {
          curies[curie.name] = curie.href
        })
      }
      Object.keys(body._links).forEach(key => {
        if (Array.isArray(body._links[key])) {
          body._links[key].forEach(link => {
            links.set(mapHalLinkToLinkHeader(key, link, curies))
          })
        } else {
          links.set(mapHalLinkToLinkHeader(key, body._links[key], curies))
        }
      })
    }
  }
  return links.refs
}
