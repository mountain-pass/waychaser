import logger from "../../util/logger";
import logging from "selenium-webdriver/lib/logging";
import { BROWSER_PORT, BROWSER_HOST } from "../config";
import { utils } from "istanbul";

/* global __coverage__ */
// based on https://github.com/gotwarlost/istanbul-middleware/blob/master/lib/core.js#L217
function mergeClientCoverage(object) {
  Object.keys(object).forEach((filePath) => {
    const original = __coverage__[filePath.toString()];
    const added = object[filePath.toString()];
    __coverage__[filePath.toString()] = utils.mergeFileCoverage(
      original,
      added
    );
  });
}
class WaychaserViaWebdriver {
  async load(url, options) {
    logger.debug("loading url...: %s", url);
    try {
      const result = await this.driver.executeAsyncScript(
        /* istanbul ignore next: won't work in browser otherwise */
        function () {
          /* global window */
          console.log("starting load");
          const callback = arguments[arguments.length - 1];
          try {
            window.waychaser
              .load(arguments[0])
              .then(function (success) {
                console.log("finished load", success);
                const rval = { success, result: "success" };
                callback(rval);
              })
              .catch(function (error) {
                console.log("finished load", error);
                const rval = {
                  error,
                  errorJson: JSON.stringify(error, undefined, 2),
                  errorString: error.toString(),
                  result: "error",
                  position: "inner",
                };
                callback(rval);
              });
          } catch (error) {
            console.log("finished load", error);
            const rval = {
              error,
              errorJson: JSON.stringify(error, undefined, 2),
              errorString: error.toString(),
              result: "error",
              position: "outer",
            };
            callback(rval);
          }
        },
        url,
        options
      );
      logger.debug("after load");

      await this.getBrowserLogs();

      logger.debug("result:", result);
      if (result.success) {
        return result.success;
      }
      throw new Error(result.error);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async loadWaychaserTestPage() {
    logger.debug("...loading page");
    await this.driver.get(`http://${BROWSER_HOST}:${BROWSER_PORT}`);
    logger.debug("...page loaded");
    await this.driver.wait(() => {
      return this.driver.executeScript(
        /* istanbul ignore next: won't work in browser otherwise */
        function () {
          return window.waychaser !== undefined;
        }
      );
    }, 40000);
  }

  async beforeAllTests() {}

  async beforeTest() {}

  async afterTest() {
    await this.getBrowserLogs();

    logger.debug("downloading coverage from browser...");
    try {
      await this.loadCoverage();
    } catch (error) {
      /* istanbul ignore next: only get's executed on test framework failure */
      logger.error("coverage", error);
    }
    logger.debug("...coverage downloaded");
  }

  async getBrowserLogs() {
    // getting logs appears to be only possible wtih chrome
    /* istanbul ignore else: doesn't get executed on CI */
    if (this.browser === "chrome") {
      await this.driver
        .manage()
        .logs()
        .get(logging.Type.BROWSER)
        .then((entries) => {
          entries.forEach((entry) => {
            logger.browser("[%s] %s", entry.level.name, entry.message);
          });
        });
    }
  }

  async afterAllTests() {}

  async clearRemoteCoverage() {
    await this.driver.executeScript(`var i = null;
      var coverage = null;
      var f = null;
      if (typeof(window.__coverage__) !== "undefined" && window.__coverage__ !== null) {
          for (f in window.__coverage__) {
              coverage = window.__coverage__[f];
              for (i in coverage.b) {
                  coverage.b[i] = [0, 0];
              }
              for (i in coverage.f) {
                  coverage.f[i] = 0;
              }
              for (i in coverage.s) {
                  coverage.s[i] = 0;
              }
          }
      }`);
  }

  async loadCoverage() {
    /* istanbul ignore else: only get's executed when there are fatal web driver issues  */
    if (this.driver) {
      try {
        const remoteCoverage = await this.driver.executeScript(
          "return window.__coverage__;"
        );
        mergeClientCoverage(remoteCoverage);

        // clear coverage
        await this.clearRemoteCoverage();
      } catch (error) {
        /* istanbul ignore next: only get's executed when there are instanbul issues */
        logger.error(error);
        /* istanbul ignore next: only get's executed when there are instanbul issues */
        throw error;
      }
    }
  }
}

export { WaychaserViaWebdriver };
