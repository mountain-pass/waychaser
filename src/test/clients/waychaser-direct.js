import logger from "../../util/logger";
import { waychaser } from "../../waychaser";

class WaychaserDirect {
  async load(url) {
    try {
      logger.test("loading %s", url);
      const resource = await waychaser.load(url);
      logger.test("loaded %s: $s", url, resource);
      return { success: true, resource };
    } catch (error) {
      logger.error("error loading %s", error);
      return { success: false, error };
    }
  }

  async getOperationsCount(result) {
    return result.resource.operations.count();
  }

  async getOpsCount(result) {
    return result.resource.ops.count();
  }

  async findOneOperationByRel(result, relationship) {
    return result.resource.operations.findOneByRel(relationship);
  }

  async findOneOpByRel(result, relationship) {
    return result.resource.ops.findOneByRel(relationship);
  }

  async invokeOByRel(property, result, relationship) {
    try {
      const resource = await result.resource[property].invokeByRel(
        relationship
      );
      logger.debug({ resource });
      return { success: true, resource };
    } catch (error) {
      return { success: false, error };
    }
  }

  async invokeOperationByRel(result, relationship) {
    return this.invokeOByRel("operations", result, relationship);
  }

  async invokeOpByRel(result, relationship) {
    return this.invokeOByRel("ops", result, relationship);
  }

  async invokeByRel(result, relationship) {
    try {
      const resource = await result.resource.invokeByRel(relationship);
      return { success: true, resource };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getUrl(result) {
    return result.resource.url;
  }
}

export { WaychaserDirect };
