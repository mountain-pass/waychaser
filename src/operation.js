import { loadResource } from './util/load-resource'
import { loadResourceFragment } from './util/load-resource-fragment'
import logger from './util/logger'
import { URI } from './util/uri-template-lite'
import qsStringify from 'qs-stringify'
import FormData from 'form-data'
import { preferredContentType } from './util/preferred-content-type'
import flatten from 'flat'
import pointer from 'jsonpointer'

class OperationBuilder {
  constructor (relationship) {
    this.rel = relationship
  }

  uri (uri) {
    this.uri = uri
    return this
  }

  method (method) {
    if (method) {
      this.method = method
    }
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
    logger.waychaser('Operation.invoke')
    const parameters = this.parameters || {}

    const contextUrl = this.baseUrl
    let thisContext
    try {
      const fullBody = await this.response.json()
      const contextBody = this.jsonPointer
        ? pointer.get(fullBody, this.jsonPointer)
        : fullBody
      thisContext = flatten({ this: contextBody })
    } catch {
      // not json
      thisContext = {}
    }
    const expandedUri = URI.expand(
      this.uri,
      Object.assign({}, thisContext, context || {})
    )
    logger.waychaser({ expandedUri })
    const invokeUrl = new URL(expandedUri, contextUrl)
    const invokeUrlWithOutHash = new URL(expandedUri, contextUrl)
    const hash = invokeUrlWithOutHash.hash
    invokeUrlWithOutHash.hash = ''
    const invokeUrlWithOutHashAsString = invokeUrlWithOutHash.toString()
    if (hash !== '' && invokeUrlWithOutHashAsString === contextUrl) {
      return loadResourceFragment(hash, this.response, this.waychaserContext)
    }

    const body = {}
    Object.keys(parameters).forEach(key => {
      body[key] = context?.[key]
    })

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
          'content-type': contentType
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
      this.waychaserContext
    )
  }

  // so you can override the loadResource method
  async loadResource (...arguments_) {
    return loadResource(...arguments_)
  }
}
