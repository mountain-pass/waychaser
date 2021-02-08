import { PendingError } from '@windyroad/cucumber-js-throwables'
class WaychaserProxy {
  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async load (url) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.load.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async getOperationsCounts (result) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.getOperationsCounts.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async find (result, relationship) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.find.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async invokeAll (result, relationship, context) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.invokeAll.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async invokeWithObjectQuery (result, query, context) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.invokeWithObjectQuery.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async getUrls (result, context) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.getUrls.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async getBodies (results) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.getBodies.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async getStatusCodes (result) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.getStatusCodes.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async use (handler) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.use.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async reset () {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.reset.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async useDefaultHandlers () {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.useDefaultHandlers.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async parseAccept (accept) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.parseAccept.name}`
    )
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async executeCode (code) {
    throw new PendingError(
      `TODO: implement ${this.constructor.name}.${this.executeCode.name}`
    )
  }
}

export { WaychaserProxy }
