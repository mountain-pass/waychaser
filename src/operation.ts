import { loadResource } from './util/load-resource'
import { loadResourceFragment } from './util/load-resource-fragment'
import logger from './util/logger'
import { URI } from './util/uri-template-lite'
import qsStringify from 'qs-stringify'
import FormData from 'form-data'
import { preferredContentType } from './util/preferred-content-type'
import flatten from 'flat'
import pointer from 'jsonpointer'
import { _waychaser, WayChaserOptions } from './waychaser'
import { WayChaserResponse } from './WayChaserResponse'
import { augmentOptions } from './augmentOptions'

export class Operation {
  rel: string
  uri: string | URL
  method?: string
  parameters?: Array<string> | Record<string, {}>
  accept?: string
  anchor?: string;
  [key: string]: any
  constructor ({
    rel,
    uri,
    method,
    parameters,
    accept,
    anchor,
    ...otherProperties
  }: Operation) {
    this.rel = rel
    this.uri = uri
    this.method = method
    this.parameters = parameters
    this.accept = accept
    this.anchor = anchor
    Object.assign(this, otherProperties)
  }
}

export class InvocableOperation extends Operation {
  options: WayChaserOptions
  response: WayChaserResponse

  constructor (
    operation: Operation,
    response: WayChaserResponse,
    options: WayChaserOptions
  ) {
    super(operation)
    this.response = response
    this.options = options
  }

  async invoke (
    parameters?,
    options?: WayChaserOptions
  ): Promise<WayChaserResponse> {
    const parameterSpecs = this.parameters || {}

    const thisContext = flatten({ this: this.response.content })

    const expandedUri = URI.expand(
      this.uri,
      Object.assign(thisContext, flatten(parameters || {}))
    )
    const invokeUrl = new URL(expandedUri, this.response.url)

    const hash = invokeUrl.hash
    if (hash !== '') {
      // see if the hash is on the current resource
      const invokeUrlWithOutHash = new URL(invokeUrl)
      invokeUrlWithOutHash.hash = ''
      const invokeUrlWithOutHashAsString = invokeUrlWithOutHash.toString()
      if (invokeUrlWithOutHashAsString === this.response.url.toString()) {
        return WayChaserResponse.createFragment(
          this.response,
          this.options,
          hash
        )
      } else {
        console.log({ baseUrl: this.baseUrl, invokeUrlWithOutHashAsString })
        throw new Error('Not Implemented')
        // we need to get the other resource at invokeUrlWithOutHash
        // then load the fragment
      }
    }

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

    if (this.parameters) {
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
    }
    const requestOptions = Object.assign({}, options)
    requestOptions.method = this.method

    if (this.parameters) {
      requestOptions.body = encodedContent
      requestOptions.headers = Object.assign(headers, options?.headers)
    }
    return _waychaser(invokeUrl.toString(), requestOptions, this.options)
  }
}
