import { URI } from './util/uri-template-lite'
import qsStringify from 'qs-stringify'
import FormData from 'form-data'
import { preferredContentType } from './util/preferred-content-type'
import flatten from 'flat'
import { _waychaser, WayChaserOptions } from './waychaser'
import { BaseWayChaserResponse, WayChaserProblem, WayChaserResponse } from './waychaser-response'
import pointer from 'jsonpointer'
import { ProblemDocument } from 'http-problem-details'
import cartesian from 'cartesian'
import { augmentOptions } from './augment-options'
import { methodCanHaveBody } from './util/method-can-have-body'

export class Operation {
  rel: string
  uri: string
  method?: string
  parameters: Record<string, unknown> | Array<string>
  accept?: string
  anchor?: string;
  [key: string]: unknown
  constructor({
    rel,
    uri,
    method,
    parameters,
    accept,
    anchor,
    ...otherProperties
  }: Partial<Operation> & Pick<Operation, 'rel' | 'uri'>) {
    this.rel = rel
    this.uri = uri
    this.method = method
    this.parameters = parameters || {}
    this.accept = accept
    this.anchor = anchor
    Object.assign(this, otherProperties)
  }
}

export class InvocableOperation extends Operation {
  defaultOptions: WayChaserOptions
  response: WayChaserResponse<unknown> | WayChaserProblem<Response>

  constructor(
    operation: Operation,
    response: WayChaserResponse<unknown> | WayChaserProblem<Response>,
    defaultOptions: WayChaserOptions,
    thisContext: Record<string, string | number | bigint | boolean | undefined>,
  ) {
    super(operation)
    this.response = response
    this.defaultOptions = defaultOptions
    if (this.uri.includes('{this.')) {
      this.uri = URI.expand(this.uri, thisContext)
      console.log(this.uri)
    }

    // const pathParameters = URI.parameters(operation.uri)
    // for (const key in pathParameters) {
    //   this.parameters[key] = {}
    // }

  }



  private invokeAsFragment(
    parameters?: Record<string, unknown>,
  ): WayChaserResponse<unknown> | WayChaserProblem<Response> | WayChaserProblem<never> | undefined;

  private invokeAsFragment<Content>(
    parameters?: Record<string, unknown>,
    typePredicate?: (content: unknown) => content is Content
  ): WayChaserResponse<Content> | WayChaserProblem<Response> | WayChaserProblem<never> | undefined;

  private invokeAsFragment<Content>(
    parameters?: Record<string, unknown>,
    typePredicate?: (content: unknown) => content is Content
  ) {
    if (this.uri.startsWith('#/')) {
      const anchor = this.expandUrl(parameters).toString()
      const fragmentContent = this.response.fullContent && pointer.get(this.response.fullContent as object, anchor.slice(1)) as unknown
      if (typePredicate) {
        return typePredicate(fragmentContent) ? new WayChaserResponse<Content>({ defaultOptions: this.defaultOptions, baseResponse: this.response.response, content: fragmentContent, fullContent: this.response.fullContent, anchor, parentOperations: this.response.allOperations, parameters })
          : WayChaserProblem.create({
            problem: Object.assign(new ProblemDocument({
              type: "https://waychaser.io/unexpected-content",
              title: "Unexpected response content",
              detail: `The response '${JSON.stringify(fragmentContent)}' is not what we're expecting`
            }), { content: fragmentContent }), defaultOptions: this.defaultOptions, baseResponse: this.response.response, content: fragmentContent, fullContent: this.response.fullContent, parameters
          });
      }
      else {
        return new WayChaserResponse<unknown>({ defaultOptions: this.defaultOptions, baseResponse: this.response.response, content: fragmentContent, fullContent: this.response.fullContent, anchor, parentOperations: this.response.allOperations, parameters })
      }
    }
  }

  async invokeAll(
    options?: Partial<WayChaserOptions>
  ): Promise<Array<WayChaserResponse<unknown> | WayChaserProblem<Response> | WayChaserProblem<never> | undefined>>;


  async invokeAll<Content>(
    options?: Partial<WayChaserOptions<Content>>
  ): Promise<Array<WayChaserResponse<Content> | WayChaserProblem<Response> | WayChaserProblem<never> | undefined>>;

  async invokeAll<Content>(
    options?: Partial<WayChaserOptions<Content>>
  ): Promise<Array<WayChaserResponse<Content> | WayChaserProblem<Response> | WayChaserProblem<never> | undefined>> {
    if (this.uri.startsWith('#/') && this.response instanceof WayChaserResponse) {
      const result = this.doInvokeAll<Content>(options?.parameters || {})
      return Promise.all(result)
    }
    return Promise.all([this.invoke<Content>(options)])
  }

