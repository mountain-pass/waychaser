/**
 * @param relationship
 * @param link
 */

import { Operation } from '../../waychaser'

/**
 * @param relationship
 * @param link
 */
export function mapSirenLinkToOperation (relationship, link) {
  // we don't need to copy `rel` across, because we already have that from the {@param relationship}.
  // Also `rel` in `link` is an array, which is not what we're after.
  const { href, rel, ...otherProperties } = link
  return Operation.builder(relationship)
    .uri(href)
    .other(Object.assign({ handler: 'siren-link' }, otherProperties))
    .build()
}
