import logger from "../../util/logger";
import { waychaser } from "../../waychaser";
import { WaychaserProxy } from "./waychaser-proxy";

class WaychaserDirect extends WaychaserProxy {
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

  async getOCount(property, result) {
    return result.resource[property].count();
  }

  async findOneOByRel(property, result, relationship) {
    return result.resource[property].findOneByRel(relationship);
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
