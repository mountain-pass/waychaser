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

class WebdriverManager {
  async loadWaychaserTestPage() {
    logger.debug("loading page...");
    await this.driver.get(`http://${BROWSER_HOST}:${BROWSER_PORT}`);
    logger.debug("...page loaded");

    logger.debug("setting uo uuid function...");
    await this.driver.executeScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        window.uuidv4 = function () {
          /* global crypto */
          return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
            /[018]/g,
            function (c) {
              return (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
              ).toString(16);
            }
          );
        };
      }
    );

    logger.debug("waiting for waychaser...");
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

export { WebdriverManager };
