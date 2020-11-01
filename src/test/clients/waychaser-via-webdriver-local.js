import { WaychaserViaWebdriver } from './waychaser-via-webdriver';
import { Builder, Capabilities } from 'selenium-webdriver';
import logging from 'selenium-webdriver/lib/logging';

import logger from '../../util/logger';

// const screen = {
//   width: 1024,
//   height: 800,
// };

class WaychaserViaWebdriverLocal extends WaychaserViaWebdriver {
  async load(url, options) {
    if (this.driver == undefined) {
      await this.getBrowser();
    }
    return super.load(url, options);
  }

  async getBrowser() {
    try {
      const options = this.getBrowserOptions();
      //options.windowSize(screen);
      /* istanbul ignore next: only get's executed on CI server*/
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
      {
        /* istanbul ignore next: only get's executed when there are web driver issues*/
        {
          logger.error('error getting browser', error);
          throw error;
        }
      }
    }
  }

  async sendTestResult() {}

  async setJobName() {}
}

export { WaychaserViaWebdriverLocal };
