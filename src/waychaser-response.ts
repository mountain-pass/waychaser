/* global Response */
import { InvocableOperation, Operation } from './operation'
import { OperationArray } from './operation-array'
import { parseOperations } from './util/parse-operations'
import { HandlerSpec, WayChaserOptions } from './waychaser'
import pointer from 'jsonpointer'
import { ProblemDocument } from 'http-problem-details'
import { URI } from './util/uri-template-lite'
import flatten from 'flat'


export class BaseWayChaserResponse<Content, ResponseType extends (Response | undefined)> {
  allOperations: Record<string, Array<Operation>>
  operations: OperationArray
  anchor?: string
  response: ResponseType
  fullContent?: unknown
  parameters: Record<string, unknown>

  protected constructor({ })

  protected constructor({ handlers, defaultOptions, baseResponse, content, fullContent, anchor, parentOperations, parameters }: {
    handlers?: HandlerSpec[],
    defaultOptions?: WayChaserOptions,
    baseResponse: ResponseType,
    content?: Content,
    fullContent?: unknown,
    parameters?: Record<string, unknown>
    anchor?: string
    parentOperations?: Record<string, Array<Operation>>
  }
  ) {
    this.response = baseResponse
    this.anchor = anchor
    this.parameters = parameters || {}

    if (fullContent) {
      this.fullContent = fullContent;
    }

    this.operations = OperationArray.create()
    const thisContext = flatten({ this: content }) as Record<string, string | number | bigint | boolean | undefined>

    if (parentOperations && anchor && defaultOptions && (this instanceof WayChaserResponse || this instanceof WayChaserProblem)) {
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
    else if (baseResponse && handlers && defaultOptions && (this instanceof WayChaserResponse || this instanceof WayChaserProblem)) {
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
  ): Promise<WayChaserResponse<unknown> | WayChaserProblem<Response> | WayChaserProblem<never>> | undefined;

  invoke<RelatedContent>(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions<RelatedContent>>
  ): Promise<WayChaserResponse<RelatedContent> | WayChaserProblem<Response> | WayChaserProblem<never>> | undefined

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
  ): Promise<Array<WayChaserResponse<unknown> | WayChaserProblem<Response> | WayChaserProblem<never>>>;

  invokeAll<RelatedContent>(
    relationship: string | Record<string, unknown>
      | ((
        this: void,
        value: InvocableOperation,
        index: number,
        object: InvocableOperation[]
      ) => unknown),
    options?: Partial<WayChaserOptions<RelatedContent>>
  ): Promise<Array<WayChaserResponse<RelatedContent> | WayChaserProblem<Response> | WayChaserProblem<never>>>;

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

export class WayChaserProblem<ResponseType extends (Response | undefined)> extends BaseWayChaserResponse<unknown, ResponseType> {
  problem: ProblemDocument

  private constructor({ handlers, defaultOptions, baseResponse, problem, content, fullContent, parameters }: {
    handlers?: HandlerSpec[],
    defaultOptions?: WayChaserOptions,
    baseResponse?: ResponseType,
    problem: ProblemDocument,
    content?: unknown,
    fullContent?: unknown,
    parameters?: Record<string, unknown>
  }) {
    if (baseResponse) {
      super({ handlers, defaultOptions, baseResponse, content, fullContent: fullContent || content, parameters })
    }
    else {
      super({ parameters })
    }
    this.problem = problem
  }

  static create({ problem, parameters }: {
    problem: ProblemDocument,
    parameters?: Record<string, unknown>
  }): WayChaserProblem<never>

  static create({ handlers, defaultOptions, baseResponse, problem, content, parameters }: {
    handlers?: HandlerSpec[],
    defaultOptions: WayChaserOptions,
    baseResponse: Response,
    problem: ProblemDocument,
    content?: unknown,
    fullContent?: unknown,
    parameters?: Record<string, unknown>
  }): WayChaserProblem<Response>

  static create({ handlers, defaultOptions, baseResponse, problem, content, fullContent, parameters }: {
    handlers?: HandlerSpec[],
    defaultOptions: WayChaserOptions,
    baseResponse?: Response,
    problem: ProblemDocument,
    content?: unknown,
    fullContent?: unknown,
    parameters?: Record<string, unknown>
  }) {
    return baseResponse
      ? new WayChaserProblem<undefined>({ defaultOptions, problem, parameters })
      : new WayChaserProblem<Response>({ handlers, defaultOptions, baseResponse, problem, content, fullContent, parameters });
  }
}

export class WayChaserResponse<Content> extends BaseWayChaserResponse<Content, Response> {
  content: Content

  constructor({ handlers, defaultOptions, baseResponse, content, fullContent, anchor, parentOperations, parameters }: {
    handlers?: HandlerSpec[],
    defaultOptions: WayChaserOptions,
    baseResponse: Response,
    content: Content,
    fullContent?: unknown,

    anchor?: string
    parentOperations?: Record<string, Array<Operation>>,
    parameters?: Record<string, unknown>
  }) {
    super({ handlers, defaultOptions, baseResponse, content, fullContent: fullContent || content, anchor, parentOperations, parameters })
    this.content = content
  }

  static async create(baseResponse: Response,
    defaultOptions: WayChaserOptions,
    mergedOptions: WayChaserOptions): Promise<WayChaserResponse<unknown> | WayChaserProblem<Response> | WayChaserProblem<never>>;

  static async create<Content>(baseResponse: Response,
    defaultOptions: WayChaserOptions,
    mergedOptions: WayChaserOptions<Content>
  ): Promise<WayChaserResponse<Content> | WayChaserProblem<Response> | WayChaserProblem<never>>;

  static async create<Content>(baseResponse: Response,
    defaultOptions: WayChaserOptions,
    mergedOptions: WayChaserOptions<Content>) {
    // TODO allow lazy loading of the content 
    const content = await mergedOptions.contentParser(baseResponse)
    // content is unknown, a post response client side PD, a server side PD or undefined

    if (content instanceof ProblemDocument) {
      return WayChaserProblem.create({ handlers: mergedOptions.handlers, defaultOptions, baseResponse, problem: content, content, parameters: mergedOptions.parameters })
    }
    else {
      if (mergedOptions.typePredicate) {
        if (mergedOptions.typePredicate(content)) {
          return new WayChaserResponse({ handlers: mergedOptions.handlers, defaultOptions, baseResponse, content, parameters: mergedOptions.parameters })
        }
        else {
          const problem = Object.assign(new ProblemDocument({
            type: "https://waychaser.io/unexpected-response",
            title: "Unexpected response content",
            detail: "The response does not contain the fields expected"
          }), { content: content })
          return WayChaserProblem.create({ handlers: mergedOptions.defaultHandlers, defaultOptions, baseResponse, problem, content, parameters: mergedOptions.parameters })
        }
      }
      else {
        const response = new WayChaserResponse({ handlers: mergedOptions.defaultHandlers, defaultOptions, baseResponse, content, parameters: mergedOptions.parameters })
        return response;
      }
    }
  }
}