import MediaTypes from '../../util/media-types'
import { sirenActionHandler } from './siren-action-handler'
import { sirenLinkHandler } from './siren-link-handler'

/**
 * @param response
 */
export async function sirenHandler (response) {
  const contentType = response.headers.get('content-type')?.split(';')
  if (contentType?.[0] === MediaTypes.SIREN) {
    return [
      ...(await sirenLinkHandler(response.content)),
      ...(await sirenActionHandler(response.content))
    ]
  }
  return []
}
