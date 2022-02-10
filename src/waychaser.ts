import { halHandler } from './handlers/hal/hal-handler'
import { linkHeaderHandler } from './handlers/link-header/link-header-handler'
import { sirenHandler } from './handlers/siren/siren-handler'
import { Operation } from './operation'
import MediaTypes from './util/media-types'
// import { fetch } from 'cross-fetch'
import { locationHeaderHandler } from './handlers/location-header/location-header-handler'
import { WayChaserResponse, WayChaserProblem } from './waychaser-response'
import { augmentOptions } from './augment-options'
import { ProblemDocument } from 'http-problem-details'

export { WayChaserResponse as WayChaserResponse }
export { WayChaserProblem as WayChaserProblem }

export type HandlerSpec = {
  handler: (
    baseResponse: Response,
    content: unknown,
    stopper: () => void
  ) => Array<Operation> | undefined
  mediaRanges: Array<
    | string
    | {
      mediaType: string
      q?: number
    }
  >
  q?: number
}

export type Stopper = () => void

export type WayChaserOptions<Content = null> = RequestInit & {
  fetch: typeof fetch
  handlers: Array<HandlerSpec>
  defaultHandlers: Array<HandlerSpec>
  preInterceptors: Array<(uriOrRequest, updateOptions, Stopper) => void>
  postInterceptors: Array<(WayChaserResponse, Stopper) => void>
  contentParser: (response: Response) => Promise<unknown | ProblemDocument | undefined>
  typePredicate?: Content extends null | undefined | never ? never : (content: unknown) => content is Content
  parameters?: Record<string, unknown>
}

/**
 * @param handlers
 */
export function sortHandlers(
  handlers: Array<HandlerSpec>
): Array<HandlerSpec> {
  return handlers.sort((a, b) => {
    // -ve if less
    // e.g. a.q = 0.3, b.q = 0.4, then a.q - b.q = 0.3 - 0.4 = -0.1
    return (b.q || 1) - (a.q || 1)
  })
}

// pre handlers is sorted
/**
 * @param handlers
 */
