import { loadResource } from './util/load-resource'
import logger from './util/logger'
import { URI } from 'uri-template-lite'
import qsStringify from 'qs-stringify'
import FormData from 'form-data'
import { preferredContentType } from './util/preferred-content-type'

class OperationBuilder {
  constructor (relationship) {
    this.rel = relationship
  }

  uri (uri) {
    this.uri = uri
    return this
  }

  method (method) {
    this.method = method
    return this
  }

  parameters (parameters) {
    this.parameters = parameters
    return this
  }

  accept (accept) {
    this.accept = accept
    return this
  }

  other (otherProperties) {
    Object.assign(this, otherProperties)
    return this
  }

  build () {
    return new Operation(this)
  }
}
export class Operation {
  constructor (builder) {
    Object.assign(this, builder)
  }

  static builder (relationship) {
    return new OperationBuilder(relationship)
  }

  async invoke (context, options) {
    const parameters = this.parameters || {}

    logger.waychaser(parameters)
    const contextUrl = this.baseUrl
    const expandedUri = URI.expand(this.uri, context || {})
    logger.waychaser(`loading ${expandedUri}`)

    const invokeUrl = new URL(expandedUri, contextUrl)
    const body = {}
    Object.keys(parameters).forEach(key => {
      body[key] = context[key]
    })
    logger.waychaser(
      `invoking ${invokeUrl} with body ${
        this.parameters ? JSON.stringify(body) : undefined
      }`
    )

    let encodedContent
    let headers

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
          'Content-Type': contentType
        }
      }
    }

    const baseOptions = {
      method: this.method
    }
    if (this.parameters) {
      baseOptions.body = encodedContent
      baseOptions.headers = headers
    }

    return this.loadResource(
      invokeUrl,
      Object.assign(baseOptions, options),
      this.handlers
    )
  }

  // so you can override the loadResource method
  async loadResource (...arguments_) {
    return loadResource(...arguments_)
  }
}
