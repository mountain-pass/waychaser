import LinkHeader from 'http-link-header'
import MediaTypes from '../../util/media-types'
import { mapSirenLinkToLinkHeader } from './map-siren-link-to-link-header'

/**
 * @param response
 * @param bodyGetter
 * @param next
 */
export async function sirenLinkHandler (response, bodyGetter, next) {
  const links = new LinkHeader()
  const contentType = response.headers.get('content-type')?.split(';')
  if (contentType?.[0] === MediaTypes.SIREN) {
    const body = await bodyGetter()
    if (body.links) {
      body.links?.forEach(link => {
        link.rel.forEach(relationship => {
          const mappedLink = mapSirenLinkToLinkHeader(relationship, link)
          links.set(mappedLink)
        })
      })
    }
  }
  return links.refs
}
