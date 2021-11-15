/* eslint-disable unicorn/prefer-ternary */
import { URI as origURI } from 'uri-template-lite'

export const URI = (() => {
  /* istanbul ignore next: it's complicated */
  if (typeof window === 'undefined') {
    // eslint-disable-next-line unicorn/prefer-module
    return origURI || global.URI
  } else {
    return window.URI || origURI
  }
})()
