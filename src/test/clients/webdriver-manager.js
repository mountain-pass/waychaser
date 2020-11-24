import logger from "../../util/logger";
import logging from "selenium-webdriver/lib/logging";
import { BROWSER_PORT, BROWSER_HOST } from "../config";
import { utils } from "istanbul";
import * as babel from "@babel/core";
import babelConfig from "../../../babel.config";
import { abstract } from "../../util/abstract";

delete babelConfig.env.test;

/* global __coverage__ */
// based on https://github.com/gotwarlost/istanbul-middleware/blob/dfbca20f361b9c2b79934e395fd266d95d9c5af5/lib/core.js#L217
function mergeClientCoverage(object) {
  if (process.env.COVERAGE) {
    for (const [filePath, added] of Object.entries(object)) {
      const original = __coverage__[filePath.toString()];
      if (added.s === null) {
        added.s = {};
      }
      if (added.f === null) {
        added.f = {};
      }
      if (added.b === null) {
        added.b = {};
      }
      __coverage__[filePath.toString()] = utils.mergeFileCoverage(
        original,
        added
      );
    }
  }
}

class WebdriverManager {
  async loadWaychaserTestPage() {
    logger.debug("loading page...");
    await this.driver.get(`http://${BROWSER_HOST}:${BROWSER_PORT}`);
    logger.debug("...page loaded");

    logger.debug("waiting for waychaser...");
    await this.driver.wait(() => {
      return this.executeScript(
        /* istanbul ignore next: won't work in browser otherwise */
        function () {
          return window.waychaser !== undefined;
        }
      );
    }, 40000);

    logger.debug("setting up logger function...");
    await this.executeScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        window.testResults = [];
        window.testLogs = [];
        window.testLogger = function (arguments_) {
          console.log(arguments_);
          window.testLogs.push(arguments_);
          // eslint-disable-next-line unicorn/prefer-query-selector
          var logsElement = document.getElementById("logs"); // eslint-disable-line no-var
          logsElement.textContent += arguments_;
          logsElement.textContent += "\n";
        };

        window.callbackWithError = (done, error) => {
          window.testLogger("error: " + error.toString());
          window.testResults.push(error);
          done({
            success: false,
            id: window.testResults.length - 1,
            error: error.toString(),
            stackTrace: error.stack,
          });
        };

        window.handleResponse = function (promise, done) {
          return promise
            .then(function (resource) {
              window.testLogger("huzzah!");
              window.testResults.push(resource);
              done({ success: true, id: window.testResults.length - 1 });
            })
            .catch(function (error) {
              window.callbackWithError(done, error);
            });
        };
      }
    );
  }

  async beforeAllTests() {}

  async executeScript(script, ...arguments_) {
    const code = `(${script}).apply(window, arguments)`;
    const transformed = await (
      await babel.transformAsync(code, babelConfig)
    ).code.replace('"use strict";\n\n', "return ");
    return this.driver.executeScript(transformed, ...arguments_);
  }

  async executeAsyncScript(script, ...arguments_) {
    const code = `(${script}).apply(window, arguments)`;
    // logger.debug({ code });
    const transformed = await (
      await babel.transformAsync(code, babelConfig)
    ).code.replace('"use strict";\n\n', "return ");
    logger.debug({ transformed });
    const returnedFromBrowser = await this.driver.executeAsyncScript(
      transformed,
      ...arguments_
    );
    logger.debug({ returnedFromBrowser });
    return returnedFromBrowser;
  }

  async beforeTest(scenario) {
    await this.executeScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        window.testResults = [];
        const element = document.querySelector("#test-name");
        element.textContent = arguments[0].pickle.name;
      },
      scenario
    );

    logger.debug("set test name to '%s'", scenario.pickle.name);
  }

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
    if (process.env.COVERAGE) {
      await this.executeScript(
        /* istanbul ignore next: won't work in browser otherwise */
        function () {
          if (
            typeof window.__coverage__ !== "undefined" &&
            window.__coverage__ !== null
          ) {
            for (const f in window.__coverage__) {
              const coverage = window.__coverage__[f];
              for (const index in coverage.b) {
                coverage.b[index] = [0, 0];
              }
              for (const index in coverage.f) {
                coverage.f[index] = 0;
              }
              for (const index in coverage.s) {
                coverage.s[index] = 0;
              }
            }
          }
        }
      );
    }
  }

  async loadCoverage() {
    /* istanbul ignore else: only get's executed when there are fatal web driver issues  */
    if (this.driver && process.env.COVERAGE) {
      try {
        const remoteCoverage = await this.executeScript(
          /* istanbul ignore next: won't work in browser otherwise */
          function () {
            return window.__coverage__;
          }
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

  async doBuildDriver() {
    abstract();
  }

  async buildDriver() {
    try {
      return this.doBuildDriver();
    } catch (error) {
      /* istanbul ignore next: only get's executed when there are web driver issues */
      logger.error("error getting browser", error);
      /* istanbul ignore next: only get's executed when there are web driver issues */
      throw error;
    }
  }
}

export { WebdriverManager };