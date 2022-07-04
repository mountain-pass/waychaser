/* global Response */
import { InvocableOperation, Operation } from './operation'
import { OperationArray } from './operation-array'
import { parseOperations } from './util/parse-operations'
import { URI } from './util/uri-template-lite'
import flatten from 'flat'

import { halHandler } from './handlers/hal/hal-handler'
import { linkHeaderHandler } from './handlers/link-header/link-header-handler'
import { sirenHandler } from './handlers/siren/siren-handler'
import MediaTypes from './util/media-types'
// import { fetch } from 'cross-fetch'
import { locationHeaderHandler } from './handlers/location-header/location-header-handler'
import { augmentOptions } from './augment-options'
import { ProblemDocument } from '@mountainpass/problem-document'

export type ValidationSuccess<Content> = {
  success: true
  content: Content
}

export type ValidationError = {
  success: false
  problem: ProblemDocument
}

export type ValidationResult<Content> = ValidationSuccess<Content> | ValidationError

export type Validator<Content> = (content: unknown) => ValidationResult<Content>;

/**
 * @param result
 */
export function isValidationSuccess<Content>(result: ValidationResult<Content>): result is ValidationSuccess<Content>{
  return result.success
}


export class WayChaserResponse<Content>  {
  content: Content
  allOperations: Record<string, Array<Operation>>
  operations: OperationArray
  anchor?: string
  response: Response
  fullContent?: unknown
  parameters: Record<string, unknown>

  constructor({ handlers, defaultOptions, baseResponse, content, fullContent, anchor, parentOperations, parameters }: {
    handlers?: HandlerSpec[],
    defaultOptions?: WayChaserOptions,
    baseResponse: Response,
    content: Content,
    fullContent?: unknown,
    parameters?: Record<string, unknown>
    anchor?: string
    parentOperations?: Record<string, Array<Operation>>
  }
  ) {
    this.response = baseResponse
    this.anchor = anchor
    this.parameters = parameters || {}

    this.fullContent = fullContent || content;
    this.content = content;
    this.operations = OperationArray.create()
    const thisContext = flatten({ this: content }) as Record<string, string | number | bigint | boolean | undefined>

    if (parentOperations && anchor && defaultOptions) {
      this.allOperations = parentOperations
      for (const operation of this.allOperations[anchor] || []) {
        this.operations.push(
          new InvocableOperation(operation, this, defaultOptions, thisContext)
        )
      }
      // not only do we need to go through the operations with a matching anchor
      // we also need to go though anchors that could match this.anchor
      for (const key in this.allOperations) {
        if (key !== '') {
          // need to see if key could match this.anchor
          const template = new URI.Template(key)
          const parameters = template.match(this.anchor)
          const expandedAnchor = template.expand(parameters)
          if (expandedAnchor === this.anchor) {
            const expandedOptions = Object.assign({}, defaultOptions, { parameters: Object.assign(parameters, defaultOptions.parameters) })
            for (const operation of this.allOperations[key]) {
              this.operations.push(
                new InvocableOperation(operation, this, expandedOptions, thisContext)
              )
            }
          }
        }
      }
    }
    else if (baseResponse && handlers && defaultOptions) {
      this.allOperations = parseOperations({
        baseResponse,
        content,
        handlers
      })
      this.operations = OperationArray.create()
      for (const operation of this.allOperations[''] || []) {
        const op = new InvocableOperation(operation, this, defaultOptions, thisContext)
        this.operations.push(
          op
        )
      }
    }
  }

  static create(baseResponse: Response,
    content: unknown,
    defaultOptions: WayChaserOptions,
    mergedOptions: WayChaserOptions): WayChaserResponse<unknown>;

  static create<Content>(baseResponse: Response,
    content: unknown,
    defaultOptions: WayChaserOptions,
    mergedOptions: WayChaserOptions<Content>
  ): WayChaserResponse<Content>

