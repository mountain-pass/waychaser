import humanizeDuration from 'humanize-duration';
import core from 'istanbul-middleware/lib/core';
import logger from '../../util/logger';
import logging from 'selenium-webdriver/lib/logging';

class WaychaserViaWebdriver {
  async load(url, options) {
    const result = await this.driver.executeAsyncScript(
      /* istanbul ignore next: won't work in browser otherwise */
      function () {
        /* global window */
        var callback = arguments[arguments.length - 1];
        return window.waychaser
          .load(arguments[0], arguments[1])
          .then((success) => {
            console.log({ success });
            callback({ success, result: 'success' });
            return;
          })
          .catch((error) => {
            console.log({ error });
            callback({ error, result: 'error' });
            return;
          });
      },
      url,
      options
    );

    await this.getBrowserLogs();

    logger.debug(`result:`, result);
    if (result.error) {
      logger.debug(result.error);
      throw new Error(result.error);
    }
    return result.success;
  }

  async getBrowserLogs() {
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

  /* istanbul ignore next: only get's executed on test failure */
  async allowDebug(timeout) {
    if (this.driver) {
      this.driver.executeScript(
        `
        alert('Window will remain for ${humanizeDuration(
          timeout
        )} for debugging purposes');
      `
      );
      await this.driver.wait(
        () =>
          this.driver.getAllWindowHandles().then((handles) => {
            // logger.debug(`${handles.length} handles still open`);
            return handles.length === 0;
          }),
        timeout
      );
    }
  }

  async quit() {
    /* istanbul ignore else: only get's executed when there are fatal web driver issues */
    if (this.driver) {
      await this.driver.quit();
    }
  }

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
