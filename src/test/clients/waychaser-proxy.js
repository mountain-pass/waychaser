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
  async findOneOByRel(property, result, relationship) {
    abstract();
  }

  async findOneOperationByRel(result, relationship) {
    return this.findOneOByRel("operations", result, relationship);
  }

  async findOneOpByRel(result, relationship) {
    return this.findOneOByRel("ops", result, relationship);
  }

  /* istanbul ignore next: only get's executed if we didn't overload this method */
  async invokeOByRel(property, result, relationship) {
    abstract();
  }

  async invokeOperationByRel(result, relationship) {
    return this.invokeOByRel("operations", result, relationship);
  }

  async invokeOpByRel(result, relationship) {
    return this.invokeOByRel("ops", result, relationship);
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
