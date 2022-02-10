/* eslint-disable unicorn/prefer-ternary */
import { URI as origURI } from 'uri-template-lite'


/**
 *
 */
function getUri() {
  /* istanbul ignore next: it's complicated */
  if (typeof window === 'undefined') {
    // eslint-disable-next-line unicorn/prefer-module
    return origURI || global.URI
  } else {
    return window.URI || origURI
  }
}

/**
 *
 */
function getExtendedUri() {
  const base = getUri()
  base.parameters = function (url) {
    const template = new URI.Template(url)
    return template.match(url)
  }
  return base
}


export const URI = getExtendedUri()
