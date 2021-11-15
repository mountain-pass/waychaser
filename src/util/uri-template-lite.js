/* eslint-disable unicorn/prefer-ternary */
import { URI as origURI } from 'uri-template-lite'

export const URI = (() => {
  /* istanbul ignore next: it's complicated */
  if (typeof window === 'undefined') {
    return origURI || exports.URI
  } else {
    return window.URI || origURI
  }
})()