  private doInvokeAll(
    options?: Partial<WayChaserOptions>
  ): Array<WayChaserResponse<unknown> | WayChaserProblem<Response> | WayChaserProblem<never> | undefined>;


  private doInvokeAll<Content>(
    parameters: Record<string, unknown>,
    typePredicate?: (content: unknown) => content is Content
  ): Array<WayChaserResponse<Content> | WayChaserProblem<Response> | WayChaserProblem<never> | undefined>;


  private doInvokeAll<Content>(parameters: Record<string, unknown>,
    typePredicate?: (content: unknown) => content is Content): Array<WayChaserProblem<Response> | WayChaserProblem<never> | WayChaserResponse<unknown> | undefined> {
    const response = this.response as WayChaserResponse<unknown>
    // expand the URI with whatever parameters have been passed in
    const template = new URI.Template(this.uri)
    const uriParameters = Object.assign(URI.parameters(this.uri), parameters)
    const currentUri = template.expand(uriParameters).replace(/%7B/g, "{").replace(/%7D/g, "}")

    // get unfilled parameters
    const currentUriParameters = URI.parameters(currentUri)
    const keys = Object.keys(currentUriParameters)
    if (keys.length !== 0) {
      const field = currentUriParameters[keys[0]]
      const parentUri = currentUri.slice(1, currentUri.indexOf(field) - 1);
      const parent = parentUri === '' ? response.content : pointer.get(response.content as object, parentUri)
      if (parent) {
        const indices = Array.isArray(parent) ? [...Array.from({ length: parent.length }).keys()] : Object.keys(parent)
        return indices.flatMap(index => {
          const extendedParameters = Object.assign({}, parameters, { [keys[0]]: index })
          return this.doInvokeAll<Content>(extendedParameters, typePredicate)
        })
      }
      else {
        return [WayChaserProblem.create({
          problem: new ProblemDocument({
            type: "https://waychaser.io/fragment-uri-error",
            title: "The fragment URI does not match the content structure"
          }, { uri: parentUri, content: response.content as object }), parameters
        })]
      }
    }
    return [this.invokeAsFragment(parameters, typePredicate)]
  }


  async invoke(
    options?: Partial<WayChaserOptions>
  ): Promise<WayChaserResponse<unknown> | WayChaserProblem<Response> | WayChaserProblem<never>>;


  async invoke<Content>(
    options?: Partial<WayChaserOptions<Content>>
  ): Promise<WayChaserResponse<Content> | WayChaserProblem<Response> | WayChaserProblem<never>>;

  async invoke<Content>(
    options?: Partial<WayChaserOptions<Content>>
  ) {
    const fragment = this.invokeAsFragment(options?.parameters)
    if (fragment) {
      return fragment
    }
    const parameterSpecs = this.parameters || {}
    const parameters = Object.assign({}, this.defaultOptions.parameters, options?.parameters)
    const invokeUrl = this.url(parameters)

    const body = {}
    /* istanbul ignore if reason: TODO */
    if (Array.isArray(parameterSpecs)) {
      for (const key of parameterSpecs) {
        body[key] = parameters?.[key]
      }
    } else {
      for (const key of Object.keys(parameterSpecs)) {
        body[key] = parameters?.[key]
      }
    }
    let encodedContent
    let headers = {}
    const requestOptions = Object.assign({}, options)
    requestOptions.method = this.method

    if (Object.keys(this.parameters).length !== 0 && methodCanHaveBody(this.method || 'GET')) {
      const contentType = preferredContentType(
        this.accept,
        [
          'application/x-www-form-urlencoded',
          'application/json',
          'multipart/form-data'
        ],
        'application/x-www-form-urlencoded'
      )
      switch (contentType) {
        case 'application/x-www-form-urlencoded':
          encodedContent = qsStringify(body)
          break
        case 'application/json':
          encodedContent = JSON.stringify(body)
          break
        case 'multipart/form-data':
          encodedContent = new FormData()
          for (const name in body) {
            encodedContent.append(name, body[name])
          }
          break
      }
      if (contentType !== 'multipart/form-data') {
        headers = {
          'content-type': contentType
        }
      }
      // else fetch adds the right content-type header for us
      // with the boundaries

      requestOptions.body = encodedContent
      requestOptions.headers = Object.assign(headers, options?.headers)
    }
    return _waychaser(invokeUrl.toString(), this.defaultOptions, requestOptions)
  }

  private url(parameters?: Record<string, unknown>) {
    const expandedUri = this.expandUrl(parameters)
    const invokeUrl = new URL(expandedUri, this.response.url)
    return invokeUrl
  }

  private expandUrl(parameters: Record<string, unknown> | undefined) {
    return URI.expand(this.uri, flatten(parameters || {}))
  }
}




