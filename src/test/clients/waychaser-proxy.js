import { abstract } from "../../util/abstract";

class WaychaserProxy {
  /* istanbul ignore next: only get's executed if we didn't overload this method */
  async load(url) {
    abstract();
  }

  /* istanbul ignore next: only get's executed if we didn't overload this method */
  async getOCount(property, result) {
    abstract();
  }

  async getOperationsCount(result) {
    return this.getOCount("operations", result);
  }

  async getOpsCount(result) {
    return this.getOCount("ops", result);
  }

  /* istanbul ignore next: only get's executed if we didn't overload this method */
  async findOneO(property, result, relationship) {
    abstract();
  }

  async findOneOperation(result, relationship) {
    return this.findOneO("operations", result, relationship);
  }

  async findOneOp(result, relationship) {
    return this.findOneO("ops", result, relationship);
  }

  /* istanbul ignore next: only get's executed if we didn't overload this method */
  async invokeO(property, result, relationship) {
    abstract();
  }

  async invokeOperation(result, relationship) {
    return this.invokeO("operations", result, relationship);
  }

  async invokeOp(result, relationship) {
    return this.invokeO("ops", result, relationship);
  }

  /* istanbul ignore next: only get's executed if we didn't overload this method */
  async invoke(result, relationship) {
    abstract();
  }

  /* istanbul ignore next: only get's executed if we didn't overload this method */
  async getUrl(result) {
    abstract();
  }
}

export { WaychaserProxy };
