import MediaTypes from '../../util/media-types'
import { sirenActionHandler } from './siren-action-handler'
import { sirenLinkHandler } from './siren-link-handler'

/**
 * @param response
 * @param bodyGetter
 * @param next
 */
export async function sirenHandler (response, bodyGetter) {
  const contentType = response.headers.get('content-type')?.split(';')
  if (contentType?.[0] === MediaTypes.SIREN) {
    return [].concat(
      await sirenLinkHandler(response, bodyGetter),
      await sirenActionHandler(response, bodyGetter)
    )
  }
  return []
}
