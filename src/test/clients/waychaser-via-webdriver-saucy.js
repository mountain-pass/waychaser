import webdriver from 'selenium-webdriver';
// eslint-disable-next-line no-unused-vars
import logger from '../../util/logger';
import { WaychaserViaWebdriver } from './waychaser-via-webdriver';
import SauceLabs from 'saucelabs';
import dateFormat from 'dateformat';
import moment from 'moment-timezone';

const username = process.env.SAUCE_LABS_USERNAME,
  accessKey = process.env.SAUCE_LABS_KEY,
  tags = [process.env.npm_package_name, process.env.npm_package_version];

const RUN =
  dateFormat(new Date(), "yyyy-MM-dd'T'hh:mm:ss.l ") +
  moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).zoneAbbr();

class WaychaserViaWebdriverSaucy extends WaychaserViaWebdriver {
  async startTunnel() {
    this.myAccount = new SauceLabs({ user: username, key: accessKey });
    this.tunnel = await this.myAccount.startSauceConnect({
      logger: (stdout) => logger.saucy(stdout),
      /**
       * see all available parameters here: https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy+Command-Line+Quick+Reference+Guide
       * all parameters have to be applied camel cased instead of with hyphens, e.g.
       * to apply the `--tunnel-identifier` parameter, set:
       */
      tunnelIdentifier: process.env.GITHUB_RUN_ID || RUN,
    });
  }

  async getBrowser(name) {
    if (this.tunnel == undefined) {
      await this.startTunnel();
    }
    this.driver = await new webdriver.Builder()
      .withCapabilities({
        browserName: this.browser,
        platformName: this.platform,
        browserVersion: 'latest',
        'goog:chromeOptions': { w3c: true },
        'sauce:options': {
          tunnelIdentifier: process.env.GITHUB_RUN_ID || RUN,
          username: username,
          accessKey: accessKey,
          build: `${process.env.GITHUB_RUN_ID || 'LOCAL'}-${
            process.env.GITHUB_RUN_NUMBER || RUN
          }`,
          name,
          /* As a best practice, set important test metadata and execution options
          such as build info, tags for reporting, and timeout durations.
          */
          maxDuration: 3600,
          idleTimeout: 1000,
          tags: tags,
        },
      })
      .usingServer('https://ondemand.saucelabs.com/wd/hub')
      .build();

    await this.driver.getSession().then((sessionid) => {
      this.driver.sessionID = sessionid.id_;
      return;
    });
    await this.driver.get(`http://localhost:${process.env.UI_PORT}`);
    await this.loadCoverage();

    return this.driver;
  }
  // ignore, because it only get's executed when there are web driver issues
  /* istanbul ignore next */
  catch(error) {
    {
      logger.error('error getting broswer', error);
      throw error;
    }
  }

  async sendTestResult(result) {
    await this.driver.executeScript(`sauce:job-result=${result}`);
  }

  async setJobName(name) {
    if (this.driver) {
      await this.driver.quit();
      this.deriver = undefined;
    }
    await this.getBrowser(name);
  }

  // ignore, because it only get's executed on test failure
  /* istanbul ignore next */
  async allowDebug() {}

  async quit() {
    await this.tunnel.close();
    await super.quit();
  }
}

const instance = new WaychaserViaWebdriverSaucy();

export { instance as waychaserViaWebdriverSaucy };
