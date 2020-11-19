import fetch from "isomorphic-fetch";
import { polyfill } from "es6-promise";
import LinkHeader from "http-link-header";
import Loki from "lokijs";
import logger from "./util/logger";
polyfill();

/**
 * @param url
 * @param options
 */
function loadResource(url, options) {
  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error("Bad response from server", response);
    }
    return new waychaser.ApiResourceObject(response);
  });
}

class Operation {
  constructor(callingContext) {
    this.callingContext = callingContext;
  }

  async invoke(context, options) {
    logger.waychaser(this, context, options);
    const contextUrl = this.callingContext.url;
    const invokeUrl = new URL(this.uri, contextUrl);
    logger.waychaser({ invokeUrl });
    return loadResource(invokeUrl, options);
  }
}
Loki.Collection.prototype.findOneByRel = function (relationship) {
  return this.findOne({ rel: relationship });
};

Loki.Collection.prototype.invokeByRel = async function (
  relationship,
  context,
  options
) {
  return this.findOneByRel(relationship).invoke(context, options);
};

/** @namespace */
const waychaser = {
  /**
   * Loads an API
   *
   * @param {string} url - the URL of the API to load
   * @param {object} options - options to pass to fetch
   *
   * @returns {ApiResourceObject} a ApiResourceObject representing the loaded resource
   *
   * @throws {Error} If the server returns with a status >= 400
   */
  load: async function (url, options) {
    return loadResource(url, options);
  },

  ApiResourceObject: class {
    constructor(response) {
      logger.waychaser("creating ARO", response);
      this.response = response;
      const linkHeader = this.response.headers.get("link");
      const linkDatabase = new Loki();
      this.operations = linkDatabase.addCollection();
      if (linkHeader) {
        const links = LinkHeader.parse(linkHeader);

        this.operations.insert(
          links.refs.map((reference) => {
            logger.waychaser({ reference });
            logger.waychaser("creating operation", this.response, reference);
            const operation = Object.assign(
              new Operation(this.response),
              reference
            );
            logger.waychaser(JSON.stringify({ operation }));
            return operation;
          })
        );
      }
    }

    get ops() {
      return this.operations;
    }

    async invokeByRel(relationship) {
      return this.operations.invokeByRel(relationship);
    }
  },
};

export { waychaser };