function allMediaRanges(handlers: Array<HandlerSpec>) {
  const rval: Array<{ type: string; q: number }> = []
  for (const handlerSpec of handlers) {
    for (const range of handlerSpec.mediaRanges) {
      if (typeof range === 'object') {
        if (handlerSpec.q) {
          rval.push({ type: range.mediaType, q: handlerSpec.q * (range.q || 1) })
        } else {
          rval.push({ type: range.mediaType, q: (range.q || 1) })
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
    const k = item.type
    return seen.has(k) ? false : seen.add(k)
  })
  return filtered
}


export async function _waychaser(
  uriOrRequest: string | Request,
  defaults: WayChaserOptions,
  options?: Partial<WayChaserOptions>
): Promise<WayChaserResponse<unknown> | WayChaserProblem<Response> | WayChaserProblem<never>>;

export async function _waychaser<Content>(
  uriOrRequest: string | Request,
  defaults: WayChaserOptions,
  options?: Partial<WayChaserOptions<Content>>
): Promise<WayChaserResponse<Content> | WayChaserProblem<Response> | WayChaserProblem<never>>;

/**
 * @param uriOrRequest
 * @param defaultOptions
 * @param options
 */
export async function _waychaser<Content>(
  uriOrRequest: string | Request,
  defaultOptions: WayChaserOptions,
  options?: Partial<WayChaserOptions<Content>>,
) {

  const mergedOptions = augmentOptions(defaultOptions, options)
  const mergedHandlers = mergedOptions.defaultHandlers

  if (!mergedOptions.fetch) {
    throw new Error('No global fetch and fetch not provided in options')
  }

  const defaultAcceptRanges = allMediaRanges(mergedHandlers)
  const defaultAcceptStrings = defaultAcceptRanges.map(accept => {
    return accept.q === 1 ? accept.type : `${accept.type};q=${accept.q}`
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

    headers: { ...(mergedOptions.headers || {}), accept: fullAcceptHeader }
  }

  let stop = false
  for (const interceptor of updateOptions.preInterceptors || []) {
    interceptor(uriOrRequest, updateOptions, () => (stop = true))
    if (stop) {
      break
    }
  }

  try {
    const bareResponse = await mergedOptions.fetch(
      uriOrRequest.toString(),
      updateOptions
    )

    const response = await WayChaserResponse.create(bareResponse, defaultOptions, mergedOptions)

    stop = false
    for (const interceptor of updateOptions.postInterceptors || []) {
      interceptor(response, () => (stop = true))
      if (stop) {
        break
      }
    }
    return response
  }
  catch (error) {
    if (error instanceof TypeError) {
      const problem = new ProblemDocument({
        type: "https://waychaser.io/type-error",
        title: "Error sending request"
      }, { error })
      return WayChaserProblem.create({ problem })
    }
    else if (error.name === 'AbortError') {
      const problem = new ProblemDocument({
        type: "https://waychaser.io/aborted",
        title: "The request was aborted"
      }, { error })
      return WayChaserProblem.create({ problem })
    }
    else {
      const problem = new ProblemDocument({
        type: "https://waychaser.io/fetch-error",
        title: "The request failed"
      }, { error })
      return WayChaserProblem.create({ problem })
    }
  }
}

/**
 *
 */
function getGlobal() {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  return;
}


const wayChaserDefaults: WayChaserOptions = {
  fetch: typeof window !== 'undefined' ? window.fetch?.bind(window) : getGlobal()?.fetch,
  handlers: [],
  defaultHandlers: sortHandlers([
    { handler: locationHeaderHandler, mediaRanges: ['*/*'], q: 0.4 },
    { handler: linkHeaderHandler, mediaRanges: ['*/*'], q: 0.5 },
    { handler: halHandler, mediaRanges: [MediaTypes.HAL], q: 0.5 },
    { handler: sirenHandler, mediaRanges: [MediaTypes.SIREN], q: 0.5 }
  ]),
  preInterceptors: [],
  postInterceptors: [],
  contentParser: async (response: Response): Promise<unknown | ProblemDocument | undefined> => {
    if (response.headers.get('content-length') &&
      response.headers.get('content-length') !== '0') {
      const content = await response.text()
      const contentType = response.headers.get('content-type')
      if (contentType?.split(';')?.[0].endsWith('json')) {
        try {
          const jsonContent = JSON.parse(content)
          return contentType === 'application/problem+json' ? Object.assign(new ProblemDocument(jsonContent), jsonContent) : jsonContent;
        }
        catch (error) {
          return new ProblemDocument({
            type: "https://waychaser.io/invalid-json",
            title: "JSON response could not be parsed",
            detail: `The response document with content type '${contentType}' could not be parsed as json`
          }, { content, error })
        }
      }
      return new ProblemDocument({
        type: "https://waychaser.io/unsupported-content-type",
        title: "The response has an unsupported content type",
        detail: `The response document has a content type of '${contentType}' which is not supported`
      }, { content, ...(contentType && { contentType }) });
    }
    // else no content. Returning undefined
  }

}


/**
 * @param newDefaults
 * @param oldDefaults
 */
function _defaults(
  newDefaults: Partial<WayChaserOptions>,
  oldDefaults: WayChaserOptions
) {
  const mergedOptions = augmentOptions(oldDefaults, newDefaults)
  const defaultedWaychaser = <Content>(
    uriOrRequest: string | Request,
    options?: Partial<WayChaserOptions<Content>>) => _waychaser<Content>(uriOrRequest, mergedOptions, options)

  defaultedWaychaser.defaults = (newDefaults: Partial<WayChaserOptions>) =>
    _defaults(newDefaults, mergedOptions)
  return defaultedWaychaser
}



// type WayChaser<Content> = typeof _waychaser & {
//   defaults: (newDefaults: WayChaserOptions) => WayChaser<Content>
// }

export const waychaser = Object.assign(
  <Content>(
    uriOrRequest: string | Request,
    options?: Partial<WayChaserOptions<Content>>,
  ) => {
    return _waychaser(uriOrRequest, wayChaserDefaults, options)
  },
  {
    defaults: (newDefaults: Partial<WayChaserOptions>) =>
      _defaults(newDefaults, wayChaserDefaults)
  }
)