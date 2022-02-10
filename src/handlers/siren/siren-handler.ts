import { Operation } from '../../operation'
import MediaTypes from '../../util/media-types'
import { sirenActionHandler } from './siren-action-handler'
import { sirenLinkHandler } from './siren-link-handler'

/**
 * @param response
 * @param content
 */
export function sirenHandler(
  response: Response,
  content?: unknown): Array<Operation> {
  const contentType = response.headers.get('content-type')?.split(';')
  if (contentType?.[0] === MediaTypes.SIREN) {
    return [
      ...(sirenLinkHandler(content)),
      ...(sirenActionHandler(content))
    ]
  }
  return []
}
