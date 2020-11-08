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
  async beforeAllTests() {
    await this.startTunnel();
    await super.beforeAllTests();
  }

  async beforeTest(scenario) {
    this.driver = await this.buildDriver(scenario.pickle.name);
    await this.loadWaychaserTestPage();

    super.beforeTest(scenario);
  }

  async afterTest(scenario) {
    await super.afterTest(scenario);

    try {
      logger.debug('sending test results...', scenario.result.status);
      await this.sendTestResult(scenario.result.status);
    } catch (error) {
      /* istanbul ignore next: only get's executed on test framework failure */
      logger.error('coverage', error);
    }
    logger.debug('...sent');

    await this.driver.quit();
    delete this.driver;
  }

  async startTunnel() {
    assert(
      process.env.BROWSERSTACK_ACCESS_KEY,
      `process.env.BROWSERSTACK_ACCESS_KEY not set`
    );
    this.tunnel = new browserstack.Local({
      key: process.env.BROWSERSTACK_ACCESS_KEY,
      verbose: true,
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

  async buildDriver(name) {
    try {
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
          ...(process.env.BROWSERSTACK_LOCAL_IDENTIFIER && {
            localIdentifier: process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
          }),
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
      return this.driver;
    } catch (error) {
      /* istanbul ignore next: only get's executed when there are web driver issues */
      {
        logger.error('error getting browser', error);
        throw error;
      }
    }
  }

  async sendTestResult(status) {
    /* istanbul ignore else: only get's executed on driver setup failure */
    if (this.driver) {
      await this.driver.executeScript(
        `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"${status}"}}`
      );
    }
  }

  async afterAllTests() {
    super.afterAllTests();
    /* istanbul ignore else: only get's executed if the tunnel couldn't be setup */
    if (this.tunnel) {
      await new Promise((resolve) => {
        this.tunnel.stop(resolve);
      });
      delete this.tunnel;
    }
  }
}

const instance = new WaychaserViaWebdriverRemote();

export { instance as waychaserViaWebdriverRemote };
