import LinkHeader from 'http-link-header'
import MediaTypes from '../../util/media-types'
import { mapSirenActionToLinkHeader } from './map-siren-action-to-link-header'

/**
 * @param response
 * @param bodyGetter
 * @param next
 */

/**
 * @param response
 * @param bodyGetter
 * @param next
 */
export async function sirenActionHandler (response, bodyGetter, next) {
  const links = new LinkHeader()
  const contentType = response.headers.get('content-type')?.split(';')
  if (contentType?.[0] === MediaTypes.SIREN) {
    const body = await bodyGetter()
    if (body.actions) {
      body.actions?.forEach(action => {
        const mappedLink = mapSirenActionToLinkHeader(action)
        links.set(mappedLink)
      })
    }
  }
  return links.refs
}
