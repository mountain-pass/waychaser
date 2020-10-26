// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable security/detect-non-literal-fs-filename */
import { Builder, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import logging from 'selenium-webdriver/lib/logging';
import humanizeDuration from 'humanize-duration';
import core from '../../../node_modules/istanbul-middleware/lib/core';
import { promises as fsp } from 'fs';
// eslint-disable-next-line no-unused-vars
import logger from '../../util/logger';

const screen = {
  width: 1024,
  height: 800,
};

const waychaserViaWebdriver = {
  async load(url, options) {
    const driver = this.driver ? this.driver : await this.getBrowser();
    return driver.executeScript(`await waychaser.load('${url}', ${options})`);
  },

  async getBrowser() {
    try {
      const options = new chrome.Options();
      options.windowSize(screen);
      // ignore, because it only get's executed on CI server
      /* istanbul ignore next */
      if (process.env.CI) {
        options.headless();
      }

      const prefs = new logging.Preferences();
      prefs.setLevel(logging.Type.BROWSER, logging.Level.DEBUG);

      const caps = Capabilities.chrome();
      caps.setLoggingPrefs(prefs);

      this.driver = await new Builder()
        .withCapabilities(caps)
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
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
  },

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
  },

  async takeScreenshot(filename = 'test-results/last.png') {
    // ignore, because it only get's executed when there are fatal web driver issues
    /* istanbul ignore else */
    if (this.driver) {
      const screenShot = await this.driver.takeScreenshot();
      await fsp.writeFile(filename, screenShot, 'base64');
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
  },

  async quit() {
    // ignore, because it only get's executed when there are fatal web driver issues
    /* istanbul ignore else */
    if (this.driver) {
      await this.takeScreenshot();
      await this.driver.quit();
    }
  },

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
  },

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
  },
};

export { waychaserViaWebdriver };
