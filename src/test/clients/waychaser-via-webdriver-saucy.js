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

const BUILD = `${
  process.env.GITHUB_RUN_ID ||
  /* istanbul ignore next: only gets executed locally */ 'LOCAL'
}-${
  process.env.GITHUB_RUN_NUMBER ||
  /* istanbul ignore next: only gets executed locally */ RUN
}`;

const TUNNEL_ID = `${BUILD}-${RUN}`;

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
      tunnelIdentifier: TUNNEL_ID,
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
          tunnelIdentifier: TUNNEL_ID,
          username: username,
          accessKey: accessKey,
          build: BUILD,
          name,
          extendedDebugging: true,
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
  /* istanbul ignore next: only get's executed when there are web driver issues */
  catch(error) {
    logger.error('error getting browser', error);
    throw error;
  }

  async getBrowserLogs() {
    // getting logs is not possible wtih safari
    // https://stackoverflow.com/questions/46272218/unable-to-console-logs-from-safari-using-selenium-webdriver-python
    if (this.browser != 'safari' && this.browser != 'firefox') {
      super.getBrowserLogs();
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

  /* istanbul ignore next: only get's executed on test failure */
  async allowDebug() {}

  async quit() {
    await this.tunnel.close();
    await super.quit();
  }
}

const instance = new WaychaserViaWebdriverSaucy();

export { instance as waychaserViaWebdriverSaucy };
