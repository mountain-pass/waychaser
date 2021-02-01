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

    const acceptableMediaTypes = acceptable.filter(row => {
      return supportedContentTypes.some(mediaType => {
        return row.type === mediaType
      })
    })

    const contentType =
      acceptableMediaTypes.length > 0
        ? acceptableMediaTypes[0].type
        : defaultType
    return contentType
  } else {
    return defaultType
  }
}