  /**
   * @param baseResponse
   * @param content
   * @param defaultOptions
   * @param mergedOptions
   * @returns 
   * @throws {WayChaserProblem}
   */
  static create<Content>(baseResponse: Response,
    content: unknown,
    defaultOptions: WayChaserOptions,
    mergedOptions: WayChaserOptions<Content>) {

    if (content instanceof ProblemDocument) {
      throw new WayChaserProblem({
        response: new WayChaserResponse({ handlers: mergedOptions.defaultHandlers, defaultOptions, baseResponse, content, parameters: mergedOptions.parameters }),
        problem: content,
      })
    }
    else {
      if (mergedOptions.validator) {
          const validationResult = mergedOptions.validator(content)
          if (isValidationSuccess(validationResult)) {
            return new WayChaserResponse({ handlers: mergedOptions.defaultHandlers, defaultOptions, baseResponse, content: validationResult.content, parameters: mergedOptions.parameters });
          }
          else {
            throw new WayChaserProblem({
              response: new WayChaserResponse({ handlers: mergedOptions.defaultHandlers, defaultOptions, baseResponse, content, parameters: mergedOptions.parameters }),
              problem: validationResult.problem,
            })
          }
      }
      else {
        return new WayChaserResponse({ handlers: mergedOptions.defaultHandlers, defaultOptions, baseResponse, content, parameters: mergedOptions.parameters })
      }
    }
  }



  get ops() {
    return this.operations
  }

  invoke(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions>
  ): Promise<WayChaserResponse<unknown>> | undefined;

  invoke<RelatedContent>(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions<RelatedContent>>
  ): Promise<WayChaserResponse<RelatedContent>> | undefined

  invoke<RelatedContent>(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions<RelatedContent>>
  ) {
    return this.operations.invoke(relationship, options)
  }

  invokeAll(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions>
  ): Promise<Array<WayChaserResponse<unknown>>>;

  invokeAll<RelatedContent>(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions<RelatedContent>>
  ): Promise<Array<WayChaserResponse<RelatedContent>>>;

  invokeAll<RelatedContent>(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions<RelatedContent>>
  ) {
    return this.operations.invokeAll(relationship, options)
  }

  get body(): ReadableStream {
    throw new Error('Not Implemented. Use `.content` instead')
  }

  get bodyUsed() {
    return true
  }

  get headers() {
    return this.response?.headers
  }

  get ok() {
    return this.response ? this.response.ok : false
  }

  get redirected() {
    return this.response ? this.response.redirected : false
  }

  get status() {
    return this.response?.status
  }

  get statusText() {
    return this.response?.statusText
  }

  get type() {
    return this.response?.type
  }

  get url() {
    return this.response?.url
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    throw new Error('Not Implemented. Use `.content` instead')
  }

  blob(): Promise<Blob> {
    throw new Error('Not Implemented. Use `.content` instead')
  }

  clone(): Response {
    throw new Error('Not Implemented')
  }

  formData(): Promise<FormData> {
    throw new Error('Not Implemented. Use `.content` instead')
  }

  // async json() {
  //   throw new Error('Not Implemented. Use `.content` instead')
  // }

  text(): Promise<string> {
    throw new Error('Not Implemented. Use `.content` instead')
  }


}
export class WayChaserProblem extends Error {
  readonly problem: ProblemDocument
  readonly response: WayChaserResponse<unknown>

  constructor({ response, problem }: {
    response: WayChaserResponse<unknown>,
    problem: ProblemDocument
  }) {
    // 'Error' breaks prototype chain here
    super(problem.detail);
    // restore prototype chain   
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) { Object.setPrototypeOf(this, actualProto); }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else { (this as any).__proto__ = actualProto; }

    this.problem = problem
    this.response = response
  }
}

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

export type ContentParser = (response: Response, contentParser?: ContentParser) => Promise<unknown | ProblemDocument | undefined>

export type WayChaserOptions<ValidatorContent = null> = RequestInit & {
  fetch: typeof fetch
  handlers: Array<HandlerSpec>
  defaultHandlers: Array<HandlerSpec>
  preInterceptors: Array<(uriOrRequest, updateOptions, stopper) => void>
  postInterceptors: Array<<InterceptorContent>(response: (WayChaserResponse<InterceptorContent>), stop: Stopper) => void>
  postErrorInterceptors: Array<(error: WayChaserProblem | Error, stopper: Stopper) => void>
  contentParser: ContentParser
  parameters?: Record<string, unknown>
  validator?: Validator<ValidatorContent>
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
): Promise<WayChaserResponse<unknown>>;

