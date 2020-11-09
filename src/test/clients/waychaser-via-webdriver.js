import core from 'istanbul-middleware/lib/core';
import logger from '../../util/logger';
import logging from 'selenium-webdriver/lib/logging';

class WaychaserViaWebdriver {
  async load(url, options) {
    logger.debug('loading url...: %s', url);
    try {
      const result = await this.driver.executeAsyncScript(
        /* istanbul ignore next: won't work in browser otherwise */
        function () {
          /* global window */
          console.log('starting load');
          var callback = arguments[arguments.length - 1];
          try {
            window.waychaser
              .load(arguments[0])
              .then(function (success) {
                console.log('finished load', success);
                callback({ success, result: 'success' });
                return;
              })
              .catch(function (error) {
                console.log('finished load', error);
                callback({
                  error,
                  errorJson: JSON.stringify(error, undefined, 2),
                  errorString: error.toString(),
                  result: 'error',
                  position: 'inner',
                });
                return;
              });
          } catch (error) {
            console.log('finished load', error);
            callback({
              error,
              errorJson: JSON.stringify(error, undefined, 2),
              errorString: error.toString(),
              result: 'error',
              position: 'outer',
            });
          }
        },
        url,
        options
      );
      logger.debug('after load');

      await this.getBrowserLogs();

      logger.debug(`result:`, result);
      if (result.success) {
        return result.success;
      }
      throw new Error(result.error);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async loadWaychaserTestPage() {
    logger.debug('...loading page');
    await this.driver.get(`http://localhost:${process.env.BROWSER_PORT}`);
    logger.debug('...page loaded');
    await this.driver.wait(() => {
      return this.driver.executeScript(
        /* istanbul ignore next: won't work in browser otherwise */
        function () {
          return window.waychaser != undefined;
        }
      );
    }, 40000);
  }

  async beforeAllTests() {}

  async beforeTest() {}

  async afterTest() {
    await this.getBrowserLogs();

    logger.debug('downloading coverage from browser...');
    try {
      await this.loadCoverage();
    } catch (error) {
      /* istanbul ignore next: only get's executed on test framework failure */
      logger.error('coverage', error);
    }
    logger.debug('...coverage downloaded');
  }

  async getBrowserLogs() {
    // getting logs appears to be only possible wtih chrome
    if (this.browser == 'chrome') {
      await this.driver
        .manage()
        .logs()
        .get(logging.Type.BROWSER)
        .then((entries) => {
          entries.forEach((entry) => {
            logger.browser('[%s] %s', entry.level.name, entry.message);
          });
          return;
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
          'return window.__coverage__;'
        );
        core.mergeClientCoverage(remoteCoverage);

        // clear coverage
        await this.clearRemoteCoverage();
      } catch (error) {
        /* istanbul ignore next: only get's executed when there are instanbul issues */
        {
          logger.error(error);
          throw error;
        }
      }
    }
  }
}

export { WaychaserViaWebdriver };
