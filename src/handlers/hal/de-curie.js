import { URI } from 'uri-template-lite'

/**
 * @param relationship
 * @param curies
 */

/**
 * @param relationship
 * @param curies
 */
export function deCurie (relationship, curies) {
  // we can either look in the rel for ':' and try to convert if it exists, but then we'll be trying to covert almost
  // everything because none standard rels typically start with 'http:' or 'https:'.
  // otherwise we can iterate over all the curies and try to replace. Seems inefficient.
  // Going with option 1 for now.
  // ⚠️ NOTE TO SELF: never use 'http' or 'https' as a curie name or hilarity will not ensue 😬
  // ⚠️ ALSO NOTE TO SELF: never use ':' in a curie name or hilarity will not ensue 😬
  // I'm going to assume that if there are multiple ':' characters, then we ignore all but the first
  const splitRelationship = relationship.split(/:(.+)/)
  if (splitRelationship.length > 1) {
    const [curieName, curieRemainder] = splitRelationship
    const rval = curies[curieName]
      ? URI.expand(curies[curieName], { rel: curieRemainder })
      : relationship
    return rval
  } else {
    return relationship
  }
}
