import logger from "../../util/logger";
import { waychaser } from "../../waychaser";
import { WaychaserProxy } from "./waychaser-proxy";

async function handleResponse(promise) {
  try {
    const resource = await promise;
    return { success: true, resource };
  } catch (error) {
    logger.error("error loading %s", error);
    return { success: false, error };
  }
}
class WaychaserDirect extends WaychaserProxy {
  async load(url) {
    return handleResponse(waychaser.load(url));
  }

  async getOCount(property, result) {
    return result.resource[property].count();
  }

  async findOneOByRel(property, result, relationship) {
    return result.resource[property].findOneByRel(relationship);
  }

  async invokeOByRel(property, result, relationship) {
    return handleResponse(result.resource[property].invokeByRel(relationship));
  }

  async invokeByRel(result, relationship) {
    return handleResponse(result.resource.invokeByRel(relationship));
  }

  async getUrl(result) {
    return result.resource.url;
  }
}

export { WaychaserDirect };
