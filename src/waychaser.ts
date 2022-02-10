import logger from './util/logger'
import { halHandler } from './handlers/hal/hal-handler'
import { linkHeaderHandler } from './handlers/link-header/link-header-handler'
import { sirenHandler } from './handlers/siren/siren-handler'
import { loadResource } from './util/load-resource'
import { Operation } from './operation'
import { parseAccept } from './util/parse-accept'
import MediaTypes from './util/media-types'
import { fetch } from 'cross-fetch'
import { locationHeaderHandler } from './handlers/location-header/location-header-handler'
import pointer from 'jsonpointer'
import { extendResponse } from './extendResponse'
import { WayChaserResponse } from './WayChaserResponse'
import { augmentOptions } from './augmentOptions'

export type HandlerSpec = {
  handler: (
    response: WayChaserResponse,
    stopper?: () => void
  ) => Array<Operation> | Promise<Array<Operation>>
  mediaRanges: Array<
    | string
    | {
        mediaType: string
        q?: number
      }
  >
  q?: number
}

export type WayChaserOptions = RequestInit & {
  fetch?: typeof fetch
  handlers?: Array<HandlerSpec>
  defaultHandlers?: Array<HandlerSpec>
}

export function sortHandlers (
  handlers: Array<HandlerSpec>
): Array<HandlerSpec> {
  return handlers.sort((a, b) => {
    // -ve if less
    // e.g. a.q = 0.3, b.q = 0.4, then a.q - b.q = 0.3 - 0.4 = -0.1
    return (b.q || 1) - (a.q || 1)
  })
}

// pre handlers is sorted
function allMediaRanges (handlers: Array<HandlerSpec>) {
  const rval: Array<{ type: string; q: number }> = []
  for (const handlerSpec of handlers) {
    for (const range of handlerSpec.mediaRanges) {
      if (typeof range === 'object') {
        if (handlerSpec.q) {
          rval.push({ type: range.mediaType, q: handlerSpec.q * range.q })
        } else {
          rval.push({ type: range.mediaType, q: range.q })
        }
      } else {
        if (handlerSpec.q) {
          rval.push({ type: range, q: handlerSpec.q })
        } else {
          rval.push({ type: range, q: 1 })
        }
      }
    }
  }
  const sorted = rval.sort((a, b) => {
    return a.q - b.q
  })
  const seen = new Set()
  const filtered = sorted.filter(item => {
    let k = item.type
    return seen.has(k) ? false : seen.add(k)
  })
  return filtered
}

export async function _waychaser (
  uriOrRequest: string | Request,
  options?: WayChaserOptions,
  defaults?: WayChaserOptions
): Promise<WayChaserResponse> {
  const mergedOptions = augmentOptions(defaults, options)
  const mergedHandlers = mergedOptions.defaultHandlers

  const defaultAcceptRanges = allMediaRanges(mergedHandlers)
  const defaultAcceptStrings = defaultAcceptRanges.map(accept => {
    if (accept.q === 1) {
      return accept.type
    } else {
      return `${accept.type};q=${accept.q}`
    }
  })

  const additionalAcceptHeader = options?.headers?.['accept']
    ? [options.headers['accept']]
    : []

  const fullAcceptHeader = [
    ...additionalAcceptHeader,
    ...defaultAcceptStrings
  ].join(',')

  const updateOptions = {
    ...mergedOptions,
    ...{
      headers: { ...(mergedOptions.headers || {}), accept: fullAcceptHeader }
    }
  }

  const bareResponse = await mergedOptions.fetch(
    uriOrRequest.toString(),
    updateOptions
  )
  const response = await WayChaserResponse.create(bareResponse, defaults)

  return response
}

const wayChaserDefaults = {
  fetch: fetch,
  defaultHandlers: sortHandlers([
    { handler: locationHeaderHandler, mediaRanges: ['*/*'], q: 0.4 },
    { handler: linkHeaderHandler, mediaRanges: ['*/*'], q: 0.5 },
    { handler: halHandler, mediaRanges: [MediaTypes.HAL], q: 0.5 },
    { handler: sirenHandler, mediaRanges: [MediaTypes.SIREN], q: 0.5 }
  ])
}

export const waychaser = (
  uriOrRequest: string | Request,
  options?: WayChaserOptions
) => _waychaser(uriOrRequest, options, wayChaserDefaults)

function _defaults (
  newDefaults: WayChaserOptions,
  oldDefaults: WayChaserOptions
) {
  const mergedOptions = augmentOptions(oldDefaults, newDefaults)
  const defaultedWaychaser = (
    uriOrRequest: string | Request,
    options?: WayChaserOptions
  ) => _waychaser(uriOrRequest, options, mergedOptions)

  defaultedWaychaser.defaults = (newDefaults: WayChaserOptions) =>
    _defaults(newDefaults, mergedOptions)
  return defaultedWaychaser
}

waychaser.defaults = (newDefaults: WayChaserOptions) =>
  _defaults(newDefaults, wayChaserDefaults)
