import MediaTypes from '../../util/media-types'
import { sirenActionHandler } from './siren-action-handler'
import { sirenLinkHandler } from './siren-link-handler'

/**
 * @param response
 * @param bodyGetter
 */
export async function sirenHandler (response, bodyGetter) {
  const contentType = response.headers.get('content-type')?.split(';')
  if (contentType?.[0] === MediaTypes.SIREN) {
    return [
      ...(await sirenLinkHandler(bodyGetter)),
      ...(await sirenActionHandler(bodyGetter))
    ]
  }
  return []
}
