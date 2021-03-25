import { Resource } from '../resource'

/**
 * Loads the resource at the provided url using fetch
 *
 * @param {string} hash hash of the resource fragment to load
 * @param response
 * @param waychaserContext
 * @returns {Resource} a ApiResourceObject representing the loaded fragment
 */
export async function loadResourceFragment (hash, response, waychaserContext) {
  return Resource.createFromFragment(response, hash.slice(1), waychaserContext)
}
