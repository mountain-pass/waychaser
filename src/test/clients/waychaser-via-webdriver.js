import logger from "../../util/logger";
import { WaychaserProxy } from "./waychaser-proxy";

class WaychaserViaWebdriver extends WaychaserProxy {
  constructor(manager) {
    super();
    this.manager = manager;
  }

  async load(url) {
    const rval = await this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (url, done) {
        window.testLogger(`loading ${url}`);
        window.waychaser
          .load(url)
          .then(function (resource) {
            window.testLogger("success");
            window.testResults.push(resource);
            window.testLogger("calling back");
            done({ success: true, id: window.testResults.length - 1 });
          })
          .catch((error) => {
            window.callbackWithError(done, error);
          });
      },
      url
    );
    logger.debug({ rval });
    await this.manager.driver.executeScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        window.testLogger("after");
      }
    );
    return rval;
  }

  async getOCount(property, result) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, property, done) {
        done(window.testResults[id][property].count());
      },
      result.id,
      property
    );
  }

  async findOneO(property, result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (property, id, relationship, done) {
        done(window.testResults[id][property].findOne(relationship));
      },
      property,
      result.id,
      relationship
    );
  }

  async invokeO(property, result, relationship) {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, relationship, property, done) {
        window.testLogger("invokeOperation");
        window.testLogger(JSON.stringify(arguments, undefined, 2));
        const ops = window.testResults[id][property];
        window.testLogger(JSON.stringify(ops, undefined, 2));
        window.handleResponse(ops.invoke(relationship), done);
      },
      result.id,
      relationship,
      property
    );
  }

  async invoke(result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, relationship, done) {
        window.testResults[id]
          .invoke(relationship)
          .then(function (resource) {
            window.testResults.push(resource);
            done({ success: true, id: window.testResults.length - 1 });
          })
          .catch(function (error) {
            window.callbackWithError(done, error);
          });
      },
      result.id,
      relationship
    );
  }

  async getUrl(result) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, done) {
        done(window.testResults[id].url);
      },
      result.id
    );
  }
}

export { WaychaserViaWebdriver };
