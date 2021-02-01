import { abstract } from '../../util/abstract'

class WaychaserProxy {
  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async load (url) {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async getOperationsCounts (result) {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async find (result, relationship) {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async invokeAll (result, relationship, context) {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async invokeWithObjectQuery (result, query, context) {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async getUrls (result, context) {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async getBodies (results) {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async getStatusCodes (result) {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async use (handler) {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async reset () {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async useDefaultHandlers () {
    abstract()
  }

  /* istanbul ignore next: only gets executed if we didn't overload this method */
  async parseAccept (accept) {
    abstract()
  }
}

export { WaychaserProxy }
