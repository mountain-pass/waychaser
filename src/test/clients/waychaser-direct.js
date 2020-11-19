import logger from "../../util/logger";
import logging from "selenium-webdriver/lib/logging";
import { BROWSER_PORT, BROWSER_HOST } from "../config";
import { utils } from "istanbul";
import { waychaser } from "../../waychaser";

class WaychaserDirect {
  async load(url) {
    try {
      const resource = await waychaser.load(url);
      return { success: true, resource };
    } catch (error) {
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

  async invokeOperationByRel(result, relationship) {
    try {
      const resource = await result.resource.operations.invokeByRel(
        relationship
      );
      logger.debug({ resource });
      return { success: true, resource };
    } catch (error) {
      return { success: false, error };
    }
  }

  async invokeOpByRel(result, relationship) {
    try {
      logger.debug("invokeOpByRel", result.resource, relationship);
      const resource = await result.resource.ops.invokeByRel(relationship);
      logger.debug({ resource });
      return { success: true, resource };
    } catch (error) {
      return { success: false, error };
    }
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
