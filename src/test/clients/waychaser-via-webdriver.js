import { Builder, Capabilities } from 'selenium-webdriver';
import logging from 'selenium-webdriver/lib/logging';
import humanizeDuration from 'humanize-duration';
import core from 'istanbul-middleware/lib/core';
import logger from '../../util/logger';

const screen = {
  width: 1024,
  height: 800,
};

class WaychaserViaWebdriver {
  async load(url, options) {
    const driver = this.driver ? this.driver : await this.getBrowser();
    const result = await driver.executeScript(
      /* istanbul ignore next */
      function () {
        /* global window */
        return window.waychaser
          .load(arguments[0], arguments[1])
          .then((success) => {
            console.log({ success });
            return { success };
          })
          .catch((error) => {
            console.log({ error });
            return { error };
          });
      },
      url,
      options
    );
    if (result.error) {
      logger.debug(result.error);
      throw new Error(result.error);
    }
    return result.success;
  }

  async getBrowser() {
    try {
      const options = this.getBrowserOptions();
      options.windowSize(screen);
      // ignore, because it only get's executed on CI server
      /* istanbul ignore next */
      if (process.env.CI) {
        options.headless();
      }

      const prefs = new logging.Preferences();
      prefs.setLevel(logging.Type.BROWSER, logging.Level.DEBUG);

      const caps = Capabilities[process.env.BROWSER || 'chrome']();
      caps.setLoggingPrefs(prefs);

      let builder = new Builder().withCapabilities(caps);
      builder = this.setBrowserOptions(builder, options);
      this.driver = await builder.build();
      await this.driver.get(`http://localhost:${process.env.UI_PORT}`);
      await this.loadCoverage();

      return this.driver;
    } catch (error) {
      // ignore, because it only get's executed when there are web driver issues
      /* istanbul ignore next */
      {
        logger.error('error getting broswer', error);
        throw error;
      }
    }
  }

  // ignore, because it only get's executed on test failure
  /* istanbul ignore next */
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
    // ignore, because it only get's executed when there are fatal web driver issues
    /* istanbul ignore else */
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
    // ignore, because it only get's executed when there are fatal web driver issues
    /* istanbul ignore else */
    if (this.driver) {
      try {
        const remoteCoverage = await this.driver.executeScript(
          'return window.__coverage__;'
        );
        core.mergeClientCoverage(remoteCoverage);

        // clear coverage
        await this.clearRemoteCoverage();
      } catch (error) {
        // ignore, because it only get's executed when there are instanbul issues
        /* istanbul ignore next */
        {
          logger.error(error);
          throw error;
        }
      }
    }
  }
}

export { WaychaserViaWebdriver };
