import webdriver from 'selenium-webdriver';
// eslint-disable-next-line no-unused-vars
import logger from '../../util/logger';
import { WaychaserViaWebdriver } from './waychaser-via-webdriver';
import dateFormat from 'dateformat';
import moment from 'moment-timezone';
import browserstack from 'browserstack-local';
import assert from 'assert';

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

class WaychaserViaWebdriverRemote extends WaychaserViaWebdriver {
  async startTunnel() {
    assert(
      process.env.BROWSERSTACK_ACCESS_KEY,
      `process.env.BROWSERSTACK_ACCESS_KEY not set`
    );
    this.tunnel = new browserstack.Local({
      verbose: 'true',
      force: 'true',
      // localIdentifier: BUILD,
    });
    await new Promise((resolve, reject) => {
      this.tunnel.start({}, (error) => {
        /* istanbul ignore if: only get's executed on tunnel setup failure */
        if (error) {
          logger.error('error starting tunnel', error);
          reject(error);
        }
        logger.info('tunnel started');
        resolve();
      });
    });
    logger.info(`Browserstack tunnel started`);
  }

  async getBrowser(name) {
    if (this.tunnel == undefined) {
      await this.startTunnel();
    }
    assert(
      process.env.BROWSERSTACK_USERNAME,
      `process.env.BROWSERSTACK_USERNAME not set`
    );
    assert(
      process.env.BROWSERSTACK_ACCESS_KEY,
      `process.env.BROWSERSTACK_ACCESS_KEY not set`
    );

    var capabilities = {
      'bstack:options': {
        os: 'Any',
        projectName: process.env.npm_package_name,
        buildName: BUILD,
        sessionName: name,
        local: 'true',
        debug: 'true',
        consoleLogs: 'verbose',
        networkLogs: 'true',
        seleniumVersion: '3.14.0',
        userName: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
      },
      browserName: this.browser,
      browserVersion: 'latest',
    };

    this.driver = new webdriver.Builder()
      .usingServer('https://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(capabilities)
      .build();
    await this.driver.manage().setTimeouts({ script: 20000 });
    logger.debug('Getting fake api...');
    await this.driver.get(`http://localhost:${process.env.BROWSER_PORT}/api`);
    logger.debug('...api loaded');
    logger.debug('Getting waychaser test page...');
    await this.driver.get(`http://localhost:${process.env.BROWSER_PORT}`);
    logger.debug('...page loaded');
    await this.driver.wait(() => {
      return this.driver.executeScript(
        /* istanbul ignore next: won't work in browser otherwise */
        function () {
          /* global window */
          return window.waychaser != undefined;
        }
      );
    }, 5000);
    await this.loadCoverage();

    return this.driver;
  }
  /* istanbul ignore next: only get's executed when there are web driver issues */
  catch(error) {
    logger.error('error getting browser', error);
    throw error;
  }

  async getBrowserLogs() {
    // getting logs appears to be only possible wtih chrome
    if (this.browser == 'chrome') {
      super.getBrowserLogs();
    }
  }

  async sendTestResult(status) {
    /* istanbul ignore else: only get's executed on driver setup failure */
    if (this.driver) {
      this.driver.executeScript(
        `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"${status}"}}`
      );
    }
  }

  async setJobName(name) {
    if (this.driver) {
      await this.driver.quit();
      delete this.driver;
    }
    await this.getBrowser(name);
  }

  /* istanbul ignore next: only get's executed on test failure */
  async allowDebug() {}

  async quit() {
    /* istanbul ignore else: only get's executed if the tunnel couldn't be setup */
    if (this.tunnel) {
      await new Promise((resolve) => {
        this.tunnel.stop(resolve);
      });
      delete this.tunnel;
    }
    await super.quit();
  }
}

const instance = new WaychaserViaWebdriverRemote();

export { instance as waychaserViaWebdriverRemote };
