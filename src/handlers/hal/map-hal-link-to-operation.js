import { Operation } from '../../waychaser'
import { deCurie } from './de-curie'

/**
 * @param relationship
 * @param link
 * @param curies
 */
export function mapHalLinkToOperation (relationship, link, curies) {
  // we don't need to copy `templated` across, because when we invoke an operation, we always
  // assume it's a template and expand it with the passed parameters
  const { href, templated, ...otherProperties } = link
  return Operation.builder(deCurie(relationship, curies))
    .uri(href)
    .other(Object.assign({ handler: 'hal-link' }, otherProperties))
    .build()
}
