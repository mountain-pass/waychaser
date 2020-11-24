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

  async getOperationsCount(result) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, done) {
        done(window.testResults[id.toString()].operations.count());
      },
      result.id
    );
  }

  async getOpsCount(result) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, done) {
        done(window.testResults[id.toString()].ops.count());
      },
      result.id
    );
  }

  async findOneByRel(property, result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (property, id, relationship, done) {
        window.testLogger(relationship);
        window.testLogger(relationship === "self");
        window.testLogger(
          window.testResults[id.toString()][property.toString()].count()
        );
        window.testLogger(
          "collection",
          JSON.stringify(window.testResults[id.toString()][property.toString()])
        );
        window.testLogger(
          "findOne",
          JSON.stringify(
            window.testResults[id.toString()][property.toString()].findOne()
          )
        );
        window.testLogger(
          "findOneByRel",
          JSON.stringify(
            window.testResults[id.toString()][property.toString()].findOneByRel(
              relationship
            )
          )
        );
        done(
          window.testResults[id.toString()][property.toString()].findOneByRel(
            relationship
          )
        );
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

  async invokeOperationByRel(result, relationship) {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, relationship, done) {
        window.testLogger("invokeOperationByRel");
        window.testLogger(JSON.stringify(arguments, undefined, 2));
        const ops = window.testResults[id.toString()].operations;
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
      relationship
    );
  }

  async invokeOpByRel(result, relationship) {
    return this.manager.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, relationship, done) {
        window.testLogger({ arguments });
        window.testResults[id.toString()].ops
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

  async invokeByRel(result, relationship) {
    return this.manager.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function (id, relationship, done) {
        window.testResults[id.toString()]
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
        done(window.testResults[id.toString()].url);
      },
      result.id
    );
  }
}

export { WaychaserViaWebdriver };
