import { WaychaserViaWebdriver } from './waychaser-via-webdriver';
import { Builder, Capabilities } from 'selenium-webdriver';
import logging from 'selenium-webdriver/lib/logging';
import chrome from 'selenium-webdriver/chrome';
import logger from '../../util/logger';

class WaychaserViaWebdriverLocal extends WaychaserViaWebdriver {
  async beforeAllTests() {
    this.driver = await this.buildDriver();
    await this.loadWaychaserTestPage();
    await super.beforeAllTests();
  }

  async afterTest(scenario) {
    await super.afterTest(scenario);

    /* istanbul ignore next: only get's executed on test failure */
    if (
      scenario.result.status === 'failed' ||
      scenario.result.status === 'pending'
    ) {
      logger.debug('waiting for browser debugging to complete...');
      await this.driver.allowDebug(600000);
    }
  }

  async afterAllTests() {
    // we should call this.driver.quit() here, but
    // doing so cause the tests to hang on my machine, waiting for
    // firefox to quit.
    // Since webdriver closes the browsers when the process terminates
    // we rely on that instead.
    /* istanbul ignore else: only happens on test setup failure */
    if (this.driver) {
      if (this.browser != 'firefox') {
        await this.driver.quit();
      }
    }
    await super.afterAllTests();
  }

  async buildDriver() {
    try {
      const prefs = new logging.Preferences();
      prefs.setLevel(logging.Type.BROWSER, logging.Level.DEBUG);

      const caps = Capabilities[this.browser]();
      caps.setLoggingPrefs(prefs);

      const builder = new Builder()
        .withCapabilities(caps)
        .forBrowser(this.browser);

      /* istanbul ignore next: only get's executed on CI server */
      if (process.env.CI) {
        builder.setChromeOptions(new chrome.Options().headless());
      }
      this.driver = builder.build();

      return this.driver;
    } catch (error) {
      /* istanbul ignore next: only get's executed when there are web driver issues */
      {
        logger.error('error getting browser', error);
        throw error;
      }
    }
  }
}

const instance = new WaychaserViaWebdriverLocal();

export { instance as waychaserViaWebdriverLocal };
