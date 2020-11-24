import logger from "../../util/logger";
import { waychaser } from "../../waychaser";

function abstract() {
  throw new Error("You have to implement the method!");
}

class WaychaserProxy {
  async load(url) {
    abstract();
  }

  async getOCount(property, result) {
    abstract();
  }

  async getOperationsCount(result) {
    return this.getOCount("operations", result);
  }

  async getOpsCount(result) {
    return this.getOCount("ops", result);
  }

  async findOneOByRel(property, result, relationship) {
    abstract();
  }

  async findOneOperationByRel(result, relationship) {
    return this.findOneOByRel("operations", result, relationship);
  }

  async findOneOpByRel(result, relationship) {
    return this.findOneOByRel("ops", result, relationship);
  }

  async invokeOByRel(property, result, relationship) {
    abstract();
  }

  async invokeOperationByRel(result, relationship) {
    return this.invokeOByRel("operations", result, relationship);
  }

  async invokeOpByRel(result, relationship) {
    return this.invokeOByRel("ops", result, relationship);
  }

  async invokeByRel(result, relationship) {
    abstract();
  }

  async getUrl(result) {
    abstract();
  }
}

export { WaychaserProxy };
