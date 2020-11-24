import logger from "../../util/logger";

class WaychaserViaWebdriver {
  constructor(manager) {
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

  async getOperationsCount(result) {
    return this.getOCount("operations", result);
  }

  async getOpsCount(result) {
    return this.getOCount("ops", result);
  }

  async findOneByRel(property, result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (property, id, relationship, done) {
        done(window.testResults[id][property].findOneByRel(relationship));
      },
      property,
      result.id,
      relationship
    );
  }

  async findOneOperationByRel(result, relationship) {
    return this.findOneByRel("operations", result, relationship);
  }

  async findOneOpByRel(result, relationship) {
    return this.findOneByRel("ops", result, relationship);
  }

  async invokeOByRel(property, result, relationship) {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, relationship, property, done) {
        window.testLogger("invokeOperationByRel");
        window.testLogger(JSON.stringify(arguments, undefined, 2));
        const ops = window.testResults[id][property];
        window.testLogger(JSON.stringify(ops, undefined, 2));
        ops
          .invokeByRel(relationship)
          .then(function (resource) {
            window.testLogger("huzzah!");
            window.testResults.push(resource);
            done({ success: true, id: window.testResults.length - 1 });
          })
          .catch(function (error) {
            window.callbackWithError(done, error);
          });
      },
      result.id,
      relationship,
      property
    );
  }

  async invokeOperationByRel(result, relationship) {
    return this.invokeOByRel("operations", result, relationship);
  }

  async invokeOpByRel(result, relationship) {
    return this.invokeOByRel("ops", result, relationship);
  }

  async invokeByRel(result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, relationship, done) {
        window.testResults[id]
          .invokeByRel(relationship)
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
