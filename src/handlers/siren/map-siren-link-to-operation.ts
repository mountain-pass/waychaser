/**
 * @param relationship
 * @param link
 */

import { Operation } from "../../operation"

/**
 * @param relationship
 * @param link
 */
export function mapSirenLinkToOperation(relationship: string, link: { href: string, rel: string } & Record<string, unknown>): Operation {
  // we don't need to copy `rel` across, because we already have that from the {@param relationship}.
  // Also `rel` in `link` is an array, which is not what we're after.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { href, rel, ...otherProperties } = link
  return new Operation({ rel: relationship, uri: href, ...otherProperties })
}
