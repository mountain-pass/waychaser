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

  async findOneO(property, result, relationship) {
    return result.resource[property].findOne(relationship);
  }

  async invokeO(property, result, relationship) {
    return handleResponse(result.resource[property].invoke(relationship));
  }

  async invoke(result, relationship) {
    return handleResponse(result.resource.invoke(relationship));
  }

  async getUrl(result) {
    return result.resource.url;
  }
}

export { WaychaserDirect };