export async function _waychaser<Content>(
  uriOrRequest: string | Request,
  defaults: WayChaserOptions,
  options?: Partial<WayChaserOptions<Content>>
): Promise<WayChaserResponse<Content>>;

/**
 * @param uriOrRequest
 * @param defaultOptions
 * @param options
 * @returns {Promise<WayChaserResponse<Content>>}
 * @throws {TypeError | AbortError | WayChaserProblem}
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

    headers: { ...mergedOptions.headers, accept: fullAcceptHeader }
  }

  let stop = false
  for (const interceptor of updateOptions.preInterceptors || []) {
    interceptor(uriOrRequest, updateOptions, () => (stop = true))
    if (stop) {
      break
    }
  }

  const baseResponse = await mergedOptions.fetch(
    uriOrRequest.toString(),
    updateOptions
  )

  try {
    // TODO allow lazy loading of the content 
    const content = await mergedOptions.contentParser(baseResponse)
    // content is
    // 1. unknown, 
    // 4. undefined
    const response = WayChaserResponse.create(baseResponse, content, defaultOptions, mergedOptions)

    stop = false
    for (const interceptor of updateOptions.postInterceptors) {
      interceptor(response, () => (stop = true))
      if (stop) {
        break
      }
    }
    return response
  }
  catch(error: unknown){
    const response = new WayChaserResponse({ handlers: mergedOptions.defaultHandlers, defaultOptions, baseResponse, content: error, parameters: mergedOptions.parameters })
        
    const wayChaserProblem = error instanceof ProblemDocument ? new WayChaserProblem({
        response,
        problem: error,
      }) : new WayChaserProblem({
        response,
        problem: new ProblemDocument({
          type: "https://waychaser.io/unexected-error",
          title: "An unexpected error occurred",
          error
        }),
      });
      stop = false
      for (const interceptor of updateOptions.postErrorInterceptors) {
        interceptor(wayChaserProblem, () => (stop = true))
        if (stop) {
          break
        }
      }
  
    throw wayChaserProblem
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

/**
 *
 * @param content
 * @param contentType
 */
function tryParseJson(content: string, contentType: string) {
  try {
    return JSON.parse(content)
  }
  catch(error) {
    throw new ProblemDocument({
      type: "https://waychaser.io/invalid-json",
      title: "JSON response could not be parsed",
      detail: `The response document with content type '${contentType}' could not be parsed as json`,
      content, error
    })
  }
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
  postErrorInterceptors: [],
  contentParser: async (response: Response): Promise<unknown | undefined> => {
    if (response.headers.get('content-length') &&
      response.headers.get('content-length') !== '0') {
      const content = await response.text()
      const contentType = response.headers.get('content-type')?.split(';')?.[0]
      if (contentType?.endsWith('json')) {
        const jsonContent = tryParseJson(content, contentType)
        if( contentType === 'application/problem+json' ) {
          throw Object.assign(new ProblemDocument(jsonContent), jsonContent)
        }
        else {
          return jsonContent;
        }
      }
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
  defaultedWaychaser.currentDefaults = mergedOptions;
  defaultedWaychaser.defaults = (newDefaults: Partial<WayChaserOptions>) =>
    _defaults(newDefaults, mergedOptions)
  return defaultedWaychaser
}



/**
 * calls fetch on the passed in uriOrRequest and parses the response
 * 
 * @param uriOrRequest see RequestInit
 * @param options see WayChaserOptions
 * @returns WayChaserResponse<Content>
 * @throws TypeError | AbortError | WayChaserResponseProblem | Error
 */
export const waychaser = Object.assign(
  <Content>(
    uriOrRequest: string | Request,
    options?: Partial<WayChaserOptions<Content>>,
  ) => {
    return _waychaser(uriOrRequest, wayChaserDefaults, options)
  },
  {
    currentDefaults: wayChaserDefaults,
    defaults: (newDefaults: Partial<WayChaserOptions>) =>
      _defaults(newDefaults, wayChaserDefaults)
  }
)