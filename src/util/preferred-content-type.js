import { parseAccept } from './parse-accept'

/**
 * @param accept
 * @param supportedContentTypes
 * @param defaultType
 */
export function preferredContentType (
  accept,
  supportedContentTypes,
  defaultType
) {
  if (accept) {
    const acceptable = parseAccept(accept)

    const acceptableMediaTypes = acceptable.find(row => {
      return supportedContentTypes.includes(row.type)
    })

    return acceptableMediaTypes.type
  } else {
    return defaultType
  }
}
