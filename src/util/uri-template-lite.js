/* eslint-disable unicorn/prefer-ternary */
import { URI as origURI } from 'uri-template-lite'

export const URI = (() => {
  /* istanbul ignore else: else only gets executed on browser */
  if (typeof window === 'undefined') {
    return origURI
  } else {
    return window.URI || origURI
  }
})()
